---
loai: chu-de
ma: [V1, V2, V3]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Nhập Excel

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Bảng hàng vốn đến dạng Excel từ chủ đầu tư hay đại lý, nên chép dán là rẻ nhất. Thả file cũ để máy ghép từng dòng vào đúng
  căn hạ rào rời Sheet. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:46,98`
- Nhập file là một trong các cửa vào, cùng qua một bước kiểm trùng theo căn và theo chủ nhà. Nhập là chỗ quyết dữ liệu sàn
  sạch hay bẩn. `qh:docs/product/tham-chieu.md:55` · `qh:docs/adr/0011-nhap-du-lieu-tac-tu.md:10-11`

## Ai dùng và làm việc gì

- Đầu chủ nhập, hoặc Trưởng nhóm nhập hộ một đầu chủ; chỉ trên máy tính. `qh:docs/product/tham-chieu.md:197,391`
- Năm bước: tải · ghép cột · xem trước · trùng · tóm tắt. Mỗi dòng đúng một việc: căn mới, cập nhật căn mình giữ, tin bổ
  sung cho căn người khác, hay bỏ kèm lý do. `qh:docs/product/tham-chieu.md:386,391`
- Gỡ được cả lần nhập: nút ngay sau khi ghi và mục «Lần nhập gần đây». `qh:docs/product/tham-chieu.md:394`

## Thói quen phải giữ

- File của sàn tự do: cột tự đặt, viết tắt («KBP», «BP», «Phí CN»); máy ghép cả cột lẫn giá trị.
  `qh:docs/adr/0011-nhap-du-lieu-tac-tu.md:29-31` · `qh:docs/product/tham-chieu.md:118`
- Google Sheet: chỉ nhận file tải về (.xlsx, .csv), không đọc qua link công khai vì bắt sàn mở bảng có số chủ.
  `qh:docs/adr/0011-nhap-du-lieu-tac-tu.md:92-94`
- Giới hạn 10 MB, 5.000 dòng. `qh:docs/product/tham-chieu.md:391`

## Quỹ hàng đã chọn gì

- Khuôn Luồng nhiều bước, khung năm bước chuyển thể từ `solution-crm-6`. `qh:design/patterns/nhap-excel.md:15-18`
- Đọc tệp trên trình duyệt, tệp không lên máy chủ; máy chủ xem thử từng gói 200 dòng rồi mới cho ghi; con số trên màn là số
  máy chủ trả. `qh:docs/product/tham-chieu.md:391` · `qh:design/patterns/nhap-excel.md:29-30`
- Hoàn tác bằng sự kiện bù, không phải trạng thái mới; căn đã có sự kiện sau lần nhập thì không gỡ, liệt kê ra.
  `qh:docs/adr/0011-nhap-du-lieu-tac-tu.md:82-86` · `qh:docs/product/tham-chieu.md:394`
- Dòng nhập không tính là vừa xác nhận với chủ nhà. `qh:docs/adr/0011-nhap-du-lieu-tac-tu.md:87-90`

## Lỗi đã gặp

- Chế độ không AI đo trên tám file thử: không ô lỗi nào lọt, ghép cột đúng hết trừ một file bẩn (11/12 cột). Chỗ yếu còn
  lại: hai cột ghép vào cùng một trường thì cột thứ hai không được soát. `qh:_acceptance/nhap-loi-tat-dinh/so-nen.json:1-40`
  · `qh:_acceptance/nhap-loi-tat-dinh/contract.md:123`
- Nhiều bài kiểm của màn Nhập xanh trên cả mã cũ lẫn mới, nên không phân biệt được hành vi mới.
  `qh:_acceptance/man-nhap-excel/evidence-report.md:203-210`
- Hoàn tác lần nhập để lộ lỗ: căn đã gỡ vẫn gửi được cho khách. `qh:docs/product/tham-chieu.md:395`
- Lỗi người dùng thật gặp khi nhập file: chưa xác nhận (chưa thấy ghi chép từ phiên dùng thật).

## MVP này giữ gì, bỏ gì

- Giữ V1 nhập có xem trước và hoàn tác, V2 thêm căn bằng gõ mã căn, V3 tạo căn tay khi danh mục chưa có.
  `docs/plan/pham-vi-mvp-dot-1.md:42-44`
- Bỏ nhập có AI và nhớ mẫu nhập (L5). `docs/plan/pham-vi-mvp-dot-1.md:66`
- Tạo căn tay ở Quỹ hàng mới mở lại 06/11, chưa dựng, nên V3 không có bản cũ để tham khảo. `qh:docs/product/tham-chieu.md:55`
- Nhập «còn hàng» lên thẳng Đang bán (06/11) trái với ADR-0011 «hàng mới bắt đầu ở Chưa đủ để rao»; MVP theo bản nào: chưa
  xác nhận. `qh:docs/product/tham-chieu.md:144` · `qh:docs/adr/0011-nhap-du-lieu-tac-tu.md:105-108`
