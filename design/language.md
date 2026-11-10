# Chuẩn ngôn ngữ của sản phẩm

Áp cùng nguyên tắc với toàn bộ thiết kế: có chuẩn thì dùng, không có thì lập công thức, không có công thức thì dùng danh sách đóng, còn lại là người quyết. Từ điển nằm ở [`ontology/labels.yaml`](../ontology/labels.yaml). Bài kiểm: `tests/language.test.ts`, chạy trong `make check`.

## 1. Khái niệm trước, chữ sau

Mỗi khái niệm có một mã, một nhãn ưu tiên và nhiều nhãn thay thế (mô hình SKOS của W3C). Mã theo RESO DD 2.1 khi RESO có định nghĩa; không có thì ghi `own: true`.

Trước khi đặt nhãn, tách rõ khái niệm thuộc loại nào: phía giao dịch, người môi giới, hay chủ thể giao dịch. Ba loại này không dùng chung một từ.

## 2. Công thức chọn nhãn ưu tiên

Một nhãn được chọn khi đạt cả bốn tiêu chí:

| Tiêu chí                  | Cách kiểm                                                        |
| ------------------------- | ---------------------------------------------------------------- |
| Không trùng nghĩa pháp lý | Đếm trong Luật 29/2023/QH15                                      |
| Phủ đủ các loại giao dịch | Nhãn có chữ «bán» phải có biến thể `lease`                       |
| Ngắn                      | Tối đa 17 ký tự                                                  |
| Hai miền hiểu đúng        | Thử với khoảng 5 người mỗi miền, đích từ 80 % (đề xuất, chưa đo) |

Ngoại lệ phải ghi lý do:

- **«Sàn»** trùng «sàn giao dịch bất động sản», loại hình có quy định riêng trong luật (65 lần). Giữ trên màn nội bộ vì đã quen dùng; trong văn bản pháp lý và trang khách dùng «công ty».

## 3. Theo ngữ cảnh

| Ngữ cảnh                  | Dùng                                                        | Không dùng                       |
| ------------------------- | ----------------------------------------------------------- | -------------------------------- |
| Màn vận hành nội bộ       | Nhãn ưu tiên, hoặc nhãn riêng của sàn                       | Từ trong `avoid`                 |
| Trang khách               | Lời thường, ví dụ «Người tư vấn»                            | Đầu chủ, Đầu khách, tiếng nội bộ |
| Hợp đồng, văn bản pháp lý | Đúng chữ của luật: Bên bán, Bên mua, Bên cho thuê, Bên thuê | Nhãn nội bộ                      |

## 4. Tra nhãn

`nhãn = nhãn riêng của sàn ?? nhãn ưu tiên`. Biến thể đặt theo sàn, không theo locale, vì `vi-VN` không phân biệt được Bắc và Nam. Nhãn phụ thuộc loại giao dịch dùng `select` của ICU MessageFormat qua `next-intl` khi có lớp web. Tìm kiếm khớp cả nhãn thay thế.

## 5. Cách viết

| Quyết định               | Loại                | Quy tắc                                                 | Kiểm bằng           |
| ------------------------ | ------------------- | ------------------------------------------------------- | ------------------- |
| Mã hoá ký tự             | Chuẩn               | Unicode NFC                                             | Bài kiểm            |
| Định dạng số, tiền, ngày | Chuẩn               | `Intl` với `vi-VN`                                      | Lint khi có lớp web |
| Viết hoa                 | Chuẩn của OneHub DS | Chỉ viết hoa chữ đầu câu                                | Bài kiểm            |
| Vị trí dấu thanh         | Danh sách đóng      | Kiểu `hoá`, `hoà`, `toà`, `thoả`, `khoá`, `xoá`, `thuỷ` | Bài kiểm            |
| Xưng hô                  | Chuẩn của OneHub DS | Gọi người dùng là «bạn»                                 | Người soát          |
| Nút                      | Công thức           | Động từ + danh từ, ngắn                                 | Người soát          |
| Câu lỗi                  | Danh sách đóng      | Chuyện gì xảy ra, vì sao, làm gì tiếp                   | Người soát          |
| Dấu chấm than, emoji     | Danh sách đóng      | Không dùng                                              | Bài kiểm            |

Vị trí dấu thanh chưa có quy định thống nhất, và Luật 29/2023 cũng dùng lẫn hai kiểu (`thỏa` 68 lần, `toà` 53 lần). Kho này chọn kiểu mới vì mã Quỹ hàng và OneHub DS đều dùng 100 % kiểu đó. Trích dẫn nguyên văn văn bản pháp luật giữ đúng bản gốc.

## 6. Đo

- 100 % nhãn đi qua từ điển: bài kiểm cấm viết cứng nhãn trong `src/`.
- Nhãn ưu tiên là duy nhất, và không phải nhãn thay thế của khái niệm khác.
- `Hiểu đúng theo miền`: chưa đo, làm trong buổi thử với người dùng.

## 7. Thêm hoặc đổi nhãn

Sửa `ontology/labels.yaml`, chạy `make check`, và nêu trong mô tả PR vì đây là đổi ontology, cần người duyệt. Đổi nhãn không đổi mã.
