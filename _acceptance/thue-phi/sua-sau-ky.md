# 19 · Sửa sau chữ ký

Chủ kho ký Cổng Bằng chứng của hàng 19 ngày 16/11/2026 (`bb54edb`). Sau đó nhánh gộp nhánh chính `ebbbe77` (hàng 2d, 5
và VP4) trước lượt gộp của mình. Giám sát cho các thay đổi dưới đây (G-1611-14, G-1611-21, G-1611-22).

## Đã đổi, giám sát cho

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| Nối cột tính vào luật dán: chỗ gọi luật dán của hàng 5 truyền cột Về tay làm cột máy tính (`src/modules/listings/ui/use-listing-cell-edit.tsx`) | Có: dán một khối phủ lên Về tay thì bản xem trước nói ô ấy là cột máy tính, không dán được. Về tay vẫn không bao giờ bị ghi | G-1611-22 |
| Bài trình duyệt của Thuế phí (`tests/e2e-db/thue-phi.spec.ts`) chờ vùng dữ liệu nhận trang (luật VP4) trước khi đếm dòng hay thẻ | Không | G-1611-14 |
| Chú thích của luật dán hàng 5 (`src/modules/listings/ui/listing-paste.ts`) gọi Về tay bằng tên tiếng Anh, vì nhãn nay nằm trong bảng nhãn | Không | N-1611-3 |
| Bài của hàng khác đã đổi: ba ca dán của hàng 5, ghi ở `_acceptance/dan-tu-excel/sua-sau-ky.md` | Không | G-1611-21 |
