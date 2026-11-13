---
type: decision
title: Cửa thao tác dùng chung và phụ thuộc mô-đun đầu tiên
links:
  [
    architecture/modules.yaml,
    src/modules/identity/action-door.ts,
    src/modules/listings/server.ts,
    wiki/decisions/0016-permission-model.md,
    _acceptance/luu-goc-nhin-cot-hai/design.md,
  ]
sources:
  ["giám sát đợt nền, yêu cầu K-21 và K-23, 2026-11-12", _acceptance/luu-goc-nhin-cot-hai/plan.md]
---

# 0026 Cửa thao tác dùng chung và phụ thuộc mô-đun đầu tiên

## Status

Accepted, 2026-11-12, ở hàng 2c (lưu góc nhìn). Giám sát duyệt chạm tệp (K-21, K-23); chủ kho soi ở mục «Thêm phụ thuộc
mô-đun» và «Cửa API dùng chung» của PR.

## Context

Góc nhìn đã lưu là thực thể của sàn mà mô-đun `listings` sở hữu. Cửa API của nó phải biết ai đang gọi, sàn nào, và bảng
quyền (quyết định 0016) có cho thao tác ấy không — trước khi chạm dữ liệu. Tới hàng này chỉ mô-đun `identity` làm việc đó,
và làm riêng cho cửa thành viên (`guarded()` trong `members-http.ts`). Mọi mô-đun còn `depends_on: []`.

## Decision

- `listings` phụ thuộc `identity` (`architecture/modules.yaml`), chỉ qua `index.ts` và `server.ts` của nó. Đây là phụ thuộc
  đầu tiên giữa hai mô-đun nghiệp vụ.
- `identity` mở một cửa chung, `openDoor` (`src/modules/identity/action-door.ts`): đọc phiên từ cookie, đòi sàn đã chọn,
  hỏi bảng quyền, trả ngữ cảnh cho `withCompany` cùng phạm vi của ô — hoặc một mã lỗi cố định. Đóng mặc định: thiếu phiên,
  phiên hết hạn, chưa chọn sàn, không thuộc sàn đã chọn, thao tác lạ hay lỗi khi đọc đều trả mã lỗi, không bao giờ trả ngữ
  cảnh. Bản chạy thật: `actionDoor(req, action)` cho cửa API, `sessionDoor(action)` cho trang máy chủ.
- Cơ sở dữ liệu vẫn kiểm lại riêng (`app.allowed`, luật theo dòng), nên cửa này là khoá thứ nhất, không phải khoá duy nhất.

Lối khác đã cân: chép cách đọc cookie và hỏi bảng quyền sang `listings` — hai chỗ cho một luật, AGENTS.md cấm; dời góc nhìn
sang `identity` — sai chủ sở hữu thực thể.

## Consequences

- Mọi mô-đun sau có cửa API đi qua `openDoor`, thêm `identity` vào `depends_on` của mình.
- Cửa thành viên vẫn dùng `guarded()` riêng; cho nó dùng lại `openDoor` là một hàng sau (giữ hàng này không đổi hành vi
  của đăng nhập và thành viên).
