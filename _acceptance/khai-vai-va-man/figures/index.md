# Hình tại điểm quyết định — khai-vai-va-man

| Điểm | Đếm | Hình |
|---|---|---|
| Hồ sơ nào phải có khối Vai × Màn (d-…-6) | hai nhánh rẽ nối tiếp: chạm giao diện? → đã đóng? → có khối? | `phan-loai-ho-so` |
| Vòng chạm quyền không khai mặt giao diện (Hỏi-1, d-…-13) | dưới ngưỡng: 1 nhánh | — |
| Bốn vai, không Người giữ (d-…-3) | dưới ngưỡng: 0 nhánh | — |
| Ba lời trong ô (d-…-7) | dưới ngưỡng: 1 bước | — |

## Đề bài: phan-loai-ho-so

- Loại: sơ đồ luồng quyết định (flowchart), đọc từ trên xuống.
- Nút: «Hồ sơ trong _acceptance» → «surfaces có ui/web/web-ui, hoặc khai screens?» — không → «Không đòi khối (không đếm vào vòng chạm màn)»; có → «Có mục ## Vai × Màn?» — không → «Đã đóng (signed-off, machine-cleared)?» — có → «Trước khối: xanh, đếm riêng»; không → «ĐỎ: thiếu khối»; có mục → «screens rỗng?» — có → «Có dòng lý do? có → xanh, đếm “không khai màn”; không → ĐỎ» ; không rỗng → «Kiểm đủ ô: cột = bốn vai, dòng = screens, ô mở đầu được/chặn/không liên quan» → «Đủ: xanh, đếm “đủ ô”» / «Thiếu: ĐỎ, gọi tên hồ sơ, màn, vai».
- Nhãn bằng chữ tiếng Việt như trên; màu đỏ chỉ cho nút ĐỎ.
- AC liên quan: AC-5, AC-6, AC-7, AC-8.
