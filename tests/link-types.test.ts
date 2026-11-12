// Roadmap row 1j (_acceptance/khai-lien-ket-chao-can): the owner link and the unit link are ontology concepts, the
// sample code uses the generated types, and their data rules turn red. Every check runs on the real files and on a copy
// broken in exactly one place.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, expectTypeOf, it } from "vitest";

import type { ListingOwner, ListingUnit } from "@/generated/ontology";
import * as catalog from "@/modules/catalog";
import * as contacts from "@/modules/contacts";
import * as listings from "@/modules/listings";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");
// The repo's own YAML reader (tools/repo_ontology.py), as tests/language.test.ts does: no new dependency.
const parse = (rel: string): unknown =>
  JSON.parse(
    execFileSync(
      "python3",
      [
        "-c",
        "import json,sys;from pathlib import Path;sys.path.insert(0,'tools');from repo_ontology import load_yaml_file;print(json.dumps(load_yaml_file(Path(sys.argv[1]))))",
        rel,
      ],
      { cwd: ROOT, encoding: "utf8" },
    ),
  );

function buildSample() {
  const units = catalog.sampleUnits();
  const company = listings.SAMPLE_COMPANY;
  const offered = listings.buildSampleListings({
    companyId: company.id,
    units: units.map((u) => ({ ...u, subdivisionName: catalog.subdivisionNameOf(u) })),
  });
  const people = contacts.buildSampleContacts({
    companyId: company.id,
    listingIds: offered.listings.map((l) => l.id),
  });
  return { company, units, ...offered, ...people };
}
type Sample = ReturnType<typeof buildSample>;
const clone = (s: Sample): Sample => structuredClone(s);
const nth = <T>(items: readonly T[], i: number): T => {
  const x = items[i];
  if (x === undefined) throw new Error(`no item ${i}`);
  return x;
};

// ——— AC-1: the two concepts, their fields and where each field points ——————————————————————————

interface PropSpec {
  type?: string;
  target?: string;
  required?: boolean;
  values?: string[];
}
type Entities = Record<string, Record<string, PropSpec>>;

const loadEntities = (): Entities => ({
  ListingOwner: (
    parse("ontology/entities/ListingOwner.yaml") as { properties: Record<string, PropSpec> }
  ).properties,
  ListingUnit: (
    parse("ontology/entities/ListingUnit.yaml") as { properties: Record<string, PropSpec> }
  ).properties,
});

// Written before the code: every reference field and the entity it points at.
const REFS: readonly (readonly [string, string, string])[] = [
  ["ListingOwner", "companyId", "Company"],
  ["ListingOwner", "contactId", "Contact"],
  ["ListingOwner", "listingId", "Listing"],
  ["ListingUnit", "companyId", "Company"],
  ["ListingUnit", "listingId", "Listing"],
  ["ListingUnit", "upi", "Unit"],
];
const FIELDS: Record<string, readonly string[]> = {
  ListingOwner: ["id", "companyId", "contactId", "listingId", "contactType"],
  ListingUnit: ["id", "companyId", "listingId", "upi"],
};

function checkConcepts(e: Entities): string[] {
  const errors: string[] = [];
  for (const [entity, fields] of Object.entries(FIELDS))
    for (const f of fields) {
      const spec = e[entity]?.[f];
      if (!spec) errors.push(`thiếu trường: ${entity}.${f}`);
      else if (spec.required !== true) errors.push(`trường không bắt buộc: ${entity}.${f}`);
    }
  for (const [entity, field, target] of REFS) {
    const spec = e[entity]?.[field];
    if (spec && (spec.type !== "ref" || spec.target !== target))
      errors.push(`tham chiếu sai: ${entity}.${field} → ${spec.target ?? spec.type}`);
  }
  const role = e["ListingOwner"]?.["contactType"];
  if (
    role &&
    (role.type !== "enum" || JSON.stringify(role.values) !== JSON.stringify(["Seller", "Landlord"]))
  )
    errors.push(`vai sai: ListingOwner.contactType`);
  return errors;
}

function checkGenerated(text: string): string[] {
  const errors: string[] = [];
  const block = (name: string) =>
    new RegExp(`export interface ${name} \\{([^}]*)\\}`).exec(text)?.[1] ?? "";
  const expected: Record<string, readonly string[]> = {
    ListingOwner: [
      "id: string;",
      "companyId: string;",
      "contactId: string;",
      "listingId: string;",
      "contactType: ListingOwnerContactType;",
    ],
    ListingUnit: ["id: string;", "companyId: string;", "listingId: string;", "upi: string;"],
  };
  for (const [name, lines] of Object.entries(expected)) {
    const got = block(name)
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("/**"));
    if (JSON.stringify(got) !== JSON.stringify(lines)) errors.push(`kiểu sinh lệch: ${name}`);
  }
  if (!text.includes('export type ListingOwnerContactType = "Seller" | "Landlord";'))
    errors.push("kiểu sinh lệch: ListingOwnerContactType");
  return errors;
}

describe("AC-1 the two link concepts are declared with company, references and role", () => {
  it("every field is required and every reference points at the right concept", () => {
    expect(checkConcepts(loadEntities())).toEqual([]);
    expect(checkGenerated(read("src/generated/ontology.ts"))).toEqual([]);
  });

  it("red: a reference to the wrong concept or an optional role is named; a right reference is not", () => {
    const wrongTarget = loadEntities();
    wrongTarget["ListingUnit"]!["upi"] = { type: "ref", target: "Listing", required: true };
    expect(checkConcepts(wrongTarget)).toEqual(["tham chiếu sai: ListingUnit.upi → Listing"]);

    const optional = loadEntities();
    optional["ListingOwner"]!["contactType"] = { type: "enum", values: ["Seller", "Landlord"] };
    expect(checkConcepts(optional)).toEqual(["trường không bắt buộc: ListingOwner.contactType"]);

    const noCompany = loadEntities();
    delete noCompany["ListingUnit"]!["companyId"];
    expect(checkConcepts(noCompany)).toEqual(["thiếu trường: ListingUnit.companyId"]);

    const generated = read("src/generated/ontology.ts").replace(
      "contactType: ListingOwnerContactType;",
      "contactType?: ListingOwnerContactType;",
    );
    expect(checkGenerated(generated)).toEqual(["kiểu sinh lệch: ListingOwner"]);
  });
});

// ——— AC-2: the six relations, written before the code —————————————————————————————————————————

interface Relation {
  from: string;
  name: string;
  to: string;
  cardinality: string;
}
const RELATIONS: readonly Relation[] = [
  { from: "Company", name: "holds_owner_link", to: "ListingOwner", cardinality: "one-to-many" },
  { from: "Contact", name: "owns_through", to: "ListingOwner", cardinality: "one-to-many" },
  { from: "Listing", name: "owned_through", to: "ListingOwner", cardinality: "one-to-many" },
  { from: "Company", name: "holds_unit_link", to: "ListingUnit", cardinality: "one-to-many" },
  { from: "Listing", name: "placed_on", to: "ListingUnit", cardinality: "one-to-one" },
  { from: "Unit", name: "offered_through", to: "ListingUnit", cardinality: "one-to-many" },
];
const OLD: readonly string[] = ["Contact owns Listing", "Unit offered_as Listing"];
const loadRelations = () =>
  (parse("ontology/relations.yaml") as { relations: Relation[] }).relations;
const entityNames = () =>
  new Set(
    readdirSync(join(ROOT, "ontology/entities"))
      .filter((f) => !f.startsWith("_"))
      .map((f) => f.replace(/\.yaml$/, "")),
  );

function checkRelations(rel: readonly Relation[], names: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  const label = (r: { from: string; name: string; to: string }) => `${r.from} ${r.name} ${r.to}`;
  for (const want of RELATIONS) {
    const got = rel.find((r) => label(r) === label(want));
    if (!got) errors.push(`thiếu quan hệ: ${label(want)}`);
    else if (got.cardinality !== want.cardinality) errors.push(`sai cardinality: ${label(want)}`);
  }
  for (const old of OLD)
    if (!rel.some((r) => label(r) === old)) errors.push(`mất quan hệ cũ: ${old}`);
  for (const r of rel)
    for (const end of [r.from, r.to])
      if (!names.has(end)) errors.push(`đầu quan hệ không có: ${end}`);
  return errors;
}

describe("AC-2 the relations go through the two concepts", () => {
  it("has the six new relations with their cardinality, keeps the two old ones, and every end exists", () => {
    expect(checkRelations(loadRelations(), entityNames())).toEqual([]);
  });

  it("red: a missing relation, a wrong cardinality and an unknown end are named", () => {
    const missing = loadRelations().filter((r) => r.name !== "placed_on");
    expect(checkRelations(missing, entityNames())).toEqual([
      "thiếu quan hệ: Listing placed_on ListingUnit",
    ]);

    const many = loadRelations().map((r) =>
      r.name === "placed_on" ? { ...r, cardinality: "one-to-many" } : r,
    );
    expect(checkRelations(many, entityNames())).toEqual([
      "sai cardinality: Listing placed_on ListingUnit",
    ]);

    const unknown = loadRelations().map((r) => (r.name === "placed_on" ? { ...r, to: "Lead" } : r));
    expect(checkRelations(unknown, entityNames())).toContain("đầu quan hệ không có: Lead");
  });
});

// ——— AC-3: the modules use the generated types ——————————————————————————————————————————————————

const FORBIDDEN = ["ListingUnit", "OwnerLink", "ListingOwner"].flatMap((n) => [
  [n, `interface ${n}`],
  [n, `type ${n} = {`],
]);
const moduleSources = () =>
  ["src/modules/listings", "src/modules/contacts"].flatMap((dir) =>
    readdirSync(join(ROOT, dir))
      .filter((f) => f.endsWith(".ts"))
      .map((f) => ({ file: `${dir}/${f}`, text: read(`${dir}/${f}`) })),
  );
function checkHandWritten(files: readonly { file: string; text: string }[]): string[] {
  const errors: string[] = [];
  for (const { text } of files)
    for (const [name, needle] of FORBIDDEN)
      if (text.includes(needle!)) errors.push(`khai lại kiểu bằng tay: ${name}`);
  return [...new Set(errors)];
}

describe("AC-3 the sample code uses the generated link types", () => {
  it("the module types are exactly the generated ones, and no module writes the shape by hand", () => {
    expectTypeOf<contacts.OwnerLink>().toEqualTypeOf<ListingOwner>();
    expectTypeOf<listings.ListingUnit>().toEqualTypeOf<ListingUnit>();
    expectTypeOf<
      ReturnType<typeof listings.buildSampleListings>["listingUnits"][number]
    >().toEqualTypeOf<ListingUnit>();
    const s = buildSample();
    expect(s.owners satisfies readonly ListingOwner[]).toHaveLength(60);
    expect(s.listingUnits satisfies readonly ListingUnit[]).toHaveLength(60);
    expect(checkHandWritten(moduleSources())).toEqual([]);
  });

  it("red: a hand-written shape is named; an alias of the generated type is not", () => {
    expect(
      checkHandWritten([{ file: "x.ts", text: "export type OwnerLink = {\n  id: string;\n};" }]),
    ).toEqual(["khai lại kiểu bằng tay: OwnerLink"]);
    expect(
      checkHandWritten([
        { file: "x.ts", text: "export interface ListingUnit {\n  id: string;\n}" },
      ]),
    ).toEqual(["khai lại kiểu bằng tay: ListingUnit"]);
    expect(
      checkHandWritten([{ file: "x.ts", text: "export type OwnerLink = ListingOwner;" }]),
    ).toEqual([]);
  });
});

// ——— AC-4: the owner role ————————————————————————————————————————————————————————————————————————

describe("AC-4 an owner link carries an owner role", () => {
  const s = buildSample();
  const ids = new Set(s.listings.map((l) => l.id));
  const check = (x: Sample) =>
    contacts.checkOwnerLinks({ contacts: x.contacts, owners: x.owners }, ids, x.company.id);

  it("every sample owner link is Seller or Landlord and the check is clean", () => {
    for (const o of s.owners) expect(contacts.OWNER_ROLES).toContain(o.contactType);
    expect(check(s)).toEqual([]);
  });

  it("red: a Buyer role is named; a Landlord role is not", () => {
    const buyer = clone(s);
    (nth(buyer.owners, 2) as { contactType: string }).contactType = "Buyer";
    expect(check(buyer)).toEqual([`vai không hợp lệ trên liên kết chủ: ${nth(s.owners, 2).id}`]);

    const landlord = clone(s);
    nth(landlord.owners, 2).contactType = "Landlord";
    expect(check(landlord)).toEqual([]);
  });
});

// ——— AC-5: the sample data is unchanged ——————————————————————————————————————————————————————————

const ROW_1_DIGEST = "428b20ae0e96076795e22ef1fd1734acf5743d8afb94366173973434eb3855c9";
const digest = (s: Sample) => createHash("sha256").update(JSON.stringify(s)).digest("hex");

describe("AC-5 the sample data is byte-identical to the signed sample-data row", () => {
  it("has the digest pinned by the sample-data row", () => {
    expect(digest(buildSample())).toBe(ROW_1_DIGEST);
  });

  it("red: changing one role changes the digest", () => {
    const s = clone(buildSample());
    nth(s.owners, 0).contactType = "Landlord";
    expect(digest(s)).not.toBe(ROW_1_DIGEST);
  });
});

// ——— AC-6: glossary and module owners ————————————————————————————————————————————————————————————

interface ModuleMap {
  modules: { name: string; owns?: string[]; depends_on?: string[] }[];
}
function checkHomes(glossary: string, map: ModuleMap): string[] {
  const errors: string[] = [];
  for (const name of ["ListingOwner", "ListingUnit"])
    if (!glossary.includes(`| \`${name}\``)) errors.push(`thiếu thuật ngữ: ${name}`);
  const owner = (entity: string) => map.modules.find((m) => (m.owns ?? []).includes(entity))?.name;
  for (const [entity, mod] of [
    ["ListingOwner", "contacts"],
    ["ListingUnit", "listings"],
  ] as const) {
    const got = owner(entity);
    if (!got) errors.push(`không mô-đun nào sở hữu: ${entity}`);
    else if (got !== mod) errors.push(`sai mô-đun sở hữu: ${entity} → ${got}`);
  }
  for (const m of map.modules)
    if ((m.depends_on ?? []).length > 0) errors.push(`có phụ thuộc mới: ${m.name}`);
  return errors;
}

describe("AC-6 the two concepts have a glossary line and an owning module", () => {
  const glossary = read("ontology/glossary.md");
  const map = parse("architecture/modules.yaml") as ModuleMap;

  it("both are in the glossary, owned by contacts and listings, with no new dependency", () => {
    expect(checkHomes(glossary, map)).toEqual([]);
  });

  it("red: a concept without an owner is named", () => {
    const broken: ModuleMap = structuredClone(map);
    const c = broken.modules.find((m) => m.name === "contacts")!;
    c.owns = (c.owns ?? []).filter((e) => e !== "ListingOwner");
    expect(checkHomes(glossary, broken)).toEqual(["không mô-đun nào sở hữu: ListingOwner"]);
  });
});

// ——— AC-7: data rules of the links ——————————————————————————————————————————————————————————————

describe("AC-7 links share a company with both ends; a listing has one unit", () => {
  const s = buildSample();
  const owners = (x: Sample) =>
    contacts.checkOwnerLinks(
      { contacts: x.contacts, owners: x.owners },
      new Set(x.listings.map((l) => l.id)),
      s.company.id,
      new Map(x.listings.map((l) => [l.id, l.companyId])),
    );
  const units = (x: Sample) =>
    listings.checkListingLinks(
      { listings: x.listings, listingUnits: x.listingUnits },
      new Set(x.units.map((u) => u.upi)),
      s.company.id,
    );

  it("the sample is clean", () => {
    expect(owners(s)).toEqual([]);
    expect(units(s)).toEqual([]);
  });

  it("red: a link whose contact or listing is in another company, and a listing with two units, are named", () => {
    const other = "00000000-0000-4000-8000-000000000009";
    const link = nth(s.owners, 0);

    const contactElsewhere = clone(s);
    contactElsewhere.contacts.find((c) => c.id === link.contactId)!.companyId = other;
    expect(owners(contactElsewhere)).toContain(`liên kết chủ khác sàn với liên hệ: ${link.id}`);

    const listingElsewhere = clone(s);
    listingElsewhere.listings.find((l) => l.id === link.listingId)!.companyId = other;
    expect(owners(listingElsewhere)).toContain(`liên kết chủ khác sàn với lần chào: ${link.id}`);

    const twoUnits = clone(s);
    const first = nth(twoUnits.listingUnits, 0);
    twoUnits.listingUnits.push({ ...first, id: `${first.id}-2`, upi: nth(s.units, 431).upi });
    expect(units(twoUnits)).toEqual([`lần chào có 2 căn: ${first.listingId}`]);
  });
});
