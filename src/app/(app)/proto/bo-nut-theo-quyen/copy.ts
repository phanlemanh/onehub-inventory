// Words of the prototype only. Concept names come from ontology/labels.yaml through label() and are passed in; the
// words below are prototype controls or button verbs the owner chose at the scope gate of row 9e (plain verbs). The
// verbs move to ontology/labels.yaml in the round's build step.

const lower = (noun: string) => noun.toLocaleLowerCase("vi");

export const PROTO_COPY = {
  title: "Bản mẫu bộ nút theo quyền",
  controls: {
    heading: "Bảng chọn của bản mẫu",
    note: "Bảng này chỉ có ở bản mẫu. Chọn vai hay màn khác rồi nhìn bộ nút bên dưới đổi theo.",
    screen: "Màn",
    role: "Xem dưới vai",
    refuse: "Giả lập máy chủ từ chối lần bấm kế",
  },
  me: "Tôi",
  more: "Thêm việc",
  phone: "Số điện thoại",
  creator: "Người tạo",
  search: "Tìm",
  rows: (n: number) => `${n} dòng`,
  add: (noun: string) => `Thêm ${lower(noun)}`,
  edit: "Sửa",
  remove: (noun: string) => `Xoá ${lower(noun)}`,
  merge: (noun: string) => `Gộp với ${lower(noun)} khác…`,
  erase: "Xoá tên và số theo yêu cầu",
  removeWhat: "Dòng rời danh sách của mọi người trong sàn; ai xoá và lúc nào vẫn được giữ.",
  eraseWhat: "Tên và số điện thoại bị xoá theo yêu cầu của người ấy; lịch sử khác vẫn giữ.",
  done: (verb: string) => `Đã ${lower(verb)} (bản mẫu: không có gì được ghi)`,
  refused: "Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.",
} as const;
