---
schema_version: 1
slug: ung-dung-noi-bang-vai-khong-chu
feature: Ứng dụng nối cơ sở dữ liệu bằng một vai đăng nhập không phải chủ bảng, chỉ là thành viên của vai API, để mã trong cửa có đổi vai cũng không về được vai chủ
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build       # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T08:25:47Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 7c
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 7c của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Ứng dụng nối cơ sở dữ liệu bằng một vai đăng nhập không phải chủ bảng, chỉ là thành viên của vai API, để mã trong cửa có đổi vai cũng không về được vai chủ

Vì sao: Từ hàng 7a: luật quét một cửa chỉ bắt câu viết thẳng; gốc của mục Ngoài-5 hàng 7 nằm ở vai đăng nhập. Phải xong trước khi nối dữ liệu thật

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Chuỗi nối của ứng dụng dùng vai đăng nhập riêng không sở hữu bảng nào; từ vai ấy lệnh đổi về vai chủ bị từ chối; bộ kiểm cách ly và mọi bài cơ sở dữ liệu chạy dưới vai ấy vẫn xanh; ca phá cấp lại quyền chủ thì đỏ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Chuỗi nối của ứng dụng dùng vai đăng nhập riêng không sở hữu bảng nào; từ vai ấy lệnh đổi về vai chủ bị từ chối; bộ kiểm cách ly và mọi bài cơ sở dữ liệu chạy dưới vai ấy vẫn xanh; ca phá cấp lại quyền chủ thì đỏ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Chuỗi nối của ứng dụng dùng vai đăng nhập riêng không sở hữu bảng nào; từ vai ấy lệnh đổi về vai chủ bị từ chối; bộ kiểm cách ly và mọi bài cơ sở dữ liệu chạy dưới vai ấy vẫn xanh; ca phá cấp lại quyền chủ thì đỏ» khi hết timebox
- Timebox: …
