---
schema_version: 1
feature: go-hoi-khi-gop
slug: go-hoi-khi-gop
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-10
design_doc: docs/superpowers/specs/2026-11-10-go-hoi-khi-gop-design.md
---

# Acceptance Contract: go-hoi-khi-gop

## Context

Chủ kho đã giao quyền gộp cho máy và quyết định chỉ xuất hiện ở các cổng, nhưng cấu hình quyền của kho vẫn buộc mọi lệnh gộp phải hỏi người. Vòng này gỡ bước hỏi cho lệnh gộp thường, vẫn giữ bước hỏi cho bốn kiểu gộp trái nếp của kho.

Source input: prompt, chủ kho ngày 10/11/2026, nguyên văn "Gỡ bước hỏi".

## Criteria

- AC-1: Given cấu hình quyền của kho, When áp từng luật hỏi và luật cấm lên 6 lệnh gộp thường đã kê sẵn, Then không luật nào khớp lệnh nào.
- AC-2: Given cấu hình quyền của kho, When áp luật hỏi lên 16 lệnh gồm 4 cờ `--auto`, `--admin`, `--squash`, `--rebase` ở 4 chỗ (ngay sau `merge`, giữa lệnh, cuối lệnh, kèm `--merge`), Then cả 16 lệnh đều khớp luật hỏi.
- AC-3: Given cấu hình quyền của kho, When áp luật hỏi lên lệnh duyệt PR và lệnh tạo bản phát hành, Then cả hai vẫn khớp.
- AC-4: Given bản cấu hình ở commit `84a2d597` trước vòng này, When so danh sách cấm và danh sách cho phép với bản sau vòng, Then cả hai giống từng dòng, đúng thứ tự.
- AC-5: Given 12 bản sao cấu hình, mỗi bản phá đúng một chỗ, When bộ kiểm chạy trên từng bản, Then bộ kiểm báo đỏ và thông điệp gọi tên đúng cờ, lệnh hoặc danh sách bị phá.

## Coverage

Thước đối chiếu: bảng cờ của lệnh `gh pr merge --help`, đọc ngày 10/11/2026, và ba danh sách trong cấu hình quyền.

- Trục kiểu gộp: thường (`--merge`, `-m`, không cờ) | `--auto` | `--admin` | `--squash` | `--rebase`.
- Trục dạng viết: ngay sau `merge` | giữa lệnh | cuối lệnh | kèm `--merge` | viết tắt.
- Trục danh sách quyền: hỏi | cấm | cho phép.
- Ô gộp thường đi AC-1. Ô bốn kiểu trái nếp ở bốn dạng viết đi AC-2. Trục danh sách đi AC-3 và AC-4.
- Ô viết tắt `-s`, `-r` không có AC: máy luôn viết cờ dạng đầy đủ, ghi thành hạn chế đã biết ở Notes và đưa ra Cổng Phạm vi quyết (Hỏi-1).
- Cờ `--disable-auto` không tạo lần gộp nào nên loại khỏi trục kiểu gộp.

## Out of scope

- Không đổi cấu hình quyền cấp máy của chủ kho.
- Không đổi luật cấm sửa tệp CI, cấm đẩy thẳng lên `main`, hay bất kỳ rào nào ngoài luật hỏi khi gộp.
- Không đổi luật bảo vệ nhánh trên GitHub.
- Không bật gộp tự động cho kho.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Luật quyền so theo mẫu chữ, không phải rào bảo mật. Dạng viết tắt `-s`, `-r` không khớp mẫu.
- Lệnh gộp có chữ `--squash` nằm trong phần tiêu đề commit sẽ bị hỏi nhầm. Việc này chỉ thêm một lần hỏi, không mở rào.
- Phép cho phép gộp nằm ở cấu hình cấp máy của chủ kho. Máy khác chưa có phép đó thì lệnh gộp vẫn xin phép theo mặc định.
- Bộ kiểm chỉ đọc nội dung tệp. Hộp xin phép có thật sự hết hay không chỉ thấy ở lần gộp thật đầu tiên sau khi vòng này vào `main`.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-10:
  - Ngoài-1: Máy có thể gộp thay đổi hạng cao mà không có người bấm duyệt, trong khi chính sách của kho ghi là người phải duyệt; chủ kho sẽ tự chỉnh câu chính sách.
  - Ngoài-3: Một vài cách viết lệnh duyệt PR có thể không bị hỏi, và bộ kiểm chưa đo các cách viết đó.
  - Ngoài-4: Bộ kiểm chứng minh luật khớp theo cách hiểu của người viết, công cụ thật chỉ được xác nhận ở lần gộp thật đầu tiên.
