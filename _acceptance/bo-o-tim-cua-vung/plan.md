# Kế hoạch — bo-o-tim-cua-vung (hàng 2e, T3)

Hai đợt dựng, theo điều kiện của giám sát: **đợt A** không chạm lưới dùng chung, dựng ngay sau hai chữ ký (Cổng Phạm vi,
kế hoạch); **đợt B** chạm lưới dùng chung, chỉ bắt đầu khi hàng 4 «Sửa trên ô» đã gộp — khi ấy gộp `origin/main` MỘT lần
rồi mới dựng. Mỗi việc kết bằng bài của nó xanh và cặp ca phá đỏ đúng thông điệp ghim (luật đo mới của kit).

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| A1 | Công cụ chứng minh màn kiểm từng cặp miễn của sổ khối: commit có thật, commit thêm đúng tệp của khối, ngày bằng ngày khai, trước ngày sổ khối ra đời; bản sao không có commit theo lối chủ kho chọn ở Hỏi-2; ca lành và bốn ca phá trên kho git tạm | `tools/proof_gate/model.py`, `tools/proof_gate/check.py`, `tools/proof_gate/proof-gate-0023.test.ts`, chú thích đầu mục ở `design/so-khoi.yaml` | `npx vitest run tools/proof_gate` | E16 · AC-10 | có |
| A2 | Chữ tài liệu: mô tả Góc nhìn trong mô hình nghiệp vụ thôi nói lưu chữ tìm (xin giám sát, chạm `ontology/`), sinh lại bằng `make gen`; nhật ký thay đổi và nhật ký chung ghi việc góc nhìn bỏ chữ tìm cùng bước dọn của migration 011 | `ontology/entities/SavedView.yaml`, `src/generated/**` (sinh), `wiki/log.md`, `CHANGELOG.md` nếu kho có | `make ontology` | E11 · E12 · AC-7 | có |
| B1 | Lưới dùng chung: bỏ ô tìm khỏi thanh công cụ và khỏi hàm lọc; bỏ trường chữ tìm khỏi cách xem (`GridView`, `sameView`, `viewWithin`); trạng thái không khớp đổi câu theo nhãn mới; hàng ô lọc theo Hỏi-1 | `src/components/candidate/region-header.tsx`, `data-region.tsx`, `grid-view.ts`, `grid-copy.ts`, `region-state.tsx`, `column-kind.ts` | `make typecheck`, `npx vitest run tests/grid*.test.tsx` | E1 · E5 · E6 · E7 · E9 · AC-1 … AC-4, AC-6 | không |
| B2 | Lớp gọi API của Bảng hàng thôi vá chữ tìm; dữ liệu cũ mang chữ tìm bị bỏ qua | `src/modules/listings/ui/saved-view-api.ts`, `save-view-buttons.tsx` | `npx vitest run tests/grid-saved-view.test.tsx tests/second-column-views.test.tsx` | E9 · E10 · AC-6 | không (sau B1) |
| B3 | Bài đơn vị viết lại sang ô đầu cột, không nới; bài mới `tests/khong-o-tim.test.ts`; bảng đối chiếu cũ → mới và thước đếm dòng bài kiểm bị bỏ (`rang/doi-bai-kiem.mjs`, cặp ca phá) | `tests/grid.test.tsx`, `tests/grid-sheet.test.tsx`, `tests/grid-saved-view.test.tsx`, `tests/behavior.test.tsx`, `tests/ho-so-can.test.tsx`, `tests/second-column-views.test.tsx`, `tests/khong-o-tim.test.ts`, `_acceptance/bo-o-tim-cua-vung/doi-bai-kiem.md`, `_acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs` | `make test`, `doi_bai_kiem` | E1 · E5 · E6 · E7 · E9 · E11 · E15 · E18 · AC-9 | không (sau B1) |
| B4 | Bộ bài sinh từ sổ màn: ca «tìm» thành «lọc đầu cột», ca «Tìm không ra» thành «Không có dòng nào khớp», khẳng định không có ô tìm ở mọi ca vùng; gỡ danh sách miễn của hàng 6 và chỗ đọc nó | `tools/e2e_templates/recipes.ts`, `suite.ts`, `runner.ts`, `e2e-templates.test.ts` | `npx vitest run tools/e2e_templates` | E2 · E4 · E13 · AC-2, AC-8 | không (sau B1) |
| B5 | Bài trình duyệt viết lại sang ô đầu cột; bài điện thoại của hàng ô lọc | `tests/e2e/grid.spec.ts`, `tests/e2e/sheet.spec.ts`, `tests/e2e/behavior.spec.ts`, `tests/e2e/ho-so-can.spec.ts`, `tests/e2e-db/goc-nhin.spec.ts` | `make e2e`, `goc_nhin_e2e` trên Postgres dãy K | E2 · E8 · E10 · AC-1, AC-5, AC-6 | không (sau B1) |
| B6 | Tài liệu hành vi: ma trận trạng thái, bảng hành vi, khuôn Lưới (không đổi tên mặt so mà công cụ chứng minh màn đọc) | `design/states.md`, `design/behaviors.md`, `design/patterns/luoi.md` | `make check` | E11 · E12 · E17 · AC-7 | không (cùng lượt với B4) |
| B7 | Ảnh bằng chứng bốn khổ sáng tối; `make check` toàn kho | `_acceptance/bo-o-tim-cua-vung/evidence/` | `make check` | E3 · E14 | không (cuối) |

Thứ tự: A1 và A2 song song ngay sau chữ ký; B1 → B2 → (B3, B4, B6) → B5 → B7 khi hàng 4 đã gộp. Không migration mới. Vùng
của hàng mở thêm các tệp trong bảng mà lộ trình chưa liệt (`tests/grid-sheet.test.tsx`, `tests/grid-saved-view.test.tsx`,
`tests/second-column-views.test.tsx`, `tests/e2e-db/goc-nhin.spec.ts`, `tests/khong-o-tim.test.ts`,
`src/modules/listings/ui/`, `tools/proof_gate/`, `ontology/entities/SavedView.yaml`).
