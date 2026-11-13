// One set of made-up company-layer rows for both shapes of the prototype: codes and words only, no person.
import { label } from "@/modules/company-config";

import { PROTO_7E as C, type Part } from "./copy";

/** One item of a part: a name, one line saying what it is, a state, and the columns the grid shape shows. */
export interface LayerItem {
  id: string;
  name: string;
  line: string;
  state: "use" | "wait" | "many";
  cells: Record<string, string | null>;
}

const VIEWS = ["Biển", "Hồ", "Phố", "Nội khu"];

const FIELDS: [string, string, string | null][] = [
  ["Hướng view", "Chọn một", VIEWS.join(", ")],
  ["Ghi chú nội bộ", "Chữ", null],
  ["Đã có sổ", "Có/không", null],
  ["Ngày bàn giao", "Ngày", null],
  ["Phí quản lý / m²", "Số", null],
  ["Nội thất", "Chọn một", "Cơ bản, Đầy đủ, Thô"],
  ["Hạng căn", "Chọn một", "A, B, C"],
  ["Ban công", "Có/không", null],
  ["Chỗ đỗ xe", "Số", null],
  ["Nguồn khách", "Chọn một", "Zalo, Facebook, Giới thiệu"],
];

const CODES = [
  "SA5-12.08",
  "S1.05 - 1208",
  "Sapphire 5 tầng 12",
  "R2-0716",
  "Ruby 2 - 07.16",
  "GH1-1503",
  "GH1 15.03",
  "Zen 3A-0910",
  "ZR3A 09-10",
  "PK7-L12",
  "Masteri W1-2002",
  "MW1.20.02",
];

/** The five parts of the sample company's layer, in order. */
export function sampleLayer(): Record<Part, LayerItem[]> {
  return {
    nhan: [
      ["Building", "Block"],
      ["ListPrice", "Giá KBP"],
      ["Subdivision", "Phân khu"],
      ["LivingArea", "DT thông thuỷ"],
      ["LastConfirmedAt", "Ngày check"],
    ].map(([concept, own], i) => ({
      id: `n${i + 1}`,
      name: own!,
      line: `thay «${label(concept as "Building")}»`,
      state: "use" as const,
      cells: { concept: label(concept as "Building"), own: own! },
    })),
    truong: FIELDS.map(([name, kind, options], i) => ({
      id: `t${i + 1}`,
      name,
      line: options ? `${kind} · ${options}` : kind,
      state: "use" as const,
      cells: { name, kind, options },
    })),
    "tu-dien": [
      [label("StandardStatus"), "còn", label("StatusActive")],
      [label("StandardStatus"), "đã cọc", label("StatusPending")],
      [label("StandardStatus"), "tạm dừng", label("StatusHold")],
      ["Hướng", "ĐN", "Đông Nam"],
      ["Hướng", "TB", "Tây Bắc"],
      ["Hướng", "Đ-N", "Đông Nam"],
      ["Hướng view", "biển", "Biển"],
      ["Hướng view", "view hồ", "Hồ"],
      ["Nội thất", "full", "Đầy đủ"],
      ["Nội thất", "nt cơ bản", "Cơ bản"],
    ].map(([field, raw, value], i) => ({
      id: `d${i + 1}`,
      name: `«${raw}» → ${value}`,
      line: field!,
      state: "use" as const,
      cells: { field: field!, raw: raw!, value: value! },
    })),
    "can-cho": CODES.map((code, i) => ({
      id: `c${i + 1}`,
      name: code,
      line: i % 4 === 2 ? "Mã ra nhiều căn trong danh mục" : "Danh mục chung chưa có căn này",
      state: i % 4 === 2 ? ("many" as const) : ("wait" as const),
      cells: { code, state: i % 4 === 2 ? C.manyMatch : C.waiting },
    })),
    mau: [
      ["Bảng hàng tháng 11", 12],
      ["Hàng cho thuê", 9],
      ["Danh sách đầu chủ gửi", 7],
    ].map(([name, n], i) => ({
      id: `m${i + 1}`,
      name: String(name),
      line: `${n} cột`,
      state: "use" as const,
      cells: { template: String(name), columns: `${n} cột` },
    })),
  };
}

/** The grid columns of each part (shape A). */
export const PART_COLUMNS: Record<Part, [string, string][]> = {
  nhan: [
    ["concept", C.col.concept],
    ["own", C.col.own],
  ],
  truong: [
    ["name", C.col.name],
    ["kind", C.col.kind],
    ["options", C.col.options],
  ],
  "tu-dien": [
    ["field", C.col.field],
    ["raw", C.col.raw],
    ["value", C.col.value],
  ],
  "can-cho": [
    ["code", C.col.code],
    ["state", C.col.state],
  ],
  mau: [
    ["template", C.col.template],
    ["columns", C.col.columns],
  ],
};
