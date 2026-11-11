"use client";

import { useState } from "react";

import { typedColumn } from "@/components/candidate/column-kind";
import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import { TypedCell } from "@/components/candidate/typed-cell";
import { useChange } from "@/components/candidate/use-change";
import { Button } from "@/components/ui/button";
import { label } from "@/modules/company-config";

/** Made-up listings for the prototype: codes and numbers only, no person. */
function sampleListings(): GridRow[] {
  return Array.from({ length: 24 }, (_, i) => {
    const building = `S${(i % 3) + 1}.0${(i % 5) + 1}`;
    return {
      id: `can-${i + 1}`,
      "Listing.unitNumber": `${building}-${String((i % 28) + 2).padStart(2, "0")}${String((i % 12) + 1).padStart(2, "0")}`,
      "Listing.buildingName": building,
      "Listing.standardStatus": i % 3 === 0 ? "Active" : "Pending",
      "Listing.listPrice": 1_800_000_000 + i * 137_000_000,
      "Unit.livingArea": 32 + i * 3.5,
      "Unit.bedroomsTotal": (i % 4) + 1,
      "Listing.lastConfirmedAt": new Date(Date.UTC(2026, 10, 1 + (i % 10), 2)).toISOString(),
    };
  });
}

/** Made-up people: placeholder names and the reserved test numbers only (.claude/rules/personal-data.md). */
function samplePeople(): GridRow[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `nguoi-${i + 1}`,
    "Contact.fullName": `[Tên] ${String(i + 1).padStart(2, "0")}`,
    "Contact.phones": `0900000${String(i + 1).padStart(3, "0")}`,
    "Contact.contactTypes": i % 2 === 0 ? "Loại 1" : "Loại 2",
  }));
}

const LISTING_COLUMNS = [
  typedColumn({ field: "Listing.unitNumber", header: label("Unit") }),
  typedColumn({ field: "Listing.standardStatus", header: "Trạng thái" }),
  typedColumn({ field: "Listing.listPrice", header: "Giá" }),
  typedColumn({ field: "Unit.livingArea", header: "Diện tích" }),
  typedColumn({ field: "Unit.bedroomsTotal", header: "Phòng ngủ" }),
  typedColumn({ field: "Listing.buildingName", header: label("Building") }),
  typedColumn({ field: "Listing.lastConfirmedAt", header: "Xác nhận lần cuối" }),
];

const PEOPLE_COLUMNS = [
  typedColumn({ field: "Contact.fullName", header: "Họ tên" }),
  typedColumn({ field: "Contact.phones", header: "Số điện thoại" }),
  typedColumn({ field: "Contact.contactTypes", header: "Loại" }),
];

function Facts({
  row,
  fields,
}: {
  row: GridRow;
  fields: readonly (typeof LISTING_COLUMNS)[number][];
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
      {fields.map((column) => (
        <div key={column.field} className="contents">
          <dt className="text-muted-foreground">{column.header}</dt>
          <dd>
            <TypedCell kind={column.kind} value={row[column.field]} transaction={row.transaction} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

const STATUS_OF: Record<string, RegionStatus> = {
  loading: "loading",
  "loading-no-cancel": "loading",
  error: "error",
  "error-no-retry": "error",
  "partial-empty": "partial",
  forbidden: "forbidden",
};

/**
 * The prototype of row 1e: one record panel for listings and people, loading by delay, error with and without a
 * reload, permission on the region's button, and the shared save door with undo or confirmation. `?state=` picks a
 * region state; `?quyen=khong` takes the «Thêm dòng» permission away.
 */
export function BehaviorShowcase({ state, denied }: { state?: string; denied: boolean }) {
  const [view, setView] = useState<"listings" | "people">("listings");
  const [status, setStatus] = useState<RegionStatus>(STATUS_OF[state ?? ""] ?? "ready");
  const [listings, setListings] = useState(sampleListings);
  const people = samplePeople();
  const { run, dialog } = useChange();
  const ready = () => setStatus("ready");

  const first = listings[0];
  const changePrice = () => {
    if (!first) return;
    const before = first["Listing.listPrice"];
    const setPrice = (price: unknown) =>
      setListings((rows) =>
        rows.map((row) => (row.id === first.id ? { ...row, "Listing.listPrice": price } : row)),
      );
    void run({
      verb: "Tăng giá",
      what: "Giá căn đầu bảng tăng 100 triệu.",
      done: `Đã tăng giá căn ${String(first["Listing.unitNumber"])}.`,
      reversible: true,
      apply: () => setPrice(Number(before) + 100_000_000),
      undo: () => setPrice(before),
    });
  };
  const removeFirst = () => {
    if (!first) return;
    void run({
      verb: "Gỡ căn",
      what: `${label("Unit")} ${String(first["Listing.unitNumber"])} sẽ bị gỡ khỏi bảng và không lấy lại được.`,
      done: `Đã gỡ căn ${String(first["Listing.unitNumber"])}.`,
      reversible: false,
      apply: () => setListings((rows) => rows.slice(1)),
    });
  };

  const listingsShown = state === "partial-empty" ? [] : listings;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={view === "listings" ? "default" : "outline"}
          aria-pressed={view === "listings"}
          onClick={() => setView("listings")}
        >
          Lưới căn
        </Button>
        <Button
          variant={view === "people" ? "default" : "outline"}
          aria-pressed={view === "people"}
          onClick={() => setView("people")}
        >
          Lưới người
        </Button>
        <Button variant="outline" onClick={changePrice}>
          Tăng giá căn đầu
        </Button>
        <Button variant="outline" onClick={removeFirst}>
          Gỡ căn đầu
        </Button>
      </div>
      {view === "listings" ? (
        <DataRegion
          title={`${label("Unit")} mẫu`}
          columns={LISTING_COLUMNS}
          rows={listingsShown}
          status={status}
          editable
          onRetry={state === "error-no-retry" ? undefined : ready}
          onCancel={state === "loading-no-cancel" ? undefined : ready}
          action={{ node: <Button>Thêm dòng</Button>, allowed: !denied }}
          record={{
            render: (row) => ({
              title: String(row["Listing.unitNumber"]),
              body: <Facts row={row} fields={LISTING_COLUMNS} />,
            }),
          }}
        />
      ) : (
        <DataRegion
          title="Người mẫu"
          columns={PEOPLE_COLUMNS}
          rows={people}
          action={{ node: <Button>Thêm dòng</Button>, allowed: !denied }}
          record={{
            render: (row) => ({
              title: String(row["Contact.fullName"]),
              body: <Facts row={row} fields={PEOPLE_COLUMNS} />,
            }),
          }}
        />
      )}
      {dialog}
    </div>
  );
}
