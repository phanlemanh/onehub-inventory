# Kế hoạch dựng — Bảng hàng trên dữ liệu thật (hàng 10)

Thiết kế: `docs/superpowers/specs/2026-11-15-bang-hang-du-lieu-that-design.md` · Hợp đồng:
`_acceptance/bang-hang-du-lieu-that/contract.md`. Kế hoạch viết theo các lối máy khuyên ở Hỏi-1…Hỏi-6; chủ kho chọn khác
ở câu nào thì việc tương ứng đổi theo (ghi ở cuối).

**Điều kiện bắt đầu dựng:** 2b (#63), 2d (#65), 19 (#64) đã vào main và nhánh này đã gộp main. Việc 1 viết bài trước
(đỏ), các việc sau làm cho bài xanh. Mỗi việc một commit; làm tuần tự trong phiên (các việc chạm chung mô-đun căn).

## Việc

### 1. Bài viết trước (đỏ)

- Tệp: `tests/db/bang-hang-that.db.test.ts`, `tests/bang-hang-that.test.ts`, `tests/e2e-db/bang-hang-that.spec.ts`,
  `src/modules/listings/listings-http.test.ts`.
- Ma trận viết trước: 48 ô quyền (4 vai × 3 loại căn × 4 loại thay đổi) theo Hỏi-1, Hỏi-2; 14 dấu cách ly; ba luật dữ liệu;
  bốn ca hàm nguồn hàng.
- Kiểm: các bài chạy và đỏ đúng chỗ thiếu (chưa có bảng, chưa có đường).
- Phục vụ: mọi eval. `independent: false`.

### 2. Mô hình nghiệp vụ (`ontology/`, chủ kho soi)

- Tệp: `ontology/entities/Listing.yaml` (thêm `listAgentKey` → `Member`, RESO `ListAgentKey`; ghi «Chưa ai giữ» khi trống),
  `ontology/actions.yaml` (`viewListings`, `updateListing`, `activateListing` sang `live`, khai cửa API và cửa bảng; ô
  Quản trị sàn theo Hỏi-1), `ontology/labels.yaml` (nhãn «Người giữ căn», «Chưa ai giữ»), `ontology/glossary.md`.
  `make gen` sinh lại.
- Vòng đời (quyết định 0038, khai từ hàng 1t): trong `ontology/entities/Listing.yaml`, ô `xem` và `sua` bỏ `hang: "10"`
  (hàng này mở thật); ô `xem` bỏ luôn mục chặn `CompanyAdmin` vì Hỏi-1 A cho Quản trị sàn xem chỉ đọc. Ô
  `rieng.dua_len_ban` giữ `hang: "15"`: hàng 10 chỉ mở quyền đưa lên «Đang bán» theo người giữ căn; điều kiện Sẵn sàng bán
  (ảnh, pháp lý) vẫn là của hàng 15. Không thêm ô «không» nào, nên không cần chữ chủ kho mới.
- Kiểm: `make ontology`, `make gen` không lệch, `python3 tools/coverage_matrix/lifecycle.py --check` xanh.
- Phục vụ: E5, E9b. `independent: false`.

### 3. Migration 013 (`/new-migration`)

- Tệp: `db/migrations/013_bang_can_chao.sql`, `db/tests/cach-ly.sql`, `db/scripts/cach-ly.sh` (danh sách bảng).
- Nội dung: `listings`, `listing_units` (cột `open`, chỉ mục duy nhất có điều kiện), ràng buộc dữ liệu, luật theo sàn, luật
  thu hẹp theo bảng quyền, trigger chặn đưa lên «Đang bán» trái ô `activateListing`, quyền `select, update` cho vai nối
  ứng dụng, dòng `app.permissions` khớp `ontology/actions.yaml`.
- Kiểm: `make db-up`, `cach_ly_r`, `bang_hang_that_db` phần cách ly và luật dữ liệu xanh; cặp phá thử bỏ ép luật đỏ.
- Phục vụ: E1, E1b, E5, E10. `independent: false`.

### 4. Lệnh nạp mẫu vào cơ sở dữ liệu

- Tệp: `src/modules/listings/load-sql.ts` (khuôn `catalogLoadStatements`), `db/scripts/nap-mau.mjs` hoặc mục trong
  `db/scripts/` có sẵn; ba sàn «[MAU]», «[MAU-2]», «[MAU-TRONG]», người `[Tên]`, số `0900 000 0xx`.
- Kiểm: nạp vào cơ sở dữ liệu dãy R, đếm dòng mỗi sàn.
- Phục vụ: E2, E2-ui, E8. `independent: false`.

### 5. Đường đọc

- Tệp: `src/modules/listings/inventory-read.ts` (truy vấn qua `withCompany`), `src/modules/listings/server.ts`
  (`myInventory`, gộp một lần đọc mỗi lượt dựng), `src/app/(app)/inventory-source.ts` (hàm nguồn hàng duy nhất, Hỏi-6),
  `src/app/(app)/inventory/page.tsx`, `src/app/(app)/layout.tsx` (⌘K), `src/app/(app)/inventory/loading.tsx`; cây địa lý của
  2d nhận dòng và vị trí toà từ cùng lần đọc.
- Kiểm: `bang_hang_that_unit`, `bang_hang_that_db` (`doc-dung-san`, `loi-doc-that`, `nam-nghin-can`).
- Phục vụ: E2, E2b, E3, E3b, E8, E10. `independent: false`.

### 6. Đường ghi

- Tệp: `src/modules/listings/listings-http.ts`, `src/modules/listings/listings-write.ts`, `src/app/api/v1/listings/[id]/route.ts`,
  `src/modules/listings/ui/http-save-door.ts`, `src/modules/listings/save-door.ts` (loại thay đổi Điều kiện phí; 409 mang
  bản hiện tại), `src/modules/listings/ui/use-listing-cell-edit.tsx` (hoàn tác chỉ trường đã đổi trên phiên bản mới nhất),
  `src/modules/listings/ui/listing-cell-edit.tsx` (ô chọn Điều kiện phí), hồ sơ căn đọc người giữ căn thật.
- Kiểm: `bang_hang_that_unit`, `bang_hang_that_db` (48 ô, xung đột, hoàn tác, điều kiện phí).
- Phục vụ: E4, E4b, E5, E5b, E6, E6b, E7, E7b. `independent: false`.

### 7. Cửa vào và bài cũ

- Tệp: trang Bảng hàng (bắt đăng nhập khi có cơ sở dữ liệu), `tools/e2e_templates/` chỉ khi bài khung đọc Bảng hàng trống
  (dòng đăng ký, báo G), bài trình duyệt cũ dùng `?vai=` giữ nguyên (lối B).
- Cửa vào dùng lại luật vào của 2b (`entryAction`/`entryRefused` trong `src/app/(app)/nav.ts`, `vao` trong
  `design/screens.yaml`), không dựng cửa thứ hai. Hỏi-1 A: Quản trị sàn được `viewListings`, nên đặt `vao: viewListings`
  cho Bảng hàng không chặn vai nào của nhân viên.
- Trước khi đặt luật vào hay cấp quyền xem cho Quản trị sàn: bài `tests/e2e-db/lop-rieng.spec.ts` (ca «company words on
  inventory», hàm `headers()` đọc tiêu đề cột trước khi lưới vẽ xong) sẽ đỏ. G cho sửa bài ấy thành việc phụ trước khi
  dãy R dựng; dãy R không tự vá.
- Kiểm: `make e2e` trong lượt chấm của dãy, `bang_hang_that_e2e`.
- Phục vụ: E8, E9, E9b, E10b. `independent: false`.

### 8. Sổ và chứng minh màn

- Tệp: `_acceptance/bang-hang-du-lieu-that/chung-minh-man.md` (ma trận trạng thái, Khối), `wiki/entities/listing.md`,
  `wiki/decisions/0039-…` (số do G cấp) (ranh giới luật: nấc ở máy chủ, quyền và dữ liệu ở cơ sở dữ liệu), `wiki/log.md`,
  `design/screens.yaml`: mục `inventory` thêm `Member` vào `hien` (hồ sơ căn hiện tên người giữ căn; vòng đời của `Member`
  đã khai ở màn Thành viên).
- Kiểm: `python3 tools/coverage_matrix/lifecycle.py --check`, `make check`.
- Phục vụ: E8-khuon, E8-floor. `independent: false`.

## Nếu chủ kho chọn khác

- Hỏi-1 B: bỏ ô Quản trị trong việc 2; việc 7 ẩn mục Bảng hàng với người chỉ mang vai Quản trị.
- Hỏi-2 B: đáp án 48 ô đổi ở việc 1; luật thu hẹp sửa có nhánh «của tôi» ở việc 3.
- Hỏi-3, Hỏi-4 «làm ở hàng 10»: thêm việc ô sửa trường riêng / nút Nhận căn, mỗi việc một tiêu chí mới, ký lại Cổng Phạm vi.
- Hỏi-5 «làm ở hàng 10»: thêm bảng lịch sử mức thuế phí ở migration 013 và một việc tính Về tay theo dấu; vượt cỡ — tách.
- Hỏi-6 A: việc 7 chuyển 11 tệp bài trình duyệt sang làn có cơ sở dữ liệu, gỡ hẳn bộ mẫu khỏi `src/app`.
