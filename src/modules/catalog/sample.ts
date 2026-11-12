// Sample catalog for the MAU sample company (roadmap row 1, decision 0020): Vinhomes Ocean Park 1, 2, 3.
// Row 7d: stored like onehub-invest — project → complex → tower → stack → unit, prefixed keys, floor as text, and the
// sample unit codes kept as original codes (aliases), looked up rather than split (Hỏi-4).
// Pure and deterministic: no clock, no Math.random — keys come from a fixed sample clock and a counter, never from
// content. Units are fake; project, complex and tower names are public.
// Stack table taken from onehub-quy-hang commit 1f8a6edd, packages/db/seed/du-lieu-mau.mjs.
import { LABELS } from "../../generated/labels";
import type {
  Building,
  CatalogAlias,
  Complex,
  Stack,
  Subdivision,
  Unit,
} from "../../generated/ontology";
import { mintKey, type KeyPrefix } from "./keys";
import { lookupCode } from "./lookup";

const BUILDING_WORD = LABELS.Building.pref.toLowerCase();

/** Every sample unit's UPI starts with this: the unit template has no label field. */
export const SAMPLE_UPI_PREFIX = "urn:onehub:upi:mau:";
/** Source of every sample original code. */
export const SAMPLE_ALIAS_SOURCE = "MAU";
/** The sample clock: keys of the sample are minted at this instant. */
export const SAMPLE_EPOCH_MS = Date.UTC(2026, 10, 9);

export interface SampleBuilding {
  /** Tower code as written in a unit code, e.g. `S1.05`; kept as the tower's original code. */
  code: string;
  name: string;
}

export interface SampleSubdivision {
  key: string;
  name: string;
  /** The complex (phân khu) the towers stand in, when one is public. */
  complex?: { slug: string; name: string };
  buildings: readonly SampleBuilding[];
  /** How a unit code of this project reads: one example and its reading. */
  codeExample: string;
  codeReading: string;
}

/**
 * Ocean Park 1 towers are four of the eleven public Sapphire 1 towers (S1.01–S1.12, no S1.04), in the public complex
 * The Sapphire 1. Public sources list no apartment tower names for Ocean Park 2 and 3, so those towers carry a fake
 * name with the [MAU] label (Hỏi-2) and stand directly under their project.
 */
export const SAMPLE_SUBDIVISIONS: readonly SampleSubdivision[] = [
  {
    key: "op1",
    name: "Vinhomes Ocean Park 1",
    complex: { slug: "op1-the-sapphire-1", name: "The Sapphire 1" },
    buildings: ["S1.01", "S1.02", "S1.03", "S1.05"].map((code) => ({ code, name: code })),
    codeExample: "S1.05-1208",
    codeReading: `${BUILDING_WORD} S1.05 · tầng 12 · trục 08`,
  },
  {
    key: "op2",
    name: "Vinhomes Ocean Park 2 – The Empire",
    buildings: [{ code: "E1", name: `[MAU] ${LABELS.Building.pref} E1` }],
    codeExample: "E1-0903",
    codeReading: `${BUILDING_WORD} E1 · tầng 9 · trục 03`,
  },
  {
    key: "op3",
    name: "Vinhomes Ocean Park 3 – The Crown",
    buildings: [{ code: "C1", name: `[MAU] ${LABELS.Building.pref} C1` }],
    codeExample: "C1-1506",
    codeReading: `${BUILDING_WORD} C1 · tầng 15 · trục 06`,
  },
];

const FLOORS = { from: 5, to: 16 };
// Per stack: living area (m²), bedrooms, balcony direction.
const STACKS = [
  { area: 54.2, bedrooms: 1, faces: "Đông Nam" },
  { area: 68.5, bedrooms: 2, faces: "Đông Bắc" },
  { area: 75.0, bedrooms: 2, faces: "Tây Bắc" },
  { area: 82.3, bedrooms: 2, faces: "Tây Nam" },
  { area: 96.8, bedrooms: 3, faces: "Nam" },
  { area: 110.4, bedrooms: 3, faces: "Bắc" },
];

const two = (n: number) => String(n).padStart(2, "0");

/** Sixteen deterministic numbers for the n-th sample key (mulberry32 on the counter). */
function counterRandom(n: number): number[] {
  let a = (0x7d000000 + n) >>> 0;
  return Array.from({ length: 16 }, () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) % 32;
  });
}

export interface SampleCatalog {
  subdivisions: Subdivision[];
  complexes: Complex[];
  buildings: Building[];
  stacks: Stack[];
  units: Unit[];
  aliases: CatalogAlias[];
}

/** The whole sample catalog, built fresh on every call. */
export function sampleCatalog(): SampleCatalog {
  let counter = 0;
  const key = (prefix: KeyPrefix) => mintKey(prefix, SAMPLE_EPOCH_MS, counterRandom(++counter));
  const out: SampleCatalog = {
    subdivisions: [],
    complexes: [],
    buildings: [],
    stacks: [],
    units: [],
    aliases: [],
  };
  const alias = (objectKey: string, kind: CatalogAlias["kind"], value: string) =>
    out.aliases.push({
      id: out.aliases.length + 1,
      objectKey,
      kind,
      value,
      source: SAMPLE_ALIAS_SOURCE,
      firstSeen: "2026-11-09T00:00:00Z",
    });

  for (const sub of SAMPLE_SUBDIVISIONS) {
    out.subdivisions.push({ slug: sub.key, name: sub.name });
    if (sub.complex)
      out.complexes.push({
        slug: sub.complex.slug,
        name: sub.complex.name,
        subdivisionSlug: sub.key,
      });
    for (const b of sub.buildings) {
      const buildingKey = key("bld");
      out.buildings.push({
        buildingKey,
        subdivisionKey: sub.key,
        ...(sub.complex ? { complexKey: sub.complex.slug } : {}),
        buildingName: b.name,
        upi: `${SAMPLE_UPI_PREFIX}${sub.key}:${b.code.toLowerCase()}`,
      });
      alias(buildingKey, "ma_goc", `${sub.key}/${b.code}`);
      alias(buildingKey, "ten", b.name);
      const stackKeys = STACKS.map((_, i) => {
        const stackKey = key("stk");
        out.stacks.push({ stackKey, buildingKey, stackCode: two(i + 1) });
        alias(stackKey, "ma_goc", `${sub.key}/${b.code}/${two(i + 1)}`);
        return stackKey;
      });
      for (let floor = FLOORS.from; floor <= FLOORS.to; floor++)
        for (const [i, s] of STACKS.entries()) {
          const unitNumber = `${two(floor)}${two(i + 1)}`;
          const unitKey = key("unt");
          out.units.push({
            unitKey,
            upi: `${SAMPLE_UPI_PREFIX}${sub.key}:${b.code.toLowerCase()}:${unitNumber}`,
            subdivisionKey: sub.key,
            ...(sub.complex ? { complexKey: sub.complex.slug } : {}),
            buildingKey,
            buildingName: b.name,
            stackKey: stackKeys[i]!,
            stack: two(i + 1),
            unitNumber,
            floor: String(floor),
            livingArea: s.area,
            bedroomsTotal: s.bedrooms,
            directionFaces: s.faces,
            propertyType: "Residential",
            propertySubType: "Condominium",
          });
          alias(unitKey, "ma_goc", `${sub.key}/${b.code}-${unitNumber}`);
        }
    }
  }
  return out;
}

/** Every unit of the sample catalog: 6 towers × 12 floors × 6 stacks. A fresh array on every call. */
export function sampleUnits(): Unit[] {
  return sampleCatalog().units;
}

/** Name of the project a unit belongs to, for the listing that copies it. */
export function subdivisionNameOf(unit: Pick<Unit, "subdivisionKey">): string | undefined {
  return SAMPLE_SUBDIVISIONS.find((s) => s.key === unit.subdivisionKey)?.name;
}

const SAMPLE = sampleCatalog();
const BUILDING_CODE = new Map(
  SAMPLE.aliases
    .filter((a) => a.kind === "ma_goc" && a.objectKey.startsWith("bld_"))
    .map((a) => [a.objectKey, a.value.split("/")[1]!]),
);

/** The unit code people type: `S1.05-1208` — the tower's original code, a dash, the unit number. */
export const unitCode = (unit: Pick<Unit, "buildingKey" | "unitNumber">) =>
  `${BUILDING_CODE.get(unit.buildingKey) ?? unit.buildingKey}-${unit.unitNumber}`;

/**
 * Looks a sample unit code up through the original codes (not split: Hỏi-4) and returns that unit's tower key, floor
 * and stack; null when no sample unit has that code.
 */
export function readSampleCode(
  code: string,
): { buildingKey: string; floor: string; stack: string } | null {
  for (const sub of SAMPLE_SUBDIVISIONS) {
    const hit = lookupCode(code, {
      companyAliases: [],
      catalogAliases: SAMPLE.aliases.filter((a) => a.kind === "ma_goc"),
      subdivisionSlug: sub.key,
    });
    if (hit.source === "goc") {
      const u = SAMPLE.units.find((x) => x.unitKey === hit.objectKey);
      if (u && u.floor && u.stack)
        return { buildingKey: u.buildingKey, floor: u.floor, stack: u.stack };
    }
  }
  return null;
}

/** Catalog rules: unique unit codes, and a code that looks up to the unit's own tower, floor and stack. */
export function checkSampleCatalog(units: readonly Unit[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const u of units) {
    const code = unitCode(u);
    if (seen.has(code)) errors.push(`mã căn trùng: ${code}`);
    seen.add(code);
    const read = readSampleCode(code);
    if (
      !read ||
      read.buildingKey !== u.buildingKey ||
      read.floor !== u.floor ||
      read.stack !== u.stack
    )
      errors.push(`mã căn lệch thuộc tính: ${code}`);
  }
  return errors;
}

/** Every unit carries the MAU label in its UPI. */
export function checkCatalogLabels(units: readonly Unit[]): string[] {
  return units
    .filter((u) => !u.upi.startsWith(SAMPLE_UPI_PREFIX))
    .map((u) => `thiếu nhãn MAU: căn ${u.upi}`);
}
