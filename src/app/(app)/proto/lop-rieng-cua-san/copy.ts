// Words of the row 7e prototype (lop-rieng-cua-san). The build moves every one of them to ontology/labels.yaml.

export const PARTS = ["nhan", "truong", "tu-dien", "can-cho", "mau"] as const;
export type Part = (typeof PARTS)[number];

export const PROTO_7E = {
  href: "/proto/lop-rieng-cua-san",
  /** The cookie that picks the shape, so the App Shell's second-column links keep it. */
  shapeCookie: "proto-7e-dang",
  screen: "Tuỳ chỉnh của sàn",
  screenWhy: "Những gì sàn đã gọi riêng, thêm riêng và nhớ riêng so với chuẩn chung.",
  parts: {
    nhan: "Nhãn riêng",
    truong: "Trường riêng",
    "tu-dien": "Từ điển giá trị",
    "can-cho": "Căn chờ khớp",
    mau: "Mẫu nhập",
  } satisfies Record<Part, string>,
  partWhy: {
    nhan: "Chữ sàn dùng thay tên cột chuẩn.",
    truong: "Cột sàn có mà chuẩn chung không có.",
    "tu-dien": "Chữ sàn quen viết ứng với giá trị chuẩn nào.",
    "can-cho": "Căn sàn có mà danh mục chung chưa có.",
    mau: "Dạng tệp Sheet đã nhập và cột nào đi vào đâu.",
  } satisfies Record<Part, string>,
  empty: {
    nhan: "Sàn chưa đặt nhãn riêng. Nhãn riêng sinh ra khi nhập bảng hàng.",
    truong: "Sàn chưa có trường riêng. Trường riêng sinh ra khi nhập bảng hàng.",
    "tu-dien": "Sàn chưa có từ điển giá trị. Từ điển sinh ra khi nhập bảng hàng.",
    "can-cho": "Không có căn nào chờ khớp với danh mục.",
    mau: "Sàn chưa có mẫu nhập. Mẫu nhập sinh ra sau lần nhập đầu.",
  } satisfies Record<Part, string>,
  edit: "Sửa",
  rename: "Đổi tên",
  retire: "Ngừng dùng",
  add: {
    nhan: "Thêm nhãn riêng",
    truong: "Thêm trường riêng",
    "tu-dien": "Thêm từ điển",
  } as Partial<Record<Part, string>>,
  form: {
    title: "Thêm trường riêng",
    why: "Cột mới hiện trên Bảng hàng sau tám cột chuẩn. Kiểu không đổi được sau khi tạo.",
    name: "Tên trường",
    kind: "Kiểu",
    kinds: ["Chữ", "Số", "Ngày", "Chọn một", "Có/không"],
    options: "Lựa chọn (mỗi dòng một lựa chọn, tối đa 30)",
    submit: "Thêm",
    busy: "Đang thêm…",
  },
  retireWhat: "Giá trị cũ vẫn giữ trên căn.",
  match: "Khớp với danh mục",
  matched: "Đã khớp 1 căn, còn 11 căn chờ",
  seeAll: (n: number) => `Xem cả ${n}`,
  inUse: "Đang dùng",
  waiting: "Chờ khớp",
  manyMatch: "Nhiều căn, cần người",
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
