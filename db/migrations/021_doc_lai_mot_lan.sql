-- 021_doc_lai_mot_lan.sql · Đọc lại lần nhập cũ chỉ một lần cho mỗi lần nhập (hàng 3h, hồ sơ tin-rao-giu-gia-tri-rieng,
-- G-2811-69): `make tin-rao-doc-lai` điền giá trị lớp «tệp» cho tin của những lần nhập có trước 3h. Chạy lại sau khi người
-- dùng đã «Lấy lại» một giá trị thì không được điền lại giá trị ấy, nên mỗi lần nhập nhớ lúc giá trị tệp của nó đã được
-- đọc. Lần nhập có trước cột này để trống — lệnh đọc lại nó một lần rồi ghi dấu; lần nhập mới nhận dấu ngay khi tạo, vì
-- bước ghi của lần nhập (hàng 3h, việc 6) đã ghi giá trị tệp lúc ấy. Bảng `import_runs` đã ép cách ly theo dòng (015).

alter table import_runs add column file_values_read_at timestamptz;
alter table import_runs alter column file_values_read_at set default now();
