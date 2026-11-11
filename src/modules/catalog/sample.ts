// Sample catalog for the MAU sample company (roadmap row 1, decision 0020): Vinhomes Ocean Park 1, 2, 3.
// Pure and deterministic: no clock, no Math.random. Units are fake; project and tower names are public.
// Stack table taken from onehub-quy-hang commit 1f8a6edd, packages/db/seed/du-lieu-mau.mjs.
import { LABELS } from "../../generated/labels";
import type { Unit } from "../../generated/ontology";

const BUILDING_WORD = LABELS.Building.pref.toLowerCase();

/** Every sample unit's UPI starts with this: the unit template has no label field. */
export const SAMPLE_UPI_PREFIX = "urn:onehub:upi:mau:";

export interface SampleBuilding {
  /** Tower code as written in a unit code, e.g. `S1.05`. Also the unit's `buildingKey`. */
  code: string;
  name: string;
}

export interface SampleSubdivision {
  key: string;
  name: string;
  buildings: readonly SampleBuilding[];
  /** How a unit code of this project reads: one example and its reading. */
  codeExample: string;
  codeReading: string;
}

/**
 * Ocean Park 1 towers are four of the eleven public Sapphire 1 towers (S1.01–S1.12, no S1.04). Public sources list no
 * apartment tower names for Ocean Park 2 and 3, so those towers carry a fake name with the [MAU] label (Hỏi-2).
 */
export const SAMPLE_SUBDIVISIONS: readonly SampleSubdivision[] = [
  {
    key: "op1",
    name: "Vinhomes Ocean Park 1",
    buildings: ["S1.01", "S1.02", "S1.03", "S1.05"].map((code) => ({ code, name: code })),
    codeExample: "S1.05-1208",
    codeReading: `${BUILDING_WORD} S1.05 · tầng 12 · trục 08`,
  },
  {
    key: "op2",
    name: "Vinhomes Ocean Park 2 – The Empire",
    buildings: [{ code: "E1", name: `[MAU] ${LABELS.Building.pref} E1` }],
    codeExample: "E1-0903",
    codeReading: `${BUILDING_WORD} E1 · tầng 09 · trục 03`,
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

/** Every unit of the sample catalog: 6 towers × 12 floors × 6 stacks. A fresh array on every call. */
export function sampleUnits(): Unit[] {
  const units: Unit[] = [];
  for (const sub of SAMPLE_SUBDIVISIONS)
    for (const b of sub.buildings)
      for (let floor = FLOORS.from; floor <= FLOORS.to; floor++)
        for (const [i, s] of STACKS.entries()) {
          const unitNumber = `${two(floor)}${two(i + 1)}`;
          units.push({
            upi: `${SAMPLE_UPI_PREFIX}${sub.key}:${b.code.toLowerCase()}:${unitNumber}`,
            subdivisionKey: sub.key,
            buildingKey: b.code,
            buildingName: b.name,
            unitNumber,
            stack: two(i + 1),
            floor,
            livingArea: s.area,
            bedroomsTotal: s.bedrooms,
            directionFaces: s.faces,
            propertyType: "Residential",
            propertySubType: "Condominium",
          });
        }
  return units;
}

/** Name of the project a unit belongs to, for the listing that copies it. */
export function subdivisionNameOf(unit: Pick<Unit, "subdivisionKey">): string | undefined {
  return SAMPLE_SUBDIVISIONS.find((s) => s.key === unit.subdivisionKey)?.name;
}

/** The unit code people type: `S1.05-1208`. */
export const unitCode = (unit: Pick<Unit, "buildingKey" | "unitNumber">) =>
  `${unit.buildingKey}-${unit.unitNumber}`;

/** Reads a unit code back into tower, floor and stack; null when it does not have the sample shape. */
export function readUnitCode(
  code: string,
): { buildingKey: string; floor: number; stack: string } | null {
  const m = /^([A-Z][A-Z0-9.]*)-(\d{2})(\d{2})$/.exec(code);
  if (!m) return null;
  return { buildingKey: m[1]!, floor: Number(m[2]), stack: m[3]! };
}

/** Catalog rules: unique unit codes, and a code that reads back to the unit's own tower, floor and stack. */
export function checkSampleCatalog(units: readonly Unit[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const u of units) {
    const code = unitCode(u);
    if (seen.has(code)) errors.push(`mã căn trùng: ${code}`);
    seen.add(code);
    const read = readUnitCode(code);
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
