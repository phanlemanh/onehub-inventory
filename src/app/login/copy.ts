// Every sentence of the sign-in screen and the account menu, in one file for the reviewer (design/language.md).
// Concept names (sign in, sign out, login code, company) come from label() in the page and are passed in.

export const LOGIN_COPY = {
  emailLabel: "Email",
  emailHint: "Email bạn dùng ở sàn. Mã sẽ gửi tới hộp thư này.",
  sendCode: "Gửi mã",
  sending: "Đang gửi",
  codeSent: (email: string) =>
    `Nếu ${email} có tài khoản, mã đã được gửi tới hộp thư này. Mã dùng được 5 phút.`,
  codeHint: "Gõ hoặc dán 6 chữ số trong thư.",
  signingIn: "Đang vào",
  resend: "Gửi mã mới",
  otherEmail: "Dùng email khác",
  codeInvalid: "Mã không đúng hoặc đã hết hạn. Gõ lại, hoặc bấm «Gửi mã mới».",
  rateLimited: "Đã xin mã quá nhiều lần. Thử lại sau 15 phút.",
  noCompany: "Tài khoản chưa thuộc sàn nào. Nhờ quản trị sàn mời bạn.",
  serverError:
    "Chưa gửi được yêu cầu. Máy chủ đang gặp lỗi, phần bạn đã gõ vẫn còn. Bạn bấm «Thử lại» sau ít phút.",
  retry: "Thử lại",
  chooseCompany: "Bạn thuộc nhiều sàn. Chọn sàn để làm việc:",
  account: "Tài khoản",
  switchCompany: "Đổi sàn",
  currentCompany: "Đang làm ở",
  noCurrentCompany: "Chưa chọn sàn",
  signOutFailed: (signOut: string) =>
    `Chưa đăng xuất được. Bạn vẫn đang đăng nhập trên máy này — kiểm tra mạng rồi bấm «${signOut}» lại.`,
  noCompanySession:
    "Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email khác.",
} as const;
