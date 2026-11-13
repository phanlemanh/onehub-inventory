---
slug: luu-goc-nhin-cot-hai
at: 2026-11-12T14:40:00Z
route: http://localhost:3481/proto/luu-goc-nhin
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: figures/proto/L1-*, L2-*, chung-ca-san-*, muc-menu-*, hop-* (ứng viên ReUI ghép từ thành phần của kho, cột thứ hai của App Shell thật)
divergence: opened
ds_skill: inventory-ui
states: [goc-nhin-dang-mo, menu-muc, hop-luu, hop-doi-ten, hop-xoa, menu-goc-nhin-S3]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 5
deferred: 1
---
# design-pass — luu-goc-nhin-cot-hai

Bản bấm được là trang mẫu `/proto/luu-goc-nhin` trong App Shell thật (chỉ bản dev, dữ liệu mẫu của Bảng hàng). Danh sách
góc nhìn được vẽ vào chính cột thứ hai của App Shell (máy tính) và vào cột trong ngăn trượt (điện thoại). Địa chỉ chọn ứng
viên: `?ds=l1|l2` (danh sách), `?luu=s1|s2|s3` (cách lưu), `?chung=rieng|ca-san` (của ai); `?mo=<góc nhìn>` mở một góc
nhìn, `?hop=luu|doi-ten|xoa` mở sẵn hộp để chụp. Góc nhìn giữ trong trang (tải lại là mất), lọc chạy thật trên lưới dùng
chung; sắp xếp, nhóm, cột nối ở bước dựng. Dãy K chạy ở cổng 3481.

## Ma trận capture

Mỗi ảnh có ở 1440, 1024, 414, 360 × sáng, tối (`<ảnh>-<khổ>-<chủ đề>.png` trong `figures/proto/`), trừ L1-S2, L2-S1 và
chung-ca-san chỉ ở 1440 và 1024 (ở điện thoại danh sách nằm trong ngăn trượt, giống L1).

| ảnh | nội dung |
|---|---|
| L1-S1 | figures/proto/L1-S1-1440-light.png |
| L2-S1 | figures/proto/L2-S1-1440-light.png |
| L1-S2 | figures/proto/L1-S2-1440-light.png |
| L1-S3-menu | figures/proto/L1-S3-menu-1440-light.png |
| chung-ca-san | figures/proto/chung-ca-san-1440-light.png |
| muc-menu | figures/proto/muc-menu-1440-light.png |
| hop-luu | figures/proto/hop-luu-1440-light.png |
| hop-doi-ten | figures/proto/hop-doi-ten-1440-light.png |
| hop-xoa | figures/proto/hop-xoa-1440-light.png |

## Findings

| # | Thấy gì | Xử lý |
|---|---|---|
| 1 | Lọc toà theo mảng giá trị không lọc gì (cột toà lọc theo chữ) | patched: góc nhìn mẫu lọc toà bằng chữ |
| 2 | Ở điện thoại danh sách bị vẽ hai lần trong ngăn trượt | patched: bỏ chỗ chèn trùng |
| 3 | Tên góc nhìn bị cắt sớm khi có số đếm | patched: số nhường chỗ cho «…» khi rê, dùng thành phần chuẩn của cột |
| 4 | Bộ kiểm giao diện của kho chặn tự sửa kiểu thành phần và nút tự dựng | patched: mục góc nhìn dùng cách ghép chuẩn (mục có «…» và số sẵn), địa chỉ quyết mục đang mở |
| 5 | Nhóm góc nhìn không thụt lề như các mục trạng thái (thành phần khác) | patched: chủ kho chọn cả cột một kiểu; góc nhìn dùng mục con của App Shell, «…» và số qua lớp bọc ngoài; ở mục đang mở số nhường chỗ cho «…» |
| 6 | Hộp xác nhận xoá ở điện thoại xếp nút xoá trên «Thôi» | deferred: dùng đúng hộp xác nhận của khuôn 9e khi dựng |

## Nấc

Ngữ cảnh: host-embedded — trang mẫu nằm trong App Shell thật, cột thứ hai thật. Phản ứng: nac-1 — máy dựng, tự chụp, gửi ảnh
kèm thẻ Cổng Phạm vi; chủ kho chọn trên ảnh và bản bấm được.
