# Nguồn bộ tệp thử của hàng 11 (nhap-excel)

Mọi tệp do `tao.mjs` ở thư mục này ghi; chạy lại `node tests/fixtures/nhap-excel/tao.mjs` để sinh lại. Dữ liệu mẫu
`[Tên]`, `0900 000 0xx`, không dữ liệu thật.

- Bộ ghi không phải bộ đọc: `.xlsx` được nén bằng `fflate` từ XML viết tay trong `tao.mjs` (chuỗi dùng chung, số, ngày
  lưu dạng số ngày của Excel với kiểu ngày, nhiều trang tính), còn sản phẩm đọc bằng `read-excel-file`.
- `gon.xlsx` — tệp gọn: tiêu đề chuẩn, giá là số, cột «Ngày check» là ngày Excel; ba trang tính (đọc trang đầu có dữ liệu).
- `ban.xlsx` — tệp bẩn: viết tắt («DT», «PN», «TT», «Giá KBP»), giá bằng chữ («4,65 tỷ», «3ty9», «4700tr», «thoả thuận»),
  hai cột cùng đích («Giá KBP», «Giá»), cột số chủ nhà, một căn lặp, một dòng trống giữa các dòng.
- `ban-2.xlsx` — cùng dạng tệp với `ban.xlsx`, dòng khác, thêm chữ trạng thái mới «giữ chỗ» (lần nhập thứ hai).
- `sheet.csv` — theo khuôn Google Sheet «Tải xuống → .csv»: phẩy, UTF-8 không BOM, ô có phẩy và xuống dòng trong ngoặc kép.
- `excel-vn.csv` — theo khuôn Excel đặt tiếng Việt «CSV UTF-8»: chấm phẩy, có BOM.
- `khoa.xlsx` — đầu tệp của tệp ghép (compound file) như tệp Excel khoá mật khẩu; `hong.xlsx` — chữ ký zip nhưng không phải zip.

Giới hạn đã khai: máy dựng không có Excel hay LibreOffice nên không có tệp do chính ứng dụng ấy lưu (gap-probe P1). Chủ
kho thả một tệp Excel thật đã thay tên và số bằng `[Tên]`, `0900 000 0xx` vào đây thì thêm một ca vào
`tests/nhap-excel-doc-tep.test.ts`.
