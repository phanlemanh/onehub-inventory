// Code lookup of the catalog (row 7d, rule code-lookup-order): a typed code resolves by the company's own codes first,
// then the catalog's original codes, then the shared reader. The caller passes the codes of exactly one company.
import { readUnitCode, type UnitCodeReading } from "./unit-code";

export interface CodeAlias {
  objectKey: string;
  value: string;
}

export type CodeLookup =
  | { source: "san" | "goc"; objectKey: string }
  | { source: "doc"; reading: Extract<UnitCodeReading, { building: string }> }
  | { source: null; reason: "khong-tim-thay" };

const fold = (s: string) => s.trim().toUpperCase();

/** Original codes are stored as `<project slug>/<CODE>`; a bare code is tried under the given project. */
export function lookupCode(
  code: string,
  sources: {
    companyAliases: readonly CodeAlias[];
    catalogAliases: readonly CodeAlias[];
    subdivisionSlug?: string;
  },
): CodeLookup {
  const want = fold(code);
  if (want) {
    const own = sources.companyAliases.find((a) => fold(a.value) === want);
    if (own) return { source: "san", objectKey: own.objectKey };
    const candidates = [want];
    if (sources.subdivisionSlug) candidates.push(fold(`${sources.subdivisionSlug}/${code}`));
    const original = sources.catalogAliases.find((a) => candidates.includes(fold(a.value)));
    if (original) return { source: "goc", objectKey: original.objectKey };
  }
  const reading = readUnitCode(code);
  if ("building" in reading) return { source: "doc", reading };
  return { source: null, reason: "khong-tim-thay" };
}
