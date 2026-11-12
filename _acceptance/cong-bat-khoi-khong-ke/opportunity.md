---
schema_version: 1
slug: cong-bat-khoi-khong-ke
feature: Cổng chứng minh màn bắt được khối mới mà vòng dựng không kê ra trong hồ sơ
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1q
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1q của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#eda65bbab423f707ecfec5947798f0f1d04fb0db` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Cổng chứng minh màn bắt được khối mới mà vòng dựng không kê ra trong hồ sơ

Vì sao: Giám sát rà cổng ngày 2026-11-12 theo yêu cầu chủ kho: cổng của hàng 1n chỉ xét khối hồ sơ tự khai, nên khối tạo tay mà không kê thì cổng im lặng

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Thành phần mới xuất hiện trong sổ thành phần sinh so với nhánh chính, nằm ngoài thư mục nhà cung cấp, mà không có trong bảng Khối của hồ sơ nào đang mở thì đỏ; ca phá tương ứng đỏ đúng câu» chưa?
- Kết quả nào là SỐNG: [đề xuất] Thành phần mới xuất hiện trong sổ thành phần sinh so với nhánh chính, nằm ngoài thư mục nhà cung cấp, mà không có trong bảng Khối của hồ sơ nào đang mở thì đỏ; ca phá tương ứng đỏ đúng câu
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Thành phần mới xuất hiện trong sổ thành phần sinh so với nhánh chính, nằm ngoài thư mục nhà cung cấp, mà không có trong bảng Khối của hồ sơ nào đang mở thì đỏ; ca phá tương ứng đỏ đúng câu» khi hết timebox
- Timebox: …
