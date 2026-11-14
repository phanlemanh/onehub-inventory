// The MAU sample company (roadmap row 1, _acceptance/du-lieu-mau): catalog, listings and contacts composed through the
// three modules' public doors only. Every check runs on the healthy sample (no errors) and on a copy broken in exactly
// one place (the named error) — a check that never turned red proves nothing.
import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import type { Contact, Listing, Unit } from "@/generated/ontology";
import * as catalog from "@/modules/catalog";
import * as contacts from "@/modules/contacts";
import * as listings from "@/modules/listings";

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
const digest = (text: string) => createHash("sha256").update(text).digest("hex");
// Row 3b added the offer details and creation time to every sample listing; ids, statuses and prices are unchanged.
const PINNED_DIGEST = "e97a72da56f940a36ebc0501f782f8188ea754a1d406edd47429c0d6cce94623";

function scanGroups(s: Sample): contacts.ScanGroup[] {
  return [
    { kind: "sàn", records: [{ key: s.company.id, record: s.company }] },
    { kind: "căn", records: s.units.map((u) => ({ key: u.upi, record: u })) },
    { kind: "lần chào", records: s.listings.map((l) => ({ key: l.id, record: l })) },
    { kind: "liên kết căn", records: s.listingUnits.map((x) => ({ key: x.id, record: x })) },
    { kind: "liên hệ", records: s.contacts.map((c) => ({ key: c.id, record: c })) },
    { kind: "liên kết chủ", records: s.owners.map((o) => ({ key: o.id, record: o })) },
  ];
}

function labelErrors(s: Sample): string[] {
  return [
    ...catalog.checkCatalogLabels(s.units),
    ...listings.checkListingLabels(
      { listings: s.listings, listingUnits: s.listingUnits },
      s.company,
    ),
    ...contacts.checkContactLabels({ contacts: s.contacts, owners: s.owners }),
  ];
}

function checkSampleLinks(s: Sample): string[] {
  const offered = { listings: s.listings, listingUnits: s.listingUnits };
  return [
    ...listings.checkListingLinks(offered, new Set(s.units.map((u) => u.upi)), s.company.id),
    ...contacts.checkOwnerLinks(
      { contacts: s.contacts, owners: s.owners },
      new Set(s.listings.map((l) => l.id)),
      s.company.id,
    ),
  ];
}

const nth = <T>(items: readonly T[], i: number): T => {
  const x = items[i];
  if (x === undefined) throw new Error(`no item ${i}`);
  return x;
};

describe("AC-1 the sample is deterministic", () => {
  it("builds byte-identical data under two time zones, with the pinned digest", () => {
    const before = process.env["TZ"];
    try {
      process.env["TZ"] = "UTC";
      const a = JSON.stringify(buildSample());
      process.env["TZ"] = "Asia/Ho_Chi_Minh";
      const b = JSON.stringify(buildSample());
      expect(a).toBe(b);
      expect(digest(a)).toBe(PINNED_DIGEST);
    } finally {
      if (before === undefined) delete process.env["TZ"];
      else process.env["TZ"] = before;
    }
  });

  it("a copy with one changed price no longer matches the pinned digest", () => {
    const s = clone(buildSample());
    nth(s.listings, 0).listPrice = (nth(s.listings, 0).listPrice ?? 0) + 10_000_000;
    expect(digest(JSON.stringify(s))).not.toBe(PINNED_DIGEST);
  });
});

describe("AC-2 the catalog covers Ocean Park 1, 2, 3", () => {
  const units = catalog.sampleUnits();

  it("has exactly the three projects and the public Ocean Park 1 towers", () => {
    expect(catalog.SAMPLE_SUBDIVISIONS.map((s) => s.name)).toEqual([
      "Vinhomes Ocean Park 1",
      "Vinhomes Ocean Park 2 – The Empire",
      "Vinhomes Ocean Park 3 – The Crown",
    ]);
    const op1 = new Set(units.filter((u) => u.subdivisionKey === "op1").map((u) => u.buildingName));
    expect([...op1].sort()).toEqual(["S1.01", "S1.02", "S1.03", "S1.05"]);
  });

  it("every unit code is unique and reads back to its tower, floor and stack", () => {
    expect(catalog.checkSampleCatalog(units)).toEqual([]);
    for (const u of units)
      expect(catalog.readSampleCode(catalog.unitCode(u))).toEqual({
        buildingKey: u.buildingKey,
        floor: u.floor,
        stack: u.stack,
      });
    expect(catalog.readSampleCode("S1.05-1206")).toEqual({
      buildingKey: units.find((u) => u.buildingName === "S1.05")!.buildingKey,
      floor: "12",
      stack: "06",
    });
    for (const s of catalog.SAMPLE_SUBDIVISIONS)
      expect(catalog.readSampleCode(s.codeExample)).not.toBeNull();
    expect(catalog.readSampleCode("toà S1.05 căn 1206")).toBeNull();
  });

  it("red: a duplicated code and a floor that disagrees with the code are named", () => {
    const dup: Unit[] = structuredClone(units);
    dup[1] = { ...nth(dup, 0), upi: `${catalog.SAMPLE_UPI_PREFIX}copy` };
    expect(catalog.checkSampleCatalog(dup)).toContain(
      `mã căn trùng: ${catalog.unitCode(nth(units, 0))}`,
    );

    const off: Unit[] = structuredClone(units);
    nth(off, 2).floor = "99";
    expect(catalog.checkSampleCatalog(off)).toEqual([
      `mã căn lệch thuộc tính: ${catalog.unitCode(nth(units, 2))}`,
    ]);
  });
});

describe("AC-3 60 listings cover the six statuses", () => {
  const s = buildSample();
  const offered = (x: Sample) => ({ listings: x.listings, listingUnits: x.listingUnits });

  it("has 60 listings with the planned status counts and passes the listing rules", () => {
    expect(s.listings).toHaveLength(60);
    const counts: Record<string, number> = {};
    for (const l of s.listings) counts[l.standardStatus] = (counts[l.standardStatus] ?? 0) + 1;
    expect(counts).toEqual({
      Active: 24,
      Incomplete: 8,
      Pending: 7,
      Hold: 7,
      Closed: 7,
      Withdrawn: 7,
    });
    expect(listings.checkSampleListings(offered(s), s.units)).toEqual([]);
  });

  it("red: each broken rule is named", () => {
    const withStatus = (st: Listing["standardStatus"]) =>
      s.listings.findIndex((l) => l.standardStatus === st);

    const noHold = clone(s);
    for (const l of noHold.listings) if (l.standardStatus === "Hold") l.standardStatus = "Active";
    expect(listings.checkSampleListings(offered(noHold), s.units)).toEqual([
      "thiếu trạng thái: Hold",
    ]);

    const closed = clone(s);
    const c = nth(closed.listings, withStatus("Closed"));
    delete c.closePrice;
    expect(listings.checkSampleListings(offered(closed), s.units)).toEqual([
      `Closed thiếu giá hoặc ngày chốt: ${c.id}`,
    ]);

    const withdrawn = clone(s);
    const w = nth(withdrawn.listings, withStatus("Withdrawn"));
    delete w.withdrawnReason;
    expect(listings.checkSampleListings(offered(withdrawn), s.units)).toEqual([
      `Withdrawn thiếu lý do: ${w.id}`,
    ]);

    const shared = clone(s);
    nth(shared.listingUnits, 1).upi = nth(shared.listingUnits, 0).upi;
    expect(listings.checkSampleListings(offered(shared), s.units)).toContain(
      `hai lần chào chung căn: ${nth(s.listingUnits, 0).upi}`,
    );

    const moved = clone(s);
    nth(moved.listings, 3).buildingName = "S1.99";
    expect(listings.checkSampleListings(offered(moved), s.units)).toEqual([
      `lần chào lệch căn: ${nth(s.listings, 3).id}`,
    ]);
  });
});

describe("AC-4 every record carries the MAU label", () => {
  const s = buildSample();

  it("has the planned record counts and no record without the label", () => {
    expect({
      company: 1,
      units: s.units.length,
      listings: s.listings.length,
      listingUnits: s.listingUnits.length,
      contacts: s.contacts.length,
      owners: s.owners.length,
    }).toEqual({
      company: 1,
      units: 432,
      listings: 60,
      listingUnits: 60,
      contacts: 50,
      owners: 60,
    });
    expect(labelErrors(s)).toEqual([]);
  });

  it("red: a missing label is named by kind and record, for each of the six kinds", () => {
    const unlabel = (id: string) => id.replace(/^4d415500-/, "00000000-");

    const company = clone(s);
    company.company = { ...company.company, name: "Sàn mẫu Ocean Park" };
    expect(labelErrors(company)).toEqual([`thiếu nhãn MAU: sàn ${s.company.id}`]);

    const unit = clone(s);
    nth(unit.units, 5).upi = "urn:onehub:upi:op1:s1.01:0506";
    expect(labelErrors(unit)).toEqual(["thiếu nhãn MAU: căn urn:onehub:upi:op1:s1.01:0506"]);

    const listing = clone(s);
    nth(listing.listings, 7).id = unlabel(nth(s.listings, 7).id);
    expect(labelErrors(listing)).toEqual([
      `thiếu nhãn MAU: lần chào ${nth(listing.listings, 7).id}`,
    ]);

    const listingUnit = clone(s);
    nth(listingUnit.listingUnits, 8).id = unlabel(nth(s.listingUnits, 8).id);
    expect(labelErrors(listingUnit)).toEqual([
      `thiếu nhãn MAU: liên kết căn ${nth(listingUnit.listingUnits, 8).id}`,
    ]);

    const contact = clone(s);
    nth(contact.contacts, 9).fullName = "[Tên] Chủ bán 10";
    expect(labelErrors(contact)).toEqual([`thiếu nhãn MAU: liên hệ ${nth(s.contacts, 9).id}`]);

    const owner = clone(s);
    nth(owner.owners, 10).id = unlabel(nth(s.owners, 10).id);
    expect(labelErrors(owner)).toEqual([
      `thiếu nhãn MAU: liên kết chủ ${nth(owner.owners, 10).id}`,
    ]);
  });
});

describe("AC-5 no real names or numbers", () => {
  const s = buildSample();
  const scan = (x: Sample) => contacts.checkNoRealData(scanGroups(x), x.contacts);

  it("scans every string, reads exactly 53 sample numbers, finds nothing", () => {
    const result = scan(s);
    expect(result.errors).toEqual([]);
    expect(result.phones).toBe(53);
    for (const c of s.contacts)
      for (const p of contacts.phoneList(c)) expect(p).toMatch(/^0900 000 0\d\d$/);
  });

  it("allowed digits are not counted: uuid, sample UPI, ISO time, tower and unit codes", () => {
    expect(contacts.strayDigits(nth(s.listings, 0).id)).toBe(0);
    expect(contacts.strayDigits(nth(s.units, 0).upi)).toBe(0);
    expect(contacts.strayDigits("2026-11-01T09:00:00+07:00")).toBe(0);
    expect(contacts.strayDigits("S1.05-1208 ở toà S1.05")).toBe(0);
    expect(contacts.strayDigits("0900 000 001, 0900 000 051")).toBe(0);
  });

  it("red: a real-looking number, a run of digits in a name, full-width digits in a tower name, a name without [Tên]", () => {
    const phone = clone(s);
    nth(phone.contacts, 0).phones = "0912 345 678";
    expect(scan(phone).errors).toContain(
      `số không đúng dạng mẫu: liên hệ ${nth(s.contacts, 0).id}`,
    );

    const inName = clone(s);
    nth(inName.contacts, 1).fullName = "[Tên] 0912345678 · MAU";
    expect(scan(inName).errors).toEqual([
      `số không đúng dạng mẫu: liên hệ ${nth(s.contacts, 1).id}`,
    ]);

    const wide = clone(s);
    nth(wide.units, 3).buildingName = "Toà ０９１２３４５６７８";
    expect(scan(wide).errors).toEqual([`số không đúng dạng mẫu: căn ${nth(s.units, 3).upi}`]);

    const name = clone(s);
    nth(name.contacts, 2).fullName = "Chủ bán 03 · MAU";
    expect(scan(name).errors).toEqual([
      `tên không mang nhãn mẫu: liên hệ ${nth(s.contacts, 2).id}`,
    ]);
  });
});

describe("AC-6 the four linking cases", () => {
  const s = buildSample();
  const ids = s.listings.map((l) => l.id);
  const cases = (x: Sample, listingIds = ids) =>
    contacts.checkLinkCases({ contacts: x.contacts, owners: x.owners }, listingIds);
  const firstBy = (owners: Sample["owners"], key: "contactId" | "listingId") => {
    const seen = new Set<string>();
    return owners.filter((o) => !seen.has(o[key]) && seen.add(o[key]));
  };

  it("has an owner of several listings, a listing with two owners, an owner who buys, a listing without owner", () => {
    expect(cases(s)).toEqual([]);
  });

  it("red: removing each case names it", () => {
    const one = clone(s);
    one.owners = firstBy(one.owners, "contactId");
    expect(cases(one)).toContain("thiếu ca: một chủ nhiều căn");

    const single = clone(s);
    single.owners = firstBy(single.owners, "listingId");
    expect(cases(single)).toEqual(["thiếu ca: một căn nhiều chủ"]);

    const sellers = clone(s);
    for (const c of sellers.contacts)
      if (c.contactTypes.includes("Buyer") && c.contactTypes.includes("Seller"))
        c.contactTypes = "Seller";
    expect(cases(sellers)).toEqual(["thiếu ca: vừa chủ vừa khách"]);

    const allOwned = clone(s);
    const owned = new Set(allOwned.owners.map((o) => o.listingId));
    for (const id of ids.filter((x) => !owned.has(x)))
      allOwned.owners.push({
        ...nth(allOwned.owners, 0),
        id: `${nth(allOwned.owners, 0).id}-${id}`,
        listingId: id,
      });
    expect(cases(allOwned)).toEqual(["thiếu ca: căn chưa có chủ"]);
  });
});

describe("AC-7 a number changed once is seen on every listing of that person", () => {
  const s = buildSample();
  const ids = s.listings.map((l) => l.id);
  const NEW = "0900 000 099";
  const staleListings = (store: contacts.ContactStore, oldPhone: string) =>
    ids.filter((id) => store.ownersOf(id).some((c) => contacts.phoneList(c).includes(oldPhone)));
  const pickOwner = (store: contacts.ContactStore) => {
    const owner = store.contacts().find((c) => store.listingsOf(c.id).length >= 2);
    if (!owner) throw new Error("no owner with two listings");
    return owner;
  };

  it("updates every listing of the owner, leaves other contacts alone, and keeps numbers off other records", () => {
    const store = contacts.createContactStore({ contacts: s.contacts, owners: s.owners });
    const owner = pickOwner(store);
    const old = nth(contacts.phoneList(owner), 0);
    store.updatePhones(owner.id, [NEW]);

    const theirs = store.listingsOf(owner.id);
    expect(theirs.length).toBeGreaterThanOrEqual(2);
    for (const id of theirs)
      expect(store.ownersOf(id).find((c) => c.id === owner.id)?.phones).toBe(NEW);
    expect(staleListings(store, old)).toEqual([]);
    for (const c of store.contacts())
      if (c.id !== owner.id) expect(c.phones).toBe(s.contacts.find((x) => x.id === c.id)?.phones);

    for (const record of [...s.units, ...s.listings, ...s.listingUnits, ...s.owners]) {
      expect(Object.keys(record)).not.toContain("phones");
      expect(JSON.stringify(record)).not.toMatch(/0900 000/);
    }
  });

  it("red: a store that copies numbers onto links still shows the old number", () => {
    const real = contacts.createContactStore({ contacts: s.contacts, owners: s.owners });
    const copied = new Map(ids.map((id) => [id, real.ownersOf(id).map((c) => ({ ...c }))]));
    const denormalized: contacts.ContactStore = { ...real, ownersOf: (id) => copied.get(id) ?? [] };
    const owner = pickOwner(real);
    const old = nth(contacts.phoneList(owner), 0);
    denormalized.updatePhones(owner.id, [NEW]);
    expect(staleListings(denormalized, old)).toEqual(real.listingsOf(owner.id));
  });
});

describe("AC-8 the three modules link up", () => {
  const s = buildSample();

  it("every link points at a real unit, listing or contact, and every record belongs to the sample company", () => {
    expect(checkSampleLinks(s)).toEqual([]);
    const typed = s.contacts satisfies readonly Contact[];
    expect(typed.every((c) => c.companyId === listings.SAMPLE_COMPANY.id)).toBe(true);
    expect(contacts.SAMPLE_ID_PREFIX).toBe(listings.SAMPLE_ID_PREFIX);
  });

  it("red: a dangling link or a record of another company is named", () => {
    const other = "00000000-0000-4000-8000-000000000009";

    const unit = clone(s);
    nth(unit.listingUnits, 0).upi = "urn:onehub:upi:mau:op1:s1.01:9999";
    expect(checkSampleLinks(unit)).toEqual([
      "liên kết căn trỏ căn không có: urn:onehub:upi:mau:op1:s1.01:9999",
    ]);

    const listing = clone(s);
    nth(listing.owners, 0).listingId = other;
    expect(checkSampleLinks(listing)).toEqual([`liên kết chủ trỏ lần chào không có: ${other}`]);

    const contact = clone(s);
    nth(contact.owners, 1).contactId = other;
    expect(checkSampleLinks(contact)).toEqual([`liên kết chủ trỏ liên hệ không có: ${other}`]);

    const elsewhere = clone(s);
    nth(elsewhere.contacts, 3).companyId = other;
    nth(elsewhere.owners, 4).companyId = other;
    nth(elsewhere.listingUnits, 5).companyId = other;
    nth(elsewhere.listings, 6).companyId = other;
    expect(checkSampleLinks(elsewhere).sort()).toEqual(
      [
        `bản ghi khác sàn: liên hệ ${nth(s.contacts, 3).id}`,
        `bản ghi khác sàn: liên kết chủ ${nth(s.owners, 4).id}`,
        `bản ghi khác sàn: liên kết căn ${nth(s.listingUnits, 5).id}`,
        `bản ghi khác sàn: lần chào ${nth(s.listings, 6).id}`,
      ].sort(),
    );
  });
});
