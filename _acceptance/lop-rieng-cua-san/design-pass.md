---
slug: lop-rieng-cua-san
at: 2026-11-13T10:29:21Z
route: http://127.0.0.1:3496/proto/lop-rieng-cua-san
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/lop-rieng-cua-san/evidence/reui/ (ba khối ReUI) và design-pass/*.png (bản mẫu trên dữ liệu mẫu, ba dáng A, B, C)
divergence: opened
ds_skill: inventory-ui
states: [bang-hang, bang-hang-cuon-phai, a-truong, a-can-cho, a-rong, a-loi, a-khong-quyen, a-doc, b, c]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 0
deferred: 0
---
# design-pass — lop-rieng-cua-san

Bản bấm được ở `/proto/lop-rieng-cua-san` trong App Shell thật, dữ liệu mẫu 60 căn, dựng bằng thành phần thật: `DataRegion`,
`RowActions` qua khuôn nút 9e (`SessionRoles`, `PermittedAction`), `PageHeader`, `Frame`, `Button`. Thao tác của
màn dùng tạm `manageCompanyCodes` (cùng ba vai của Hỏi-1) vì `manageCompanyLayer` chưa có trong bảng quyền. Dáng A
dựng danh sách năm phần cạnh vùng ngay trong trang; bản dựng thật đặt nó vào cột thứ hai của App Shell như góc nhìn 2c.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| a-can-cho | 1440 | light | design-pass/a-can-cho-1440-sang.png |
| a-can-cho | 1440 | dark | design-pass/a-can-cho-1440-toi.png |
| a-doc | 1440 | light | design-pass/a-doc-1440-sang.png |
| a-khong-quyen | 1440 | light | design-pass/a-khong-quyen-1440-sang.png |
| a-loi | 1440 | light | design-pass/a-loi-1440-sang.png |
| a-rong | 1440 | light | design-pass/a-rong-1440-sang.png |
| a-rong | 1440 | dark | design-pass/a-rong-1440-toi.png |
| a-truong | 1024 | light | design-pass/a-truong-1024-sang.png |
| a-truong | 1024 | dark | design-pass/a-truong-1024-toi.png |
| a-truong | 1440 | light | design-pass/a-truong-1440-sang.png |
| a-truong | 1440 | dark | design-pass/a-truong-1440-toi.png |
| a-truong | 360 | light | design-pass/a-truong-360-sang.png |
| a-truong | 360 | dark | design-pass/a-truong-360-toi.png |
| a-truong | 414 | light | design-pass/a-truong-414-sang.png |
| a-truong | 414 | dark | design-pass/a-truong-414-toi.png |
| b | 1440 | light | design-pass/b-1440-sang.png |
| b | 1440 | dark | design-pass/b-1440-toi.png |
| b | 360 | light | design-pass/b-360-sang.png |
| bang-hang | 1024 | light | design-pass/bang-hang-1024-sang.png |
| bang-hang | 1024 | dark | design-pass/bang-hang-1024-toi.png |
| bang-hang | 1440 | light | design-pass/bang-hang-1440-sang.png |
| bang-hang | 1440 | dark | design-pass/bang-hang-1440-toi.png |
| bang-hang | 360 | light | design-pass/bang-hang-360-sang.png |
| bang-hang | 360 | dark | design-pass/bang-hang-360-toi.png |
| bang-hang | 414 | light | design-pass/bang-hang-414-sang.png |
| bang-hang | 414 | dark | design-pass/bang-hang-414-toi.png |
| bang-hang-cuon-phai | 1440 | light | design-pass/bang-hang-cuon-phai-1440-sang.png |
| bang-hang-cuon-phai | 1440 | dark | design-pass/bang-hang-cuon-phai-1440-toi.png |
| bang-hang-cuon-phai | 360 | light | design-pass/bang-hang-cuon-phai-360-sang.png |
| bang-hang-cuon-phai | 360 | dark | design-pass/bang-hang-cuon-phai-360-toi.png |
| c | 1440 | light | design-pass/c-1440-sang.png |
| c | 1440 | dark | design-pass/c-1440-toi.png |
| c | 360 | light | design-pass/c-360-sang.png |

## Findings

- Cột trường riêng nằm sau tám cột chuẩn nên ở 1440 phải cuộn ngang mới thấy (ảnh bang-hang-cuon-phai); đúng thứ tự đã
  hứa, người ẩn bớt cột chuẩn nếu muốn thấy ngay.
- Dáng B: mỗi vùng Lưới cao bằng màn hình nên năm phần xếp dọc thành trang rất dài — chỉ thấy một phần mỗi lần.
- Dáng A ở điện thoại: năm phần thành hàng cuộn ngang trên đầu vùng; bản thật dùng ngăn trượt của App Shell.
- Dáng C: thẻ tab chưa có trong kho (`src/components/ui` không có Tabs) — chọn C là thêm một thành phần.
