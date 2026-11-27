---
slug: bring-out-claude-design
at: 2026-11-27T04:45:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---
## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Dòng sổ d-20261127T043140Z-3 chọn bộ đo với nguồn mục tiêu, nhưng câu trích của hồ sơ trước chỉ có liên quan, không quyết bộ đo của vòng này (gói, phép gửi, sổ lần gửi, câu chờ, quét dữ liệu riêng tư là bên đọc mới) — cùng mẫu [upgrade-design-assembly-0-69-0#F1] | Người duyệt tưởng bộ đo đã có hồ sơ ký quyết sẵn nên không xét đủ cho việc gửi ra ngoài kho | Thay bằng dòng một-lối kê từng bên đọc và phép đo giữ nó | fixed: dòng mới mang supersedes d-20261127T043140Z-3, nguồn một-lối, kê bảy bên đọc ↔ AC |
| P1 | evals | AC-3 chỉ đo màu tối có mặt, không so với giá trị tối của nguồn | Bộ xuất ghi màu tối bằng màu sáng mà E4/E5 vẫn xanh | So giá trị tối với nguồn, thêm ca phá giá trị tối | fixed: rang/colour.mjs đổi chữ CSS của nguồn (oklch, color-mix với white, hex) độc lập với công cụ, lệch tối đa 2/255; 40/40 khớp; thêm hai ca phá (accent tối đổi, primary tối bằng sáng) |
| P1 | contract | AC-4 không đo chỗ nhận: phép trỏ chỗ không riêng tư, hay lần gửi tới chỗ không có phép | Gói tới artifact dùng chung mà E6 vẫn xanh | AC-4 đo chỗ riêng tư và mọi lần gửi có phép; hai ca phá | fixed: leave.mjs đòi `to:` đúng chữ và có «a private artifact», mọi lần gửi có dòng send-<chỗ>; thêm hai ca phá |
| P1 | design | Trang Claude Design hiện gói đúng chỉ nằm ở ngoài phạm vi, không có dòng sổ ghi giá nếu sai; lần gửi đầu cho trang trống — cùng mẫu [design-assembly-adopt-checks#F1] | Ký PR khi bản 4 lại trống mà không ai xem | Dòng sổ có giá; người xem trang trước khi ký | fixed: dòng descope «bỏ chứng trang Claude Design bằng máy» có giá nhắc lần trang trống; Notes của hợp đồng đặt bước chủ kho xem trang trước khi ký Cổng Bằng chứng |
| P2 | evals | Quét dữ liệu riêng tư chỉ có một mẫu mỗi loại | Số điện thoại có cách hay đường /private/tmp lọt ra Claude Design | Ma trận viết trước mọi dạng, mỗi dạng một ca phá | fixed: ma trận kê số liền, có cách, 0 hay +84 và bốn dạng đường; năm ca phá mới |
