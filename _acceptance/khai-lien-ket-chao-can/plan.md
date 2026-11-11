# Kế hoạch thi công: khai-lien-ket-chao-can

Hồ sơ `_acceptance/khai-lien-ket-chao-can/`. Thiết kế: `design.md`. Hàng T3: kế hoạch này trình cùng Cổng Phạm vi.

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Mô hình nghiệp vụ có khái niệm «Chủ của hàng» (chủ nhà ↔ lần chào, có sàn và vai) | `ontology/entities/ListingOwner.yaml` | AC-1 (khái niệm khai đủ trường) |
| Mô hình nghiệp vụ có khái niệm «Căn của hàng» (lần chào ↔ căn, có sàn) | `ontology/entities/ListingUnit.yaml` | AC-1 (khái niệm khai đủ trường) |
| Quan hệ giữa sàn, liên hệ, lần chào, căn đi qua hai khái niệm mới | `ontology/relations.yaml` | AC-2 (quan hệ đủ và trỏ đúng) |
| Hai khái niệm có thuật ngữ, nhãn, trang wiki, mô-đun sở hữu | `ontology/glossary.md`, `ontology/labels.yaml`, `wiki/entities/`, `wiki/index.md`, `architecture/modules.yaml` | AC-6 (khái niệm không mồ côi) |
| Mã dữ liệu mẫu dùng kiểu sinh ra, không còn kiểu viết tay | `src/modules/contacts/sample.ts`, `src/modules/listings/sample.ts` | AC-3 (một nguồn kiểu) |
| Liên kết chủ mang vai lạ bị báo | `src/modules/contacts/sample.ts` | AC-4 (vai hợp lệ) |
| Bài kiểm của vòng, mỗi phép đo có chiều đỏ | `tests/link-types.test.ts` | AC-1 … AC-7 |

## Task 1 — khai hai khái niệm và quan hệ

- Files: `ontology/entities/ListingOwner.yaml`, `ontology/entities/ListingUnit.yaml`, `ontology/relations.yaml`,
  `ontology/glossary.md`, `ontology/labels.yaml`, `wiki/entities/listing-owner.md`, `wiki/entities/listing-unit.md`,
  `wiki/index.md`, `architecture/modules.yaml` (chỉ dòng `owns`), rồi `make gen` sinh lại `src/generated/**`.
- Verify: `make ontology` (wiki-lint 0 lỗi 0 cảnh báo, kiểu sinh khớp), `python3 tools/boundaries.py`.
- Phục vụ E1, E2, E6. independent: false (Task 2 cần kiểu sinh).

## Task 2 — mã dùng kiểu sinh, thêm kiểm vai

- Files: `src/modules/contacts/sample.ts`, `src/modules/listings/sample.ts`.
- `OwnerLink` thành bí danh của `ListingOwner` sinh ra; `ListingUnit` nhập từ kiểu sinh; `checkOwnerLinks` báo vai ngoài
  `Seller`, `Landlord`.
- Verify: `npx vitest run tests/sample-data.test.ts --coverage.enabled=false` (băm ghim không đổi), `make typecheck`.
- Phục vụ E3, E4, E5. independent: false.

## Task 3 — bài kiểm của vòng

- Files: `tests/link-types.test.ts` (mới).
- Verify: `npx vitest run tests/link-types.test.ts --coverage.enabled=false`, mỗi ca kèm bản phá thử; rồi `make check`.
- Phục vụ E1–E6. independent: false.

Thứ tự: 1 → 2 → 3, tuần tự trong phiên chính, rồi một dòng `wiki/log.md`.
