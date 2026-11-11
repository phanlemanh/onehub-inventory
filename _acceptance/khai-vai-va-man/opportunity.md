---
schema_version: 1
slug: khai-vai-va-man
feature: Mọi màn và mọi vai được khai cho máy đọc, màn chưa khai hay hợp đồng thiếu vai thì kiểm tra báo đỏ
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1d
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1d của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã N11

Mọi màn và mọi vai được khai cho máy đọc, màn chưa khai hay hợp đồng thiếu vai thì kiểm tra báo đỏ

Vì sao: Quyết định 0017: máy của kit chỉ kiểm mục Độ phủ có mặt; đặt trước hàng 2 để có số đo từ vòng giao diện đầu tiên

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Thêm một trang chưa khai thì đỏ; bỏ một vai khỏi khối Vai × Màn của hợp đồng thì đỏ; một lệnh in số vòng đủ ô, thiếu ô và số ô ghi không liên quan; màn Liên hệ dù làm sau vẫn được khai trước vào họ Lưới» chưa?
- Kết quả nào là SỐNG: [đề xuất] Thêm một trang chưa khai thì đỏ; bỏ một vai khỏi khối Vai × Màn của hợp đồng thì đỏ; một lệnh in số vòng đủ ô, thiếu ô và số ô ghi không liên quan; màn Liên hệ dù làm sau vẫn được khai trước vào họ Lưới
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Thêm một trang chưa khai thì đỏ; bỏ một vai khỏi khối Vai × Màn của hợp đồng thì đỏ; một lệnh in số vòng đủ ô, thiếu ô và số ô ghi không liên quan; màn Liên hệ dù làm sau vẫn được khai trước vào họ Lưới» khi hết timebox
- Timebox: …
