# Kế hoạch thi công — dan-tu-excel (hàng 5)

Hợp đồng `_acceptance/dan-tu-excel/contract.md` (duyệt 2026-11-15, Manh Phan; sáu câu Hỏi theo khuyến nghị). Bản vá
bản bấm được (`h-5/ban-bam-duoc.patch` ở thư mục ghi chú chung của đợt) là điểm xuất phát của T1–T4. Điều kiện bắt đầu
dựng: hàng 2b (PR #63) đã vào main và nhánh này đã gộp main. Mọi task chạm cùng vùng Bảng hàng nên đều
`independent: false`, làm tuần tự.

| Người dùng thấy gì khác                             | Đụng đâu                                                            | Phục vụ tiêu chí                    |
| --------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------- |
| Chữ dán được đọc bằng đúng luật sửa trên ô          | `paste-rules.ts`                                                    | AC-2 (đọc ô dán), AC-4 (ngưỡng 20%) |
| Mỗi ô bị bỏ có đúng lý do                           | `listing-paste.ts`                                                  | AC-3 (lý do bị bỏ)                  |
| Áp một lần, hoàn tác một lần cả vùng                | `use-change.tsx`                                                    | AC-5, AC-6 (áp, hoàn tác)           |
| Dán trên Bảng hàng mở bản xem trước                 | `data-region.tsx`, `paste-preview.tsx`, `use-listing-cell-edit.tsx` | AC-1, AC-7, AC-8, AC-10             |
| Bài trên màn ở bốn khổ, trợ năng sáng tối           | `tests/e2e/dan-tu-excel.spec.ts`                                    | AC-1, AC-4–AC-10                    |
| Khối mới có tên trong sổ khối, hồ sơ chứng minh màn | `design/so-khoi.yaml`, `chung-minh-man.md`                          | AC-9 (khối dùng chung)              |

## T0 — Gộp main sau khi 2b vào, áp bản vá, gỡ lớp tạm

- Files: toàn bộ bản vá; xoá `src/modules/listings/ui/paste-proto.tsx` và mọi chỗ `PROTO` / `?xem=` trong
  `use-listing-cell-edit.tsx`; xoá `tools/.tmp-h5/` (không commit).
- Verify: `npx tsc --noEmit -p tsconfig.json` · `npx eslint src/components/candidate src/modules/listings`.
- Evals: tiền đề cho mọi eval. independent: false.

## T1 — Luật đọc ô dán (đã có, giữ) + cặp phá thử

- Files: `src/modules/listings/paste-rules.ts`, `paste-rules.test.ts`.
- Verify: `npx vitest run src/modules/listings/paste-rules.test.ts`; phá thử trên bản sao: làm tròn giá tới 10 triệu →
  đỏ «doc-o-dan-viet-truoc: 4,655 tỷ»; `>` thành `>=` trong ngưỡng → đỏ «nguong-dan-dau-phan-tram: +20%».
- Evals: E2, E4. independent: false.

## T2 — Lý do bị bỏ, đủ 10 ca

- Files: `src/modules/listings/ui/listing-paste.ts`, mới `listing-paste.test.ts` (hằng 10 ghim: thuộc tính căn, Xác nhận lúc,
  cột tính, cột riêng, khoá Đã bán, nấc không đi được, nấc Đã bán, nấc Ngừng hẳn, dòng nhóm, phần thừa); cột Về tay của
  hàng 19 — lý do riêng nếu 19 đã vào main, không thì ca dùng cột tính giả trong bài.
- Verify: `npx vitest run src/modules/listings/ui/listing-paste.test.ts`; phá thử: khoá Đã bán rơi về «sai kiểu» → đỏ
  «ly-do-bo-du-10: khoa-da-ban».
- Evals: E3. independent: false.

## T3 — Áp và hoàn tác theo lô

- Files: `src/components/candidate/use-change.tsx` (`runDoorBatch`), mới `door-batch.test.tsx`: ap-mot-lan-n-lan-ghi,
  hoan-tac-mot-lan, ap-hong-mot-phan (ma trận ba nguyên nhân, hằng 3), hoan-tac-hong-bao-ro, noi-phien-ban (trên
  `sampleSaveDoor` thật).
- Verify: `npx vitest run src/components/candidate/door-batch.test.tsx`; phá thử: undo nuốt lỗi → đỏ «hoan-tac-hong-bao-ro»;
  hai thông báo → đỏ «ap-mot-lan-n-lan-ghi: 2 thông báo».
- Evals: E5b, E6. independent: false.

## T4 — Lưới chung nối đường dán

- Files: `src/components/candidate/data-region.tsx`, `paste-preview.tsx`, `paste-copy.ts`, `form-dialog.tsx` (cờ
  `canSubmit`); mới `data-region-paste.test.tsx`: chua-ghi-truoc-khi-ap, bo-theo-cot-va-khoa, khong-quyen-khong-mo,
  cat-xoa-khong-ghi.
- Verify: `npx vitest run src/components/candidate/data-region-paste.test.tsx`; phá thử: ghi ngay khi dán → đỏ
  «chua-ghi-truoc-khi-ap: 6 lần ghi»; bỏ kiểm bảng quyền → đỏ «khong-quyen-khong-mo: CompanyAdmin».
- Evals: E1, E3, E7. independent: false.

## T5 — Bài trên màn ở bốn khổ

- Files: mới `tests/e2e/dan-tu-excel.spec.ts` (mười lăm ca của evals.yaml), thêm Bảng hàng có bản xem trước mở vào bài axe
  sáng/tối.
- Verify: chỉ chạy tệp bài của hàng khi chưa giữ lượt chấm (Luật giảm tải máy):
  `npx playwright test tests/e2e/dan-tu-excel.spec.ts`; phá thử từng chiều đỏ ghi trong evals.yaml.
- Evals: E1, E4-e2e, E5, E6-e2e, E7-e2e, E8, E9-axe, E12. independent: false.

## T6 — Sổ khối, chứng minh màn, nhãn, wiki

- Files: `design/so-khoi.yaml` (một dòng `PastePreview`, nhu cầu `xem-truoc-khi-dan`, `ho_so: dan-tu-excel`), `make gen`
  (sổ linh kiện), `_acceptance/dan-tu-excel/chung-minh-man.md` (theo màn mẫu, ảnh cạnh màn mẫu, bảng Khối có
  `PastePreview`), `wiki/log.md`, `wiki/entities/listing.md` nếu cần.
- Verify: `python3 tools/proof_gate/check.py --root .` · `make check`.
- Evals: E9, E10, E11. independent: false.
