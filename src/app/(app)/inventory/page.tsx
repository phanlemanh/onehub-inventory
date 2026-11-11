import type { Metadata } from "next";

import { PageHeader } from "@/components/templates/page-header";
import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import {
  InventoryGrid,
  inventoryRows,
  inventoryStateFrom,
  type InventoryField,
} from "@/modules/listings/ui";

export const metadata: Metadata = { title: label("Inventory") };

// Design pass before the scope gate: five headers wait for the owner's answer on new labels (Hỏi-2). Once approved
// they move to ontology/labels.yaml and these literals go (tests/language.test.ts then flags any left behind).
const HEADERS: Record<InventoryField, string> = {
  "Listing.unitNumber": label("Unit"),
  "Listing.buildingName": label("Building"),
  "Listing.subdivisionName": label("Subdivision"),
  "Listing.standardStatus": "Trạng thái",
  "Listing.listPrice": "Giá chào",
  "Unit.livingArea": "Diện tích",
  "Unit.bedroomsTotal": "Phòng ngủ",
  "Listing.lastConfirmedAt": "Xác nhận lúc",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Inventory, read-only: the sample company's listings (roadmap row 1) on the shared grid. */
export default async function Page({ searchParams }: Props) {
  const { state } = await searchParams;
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  return (
    <>
      <PageHeader title={label("Inventory")} />
      <InventoryGrid
        title={label("Listing")}
        headers={HEADERS}
        rows={inventoryRows({ listings, listingUnits, units })}
        state={inventoryStateFrom(
          typeof state === "string" ? state : undefined,
          process.env.NODE_ENV,
        )}
        emptyWhy="Sàn chưa có căn nào đang chào trên Bảng hàng."
      />
    </>
  );
}
