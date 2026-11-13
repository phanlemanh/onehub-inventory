// Words of the prototype of row 3f (loi-vao-ho-so). Concept names come from ontology/labels.yaml through label() and
// are passed in; the words below are frame words proposed for the record's entry points, and prototype controls.

const lower = (noun: string) => noun.toLocaleLowerCase("vi");

/** Frame words the row proposes (they would move to the grid and frame copy files when the row is built). */
export const ENTRY_COPY = {
  copyLink: "Chép đường dẫn",
  copied: "Đã chép đường dẫn",
  copyFailed: "Chưa chép được. Bạn chép đường dẫn trong ô địa chỉ của trình duyệt.",
  staleLink: (unit: string, inventory: string) =>
    `${unit} trong đường dẫn không còn trong ${inventory}.`,
  jump: (unit: string) => `Gõ mã ${lower(unit)}`,
  jumpHint: (unit: string) => `Gõ mã ${lower(unit)}…`,
  jumpWhy: (unit: string, inventory: string) =>
    `Gõ đúng mã ${lower(unit)} rồi Enter để mở hồ sơ ${lower(unit)} trong ${inventory}.`,
  jumpGo: "Mở",
  jumpEmpty: (unit: string) => `Bạn gõ mã ${lower(unit)} trước đã.`,
  noSuggestion: (unit: string, inventory: string) =>
    `Không có ${lower(unit)} nào khớp — Enter để lọc ${inventory} theo chữ này.`,
} as const;

export const SCENES = ["ngan", "go-ma", "mot", "nhieu", "khong", "cu"] as const;
export type Scene = (typeof SCENES)[number];

export const PROTO_COPY = {
  title: "Bản mẫu lối vào hồ sơ",
  controls: {
    heading: "Bảng chọn của bản mẫu",
    note: "Bảng này chỉ có ở bản mẫu. Chọn cảnh rồi bấm thử; không có gì được ghi.",
    scene: "Cảnh",
  },
  scenes: {
    ngan: "Hồ sơ có «Chép đường dẫn»",
    "go-ma": "Ô ⌘K có gợi ý",
    mot: "Chọn một căn",
    nhieu: "Mã có ở hai toà",
    khong: "Mã lạ",
    cu: "Đường dẫn cũ",
  },
  topBarNote:
    "Thanh trên của App Shell (bản mẫu chép lại phần bên phải). Bản mẫu dựng bảng lệnh bằng hộp sẵn của kho — dáng gần đúng.",
  recordNote:
    "Đầu hồ sơ như hàng 3, thêm «Chép đường dẫn». Bấm thử: địa chỉ /inventory?ho-so=<id> vào bộ nhớ chép.",
} as const;
