// The company layer over HTTP (row 7e, lop-rieng-cua-san): plain Request in, Response out, so the route files stay
// one line and tests call these directly. Every handler names its action of the permission table and opens the
// identity module's shared door first (decision 0026); a door that does not open answers before any data is touched.
// Error bodies are fixed codes. Nothing is deleted: «retire» stops using a row.
import { z } from "zod";

import type { ActionName } from "@/modules/identity";
import type { DbClient, DbPool, DoorError, OpenedDoor } from "@/modules/identity/server";

import { label } from "./index";
import { FIELD_KINDS, type FieldKind } from "./rules";
import {
  LAYER_PARTS,
  addAlias,
  addField,
  addLabel,
  addPendingUnit,
  editAlias,
  editField,
  editLabel,
  matchPendingUnits,
  readLayer,
  renameTemplate,
  retireItem,
  saveTemplate,
  type LayerPart,
  type LayerProblem,
  type RunAs,
  type Write,
} from "./store";

export type CompanyLayerErrorCode = DoorError | LayerProblem | "bad-request";

const status = (code: CompanyLayerErrorCode): number =>
  code === "unauthenticated"
    ? 401
    : code === "forbidden"
      ? 403
      : code === "not-found"
        ? 404
        : code === "server-error"
          ? 500
          : 400;

function error(code: CompanyLayerErrorCode): Response {
  return Response.json({ error: code }, { status: status(code) });
}

/** The inventory's standard headers: a custom field never takes one of these names. */
const STANDARD_HEADERS = () =>
  (
    [
      "Unit",
      "Building",
      "Subdivision",
      "StandardStatus",
      "ListPrice",
      "LivingArea",
      "BedroomsTotal",
      "LastConfirmedAt",
    ] as const
  ).map((c) => label(c));

const Kind = z.enum(FIELD_KINDS as [FieldKind, ...FieldKind[]]);
const Target = z.union([
  z.object({ standard: z.string() }).strict(),
  z.object({ custom: z.string() }).strict(),
  z.object({ skip: z.literal(true) }).strict(),
]);
const ADD = {
  labels: z.object({ concept: z.string(), label: z.string() }).strict(),
  fields: z
    .object({
      name: z.string(),
      kind: z.string(),
      options: z.array(z.string()).max(100).default([]),
    })
    .strict(),
  aliases: z.object({ field: z.string(), raw: z.string(), value: z.string() }).strict(),
  "pending-units": z
    .object({
      rawCode: z.string(),
      buildingText: z.string().optional(),
      unitText: z.string().optional(),
    })
    .strict(),
  templates: z
    .object({
      name: z.string(),
      headers: z.array(z.string()).max(200),
      columns: z.array(Target).max(200),
    })
    .strict(),
} as const;
const EDIT = {
  labels: z.object({ label: z.string() }).strict(),
  fields: z
    .object({
      name: z.string().optional(),
      options: z.array(z.string()).max(100).optional(),
      kind: Kind.optional(),
    })
    .strict(),
  aliases: z.object({ value: z.string() }).strict(),
  templates: z.object({ name: z.string() }).strict(),
} as const;

async function body<T>(req: Request, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const parsed = schema.safeParse(await req.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const isPart = (p: string): p is LayerPart => (LAYER_PARTS as readonly string[]).includes(p);

function written(r: Write, created = false): Response {
  if (!r.ok) return error(r.problem);
  return Response.json({ id: r.id }, { status: created ? 201 : 200 });
}

/** What the handlers need from the identity module: its shared door and its query door. */
export interface CompanyLayerDeps {
  door(req: Request, action: ActionName): Promise<OpenedDoor | DoorError>;
  withCompany<T>(
    pool: DbPool,
    ctx: { userId: string; companyId: string },
    fn: (client: DbClient) => Promise<T>,
  ): Promise<T>;
}

export interface CompanyLayerHandlers {
  read(req: Request): Promise<Response>;
  add(req: Request, part: string): Promise<Response>;
  edit(req: Request, part: string, id: string): Promise<Response>;
  retire(req: Request, part: string, id: string): Promise<Response>;
  match(req: Request): Promise<Response>;
}

export function createCompanyLayerHandlers(deps: CompanyLayerDeps): CompanyLayerHandlers {
  async function guarded(
    req: Request,
    action: ActionName,
    fn: (run: RunAs) => Promise<Response>,
  ): Promise<Response> {
    try {
      const door = await deps.door(req, action);
      if (typeof door === "string") return error(door);
      const run: RunAs = (f) => deps.withCompany(door.pool, door.ctx, f);
      return await fn(run);
    } catch (err) {
      console.error("[lop-rieng] lỗi máy chủ:", err instanceof Error ? err.message : "không rõ");
      return error("server-error");
    }
  }

  return {
    read: (req) =>
      guarded(req, "readCompanyLayer", async (run) => Response.json(await readLayer(run))),

    add: (req, part) =>
      guarded(req, "addCompanyLayer", async (run) => {
        if (!isPart(part)) return error("not-found");
        switch (part) {
          case "labels": {
            const b = await body(req, ADD.labels);
            return b ? written(await addLabel(run, b), true) : error("bad-request");
          }
          case "fields": {
            const b = await body(req, ADD.fields);
            if (!b) return error("bad-request");
            return written(
              await addField(
                run,
                { name: b.name, kind: b.kind as FieldKind, options: b.options },
                STANDARD_HEADERS(),
              ),
              true,
            );
          }
          case "aliases": {
            const b = await body(req, ADD.aliases);
            return b ? written(await addAlias(run, b), true) : error("bad-request");
          }
          case "pending-units": {
            const b = await body(req, ADD["pending-units"]);
            if (!b) return error("bad-request");
            return written(
              await addPendingUnit(run, {
                rawCode: b.rawCode,
                ...(b.buildingText !== undefined ? { buildingText: b.buildingText } : {}),
                ...(b.unitText !== undefined ? { unitText: b.unitText } : {}),
              }),
              true,
            );
          }
          case "templates": {
            const b = await body(req, ADD.templates);
            return b ? written(await saveTemplate(run, b), true) : error("bad-request");
          }
        }
      }),

    edit: (req, part, id) =>
      guarded(req, "editCompanyLayer", async (run) => {
        switch (part) {
          case "labels": {
            const b = await body(req, EDIT.labels);
            return b ? written(await editLabel(run, id, b)) : error("bad-request");
          }
          case "fields": {
            const b = await body(req, EDIT.fields);
            if (!b) return error("bad-request");
            return written(
              await editField(
                run,
                id,
                {
                  ...(b.name !== undefined ? { name: b.name } : {}),
                  ...(b.options !== undefined ? { options: b.options } : {}),
                  ...(b.kind !== undefined ? { kind: b.kind } : {}),
                },
                STANDARD_HEADERS(),
              ),
            );
          }
          case "aliases": {
            const b = await body(req, EDIT.aliases);
            return b ? written(await editAlias(run, id, b)) : error("bad-request");
          }
          case "templates": {
            const b = await body(req, EDIT.templates);
            return b ? written(await renameTemplate(run, id, b)) : error("bad-request");
          }
          default:
            return error("not-found");
        }
      }),

    retire: (req, part, id) =>
      guarded(req, "retireCompanyLayer", async (run) =>
        isPart(part) ? written(await retireItem(run, part, id)) : error("not-found"),
      ),

    match: (req) =>
      guarded(req, "matchPendingUnits", async (run) => Response.json(await matchPendingUnits(run))),
  };
}
