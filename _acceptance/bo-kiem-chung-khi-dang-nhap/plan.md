# Kế hoạch thi công — bo-kiem-chung-khi-dang-nhap (hàng 1r)

Phạm vi đã duyệt: `contract.md` (Manh Phan, 2026-11-12). Bản thiết kế: `design.md`. Thứ tự: T1 → T2 → T3 → T4 → T5. T1 và T3
không chung tệp nhưng đều nhỏ, làm tuần tự trong một phiên (`independent: false` cho cả năm việc).

## Tóm tắt cho người duyệt

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Bài kiểm có hai hàm chờ dùng chung: mở ngăn, chờ băng báo, đều đã chứng đỏ được | `tools/e2e_templates/settle.ts`, `tests/e2e/settle.spec.ts` | AC-5 (chờ ngăn), AC-6 (chờ băng) |
| Mọi bài kiểm cũ mở ngăn hay chờ băng đi qua hai hàm ấy, có danh sách bài được lặp | `tests/e2e/frame.spec.ts`, `tests/e2e/app-shell.spec.ts`, `tests/e2e-db/members.spec.ts` | AC-7 (bỏ bản chép), AC-8 (lặp 20 lần) |
| Bộ kiểm chung nhận ra màn cần đăng nhập lúc chạy, thôi bỏ qua theo danh sách | `tools/e2e_templates/suite.ts`, `runner.ts`, `register.ts` | AC-3 (không bỏ qua), AC-4 (giao sang lượt có phiên) |
| Lượt có cơ sở dữ liệu đăng nhập một lần rồi đo mọi màn, kể cả Thành viên | `tests/e2e-db/setup.ts`, `phien.setup.ts`, `screens.spec.ts`, `playwright.db.config.ts` | AC-1 (phiên thử), AC-2 (đo mọi màn) |
| Toàn bộ bài kiểm cũ vẫn xanh, ca phá của hàng 1f còn đủ | chạy đủ bộ | AC-9 (không làm yếu) |

Một việc phải nói trước: bài liệt kê của hàng 1f («sổ thật liệt kê đúng bộ khung đã viết») hôm nay đếm 4 màn × 4 bài × 4 khổ
= 64 vì màn Thành viên bị bỏ lúc nạp. Sau vòng này màn Thành viên có mặt trong danh sách bài của lượt không phiên (rồi được
giao sang lượt có phiên lúc chạy), nên danh sách viết trước của bài ấy thêm `members` thành 80. Đây là bài liệt kê, không phải
ca phá; điều nó đo (mọi màn trong sổ đều có bộ) không yếu đi. Đã báo giám sát.

## T1 — Hai hàm chờ dùng chung và cặp ca hai chiều

- Files: `tools/e2e_templates/settle.ts` (mới: `openSheet`, `shown`, `SETTLE_MS = 20_000`, `CHO_TESTS`),
  `tools/e2e_templates/fixture.ts` (mới: `test` mở rộng — trang tự hãm CPU khi có `E2E_CPU_THROTTLE`, dùng chung bộ hãm của
  `runner.ts`), `tools/e2e_templates/runner.ts` (xuất bộ hãm), `tests/e2e/settle.spec.ts` (mới, 5 bài: `ngan mo`,
  `ngan chua dung`, `ngan khong mo`, `bang hien`, `bang khong hien`, mang thẻ `@cho`).
- Verify: `npx playwright test tests/e2e/settle.spec.ts --project=360 --project=1024`; phá thử: tắt bước chờ chuyển động
  trong `openSheet` trên bản nháp → `ngan chua dung` phải đỏ ở ca chính lẫn ca phá đổi nghĩa (rồi hoàn lại).
- Phục vụ: E6, E7.

## T2 — Gom bản chép và gắn thẻ `@cho`

- Files: `tests/e2e/frame.spec.ts`, `tests/e2e/app-shell.spec.ts`, `tests/e2e-db/members.spec.ts` (bỏ hàm `openSheet` chép tay,
  gọi `openSheet`/`shown`; import `test` từ `fixture.ts`; thẻ `@cho` cho bài mất mạng, bài axe 18 lượt, bài mở ngăn, nhóm
  «App Shell on a phone», bài members gọi `navMembers`), `tools/e2e_templates/e2e-templates.test.ts` (bài
  `khong ban chep ham cho`, bài `the @cho du danh sach`, mỗi bài có chiều đỏ trên bản sao).
- Không đổi điều bài nào đo; tên bài giữ nguyên.
- Verify: `npx vitest run tools/e2e_templates --coverage.enabled=false`; `npx playwright test --grep @cho --project=360`.
- Phục vụ: E8, E15, chuẩn bị E9, E10.

## T3 — Bộ dựng bài chung, nhận màn cần đăng nhập lúc chạy

- Files: `tools/e2e_templates/suite.ts` (mới: `registerSuite({ mode })`, dời phần dựng bài từ
  `tests/e2e/screens/screens.spec.ts`, vùng hiệu chuẩn chỉ ở `khong-phien`), `tools/e2e_templates/runner.ts` (sau khi mở màn:
  bị đẩy về `/login` → `khong-phien` bỏ qua có tên `can dang nhap — do o luot co phien`; `co-phien` ném
  `<màn>: phien-thu — bi day ve dang nhap`), `tools/e2e_templates/recipes.ts` (công thức khung `phien-thu` chỉ chạy ở
  `co-phien`, ca phá xoá cookie phiên — không đụng công thức và ca phá cũ), `tools/e2e_templates/register.ts` (gỡ
  `SESSION_SCREENS`, `sessionSuiteProblem`; thêm `SIGNED_OUT_SCREENS = { "sign-in": "cho nguoi chua dang nhap" }`),
  `tests/e2e/screens/screens.spec.ts` (chỉ gọi `registerSuite`), `tools/e2e_templates/e2e-templates.test.ts` (thay ba ca
  «bỏ qua có điều kiện» bằng ca của cơ chế mới; bài liệt kê thêm `members`; bài `ca pha hang 1f giu nguyen` với bảng rút
  bằng máy từ `git show a97c71d:tools/e2e_templates/recipes.ts`; bài `danh sach nguoi chua dang nhap co ly do`).
- Verify: `npx vitest run tools/e2e_templates --coverage.enabled=false`; `npx playwright test tests/e2e/screens --project=1440`.
- Phục vụ: E4, E5, E11.

## T4 — Lượt có cơ sở dữ liệu với phiên thử

- Files: `tests/e2e-db/setup.ts` (thêm sàn thử, người thử `[Tên] Phiên thử` đủ bốn vai, ghi địa chỉ thư vào tệp của lượt),
  `tests/e2e-db/phien.setup.ts` (mới: đăng nhập qua `/login`, mã từ hộp thư thử, lưu trạng thái trình duyệt vào tệp của lượt),
  `playwright.db.config.ts` (dự án `phien`; bốn dự án `co-phien-<khổ>` phụ thuộc `phien`, mang trạng thái phiên, chỉ chạy
  `screens.spec.ts`; bốn dự án cũ bỏ qua `screens.spec.ts` và `phien.setup.ts`), `tests/e2e-db/screens.spec.ts` (mới: gọi
  `registerSuite({ mode: "co-phien" })`, in `man do co phien: …` và `bo qua can dang nhap: 0`, bài
  `man cho nguoi chua dang nhap that su day nguoi da dang nhap di`).
- Verify: `DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts`; phá thử: bỏ
  trạng thái phiên khỏi một dự án → ca chính `phien-thu` của members đỏ đúng thông điệp (rồi hoàn lại).
- Phục vụ: E1, E2, E3.

## T5 — Chạy đủ bộ một lần trước khi chấm

- `make check`, `make e2e`, `kiem_chung_phien`, `kiem_chung_db_tron`, `kiem_chung_lap`, `kiem_chung_lap_phien`.
- Phục vụ: E9, E10, E12, E13, E14.
