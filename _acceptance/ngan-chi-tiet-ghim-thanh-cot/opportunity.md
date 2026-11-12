---
schema_version: 1
slug: ngan-chi-tiet-ghim-thanh-cot
feature: Đầu chủ ghim ngăn chi tiết thành một cột cạnh bảng khi làm lâu trên một căn, bỏ ghim thì ngăn nổi lại
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build       # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T08:25:47Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3a
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3a của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ ghim ngăn chi tiết thành một cột cạnh bảng khi làm lâu trên một căn, bỏ ghim thì ngăn nổi lại

Vì sao: Chủ kho 2026-11-12 trong phiên dãy D: «Lấy B có ghim» — ngăn nổi là cách chung cả ứng dụng để xem chi tiết một dòng; nút ghim biến ngăn thành cột khi làm lâu. Hàng 3 dựng ngăn nổi, phần ghim là hàng này

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Bấm ghim thì ngăn thành cột cạnh bảng, bảng co lại và không cột nào bị tự giấu; bỏ ghim thì ngăn nổi lại; trạng thái ghim giữ khi đi sang căn khác; ngăn nổi hay ghim đều không che thanh trên và thanh công cụ, không khoá bảng; mọi màn dùng khung chi tiết chung đều có nút ghim» chưa?
- Kết quả nào là SỐNG: [đề xuất] Bấm ghim thì ngăn thành cột cạnh bảng, bảng co lại và không cột nào bị tự giấu; bỏ ghim thì ngăn nổi lại; trạng thái ghim giữ khi đi sang căn khác; ngăn nổi hay ghim đều không che thanh trên và thanh công cụ, không khoá bảng; mọi màn dùng khung chi tiết chung đều có nút ghim
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Bấm ghim thì ngăn thành cột cạnh bảng, bảng co lại và không cột nào bị tự giấu; bỏ ghim thì ngăn nổi lại; trạng thái ghim giữ khi đi sang căn khác; ngăn nổi hay ghim đều không che thanh trên và thanh công cụ, không khoá bảng; mọi màn dùng khung chi tiết chung đều có nút ghim» khi hết timebox
- Timebox: …
