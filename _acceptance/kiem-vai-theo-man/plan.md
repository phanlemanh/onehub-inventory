# Kế hoạch — Kiểm vai theo màn (hàng 9b)

Thiết kế: `_acceptance/kiem-vai-theo-man/design.md` · Hợp đồng: `contract.md` · Bài chấm: `evals.yaml`.
Mọi bước đi tuần tự (các tệp phụ thuộc nhau). Mã sản phẩm chỉ đổi một chỗ (dấu thao tác của nút theo quyền); `tools/**` chỉ đổi
công cụ sinh bảng nút; không sửa tệp bài của hàng khác.

| # | Việc | Tệp | Kiểm từng bước | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Sổ màn có cửa vào và nút: `vao`, `nut`, `nut_chung`, `mo_san` cho mọi màn staff/public (kể cả Liên hệ chưa dựng), khối `khung` cho App Shell | `design/screens.yaml` | `make ontology`, `npx vitest run tests/coverage-matrix.test.ts` | E1, E11 | không |
| 1b | Công cụ sinh bảng nút: đọc đúng các tệp giao diện mô-đun mà trang và khung nhập (lần theo tên nhập, qua thành phần trung gian), giữ mọi màn, gộp khai với tìm thấy, dấu «dự kiến», đỏ khi mã có thao tác chưa khai; sinh lại bảng | `tools/coverage_matrix/buttons.py`, `design/vai-man-nut.md`, `tests/vai-man-nut-sinh.test.ts` | `vai_man_nut` (xanh), phá tay mỗi ca để thấy đỏ; bài 9e không đổi lời | E12, E13 | không |
| 1c | Dấu thao tác trên nút theo quyền: thuộc tính `data-thao-tac` gắn lên chính nút, bài quét buộc một phần tử con | `src/modules/identity/ui/permitted-action.tsx`, `tests/vai-man-dau-nut.test.tsx` | `vai_man_nut`, `bo_nut_unit`, `make e2e` (không đổi hình) | E16 | không |
| 2 | Hàm sinh cặp và kỳ vọng: đọc sổ màn + bảng quyền, trả 20 cặp `{màn, vai, kỳ vọng}` và danh sách màn ngoài ma trận có lý do | `tests/e2e-db/vai-man.ts` | bước 3 | E2, E5, E6 | không |
| 3 | Lưới `make check`: sổ màn đủ khoá, tên thao tác có thật, màn built không trỏ thao tác planned; tập cặp bằng tích; thanh bên khớp sổ màn; tệp bài 9b không tự đăng nhập — mỗi ca có cặp phá trên bản sao, thông điệp ghim | `tests/vai-man-so-man.test.ts` | `npx vitest run tests/vai-man-so-man.test.ts` (xanh), rồi phá tay một lần mỗi ca để thấy đỏ | E1, E2, E3, E9 | không |
| 4 | Cửa đăng nhập theo vai: mô-đun cửa (vai, đường tệp phiên, các bước đăng nhập bằng mã, người chứng) + dự án chuẩn bị `vai` tạo sàn mẫu thử, 4 người một vai, 1 người chứng, đăng nhập 4 lần, lưu 4 phiên | `tests/e2e-db/dang-nhap-vai.ts`, `tests/e2e-db/vai.setup.ts`, `playwright.db.config.ts` (thêm dự án `vai`, `vai-<khổ>`, bỏ `vai-*` khỏi dự án khổ thường) | `vai_man_e2e` chỉ dự án `vai` | E4 | không |
| 5 | Bài ma trận (cả so nút với bảng ở mỗi cặp được vào, AC-11): mỗi vai × khổ một bài, đăng ký bằng hàm sinh cặp, đi các cặp theo Hỏi-1; được vào / Không đủ quyền / đẩy về Hôm nay; không lộ người chứng (HTML + mọi phản hồi văn bản, đối chứng dương cả hai đường); thanh bên ở 1440 và 360; ảnh ở 1440 và 360; bước đối chiếu so tập bước đã chạy (báo cáo JSON) với tập cặp | `tests/e2e-db/vai-man.spec.ts`, `tests/e2e-db/vai-man-doi-chieu.mjs` | `vai_man_e2e`, đo thời gian chạy | E5, E6, E7, E8, E14 | không |
| 6 | Phá thử: dựng bản sao cây ở thư mục tạm (git worktree), áp từng bản phá (sáu bản: ba của AC-8 và ba của AC-11 — đổi nút «Mời người», nút lạc màn, quyền chưa sinh bảng), chạy đúng cặp ở 1440, so thông điệp ghim; chạy cây gốc cùng cặp; dọn bản sao | `tests/e2e-db/pha-thu-vai-man.mjs` | `vai_man_pha_thu` | E10, E15 | không |
| 7 | Cấu hình chấm và sổ: khoá chấm (đã thêm), một dòng `wiki/log.md`, đo `kiem_chung_db_tron` trước/sau để báo thời gian thêm | `_acceptance/config.yaml`, `wiki/log.md` | `make check` | E11 | không |

Thứ tự: 1 → 1b → 1c → 2 → 3 → 4 → 5 → 6 → 7. Bước 4–6 cần phần dựng được bộ phát lịch nhả (vùng `tests/e2e-db/**` đang trùng hàng 1s;
lộ trình xếp 9b sau 3b, 4, 2e). Bước 1–3 không chạy trình duyệt; bước 1c chạm thành phần nút dùng chung — nếu một hàng đang mở cũng sửa tệp ấy thì xin
giám sát thứ tự trước khi commit.

Thời gian chạy dự kiến (lối B): 1 bài chuẩn bị (4 lần đăng nhập) + 8 bài ma trận (thêm bài thanh bên của Quản trị sàn ở 360), 30 lần mở trang, ước 1–1,5 phút trên máy
rảnh; lối A: 16 bài, 80 lần mở, ước 3–4 phút. Bước 7 đo thật và ghi vào trang bằng chứng.
