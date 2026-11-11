---
type: entity
title: Member (Thành viên)
links:
  [
    ontology/entities/Member.yaml,
    db/migrations/003_moi_nguoi_gan_vai.sql,
    src/modules/identity/members.ts,
  ]
sources: [_acceptance/moi-nguoi-gan-vai/contract.md, wiki/decisions/0016-permission-model.md]
---

# Member (Thành viên)

## Definition

Một người làm việc trong một sàn, với các vai sàn giao (một hay nhiều trong bốn vai của `ontology/roles.yaml`) và tên
sàn đặt cho người ấy. Tương ứng tài nguyên `Member` của RESO 2.1. Cùng một tài khoản đăng nhập có thể là thành viên của
nhiều sàn; mỗi sàn là một dòng riêng.

## Rules

- Tập vai không rỗng, không lặp, lấy trong bốn vai đã khai.
- Chỉ Quản trị sàn của sàn đang làm xem danh sách, mời người và đổi vai (tới khi bảng quyền của hàng 9a thay luật này).
- Mỗi sàn luôn còn ít nhất một Quản trị sàn.
- Mỗi sàn giữ tên riêng của người; sàn khác không thấy, và mời một email đã có ở sàn khác trả lời như email mới.

## Where in the code

- Cột vai, tên, người mời và bốn hàm hẹp: `db/migrations/003_moi_nguoi_gan_vai.sql`.
- Logic và đường `/api/v1/members`: `src/modules/identity/members.ts`, `src/modules/identity/members-http.ts`; thư mời
  `src/modules/identity/invite-mail.ts`; danh sách vai `src/modules/identity/roles.ts`.
- Màn Thành viên: `src/app/(app)/members/`. Bài kiểm: `tests/db/moi-nguoi.db.test.ts`, `tests/e2e-db/members.spec.ts`.

## History

Bảng thành viên (chỉ ai thuộc sàn nào) có từ hàng 8, 11/11/2026. Vai, tên theo sàn, lời mời từ hàng 9, 11/11/2026 (hồ sơ
`_acceptance/moi-nguoi-gan-vai/`, quyết định [0022](../decisions/0022-moi-nguoi-gan-vai.md)).
