---
slug: thanh-vien-chon-tu-reui
context: standalone
reaction: nac-0
at: 2026-11-14T13:50:00Z
---

# Design pass · 9c Thành viên chọn từ ReUI

Bản bấm được: màn Thành viên thật trong App Shell, đăng nhập Quản trị sàn của một sàn mẫu chín người trên Postgres dãy C;
công tắc bản dev `/members?lo=list` (lối B) và `/members?lo=grid` (lối A). Ảnh chụp bằng
`tests/e2e-db/thanh-vien-lo.spec.ts` (tạm, gỡ trước lượt chấm); trang cổng `cong-pham-vi.html` dựng bằng
`evidence/design-pass/dung-trang-cong.py`.

## Ma trận chụp

| Ảnh | Khổ | Nền | Vai | Nội dung |
| --- | --- | --- | --- | --- |
| `anh/lo-b-users8.png` | 1440 | sáng | Quản trị sàn | Lối B, danh sách |
| `anh/lo-a-luoi.png` | 1440 | sáng | Quản trị sàn | Lối A, danh sách |
| `anh/hop-moi.png` | 1440 | sáng | Quản trị sàn | Hộp mời theo dialog-2, đã gõ email và tên |
| `anh/truoc.png` | 1440 | sáng | Quản trị sàn | Màn hôm nay |
| `anh/goc-luoi.png` | 1440 | sáng | Quản trị sàn | Khuôn Lưới đang chạy ở Bảng hàng |
| `anh/goc-users8.png`, `goc-users8-moi.png`, `goc-dialog2.png` | 1440 | sáng | — | Khối gốc ở trang xem trước ReUI, chụp trước khi dựng |

Ảnh tối, điện thoại, các trạng thái: để sau khi chủ kho chọn lối (điểm 4 của luật trình nhiều lối).

## Phát hiện

- Dòng của lối B lúc đầu cao gần gấp đôi khối gốc (khoảng cách nhóm và đường kẻ của thành phần cộng dồn); đã đổi sang danh
  sách thường kẻ dòng, thành phần dòng giữ nguyên — dòng cao như khối.
- Chữ cái đầu lấy cả chữ giữ chỗ «[Tên]» thành «T1», «T3»; đã bỏ phần trong ngoặc vuông.
- Lối A: cột Email và Vai cắt chữ ở 1440 vì bộ máy bảng tính chia bề rộng theo loại cột — ghi vào được–mất của A.
- Tự soi cạnh nhau: hai lối khác nhau ở toàn bộ vùng danh sách (bảng tính có hàng lọc, cột số dòng · khung với chữ cái
  đầu và nút trên dòng); cùng sàn, cùng vai, cùng khổ, cùng nền.
