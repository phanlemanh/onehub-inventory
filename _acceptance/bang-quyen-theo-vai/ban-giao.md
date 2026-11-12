# Bàn giao hàng 9a — bang-quyen-theo-vai (2026-11-12)

Chỉ ghi điều git và hồ sơ chưa có. Thiết kế, hợp đồng, kế hoạch đo, kế hoạch, sổ quyết định, thẻ: cùng thư mục này.

## Đang ở đâu

- Cổng Phạm vi **đã duyệt** (Manh Phan, 2026-11-12, cả ba câu theo khuyến nghị: duyệt đổi mô hình nghiệp vụ; mọi vai đọc
  thoả thuận kết nối, chỉ Quản trị sàn thêm và sửa). Hợp đồng `status: approved`, sổ đã có dòng niêm phong.
- **Chờ chủ kho gõ «duyệt kế hoạch»** (Gate 1.5, hàng T3) cho `plan.md`. Chưa viết dòng mã nào. Bảng trình kế hoạch cho
  chủ kho đã đưa ở phiên cũ; phiên mới trình lại bằng `plan.md` nếu chủ kho hỏi.

## Bước kế tiếp, đúng thứ tự

1. Có chữ «duyệt kế hoạch» → ghi vào sổ quyết định một dòng `stage: gate1.5` (lời người nguyên văn), commit.
2. Gộp nhánh chính về MỘT lần (`git fetch origin && git merge origin/main`), sinh lại tệp sinh (`make gen`;
   `PRODUCT-MAP.md`, `LO-TRINH.html` bằng `product-map.mjs` của acceptance-gate 2.38.1), chạy `npm ci` nếu
   `package.json` hay khoá đổi.
3. **Đổi số migration**: hàng 7a gộp trước (migration 005 đã ở nhánh chính, số 004 bỏ trống, không dùng lại). Migration
   của 9a là `006_bang_quyen_theo_vai.sql` (số kế sau số lớn nhất trên nhánh chính lúc tạo). Sửa mọi chỗ ghi `004` trong
   `plan.md`, `design.md`, `evals.yaml` (trường `paths`, E7 «implemented_in»), `contract.md` (mục Notes, AC-9) — đây là
   sửa số, không phải đổi phạm vi (giám sát, tin G-1211-24). Tạo migration bằng `/new-migration`.
4. Bảng mới `app.permissions` phải qua **bộ kiểm cách ly đã siết của 7a** (`db/tests/cach-ly.sql` sau khi gộp): khai nó
   là ngoại lệ danh mục dùng chung đúng cách bộ kiểm ấy đòi.
5. Thêm mục **«Từ Quỹ hàng»** vào `design.md` và thẻ trước Cổng Bằng chứng (luật mới LUAT 2026-11-12 03:00Z, tin
   G-1211-8): Quỹ hàng giải nhu cầu này thế nào — trích tệp cụ thể ở `/Users/manhphan/dev/onehub-quy-hang` (commit
   `1729b11f`, chỉ đọc): `_acceptance/bang-quyen-theo-vai/` (hồ sơ đã ký), `packages/core/src/access/bang-quyen-hang.json`,
   `docs/plan/ra-soat-crud-phan-quyen.md` (bảng hai thao tác × vai, chỗ hở G1, G7), `docs/adr/0006-vai-khu-va-loi-moi.md`;
   cùng các hồ sơ `chu-san-du-vai`, `moi-nguoi-vai-khu` nếu có; và trang mới của sổ bối cảnh trên nhánh chính
   (`docs/tri-thuc/wiki/chu-de/`, trang quyền và cách ly, thoả thuận kết nối — PR #34). Giữ gì, bỏ gì, vì sao. Chỉ thêm tài
   liệu; đọc ra điều trái phạm vi đã duyệt thì DỪNG và báo giám sát.
6. Thi công 10 việc của `plan.md` theo thứ tự, mỗi phép đo mới kèm cặp phá thử. Rồi S4 theo feature-loop.

## Điều kiện giám sát đã đặt (trả lời N-8, chưa ghi ở hồ sơ)

Duyệt chạm tám tệp ngoài ranh giới (`tools/ontology_actions.py`, `src/generated/ontology.ts`, `ontology/glossary.md`,
`ontology/entities/Member.yaml`, `wiki/entities/member.md`, `wiki/log.md`, `wiki/decisions/0016-permission-model.md`, tệp
kiểm của bộ sinh), với bốn điều kiện:

1. `src/generated/ontology.ts` chỉ đổi bằng `make gen`, không sửa tay.
2. `wiki/decisions/0016-permission-model.md`: chỉ thêm một mục sửa đổi có ngày, không viết lại phần cũ.
3. Mọi thay đổi ở `ontology/` hiện trên thẻ (đã làm: Hỏi về đổi mô hình nghiệp vụ) và PR có mục «Đổi ontology — chủ kho
   soi».
4. Sửa bộ sinh ở `tools/` nằm trong kế hoạch chủ kho duyệt, kèm bài kiểm của bộ sinh. Tệp kiểm thật là
   `src/modules/identity/permission-table.test.ts` (kho không có bài kiểm Python cho `tools/`); đã báo giám sát ở tin
   N-1211-2.

## Lời giám sát sau khi viết kế hoạch

- Hạn mức tuần không chặn việc (LUAT 03:10Z): chạy đủ bộ kiểm cần chạy; commit và đẩy nhánh thường xuyên.
- Nhánh chính đã có thêm hàng 9d (PR #32) và sổ bối cảnh bổ sung (PR #34).

## Hạ tầng

- Postgres của dãy N: container `onehub-inventory-db-n`, cổng 5563, đang chạy, để lại cho phiên nối. Không tiến trình
  nền nào khác của dãy đang chạy; không giữ khoá nào của đợt.
- Worktree này từng thiếu phụ thuộc (gói `pg`); đã chạy `make setup` ở phiên cũ. Sau khi gộp nhánh chính, chạy lại nếu
  khoá phụ thuộc đổi.
