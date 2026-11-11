# Kế hoạch — cong-chung-minh-man-mau

Thiết kế: [design.md](design.md) · hợp đồng: [contract.md](contract.md) · bộ đo: [evals.yaml](evals.yaml).

Mọi việc tuần tự trong một phiên (các việc dùng chung bộ đọc của lưới nên không tách song song). Kiểm từng việc:
`npx vitest run tools/proof_gate --coverage.enabled=false`, cuối cùng `make check`.

| # | Việc | Tệp | Phục vụ | Độc lập |
| --- | --- | --- | --- | --- |
| 1 | Họ Lưới trong bản đồ khuôn: tám khoá lõi của kit, bốn mục thân (Triết lý, Màn mẫu, Khổ so, Mặt so); chạy bộ đọc khuôn của kit cho tới khi không lỗi lược đồ | `design/patterns/luoi.md` | E9, E10 | không |
| 2 | Bộ đọc của lưới: đọc sổ màn (dùng lại `tools/coverage_matrix/registry.py`), tệp họ, tệp chứng minh (mục màn, các bảng), PNG (bề ngang từ đầu tệp), sổ kho và danh mục ReUI; suy lối | `tools/proof_gate/model.py` | E1–E8 | không |
| 3 | Luật theo lối và theo trạng thái; dòng lỗi `<hồ sơ> · <màn> · <mã>: <câu>`, dòng tổng «N chỗ lệch vô cớ»; `--report [--json]` không bao giờ đỏ | `tools/proof_gate/check.py` | E1–E8 | không |
| 4 | Khuôn tệp chứng minh, đúng tên mục, tên bảng, giá trị Kết quả mà bộ đọc nhận | `tools/proof_gate/khuon-chung-minh.md` | E11 | không |
| 5 | Bài vitest: kho mẫu dựng trong thư mục tạm (PNG sinh trong bài), ma trận trạng thái × khai màn viết trước, từng ca phá một chỗ có mã ghim và đối chứng dương; mỗi luật mới có cặp xanh/đỏ trên cùng tệp lành | `tools/proof_gate/proof-gate.test.ts` | E1–E8 | không |
| 6 | Hai bản phát lại ca Liên hệ: lời cổng cũ; bảng kiểm thật 43 dòng (mã L1–L43, mặt, loại, căn cứ tóm) — chỉ loại lệch, không dữ liệu người | `tools/proof_gate/fixtures/lien-he-quy-hang/` | E5 | không |
| 7 | Bài «kho thật»: lưới xanh trên kho; bản sao thêm vòng thiếu chứng minh thì đỏ; đọc họ Lưới | `tools/proof_gate/proof-gate.test.ts` | E9 | không |
| 8 | Skill giao diện: mục «Prove the screen before you present it» — ba lối, khuôn tệp, thang, lệnh tự kiểm; giữ dòng tra danh mục ReUI của hàng 1g | `.claude/skills/inventory-ui/SKILL.md` | E11 | không |
| 9 | `make gen` nếu sổ thành phần đổi; `make check`; một dòng `wiki/log.md` (tệp dùng chung, chỉ thêm) | — | mọi eval | không |

Thứ tự gộp: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Mỗi luật (việc 3) chỉ tính xong khi việc 5 có cặp xanh/đỏ của nó.
