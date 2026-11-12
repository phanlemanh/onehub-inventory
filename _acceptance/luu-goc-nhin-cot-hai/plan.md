# Kế hoạch dựng — luu-goc-nhin-cot-hai (hàng 2c, T3)

Điều kiện bắt đầu: hàng 3 (hồ sơ căn) và hàng 9e (bộ nút theo quyền) đã ở nhánh chính; gộp `origin/main` về MỘT lần,
`make setup`, `make gen`, rồi mới dựng. Lựa chọn của chủ kho ở Cổng Phạm vi (Hỏi-1 … Hỏi-5) điền vào hợp đồng và thiết kế
trước việc 1. Chạm `ontology/**`, `db/migrations/**`, `src/components/candidate/**`, `src/generated/**` (chỉ bằng `make gen`)
và tệp kiểm e2e có sẵn chỉ sau khi giám sát duyệt yêu cầu chạm tệp; số migration do giám sát cấp. Postgres dãy K:
`make db-up DB_LANE=k DB_PORT=5564`.

Kế hoạch theo khuyến nghị (máy chủ, riêng người lưu, L1, S1, không tự lưu). Chủ kho chọn cả sàn ở Hỏi-2 thì việc 1 thêm
dòng quyền góc nhìn của sàn, việc 4 thêm nhóm thứ hai; chọn lưu trên trình duyệt ở Hỏi-1 thì bỏ việc 2 và 3, việc 4 đọc ghi
kho của trình duyệt và xoá khi đăng xuất.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Khái niệm Góc nhìn: thực thể `SavedView` (khái niệm riêng, ghi rõ khác RESO SavedSearch), nhãn «Góc nhìn», chữ nút; ba thao tác (`saveView`, `editView`, `removeView`) phạm vi «của tôi» cho mọi vai đọc Bảng hàng; `make gen` | `ontology/entities/saved-view.yaml`, `ontology/glossary.md`, `ontology/labels.yaml`, `ontology/actions.yaml`, `src/generated/**` | `make ontology` · `make gen` sạch | AC-1, AC-7 | không (mọi việc sau đọc tên) |
| 2 | Bảng `saved_view` (company_id, người lưu, màn, tên, cách xem jsonb có ràng buộc khuôn, thời điểm), duy nhất (sàn, người, màn, tên thường hoá), cách ly theo dòng bắt buộc, cấp quyền tối thiểu; ca trong bộ kiểm cách ly | `db/migrations/<số G cấp>_goc_nhin.sql`, `db/scripts/**` (nếu bộ kiểm cần liệt bảng) | E9 trên dãy K, phá thử tắt force | AC-7 | không (sau 1) |
| 3 | Mô-đun listings: kiểu `GridView` có kiểm khuôn, hàm kiểm tên dùng chung; `server.ts` đọc, thêm, đổi tên, lưu thay đổi, xoá qua `withCompany` với điều kiện người lưu; cửa `/api/v1/saved-views` và `/api/v1/saved-views/[id]` mỏng | `src/modules/listings/**`, `src/app/api/v1/saved-views/**`, `tests/db/goc-nhin.db.test.ts`, `tests/saved-view-name.test.ts` | E1 · E8 · E10 · E11 | AC-1, AC-7, AC-8 | không (sau 2) |
| 4 | Lưới dùng chung: `initialView`, `onViewChange`, `sameView`; Ngoài-4 (thanh công cụ, ô tìm, ô lọc ở nguyên chỗ khi rỗng) | `src/components/candidate/data-region.tsx`, `grid-view.ts`, `region-state.tsx`, `tests/grid-saved-view.test.tsx`, `tests/grid-sheet.test.tsx` | E3 · E12 | AC-2, AC-9 | có (với 5) |
| 5 | App Shell: layout đọc góc nhìn của người xem, nhóm mục động của Bảng hàng trong cấu hình điều hướng, dấu «đã đổi»; Ngoài-5 (chế độ tập trung tắt khi đổi đường dẫn và khi vùng gỡ) | `src/app/(app)/layout.tsx`, `src/app/(app)/nav.ts` (xin G), `src/components/templates/app-shell/**`, `src/components/templates/shell-focus.tsx`, `tests/second-column-views.test.tsx` | E4 (phần sáng một mục) · E14 | AC-3, AC-10 | có (với 4) |
| 6 | Bảng hàng: `?goc-nhin=`, danh sách góc nhìn vào khe, nút «Lưu góc nhìn» qua `PermittedAction`, hộp đặt tên (`FormDialog`), «…» của mục (khuôn 9e), dấu «đã đổi», lưu thay đổi, góc nhìn không còn | `src/app/(app)/inventory/**`, `src/modules/listings/ui/**` | E4 · E10 (phần giao diện) | AC-1 … AC-6, AC-8 | không (sau 3, 4, 5) |
| 7 | Bài trình duyệt trên Postgres dãy K: vòng lưu–mở, lưu thay đổi, đổi tên, xoá; ca Ngoài-4, Ngoài-5 ở bài sheet; axe hai trạng thái mới sáng tối | `tests/e2e-db/goc-nhin.spec.ts`, `tests/e2e/sheet.spec.ts` (xin G), bài axe (xin G) | E2 · E5 · E6 · E7 · E13 · E14 · E16 | AC-2 … AC-6, AC-9, AC-10 | không (sau 6) |
| 8 | Chứng minh màn: ma trận trạng thái của màn mẫu Bảng hàng, khối, vùng, dòng sổ khối cho khe cột thứ hai và lựa chọn ReUI; bỏ trang mẫu `/proto/luu-goc-nhin` | `_acceptance/luu-goc-nhin-cot-hai/chung-minh-man.md`, `design/so-khoi.yaml` (xin G), `src/app/(app)/proto/luu-goc-nhin/**` | `python3 tools/proof_gate/check.py --root .` | AC-3 | không (sau 7) |
| 9 | Sổ: wiki (log, trang thực thể Góc nhìn, quyết định về khe cột thứ hai), dòng sửa đổi L7 trong `docs/plan/pham-vi-mvp-dot-1.md`; `make check`, `make e2e` | `wiki/**`, `docs/plan/pham-vi-mvp-dot-1.md` | `make check` | — | không (cuối) |

Thứ tự: 1 → 2 → 3 → (4 ∥ 5) → 6 → 7 → 8 → 9. Việc 4 và 5 chạm tệp rời nhau nên chạy song song được.

Rủi ro đã thấy: hàng 3 đặt ngăn hồ sơ ngay trước `data-region` và sửa sáu chỗ bấm trong `sheet.spec.ts` — đọc lại sau khi
gộp; khe «…» của 9e trong `DataRegion` và nút của vùng phải sống chung với nút «Lưu góc nhìn»; `?goc-nhin=` và `?status=`
không được cùng sáng hai mục.
