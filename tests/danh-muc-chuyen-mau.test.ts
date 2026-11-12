// Row 7d (_acceptance/danh-muc-can-nhu-onehub-invest, E9 and E15): the sample catalog moves to the new storage without
// losing a unit. The "before" snapshot is tests/fixtures/danh-muc-truoc-7d.json, made by running the catalog sample of
// the commit before this row (BEFORE) — never written by hand. When git history is at hand the test rebuilds the
// snapshot from that commit and requires it to equal the committed file; CI checks out without history, so there the
// committed file stands alone. UPDATE_FIXTURE=1 rewrites the file from BEFORE.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

import type { Unit } from "@/generated/ontology";
import * as catalog from "@/modules/catalog";
import * as listings from "@/modules/listings";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = join(ROOT, "tests/fixtures/danh-muc-truoc-7d.json");
const BEFORE = "d85d8151f0365a95713d4d12662c82420f23d16d";

interface OldUnit {
  upi: string;
  subdivisionKey: string;
  buildingKey: string;
  buildingName: string;
  unitNumber: string;
  stack?: string;
  floor?: number;
  livingArea?: number;
  bedroomsTotal?: number;
  directionFaces?: string;
}
interface OldSnapshot {
  commit: string;
  units: OldUnit[];
  /** Unit code people typed before this row, per upi: `<tower code>-<unit number>`. */
  codes: Record<string, string>;
}

/** Runs the catalog sample of BEFORE in a scratch folder; null when this checkout has no history. */
async function snapshotFromGit(): Promise<OldSnapshot | null> {
  const show = (path: string) => {
    try {
      return execFileSync("git", ["show", `${BEFORE}:${path}`], {
        cwd: ROOT,
        stdio: ["ignore", "pipe", "ignore"],
      }).toString();
    } catch {
      return null;
    }
  };
  const sample = show("src/modules/catalog/sample.ts");
  const labels = show("src/generated/labels.ts");
  if (!sample || !labels) return null;
  const dir = mkdtempSync(join(tmpdir(), "danh-muc-truoc-"));
  try {
    mkdirSync(join(dir, "src/modules/catalog"), { recursive: true });
    mkdirSync(join(dir, "src/generated"), { recursive: true });
    writeFileSync(join(dir, "src/modules/catalog/sample.ts"), sample);
    writeFileSync(join(dir, "src/generated/labels.ts"), labels);
    const old = (await import(pathToFileURL(join(dir, "src/modules/catalog/sample.ts")).href)) as {
      sampleUnits: () => OldUnit[];
      unitCode: (u: OldUnit) => string;
    };
    const units = old.sampleUnits();
    return {
      commit: BEFORE,
      units,
      codes: Object.fromEntries(units.map((u) => [u.upi, old.unitCode(u)])),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const committed = (): OldSnapshot => JSON.parse(readFileSync(FIXTURE, "utf8")) as OldSnapshot;

/** Every difference between the old units and the new catalog, by upi. */
export function compareCatalogs(before: OldSnapshot, after: catalog.SampleCatalog): string[] {
  const errors: string[] = [];
  const seen = new Map<string, number>();
  for (const u of after.units) seen.set(u.upi, (seen.get(u.upi) ?? 0) + 1);
  for (const [upi, n] of seen) if (n > 1) errors.push(`căn trùng: ${upi}`);
  const byUpi = new Map(after.units.map((u) => [u.upi, u]));
  const original = after.aliases.filter((a) => a.kind === "ma_goc");
  for (const old of before.units) {
    const u = byUpi.get(old.upi);
    if (!u) {
      errors.push(`mất căn: ${old.upi}`);
      continue;
    }
    const same =
      u.subdivisionKey === old.subdivisionKey &&
      u.buildingName === old.buildingName &&
      u.unitNumber === old.unitNumber &&
      u.stack === old.stack &&
      u.floor === (old.floor === undefined ? undefined : String(old.floor)) &&
      u.livingArea === old.livingArea &&
      u.bedroomsTotal === old.bedroomsTotal &&
      u.directionFaces === old.directionFaces;
    if (!same) errors.push(`căn đổi thuộc tính: ${old.upi}`);
    const hit = catalog.lookupCode(before.codes[old.upi] ?? "", {
      companyAliases: [],
      catalogAliases: original,
      subdivisionSlug: old.subdivisionKey,
    });
    if (hit.source !== "goc" || hit.objectKey !== u.unitKey)
      errors.push(`mã cũ không ra căn: ${old.upi}`);
  }
  for (const u of after.units)
    if (!before.units.some((o) => o.upi === u.upi)) errors.push(`căn lạ: ${u.upi}`);
  return errors;
}

const offered = (
  units: readonly Pick<
    Unit,
    "upi" | "subdivisionKey" | "buildingName" | "unitNumber" | "livingArea"
  >[],
) =>
  listings.buildSampleListings({
    companyId: listings.SAMPLE_COMPANY.id,
    units: units.map((u) => ({ ...u, subdivisionName: catalog.subdivisionNameOf(u) })),
  });

describe("E9 danh mục mẫu chuyển sang cách lưu mới không mất căn nào", () => {
  it("ảnh chụp đã commit là đúng đầu ra của danh mục cũ (khi có lịch sử git)", async () => {
    const fresh = await snapshotFromGit();
    if (process.env.UPDATE_FIXTURE === "1" && fresh) {
      mkdirSync(dirname(FIXTURE), { recursive: true });
      writeFileSync(FIXTURE, JSON.stringify(fresh) + "\n");
    }
    if (!fresh) return; // CI without history: the committed file stands alone, provenance checked where history exists.
    expect(committed()).toEqual(fresh);
  });

  it("đủ 432 căn, cùng tập upi, giữ thuộc tính; mã cũ tra qua mã gốc ra đúng căn", () => {
    const before = committed();
    const after = catalog.sampleCatalog();
    expect(before.units).toHaveLength(432);
    expect(after.units).toHaveLength(432);
    expect(new Set(after.units.map((u) => u.upi))).toEqual(new Set(before.units.map((u) => u.upi)));
    expect(compareCatalogs(before, after)).toEqual([]);
  });

  it("60 căn của lần chào mẫu đều có trong danh mục mới", () => {
    const upis = new Set(catalog.sampleUnits().map((u) => u.upi));
    const chosen = offered(committed().units as never).listingUnits.map((l) => l.upi);
    expect(chosen).toHaveLength(60);
    expect(chosen.filter((u) => !upis.has(u))).toEqual([]);
  });

  it("đỏ: bỏ một căn, nhân đôi một căn, đổi thuộc tính đều bị gọi tên", () => {
    const before = committed();
    const lost = catalog.sampleCatalog();
    const gone = lost.units.splice(5, 1)[0]!;
    expect(compareCatalogs(before, lost)).toEqual([`mất căn: ${gone.upi}`]);

    const twice = catalog.sampleCatalog();
    twice.units.push({ ...twice.units[7]! });
    expect(compareCatalogs(before, twice)).toEqual([`căn trùng: ${twice.units[7]!.upi}`]);

    const moved = catalog.sampleCatalog();
    moved.units[9] = { ...moved.units[9]!, floor: "99" };
    expect(compareCatalogs(before, moved)).toEqual([`căn đổi thuộc tính: ${moved.units[9]!.upi}`]);
  });
});

describe("E15 60 lần chào mẫu giữ nguyên", () => {
  it("dựng từ danh mục mới bằng sâu bản dựng từ danh mục cũ", () => {
    expect(offered(catalog.sampleUnits())).toEqual(offered(committed().units as never));
  });

  it("đỏ: đổi tên toà của một căn được chào thì hai bản khác nhau ở đúng căn ấy", () => {
    const old = committed().units;
    const target = offered(old as never).listingUnits[0]!.upi;
    const units = catalog
      .sampleUnits()
      .map((u) => (u.upi === target ? { ...u, buildingName: "S9.99" } : u));
    const a = offered(units).listings;
    const b = offered(old as never).listings;
    const differs = a.filter((l, i) => JSON.stringify(l) !== JSON.stringify(b[i]));
    expect(differs.map((l) => l.buildingName)).toEqual(["S9.99"]);
  });
});
