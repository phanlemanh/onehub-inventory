// The company layer's store without a database (row 7e): a scripted connection stands in for Postgres, so these cases
// pin what the store decides before and after the database — refusals that never reach it, how a database refusal
// becomes the layer's own problem, and «not found» when no row in use was changed. Real rows, the 20-field cap under
// two writers and the company isolation are in tests/db/lop-rieng.db.test.ts.
import { describe, expect, it } from "vitest";

import type { DbClient } from "@/modules/identity/server";

import {
  addAlias,
  addLabel,
  addPendingUnit,
  editLabel,
  renameTemplate,
  retireItem,
  saveTemplate,
  type RunAs,
} from "./store";

type Answer = { rows?: unknown[]; rowCount?: number } | Error;

/** A connection that answers queries in order, and remembers whether it was asked at all. */
function scripted(...answers: Answer[]) {
  const asked: string[] = [];
  const client = {
    async query(text: string) {
      asked.push(text);
      const a = answers.shift() ?? { rows: [], rowCount: 0 };
      if (a instanceof Error) throw a;
      return { rows: a.rows ?? [], rowCount: a.rowCount ?? a.rows?.length ?? 0 };
    },
  } as unknown as DbClient;
  const run: RunAs = (fn) => fn(client);
  return { run, asked };
}

const pgError = (code: string, message = "") => Object.assign(new Error(message), { code });

describe("tu-choi-truoc-co-so-du-lieu", () => {
  it("refuses an unknown concept, empty or long words, and a bad code without a query", async () => {
    const { run, asked } = scripted();
    expect(await addLabel(run, { concept: "Formula", label: "X" })).toEqual({
      ok: false,
      problem: "concept-unknown",
    });
    expect(await addLabel(run, { concept: "Building", label: "   " })).toEqual({
      ok: false,
      problem: "label-empty",
    });
    expect(await editLabel(run, "l1", { label: "x".repeat(41) })).toEqual({
      ok: false,
      problem: "label-too-long",
    });
    expect(await addAlias(run, { field: "Unit.directionFaces", raw: " ", value: "Bắc" })).toEqual({
      ok: false,
      problem: "raw-empty",
    });
    expect(
      await addAlias(run, { field: "Unit.directionFaces", raw: "x".repeat(41), value: "Bắc" }),
    ).toEqual({ ok: false, problem: "raw-too-long" });
    expect(await addPendingUnit(run, { rawCode: "  " })).toEqual({
      ok: false,
      problem: "code-empty",
    });
    expect(await addPendingUnit(run, { rawCode: "A".repeat(81) })).toEqual({
      ok: false,
      problem: "code-too-long",
    });
    expect(
      await saveTemplate(run, { name: "", headers: ["Mã"], columns: [{ skip: true }] }),
    ).toEqual({ ok: false, problem: "label-empty" });
    expect(
      await saveTemplate(run, { name: "x".repeat(61), headers: ["Mã"], columns: [{ skip: true }] }),
    ).toEqual({ ok: false, problem: "label-too-long" });
    expect(await saveTemplate(run, { name: "Tuần", headers: ["Mã", "Giá"], columns: [] })).toEqual({
      ok: false,
      problem: "columns-mismatch",
    });
    expect(await renameTemplate(run, "t1", { name: " " })).toEqual({
      ok: false,
      problem: "label-empty",
    });
    expect(await renameTemplate(run, "t1", { name: "x".repeat(61) })).toEqual({
      ok: false,
      problem: "label-too-long",
    });
    expect(asked).toEqual([]);
  });
});

describe("tu-choi-cua-co-so-du-lieu", () => {
  it("a unique clash is «taken», a missing catalog unit «target-unknown»; other errors are thrown", async () => {
    expect(
      await addLabel(scripted(pgError("23505")).run, { concept: "Building", label: "Block" }),
    ).toEqual({ ok: false, problem: "taken" });
    expect(await addPendingUnit(scripted(pgError("23503")).run, { rawCode: "A-1" })).toEqual({
      ok: false,
      problem: "target-unknown",
    });
    await expect(
      addLabel(scripted(pgError("57014", "canceled")).run, { concept: "Building", label: "Block" }),
    ).rejects.toThrow("canceled");
  });

  it("a written row answers with its id; a change that touched no row in use is «not-found»", async () => {
    expect(
      await addLabel(scripted({ rows: [{ id: "l1" }] }).run, {
        concept: "Building",
        label: " Block ",
      }),
    ).toEqual({ ok: true, id: "l1" });
    expect(
      await addPendingUnit(scripted({ rows: [{ id: "p1" }] }).run, {
        rawCode: "A-12-03",
        unitText: " ",
      }),
    ).toEqual({ ok: true, id: "p1" });
    expect(await editLabel(scripted({ rowCount: 1 }).run, "l1", { label: "Khối" })).toEqual({
      ok: true,
      id: "l1",
    });
    expect(await editLabel(scripted({ rowCount: 0 }).run, "l1", { label: "Khối" })).toEqual({
      ok: false,
      problem: "not-found",
    });
    expect(await renameTemplate(scripted({ rowCount: 0 }).run, "t1", { name: "Mới" })).toEqual({
      ok: false,
      problem: "not-found",
    });
    expect(await retireItem(scripted({ rowCount: 1 }).run, "aliases", "a1")).toEqual({
      ok: true,
      id: "a1",
    });
    expect(await retireItem(scripted({ rowCount: 0 }).run, "templates", "t9")).toEqual({
      ok: false,
      problem: "not-found",
    });
  });

  it("retire only stops using a row: every part's statement is an update, never a delete", async () => {
    for (const part of ["labels", "fields", "aliases", "pending-units", "templates"] as const) {
      const { run, asked } = scripted({ rowCount: 1 });
      await retireItem(run, part, "x");
      expect(asked[0], part).toMatch(/^\s*update\b/i);
      expect(asked[0], part).toMatch(/retired_at\s*=\s*now\(\)/i);
    }
  });
});
