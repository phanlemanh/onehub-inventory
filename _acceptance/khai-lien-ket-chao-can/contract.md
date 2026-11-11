---
schema_version: 1
feature: khai-lien-ket-chao-can
slug: khai-lien-ket-chao-can
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: _acceptance/khai-lien-ket-chao-can/design.md
---

# Acceptance Contract: khai-lien-ket-chao-can

## Context

Hàng dữ liệu mẫu dựng hai loại liên kết — chủ nhà với lần chào, lần chào với căn — bằng kiểu viết tay trong mã, chưa khai trong mô hình nghiệp vụ. Chủ kho chọn mở hợp đồng mới cho việc này ở Cổng Bằng chứng ngày 11/11/2026. Vòng này khai hai liên kết thành hai khái niệm có sàn sở hữu và vai, sinh kiểu từ đó, và cho mã dữ liệu mẫu dùng kiểu sinh ra. Phải xong trước khi có cơ sở dữ liệu thật.

Source input: hàng `1j` của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/khai-lien-ket-chao-can/opportunity.md` (quyết build ngày 11/11/2026), mục Ngoài-2 và Ngoài-7 của hồ sơ `du-lieu-mau`.

Luật sản phẩm chạm: SP-1 (dữ liệu mỗi sàn được cách ly) — vòng này khai sàn sở hữu cho hai bảng liên kết tương lai; không thêm truy vấn nào.

## Criteria

- AC-1: Given mô hình nghiệp vụ, When đọc khai báo và sinh lại kiểu, Then có khái niệm `ListingOwner` với `id`, `companyId` trỏ `Company`, `contactId` trỏ `Contact`, `listingId` trỏ `Listing`, `contactType` chỉ nhận `Seller` hoặc `Landlord`, mọi trường bắt buộc; và `ListingUnit` với `id`, `companyId` trỏ `Company`, `listingId` trỏ `Listing`, `upi` trỏ `Unit`, mọi trường bắt buộc; một trường trỏ nhầm khái niệm bị báo đúng trường và đích.
- AC-2: Given tệp quan hệ, When kiểm, Then có đúng sáu quan hệ mới với cardinality viết trước (Company holds_owner_link ListingOwner one-to-many · Contact owns_through ListingOwner one-to-many · Listing owned_through ListingOwner one-to-many · Company holds_unit_link ListingUnit one-to-many · Listing placed_on ListingUnit one-to-one · Unit offered_through ListingUnit one-to-many), hai quan hệ cũ giữ nguyên, mọi đầu quan hệ là khái niệm có thật, và bộ kiểm mô hình báo 0 lỗi, 0 cảnh báo.
- AC-3: Given mã hai mô-đun lần chào và liên hệ, When kiểm kiểu, Then kiểu liên kết chủ (`OwnerLink`) bằng đúng `ListingOwner` sinh ra và kiểu liên kết căn của mô-đun lần chào bằng đúng `ListingUnit` sinh ra; không tệp nào khai lại hình dạng bằng tay; bản sao mã khai `interface`/`type … = {` cho một trong hai kiểu bị báo đúng tên kiểu.
- AC-4: Given liên kết chủ của sàn mẫu, When kiểm vai, Then mọi liên kết mang vai `Seller` hoặc `Landlord`; bản sao có liên kết mang vai `Buyer` bị báo «vai không hợp lệ trên liên kết chủ: <mã>».
- AC-5: Given sàn mẫu dựng lại sau thay đổi, When tính băm dữ liệu, Then băm bằng đúng giá trị ghim của hàng dữ liệu mẫu (dữ liệu giống từng byte).
- AC-6: Given bảng thuật ngữ, nhãn hiển thị, wiki và bản đồ mô-đun, When chạy bộ kiểm của kho, Then hai khái niệm có dòng thuật ngữ, nhãn khớp tên hiển thị, trang wiki, và một mô-đun sở hữu (`contacts` cho `ListingOwner`, `listings` cho `ListingUnit`), không thêm phụ thuộc giữa mô-đun.
- AC-7: Given sàn mẫu, When kiểm luật dữ liệu của hai liên kết, Then mỗi liên kết chủ cùng sàn với liên hệ và lần chào nó trỏ, mỗi liên kết căn cùng sàn với lần chào, và mỗi lần chào có đúng một liên kết căn; bản sao có liên kết chủ trỏ liên hệ của sàn khác bị báo «liên kết chủ khác sàn với liên hệ: <mã>», bản sao có lần chào hai liên kết căn bị báo «lần chào có 2 căn: <mã>».

## Coverage

Bỏ quét không gian — câu giao của hàng kê đủ: hai liên kết × (sàn sở hữu, vai, kiểu sinh) (sổ quyết định: «bỏ coverage-scan»). Ánh xạ:

- Hai liên kết khai trong mô hình → AC-1, AC-2.
- Sàn sở hữu → AC-1 (`companyId`), AC-7 (cùng sàn với hai đầu).
- Vai trên quan hệ → AC-1 (giá trị cho phép), AC-4 (kiểm trên dữ liệu).
- Mã dùng kiểu sinh → AC-3; dữ liệu mẫu không đổi → AC-5.
- Luật dữ liệu của liên kết (cùng sàn, một lần chào một căn) → AC-7.
- Khái niệm mới đầy đủ ở thuật ngữ, wiki, bản đồ mô-đun → AC-6.

## Đường đo

Ô cơ hội chưa khai ngưỡng (bỏ trống), nên không có thước giá trị. Phép đo máy: bộ kiểm mô hình và wiki 0 lỗi 0 cảnh báo (AC-2, AC-6), băm ghim dữ liệu mẫu không đổi (AC-5), số liên kết khác sàn bằng 0 (AC-7).

## Out of scope

- Migration, bảng thật và cách ly theo dòng cho hai liên kết — hàng `7` và `21`.
- Liên kết người mua, người thuê với lần chào.
- Gom luật nhãn MAU về một chỗ — hạn chế đã biết của hàng dữ liệu mẫu.
- Màn hình nào cũng không đổi.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Tên `ListingOwner` là riêng của ta; RESO `ContactListings` mang nghĩa khác (Hỏi-2 ở Cổng Phạm vi).

- Đổi ontology: hai thực thể mới, quan hệ mới, nhãn và dòng thuật ngữ mới; mô tả PR có mục «Đổi ontology — chủ kho soi».
