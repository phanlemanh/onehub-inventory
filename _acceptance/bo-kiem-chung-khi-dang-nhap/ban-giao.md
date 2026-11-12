# Bàn giao hàng 1r — bo-kiem-chung-khi-dang-nhap (dãy H)

Viết 2026-11-12 khi đợt nen bàn giao tài khoản (mức dùng tuần 98%). Chỉ ghi điều git và hồ sơ chưa có.

## Đang ở đâu

- Cổng Phạm vi: chủ kho đã duyệt (Manh Phan, 2026-11-12, commit 0c394b3).
- Kế hoạch thi công (`plan.md`, commit 7eb95dd) đã trình. **Đang chờ chủ kho gõ «duyệt» kế hoạch** (Gate 1.5, hạng T3).
  Chưa viết dòng mã nào.

## Lời chủ kho chốt trong phiên này (chưa nằm trong tệp nào khác)

- Hỏi-1: chủ kho nhận khuyến nghị. Lượt có phiên đăng nhập chạy ở máy của dãy và ở lượt chấm, không chạy trên CI.
- Việc đưa Postgres lên CI là một hàng riêng, giám sát đặt mã 1s (yêu cầu H-6). Hàng ấy phải xong trước hàng 10.
- Giám sát cho thay ba ca kiểm «bỏ qua có điều kiện» của hàng 9 (trả lời H-1211-6). Thẻ và thiết kế đã ghi việc thay.

## Bước kế, đúng thứ tự

1. Chủ kho gõ «duyệt» kế hoạch → ghi một dòng sổ `seal` cho Gate 1.5 nếu bộ vòng đòi, rồi vào S3.
2. **Trước Cổng Bằng chứng** (luật mới của đợt, LUAT 2026-11-12 03:00Z): thêm mục «Từ Quỹ hàng» vào `design.md` và thẻ.
   Nội dung: Quỹ hàng giải nhu cầu này thế nào, với đường dẫn tệp cụ thể ở `/Users/manhphan/dev/onehub-quy-hang`
   (commit 1729b11f, chỉ đọc). Gợi ý tra: `docs/adr/0006-bai-thu-dong-bo.md`; cách Quỹ hàng chạy bài trình duyệt có đăng
   nhập và cơ sở dữ liệu ở máy và trên CI (`.github/workflows`, `packages`); hồ sơ `va-nut-ci-*`, `va-thuoc-ci-*`. Ghi rõ
   hàng này giữ gì, bỏ gì, vì sao. Sau khi gộp nhánh chính, đọc thêm trang của hàng ở `docs/tri-thuc/wiki/chu-de/`
   (PR #34 có trang về bài kiểm trình duyệt). Việc đọc lộ ra điều trái với phạm vi đã duyệt → DỪNG, báo giám sát, không tự
   đổi phạm vi. Mục này chỉ thêm tài liệu, không đổi mã.
3. **Gộp nhánh chính về TRƯỚC khi làm T2 (gom hàm chờ).** Từ lúc viết kế hoạch, nhánh chính đã đổi:
   - hàng 2 (Bảng hàng), hàng 7a, hàng 9d (PR #32), sổ bối cảnh bổ sung (PR #34) đã gộp;
   - hàng 2a (dãy K) đang sửa `tests/e2e/frame.spec.ts`, `tests/e2e/grid.spec.ts`, `tests/e2e/behavior.spec.ts` và thêm ca
     ở cuối `tests/e2e/app-shell.spec.ts`;
   - hàng 3 (dãy D) thêm `tests/e2e/ho-so-can.spec.ts`.

   T2 phải gom hàm chờ ở **mọi** tệp kiểm có mở ngăn hay chờ băng sau khi gộp, kể cả tệp mới. Danh sách `CHO_TESTS` và bài
   «không bản chép hàm chờ» phải quét cả các tệp ấy. Gộp xong thì chạy `npm ci` nếu `package.json` hay `package-lock.json`
   đổi (luật kho số 7), và sinh lại `PRODUCT-MAP.md`, `LO-TRINH.html` khi xung đột.
4. Hàng 2 đã gộp nên bài liệt kê màn của hàng 1f có thể đã đổi số trên nhánh chính. Đếm lại trước khi sửa con số 64 → 80
   ghi trong `plan.md` và dòng sổ S2.

## Hạ tầng

- Postgres của dãy H: container `onehub-inventory-db-h`, cổng 127.0.0.1:5567. Giữ chạy, vì bốn lệnh `kiem_chung_*` trong
  `_acceptance/config.yaml` dùng nó. Phiên này không mở tiến trình riêng nào khác.
- Worktree này từng thiếu gói `pg` vì phụ thuộc cũ. Đã chạy `npm ci` lúc 02:15Z. Sau khi gộp nhánh chính, kiểm lại.
- Dãy H không giữ khoá nào của đợt (khoá đường nền đã nhả).
