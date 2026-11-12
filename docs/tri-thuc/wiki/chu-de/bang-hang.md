---
loai: chu-de
ma: [B1, N5, F7]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md, raw/2026-11-12-so-boi-canh-quy-hang-2/chi-muc.md]
cap_nhat: 2026-11-12
---
# Bảng hàng

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`. Đường mở đầu `nhánh …:`
chưa gộp vào `main`, số dòng có thể đổi.

## Vì sao có

- Bảng hàng sinh ra để thay Google Sheet của đầu chủ. Đây là chỗ người dùng so với Sheet đầu tiên, nên thêm và xoá một dòng
  phải nhanh ngang Sheet. `qh:docs/product/tham-chieu.md:39,420-423`
- Sửa ngay trên ô là lý do lớn nhất người giữ sổ chưa rời Sheet: gọi chủ nhà xong, sửa giá trong hai giây.
  `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:39`

## Ai dùng và làm việc gì

- Đầu chủ giữ sổ trên máy tính: nhập hàng, sửa giá, trạng thái. Trưởng nhóm xem cả đội, căn nào đã cũ. Đầu khách lọc hàng
  rồi gửi khách. Thường chỉ vài người sửa, cả đội xem. `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:9-17`
- Trên điện thoại chỉ bốn việc của người đang ở ngoài: gọi lại, đổi giá nhanh, tra căn, gửi khách. Sửa trên ô chỉ có trên máy
  tính. `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:57`

## Thói quen phải giữ

- Dày như Sheet: thấy hết trong một màn, không bắt mở trang chi tiết. Quỹ hàng dùng dòng cao 37 px, khoảng 19 dòng một màn.
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:110` · `qh:docs/plan/dong-nhat-bang-hang-lien-he.md:79`
- **Cuộn liền, không chia trang**, kèm dòng tổng «n / N căn» ở chân bảng. Tiêu đề đứng yên; ba cột ghim trái: số dòng, Toà,
  Mã căn. `qh:_acceptance/bang-hang-kieu-sheet/design.md:28-32` · `qh:apps/web/src/app/(app)/inventory/bang-hang.tsx:70,381`
- Mỗi cột một ô lọc đúng kiểu (chữ không phân biệt dấu, số gõ `<=5` hay `2-5`, giá theo tỷ), cộng dồn, có «Xoá lọc».
  `qh:_acceptance/bang-hang-kieu-sheet/contract.md:40-50`
- Đi ô bằng mũi tên, Tab, Enter, Esc; chọn vùng rồi chép ra dạng tách tab để dán sang Zalo hay Excel.
  `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:45` · `qh:_acceptance/bang-hang-kieu-sheet/design.md:30-31`
- Sheet chia mỗi khu một tab và lọc bằng cột; mã căn là toạ độ (căn hộ: toà · tầng · trục). Môi giới rành dự án chạm thẳng
  «tầng 18, trục 08» nhanh hơn gõ tìm. `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:125` ·
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:55,125`
- Chủ kho nêu 12/11: đầu chủ làm việc theo địa lý rộng → hẹp, Dự án → Phân khu → Toà → Tầng, Sheet chia tab theo dự án, lọc
  bằng cột. Quỹ hàng không ghi thứ tự này, và đã bỏ chữ «dự án» để gọi theo RESO (khu, toà, căn).
  `nhánh claude/gracious-raman-dd20c0:_acceptance/bang-hang-ban-doc/design.md:65-71` · `qh:docs/adr/0016-moi-loai-hinh.md:11,100`
- Vị trí là bất khả xâm phạm: toà, tầng, trục không đổi chỗ, không xếp lại «thông minh». `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:106`
- Danh sách cột cụ thể trong Sheet của đầu chủ: chưa xác nhận (chỉ biết tiêu đề viết tắt, giá theo tỷ, phí ghi `BP`/`KBP`).
  `qh:packages/db/seed/README.md:10`

## Quỹ hàng đã chọn gì

- ADR-0004: lưới `@reui/data-grid` (TanStack Table + Virtual), sau bài thử 5.000 dòng × 20 cột, CPU giảm tốc 4×: cuộn p95
  33,3 ms (ngưỡng 33,4, rất sát), dán 500 ô 54 ms. Khối đích `data-grid-editing-6`, nhóm dòng theo `data-grid-grouping-2`.
  `qh:docs/adr/0004-luoi-bang-hang.md:8,15-18,30-36` · `qh:design/patterns/bang-hang.md:19-20`
- Bố cục Danh sách – chi tiết: bảng cuộn trong một khung, trang không cuộn; hồ sơ căn là cột kéo chia ngoài khung, mặc định
  38%. `qh:design/patterns/bang-hang.md:15-20,29-32` · `qh:docs/product/tham-chieu.md:196`
- Danh mục chung mọi sàn: khu → toà hay phân khu → trục hay dãy → căn, khoá lại; tab Sheet theo khu thành góc nhìn lưu; nhóm
  dòng theo toà rồi loại căn. Sau 08/11 mỗi dòng mang loại hình, lọc và nhóm được theo loại hình.
  `qh:docs/product/tham-chieu.md:67` · `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:125` ·
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:91` · `qh:_acceptance/bang-hang-theo-loai-hinh/contract.md:3,11`
- Điện thoại: cùng địa chỉ, dưới khổ `md` thành danh sách thẻ `product-grid-4`, ngăn lọc `filter-sidebar-5` kéo từ đáy.
  `qh:docs/design/vo-va-ia.md:174-181`

## Lỗi đã gặp

- Sàn 5.000 căn làm bảng sập (React #185): bảng thẻ điện thoại vẫn gắn ẩn trên máy tính, cuộn ảo đo lại không dừng.
  `qh:_acceptance/va-bang-hang-cuon-so-lon/contract.md:20-24`
- Mở hồ sơ cạnh bảng thì chỉ còn thấy 5 trong 15 cột; lần mở đầu trên máy mới, 4G chậm và máy chậm 4 lần mất khoảng 4,2
  giây. `qh:docs/plan/dong-nhat-bang-hang-lien-he.md:83,143`
- Phím End đưa ô chọn ra ngoài màn mà bảng không cuộn theo; mục ghim cột bấm không tác dụng.
  `qh:_acceptance/bang-hang-kieu-sheet/contract.md:120-123`

## MVP này giữ gì, bỏ gì

- Giữ B1 (bảng chỉ đọc trên Lưới, bốn khổ), N5 (dữ liệu thật qua `/api/v1`), F7 (Lưới, tìm lọc).
  `docs/plan/pham-vi-mvp-dot-1.md:18,34,36`
- **Cuộn liền, không chia trang** (chủ kho chốt 11/11 ở hàng 2, «đọc như Sheet»): cả 60 căn mẫu trong một lần cuộn, đánh số
  liền, tiêu đề đứng yên, cột số dòng cùng Căn và Toà đứng yên khi cuộn ngang. Bản phạm vi F7 còn ghi «chia trang» và Lưới
  dùng chung vẫn chia 50 dòng một trang. `nhánh claude/gracious-raman-dd20c0:_acceptance/bang-hang-ban-doc/contract.md:35-38,117` ·
  `nhánh claude/gracious-raman-dd20c0:_acceptance/bang-hang-ban-doc/design.md:28` · `src/components/candidate/data-region.tsx:47`
- Hàng 2a: dùng tay như Sheet (phím mũi tên, bôi vùng rồi chép, sắp xếp, lọc từng cột, nhóm theo toà, ẩn hiện cột). Hàng
  2b: thẻ căn trên điện thoại. `nhánh chore/nen-lo-trinh-lop-sheet-va-no:docs/plan/lo-trinh.json:434-445,477-487`
- Lọc theo khu đi bằng lọc từng cột của hàng 2a. Lọc theo dự án, cấp phân khu và cây dự án → toà: hàng 2 chưa làm, chờ chủ kho.
  `nhánh chore/nen-lo-trinh-lop-sheet-va-no:docs/plan/lo-trinh.json:435` ·
  `nhánh claude/gracious-raman-dd20c0:_acceptance/bang-hang-ban-doc/design.md:71`
- Bốn khổ 1440, 1024, 414, 360 (bỏ 375); ghim cột là giả thuyết, đo lại. Cắt góc nhìn lưu và sửa hàng loạt (L7), thấp tầng
  (L6). `docs/design-standard-proposal.md:156,159,300` · `docs/plan/pham-vi-mvp-dot-1.md:67-68`
