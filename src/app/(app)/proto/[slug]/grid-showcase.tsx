"use client";

import { useMemo, useState } from "react";

import { typedColumn, type TypedColumn } from "@/components/candidate/column-kind";
import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import { Button } from "@/components/ui/button";
import type { ListingStandardStatus } from "@/generated/ontology";
import { label } from "@/modules/company-config";

const STATUSES: readonly ListingStandardStatus[] = [
  "Active",
  "Pending",
  "Incomplete",
  "Hold",
  "Closed",
  "Withdrawn",
];

/** 120 made-up rows for the prototype: codes and numbers only, no person. */
function sampleRows(): GridRow[] {
  return Array.from({ length: 120 }, (_, i) => {
    const building = `S${(i % 3) + 1}.0${(i % 5) + 1}`;
    const floor = (i % 28) + 2;
    return {
      id: `mau-${i + 1}`,
      "Listing.unitNumber": `${building}-${String(floor).padStart(2, "0")}${String((i % 12) + 1).padStart(2, "0")}`,
      "Listing.buildingName": building,
      "Listing.subdivisionName":
        i % 4 === 0
          ? `Ocean Park ${(i % 3) + 1}, dãy căn hộ ven hồ phía đông gần cổng chính`
          : `Ocean Park ${(i % 3) + 1}`,
      "Listing.standardStatus": STATUSES[i % STATUSES.length],
      "Listing.listPrice": 1_800_000_000 + ((i * 137_000_000) % 6_400_000_000),
      "Unit.livingArea": 32 + ((i * 7.5) % 110),
      "Unit.bedroomsTotal": (i % 4) + 1,
      "Listing.lastConfirmedAt": new Date(
        Date.UTC(2026, 10, 1 + (i % 10), 2 + (i % 9)),
      ).toISOString(),
      "Listing.closeDate": i % 6 === 4 ? `2026-10-${String((i % 27) + 1).padStart(2, "0")}` : null,
      locked: i === 2 ? { "Listing.listPrice": "giá đang được kiểm lại" } : undefined,
    };
  });
}

function columnsFor(few: boolean): TypedColumn[] {
  const all = [
    typedColumn({ field: "Listing.unitNumber", header: label("Unit") }),
    typedColumn({ field: "Listing.standardStatus", header: "Trạng thái" }),
    typedColumn({ field: "Listing.listPrice", header: "Giá" }),
    typedColumn({ field: "Unit.livingArea", header: "Diện tích" }),
    typedColumn({ field: "Unit.bedroomsTotal", header: "Phòng ngủ" }),
    typedColumn({ field: "Listing.buildingName", header: label("Building") }),
    typedColumn({ field: "Listing.subdivisionName", header: label("Subdivision") }),
    typedColumn({ field: "Listing.lastConfirmedAt", header: "Xác nhận lần cuối" }),
    typedColumn({ field: "Listing.closeDate", header: label("CloseDate") }),
  ];
  return few ? all.slice(0, 3) : all;
}

const STATE_OF: Record<string, RegionStatus> = {
  loading: "loading",
  error: "error",
  partial: "partial",
  forbidden: "forbidden",
};

/** The design-pass prototype of the shared grid, with every region state behind `?state=`. */
export function GridShowcase({ state, few }: { state?: string; few: boolean }) {
  const [status, setStatus] = useState<RegionStatus>(STATE_OF[state ?? ""] ?? "ready");
  const all = useMemo(() => sampleRows(), []);
  const rows = state === "empty" ? [] : status === "partial" ? all.slice(0, 40) : all;
  return (
    <DataRegion
      title="Vùng mẫu"
      columns={columnsFor(few)}
      rows={rows}
      status={status}
      onRetry={() => setStatus("ready")}
      emptyWhy="Chưa có dòng nào được nhập vào vùng này."
      emptyAction={<Button variant="outline">Nhập tệp Excel</Button>}
      action={{ node: <Button>Thêm dòng</Button>, allowed: true }}
    />
  );
}
