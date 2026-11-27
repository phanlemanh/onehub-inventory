import { checkCustomValue, type CustomFieldShape } from "@/modules/company-config";
import type { CustomCheck } from "@/modules/listings";

/**
 * The company layer's value rule for one company's live fields (row 3g): a custom value fits its live field; a field the
 * company does not have, or retired, takes none. A layer that could not be read is a server fault, never «retired».
 */
export function customCheckOf(
  fields: readonly (CustomFieldShape & { code: string })[] | null,
): CustomCheck {
  if (fields === null) throw new Error("company layer unreadable");
  const byCode = new Map(fields.map((f) => [f.code, f]));
  return (code, value) => {
    const field = byCode.get(code);
    return field ? checkCustomValue(field, value) : { ok: false, reason: "field-retired" };
  };
}
