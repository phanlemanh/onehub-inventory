// Words of the prototype only. Concept names come from ontology/labels.yaml through label(); the words below are
// either prototype controls or button labels the owner has not chosen yet (questions on the scope gate card of row
// 9e). The chosen ones move to ontology/labels.yaml in the round's build step.

export const PROTO_COPY = {
  title: "Bản mẫu bộ nút theo quyền",
  controls: {
    heading: "Bảng chọn cho chủ kho",
    note: "Bảng này chỉ có ở bản mẫu. Đổi vai hay ứng viên rồi nhìn bộ nút bên dưới đổi theo.",
    screen: "Màn",
    role: "Xem dưới vai",
    toolbar: "Chỗ đặt nút thêm",
    row: "Thao tác trên dòng",
    words: "Chữ trên nút gỡ",
    others: "Dòng của người khác",
    confirm: "Hộp xác nhận gỡ",
    refuse: "Giả lập máy chủ từ chối lần bấm kế",
  },
  options: {
    toolbar: {
      A: "A · đầu vùng (data-grid-base-1)",
      B: "B · một dòng cùng ô tìm (data-grid-base-7)",
      C: "C · đầu màn (chủ kho chọn)",
    },
    row: {
      R1: "R1 · chỉ «…» cuối dòng",
      R2: "R2 · nút Sửa + «…»",
      R3: "R3 · không nút trên dòng, việc nằm trong hồ sơ",
    },
    words: {
      H1: "H1 · động từ thường «Xoá» (chủ kho chọn)",
      H2: "H2 · tách theo nghĩa (quyết định 0016)",
    },
    others: {
      O1: "O1 · ẩn nút",
      O2: "O2 · hiện mờ kèm lý do",
    },
    confirm: {
      X1: "X1 · hỏi ngắn (c-alert-dialog-5)",
      X2: "X2 · chọn lý do gỡ (c-alert-dialog-8)",
      X3: "X3 · kể hậu quả (c-dialog-7)",
    },
  },
  screens: { listings: "Bảng hàng", contacts: "Liên hệ" },
  columns: {
    keeper: "Người giữ",
    creator: "Người tạo",
    phone: "Số điện thoại",
    building: "Toà",
    price: "Giá chào",
  },
  me: "Tôi",
  more: "Thêm việc",
  actions: {
    addUnit: "Thêm căn",
    addContact: "Thêm liên hệ",
    edit: "Sửa",
    deleteUnit: "Xoá căn",
    deleteContact: "Xoá liên hệ",
    withdraw: "Ngừng bán",
    removeMistake: "Gỡ tạo nhầm",
    merge: "Gộp với liên hệ khác…",
    erase: "Xoá tên và số theo yêu cầu",
  },
  ownOnly: "Chỉ người giữ được làm việc này",
  ownOnlyContact: "Chỉ người tạo được làm việc này",
  search: "Tìm",
  rows: (n: number) => `${n} dòng`,
  record: "Hồ sơ",
  cancel: "Huỷ",
  confirm: {
    shortTitle: (what: string) => `${what}?`,
    shortWhy: "Bạn không hoàn tác được bằng một lần bấm.",
    deleteWhy: "Dòng rời danh sách của mọi người trong sàn; ai xoá và lúc nào vẫn được giữ.",
    reasonTitle: (what: string) => `Gỡ ${what} khỏi danh sách`,
    reasonWhy: "Chọn đúng lý do: mỗi lý do để lại dấu vết khác nhau.",
    reasonWithdrawShort: "Căn thôi bán",
    reasonMistakeShort: "Tạo nhầm",
    reasonWithdraw: "Căn thôi bán — giữ hồ sơ và lịch sử, chuyển sang Ngừng hẳn",
    reasonMistake: "Tạo nhầm — gỡ khỏi danh sách, giữ dấu vết ai gỡ và lúc nào",
    consequencesTitle: (what: string) => `${what}: điều gì sẽ xảy ra`,
    consequences: [
      "Dòng biến khỏi danh sách của mọi người trong sàn.",
      "Link đã gửi cho khách thôi hiện căn này.",
      "Lịch sử và người gỡ vẫn được giữ để đối chiếu.",
    ],
  },
  done: (what: string) => `Đã ${what.toLocaleLowerCase("vi")} (bản mẫu: không có gì được ghi)`,
  refused: {
    title: "Không đủ quyền làm việc này",
    detail:
      "Vai của bạn vừa được đổi hoặc việc này không còn mở cho vai của bạn. Tải lại trang để thấy đúng các nút.",
  },
} as const;
