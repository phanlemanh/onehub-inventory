# Hình tại điểm quyết định — tat-plugin-cho-cu

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1 · thước nk30_leftover của hồ sơ đã ký đỏ khi có khoá tắt (d-20261118T143848Z-7) | hai nhánh rẽ | cần hình: `hoi-1-hai-loi.html` |
| Tắt sáu thay vì ba (d-…-4) | dưới ngưỡng: một bước | — |
| Hỏi-2 · ở lại phiên này hay mở phiên mới ở worktree (d-20261118T144336Z-8, thay d-…-3) | hai nhánh rẽ | cần hình: `hoi-2-phien.html` |
| bỏ coverage-scan, bỏ đặc-tả-UX (d-…-5, d-…-6) | dưới ngưỡng: một bước | — |

## Đề bài: hoi-1-hai-loi

- Loại hình: cây quyết định hai nhánh (decision tree), ngang.
- Gốc: «Ba (sáu) khoá tắt trong .claude/settings.json → nk30_leftover của hồ sơ nang-kit-3-0 đỏ khi chạy lại».
- Nhánh A (máy khuyên): «Không sửa hồ sơ đã ký» → «AC-4 đo quan hệ: mọi dòng bắt được là khoá tắt, đủ 6» → «hạt giống: sửa thước ở vòng sau» · giá: một thước đã ký đỏ nếu bị chạy lại tới vòng sau.
- Nhánh B: «Sửa SWEEP_EXCLUDE của nang-kit-3-0» → «ghim lại nang-kit-3-0 bằng làn máy, cỡ một giờ» · giá: chạm hồ sơ đã ký, tuần còn 5% hạn mức.
- AC liên quan: AC-4.

## Đề bài: hoi-2-phien

- Loại hình: cây quyết định hai nhánh, ngang, cùng kiểu hình hoi-1-hai-loi.
- Gốc: «Phiên này nạp hai bản kit — /feature-loop:feature-loop rơi vào 2.38.1».
- Nhánh A (máy khuyên): «Ở lại phiên này» → «văn bản nhạc trưởng 2.38.1, trùng 3.0.0 trừ link» → «script, workflow, tài liệu qua cache 3.0.0; mỗi skill phụ ghi Base directory vào sổ» · giá: skill phụ nạp trong phiên này vẫn có thể rơi vào bản cũ.
- Nhánh B: «Áp khoá tắt vào cây» → «anh mở phiên mới ở worktree» → «chạy lại từ Cổng Phạm vi ở phiên mới» · giá: thêm một lượt gọi anh (trần 4), phiên mới nạp lại hồ sơ từ đĩa.
- Dòng sổ: d-20261118T144336Z-8.
