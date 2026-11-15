# Kế hoạch — cong-bat-khoi-khong-ke (hàng 1q)

Thiết kế: `docs/superpowers/specs/2026-11-14-cong-bat-khoi-khong-ke-design.md` · Hồ sơ: `_acceptance/cong-bat-khoi-khong-ke/`.
Chạy tuần tự (mọi việc chạm cùng hai tệp `model.py`, `check.py`). Kiểm mỗi việc: `npx vitest run tools/proof_gate
--coverage.enabled=false` (lệnh `config:executors.test.proof_gate`), chỉ tệp bài của cổng — luật giảm tải.

| #   | Việc                                                                                                            | Tệp                                                                                                       | Phục vụ            | Độc lập |
| --- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------ | ------- |
| 1   | Bài kiểm trước (đỏ): tệp bài mới với các ca của AC-1…AC-6, bản sao sổ PR #58                                    | `tools/proof_gate/proof-gate-1q.test.ts` (mới), `tools/proof_gate/fixtures/so-thanh-phan-pr58.json` (mới) | E1–E6              | không   |
| 2   | Bộ đọc: danh sách có trước, mọi thành phần của mỗi tệp ở cả hai hình sổ                                         | `tools/proof_gate/model.py`                                                                               | E3, E5             | không   |
| 3   | Luật `khoi-khong-ke` và khoá `khoi_khong_ke` của báo cáo                                                        | `tools/proof_gate/check.py`                                                                               | E1, E2, E3, E4, E6 | không   |
| 4   | Danh sách có trước của kho thật, tính từ nhánh chính mới nhất                                                   | `tools/proof_gate/thanh-phan-co-truoc.yaml` (mới)                                                         | E5                 | không   |
| 5   | Một câu ở mục Khối của khuôn chứng minh                                                                         | `tools/proof_gate/khuon-chung-minh.md`                                                                    | E6                 | không   |
| 6   | Bài cũ còn xanh: chỉ khi lưới mới làm đỏ kho mẫu của bài 0023, kê thành phần mẫu vào kho mẫu, không đổi kỳ vọng | `tools/proof_gate/proof-gate-0023.test.ts` (có thể không chạm)                                            | E7                 | không   |
| 7   | Sổ wiki: một dòng `wiki/log.md`, trang quyết định mới; sinh lại tệp sinh                                        | `wiki/log.md`, `wiki/decisions/<số kế>-…md`, `PRODUCT-MAP.md`, `LO-TRINH.html`                            | —                  | không   |
| 8   | Trước khi gộp: chạy lưới mới trên đầu mỗi nhánh có PR đang mở, BÁO G từng dòng đỏ sẽ có                         | không tệp                                                                                                 | Notes của hợp đồng | không   |

Mỗi phép đo mới đi kèm cặp hai chiều trên cùng kho mẫu: vật lành im, phá một chỗ đỏ với câu ghim.
Sau việc 7: `make check` một lần, rồi lượt chấm (xin lượt `s4`).
