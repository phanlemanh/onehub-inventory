# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng ngày 2026-11-17 (commit `07cc1d9f`). Sau khi gộp `origin/main` (PR #82) vào nhánh và mở
PR #84, check `e2e-db` của CI đỏ. Chủ kho chọn sửa ngay trên nhánh này («sửa trên nhánh này», 2026-11-17); hợp đồng mở
lại để nới AC-10 và thêm AC-11, rồi duyệt lại Cổng Phạm vi, chấm lại và ký lại Cổng Bằng chứng.

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Vì sao |
| --- | --- | --- | --- |
| `tests/e2e-db/screens.spec.ts`: danh sách màn bộ kiểm có phiên đo, nay theo thứ tự mã màn | Không với người dùng; bộ kiểm màn có phiên chạy lại được trên CI | Chính bài `tap man do co phien` (E23): trước khi sửa đỏ ở bốn khổ trên CI và trên dãy H | Từ bản 0.7.0 sổ màn được đọc theo mã màn; commit lên đời đã sửa hai bài thứ tự cùng lớp nhưng sót bài này, vì bộ kiểm của hồ sơ không chạy e2e-db |
