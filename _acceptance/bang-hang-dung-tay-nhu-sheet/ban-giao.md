# Bàn giao — hàng 2a bang-hang-dung-tay-nhu-sheet (dãy K, 2026-11-12 ~07:50Z)

## Đang ở đâu
S3 xong, hợp đồng `implemented`. CHƯA chạy lượt chấm S4 nào (khoá s4 đã xin rồi nhả trước khi chạy, không có dòng run-log).
Không còn tiến trình riêng nào chạy (máy chủ thử cổng 3481 đã dừng; không có Postgres của dãy).

## Việc kế, đúng thứ tự
1. Chữ nút toàn màn hình: trả về «Toàn màn hình» / «Thoát toàn màn hình» (đang tạm «Cả màn hình» ở
   `src/components/candidate/grid-copy.ts`, `tests/e2e/sheet.spec.ts`, chú thích `shell-focus.tsx`). Theo G (tin XONG
   K-1211-17): sửa `tests/language.test.ts` so theo nguyên từ (ranh giới từ hiểu dấu tiếng Việt), thêm một ca chứng vẫn bắt
   nhãn viết cứng thật («Toà A»); đây là sửa bắt nhầm, không nới. Chữ nút lấy từ `ontology/labels.yaml` như mọi nhãn — cần nhãn
   mới thì HỎI G trước khi chạm ontology. Ghi một dòng sổ `fix` mang `supersedes: d-20261112T074152Z-28`.
2. `make check` xanh → commit → đẩy (`git -c http.postBuffer=524288000 push`, gói ảnh lớn làm đẩy thường bị ngắt).
3. Xin lượt `s4`; sinh `s4-args.mjs`. Lưu ý: `devServerUrl` tự giải ra `http://127.0.0.1:3470` (cổng của chủ kho) — dãy K
   dùng 3481; `make e2e` tự mở `next dev` riêng và Next 16 từ chối hai bản dev cùng thư mục, nên không để máy chủ thử chạy
   trong lúc chấm. Rồi Workflow `acceptance-verify.js`.
4. Xanh → Cổng Bằng chứng (thẻ + trang bằng chứng), PR nháp → sẵn sàng, gộp bằng `dieu-phoi.mjs gop` dưới khoá merge (hàng ký
   sau gộp nhánh chính về và chấm lại phần bị đụng).

## Lời chủ kho chốt trong phiên này
- «Có làm trong 2a.» — toàn màn hình (AC-11), chỉ từ 768px.
- «Có, tách hàng riêng» — lưu góc nhìn ở cột thứ hai thành hàng riêng; G đã đưa vào lộ trình nháp là hàng 2c, không làm ở 2a.

## Điều kiện G đặt
- K-14 (16 tệp): nav.ts, second-column.tsx chỉ cho lối tắt; grid.spec/frame.spec chỉ đổi ca đụng hành vi mới, không nới;
  so-khoi.yaml chỉ thêm sau Cổng Phạm vi (đã thêm 2 dòng); behaviors.md, wiki/log.md chỉ thêm; khối bọc ngoài data-region.tsx
  là của dãy D.
- K-15 (App Shell): trạng thái thường không đổi, ca cũ App Shell xanh không sửa; chế độ tập trung là năng lực chung; có lối thoát
  thấy được (nút + Esc), thoát trả tiêu điểm về nút; app-shell.spec.ts chỉ thêm ca ở cuối; báo dãy D (đã báo, D đồng ý).
- K-17 (behavior.spec.ts:24 chờ bảng): bài một-điểm-dừng của hàng 2 còn đo trước VÀ sau khi trang chạy, ca phá còn đỏ (đã
  giữ trong `tests/grid.test.tsx`); axe ở 1024 phải xanh trên GitHub, không chỉ ở máy.
- Đã chạm thêm ngoài danh sách, đã báo G: `tests/app-shell.test.tsx`, `tests/nav-roles.test.tsx` — chỉ thêm `useSearchParams`
  vào bản giả `next/navigation`.

## Thoả thuận với dãy D (hàng 3, hồ sơ căn)
- Chủ kho chốt ở phiên D «Lấy B có ghim» và «Trừ thanh trên»: hồ sơ là ngăn nổi bên phải trong vùng các dòng, cao từ dưới thanh
  trên tới đáy màn, được che phần phải tên màn và thanh công cụ, không khoá bảng; ghim thành cột là hàng 3a.
- D đặt khối bọc mới `data-region-stage` (relative) quanh vùng các dòng trong `data-region.tsx`; khi gộp, GIỮ khối ấy.
- Nút Lọc · Nhóm theo Toà · Cột · Toàn màn hình đứng sát ô tìm phía trái (còn bấm được khi ngăn mở ở 1024); bài của 2a không
  giả định thanh công cụ thấy trọn khi ngăn mở.
- Bấm ô chỉ chọn ô; bấm mã căn hoặc Enter mở hồ sơ qua lối `record` của khuôn Lưới; mũi tên vẫn đi ô khi ngăn mở; toàn màn
  giữ ngăn; Esc lúc toàn màn để trình duyệt thoát toàn màn trước, lần sau mới đóng hồ sơ.

## Nợ sẽ ghi ở Cổng Bằng chứng
- Ô chữ dài bị cắt vẫn là điểm dừng Tab riêng (hành vi hàng 2); khung cuộn của Base UI tự nhận phím khi cuộn được (giữ như nhà
  cung cấp giao). AC-9 «thân bảng một điểm dừng» đo phần còn lại.
- Ảnh ở Cổng Bằng chứng nên chụp trên một bộ căn mẫu (G báo hai bộ toà khác nhau trong ảnh thiết kế).
