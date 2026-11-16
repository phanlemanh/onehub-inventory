# 5 · Sửa sau chữ ký

Chủ kho ký Cổng Bằng chứng của hàng 5; hàng đã gộp vào nhánh chính (PR #69, `ebbbe77`). Khi hàng 19 (Thuế phí, PR #64)
gộp nhánh chính sau chữ ký của mình, cột «Về tay» của hàng 19 đứng ngay sau Giá chào. Làn ghim lại của hàng 19 đỏ hai ca
dán của hàng này ở khổ 1440. Giám sát cho cách sửa (G-1611-21, G-1611-22).

## Gốc

Khối dán phủ các cột đang hiện theo thứ tự, nên ô sau Giá chào nay rơi vào Về tay chứ không vào Diện tích. Luật dán đã có
chỗ cho cột máy tính (`computed` của `planPaste`), nhưng chỗ gọi chưa truyền cột nào. Vì thế ô rơi vào Về tay bị bỏ qua
với lý do sai, «cột riêng của sàn chưa sửa được trên bảng». Không ô nào bị ghi nhầm.

## Đã đổi, giám sát cho

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| Chỗ gọi luật dán truyền cột Về tay làm cột máy tính (`src/modules/listings/ui/use-listing-cell-edit.tsx`) | Có: ô dán rơi vào Về tay nay ghi lý do «cột máy tính từ các cột khác — không dán được». Ngoài ra không đổi | G-1611-22 |
| Hai ca «dòng ngắn» (`dong-ngan-khong-chu-la`, `dong-ngan-cot-an`, `tests/e2e/dan-tu-excel.spec.ts`) ẩn cột Về tay trước khi dán, giữ nguyên ý của ca | Không | G-1611-21 |
| Ca mới `khoi-qua-cot-ve-tay`: giữ Về tay hiện, dán khối ba cột lên Trạng thái · Giá chào · Về tay. Bản xem trước nêu ô thứ ba bị bỏ, đúng câu lý do lấy từ tệp chữ; không ô nào bị ghi sang cột sau | Không | G-1611-21 |

Chứng ngược: bỏ dòng truyền cột tính thì ca mới đỏ ở «ô rơi vào Về tay không nói lý do». Có dòng ấy thì 19/19 ca của
`tests/e2e/dan-tu-excel.spec.ts` xanh ở 1440.
