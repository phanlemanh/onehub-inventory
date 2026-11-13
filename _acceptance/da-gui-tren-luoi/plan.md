# Kế hoạch: Đã gửi trên Lưới (hàng 6)

Hợp đồng: `_acceptance/da-gui-tren-luoi/contract.md`. Thiết kế: `_acceptance/da-gui-tren-luoi/design.md`. Thực thi tuần tự
trong phiên dãy D (các việc chạm chung trang và thư mục của mô-đun, không tách song song). Mỗi việc kết bằng lệnh kiểm
riêng; mọi phép đo mới có cặp ca chính xanh và ca phá đỏ với thông điệp ghim.

## Tóm tắt

| # | Việc | Tệp | Phục vụ | Kiểm | Độc lập |
|---|---|---|---|---|---|
| 1 | Khái niệm «Link đã gửi» vào mô hình, nhãn, bảng thuật ngữ, trang wiki, mô-đun sở hữu; sinh lại | `ontology/entities/ShareLink.yaml`, `ontology/relations.yaml`, `ontology/labels.yaml`, `ontology/glossary.md`, `architecture/modules.yaml`, `wiki/entities/share-link.md`, `wiki/index.md`, `src/generated/**` (chỉ `make gen`, commit riêng) | E11 | `make ontology`, `make gen` không đổi gì | false |
| 2 | Dữ liệu mẫu 14 link và bộ kiểm luật | `src/modules/sharing/sample.ts`, `tests/sent.test.tsx` | E1 | `npx vitest run tests/sent.test.tsx` | false |
| 3 | Vùng Đã gửi: cột, dòng, đọc `?state=`, ngăn chi tiết, trang | `src/modules/sharing/ui/**`, `src/app/(app)/sent/page.tsx`, `tests/sent.test.tsx`, `tests/sent-page.test.tsx` | E2, E5, E6 | `npx vitest run tests/sent.test.tsx tests/sent-page.test.tsx` | false |
| 4 | Rào «không prop kiểu dáng» và quét dấu hiệu SP-4 | `tests/sent-reuse.test.ts`, `tests/sent.test.tsx` | E8, E9, E11 | `npx vitest run tests/sent-reuse.test.ts`; bước chấm khuôn | false |
| 5 | Gỡ `sent` khỏi danh sách «chưa có vùng», đổi ca ví dụ sang tên giả; gỡ ngoại lệ ở họ Lưới | `tools/e2e_templates/recipes.ts`, `tools/e2e_templates/e2e-templates.test.ts`, `design/patterns/luoi.md` | E3, E4 | `npx vitest run tools/e2e_templates`; `npx playwright test tests/e2e/screens/screens.spec.ts` | false |
| 6 | Bài trình duyệt của ngăn chi tiết | `tests/e2e/screens/sent.spec.ts` | E7 | `npx playwright test tests/e2e/screens/sent.spec.ts` | false |
| 7 | Tệp chứng minh màn, ảnh bốn khổ cạnh màn mẫu | `_acceptance/da-gui-tren-luoi/chung-minh-man.md`, `evidence/**` | E10 | `python3 tools/proof_gate/check.py --root .` | false |
| 8 | Gộp main có 2c; sửa cột đầu của Lưới dùng chung không cắt chữ dài (commit riêng) | `src/components/candidate/data-region.tsx`, `tests/grid-open-truncate.test.tsx`, `tests/e2e/screens/open-cell-truncate.spec.ts` | E12, E13 | hai bài mới; `tests/e2e/sheet.spec.ts`, `tests/e2e/ho-so-can.spec.ts` xanh không sửa | false |
| 9 | Ghi sổ: dòng nhật ký wiki, quyết định thiết kế, `make check` và `make e2e` | `wiki/log.md`, `design/decisions.yaml` (chỉ thêm dòng) | mọi eval | `make check`, `make e2e` | false |

## Thứ tự và vì sao

1 → 2 → 3: kiểu sinh từ mô hình là đầu vào của dữ liệu mẫu, dữ liệu mẫu là đầu vào của vùng. 4, 5, 6, 7 đo vùng đã dựng.
8 làm sau cùng vì hàng 2c đang sửa `data-region.tsx` và gộp trước (giám sát D-1311-4): gộp main về một lần, sửa trên cây
đã gộp, giữ phần của 2c. 9 cuối cùng, trước lượt chấm.

## Lựa chọn chịu lực

- Mô-đun `sharing` không phụ thuộc mô-đun nào: trang ghép `catalog`, `listings`, `sharing` bằng id (không sửa
  `depends_on`).
- Bài «không prop kiểu dáng» đọc mã bằng bộ phân tích TypeScript (bài học của hàng 1e: biểu thức chữ để lọt dạng câu nhập).
- Ảnh và bài trình duyệt chạy trên cổng của dãy D (3483); không dùng cổng 3470.
