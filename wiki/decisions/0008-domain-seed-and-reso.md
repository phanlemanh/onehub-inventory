---
type: decision
title: Từ vựng khởi đầu và chuẩn RESO
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0008 Từ vựng khởi đầu và chuẩn RESO

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `domain` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: seed: ['Company', 'Unit', 'Listing', 'Contact', 'Agreement'], database: postgres.

Năm khái niệm có nghĩa đã ổn định trong CONTEXT.md của kho cũ, và tên theo RESO. Lead cố ý chưa đưa vào vì tên đang chồng nghĩa: dấu trên người và việc với người. Chuẩn đối chiếu là RESO Data Dictionary 2.1 (đã tra dd.reso.org ngày 09/11/2026). Listing ứng với tài nguyên Property, Contact ứng với Contacts (2.1 vẫn dùng số nhiều); Company, Unit, Agreement không có tài nguyên RESO tương đương và phải ghi rõ là đặc trưng riêng. Đã xem lại sau khi lớp AI đổi: không ảnh hưởng.

Không chọn:

- Bắt đầu trống: Từ vựng đã có sẵn và đã qua nhiều lần chốt, để trống là đánh mất

## Consequences

Tự động: partial. Các việc làm tay còn lại:

- Sửa khi chuyển: LeaseAmountMax dựng trên LeaseAmount, mà RESO định nghĩa là tiền thuê mặt bằng doanh nghiệp đang trả, không phải giá cho thuê của căn; các tên *Min/*Max của tiêu chí tìm là tên suy ra, không phải trường RESO.
- Chốt khi chuyển mô-đun catalog: toà ánh xạ tài nguyên Building mới có ở 2.1; căn cho thuê có dùng PropertyType Residential Lease hay không; ngăn ảnh internal ánh xạ giá trị Permission nào vì RESO không có giá trị Internal.
- Giữ Postgres và lược đồ hiện có. Kho cũ là nơi DUY NHẤT ghi migration và áp lên bản thật cho đến lúc chuyển; kho mới chỉ chép nguyên văn các tệp đã gộp, không tự thêm migration, và không bao giờ áp lên bản thật trước lúc chuyển.
- Chuyển CONTEXT.md, 27 ADR và docs/product/tham-chieu.md sang wiki của kho mới. Lịch sử _acceptance ở lại kho cũ.
