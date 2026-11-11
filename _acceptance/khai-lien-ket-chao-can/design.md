# Thiết kế: khai-lien-ket-chao-can — hai liên kết vào mô hình nghiệp vụ

Ngày: 2026-11-11 · Hàng lộ trình `1j` · Hạng T3 (chạm `ontology/**`) · Dãy D của đợt «nen»

## Mục tiêu

Hàng `1` (dữ liệu mẫu) dựng hai loại liên kết bằng kiểu viết tay trong mã: chủ nhà ↔ lần chào (`OwnerLink` trong
`contacts`) và lần chào ↔ căn (`ListingUnit` trong `listings`). Ở Cổng Bằng chứng của hàng `1`, chủ kho chọn «mở hợp
đồng mới» cho việc khai chúng vào mô hình nghiệp vụ (Ngoài-2, Ngoài-7). Phải xong trước khi có cơ sở dữ liệu thật: bảng
liên kết là bảng của sàn, cần `company_id` và cách ly theo dòng (SP-1), nên hình dạng phải có trong nguồn sự thật để
sinh kiểu và migration sau này.

## Vì sao là hai khái niệm, không phải thuộc tính trên quan hệ

`ontology/relations.yaml` chỉ khai `{from, name, to, cardinality}`; trình sinh mã không đọc thuộc tính trên quan hệ. Câu
giao đòi «kèm sàn sở hữu và vai trên quan hệ», nên mỗi liên kết thành một khái niệm có thuộc tính riêng — cũng là cách RESO
khai liên kết nhiều-nhiều thành tài nguyên riêng.

## Hai khái niệm

| Khái niệm | Thuộc tính | Nguồn tên |
|---|---|---|
| `ListingOwner` — một liên hệ gắn với một lần chào, theo một vai, trong một sàn | `id` · `companyId` (sàn sở hữu) · `contactId` · `listingId` · `contactType` (vai: `Seller`, `Landlord`) | riêng của ta — RESO `ContactListings` là danh sách lần chào gửi cho một liên hệ xem (phía mua), nghĩa khác (Hỏi-2) |
| `ListingUnit` — một lần chào trỏ tới căn của danh mục dùng chung mà nó chào, trong một sàn | `id` · `companyId` · `listingId` · `upi` | riêng của ta (danh mục dùng chung không có tài nguyên RESO) |

- Vai trên liên kết chỉ nhận hai giá trị bên bán: `Seller` (chủ bán) và `Landlord` (chủ cho thuê). Người mua, người thuê
  không phải chủ của lần chào; họ gắn với lần chào ở hàng khác (lead, phiếu gửi), không qua khái niệm này.
- Luật trên dữ liệu: liên hệ, lần chào và liên kết cùng một sàn; mỗi lần chào đúng một `ListingUnit`.
- Quan hệ: giữ nguyên hai quan hệ cũ (`Contact owns Listing`, `Unit offered_as Listing`) — giám sát chỉ cho thêm dòng —
  và thêm sáu quan hệ nối khái niệm mới với `Company`, `Contact`, `Listing`, `Unit`; mô tả của quan hệ mới nói chúng hiện
  thực hai quan hệ cũ.
- Bản đồ mô-đun: thêm khái niệm vào danh sách `owns` sẵn có của `contacts` và `listings` (giám sát duyệt ở tin D-1111-3);
  không thêm `depends_on`.
- Bảng thuật ngữ, nhãn hiển thị («Chủ của hàng», «Căn của hàng»), trang wiki mỗi khái niệm, chủ sở hữu trong bản đồ
  mô-đun (`contacts` sở hữu `ListingOwner`, `listings` sở hữu `ListingUnit`, không thêm phụ thuộc).

## Mã

- `contacts`: bỏ `interface OwnerLink` viết tay, dùng `ListingOwner` sinh từ ontology (giữ tên `OwnerLink` làm bí danh
  kiểu để bên gọi không đổi). Thêm kiểm vai: liên kết mang vai ngoài `Seller`, `Landlord` bị báo «vai không hợp lệ trên
  liên kết chủ: <mã>».
- `listings`: bỏ `interface ListingUnit` viết tay, dùng `ListingUnit` sinh ra.
- Dữ liệu mẫu không đổi một byte: băm ghim của hàng `1` giữ nguyên.
- Bài kiểm mới `tests/link-types.test.ts`: kiểu sinh khớp dữ liệu mẫu, mã hai mô-đun không còn khai lại kiểu, kiểm vai đỏ
  được.

## Câu hỏi cho Cổng Phạm vi

- Hỏi-1 — vai trên liên kết chủ: chỉ `Seller`, `Landlord` (khuyến nghị) hay cả bốn vai.
- Hỏi-2 — tên khái niệm chủ ↔ lần chào. Giám sát gợi ý theo RESO `ContactListings`; nhưng trong RESO DD 2.1
  (https://dd.reso.org/DD2.1/) tài nguyên ấy là danh sách lần chào môi giới gửi cho một liên hệ xem nhà (có cờ ưa thích,
  đã xem) — phía mua, nghĩa khác. AGENTS.md cấm dùng lại tên RESO cho nghĩa khác. Khuyến nghị: tên riêng `ListingOwner`
  («Chủ của hàng»), ghi «riêng của ta» trong bảng thuật ngữ, để dành `ContactListing` cho hàng gửi lần chào sau này.

## Ngoài phạm vi

- Migration và bảng thật (hàng `7`, `21`).
- Liên kết người mua, người thuê với lần chào.
- Gom luật nhãn MAU về một chỗ (hạn chế đã biết của hàng `1`).

## Đặc tả UX

Bỏ — hàng không dựng màn nào.
