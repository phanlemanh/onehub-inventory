// Every sentence the frame shows, in one file for the reviewer (design/language.md: buttons and error sentences
// are checked by a person). Screen names are not here: they come from label() through props.
import { LABELS } from "@/generated/labels";

/** Where «sign in again» goes: the login screen of row 8. */
export const LOGIN_PATH = "/login";

export const FRAME_COPY = {
  skipToContent: "Bỏ qua tới nội dung chính",
  openSidebar: "Mở hoặc đóng thanh bên",
  brand: "OneHub",
  retry: "Thử lại",
  undo: "Hoàn tác",
  confirm: {
    cancel: "Thôi",
    /** The question above the screen's own sentence of what will happen. */
    title: (verb: string) => `Bạn chắc muốn ${verb.toLocaleLowerCase("vi")}?`,
    note: "Bạn đọc kỹ việc sẽ xảy ra dưới đây trước khi bấm.",
  },
  /**
   * The server refused an action the person pressed (403: the permission table or their roles changed since the page
   * loaded). Apart from the general error, and the page refreshes its buttons when the dialog closes (row 9e).
   */
  refusedAction: "Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.",
  signInAgain: `${LABELS.SignIn.pref} lại`,
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
  forbidden: {
    title: "Không đủ quyền",
    why: "Vai của bạn ở sàn này không mở được màn này, nên màn không hiện dữ liệu nào.",
    next: "Bạn cần dùng màn này thì nhờ quản trị của sàn thêm vai.",
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
  /** Second column of the App Shell (row 1o). */
  secondColumn: {
    all: "Tất cả",
    allLinks: "Tất cả link",
    byStatus: "Theo trạng thái",
    noSubItems: "Màn này chưa có mục con.",
    collapse: "Gập cột thứ hai",
    expand: "Mở cột thứ hai",
  },
  appError: {
    title: "Ứng dụng chưa mở được",
    detail: "Đã có lỗi khi mở ứng dụng. Bạn bấm «Thử lại»; nếu vẫn lỗi, tải lại trang sau ít phút.",
  },
} as const;
