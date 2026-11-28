# Kế hoạch — dua-deploy-yml-len-main

Vòng không viết mã: tệp `.github/workflows/deploy.yml` là bản chủ kho dán ở PR #133. Kế hoạch chỉ còn bước chấm.

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Không có thay đổi nào cần làm; tệp đã nằm trên nhánh | `.github/workflows/deploy.yml` (chỉ đọc) | AC-1–AC-4 (tệp đúng bản đã ký, an toàn, PR gọn) |
| Chấm độc lập mọi phép đo trên đúng commit của PR | `_acceptance/dua-deploy-yml-len-main/rang/kiem.py` | E1–E7 |

Task 1 — chấm (S4). Files: không. Verify: lượt chấm độc lập. Phục vụ E1–E7. independent: false.

Duyệt kế hoạch (Gate 1.5): máy đã nêu ở tin mời Cổng Phạm vi ngày 2026-11-28 rằng câu «duyệt» được hiểu là duyệt luôn kế
hoạch này, vì kế hoạch không có bước thi công; chủ kho trả lời bằng câu duyệt Cổng Phạm vi.
