---
schema_version: 1
slug: ho-so-du-thong-tin
feature: "Đầu chủ mở hồ sơ căn và đọc đủ thông tin của căn và của lần chào: tầng, hướng, loại hình, pháp lý, nội thất, tài chính, tình trạng sử dụng, các lần chào trước của căn, mức đủ thông tin và lần xác nhận với chủ nhà cách đây bao lâu"
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T22:20:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3b
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3b của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ mở hồ sơ căn và đọc đủ thông tin của căn và của lần chào: tầng, hướng, loại hình, pháp lý, nội thất, tài chính, tình trạng sử dụng, các lần chào trước của căn, mức đủ thông tin và lần xác nhận với chủ nhà cách đây bao lâu

Vì sao: Chủ kho 2026-11-12 ở Cổng Đáng của năm hàng tách ra khi so hồ sơ căn của Quỹ hàng với hàng 3 «Hồ sơ căn»: «Build cả năm hàng». Bản so 38 hạng mục người dùng thấy cho biết hồ sơ hàng 3 chưa hiện tầng, hướng, loại hình, chưa có phần lần chào, các lần chào cũ của căn và thanh mức đủ thông tin, còn ngày xác nhận thì không đếm ngày và không có câu «Chưa xác nhận với chủ nhà». Mô hình nghiệp vụ chưa có pháp lý, nội thất, tài chính, tình trạng sử dụng, mà luật Sẵn sàng bán của Quỹ hàng đòi pháp lý và tình trạng sử dụng, nên hàng này đứng trước hàng 15. Đổi mô hình nghiệp vụ nên cần chủ kho soi

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Hồ sơ căn hiện đủ thuộc tính căn từ danh mục dùng chung — loại căn, diện tích, phòng ngủ, tầng, hướng, toà, khu, loại hình; dòng nơi chốn có loại hình, ba thông số trên điện thoại là diện tích, phòng ngủ, hướng; phần lần chào đang mở có pháp lý, nội thất, tài chính, tình trạng sử dụng, ô thiếu ghi «Chưa có»; các lần chào của căn xếp mới trước, chạm một lần cũ thì xem được lần ấy; thanh mức đủ thông tin nêu số phần đã có trên số phần cần và tên phần còn thiếu; đầu hồ sơ ghi «Xác nhận N ngày trước» hoặc «Chưa xác nhận với chủ nhà»; bốn trường mới được khai trong mô hình nghiệp vụ, có nhãn trong bảng nhãn và có lần chuyển lược đồ qua bộ kiểm cách ly; hồ sơ vẫn chỉ đọc» chưa?
- Kết quả nào là SỐNG: [đề xuất] Hồ sơ căn hiện đủ thuộc tính căn từ danh mục dùng chung — loại căn, diện tích, phòng ngủ, tầng, hướng, toà, khu, loại hình; dòng nơi chốn có loại hình, ba thông số trên điện thoại là diện tích, phòng ngủ, hướng; phần lần chào đang mở có pháp lý, nội thất, tài chính, tình trạng sử dụng, ô thiếu ghi «Chưa có»; các lần chào của căn xếp mới trước, chạm một lần cũ thì xem được lần ấy; thanh mức đủ thông tin nêu số phần đã có trên số phần cần và tên phần còn thiếu; đầu hồ sơ ghi «Xác nhận N ngày trước» hoặc «Chưa xác nhận với chủ nhà»; bốn trường mới được khai trong mô hình nghiệp vụ, có nhãn trong bảng nhãn và có lần chuyển lược đồ qua bộ kiểm cách ly; hồ sơ vẫn chỉ đọc
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Hồ sơ căn hiện đủ thuộc tính căn từ danh mục dùng chung — loại căn, diện tích, phòng ngủ, tầng, hướng, toà, khu, loại hình; dòng nơi chốn có loại hình, ba thông số trên điện thoại là diện tích, phòng ngủ, hướng; phần lần chào đang mở có pháp lý, nội thất, tài chính, tình trạng sử dụng, ô thiếu ghi «Chưa có»; các lần chào của căn xếp mới trước, chạm một lần cũ thì xem được lần ấy; thanh mức đủ thông tin nêu số phần đã có trên số phần cần và tên phần còn thiếu; đầu hồ sơ ghi «Xác nhận N ngày trước» hoặc «Chưa xác nhận với chủ nhà»; bốn trường mới được khai trong mô hình nghiệp vụ, có nhãn trong bảng nhãn và có lần chuyển lược đồ qua bộ kiểm cách ly; hồ sơ vẫn chỉ đọc» khi hết timebox
- Timebox: …
