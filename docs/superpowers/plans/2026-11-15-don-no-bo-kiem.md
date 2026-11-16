# Kế hoạch — Dọn nợ của bộ kiểm (hàng 1u)

Thiết kế: `docs/superpowers/specs/2026-11-15-don-no-bo-kiem-design.md` · Hợp đồng: `_acceptance/don-no-bo-kiem/contract.md`
(duyệt 2026-11-15, Manh Phan). Làm tuần tự trong một phiên; không task nào chạy song song (cùng chạm hai cấu hình bộ kiểm).

| Người dùng thấy gì khác                            | Đụng đâu                                                                                               | Phục vụ tiêu chí                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Bài kiểm trình duyệt không còn chọn trúng cổng cấm | `tests/e2e/cong-chay.ts`, `playwright.config.ts`, `playwright.db.config.ts`, `tests/cong-chay.test.ts` | AC-1 (cổng không cấm), AC-2 (biến đè thắng) |
| Ca phá khung chờ không còn làm lệch trang          | `tools/e2e_templates/recipes.ts`                                                                       | AC-3 (ca phá giữ lời báo)                   |
| Lượt kiểm đỏ khi cảnh báo dựng lệch quay lại       | `tests/e2e/gac-hydration.ts`, `tests/e2e/gac-hydration-pha.spec.ts`, hai cấu hình                      | AC-4 (nhánh chính sạch), AC-5 (phép gác)    |
| Trang quyết định của hàng 1q mang số riêng         | `wiki/decisions/`, `wiki/index.md`, `wiki/log.md`                                                      | AC-6 (đánh lại số)                          |
| Bộ kiểm wiki chặn trùng số                         | `tools/wiki_lint.py`, `tests/wiki-lint-so-trung.test.ts`                                               | AC-7 (chặn trùng)                           |
| Phép đo của hồ sơ                                  | `_acceptance/don-no-bo-kiem/rang/*`                                                                    | AC-3, AC-5, AC-6, AC-8, AC-9                |

## Task 1 — chọn cổng (independent: false)

Files: `tests/e2e/cong-chay.ts` (mới), hai cấu hình, `tests/cong-chay.test.ts` (mới).
Verify: `npx vitest run tests/cong-chay.test.ts --coverage.enabled=false`. Phục vụ E1, E2.

## Task 2 — ca phá cho-tai (independent: false)

Files: `tools/e2e_templates/recipes.ts`. Verify: `bash _acceptance/don-no-bo-kiem/rang/cho-tai-pha.sh` (chỉ ca cho-tai, hai
khổ). Phục vụ E3.

## Task 3 — phép gác hydrat hoá (independent: false)

Files: `tests/e2e/gac-hydration.ts`, `tests/e2e/gac-hydration-pha.spec.ts`, hai cấu hình. Verify:
`node _acceptance/don-no-bo-kiem/rang/gac-hydration-pha.mjs`. Phục vụ E4, E5.

## Task 4 — đánh lại số và chặn trùng (independent: false)

Files: `wiki/decisions/0042-cong-bat-khoi-khong-ke.md`, `wiki/index.md`, `wiki/log.md`, `tools/wiki_lint.py`,
`tests/wiki-lint-so-trung.test.ts`. Verify: `make ontology` và `npx vitest run tests/wiki-lint-so-trung.test.ts`. Phục vụ E6, E7.

## Task 5 — phép đo của hồ sơ, sổ wiki, make check

Files: `_acceptance/don-no-bo-kiem/rang/*`, `wiki/log.md` (thêm dòng của hàng). Verify: từng lệnh đo xanh, ca phá đỏ đúng
thông điệp; `make check`. Phục vụ E6, E8b, E9, E10.
