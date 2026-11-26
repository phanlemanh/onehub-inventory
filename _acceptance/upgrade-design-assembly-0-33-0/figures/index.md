# Hình tại điểm quyết định — upgrade-design-assembly-0-33-0

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1 — chấm từ bản chép nhánh bên ngoài kho | dưới ngưỡng: một lựa chọn có/không, một bước | — |
| Hỏi-2 — hợp đồng viết cho 0.36.1; khi bản ấy cài, chạy lại `upgrade` và ghim số của nó không duyệt lại | cần hình: bốn bước nối tiếp, hai nhánh (trước hay sau lượt chấm) | `lan-chay-lai-0-36-1` |
| Các dòng sổ S1 máy đã quyết chờ niêm phong | dưới ngưỡng: mỗi dòng một lựa chọn | — |

## Đề bài `lan-chay-lai-0-36-1`

- Loại hình: luồng (flowchart) dọc, nhãn tiếng Việt.
- Nút: «Phiên design-assembly báo 0.36.1 đã cài» → «Xem trước upgrade trên nhánh» → «Chạy upgrade, một commit chỉ đổi thư mục công cụ, dấu phiên bản và bước cổng» → «Ma trận ghim mã cây, bước cổng và danh sách tệp của 0.36.1, một dòng sổ fix» → rẽ hai nhánh: «Chưa chấm: lượt chấm đầu đo trên 0.36.1» / «Đã chấm: lượt chấm mới đo lại mọi tiêu chí» → «Cổng Bằng chứng: chủ kho thấy mã 0.36.1, CodeQL hết cảnh báo».
- Nhánh phụ từ «Xem trước»: «Xem trước đổi gì ngoài thư mục công cụ, dấu hay bước cổng, hoặc một quyết định đổi trạng thái» → «Dừng, trình chủ kho».
- AC liên quan: AC-3, AC-6.
