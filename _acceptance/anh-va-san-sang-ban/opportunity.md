---
schema_version: 1
slug: anh-va-san-sang-ban
feature: Đầu chủ tải ảnh lên hồ sơ căn, đổi ảnh bìa, gỡ ảnh và thấy căn thành Sẵn sàng bán khi đủ điều kiện
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T02:47:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 15
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 15 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/ho-so-can.md#5f433815078c4837e98fb8c2a290704be4e36410`

Đầu chủ tải ảnh lên hồ sơ căn, đổi ảnh bìa, gỡ ảnh và thấy căn thành Sẵn sàng bán khi đủ điều kiện

Vì sao: Chỉ căn Sẵn sàng bán mới được gửi cho khách

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Ảnh của căn có đủ vòng đời: tải lên, xem, đổi ảnh bìa và gỡ ảnh; đổi thứ tự ảnh có làm hay không là câu hỏi ở Cổng Phạm vi của hàng; pháp lý và tình trạng sử dụng mà điều kiện Sẵn sàng bán đòi thì điền ở hàng 3g» chưa?
- Kết quả nào là SỐNG: [đề xuất] Ảnh của căn có đủ vòng đời: tải lên, xem, đổi ảnh bìa và gỡ ảnh; đổi thứ tự ảnh có làm hay không là câu hỏi ở Cổng Phạm vi của hàng; pháp lý và tình trạng sử dụng mà điều kiện Sẵn sàng bán đòi thì điền ở hàng 3g
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Ảnh của căn có đủ vòng đời: tải lên, xem, đổi ảnh bìa và gỡ ảnh; đổi thứ tự ảnh có làm hay không là câu hỏi ở Cổng Phạm vi của hàng; pháp lý và tình trạng sử dụng mà điều kiện Sẵn sàng bán đòi thì điền ở hàng 3g» khi hết timebox
- Timebox: …
