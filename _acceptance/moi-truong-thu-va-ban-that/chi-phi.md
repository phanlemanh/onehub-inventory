# Chi phí hằng tháng — hàng 22

Tra ngày 2026-11-16 trên trang giá chính thức, không đăng nhập. Giá chưa gồm thuế, tính bằng đô la Mỹ. Con số nào
không đọc được trên trang thì ghi «chưa kiểm được», không đoán.

## Từng dịch vụ

| Dịch vụ | Gói | Giá | Điều chạm trước | Nguồn |
|---|---|---|---|---|
| Vercel | Hobby | 0 | Không dùng được: điều khoản ghi Hobby chỉ «for your personal or non-commercial use» (§4) | vercel.com/legal/terms, vercel.com/docs/plans/hobby |
| Vercel | Pro | 20 mỗi chỗ người làm, chỗ chỉ xem không mất tiền | Kèm 20 tín dụng dùng; quá thì tính thêm, có trần chi tiêu đặt được (mặc định 200, tạm dừng dự án khi chạm) | vercel.com/pricing |
| Supabase | Free | 0 | Tối đa 2 dự án; dự án ngừng sau 1 tuần không ai dùng; KHÔNG có sao lưu tự động; 500 MB | supabase.com/pricing |
| Supabase | Pro | 25 cho cả tổ chức, kèm 10 tín dụng máy (đủ một máy Micro) | Mỗi dự án thêm một máy Micro khoảng 10/tháng; sao lưu hằng ngày giữ 7 ngày; 8 GB mỗi dự án | supabase.com/pricing, supabase.com/docs/guides/platform/manage-your-usage/compute |
| Supabase | Khôi phục theo thời điểm (PITR) 7 ngày | 100 mỗi dự án | Thay cho sao lưu hằng ngày của dự án ấy; mất tối đa khoảng 2 phút dữ liệu | supabase.com/docs/guides/platform/backups |
| Supabase | Team | 599 | Sao lưu giữ 14 ngày — quá cỡ cho lúc ra mắt | supabase.com/pricing |
| Resend | Free | 0 | 100 thư mỗi ngày, 3.000 thư mỗi tháng, 3 tên miền | resend.com/pricing |
| Resend | Pro | 20 | 50.000 thư mỗi tháng, không trần ngày, 10 tên miền; quá thì 0,90 cho 1.000 thư | resend.com/pricing |

## Ba lối cho cả bản thử và bản thật

| | A · rẻ nhất dùng được | B · khuyên | C · thêm an toàn |
|---|---|---|---|
| Vercel | Pro 1 chỗ = 20 | Pro 1 chỗ = 20 | Pro 1 chỗ = 20 |
| Supabase bản thật | Pro: 25 + 10 máy − 10 tín dụng = 25 | Pro, hai dự án: 25 + 10 + 10 − 10 = 35 | 35 + PITR 7 ngày cho bản thật 100 = 135 |
| Supabase bản thử | tổ chức Free riêng = 0 | đã gồm trong 35 | đã gồm trong 135 |
| Resend | Free = 0 | Free = 0 | Pro = 20 |
| **Tổng mỗi tháng** | **45** | **55** | **175** |
| Sao lưu | Chỉ bản thật; bản thử không có sao lưu và ngừng sau 1 tuần không dùng | Cả hai, hằng ngày, giữ 7 ngày; thử khôi phục trên bản thử được | Bản thật khôi phục về bất kỳ lúc nào trong 7 ngày |
| Chạm trước | Resend 100 thư/ngày; bản thử ngủ sau một tuần | Resend 100 thư/ngày, rồi 20 tín dụng của Vercel | 20 tín dụng của Vercel, rồi 8 GB dữ liệu |

Mỗi người làm thêm trên Vercel cộng 20. Đợt mời đông (trên 100 thư một ngày) thì đổi Resend sang Pro: lối B thành 75.

## Chưa kiểm được

1. Supabase gói Free có chọn được vùng Singapore không: trang vùng liệt Singapore nhưng không nói theo gói (lối A).
2. Khôi phục sao lưu Supabase vào một dự án mới tốn bao nhiêu: trang không ghi; tính theo giá giờ của máy Micro trong lúc
   bản sao còn chạy.
3. Sao lưu hằng ngày của Supabase không tải về được; muốn giữ một bản ngoài thì dùng lệnh sao lưu của kho (hàng này).
4. Vercel Pro được mấy vùng chạy hàm: bảng tài liệu ghi 5, một dòng nhật ký thay đổi ghi 3. Hàng này chỉ cần Singapore.
5. Dự án Free nằm trong tổ chức trả phí của Supabase tính tiền ra sao: không ghi, nên lối A đặt bản thử ở tổ chức Free riêng.

## Đường dẫn đã đọc (2026-11-16)

- https://vercel.com/pricing
- https://vercel.com/docs/plans/hobby
- https://vercel.com/legal/terms
- https://vercel.com/docs/limits/fair-use-guidelines
- https://vercel.com/docs/functions/configuring-functions/region
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/platform/manage-your-usage/compute
- https://supabase.com/docs/guides/platform/regions
- https://resend.com/pricing
