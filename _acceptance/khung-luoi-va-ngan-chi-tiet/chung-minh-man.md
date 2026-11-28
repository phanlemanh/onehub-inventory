# Chứng minh màn — khung-luoi-va-ngan-chi-tiet

Hợp đồng không khai màn sản phẩm (`screens: []`): vòng này đổi khung dùng chung của họ Lưới (ngăn chi tiết, thanh công
cụ, hàng công cụ điện thoại, tiêu đề cột) và cột thứ hai của App Shell, không dựng màn nào. Tệp này giữ bảng Khối cho tệp
thành phần mới của vòng (quyết định 0023, hàng 1q). Ứng viên ReUI đọc bằng `node tools/reui_catalog/tra.mjs` trên danh
mục ghim ngày 2026-11-11 và MCP ReUI ngày 27/11/2026.

## Màn khung-luoi

### Khối

| Khối        | Bậc       | Đã tra                                                                 | Ứng viên gần nhất                  | Vì sao không dùng                                                                                                                                | Cách                                                                                       |
| ----------- | --------- | ---------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| RecordPanel | trong-kho |                                                                        |                                    |                                                                                                                                                  |                                                                                            |
| PhoneList   | trong-kho |                                                                        |                                    |                                                                                                                                                  |                                                                                            |
| CornerClose | ve-tay    | `tools/reui_catalog` «dialog close button» (ví dụ và khối)             | c-dialog-5, c-sheet-2, c-dialog-4  | c-dialog-5 đổi × thành chip tròn viền nổi ra ngoài góc — đổi dáng mà chủ kho không bảo; c-sheet-2, c-dialog-4 chỉ bỏ ×, không có nút đóng ở góc | tắt × của bộ kit (`showCloseButton={false}`) và đặt lại đúng nút ấy, cùng chỗ, chữ «Đóng» |
