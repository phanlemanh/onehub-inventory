# Kế hoạch: lên đời design-assembly 0.36.1 → 0.69.0, chỉ phần máy

Hồ sơ `_acceptance/upgrade-design-assembly-0-69-0/`, PR #120. Chủ kho gộp Gate 1.5 vào Cổng Phạm vi ngày 2026-11-26
(Hỏi-2): mã đã có trên nhánh (`7174ab43`, `78124335`), nên kế hoạch chỉ còn phần đo.

| Người dùng thấy gì khác                                | Đụng đâu                                                     | Phục vụ tiêu chí                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Kho chạy bộ kiểm thiết kế bản mới mà mọi số giữ nguyên | `tools/design-assembly/`, `mk/design-assembly.mk`, `design/` | AC-1 (bài kiểm của kho), AC-2 (cổng thiết kế), AC-3 (trùng bản phát hành), AC-4 (quyết định giữ trạng thái) |
| CI trên bản tải nông vẫn chạy được chốt mới            | `tests/ci-ban-sao-nong.test.ts`                              | AC-5 (bản tải nông)                                                                                         |
| Nhánh không mang thay đổi lạ                           | cả nhánh                                                     | AC-6 (danh sách tệp)                                                                                        |
| Luật kiểm React chỉ tắt cho thư mục công cụ            | `eslint.config.js`                                           | AC-7 (tầm của chỗ tắt luật)                                                                                 |
| Thành phần mới chưa vào sổ nhận khối bị chặn           | `design/theme.json`                                          | AC-8 (chọn trước khi vẽ)                                                                                    |

## Việc

1. Đã xong: chạy `upgrade` 0.69.0 và hai chỗ sửa của kho (`7174ab43`), dòng nhật ký (`78124335`). `independent: false`.
2. Đã xong: bộ phép đo `rang/` (ma trận, mười phép đo, hai bộ ca phá) chạy xanh trên nhánh và đỏ đúng chỗ trên bản phá.
   Verify: `node _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs` và `shallow-two-way.mjs`. Phục vụ E1–E15.
   `independent: false`.
3. Chấm độc lập (S4) từ bản chép kho bên ngoài `~/dev/onehub-inventory-cham-0690` (Hỏi-1), vì đợt nen đang tạm dừng.
   Bằng chứng commit trong bản chép rồi đưa về nhánh.
4. Trước Cổng Bằng chứng: CI của PR xanh trên đúng commit đã chấm, gồm job `e2e` (bài `floating-parts.spec.ts`).
