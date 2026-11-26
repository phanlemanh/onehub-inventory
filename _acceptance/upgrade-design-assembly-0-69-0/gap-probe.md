---
slug: upgrade-design-assembly-0-69-0
at: 2026-11-26T03:08:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract (sổ quyết định) | Hai dòng sổ nguồn mục-tiêu dựa trên câu trích không quyết được lựa chọn của vòng này: dòng khuôn đo trích dòng feature của hồ sơ 0-33-0, dòng bỏ quét độ phủ trích lời cắt phạm vi của hồ sơ ấy [nang-kit-3-1-1#F2]; vòng này có hai bên đọc mới mà khuôn cũ không có | Cổng Phạm vi tin hồ sơ đã ký đã chốt khuôn đo và việc bỏ quét cho vòng này, đúng lúc vòng thêm bên đọc mới | Dòng thay với nguồn một-lối và lý do riêng của vòng; kê hai bên đọc mới trong Coverage | fixed: d-20261126T031002Z-13 thay dòng khuôn đo (một-lối, dễ đảo); d-20261126T031002Z-14 thay dòng bỏ quét với lý do riêng; bảng Coverage thêm dòng choose-first đọc nhánh sau này và dòng job e2e |
| P1 | evals | AC-8 chỉ đo chiều thiếu dòng nhận khối thì đỏ, không có đối chứng có dòng thì xanh | Một choose-first đỏ với mọi tệp thành phần mới vẫn qua E14, E15; dãy giao diện kế tiếp bị chặn oan | Ca có dòng nhận khối dựng từ dòng bên ghi thật thì xanh; ca dòng trỏ tệp khác thì đỏ, ghim thông điệp | fixed: choose-first.mjs thêm bước dòng nhận khối dựng từ design/intake/bang-nhieu-dong.yaml (đổi ten, tep, nhu_cau) thì cổng xanh lại; two-way thêm ca dòng trỏ other-badge.tsx thì đỏ; AC-8, E14, E15 cập nhật |
| P1 | contract (sổ quyết định) | Hạng T3 mà sổ không nói Gate 1.5 xử lý thế nào khi mã đã có trước hồ sơ [nang-kit-3-1-1#F2] | Cổng duyệt kế hoạch bị bỏ qua lặng lẽ, hoặc mở ra cho việc đã làm xong | Câu chỉ-người trên thẻ: gộp Gate 1.5 vào Cổng Phạm vi | human-gate1: Hỏi-2 (d-20261126T031002Z-15), máy khuyên gộp; Notes của hợp đồng nói kế hoạch của vòng là kế hoạch đo |
| P2 | evals | AC-7 hứa chỗ tắt luật chỉ phủ một thư mục nhưng không có điểm thử .mjs ngoài thư mục ấy | Chỗ tắt viết thành tools/** hay **/*.mjs vẫn qua E12, E13 | Tệp thử .mjs cạnh thư mục công cụ; ca nới thành tools/** thì đỏ | fixed: lint-scope.mjs thêm tools/hook-probe.mjs; two-way thêm ca chỗ tắt phủ tools/** thì đỏ gọi tên tệp ấy; AC-7, E12, E13 cập nhật |
| P2 | contract | Coverage nói floating-parts.spec.ts chạy trong job e2e với 0 ca, không phép đo nào đo | Bài mới lỗi lúc nạp làm job e2e đỏ trên main sau khi gộp | Ghi kết quả job e2e của PR trên đúng HEAD, hoặc chạy riêng bài | deferred: Notes của hợp đồng đòi job e2e của PR xanh trên đúng commit đã chấm trước Cổng Bằng chứng; máy đã liệt kê bài trên máy (nạp được, 0 ca) |
