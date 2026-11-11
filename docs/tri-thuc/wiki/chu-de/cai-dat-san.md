---
loai: chu-de
ma: [C1]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Cài đặt sàn

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Sàn khác nhau về cách gọi, hạn, tỉ lệ; con số là mặc định dựng sẵn, sàn chỉnh ở Cài đặt sàn, chỉ bất biến là không mở.
  `qh:docs/product/tham-chieu.md:125`
- Giá chỉ so được khi kèm điều kiện phí, nên sàn phải khai «bao phí» gồm khoản nào. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:128` ·
  `qh:docs/product/tham-chieu.md:418`

## Ai dùng và làm việc gì

- Chỉ Quản trị sàn mở màn và ghi; người khác bị đưa về Cá nhân. Giá trị thì cả sàn đọc được ở tầng dữ liệu. Chỉ trên máy
  tính. `qh:design/patterns/cai-dat-san.md:18-21` · `qh:docs/adr/0018-cau-hinh-theo-san.md:65` ·
  `qh:docs/product/tham-chieu.md:197`
- Thuế phí: bật tắt từng khoản của bao phí (thuế thu nhập, lệ phí trước bạ, môi giới) và đặt mức môi giới 0–5%.
  `qh:docs/product/tham-chieu.md:418`

## Thói quen phải giữ

- Đầu chủ tính qua lại giá bao phí và giá về tay với tỉ lệ đặt sẵn mà vẫn sửa được.
  `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:44,77`
- Chữ nghề «Phí CN», «BP» được neo vào điều kiện phí chuẩn. `qh:docs/product/tham-chieu.md:118`
- Quản trị sàn hiện đổi thuế phí trên Sheet thế nào: chưa xác nhận.

## Quỹ hàng đã chọn gì

- ADR-0018: một sổ điểm biến thiên ở lõi, mỗi điểm có kiểu, mặc định, khoảng, vai được đổi, hiệu lực; không có dòng là dùng
  mặc định. `qh:docs/adr/0018-cau-hinh-theo-san.md:45-48,62-71`
- Không làm đối tượng tự tạo, công thức, luồng tự vẽ tới khi có số đo từ hai sàn thật. `qh:docs/adr/0018-cau-hinh-theo-san.md:135-138`
- Màn: mỗi mục một khung, bố cục Đọc (tối đa 48rem), khối `settings-3`, ô có «Trả về mặc định».
  `qh:design/patterns/cai-dat-san.md:30-31` · `qh:docs/adr/0024-he-bo-cuc.md:43,153` · `qh:docs/design/vo-va-ia.md:133` ·
  `qh:docs/adr/0018-cau-hinh-theo-san.md:163`
- Thuế 2% và lệ phí 0,5% đúng số luật, màn ghi «theo luật»; mỗi giá bao phí mang dấu định nghĩa lúc tính.
  `qh:docs/product/tham-chieu.md:418`

## Lỗi đã gặp

- Nhãn ngắn của khoản phí viết cứng ở màn, ngoài lõi. `qh:_acceptance/thue-phi/review-findings.md:11,18`
- Dòng định nghĩa bao phí đọc dấu cũ khi giá mới còn trong hàng đợi đồng bộ. `qh:_acceptance/thue-phi/review-findings.md:25`
- Các mục Cài đặt mỗi mục lưu một kiểu; 09/11 chốt thống nhất về một cách lưu, chưa dựng. `qh:docs/product/tham-chieu.md:444`

## MVP này giữ gì, bỏ gì

- Giữ C1 Thuế phí của sàn; cấu hình sàn ở MVP chỉ Người dùng và Thuế phí, còn lại là hằng số trong mã.
  `docs/plan/pham-vi-mvp-dot-1.md:58` · `docs/design-standard-proposal.md:96`
- Bỏ cách gọi, trạng thái riêng, trường riêng, từ điển theo sàn (L4). `docs/plan/pham-vi-mvp-dot-1.md:65`
- Nhật ký đổi cấu hình nằm ở trang N10. `docs/plan/pham-vi-mvp-dot-1.md:30`
- Quyết định 0016 ghi điểm chọn của sàn chưa có màn chỉnh ở MVP; Thuế phí có phải ngoại lệ có màn: chưa xác nhận.
  `wiki/decisions/0016-permission-model.md:49`
