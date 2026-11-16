// The inventory's two fee columns (row 19, thue-phi): the net to seller worked out from each listing's list price and fee
// inclusion under the signed-in company's fee schedule, and the fee inclusion by its label. Pure; the page reads the
// schedule through company-config's door and hands it in. Internal: the customer page never reads these (SP-4).
import type { GridRow } from "@/components/candidate/data-region";
import type { Listing } from "@/generated/ontology";
import { label, netToSeller, type FeeItemValue } from "@/modules/company-config";
import {
  FEE_INCLUSION_FIELD,
  NET_TO_SELLER_FIELD,
  type InventoryFeeHeaders,
} from "@/modules/listings/ui";

/** Headers of the two fee columns, from the label table. */
export function feeHeaders(): InventoryFeeHeaders {
  return { netToSeller: label("NetToSeller"), feeInclusion: label("FeeInclusion") };
}

/**
 * The rows with net to seller and the fee inclusion's label added, matched to their listing by id. Without a schedule the
 * company could read, net to seller stays empty — never worked out with another company's or a guessed rate.
 */
export function withFees(
  rows: readonly GridRow[],
  listings: readonly Pick<Listing, "id" | "listPrice" | "feeInclusion">[],
  items: readonly Pick<FeeItemValue, "rateBasisPoints" | "included">[] | null,
): GridRow[] {
  const byId = new Map(listings.map((l) => [l.id, l]));
  const words = { Included: label("FeeIncluded"), Excluded: label("FeeExcluded") } as const;
  return rows.map((row) => {
    const l = byId.get(row.id);
    const inclusion = l?.feeInclusion ?? null;
    return {
      ...row,
      [FEE_INCLUSION_FIELD]: inclusion ? words[inclusion] : null,
      [NET_TO_SELLER_FIELD]: items && l ? netToSeller(l.listPrice, inclusion, items) : null,
    };
  });
}
