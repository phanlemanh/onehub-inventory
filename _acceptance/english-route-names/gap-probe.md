---
slug: english-route-names
at: 2026-11-23T01:50:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — english-route-names

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng «không chuyển hướng» ghi máy quyết một-lối, nhưng lối chuyển hướng 308 trong next.config.ts (ngoài src/) còn sống; giữ hay bỏ đường cũ là khẩu vị rủi ro của người [lui-ban-luc-xoay-mat-khau#F1] | Gate 1 ký AC-5 tin rằng không còn lối khác; liên kết đã dán trong tài liệu nội bộ trả 404 mà không ai được hỏi | Dòng chi-nguoi Hỏi-4 thay d-5, AC-5 chờ Hỏi-4 | human-gate1: dòng d-20261123T014901Z-18 (Hỏi-4) thay d-5; AC-5 ghi «Chờ Hỏi-4» |
| P0 | design | d-3 trích một dòng AGENTS.md cắt trước «English, always»; d-6 trích lời chú không chọn board hay bộ từ screen/role/open [nang-kit-3-1#F1] | Người duyệt tưởng luật kho đã chọn tên, trong khi tên do máy đặt | Đổi căn cứ sang một-lối có lối chết thật, supersedes | fixed: d-…-16 thay d-3 (một-lối: tên thứ hai cho CompanyLayer), d-…-17 thay d-6 (một-lối: dịch một-đổi-một, table sai nghĩa) |
| P1 | evals | Vế «?phan= không còn được đọc» chỉ đo trên hàm thuần; E1 không bắt .phan hay ["phan"] | Trang vẫn đọc searchParams.phan; E2 xanh 9/9, AC-2 qua | Ca trình duyệt ?phan=can-cho → labels; mẫu E1 cho khoá phan | fixed: E9 thêm ca phan-cu-khong-doc có đối chứng ?part=pending-units; E1 thêm mẫu thứ 10 (đọc khoá phan) |
| P1 | evals | AC-1 vế «không được phép» và AC-4 vế «bản thật trả trang không có» không eval nào đo | Thư mục tuyến mới rơi chốt quyền hoặc chốt chỉ-dev, mọi eval xanh | Ca vai không quyền trong E9; eval bản build thật cho proto 404 | fixed: E9 thêm ca vai-khong-quyen ghim «không được phép»; thêm E15 (ban_dung_that, dòng proto/permitted-actions-404; đối chứng dương E7) |
| P1 | evals | Phá thử E1 chỉ cấy 1/9 mẫu ở 1/4 vùng; giu.txt không trần | Mẫu viết sai hay chỗ chạm bị đưa vào giu.txt mà E1 vẫn cham: 0 | Cấy từng mẫu trải 4 vùng; ghim danh sách giữ | fixed: E1-pha cấy cả 10 mẫu trải 4 vùng + một bản sao thêm dòng giữ, in «self-test: 11/11»; contract Notes ghim hai dòng giữ |

Ghi chú ngoài 5 phát hiện: d-10 trỏ nhầm E8 — fixed bằng d-…-19 (E14-ui).
