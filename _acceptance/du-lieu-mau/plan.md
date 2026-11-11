# Kế hoạch thi công: du-lieu-mau

Hồ sơ `_acceptance/du-lieu-mau/` (kế hoạch đặt trong hồ sơ vì `docs/` ngoài ranh giới hàng). Thiết kế: `design.md`.

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Có danh mục ba dự án Ocean Park, mã căn đọc ngược được | `src/modules/catalog/sample.ts`, `index.ts` | AC-2 (danh mục), AC-4 (nhãn căn), AC-5 (quét căn) |
| Có 60 lần chào đủ sáu trạng thái, nối với căn | `src/modules/listings/sample.ts`, `index.ts` | AC-3 (lần chào), AC-4, AC-8 |
| Có 50 liên hệ nối với lần chào, đổi số một lần là mọi căn thấy | `src/modules/contacts/sample.ts`, `index.ts` | AC-5, AC-6, AC-7, AC-8 |
| Bài kiểm nối ba mô-đun, mỗi phép đo có chiều đỏ | `tests/sample-data.test.ts` | AC-1 … AC-8 |
| Khái niệm Liên hệ có số điện thoại trong wiki | `wiki/entities/contact.md`, `wiki/log.md` | AC-9 (số trong Liên hệ) |

## Task 1 — catalog sample

- Files: `src/modules/catalog/sample.ts` (mới), `src/modules/catalog/index.ts` (re-export).
- Nội dung: `SAMPLE_UPI_PREFIX`, `SAMPLE_SUBDIVISIONS` (ba dự án, toà, dòng cách đọc mã căn), `sampleUnits()`, `unitCode`,
  `readUnitCode`, `checkSampleCatalog(units)`, `checkCatalogLabels(units)`; bảng trục lấy từ Quỹ hàng `1f8a6edd`.
- Verify: `npx vitest run tests/sample-data.test.ts --coverage.enabled=false -t AC-2`.
- Phục vụ E2, E4, E5. independent: true.

## Task 2 — listings sample

- Files: `src/modules/listings/sample.ts` (mới), `src/modules/listings/index.ts`.
- Nội dung: `SAMPLE_COMPANY`, `SAMPLE_ID_PREFIX`, `sampleId(kind, n)`, mulberry32 (Quỹ hàng `1f8a6edd`),
  `buildSampleListings({ companyId, units })` → `{ listings, listingUnits }`, `checkSampleListings`, `checkListingLabels`.
- Verify: như Task 1, `-t AC-3`.
- Phục vụ E1, E3, E4, E8. independent: true.

## Task 3 — contacts sample

- Files: `src/modules/contacts/sample.ts` (mới), `src/modules/contacts/index.ts`.
- Nội dung: `buildSampleContacts({ companyId, listingIds })` → `{ contacts, owners }`, `phoneList`, `createContactStore`
  (`ownersOf`, `listingsOf`, `updatePhones`, `contacts`), `checkLinkCases`, `checkContactLabels`, `checkNoRealData`
  (quét chuỗi lấy từ Quỹ hàng `1f8a6edd`), `checkSampleLinks`.
- Verify: như Task 1, `-t "AC-5|AC-6|AC-7"`.
- Phục vụ E5, E6, E7, E8. independent: true.

## Task 4 — bài kiểm nối và chiều đỏ

- Files: `tests/sample-data.test.ts` (mới).
- Mỗi AC một `describe("AC-n …")`; vật lành 0 lỗi; bản sao phá đúng một chỗ ra đúng thông điệp; băm ghim SHA-256 dưới
  hai múi giờ.
- Verify: `npx vitest run tests/sample-data.test.ts --coverage.enabled=false`, rồi `make check`.
- Phục vụ E1–E9. independent: false (cần Task 1–3).

## Task 5 — wiki

- Files: `wiki/entities/contact.md` (thêm số), `wiki/log.md` (thêm một dòng).
- Verify: `make ontology`. Phục vụ E9. independent: true.

Thứ tự: 1 → 2 → 3 → 4 → 5, tuần tự trong phiên chính (ba tệp nhỏ, chạy song song không lời).
