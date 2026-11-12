---
type: entity
title: Member (Thành viên)
links:
  [
    ontology/entities/Member.yaml,
    db/migrations/003_moi_nguoi_gan_vai.sql,
    db/migrations/006_bang_quyen_theo_vai.sql,
    ontology/actions.yaml,
    src/modules/identity/members.ts,
  ]
sources:
  [
    _acceptance/moi-nguoi-gan-vai/contract.md,
    _acceptance/bang-quyen-theo-vai/contract.md,
    wiki/decisions/0016-permission-model.md,
  ]
---

# Member (Thành viên)

## Definition

Một người làm việc trong một sàn, với các vai sàn giao (một hay nhiều trong bốn vai của `ontology/roles.yaml`) và tên
sàn đặt cho người ấy. Tương ứng tài nguyên `Member` của RESO 2.1. Cùng một tài khoản đăng nhập có thể là thành viên của
nhiều sàn; mỗi sàn là một dòng riêng.

## Rules

- Tập vai không rỗng, không lặp, lấy trong bốn vai đã khai.
- Ai xem danh sách, mời người và đổi vai do bảng quyền quyết (`ontology/actions.yaml`, ba thao tác `listMembers`,
  `inviteMember`, `changeMemberRoles`); hôm nay chỉ Quản trị sàn của sàn đang làm. Mỗi người đọc được dòng của chính
  mình; đọc thẳng bảng thành viên cũng theo luật ấy.
- Mỗi sàn luôn còn ít nhất một Quản trị sàn.
- Mỗi sàn giữ tên riêng của người; sàn khác không thấy, và mời một email đã có ở sàn khác trả lời như email mới.

## Where in the code

- Cột vai, tên, người mời và bốn hàm hẹp: `db/migrations/003_moi_nguoi_gan_vai.sql`; ba hàm hỏi bảng quyền qua
  `app.allowed`, luật đọc theo dòng thu hẹp theo bảng: `db/migrations/006_bang_quyen_theo_vai.sql`.
- Bảng quyền: `ontology/actions.yaml`; tính phạm vi `src/modules/identity/permissions.ts`; cửa API
  `src/modules/identity/require-action.ts`.
- Logic và đường `/api/v1/members`: `src/modules/identity/members.ts`, `src/modules/identity/members-http.ts`; thư mời
  `src/modules/identity/invite-mail.ts`; danh sách vai `src/modules/identity/roles.ts`.
- Màn Thành viên: `src/app/(app)/members/`. Bài kiểm: `tests/db/moi-nguoi.db.test.ts`, `tests/e2e-db/members.spec.ts`.

## History

Bảng thành viên (chỉ ai thuộc sàn nào) có từ hàng 8, 11/11/2026. Vai, tên theo sàn, lời mời từ hàng 9, 11/11/2026 (hồ sơ
`_acceptance/moi-nguoi-gan-vai/`, quyết định [0022](../decisions/0022-moi-nguoi-gan-vai.md)). Quyền quản trị người
chuyển vào bảng quyền chung ở hàng 9a, 12/11/2026 (hồ sơ `_acceptance/bang-quyen-theo-vai/`).
