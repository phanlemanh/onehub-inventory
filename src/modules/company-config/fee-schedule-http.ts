// Fees and taxes over HTTP (row 19, thue-phi): GET reads the company's schedule, PUT saves it whole. Each handler names
// its action of the permission table and opens the identity module's shared door first (decision 0026); a door that
// does not open answers before any data is touched. A wrong schedule answers 400 naming every wrong item.
import { z } from "zod";

import type { ActionName } from "@/modules/identity";
import type { DoorError } from "@/modules/identity/server";

import type { CompanyLayerDeps } from "./company-layer-http";
import { readFeeSchedule, saveFeeSchedule } from "./fee-store";
import type { RunAs } from "./store";

const status = (code: DoorError | "bad-request" | "invalid-schedule"): number =>
  code === "unauthenticated"
    ? 401
    : code === "forbidden"
      ? 403
      : code === "server-error"
        ? 500
        : 400;

const Item = z
  .object({
    code: z.string().max(32).optional(),
    name: z.string().max(200).optional(),
    rateBasisPoints: z.number().int(),
    included: z.boolean(),
  })
  .strict();
const Body = z.object({ items: z.array(Item).max(20) }).strict();

export interface FeeScheduleHandlers {
  read(req: Request): Promise<Response>;
  save(req: Request): Promise<Response>;
}

export function createFeeScheduleHandlers(deps: CompanyLayerDeps): FeeScheduleHandlers {
  async function guarded(
    req: Request,
    action: ActionName,
    fn: (run: RunAs, userId: string) => Promise<Response>,
  ): Promise<Response> {
    try {
      const door = await deps.door(req, action);
      if (typeof door === "string") return Response.json({ error: door }, { status: status(door) });
      const run: RunAs = (f) => deps.withCompany(door.pool, door.ctx, f);
      return await fn(run, door.ctx.userId);
    } catch (err) {
      console.error("[thue-phi] lỗi máy chủ:", err instanceof Error ? err.message : "không rõ");
      return Response.json({ error: "server-error" }, { status: 500 });
    }
  }

  return {
    read: (req) =>
      guarded(req, "readFeeSchedule", async (run) => Response.json(await readFeeSchedule(run))),

    save: (req) =>
      guarded(req, "setFeeSchedule", async (run, userId) => {
        let parsed: z.infer<typeof Body> | null = null;
        try {
          const r = Body.safeParse(await req.json());
          parsed = r.success ? r.data : null;
        } catch {
          parsed = null;
        }
        if (!parsed) return Response.json({ error: "bad-request" }, { status: 400 });
        const items = parsed.items.map((i) => ({
          ...(i.code !== undefined ? { code: i.code } : {}),
          ...(i.name !== undefined ? { name: i.name } : {}),
          rateBasisPoints: i.rateBasisPoints,
          included: i.included,
        }));
        const result = await saveFeeSchedule(run, userId, items);
        if (!result.ok) {
          return Response.json(
            {
              error: "invalid-schedule",
              problems: result.problems.map((p) =>
                p.index === undefined ? p : { ...p, code: parsed!.items[p.index]?.code ?? null },
              ),
            },
            { status: 400 },
          );
        }
        return Response.json(result.schedule);
      }),
  };
}
