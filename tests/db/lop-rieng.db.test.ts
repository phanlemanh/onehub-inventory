// Row 7e (lop-rieng-cua-san), evals E1, E2, E4, E5, E6 at the store and in the database: the company layer through the
// identity module's door, withCompany, under the API role, on this lane's Postgres. Company A holds the people of the
// permission-table world (LA, BA, TL, CA); Y is CompanyAdmin of B. Each block has its break case with a pinned line.
import { afterEach, describe, expect, it } from "vitest";

import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import { sampleCatalog } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import {
  addAlias,
  addField,
  addLabel,
  addPendingUnit,
  editField,
  findTemplate,
  lookupInCompany,
  matchPendingUnits,
  readLayer,
  resolveSpelling,
  retireItem,
  saveTemplate,
  type RunAs,
} from "@/modules/company-config/store";
import { createCompanyLayerHandlers } from "@/modules/company-config/company-layer-http";
import { openDoor } from "@/modules/identity/action-door";
import { createAuthHandlers, tokenFrom } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import type { ActionName } from "@/modules/identity/permissions";
import { captureSender } from "@/modules/identity/sender";
import { withCompany } from "@/modules/identity/with-company";

import { dropWorld, world, type Person, type World } from "./bang-quyen-world";

const worlds: World[] = [];
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

async function layerWorld(suffix: string): Promise<World> {
  const w = await world(`lop_rieng_${suffix}`);
  worlds.push(w);
  for (const s of catalogLoadStatements(sampleCatalog())) await w.db.owner.query(s.text, s.values);
  return w;
}

/** A committing transaction as one person of a company, through the door. */
const runAs =
  (w: World, who: Person, company: string): RunAs =>
  (fn) =>
    withCompany(w.pool, { userId: w.id[who], companyId: company }, fn);

const HEADERS = (
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

describe("labels (E1)", () => {
  it("stores, reads and retires a company label; refuses the six bad ones", async () => {
    const w = await layerWorld("nhan");
    const a = runAs(w, "CA", w.A);
    const added = await addLabel(a, { concept: "Building", label: "Block" });
    expect(added.ok).toBe(true);
    const { rows } = await w.db.owner.query("select company_id, label from company_labels");
    expect(rows).toEqual([{ company_id: w.A, label: "Block" }]);
    expect((await readLayer(a)).labels.map((l) => [l.concept, l.label])).toEqual([
      ["Building", "Block"],
    ]);

    const BAD: [{ concept: string; label: string }, string][] = [
      [{ concept: "Khong-co", label: "X" }, "concept-unknown"],
      [{ concept: "Inventory", label: "X" }, "concept-unknown"],
      [{ concept: "Unit", label: "" }, "label-empty"],
      [{ concept: "Unit", label: "a".repeat(41) }, "label-too-long"],
      [{ concept: "Unit", label: "   " }, "label-empty"],
      [{ concept: "Building", label: "Lô" }, "taken"],
    ];
    expect(BAD).toHaveLength(6);
    for (const [input, problem] of BAD)
      expect(await addLabel(a, input), input.label).toEqual({ ok: false, problem });
    expect(
      Number((await w.db.owner.query("select count(*) from company_labels")).rows[0].count),
    ).toBe(1);

    if (!added.ok) throw new Error("no label");
    expect(await retireItem(a, "labels", added.id)).toEqual({ ok: true, id: added.id });
    expect((await readLayer(a)).labels).toEqual([]);
  });

  it("break: the database alone takes a surface concept, so the store's rule is what refuses it", async () => {
    const w = await layerWorld("nhan_pha");
    await w.db.owner.query(
      "insert into company_labels (company_id, concept, label) values ($1, 'Inventory', 'Kho')",
      [w.A],
    );
    const stored = (await w.db.owner.query("select concept from company_labels")).rows.map(
      (r) => r.concept,
    );
    expect(stored, "label accepted for non-field concept: Inventory").toEqual(["Inventory"]);
  });
});

describe("custom fields (E2, Review Focus 1)", () => {
  it("takes five kinds, both option bounds, and refuses the bad drafts", async () => {
    const w = await layerWorld("truong");
    const a = runAs(w, "LA", w.A);
    const KINDS = ["text", "number", "date", "single_select", "boolean"] as const;
    expect(KINDS).toHaveLength(5);
    for (const kind of KINDS) {
      const r = await addField(
        a,
        { name: `Trường ${kind}`, kind, options: kind === "single_select" ? ["Biển"] : [] },
        HEADERS,
      );
      expect(r.ok, kind).toBe(true);
    }
    const thirty = Array.from({ length: 30 }, (_, i) => `L${i}`);
    expect(
      (await addField(a, { name: "Ba mươi", kind: "single_select", options: thirty }, HEADERS)).ok,
    ).toBe(true);
    const bad = async (name: string, kind: string, options: string[]) =>
      addField(a, { name, kind: kind as "text", options }, HEADERS);
    expect(await bad("Công thức", "formula", [])).toEqual({ ok: false, problem: "kind-unknown" });
    expect(await bad("Không lựa chọn", "single_select", [])).toEqual({
      ok: false,
      problem: "options-count",
    });
    expect(await bad("Ba mốt", "single_select", [...thirty, "L30"])).toEqual({
      ok: false,
      problem: "options-count",
    });
    expect(await bad("Trùng", "single_select", ["Biển", "bien"])).toEqual({
      ok: false,
      problem: "options-duplicate",
    });
    expect(await bad("Chữ có lựa chọn", "text", ["x"])).toEqual({
      ok: false,
      problem: "options-not-allowed",
    });
    const TAKEN = ["trường TEXT", label("ListPrice"), label("Building").toUpperCase()];
    for (const name of TAKEN)
      expect(await bad(name, "text", []), name).toEqual({ ok: false, problem: "name-taken" });
  });

  it("caps at 20 in use at the door and in the database, even for two writes at once; a retired field frees a place", async () => {
    const w = await layerWorld("tran");
    const a = runAs(w, "CA", w.A);
    for (let i = 0; i < 19; i += 1)
      expect((await addField(a, { name: `T${i}`, kind: "text", options: [] }, HEADERS)).ok).toBe(
        true,
      );
    // Two writes of the 20th and 21st field at the same moment: exactly one wins (the trigger's lock).
    const both = await Promise.all([
      addField(a, { name: "Hai mươi A", kind: "text", options: [] }, HEADERS),
      addField(a, { name: "Hai mươi B", kind: "text", options: [] }, HEADERS),
    ]);
    expect(both.filter((r) => r.ok)).toHaveLength(1);
    expect(both.find((r) => !r.ok)).toEqual({ ok: false, problem: "field-limit" });
    expect(await addField(a, { name: "Hai mốt", kind: "text", options: [] }, HEADERS)).toEqual({
      ok: false,
      problem: "field-limit",
    });
    // Straight into the database under the API role: refused with the trigger's name.
    let message = "";
    try {
      await a((c) =>
        c.query(
          "insert into company_fields (company_id, code, name, kind, position) values (app.current_company_id(), 'thang', 'Thẳng', 'text', 99)",
        ),
      );
    } catch (err) {
      message = String((err as Error).message);
    }
    expect(message).toContain("company_fields_limit");
    // 31 options straight into the database: refused with the constraint's name.
    message = "";
    try {
      await w.db.owner.query(
        "insert into company_fields (company_id, code, name, kind, options, position) values ($1, 'ba_mot', 'Ba mốt', 'single_select', $2::jsonb, 1)",
        [w.B, JSON.stringify(Array.from({ length: 31 }, (_, i) => `L${i}`))],
      );
    } catch (err) {
      message = String((err as Error).message);
    }
    expect(message).toContain("company_fields_options");
    expect((await retireItem(a, "fields", "t0")).ok).toBe(true);
    expect((await addField(a, { name: "Thay chỗ", kind: "text", options: [] }, HEADERS)).ok).toBe(
      true,
    );
  });

  it("never reuses a code and never changes a kind", async () => {
    const w = await layerWorld("ma");
    const a = runAs(w, "CA", w.A);
    const first = await addField(a, { name: "Ghi chú", kind: "text", options: [] }, HEADERS);
    if (!first.ok) throw new Error("no field");
    expect(await retireItem(a, "fields", first.id)).toEqual({ ok: true, id: first.id });
    const again = await addField(a, { name: "Ghi chú", kind: "text", options: [] }, HEADERS);
    if (!again.ok) throw new Error("no second field");
    expect(again.id).not.toBe(first.id);
    expect(await editField(a, again.id, { kind: "number" }, HEADERS)).toEqual({
      ok: false,
      problem: "kind-fixed",
    });
    expect((await editField(a, again.id, { name: "Ghi chú nội bộ" }, HEADERS)).ok).toBe(true);
  });

  it("break: without the trigger the database takes a 21st field", async () => {
    const w = await layerWorld("tran_pha");
    await w.db.owner.query("drop trigger company_fields_guard on company_fields");
    for (let i = 0; i < 21; i += 1)
      await w.db.owner.query(
        "insert into company_fields (company_id, code, name, kind, position) values ($1, $2, $3, 'text', $4)",
        [w.A, `t${i}`, `T${i}`, i],
      );
    const n = Number((await w.db.owner.query("select count(*) from company_fields")).rows[0].count);
    expect(n, "database accepted field 21").toBe(21);
  });
});

describe("value spellings (E4, Review Focus 3)", () => {
  it("resolves the six spellings, refuses values outside the set and fields without one", async () => {
    const w = await layerWorld("tu_dien");
    const a = runAs(w, "TL", w.A);
    const view = await addField(
      a,
      { name: "Hướng view", kind: "single_select", options: ["Biển", "Hồ"] },
      HEADERS,
    );
    if (!view.ok) throw new Error("no field");
    expect(
      (await addAlias(a, { field: "Unit.directionFaces", raw: "ĐN", value: "Đông Nam" })).ok,
    ).toBe(true);
    expect(
      (await addAlias(a, { field: "Listing.standardStatus", raw: "còn", value: "Active" })).ok,
    ).toBe(true);
    expect((await addAlias(a, { field: view.id, raw: "biển", value: "Biển" })).ok).toBe(true);
    const SIX: [string, string, string][] = [
      ["Unit.directionFaces", "ĐN", "Đông Nam"],
      ["Unit.directionFaces", "dn", "Đông Nam"],
      ["Unit.directionFaces", "  Đn ", "Đông Nam"],
      ["Listing.standardStatus", "CÒN", "Active"],
      ["Listing.standardStatus", "con", "Active"],
      [view.id, "BIỂN", "Biển"],
    ];
    expect(SIX).toHaveLength(6);
    for (const [field, raw, value] of SIX)
      expect(await resolveSpelling(a, field, raw), raw).toBe(value);
    expect(
      await addAlias(a, { field: "Unit.directionFaces", raw: "BN", value: "Bắc Nam" }),
    ).toEqual({
      ok: false,
      problem: "value-not-in-set",
    });
    expect(
      await addAlias(a, { field: "Listing.standardStatus", raw: "gấp", value: "Bán gấp" }),
    ).toEqual({
      ok: false,
      problem: "value-not-in-set",
    });
    expect(await addAlias(a, { field: view.id, raw: "núi", value: "Núi" })).toEqual({
      ok: false,
      problem: "value-not-in-set",
    });
    expect(await addAlias(a, { field: "Listing.listPrice", raw: "5 tỷ", value: "5" })).toEqual({
      ok: false,
      problem: "field-no-set",
    });
    expect(
      await addAlias(a, { field: "Unit.directionFaces", raw: "dn", value: "Đông Nam" }),
    ).toEqual({
      ok: false,
      problem: "taken",
    });
    // An option removed from the field: its spelling stops resolving. The field retired: same.
    expect((await editField(a, view.id, { options: ["Hồ"] }, HEADERS)).ok).toBe(true);
    expect(await resolveSpelling(a, view.id, "biển")).toBeNull();
    expect((await retireItem(a, "fields", view.id)).ok).toBe(true);
    expect(await resolveSpelling(a, view.id, "hồ")).toBeNull();
  });

  it("break: a lookup that does not fold misses «ĐN»", async () => {
    const w = await layerWorld("tu_dien_pha");
    const a = runAs(w, "TL", w.A);
    await addAlias(a, { field: "Unit.directionFaces", raw: "dn", value: "Đông Nam" });
    const { rows } = await a((c) =>
      c.query("select value from company_value_aliases where raw_fold = $1", ["ĐN"]),
    );
    expect(rows, "alias not found after folding: ĐN").toEqual([]);
    expect(await resolveSpelling(a, "Unit.directionFaces", "ĐN")).toBe("Đông Nam");
  });
});

describe("pending units (E5, Review Focus 4)", () => {
  it("looks codes up through four sources in order and matches without changing the catalog", async () => {
    const w = await layerWorld("can_cho");
    const a = runAs(w, "LA", w.A);
    const c = sampleCatalog();
    const unit = c.units.find((u) => u.buildingName === "S1.01" && u.unitNumber === "0501")!;
    await w.db.owner.query(
      "insert into company_catalog_aliases (company_id, unit_key, kind, value) values ($1, $2, 'ma', 'X1')",
      [w.A, unit.unitKey],
    );
    expect((await addPendingUnit(a, { rawCode: "X1" })).ok).toBe(true);
    // A code two projects both use: it resolves to two units, so its pending unit keeps waiting.
    for (const [project, n] of [
      ["op1", "0503"],
      ["op2", "0504"],
    ] as const)
      await w.db.owner.query(
        "insert into catalog_aliases (object_key, kind, value, source) values ($1, 'ma_goc', $2, 'MAU')",
        [
          c.units.find((u) => u.buildingName === "S1.01" && u.unitNumber === n)!.unitKey,
          `${project}/DUP-9`,
        ],
      );
    expect((await addPendingUnit(a, { rawCode: "DUP-9" })).ok).toBe(true);
    expect((await addPendingUnit(a, { rawCode: "SA5-12.08" })).ok).toBe(true);
    const ORDER: [string, string][] = [
      ["X1", "company"],
      ["S1.01-0501", "catalog"],
      ["S1.0105.01", "reader"],
      ["SA5-12.08", "pending"],
    ];
    expect(ORDER).toHaveLength(4);
    for (const [code, source] of ORDER)
      expect((await lookupInCompany(a, code))?.source, code).toBe(source);

    const digest = async () =>
      (
        await w.db.owner.query(
          `select md5(string_agg(t, '|' order by t)) as d from (
             select row_to_json(x)::text as t from catalog_nodes x union all
             select row_to_json(x)::text from catalog_buildings x union all
             select row_to_json(x)::text from catalog_stacks x union all
             select row_to_json(x)::text from catalog_units x union all
             select row_to_json(x)::text from catalog_aliases x) s`,
        )
      ).rows[0].d as string;
    // The system load gives the catalog the code: an original code for a unit the catalog has.
    await w.db.owner.query(
      "insert into catalog_aliases (object_key, kind, value, source) values ($1, 'ma_goc', 'op1/SA5-12.08', 'MAU')",
      [c.units.find((u) => u.buildingName === "S1.01" && u.unitNumber === "0502")!.unitKey],
    );
    const before = await digest();
    expect(await matchPendingUnits(a)).toEqual({ matched: 2, waiting: 1 });
    expect(await digest(), "catalog changed by match").toBe(before);
    const after = await lookupInCompany(a, "SA5-12.08");
    expect(after?.source).toBe("catalog");
    const pending = (await readLayer(a)).pendingUnits.find((p) => p.rawCode === "SA5-12.08");
    expect(pending?.unitKey).toBeTruthy();
    // A unit key the catalog does not have is refused by the foreign key.
    let message = "";
    try {
      await a((cl) =>
        cl.query(
          "update company_pending_units set unit_key = 'unt_00000000000000000000000000', matched_at = now()",
        ),
      );
    } catch (err) {
      message = String((err as Error).message);
    }
    expect(message).toContain("foreign key");
    // B does not see A's pending units.
    expect((await readLayer(runAs(w, "Y", w.B))).pendingUnits).toEqual([]);
  });
});

describe("import templates (E6)", () => {
  it("finds the template by shape only and marks columns whose field was retired", async () => {
    const w = await layerWorld("mau");
    const a = runAs(w, "CA", w.A);
    const view = await addField(
      a,
      { name: "Hướng view", kind: "single_select", options: ["Biển"] },
      HEADERS,
    );
    if (!view.ok) throw new Error("no field");
    const SHEET = ["Mã căn", "Block", "Giá KBP", "View", "Ghi chú"];
    const saved = await saveTemplate(a, {
      name: "Bảng hàng tháng 11",
      headers: SHEET,
      columns: [
        { standard: "Listing.unitNumber" },
        { standard: "Listing.buildingName" },
        { standard: "Listing.listPrice" },
        { custom: view.id },
        { skip: true },
      ],
    });
    expect(saved.ok).toBe(true);
    const SHAPES: [string[], boolean][] = [
      [SHEET, true],
      [["  MÃ CĂN", "block", "giá kbp ", "VIEW", "ghi  chu"], true],
      [[SHEET[1]!, SHEET[0]!, ...SHEET.slice(2)], false],
      [SHEET.slice(0, 4), false],
      [[...SHEET, "Thêm"], false],
    ];
    expect(SHAPES).toHaveLength(5);
    for (const [headers, found] of SHAPES)
      expect(!!(await findTemplate(a, headers)), headers.join()).toBe(found);
    const bad = (columns: unknown[]) =>
      saveTemplate(a, { name: "Sai", headers: ["A"], columns: columns as never });
    expect(await bad([{ standard: "Listing.khongCo" }])).toEqual({
      ok: false,
      problem: "target-unknown",
    });
    expect(await bad([{ custom: "khong_co" }])).toEqual({ ok: false, problem: "target-unknown" });
    expect(
      await saveTemplate(a, { name: "Hai", headers: ["A", "B"], columns: [{ skip: true }] }),
    ).toEqual({
      ok: false,
      problem: "columns-mismatch",
    });
    expect(
      await saveTemplate(a, {
        name: "Trùng dạng",
        headers: SHEET,
        columns: SHEET.map(() => ({ skip: true as const })),
      }),
    ).toEqual({ ok: false, problem: "taken" });
    expect((await retireItem(a, "fields", view.id)).ok).toBe(true);
    expect((await findTemplate(a, SHEET))?.retiredColumns).toEqual([3]);
  });
});

// ---- the doors of /api/v1/company-layer (E8, E1 at the route) ------------------------------------------------------

const ORIGIN = "http://127.0.0.1:3485";
function req(url: string, method: string, body?: unknown, cookie?: string): Request {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

async function apiWorld(suffix: string) {
  const w = await layerWorld(suffix);
  const code = captureSender();
  const deps: LoginDeps = { pool: w.pool, secret: "test-secret-lop-rieng", sender: code.sender };
  const auth = createAuthHandlers(() => deps);
  const door = (r: Request, action: ActionName) => openDoor(() => w.pool, tokenFrom(r), action);
  const h = createCompanyLayerHandlers({ door, withCompany });
  const cookies = new Map<Person, string>();
  const cookie = async (who: Person): Promise<string> => {
    const have = cookies.get(who);
    if (have) return have;
    const email = w.email[who];
    await auth.requestCode(req(`${ORIGIN}/api/v1/auth/code`, "POST", { email }));
    const mail = [...code.sent].reverse().find((m) => m.email === email);
    const otp = mail?.text.match(/\b\d{6}\b/)?.[0];
    const res = await auth.verifyCode(
      req(`${ORIGIN}/api/v1/auth/session`, "POST", { email, code: otp }),
    );
    if (!res.ok) throw new Error(`đăng nhập ${who} trả ${res.status}`);
    const c = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
    const json = (await res.json()) as { company: { id: string } | null };
    if (json.company?.id !== w.A) {
      const chosen = await auth.chooseCompany(
        req(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: w.A }, c),
      );
      if (!chosen.ok) throw new Error(`chọn sàn của ${who} trả ${chosen.status}`);
    }
    cookies.set(who, c);
    return c;
  };
  const url = `${ORIGIN}/api/v1/company-layer`;
  return { w, h, cookie, url };
}

// Written in the test from the owner's answer to Hỏi-1, not read from ontology/actions.yaml: 4 roles × 5 actions.
const ROLES = ["LA", "BA", "TL", "CA"] as const;
const WRITERS = new Set(["LA", "TL", "CA"]);
const CELLS: Record<string, Record<(typeof ROLES)[number], boolean>> = {
  readCompanyLayer: { LA: true, BA: true, TL: true, CA: true },
  addCompanyLayer: { LA: true, BA: false, TL: true, CA: true },
  editCompanyLayer: { LA: true, BA: false, TL: true, CA: true },
  retireCompanyLayer: { LA: true, BA: false, TL: true, CA: true },
  matchPendingUnits: { LA: true, BA: false, TL: true, CA: true },
};

describe("permissions (E8)", () => {
  it("every role × every action matches the table written here, at the API and in the database", async () => {
    const { w, h, cookie, url } = await apiWorld("quyen");
    expect(Object.keys(CELLS).length * ROLES.length).toBe(20);
    const seen: string[] = [];
    for (const who of ROLES) {
      const c = await cookie(who);
      const add = await h.add(
        req(`${url}/labels`, "POST", { concept: "Unit", label: `Căn ${who}` }, c),
        "labels",
      );
      const id = add.ok ? ((await add.json()) as { id: string }).id : null;
      const anyId =
        id ??
        (
          await w.db.owner.query(
            "insert into company_labels (company_id, concept, label) values ($1, 'Subdivision', $2) returning id::text",
            [w.A, `Khu ${who}`],
          )
        ).rows[0].id;
      const results: Record<string, boolean> = {
        readCompanyLayer: (await h.read(req(url, "GET", undefined, c))).ok,
        addCompanyLayer: add.ok,
        editCompanyLayer: (
          await h.edit(req(`${url}/labels/${anyId}`, "PATCH", { label: "Lô" }, c), "labels", anyId)
        ).ok,
        retireCompanyLayer: (
          await h.retire(
            req(`${url}/labels/${anyId}/retire`, "POST", undefined, c),
            "labels",
            anyId,
          )
        ).ok,
        matchPendingUnits: (await h.match(req(`${url}/pending-units/match`, "POST", undefined, c)))
          .ok,
      };
      for (const [action, ok] of Object.entries(results))
        if (ok !== CELLS[action]![who])
          seen.push(`${who} ${action}: ${ok ? "allowed" : "refused"}`);
      if (!WRITERS.has(who)) expect(add.status).toBe(403);
    }
    expect(seen).toEqual([]);
    // In the database: a person without addCompanyLayer cannot insert straight through the door either.
    let message = "";
    try {
      await runAs(
        w,
        "BA",
        w.A,
      )((c) =>
        c.query(
          "insert into company_labels (company_id, concept, label) values (app.current_company_id(), 'Unit', 'X')",
        ),
      );
    } catch (err) {
      message = String((err as Error).message);
    }
    expect(message).toContain("row-level security");
  });

  it("break: without the restrictive insert rule a person without addCompanyLayer inserts", async () => {
    const w = await layerWorld("quyen_pha");
    await w.db.owner.query("drop policy company_labels_insert_by_permission on company_labels");
    await runAs(
      w,
      "BA",
      w.A,
    )((c) =>
      c.query(
        "insert into company_labels (company_id, concept, label) values (app.current_company_id(), 'Unit', 'X')",
      ),
    );
    const n = Number((await w.db.owner.query("select count(*) from company_labels")).rows[0].count);
    expect(n, "insert allowed without addCompanyLayer").toBe(1);
  });

  it("answers a bad body, an unknown part and an unknown concept with fixed codes", async () => {
    const { h, cookie, url } = await apiWorld("ma_loi");
    const c = await cookie("CA");
    expect((await h.add(req(`${url}/labels`, "POST", { nope: 1 }, c), "labels")).status).toBe(400);
    expect((await h.add(req(`${url}/khac`, "POST", {}, c), "khac")).status).toBe(404);
    const bad = await h.add(
      req(`${url}/labels`, "POST", { concept: "Inventory", label: "X" }, c),
      "labels",
    );
    expect(bad.status).toBe(400);
    expect(await bad.json()).toEqual({ error: "concept-unknown" });
    const unsigned = await h.read(req(url, "GET"));
    expect(unsigned.status).toBe(401);
  });
});
