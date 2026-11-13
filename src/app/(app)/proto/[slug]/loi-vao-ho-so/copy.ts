// Words of the prototype of row 3f (loi-vao-ho-so). Concept names come from ontology/labels.yaml through label() and
// are passed in; the words below are frame words proposed for the record's entry points, and prototype controls.

const lower = (noun: string) => noun.toLocaleLowerCase("vi");

/** Frame words the row proposes (they would move to the grid and frame copy files when the row is built). */
export const ENTRY_COPY = {
  openFull: "Mở toàn màn",
  copyLink: "Chép đường dẫn",
  copied: "Đã chép đường dẫn",
  copyFailed: "Chưa chép được. Bạn chép đường dẫn trong ô địa chỉ của trình duyệt.",
  jump: (unit: string) => `Gõ mã ${lower(unit)}`,
  jumpHint: (unit: string) => `Gõ mã ${lower(unit)}…`,
  jumpWhy: (unit: string, inventory: string) =>
    `Gõ đúng mã ${lower(unit)} rồi Enter để mở hồ sơ ${lower(unit)} trong ${inventory}.`,
  jumpGo: "Mở",
  jumpEmpty: (unit: string) => `Bạn gõ mã ${lower(unit)} trước đã.`,
  notFound: (unit: string, inventory: string) => `Không có ${lower(unit)} này trong ${inventory}`,
  notFoundWhy: (code: string, inventory: string) =>
    `Mã «${code}» không khớp dòng nào bạn thấy trong ${inventory}. Bạn xem lại mã, hoặc mở ${inventory} để tìm.`,
  backTo: (inventory: string) => `Về ${inventory}`,
  many: (unit: string, building: string) => `Nhiều ${lower(unit)} — chọn ${lower(building)}`,
  manyWhy: (code: string, count: number, building: string) =>
    `Mã «${code}» có ở ${count} ${lower(building)}. Bạn chọn ${lower(building)} để mở đúng hồ sơ.`,
} as const;

export const SCENES = ["ngan", "trang", "nhieu", "khong", "go-ma"] as const;
export type Scene = (typeof SCENES)[number];

export const PROTO_COPY = {
  title: "Bản mẫu lối vào hồ sơ",
  controls: {
    heading: "Bảng chọn của bản mẫu",
    note: "Bảng này chỉ có ở bản mẫu. Chọn cảnh rồi bấm thử; không có gì được ghi.",
    scene: "Cảnh",
  },
  scenes: {
    ngan: "Hồ sơ cạnh bảng",
    trang: "Trang riêng của căn",
    nhieu: "Mã có ở hai toà",
    khong: "Mã lạ",
    "go-ma": "Gõ mã căn",
  },
  topBarNote: "Thanh trên của App Shell (bản mẫu chép lại phần bên phải).",
  sharedNote: "Đồng nghiệp cùng sàn mở đường dẫn này thấy đúng căn và đúng lần chào.",
} as const;
