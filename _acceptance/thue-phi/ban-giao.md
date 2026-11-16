# Bàn giao — thue-phi (hàng 19, dãy N)

Viết lúc 14/11/2026, phiên N sắp hết ngữ cảnh (theo yêu cầu G sau tin N-1411-11).

## Đang ở đâu

- Worktree: `/Users/manhphan/dev/onehub-inventory/.claude/worktrees/inspiring-keller-ab7b16`, nhánh `claude/inspiring-keller-ab7b16`, đầu nhánh lúc viết: `e6a1514` (đã đẩy).
- PR nháp: https://github.com/phanlemanh/onehub-inventory/pull/64 — mô tả đã có «Domain changes», «Tệp hạng cao đã đổi», «Sửa sau Cổng Phạm vi».
- Hợp đồng: `status: implemented`. Nhánh chứa đỉnh main `20a13c2` (7e, 9c, PR #62).
- Dev server dãy N: `PORT=3485`. Postgres: `DB_LANE=n DB_PORT=5563` (container `onehub-inventory-db-n` đang chạy).

## Đã xong (8 việc của kế hoạch)

Mô hình (`FeeItem`, `Listing.feeInclusion`, nhãn, hai dòng bảng quyền) · lõi `company-config/fee-schedule.ts` (bảng 64 ô) · migration 012 `company_fee_items` + ca cách ly (37 ca xanh) · lưu và API `/api/v1/company/fee-schedule` · phần Thuế phí trên `FramedList` · cột Về tay / Điều kiện phí ở Bảng hàng · bài trình duyệt `tests/e2e-db/thue-phi.spec.ts` (bốn khổ, axe, ca `anh-ui-check` chụp khung cho sáu ui-check) · wiki, trang quyết định 0037. `make check` xanh. Chứng minh màn qua lưới ở nấc implemented.

## Việc kế, đúng thứ tự

1. Xin lượt: `node /Users/manhphan/dev/onehub-inventory/.acceptance-runs/dieu-phoi-nen/loi/dieu-phoi.mjs xin s4 --uoc-phut 40`, chờ `khoa/s4/chu.json` ghi `"phien":"N"` (lệnh nền). Đơn xin đã nộp lúc viết; KHÔNG giữ khoá khi chưa chạy được — nhả bằng `dieu-phoi.mjs nha s4` và BÁO G «cần phiên mới».
2. Đầu nhánh khác `generated_sha` trong `_acceptance/thue-phi/s4-args.json` thì sinh lại: `node /Users/manhphan/dev/acceptance-gate-kit-v2.38.0/feature-loop/scripts/s4-args.mjs --slug thue-phi --root <worktree> --out <worktree>/_acceptance/thue-phi/s4-args.json`, rồi thêm khoá `reviewSkillPath` = `<worktree>/.claude/skills/review-change/SKILL.md`.
3. Chạy lượt chấm: Workflow `scriptPath` = `/Users/manhphan/dev/acceptance-gate-kit-v2.38.0/feature-loop/workflows/acceptance-verify.js`, `args` = nội dung tệp tham số (khoảng 51 KB; hai khoá `thuocChup`, `cayChup` workflow không đọc, có thể bỏ khỏi bản truyền, giữ trên đĩa). Lượt cần Postgres dãy N cho E3, E4, E7, E7-db, E10, E6-e2e và các ui-check (chạy `THUE_PHI_ANH=1 … tests/e2e-db/thue-phi.spec.ts --project 360 --project 1024 --project 1440`).
4. Theo mục S4 của skill feature-loop: ghi run-log trước, rồi `evidence-report.md`, `review-findings.md`; PASS thì `status: verified`, commit gói bằng chứng; chạy `thuoc-vat.mjs --write`, `do-vong.mjs`, `luat-san-pham.cjs`, `design-floor-khuon.mjs --write`; nhả `s4`.
5. Dựng Cổng Bằng chứng (`/acceptance-gate:acceptance-card thue-phi` + `evidence-page.js`). Theo G-1411-123: dòng lệnh ký phải kết bằng «; ký hay trả: ___» và câu «anh gõ Ký vào ô ___ để ký»; chỉ trình khi CI của PR xanh trên đầu nhánh, nhánh chứa đỉnh main và G đã soi. Sau chữ ký: `python3 tools/round_metrics/round_metrics.py ghi --slug thue-phi` commit cùng chữ ký (G-1411-129); rồi `xin merge` + `dieu-phoi.mjs gop 64`; báo «XONG · 19».

## Phán quyết của G còn hiệu lực

- `FramedList` thêm ba tuỳ chọn (cột cuối `controlWidth="fit"`, `ListFace avatar={false}`, `note` dưới dòng); mặc định giữ nguyên, màn Thành viên không đổi dáng (G-1411-114; ảnh `evidence/members-*.png`, bài `tests/framed-list.test.tsx`).
- Ngoại lệ «tên theo pháp luật» cho luật nhãn 17 ký tự: cờ `phap_ly` + `nguon` + một alt ≤17 (G-1411-157); chỉ `PersonalIncomeTax` mang cờ.
- Làm tròn ô Về tay theo luật tiền chung nửa lên («2,9 tỷ» cho 2.895.000.000), dòng ví dụ hiện «2,895 tỷ»; không đổi luật chung (G-1411-156; ca `lam-tron-diem-giua`).
- Gói Cổng Bằng chứng có mục «Tệp hạng cao đã đổi» và «sửa sau Cổng Phạm vi» (tên luật, làm tròn, ba tuỳ chọn FramedList, hàng mẫu 0602 và 0801 của S1.02).
- Việc phụ `N-12` (cập nhật trang tri thức Cài đặt sàn) chạy sau chữ ký, không tự sửa kho tri thức.
- Trang quyết định của hàng: 0037 (đã viết).

## Sổ

Sổ quyết định `_acceptance/thue-phi/decisions.jsonl` có đủ các dòng `fix`/`revisit` của S3 (nhãn, làm tròn, FramedList, bước ui-check).
