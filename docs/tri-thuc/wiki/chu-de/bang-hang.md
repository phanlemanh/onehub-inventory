---
loai: chu-de
ma: [B1, N5, F7]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Bảng hàng

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

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
- Danh sách cột cụ thể trong Sheet của đầu chủ: chưa xác nhận (chỉ biết tiêu đề viết tắt, giá theo tỷ, phí ghi `BP`/`KBP`).
  `qh:packages/db/seed/README.md:10`

## Quỹ hàng đã chọn gì

- ADR-0004: lưới `@reui/data-grid` (TanStack Table + Virtual), sau bài thử 5.000 dòng × 20 cột, CPU giảm tốc 4×: cuộn p95
  33,3 ms (ngưỡng 33,4, rất sát), dán 500 ô 54 ms. Khối đích `data-grid-editing-6`, nhóm dòng theo `data-grid-grouping-2`.
  `qh:docs/adr/0004-luoi-bang-hang.md:8,15-18,30-36` · `qh:design/patterns/bang-hang.md:19-20`
- Bố cục Danh sách – chi tiết: bảng cuộn trong một khung, trang không cuộn; hồ sơ căn là cột kéo chia ngoài khung, mặc định
  38%. `qh:design/patterns/bang-hang.md:15-20,29-32` · `qh:docs/product/tham-chieu.md:196`
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

- Giữ B1 (bảng chỉ đọc trên Lưới, bốn khổ), N5 (dữ liệu thật qua `/api/v1`), F7 (Lưới, tìm lọc, **chia trang**).
  `docs/plan/pham-vi-mvp-dot-1.md:18,34,36`
- **Lệch cần chốt:** Quỹ hàng cố ý cuộn liền theo thói quen Sheet; Lưới kho này đang chia 50 dòng một trang. Bản đề xuất
  ghi đây là mẫu hành vi phải chốt trước khi dựng. `src/components/candidate/data-region.tsx:47` ·
  `docs/design-standard-proposal.md:301`
- Bốn khổ 1440, 1024, 414, 360 (bỏ 375); ghim cột là giả thuyết, đo lại. Cắt góc nhìn lưu và sửa hàng loạt (L7), thấp tầng
  (L6). `docs/design-standard-proposal.md:156,159,300` · `docs/plan/pham-vi-mvp-dot-1.md:67-68`
