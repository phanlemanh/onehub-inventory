// Unit-code reader of the shared catalog (row 7d): exactly the eight forms of onehub-invest's tachMa
// (onehub-invest pipeline/lib/ma-can-s08.mjs), so both products split a typed code the same way. Every form must match
// the whole code; a code that matches no form or two forms is refused with a reason, never guessed.

export interface UnitCodeForm {
  id: string;
  /** Three groups: tower, floor, stack. */
  re: RegExp;
}

export const UNIT_CODE_FORMS: readonly UnitCodeForm[] = Object.freeze([
  { id: "gach", re: /^([A-Z]\d{2}[A-Z]?)-(\d{2})-(\d{2}[A-Z]?)$/ },
  { id: "cham", re: /^([A-Z]{1,2}\d?)\.(\d{2})\.(\d{2})$/ },
  { id: "tien-to-x", re: /^[A-Z0-9]{5}_([A-Z]{1,2}\d?)-X(\d{2})\.(\d{2})$/ },
  { id: "dinh-cham", re: /^([A-Z]{2}\d{1,2})(\d{2})\.(\d{2})$/ },
  { id: "toa-cham-bon", re: /^([A-Z]\d{1,2}\.\d{2})(\d{2})\.(\d{2})$/ },
  { id: "toa-cham-dinh", re: /^([A-Z]\d{1,2}\.\d{2})(\d{2}|\d{1,2}A)(\d{1,2}A?)$/ },
  { id: "dinh-lien", re: /^([A-Z]{2}\d)(\d{2})(\d{2})$/ },
  { id: "chan-de", re: /^([A-Z]{2}\d)(\d{2})(S\d{2})$/ },
]);

export type RefusalReason = "ma-rong" | "khong-khop-khuon" | "nhieu-khuon";

export type UnitCodeReading =
  | { building: string; floor: string; stack: string; form: string }
  | { refused: RefusalReason; forms?: string[] };

/** A floor in the RESO UnitFloorLocation sense: digits with an optional letter, no leading zero (7, 15A, 0). */
export const FLOOR_PATTERN = /^(0|[1-9][0-9]*)[A-Z]?$/;

export const isFloor = (value: string): boolean => FLOOR_PATTERN.test(value);

/** Drops leading zeros and keeps a letter suffix: "07" → "7", "015A" → "15A", "00" → "0". */
export function normaliseFloor(raw: string): string {
  const m = /^0*(\d+)([A-Z]?)$/.exec(raw);
  return m ? `${m[1]}${m[2]}` : raw;
}

/** Reads a typed unit code into tower, floor and stack with the given forms (the shared eight by default). */
export function readUnitCode(
  code: string | null | undefined,
  forms: readonly UnitCodeForm[] = UNIT_CODE_FORMS,
): UnitCodeReading {
  if (typeof code !== "string" || !code.trim()) return { refused: "ma-rong" };
  const s = code.trim().toUpperCase();
  const hits = forms.flatMap((f) => {
    const m = f.re.exec(s);
    return m ? [{ building: m[1]!, floor: normaliseFloor(m[2]!), stack: m[3]!, form: f.id }] : [];
  });
  if (hits.length === 0) return { refused: "khong-khop-khuon" };
  if (hits.length > 1) return { refused: "nhieu-khuon", forms: hits.map((h) => h.form) };
  return hits[0]!;
}
