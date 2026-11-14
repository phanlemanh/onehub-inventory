// The company layer over HTTP without a database (row 7e): the store is replaced, so these cases pin what the
// handlers own — the action each one opens, the part names, body shapes and the error codes. The database cases
// with real rows and real permissions live in tests/db/lop-rieng.db.test.ts and tests/db/bang-quyen-api.db.test.ts.
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ActionName } from "@/modules/identity";
import type { DoorError, OpenedDoor } from "@/modules/identity/server";

const store = vi.hoisted(() => ({
  readLayer: vi.fn(),
  addLabel: vi.fn(),
  editLabel: vi.fn(),
  addField: vi.fn(),
  editField: vi.fn(),
  addAlias: vi.fn(),
  editAlias: vi.fn(),
  addPendingUnit: vi.fn(),
  saveTemplate: vi.fn(),
  renameTemplate: vi.fn(),
  retireItem: vi.fn(),
  matchPendingUnits: vi.fn(),
}));

vi.mock("./store", () => ({
  LAYER_PARTS: ["labels", "fields", "aliases", "pending-units", "templates"],
  ...store,
}));

import { createCompanyLayerHandlers } from "./company-layer-http";

const OPEN: OpenedDoor = {
  pool: {} as OpenedDoor["pool"],
  ctx: { userId: "u1", companyId: "c1" },
  scope: "company",
};

function make(door: OpenedDoor | DoorError = OPEN) {
  const opened: ActionName[] = [];
  const handlers = createCompanyLayerHandlers({
    door: async (_req, action) => {
      opened.push(action);
      return door;
    },
    withCompany: async (_pool, _ctx, fn) => fn({} as never),
  });
  return { handlers, opened };
}

const req = (body?: unknown) =>
  new Request("http://x/api/v1/company-layer", {
    method: "POST",
    ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }),
  });

const ok = { ok: true, id: "id-1" };

beforeEach(() => {
  for (const f of Object.values(store)) f.mockReset();
});

describe("cua-mo-truoc", () => {
  it("each handler opens its own action of the permission table", async () => {
    const { handlers, opened } = make();
    store.readLayer.mockResolvedValue({});
    store.retireItem.mockResolvedValue(ok);
    store.matchPendingUnits.mockResolvedValue({ matched: 0 });
    store.editLabel.mockResolvedValue(ok);
    store.addLabel.mockResolvedValue(ok);
    await handlers.read(req());
    await handlers.add(req({ concept: "Building", label: "Block" }), "labels");
    await handlers.edit(req({ label: "Khối" }), "labels", "l1");
    await handlers.retire(req(), "labels", "l1");
    await handlers.match(req());
    expect(opened).toEqual([
      "readCompanyLayer",
      "addCompanyLayer",
      "editCompanyLayer",
      "retireCompanyLayer",
      "matchPendingUnits",
    ]);
  });

  it("a door that does not open answers before the store is touched", async () => {
    for (const [code, status] of [
      ["unauthenticated", 401],
      ["forbidden", 403],
      ["server-error", 500],
    ] as const) {
      const { handlers } = make(code);
      const res = await handlers.add(req({ concept: "Building", label: "Block" }), "labels");
      expect(res.status).toBe(status);
      expect(await res.json()).toEqual({ error: code });
    }
    expect(store.addLabel).not.toHaveBeenCalled();
  });

  it("a thrown store error is a fixed server-error, never the message", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    store.readLayer.mockRejectedValue(new Error("password=secret"));
    const res = await make().handlers.read(req());
    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain("secret");
    log.mockRestore();
  });
});

describe("than-yeu-cau", () => {
  it("adds go to the store of their part and answer 201 with the id", async () => {
    const { handlers } = make();
    store.addField.mockResolvedValue(ok);
    store.addAlias.mockResolvedValue(ok);
    store.addPendingUnit.mockResolvedValue(ok);
    store.saveTemplate.mockResolvedValue(ok);
    const cases: [string, unknown][] = [
      ["fields", { name: "Hoa hồng", kind: "number" }],
      ["aliases", { field: "Unit.directionFaces", raw: "ĐN", value: "Đông Nam" }],
      ["pending-units", { rawCode: "A-12-03", buildingText: "A" }],
      ["templates", { name: "Sheet tuần", headers: ["Mã"], columns: [{ skip: true }] }],
    ];
    for (const [part, body] of cases) {
      const res = await handlers.add(req(body), part);
      expect(res.status, part).toBe(201);
      expect(await res.json()).toEqual({ id: "id-1" });
    }
    expect(store.addField.mock.calls[0]![1]).toEqual({
      name: "Hoa hồng",
      kind: "number",
      options: [],
    });
    expect(store.addField.mock.calls[0]![2]).toHaveLength(8);
    expect(store.addPendingUnit.mock.calls[0]![1]).toEqual({
      rawCode: "A-12-03",
      buildingText: "A",
    });
  });

  it("a body of the wrong shape is bad-request and the store is not called", async () => {
    const { handlers } = make();
    for (const part of ["labels", "fields", "aliases", "pending-units", "templates"]) {
      const res = await handlers.add(req({ extra: 1 }), part);
      expect(res.status, part).toBe(400);
      expect(await res.json()).toEqual({ error: "bad-request" });
    }
    const notJson = await handlers.add(req("{"), "labels");
    expect(notJson.status).toBe(400);
    expect(store.addLabel).not.toHaveBeenCalled();
  });

  it("an unknown part is not-found", async () => {
    const { handlers } = make();
    expect((await handlers.add(req({}), "formulas")).status).toBe(404);
    expect((await handlers.edit(req({}), "pending-units", "p1")).status).toBe(404);
    expect((await handlers.retire(req(), "objects", "x")).status).toBe(404);
  });

  it("edits answer 200, and a refused write keeps its own problem code", async () => {
    const { handlers } = make();
    store.editField.mockResolvedValue({ ok: false, problem: "kind-fixed" });
    store.editAlias.mockResolvedValue(ok);
    store.renameTemplate.mockResolvedValue({ ok: false, problem: "not-found" });
    const kind = await handlers.edit(req({ kind: "date" }), "fields", "f1");
    expect(kind.status).toBe(400);
    expect(await kind.json()).toEqual({ error: "kind-fixed" });
    expect(store.editField.mock.calls[0]![2]).toEqual({ kind: "date" });
    expect((await handlers.edit(req({ value: "Bắc" }), "aliases", "a1")).status).toBe(200);
    expect((await handlers.edit(req({ name: "Mới" }), "templates", "t1")).status).toBe(404);
    for (const part of ["labels", "fields", "aliases", "templates"]) {
      expect((await handlers.edit(req({ nope: true }), part, "x")).status, part).toBe(400);
    }
  });

  it("retire names the part and the id; nothing is deleted", async () => {
    const { handlers } = make();
    store.retireItem.mockResolvedValue(ok);
    const res = await handlers.retire(req(), "pending-units", "p9");
    expect(res.status).toBe(200);
    expect(store.retireItem.mock.calls[0]!.slice(1)).toEqual(["pending-units", "p9"]);
  });
});
