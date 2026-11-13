// Words of the prototype only. Concept names come from ontology/labels.yaml through label() and are passed in; the
// words below are prototype controls and sentences; button verbs come from ontology/labels.yaml (row 9e).

const lower = (noun: string) => noun.toLocaleLowerCase("vi");

export const PROTO_COPY = {
  title: "Bản mẫu bộ nút theo quyền",
  controls: {
    heading: "Bảng chọn của bản mẫu",
    note: "Bảng này chỉ có ở bản mẫu. Chọn vai hay màn khác rồi nhìn bộ nút bên dưới đổi theo.",
    screen: "Màn",
    role: "Xem dưới vai",
  },
  me: "Tôi",
  phone: "Số điện thoại",
  creator: "Người tạo",
  /** Menu words around a label, in the owner's H1 wording for merging and for erasing on request. */
  mergeWith: (noun: string) => `Gộp với ${lower(noun)} khác…`,
  eraseOnRequest: (verb: string) => `${verb} theo yêu cầu`,
  recordNote: "Hồ sơ của bản mẫu: nút ở đầu hồ sơ theo cùng bảng quyền như «…» trên dòng.",
  removeWhat: "Dòng rời danh sách của mọi người trong sàn; ai xoá và lúc nào vẫn được giữ.",
  eraseWhat: "Tên và số điện thoại bị xoá theo yêu cầu của người ấy; lịch sử khác vẫn giữ.",
  done: (verb: string) => `Đã ${lower(verb)} (bản mẫu: không có gì được ghi)`,
} as const;
