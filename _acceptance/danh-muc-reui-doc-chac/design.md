# Danh mục ReUI đọc chắc — thiết kế

Hàng 1k của lộ trình. Nguồn: bốn mục ngoài hợp đồng của hồ sơ `danh-muc-reui` mà chủ kho chọn mở hợp đồng mới ở Cổng
Bằng chứng ngày 11/11/2026 — Ngoài-2, Ngoài-8, Ngoài-20 (cùng một lỗi: đọc nguồn theo tiêu đề mục quá hẹp) và
Ngoài-13 (ma trận chuỗi cấm viết trước còn thiếu phần, số ca chỉ là độ dài của chính ma trận).

## Vấn đề

1. Bộ đọc `llms-full.txt` chỉ nhận một nhóm khi tiêu đề khớp đúng `## Pro blocks (678)` hay `## Free examples (1,264)`.
   Tiêu đề đổi dạng (chữ hoa, bỏ số khai, đổi cấp tiêu đề, xuống dòng kiểu Windows, đổi tên) thì cả nhóm bị bỏ qua
   lặng lẽ: lệnh ghim lại thoát 0, ghi danh mục thiếu hàng trăm mục, và `--check` vẫn xanh vì nó sinh lại từ chính ảnh
   chụp thiếu ấy. Agent sau đó tra «không có» cho khối có thật. Bộ đọc `llms.txt` đã dừng khi mất nhóm thành phần gốc,
   nhưng thông điệp («count mismatch: … section not found») không cùng khuôn và không nói tệp.
2. Bộ kiểm chuỗi cấm chỉ thử 9 lần chèn, đều vào mô tả của một mục hay dòng 3 của ảnh chụp; số 9 chỉ là độ dài của
   chính danh sách. Nếu ai làm hỏng việc quét một trường hay một dạng chuỗi, bộ kiểm vẫn xanh. Khi kê đủ chỗ chèn còn
   lộ thêm: hàm quét hôm nay không quét chữ trong khoá `counts`.

## Cách làm

**Nhóm bắt buộc.** `catalog.mjs` khai một bảng `REQUIRED_SECTIONS` — ba nhóm, mỗi nhóm một tệp nguồn, một tiêu đề và
một loại mục: `llms-full.txt` · Pro blocks · block, `llms-full.txt` · Free examples · example, `llms.txt` · ReUI
Primitives · component. TRƯỚC khi đọc mục, bộ đọc quét các dòng tiêu đề của tệp tìm đúng dòng của từng nhóm bắt buộc;
nhóm nào không có, mọi nhóm ấy được kê trong MỘT lỗi, mỗi nhóm một dòng `section missing in <tệp>: <tiêu đề>
(<loại>)`. Quét trước khi đọc mục để mọi dạng đổi tiêu đề ra cùng một lỗi — kể cả khi tiêu đề bị hạ cấp thành `###`
và lẽ ra rơi vào phép đếm của nhóm trước. Khi trong tệp có một dòng tiêu đề trông giống (bỏ dấu `#`, số khai, khoảng
trắng, chữ hoa thường thì trùng tên nhóm), dòng lỗi thêm `— nearest heading line <số>: <dòng>`; tiêu đề bị đổi tên hẳn
thì không có gợi ý. Bộ đọc không tự nới khuôn để nhận tiêu đề lạ: dừng và gọi tên là đúng ý định, đoán là sai.

Vì `parseSources` dừng, ba đường cùng dừng mà không cần sửa riêng: ghim lại (dừng trước khi ghi tệp nào — đã có sẵn
trong `refresh`), sinh lại, và `--check`.

**Ma trận chuỗi cấm toàn phần.** Tệp kiểm mới `tools/reui_catalog/doc-chac.test.mjs` khai trước hai danh sách: 10
dạng chuỗi cấm đã kê (dấu ba backtick; ba dạng `import … from`; bốn dạng `export default/const/function/class`;
`Bearer`; `REUI_LICENSE`) và 27 chỗ chèn: hai khoá cấp gốc chứa giá trị (`pin`, `counts`); bốn trường nhóm và ba trường
mục, mỗi trường ở nhóm và mục đầu của cả ba loại; hai tệp ảnh chụp ở dòng 3 và dòng cuối có chữ. Ma trận là tích — 270
ca, chạy trong tiến trình trên `scanCatalog`/`scanSnapshot`, mỗi ca khẳng định mảng lỗi đúng bằng một chuỗi viết sẵn.
Mỏ neo độc lập với chính ma trận: nhãn của 10 dạng bằng nhãn `FORBIDDEN`; khoá gốc bằng `ALLOWED_FIELDS.top` trừ
`groups`; trường nhóm, mục bằng `ALLOWED_FIELDS`; ba loại bằng `KINDS`; hai tệp bằng `SOURCES`. Thêm một dạng cấm, một
trường hay một loại vào mã mà quên ma trận thì đỏ. `scanCatalog` thêm `counts` vào phần quét chữ. Trường lạ ở ba cấp là
ma trận riêng 3 ca, neo vào ba khoá của `ALLOWED_FIELDS`. Đường lệnh `--check` được chứng bằng 10 cặp chỗ–dạng kê
trước, mỗi dạng một lần, phủ bốn lớp chỗ.

**Không chạm hồ sơ cũ.** `catalog.test.mjs` của hàng 1g giữ nguyên từng byte: hồ sơ đã ký của nó đếm đúng 33 ca trong
tệp ấy và đếm ca theo tên mở đầu `E<n> ·`; không eval nào của nó so tổng số ca của cả thư mục. Ca mới mở đầu bằng
`DC<n> ·`. Tệp kiểm mới tự mang vài hàm dựng bản sao (chép lại có chủ ý, không tách mô-đun dùng chung, để khỏi sửa tệp
cũ).

## Lựa chọn đã loại

- Nới khuôn tiêu đề (không phân biệt hoa thường, cho phép thiếu số khai): nhận im lặng một nguồn đổi nghĩa; trái ý
  định «dừng và gọi tên».
- Chặn ở `--check` bằng ngưỡng số mục tối thiểu mỗi loại: con số tuỳ tiện, và không gọi được tên nhóm hay dòng đổi.
- Cho 270 ca chèn chạy lệnh thật: 270 tiến trình con, bộ kiểm chậm vài phút; thước trong tiến trình đo đúng hàm quét,
  còn đường lệnh đã có 10 ca riêng.

## Đặc tả UX

Bỏ — vòng không có màn (sổ quyết định, dòng «bỏ đặc-tả-UX»). Mặt người dùng duy nhất là dòng lỗi của lệnh ghim lại,
khuôn ghi ở trên.
