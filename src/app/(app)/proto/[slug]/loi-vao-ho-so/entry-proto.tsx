import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import { inventoryRows, type InventoryField } from "@/modules/listings/ui";

import { SCENES, type Scene } from "./copy";
import { EntryShowcase } from "./showcase";

const HEADERS: Record<InventoryField, string> = {
  "Listing.unitNumber": label("Unit"),
  "Listing.buildingName": label("Building"),
  "Listing.subdivisionName": label("Subdivision"),
  "Listing.standardStatus": label("StandardStatus"),
  "Listing.listPrice": label("ListPrice"),
  "Unit.livingArea": label("LivingArea"),
  "Unit.bedroomsTotal": label("BedroomsTotal"),
  "Listing.lastConfirmedAt": label("LastConfirmedAt"),
};

/**
 * Development-only clickable prototype of row 3f (loi-vao-ho-so) for its scope gate, served by the proto page at /proto/loi-vao-ho-so. `canh` picks the scene
 * (ngan · trang · nhieu · khong · go-ma) and `bang=an` hides the control board for screenshots.
 */
export function EntryProto({ q }: { q: Record<string, string | string[] | undefined> }) {
  const scene: Scene =
    typeof q.canh === "string" && (SCENES as readonly string[]).includes(q.canh)
      ? (q.canh as Scene)
      : "ngan";
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const rows = inventoryRows({ listings, listingUnits, units });
  const row = rows[0]!;
  const otherBuilding =
    rows
      .map((r) => String(r["Listing.buildingName"]))
      .find((b) => b !== row["Listing.buildingName"]) ?? "S2.05";
  return (
    <EntryShowcase
      scene={scene}
      bare={q.bang === "an"}
      row={row}
      otherBuilding={otherBuilding}
      headers={HEADERS}
      words={{ unit: label("Unit"), building: label("Building"), inventory: label("Inventory") }}
    />
  );
}
