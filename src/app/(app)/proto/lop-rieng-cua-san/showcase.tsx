"use client";

import { useMemo, useState } from "react";

import {
  alignFor,
  columnWidthCh,
  typedColumn,
  type FieldKey,
  type TypedColumn,
} from "@/components/candidate/column-kind";
import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import type { RecordAction } from "@/components/candidate/row-actions";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame";
import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import type { DisplayKind } from "@/generated/display";
import type { Role } from "@/generated/ontology";
import { label } from "@/modules/company-config";
import { PermittedAction, SessionRoles } from "@/modules/identity/ui";

// Prototype words: the build moves every one of them to ontology/labels.yaml (Hỏi-5 names the screen).
const W = {
  screen: "Tuỳ chỉnh của sàn",
  parts: {
    nhan: "Nhãn riêng",
    truong: "Trường riêng",
    "tu-dien": "Từ điển giá trị",
    "can-cho": "Căn chờ khớp",
    mau: "Mẫu nhập",
  },
  empty: {
    nhan: "Sàn chưa đặt nhãn riêng. Nhãn riêng sinh ra khi nhập bảng hàng.",
    truong: "Sàn chưa có trường riêng. Trường riêng sinh ra khi nhập bảng hàng.",
    "tu-dien": "Sàn chưa có từ điển giá trị. Từ điển sinh ra khi nhập bảng hàng.",
    "can-cho": "Không có căn nào chờ khớp với danh mục.",
    mau: "Sàn chưa có mẫu nhập. Mẫu nhập sinh ra sau lần nhập đầu.",
  },
  rename: "Đổi chữ",
  retire: "Ngừng dùng",
  match: "Khớp với danh mục",
  matched: "Đã khớp 1 căn, còn 2 căn chờ",
  col: {
    concept: "Khái niệm chuẩn",
    own: "Chữ của sàn",
    name: "Tên trường",
    kind: "Kiểu",
    options: "Lựa chọn",
    field: "Trường",
    raw: "Chữ thô",
    value: "Giá trị chuẩn",
    code: "Mã sàn gõ",
    state: "Tình trạng",
    template: "Tên mẫu",
    columns: "Số cột",
  },
} as const;

type Part = keyof typeof W.parts;
export type Scene = {
  canh: "bang-hang" | "a" | "b" | "c";
  phan: Part;
  state: "ready" | "empty" | "error" | "forbidden" | "loading";
  readOnly: boolean;
};

/** A column whose kind the company's field declares, not the generated ontology table (row 7e, AC-8). */
function customColumn(code: string, header: string, kind: DisplayKind): TypedColumn {
  return {
    field: `custom.${code}` as FieldKey,
    header,
    kind,
    align: alignFor(kind),
    widthCh: columnWidthCh(header, kind),
  };
}

const VIEWS = ["Biển", "Hồ", "Phố", "Nội khu"];

function inventoryScene(rows: readonly GridRow[]) {
  const columns: TypedColumn[] = [
    typedColumn({ field: "Listing.unitNumber", header: label("Unit") }),
    typedColumn({ field: "Listing.buildingName", header: "Block" }),
    typedColumn({ field: "Listing.subdivisionName", header: label("Subdivision") }),
    typedColumn({ field: "Listing.standardStatus", header: label("StandardStatus") }),
    typedColumn({ field: "Listing.listPrice", header: "Giá KBP" }),
    typedColumn({ field: "Unit.livingArea", header: label("LivingArea") }),
    typedColumn({ field: "Unit.bedroomsTotal", header: label("BedroomsTotal") }),
    typedColumn({ field: "Listing.lastConfirmedAt", header: label("LastConfirmedAt") }),
    customColumn("huong_view", "Hướng view", "select"),
    customColumn("ghi_chu", "Ghi chú", "text"),
  ];
  const withCustom = rows.map((r, i) => ({
    ...r,
    "custom.huong_view": i % 5 === 4 ? null : VIEWS[i % VIEWS.length],
    "custom.ghi_chu": i % 3 === 0 ? "Chủ cần bán trước Tết" : null,
  }));
  return { columns, rows: withCustom };
}

function partData(part: Part): { columns: TypedColumn[]; rows: Record<string, unknown>[] } {
  const t = (field: FieldKey, header: string) => customColumn(String(field), header, "text");
  switch (part) {
    case "nhan":
      return {
        columns: [t("concept" as FieldKey, W.col.concept), t("own" as FieldKey, W.col.own)],
        rows: [
          { id: "n1", "custom.concept": label("Building"), "custom.own": "Block" },
          { id: "n2", "custom.concept": label("ListPrice"), "custom.own": "Giá KBP" },
          { id: "n3", "custom.concept": label("Subdivision"), "custom.own": "Phân khu" },
        ],
      };
    case "truong":
      return {
        columns: [
          t("name" as FieldKey, W.col.name),
          t("kind" as FieldKey, W.col.kind),
          t("options" as FieldKey, W.col.options),
        ],
        rows: [
          {
            id: "t1",
            "custom.name": "Hướng view",
            "custom.kind": "Chọn một",
            "custom.options": VIEWS.join(", "),
          },
          { id: "t2", "custom.name": "Ghi chú", "custom.kind": "Chữ", "custom.options": null },
          {
            id: "t3",
            "custom.name": "Đã có sổ",
            "custom.kind": "Có/không",
            "custom.options": null,
          },
        ],
      };
    case "tu-dien":
      return {
        columns: [
          t("field" as FieldKey, W.col.field),
          t("raw" as FieldKey, W.col.raw),
          t("value" as FieldKey, W.col.value),
        ],
        rows: [
          {
            id: "d1",
            "custom.field": label("StandardStatus"),
            "custom.raw": "còn",
            "custom.value": label("StatusActive"),
          },
          { id: "d2", "custom.field": "Hướng view", "custom.raw": "biển", "custom.value": "Biển" },
          { id: "d3", "custom.field": "Hướng", "custom.raw": "ĐN", "custom.value": "Đông Nam" },
        ],
      };
    case "can-cho":
      return {
        columns: [t("code" as FieldKey, W.col.code), t("state" as FieldKey, W.col.state)],
        rows: [
          { id: "c1", "custom.code": "SA5-12.08", "custom.state": "Chờ khớp" },
          { id: "c2", "custom.code": "S1.05 - 1208", "custom.state": "Chờ khớp" },
          {
            id: "c3",
            "custom.code": "Sapphire 5 tầng 12",
            "custom.state": "Nhiều căn khớp, chờ người",
          },
        ],
      };
    case "mau":
      return {
        columns: [
          t("template" as FieldKey, W.col.template),
          t("columns" as FieldKey, W.col.columns),
        ],
        rows: [{ id: "m1", "custom.template": "Bảng hàng tháng 11", "custom.columns": "12 cột" }],
      };
  }
}

// Stand-in until manageCompanyLayer is in the permission table: the same three roles as manageCompanyCodes (Hỏi-1).
const MANAGE = "manageCompanyCodes" as const;

function PartRegion({ part, state }: { part: Part; state: Scene["state"] }) {
  const [matched, setMatched] = useState(false);
  const data = useMemo(() => partData(part), [part]);
  const status: RegionStatus = state === "empty" ? "ready" : state;
  const rows = state === "empty" ? [] : (data.rows as GridRow[]);
  const actions = (row: GridRow): RecordAction[] => {
    const name = String(Object.values(row)[1] ?? "");
    const list: RecordAction[] = [];
    if (part === "nhan" || part === "truong")
      list.push({
        action: MANAGE,
        label: W.rename,
        onSelect: () => notifyResult({ message: `${W.rename}: ${name}` }),
      });
    list.push({
      action: MANAGE,
      label: W.retire,
      remove: {
        verb: `${W.retire} ${name}`,
        what: "Giá trị cũ vẫn giữ trên căn.",
        done: `Đã ${W.retire.toLowerCase()}`,
        apply: async () => {},
      },
    });
    return list;
  };
  return (
    <DataRegion
      title={W.parts[part]}
      columns={data.columns}
      rows={matched && part === "can-cho" ? rows.slice(1) : rows}
      status={status}
      emptyWhy={W.empty[part]}
      headAction={
        part === "can-cho" ? (
          <PermittedAction action={MANAGE}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMatched(true);
                notifyResult({ message: W.matched });
              }}
            >
              {W.match}
            </Button>
          </PermittedAction>
        ) : undefined
      }
      rowActions={(row) => ({ actions: actions(row), mine: true })}
    />
  );
}

const PARTS = Object.keys(W.parts) as Part[];

/** A: the five parts as a list beside the region (the build puts them in the App Shell's second column). */
function ShapeA({ scene }: { scene: Scene }) {
  const [part, setPart] = useState<Part>(scene.phan);
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <nav aria-label={W.screen} className="md:w-56 md:shrink-0">
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {PARTS.map((p) => (
            <li key={p}>
              <Button
                variant={p === part ? "secondary" : "ghost"}
                aria-current={p === part ? "page" : undefined}
                className="w-full"
                onClick={() => setPart(p)}
              >
                {W.parts[p]}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 flex-1">
        <PartRegion part={part} state={scene.state} />
      </div>
    </div>
  );
}

/** B (after ReUI settings-4): every part stacked on one page, each in its own region. */
function ShapeB({ scene }: { scene: Scene }) {
  return (
    <div className="flex flex-col gap-6">
      {PARTS.map((p) => (
        <PartRegion key={p} part={p} state={scene.state} />
      ))}
    </div>
  );
}

/** C (after ReUI settings-11): one tab per part above one region. */
function ShapeC({ scene }: { scene: Scene }) {
  const [part, setPart] = useState<Part>(scene.phan);
  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label={W.screen} className="flex gap-1 overflow-x-auto border-b">
        {PARTS.map((p) => (
          <Button
            key={p}
            role="tab"
            aria-selected={p === part}
            variant={p === part ? "secondary" : "ghost"}
            onClick={() => setPart(p)}
          >
            {W.parts[p]}
          </Button>
        ))}
      </div>
      <PartRegion part={part} state={scene.state} />
    </div>
  );
}

/** The design-pass prototype of row 7e on sample data, under the roles a scene asks for. */
export function LayerShowcase({ scene, rows }: { scene: Scene; rows: readonly GridRow[] }) {
  const roles: Role[] = scene.readOnly ? ["BuyerAgent"] : ["CompanyAdmin"];
  const inv = useMemo(() => inventoryScene(rows), [rows]);
  return (
    <SessionRoles roles={roles}>
      <div className="flex flex-col gap-4">
        <Frame>
          <FrameHeader>
            <FrameTitle>Bản mẫu hàng 7e</FrameTitle>
            <FrameDescription>
              {scene.canh === "bang-hang"
                ? "Bảng hàng của sàn mẫu: «Block» và «Giá KBP» là nhãn riêng, «Hướng view» và «Ghi chú» là trường riêng."
                : `Dáng ${scene.canh.toUpperCase()} của màn ${W.screen}.`}
            </FrameDescription>
          </FrameHeader>
          <FramePanel className="hidden" />
        </Frame>
        {scene.canh === "bang-hang" ? (
          <>
            <PageHeader title={label("Inventory")} />
            <DataRegion
              title={label("Inventory")}
              columns={inv.columns}
              rows={inv.rows}
              emptyWhy="Sàn chưa có căn nào."
            />
          </>
        ) : (
          <>
            <PageHeader title={W.screen} />
            {scene.canh === "a" ? <ShapeA scene={scene} /> : null}
            {scene.canh === "b" ? <ShapeB scene={scene} /> : null}
            {scene.canh === "c" ? <ShapeC scene={scene} /> : null}
          </>
        )}
      </div>
    </SessionRoles>
  );
}
