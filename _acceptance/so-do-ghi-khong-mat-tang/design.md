# Thiết kế: số đo ghi không mất tầng (hàng 1l)

## Vấn đề

Lệnh `ghi` của `tools/round_metrics/round_metrics.py` đọc bản số đo cũ (`_acceptance/<slug>/so-do-vong.json`) để giữ các tầng
người đã khai cho từng lượt `REJECT`. Khi bản cũ không phải JSON hay sai hình dạng, lệnh nuốt lỗi, coi như chưa khai gì, rồi
ghi đè bản cũ: tầng đã khai mất mà không ai hay. Khi bản cũ không đọc được (ví dụ chỗ đó là một thư mục), lệnh đổ lỗi Python
dài thay vì một câu rõ. Nguồn: mục Ngoài-3 và Ngoài-14 của hồ sơ `so-do-moi-vong`; chủ kho chọn mở hợp đồng mới và quyết Cổng
Đáng «build» ngày 11/11/2026.

## Cách làm

Một hàm đọc bản cũ, gọi trước mọi lần ghi:

- tệp vắng → không có tầng cũ, đi như hôm nay;
- tệp có mà đọc không được (lỗi hệ điều hành) → dừng, «khong doc duoc»;
- đọc được mà không phải JSON (kể cả tệp rỗng, byte không phải UTF-8) → dừng, «khong phai JSON»;
- JSON mà sai hình dạng → dừng, một dòng «sai hinh dang: <chỗ>». Chín dạng, mỗi dạng một nhãn chỗ:
  `goc` gốc không phải đối tượng · `thieu luot` gốc thiếu `luot` · `luot` không phải mảng · `muc` một mục không phải đối
  tượng · `thieu vong` mục thiếu `vong` · `vong` không phải số nguyên · `thieu tang` mục thiếu `tang` · `tang` không phải mảng
  chuỗi · `tang la: <tên>` có tên ngoài 11 tầng. Khoá vắng không bao giờ lấy mặc định.

Dừng là mã thoát 1 (mã lệnh đã dùng cho mọi đầu vào sai), không ghi tệp nào, và thông điệp gọi tên tệp, dạng hỏng, rồi hai
đường gỡ: khôi phục bản cũ từ lịch sử git, hoặc xoá tệp để dựng lại từ sổ chạy rồi khai lại tầng bằng `--phan`. Lệnh dừng cả
khi `--phan` đã khai đủ mọi lượt: bản hỏng không bao giờ bị ghi đè.

Không thêm cờ ghi đè — câu hỏi cho chủ kho ở Cổng Phạm vi, máy khuyên không thêm (sổ quyết định dòng 11, thay dòng 4). Lệnh `gop` bỏ qua bản hỏng vẫn là giới hạn đã biết của hàng 1h (dòng 6).

## Ma trận phủ

| Trạng thái bản cũ | `ghi` không `--phan` | `ghi --phan r1=bo-cuc` |
|---|---|---|
| vắng | ghi, như cũ | ghi, như cũ |
| hợp lệ (có tầng, hay `luot` rỗng) | ghi, giữ tầng cũ | ghi, `--phan` thắng |
| không đọc được | dừng | dừng |
| không phải JSON (rác, rỗng) | dừng | dừng |
| sai hình dạng (9 dạng) | dừng | dừng |

## Luật sản phẩm

Không chạm SP-1, SP-3, SP-4: lệnh là công cụ đo nội bộ của kho, không chạm dữ liệu sàn, việc gửi, hay trang khách.
