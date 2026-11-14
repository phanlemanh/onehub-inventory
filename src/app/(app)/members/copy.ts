// Every sentence of the members screen, in one file for the reviewer (design/language.md). Concept names (member,
// invite, change roles, the roles, company admin) come from label() in the page and are passed in.

export const MEMBERS_COPY = {
  columns: {
    name: "Tên",
    email: "Email",
    roles: "Vai",
    invited: "Người mời",
    invitedAt: "Ngày mời",
  },
  invitedBy: (name: string | null, date: string) => (name ? `${name} · ${date}` : "—"),
  peopleCount: (n: number) => `${n} người trong sàn`,
  save: "Lưu",
  sending: "Đang gửi",
  saving: "Đang lưu",
  inviteSubmit: "Mời",
  inviteDescription: "Người được mời nhận một thư, rồi đăng nhập bằng chính email này để vào sàn.",
  rolesDescription: (name: string) => `Chọn các vai của ${name} trong sàn. Cần ít nhất một vai.`,
  emailLabel: "Email",
  nameLabel: "Tên trong sàn",
  rolesLabel: "Vai",
  emailInvalid: "Email chưa đúng khuôn, ví dụ ten@congty.vn.",
  nameEmpty: "Gõ tên người này như sàn vẫn gọi.",
  rolesEmpty: "Chọn ít nhất một vai.",
  alreadyMember: "Email này đã ở trong sàn.",
  lastAdmin: (admin: string) =>
    `Mỗi sàn cần ít nhất một ${admin}. Gán vai này cho người khác trước.`,
  failed:
    "Chưa lưu được. Máy chủ đang gặp lỗi, phần bạn đã gõ vẫn còn. Bạn bấm «Thử lại» sau ít phút.",
  invited: (name: string) => `Đã mời ${name}`,
  rolesChanged: (name: string) => `Đã đổi vai của ${name}`,
} as const;
