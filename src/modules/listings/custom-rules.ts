// Reading a typed or pasted value of one of the company's own fields (row 3g): the cell editor and the paste preview
// call this one rule, so a value the cell takes is the value a paste takes. The server checks it again with the company
// layer's checkCustomValue (row 7e) before it writes. Pure and browser-safe.
import { foldWords } from "./edit-rules";

/** The kinds of a company's own field (CustomField.kind, row 7e). */
export type CustomKind = "text" | "number" | "date" | "single_select" | "boolean";

/** Longest text value a text field takes (TEXT_VALUE_LIMIT of the company layer, row 7e). */
export const CUSTOM_TEXT_LIMIT = 500;

/** Why a typed value does not fit its field. */
export type CustomProblem =
  "too-long" | "not-a-number" | "not-a-date" | "not-an-option" | "not-yes-no";

export type CustomRead =
  { ok: true; value: string | number | boolean | null } | { ok: false; problem: CustomProblem };

const DAY = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A calendar day that really exists, written yyyy-mm-dd. */
function realDay(y: number, m: number, d: number): string | null {
  const day = new Date(Date.UTC(y, m - 1, d));
  const iso = day.toISOString().slice(0, 10);
  return day.getUTCFullYear() === y && day.getUTCMonth() === m - 1 && day.getUTCDate() === d
    ? iso
    : null;
}

/** A number written the Vietnamese way: «1.250» is one thousand two hundred fifty, «1,5» is one and a half. */
function readNumber(raw: string): number | null {
  const text = raw.replace(/\s/g, "");
  if (!/^-?[\d.,]+$/.test(text)) return null;
  const plain = text.replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(plain)) return null;
  const value = Number(plain);
  return Number.isFinite(value) ? value : null;
}

const YES = new Set(["co", "yes", "true", "x"]);
const NO = new Set(["khong", "no", "false"]);

/**
 * What a typed or pasted text means for a field of `kind`: an empty text clears the value; a choice must be one of the
 * field's options (same spelling once accents and case are set aside, kept as the option is written).
 */
export function readCustomValue(
  kind: CustomKind,
  raw: string,
  options: readonly string[] = [],
  /** Longest text this field takes: the company layer's 500, or 200 for legal status and financing (row 3g). */
  textLimit: number = CUSTOM_TEXT_LIMIT,
): CustomRead {
  const text = raw.trim();
  if (text === "") return { ok: true, value: null };
  switch (kind) {
    case "text":
      return text.length > textLimit
        ? { ok: false, problem: "too-long" }
        : { ok: true, value: text };
    case "number": {
      const value = readNumber(text);
      return value === null ? { ok: false, problem: "not-a-number" } : { ok: true, value };
    }
    case "date": {
      const vn = DAY.exec(text);
      const iso = ISO.exec(text);
      const day = vn
        ? realDay(Number(vn[3]), Number(vn[2]), Number(vn[1]))
        : iso
          ? realDay(Number(iso[1]), Number(iso[2]), Number(iso[3]))
          : null;
      return day === null ? { ok: false, problem: "not-a-date" } : { ok: true, value: day };
    }
    case "single_select": {
      const wanted = foldWords(text);
      const option = options.find((o) => foldWords(o) === wanted);
      return option === undefined
        ? { ok: false, problem: "not-an-option" }
        : { ok: true, value: option };
    }
    case "boolean": {
      const word = foldWords(text);
      if (YES.has(word)) return { ok: true, value: true };
      if (NO.has(word)) return { ok: true, value: false };
      return { ok: false, problem: "not-yes-no" };
    }
  }
}

/** Whether two stored values of a field are the same (a write that changes nothing is not sent). */
export const sameCustomValue = (a: unknown, b: unknown): boolean => (a ?? null) === (b ?? null);
