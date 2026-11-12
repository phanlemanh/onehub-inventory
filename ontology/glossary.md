# Glossary — onehub-inventory

One line per business term. If two people could understand a word differently,
it belongs here. Code, docs and agents must use these exact names.

Reference standard: [RESO Data Dictionary 2.1](https://dd.reso.org/DD2.1/). Field and value names follow it where it
defines the concept; anything else is marked as our own. Every display label and its variants: `labels.yaml`.

| Term (code name)  | Definition                                                                                                      | Not to be confused with                                                           | Display name |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------ |
| `Company`         | Công ty môi giới dùng sản phẩm, đơn vị cách ly dữ liệu. Riêng của ta; RESO không có.                            | RESO `Office` (danh sách văn phòng của MLS)                                       | Sàn          |
| `Unit`            | Vật thể trong danh mục dùng chung, thuộc khu → toà → trục. Riêng của ta; trường theo RESO `Property`.           | `Listing` (một lần chào trên căn)                                                 | Căn          |
| `Listing`         | Một lần chào bán hay cho thuê của sàn trên một căn. RESO `Property`.                                            | «Tin» của Invest; «Quỹ hàng» là tên ứng dụng                                      | Hàng         |
| `Contact`         | Một người làm việc với sàn, mang một hay nhiều loại liên hệ. RESO `Contacts`.                                   | Bản ghi riêng cho chủ nhà hay khách; «Lead» là dấu trên một liên hệ               | Liên hệ      |
| `Agreement`       | Cho phép một loại kết nối chảy theo một chiều, cho các lớp dữ liệu, trong một thời hạn. Riêng của ta.           | RESO `ListingAgreement` (loại hợp đồng niêm yết); «Tích hợp»                      | Thoả thuận   |
| `ListingOwner`    | Một liên hệ là chủ của một lần chào, theo vai bên bán hay bên cho thuê, trong một sàn. Riêng của ta.            | RESO `ContactListings` (lần chào gửi cho người mua xem); `Contact`                | Chủ của hàng |
| `ListingUnit`     | Liên kết một lần chào với căn trong danh mục dùng chung mà nó chào, trong một sàn. Riêng của ta.                | `Unit` (vật thể trong danh mục); `Listing` (lần chào)                             | Căn của hàng |
| `Member`          | Một người làm việc trong một sàn, với các vai sàn giao và tên sàn đặt cho người ấy. RESO `Member`.              | Tài khoản đăng nhập (một tài khoản có thể là thành viên của nhiều sàn); `Contact` | Thành viên   |
| `LastConfirmedAt` | Lúc sàn xác nhận lần cuối rằng một lần chào còn đúng (giá, trạng thái). Riêng của ta; RESO không có trường này. | RESO `ModificationTimestamp` (lúc bản ghi đổi bất kỳ trường nào)                  | Xác nhận lúc |
| `Action`          | Một việc đọc hay ghi có tên trong bảng quyền (`ontology/actions.yaml`), mỗi vai một ô phạm vi. Riêng của ta.    | Lệnh của API hay hàm cơ sở dữ liệu (đó là cửa của thao tác); «chức năng» của màn  | Thao tác     |
| `Scope`           | Ô của một vai với một thao tác: Toàn sàn (`company`), Của tôi (`own`), hay không được. Riêng của ta.            | Sàn của phiên (`Company`); vai (`ListAgent`…); trạng thái bản ghi                 | Phạm vi      |

<!-- Add your terms above. Keep definitions to one sentence. -->
