// The import over HTTP (row 11, nhap-excel): plain Request in, Response out, so route files stay one line and tests call
// these directly. Each handler names its action of the permission table and opens the identity module's shared door
// before touching data (decision 0026). Error bodies are fixed codes; nothing about the file is logged.
import { z } from "zod";

import type { ActionName } from "@/modules/identity";
import type { DbClient, DbPool, DoorError, OpenedDoor } from "@/modules/identity/server";

import type { Choices } from "./mark";
import {
  BATCH_ROWS,
  openImport,
  previewImport,
  listAgents,
  recentImports,
  undoImport,
  writeBatch,
} from "./store";
import { STANDARD_TARGETS } from "./targets";

export interface ImportsDeps {
  door(req: Request, action: ActionName): Promise<OpenedDoor | DoorError>;
  withCompany<T>(
    pool: DbPool,
    ctx: { userId: string; companyId: string },
    fn: (c: DbClient) => Promise<T>,
  ): Promise<T>;
}

export interface ImportsHandlers {
  preview(req: Request): Promise<Response>;
  open(req: Request): Promise<Response>;
  batch(req: Request, id: string): Promise<Response>;
  undo(req: Request, id: string): Promise<Response>;
  recent(req: Request): Promise<Response>;
  /** The list agents a team lead imports for (Hỏi-7); empty for a role that imports only for itself. */
  agents(req: Request): Promise<Response>;
}

type Code =
  | DoorError
  | "bad-request"
  | "not-found"
  | "blocked-cells"
  | "counts-changed"
  | "table-changed"
  | "bad-agent"
  | "closed"
  | "already-undone";
const STATUS: Record<Code, number> = {
  unauthenticated: 401,
  forbidden: 403,
  "server-error": 500,
  "bad-request": 400,
  "not-found": 404,
  "blocked-cells": 400,
  "bad-agent": 400,
  "counts-changed": 409,
  "table-changed": 409,
  closed: 409,
  "already-undone": 409,
};
const error = (code: Code) => Response.json({ error: code }, { status: STATUS[code] });

const Cell = z.string().max(2000);
const Table = {
  headers: z.array(z.string().max(200)).min(1).max(500),
  rows: z.array(z.array(Cell).max(500)).max(5000),
};
const Target = z.union([
  z.object({ standard: z.enum(STANDARD_TARGETS) }).strict(),
  z.object({ custom: z.string().max(40) }).strict(),
  z
    .object({
      newField: z
        .object({
          name: z.string().max(40),
          kind: z.enum(["text", "number", "date", "single_select", "boolean"]),
          options: z.array(z.string().max(40)).max(30),
        })
        .strict(),
    })
    .strict(),
  z.object({ skip: z.literal(true) }).strict(),
]);
const ChoicesSchema = z
  .object({
    columns: z
      .record(z.string(), z.object({ target: Target, learnLabel: z.boolean().optional() }).strict())
      .default({}),
    values: z
      .record(
        z.string(),
        z.object({ value: z.string().max(80).nullable(), remember: z.boolean() }).strict(),
      )
      .default({}),
    units: z
      .record(
        z.string(),
        z.union([
          z.object({ unitKey: z.string(), remember: z.boolean() }).strict(),
          z.object({ pending: z.literal(true) }).strict(),
          z.object({ skipRow: z.literal(true) }).strict(),
        ]),
      )
      .default({}),
    skipRows: z.array(z.number().int().min(0)).max(5000).optional(),
  })
  .strict();
const PREVIEW = z.object({ ...Table, choices: ChoicesSchema }).strict();
const OPEN = z
  .object({
    ...Table,
    choices: ChoicesSchema,
    fileName: z.string().min(1).max(200),
    sheetName: z.string().max(200).nullable(),
    listAgentUserId: z.string().uuid().optional(),
    expected: z
      .object({
        keep: z.number(),
        fixed: z.number(),
        ask: z.number(),
        block: z.number(),
        createCount: z.number(),
      })
      .strict(),
  })
  .strict();
const BATCH = z
  .object({
    headers: Table.headers,
    rows: z.array(z.array(Cell).max(500)).max(BATCH_ROWS),
    choices: ChoicesSchema,
    batchNo: z.number().int().min(0),
    rowOffset: z.number().int().min(0),
    last: z.boolean(),
    allNewFieldCells: z.record(z.string(), Cell).optional(),
  })
  .strict();

async function body<T>(req: Request, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const r = schema.safeParse(await req.json());
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

const choicesOf = (c: z.infer<typeof ChoicesSchema>): Choices => ({
  columns: Object.fromEntries(
    Object.entries(c.columns).map(([k, v]) => [Number(k), v]),
  ) as Choices["columns"],
  values: c.values,
  units: c.units,
  ...(c.skipRows ? { skipRows: c.skipRows } : {}),
});

export function createImportsHandlers(deps: ImportsDeps): ImportsHandlers {
  async function guarded(
    req: Request,
    action: ActionName,
    fn: (door: OpenedDoor, c: DbClient) => Promise<Response>,
  ) {
    try {
      const door = await deps.door(req, action);
      if (typeof door === "string") return error(door);
      return await deps.withCompany(door.pool, door.ctx, (c) => fn(door, c));
    } catch (err) {
      console.error("[nhap-excel] lỗi máy chủ:", err instanceof Error ? err.name : "không rõ");
      return error("server-error");
    }
  }
  return {
    preview: (req) =>
      guarded(req, "importListings", async (_d, c) => {
        const b = await body(req, PREVIEW);
        return b
          ? Response.json(await previewImport(c, b, choicesOf(b.choices)))
          : error("bad-request");
      }),
    open: (req) =>
      guarded(req, "importListings", async (door, c) => {
        const b = await body(req, OPEN);
        if (!b) return error("bad-request");
        const agent = b.listAgentUserId ?? door.ctx.userId;
        if (door.scope === "own" && agent !== door.ctx.userId) return error("forbidden");
        const r = await openImport(
          c,
          { ...b, choices: choicesOf(b.choices) },
          { importedBy: door.ctx.userId, listAgentUserId: agent },
        );
        return r.ok ? Response.json({ id: r.id }, { status: 201 }) : error(r.problem);
      }),
    batch: (req, id) =>
      guarded(req, "continueImport", async (_d, c) => {
        const b = await body(req, BATCH);
        if (!b) return error("bad-request");
        const r = await writeBatch(c, id, {
          ...b,
          choices: choicesOf(b.choices),
          ...(b.allNewFieldCells ? { allNewFieldCells: b.allNewFieldCells } : {}),
        });
        return r.ok ? Response.json(r) : error(r.problem);
      }),
    undo: (req, id) =>
      guarded(req, "undoImport", async (door, c) => {
        const r = await undoImport(c, id, door.ctx.userId);
        return r.ok ? Response.json(r) : error(r.problem);
      }),
    recent: (req) =>
      guarded(req, "viewImports", async (_d, c) => Response.json(await recentImports(c))),
    agents: (req) =>
      guarded(req, "importListings", async (door, c) =>
        Response.json(door.scope === "company" ? await listAgents(c) : []),
      ),
  };
}
