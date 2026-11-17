// Words and sample data of the clickable prototype shown at the scope gate of row 11 (nhap-excel). Development only:
// the proto page renders it under /proto/nhap-excel. The built screen reads its words from ontology/labels.yaml and the
// module's copy file; this file goes away with the prototype.

export type Mark = "keep" | "fixed" | "ask" | "block";

export const PROTO_COPY = {
  title: "Nạp tệp",
  steps: ["Chọn tệp", "Ghép cột", "Giá trị và căn", "Xem trước", "Xong"],
  stepHints: [
    "Tệp Excel (.xlsx) hay CSV. Google Sheet: Tệp → Tải xuống.",
    "Mỗi cột của tệp đi vào một trường của Bảng hàng.",
    "Máy hỏi mỗi cách viết một lần, không hỏi từng ô.",
    "Còn chỗ chặn thì chưa áp được: bấm «Còn 2 chỗ chặn» để về đúng cột hay câu cần gỡ ở bước 2, 3.",
    "Đã nhớ cách ghép này cho lần sau.",
  ],
  drop: "Kéo tệp vào đây hoặc bấm để chọn",
  dropLimits: ".xlsx hoặc .csv · tối đa 10 MB, 5.000 dòng",
  fileReady: "Đã đọc",
  otherSheets: "Không đọc các trang tính khác: «Đã bán», «Ghi chú»",
  next: "Tiếp",
  back: "Quay lại",
  apply: "Áp 212 căn · 6 ô giữ chữ gốc",
  applyBlocked: "Còn 2 chỗ chặn",
  openInventory: "Mở Bảng hàng",
  undo: "Hoàn tác lần nhập",
  recent: "Lần nhập gần đây",
  colHeader: "Cột của tệp",
  colTarget: "Đi vào",
  colMark: "Dấu",
  colWhy: "Vì sao",
  learnLabel: "Gọi cột này là «Block» trên Bảng hàng",
  remember: "Nhớ cho lần sau",
  marks: { keep: "Giữ nguyên", fixed: "Máy sửa", ask: "Cần người", block: "Chặn" } as Record<
    Mark,
    string
  >,
  doneTitle: "Đã thêm 212 căn vào Bảng hàng",
  learned: "Vừa học",
  kept: "6 ô giữ chữ gốc ở lần nhập",
  layoutA: "Lối A — bước ngang (solution-crm-6)",
  layoutB: "Lối B — bước dọc bên trái (onboarding-2)",
} as const;

export const PROTO_FILE = {
  name: "Bang hang Sapphire T11.xlsx",
  sheet: "Bảng hàng",
  rows: 220,
  size: "184 KB",
};

export const PROTO_COLUMNS: { header: string; target: string; mark: Mark; why: string }[] = [
  { header: "Mã căn", target: "Căn", mark: "keep", why: "Trùng nhãn chuẩn" },
  { header: "Block", target: "Toà", mark: "ask", why: "Tên cột lạ — người chọn Toà" },
  { header: "DT", target: "Diện tích", mark: "fixed", why: "Cách viết hay gặp của Diện tích" },
  { header: "PN", target: "Phòng ngủ", mark: "fixed", why: "Cách viết hay gặp của Phòng ngủ" },
  { header: "Giá KBP", target: "Giá chào", mark: "fixed", why: "Giá chào, phí: không bao" },
  { header: "Giá", target: "Giá chào", mark: "block", why: "Hai cột cùng đi vào Giá chào" },
  { header: "TT", target: "Trạng thái", mark: "fixed", why: "Cách viết hay gặp của Trạng thái" },
  {
    header: "View",
    target: "Trường riêng mới «View» · chọn một",
    mark: "ask",
    why: "Tên cột lạ — người tạo trường riêng",
  },
  {
    header: "SĐT chủ",
    target: "Bỏ cột",
    mark: "block",
    why: "Số chủ nhà ghi ở hồ sơ căn, không nhập ở đây",
  },
];

export const PROTO_QUESTIONS: {
  column: string;
  raw: string;
  count: number;
  answer: string;
  options: string[];
}[] = [
  {
    column: "TT",
    raw: "còn",
    count: 148,
    answer: "Đang bán",
    options: ["Đang bán", "Đang giữ", "Giữ chữ gốc"],
  },
  {
    column: "TT",
    raw: "cọc",
    count: 21,
    answer: "Đang giữ",
    options: ["Đang bán", "Đang giữ", "Giữ chữ gốc"],
  },
  {
    column: "View",
    raw: "biển",
    count: 64,
    answer: "Biển",
    options: ["Biển", "Hồ", "Phố", "Giữ chữ gốc"],
  },
  {
    column: "Mã căn",
    raw: "S1.05-1208",
    count: 1,
    answer: "S1.05 · tầng 12 · căn 08",
    options: ["S1.05 · tầng 12 · căn 08", "S1.06 · tầng 12 · căn 08"],
  },
  {
    column: "Mã căn",
    raw: "SA5-12.08 … (87 mã)",
    count: 87,
    answer: "Thành căn chờ khớp, giữ nguyên mã",
    options: ["Thành căn chờ khớp, giữ nguyên mã", "Bỏ dòng"],
  },
];

export const PROTO_COUNTS: Record<Mark, number> = { keep: 1180, fixed: 642, ask: 6, block: 2 };

export const PROTO_ROWS: { cells: { text: string; mark: Mark }[] }[] = [
  {
    cells: [
      { text: "S1.01-0905", mark: "keep" },
      { text: "Sapphire 1", mark: "keep" },
      { text: "75,2 m²", mark: "fixed" },
      { text: "2", mark: "keep" },
      { text: "4.650.000.000 đ", mark: "fixed" },
      { text: "Đang bán", mark: "fixed" },
      { text: "Biển", mark: "fixed" },
    ],
  },
  {
    cells: [
      { text: "SA5-12.08", mark: "fixed" },
      { text: "Sapphire 5", mark: "keep" },
      { text: "68 m²", mark: "fixed" },
      { text: "2", mark: "keep" },
      { text: "3.900.000.000 đ", mark: "fixed" },
      { text: "Đang giữ", mark: "fixed" },
      { text: "Phố", mark: "fixed" },
    ],
  },
  {
    cells: [
      { text: "R2.11-1503", mark: "ask" },
      { text: "Ruby 2", mark: "keep" },
      { text: "55 m²", mark: "fixed" },
      { text: "1", mark: "keep" },
      { text: "thoả thuận", mark: "ask" },
      { text: "Đang bán", mark: "fixed" },
      { text: "", mark: "keep" },
    ],
  },
  {
    cells: [
      { text: "S1.01-0905", mark: "block" },
      { text: "Sapphire 1", mark: "keep" },
      { text: "75,2 m²", mark: "fixed" },
      { text: "2", mark: "keep" },
      { text: "4.700.000.000 đ", mark: "fixed" },
      { text: "Đang bán", mark: "fixed" },
      { text: "Biển", mark: "fixed" },
    ],
  },
];

export const PROTO_PREVIEW_HEADERS = [
  "Căn",
  "Block",
  "Diện tích",
  "Phòng ngủ",
  "Giá chào",
  "Trạng thái",
  "View",
];

export const PROTO_LEARNED = [
  "Mẫu nhập «Bang hang Sapphire T11» (9 cột)",
  "Nhãn riêng: Toà → «Block»",
  "Trường riêng mới: View (chọn một: Biển, Hồ, Phố)",
  "3 cách viết: «còn», «cọc», «biển»",
  "1 mã riêng của căn: S1.05-1208",
  "87 căn chờ khớp",
];

export const PROTO_RECENT = [
  { when: "Hôm qua 16:20", file: "Bang hang Ruby.csv", added: 64 },
  { when: "12/11 09:05", file: "Quy can T10.xlsx", added: 130 },
];
