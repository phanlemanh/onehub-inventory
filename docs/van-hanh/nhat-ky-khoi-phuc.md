# Nhật ký khôi phục

Sổ ghi mỗi lần thử khôi phục dữ liệu: bản sao lưu có khôi phục được không, đủ bảng và đủ dòng không, và bản khôi phục còn
giữ cách ly giữa các sàn không. Mỗi lần thử thêm một dòng vào bảng cuối trang, dòng mới nhất ở dưới cùng.

## Khuôn dòng

Lệnh thử khôi phục, khi đạt, in đúng một dòng theo khuôn:

`khoi-phuc: <YYYY-MM-DD> · <n> bảng · <m> dòng · cach-ly đạt`

- `<YYYY-MM-DD>` — ngày thử.
- `<n>` — số bảng có trong bản sao lưu.
- `<m>` — tổng số dòng của mọi bảng trong bản sao lưu; bản khôi phục phải có đúng số dòng ấy ở từng bảng.
- `cach-ly đạt` — bộ kiểm cách ly chỉ đọc đã chạy trên bản khôi phục và mọi ca đạt.

Lệnh đỏ thì không in dòng này: nó gọi tên bảng thiếu (`thieu bang: …`), bảng lệch dòng (`lech dong: …`) hay ca cách ly
chưa đạt. Lần đỏ không ghi vào bảng dưới đây như một lần đạt; ghi vào cột Ghi chú cùng việc đã làm.

## Cách ghi

1. Chép nguyên dòng `khoi-phuc: …` lệnh in vào cột Dòng kết quả.
2. Ghi nơi thử (làn của máy, bản thử, bản thật), bản sao lưu lấy từ đâu và ai thử.
3. Không ghi địa chỉ cơ sở dữ liệu, mật khẩu hay tên tệp có dữ liệu thật.

## Các lần thử

| Dòng kết quả | Nơi thử | Bản sao lưu | Người thử | Ghi chú |
| ------------ | ------- | ----------- | --------- | ------- |
