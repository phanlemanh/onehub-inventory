// Every sentence the frame shows, in one file for the reviewer (design/language.md: buttons and error sentences
// are checked by a person). Screen names are not here: they come from label() through props.

/** Where «Đăng nhập lại» goes; the login screen is built by row 8 of lane N. */
export const LOGIN_PATH = "/login";

export const FRAME_COPY = {
  skipToContent: "Bỏ qua tới nội dung chính",
  openSidebar: "Mở hoặc đóng thanh bên",
  brand: "OneHub",
  retry: "Thử lại",
  undo: "Hoàn tác",
  signInAgain: "Đăng nhập lại",
  goHome: "Về trang đầu",
  theme: {
    button: "Đổi giao diện",
    light: "Sáng",
    dark: "Tối",
    system: "Theo thiết bị",
  },
  error: {
    title: "Màn này chưa hiện được",
    why: "Đã có lỗi khi dựng màn, phần dữ liệu bạn đã lưu không bị ảnh hưởng.",
    next: "Bạn bấm «Thử lại»; nếu vẫn lỗi, chọn màn khác trên thanh bên rồi quay lại sau.",
  },
  notFound: {
    title: "Không tìm thấy trang",
    why: "Địa chỉ này không có trong ứng dụng, có thể đã gõ nhầm hoặc trang đã đổi chỗ.",
    next: "Bạn về trang đầu rồi đi tiếp từ đó.",
  },
  sessionExpired: {
    title: "Phiên đăng nhập đã hết hạn",
    why: "Bạn đã rời ứng dụng quá lâu nên phiên đăng nhập kết thúc để giữ an toàn dữ liệu.",
    next: "Bạn đăng nhập lại, ứng dụng sẽ đưa bạn về đúng màn này.",
  },
  offline: {
    title: "Mất kết nối mạng",
    detail:
      "Thiết bị đang không có mạng nên thay đổi mới chưa lưu được. Bạn kiểm tra wifi hoặc dữ liệu di động; khi có mạng lại, băng này tự tắt và bạn lưu tiếp.",
  },
  saveFailedOffline: {
    title: "Chưa lưu được vì mất kết nối mạng",
    detail: "Phần bạn đang nhập vẫn còn; khi có mạng lại, bạn bấm «Thử lại».",
  },
  appError: {
    title: "Ứng dụng chưa mở được",
    detail: "Đã có lỗi khi mở ứng dụng. Bạn bấm «Thử lại»; nếu vẫn lỗi, tải lại trang sau ít phút.",
  },
} as const;
