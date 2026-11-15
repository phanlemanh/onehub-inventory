# Hình tại điểm quyết định — kiem-vong-doi-thao-tac

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 chỗ khai (lối A theo câu bật · lối B sổ riêng) | hai nhánh rẽ | cho-khai.png |
| Hỏi-2 máy nhận ra màn hiện gì | dưới ngưỡng: một luồng hai nguồn gộp | — |
| Hỏi-3 bảng ô thiếu | dưới ngưỡng: một bảng | — |
| Hỏi-4 theo từng vai (đỏ ở ô xem · đỏ mọi ô) | hai nhánh rẽ | theo-vai.png |

## Đề bài cho-khai
- Loại: so sánh hai lối cạnh nhau.
- Lối A: design/screens.yaml mỗi màn khoá «hien: [Thực thể]» → ontology/entities/<Thực thể>.yaml khối «vong_doi» (thêm · xem · sửa · gỡ) một lần cho mọi màn.
- Lối B: design/vong-doi.yaml theo màn × thực thể, mỗi cặp bốn ô; căn hiện ở ba màn thì khai ba lần; cần luật chặn danh sách màn thứ hai.
- Chung: phép kiểm lifecycle.py đọc mã màn (chuỗi trường + bảng nút 9b) → đỏ khi màn hiện thứ chưa khai.
- AC: AC-1, AC-2, AC-3.

## Đề bài theo-vai
- Loại: cây hai nhánh.
- Gốc: vai mở được màn hiện thực thể X.
- Nhánh khuyên: ô xem — vai phải giữ thao tác xem, không thì kê «chan» kèm hàng hay «không» có chữ duyệt → đỏ nếu thiếu; ô thêm/sửa/gỡ: vai theo bảng quyền (đã qua cổng 9a, 9e) → in báo cáo.
- Nhánh khác: mọi ô — vai bị chặn phải kê «chan» có chữ duyệt → lần đầu 26 ô phải khai.
- AC: AC-8.
