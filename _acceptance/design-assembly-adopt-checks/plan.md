# Kế hoạch thi công — design-assembly-adopt-checks

Hồ sơ chấm thay đổi đã có trên nhánh `chore/design-assembly-adopt` (PR 111). Không còn dòng mã sản phẩm nào phải viết.

| Người dùng thấy gì khác                                                    | Đụng đâu                                                                         | Phục vụ tiêu chí                     |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| Không gì: tám quyết định thiết kế đã nối vào kiểm tra từ commit `48c33f30` | `design/decisions.yaml`, `design/theme.json`, `.claude/rules/design-assembly.md` | AC-1 đến AC-5 (đã làm, chỉ chấm)     |
| Người duyệt có phép đo hai chiều cho từng tiêu chí mới                     | `_acceptance/design-assembly-adopt-checks/rang/`                                 | AC-2, AC-4, AC-5 (phép đo của hồ sơ) |

Task 1 — independent: true. Files: không. Verify: `bash _acceptance/design-assembly-adopt-checks/rang/chay.sh two-way` (17 bài đạt). Phục vụ E2, E4, E6, E7.
