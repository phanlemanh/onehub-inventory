"use client";

import { useEffect, useMemo } from "react";

import {
  alignFor,
  columnWidthCh,
  typedColumn,
  type FieldKey,
  type TypedColumn,
} from "@/components/candidate/column-kind";
import { DataRegion, type GridRow } from "@/components/candidate/data-region";
import { RowActions, type RecordAction } from "@/components/candidate/row-actions";
import { Badge } from "@/components/reui/badge";
import { Frame, FrameDescription, FrameHeader, FramePanel } from "@/components/reui/frame";
import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import type { DisplayKind } from "@/generated/display";
import { label } from "@/modules/company-config";
import { PermittedAction } from "@/modules/identity/ui";

import { PARTS, PROTO_7E as C, type Part } from "./copy";
import { PART_COLUMNS, sampleLayer, type LayerItem } from "./sample";

export type Shape = "a" | "b" | "bang-hang";

// Stand-in until manageCompanyLayer is in the permission table: the same three roles as manageCompanyCodes (Hỏi-1).
const MANAGE = "manageCompanyCodes" as const;

/** A column whose kind the prototype declares, not the generated ontology table. */
function column(code: string, header: string, kind: DisplayKind): TypedColumn {
  return {
    field: `custom.${code}` as FieldKey,
    header,
    kind,
    align: alignFor(kind),
    widthCh: columnWidthCh(header, kind),
  };
}

function actionsFor(part: Part, item: LayerItem): RecordAction[] {
  const list: RecordAction[] = [];
  if (part === "nhan" || part === "truong")
    list.push({
      action: MANAGE,
      label: C.rename,
      onSelect: () => notifyResult({ message: `${C.rename}: ${item.name}` }),
    });
  list.push({
    action: MANAGE,
    label: C.retire,
    remove: {
      verb: `${C.retire} ${item.name}`,
      what: C.retireWhat,
      done: `Đã ${C.retire.toLowerCase()}`,
      apply: async () => {},
    },
  });
  return list;
}

function MatchButton() {
  return (
    <PermittedAction action={MANAGE}>
      <Button size="sm" variant="outline" onClick={() => notifyResult({ message: C.matched })}>
        {C.match}
      </Button>
    </PermittedAction>
  );
}

/** Shape A: the part chosen in the App Shell's second column fills the content area as one grid. */
function ShapeA({ part }: { part: Part }) {
  const layer = useMemo(() => sampleLayer(), []);
  const items = layer[part];
  const columns = PART_COLUMNS[part].map(([code, header]) => column(code, header, "text"));
  const rows = items.map(
    (item) =>
      ({
        id: item.id,
        ...Object.fromEntries(Object.entries(item.cells).map(([k, v]) => [`custom.${k}`, v])),
      }) as GridRow,
  );
  return (
    <>
      <PageHeader title={C.parts[part]} action={part === "can-cho" ? <MatchButton /> : undefined} />
      <DataRegion
        title={C.parts[part]}
        columns={columns}
        rows={rows}
        emptyWhy={C.empty[part]}
        rowActions={(row) => ({
          actions: actionsFor(
            part,
            items.find((i) => i.id === row.id)!,
          ),
          mine: true,
        })}
      />
    </>
  );
}

const SHOWN = 5;

/** Only a state that differs between rows gets a badge: every listed label, field or entry is in use. */
function StateBadge({ state }: { state: LayerItem["state"] }) {
  if (state === "use") return null;
  return (
    <Badge variant={state === "many" ? "warning" : "secondary"} size="sm">
      {state === "many" ? C.manyMatch : C.waiting}
    </Badge>
  );
}

/**
 * Shape B, built after the picture of ReUI settings-4 (not its code): one Frame with the screen's title, then one group
 * per part — title, one line, and compact rows of name · one line · state · «…». A long part shows its first five.
 */
function ShapeB({ part }: { part: Part }) {
  const layer = useMemo(() => sampleLayer(), []);
  useEffect(() => {
    if (part !== "nhan") document.getElementById(`phan-${part}`)?.scrollIntoView();
  }, [part]);
  return (
    <>
      <PageHeader title={C.screen} />
      <Frame className="w-full max-w-3xl">
        {/* The block's header keeps its line; the title is the page header's, and «New» goes (Hỏi-2: adding is the
            import's job). */}
        <FrameHeader>
          <FrameDescription>{C.screenWhy}</FrameDescription>
        </FrameHeader>
        {PARTS.map((p) => {
          const items = layer[p];
          return (
            <FramePanel key={p} id={`phan-${p}`} className="scroll-mt-20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{C.parts[p]}</h2>
                  <p className="text-sm text-muted-foreground">{C.partWhy[p]}</p>
                </div>
                {p === "can-cho" ? <MatchButton /> : null}
              </div>
              <ul className="mt-3 divide-y divide-dashed">
                {items.slice(0, SHOWN).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{item.line}</p>
                    </div>
                    <StateBadge state={item.state} />
                    <RowActions actions={actionsFor(p, item)} mine title={item.name} />
                  </li>
                ))}
              </ul>
              {items.length > SHOWN ? (
                <Button variant="link" size="sm">
                  {C.seeAll(items.length)}
                </Button>
              ) : null}
            </FramePanel>
          );
        })}
      </Frame>
    </>
  );
}

const VIEWS = ["Biển", "Hồ", "Phố", "Nội khu"];

/** The inventory of the sample company with two company labels and two custom fields after the standard columns. */
function Inventory({ rows }: { rows: readonly GridRow[] }) {
  const columns: TypedColumn[] = [
    typedColumn({ field: "Listing.unitNumber", header: label("Unit") }),
    typedColumn({ field: "Listing.buildingName", header: "Block" }),
    typedColumn({ field: "Listing.subdivisionName", header: label("Subdivision") }),
    typedColumn({ field: "Listing.standardStatus", header: label("StandardStatus") }),
    typedColumn({ field: "Listing.listPrice", header: "Giá KBP" }),
    typedColumn({ field: "Unit.livingArea", header: label("LivingArea") }),
    typedColumn({ field: "Unit.bedroomsTotal", header: label("BedroomsTotal") }),
    typedColumn({ field: "Listing.lastConfirmedAt", header: label("LastConfirmedAt") }),
    column("huong_view", "Hướng view", "select"),
    column("ghi_chu", "Ghi chú nội bộ", "text"),
  ];
  const withCustom = rows.map(
    (r, i) =>
      ({
        ...r,
        "custom.huong_view": i % 5 === 4 ? null : VIEWS[i % VIEWS.length],
        "custom.ghi_chu": i % 3 === 0 ? "Chủ cần bán trước Tết" : null,
      }) as GridRow,
  );
  return (
    <>
      <PageHeader title={label("Inventory")} />
      <DataRegion title={label("Inventory")} columns={columns} rows={withCustom} emptyWhy="" />
    </>
  );
}

/** The design-pass prototype of row 7e: shape A or B of the review screen, or the inventory with the company's words. */
export function LayerShowcase({
  shape,
  part,
  rows,
}: {
  shape: Shape;
  part: Part;
  rows: readonly GridRow[];
}) {
  return (
    // The region's own search box is gone from every grid (row 2e, owner 2026-11-13): hidden here until 2e lands.
    <div className="flex flex-col gap-4 [&_[data-slot=region-toolbar]>div:has(input[type=search])]:hidden">
      {shape === "a" ? <ShapeA part={part} /> : null}
      {shape === "b" ? <ShapeB part={part} /> : null}
      {shape === "bang-hang" ? <Inventory rows={rows} /> : null}
    </div>
  );
}
