# Hình tại Cổng Phạm vi — lui-ban-luc-xoay-mat-khau

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1 — chỉ sửa sổ tay, hay sửa luôn lệnh đưa bản lên (d-20261122T075530Z-14) | 2 nhánh rẽ · 4 bước nối tiếp | cần hình: `hoi-1-lenh-tu-lui.html` |
| Luật theo bản dựng (d-20261122T074926Z-4) | 0 nhánh · 2 bước | dưới ngưỡng: 2 bước nối tiếp |
| Sổ lùi bản chặn ở cửa vào (d-20261122T074926Z-6) | 0 nhánh · 1 bước | dưới ngưỡng: 1 bước |
| Ba dòng thay thế sau phản biện (d-12, d-13, d-14) | — | dưới ngưỡng: sửa căn cứ, không phải quyết mới |

## Đề bài: hoi-1-lenh-tu-lui

- Loại hình: luồng (flowchart) hai làn, trái → phải.
- Làn trên «Hôm nay (giữ lệnh)»: lượt vừa xoay mật khẩu → `vai-dang-nhap đạt` (cơ sở dữ liệu nhận mật khẩu mới) → gắn tên miền sang bản mới (mang mật khẩu mới, nối được) → `kiem-nhanh-ten-mien` đỏ vì lý do khác → lệnh tự lùi về bản trước (dựng trước lượt xoay, mang mật khẩu cũ) → kiểm nhanh đỏ «vai nối chưa đạt» → bản thật mất kết nối tới lần chạy lại xanh. Ô cuối tô màu cảnh báo.
- Làn dưới «Hàng T3 sau (khuyến nghị)»: cùng ba ô đầu → `kiem-nhanh-ten-mien` đỏ → kiểm sức khoẻ bản trước TRƯỚC khi lùi → bản trước không qua → không lùi, tên miền ở lại bản mới (còn nối được) → sửa nguyên nhân, chạy lại.
- Nhãn chữ tiếng Việt, đúng các chuỗi lệnh trong backtick như trên. AC liên quan: AC-2 (bảng dòng của lệnh nói đúng ca làn trên).
