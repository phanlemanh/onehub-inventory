---
slug: bang-hang-theo-dia-ly
at: 2026-11-14T12:40:00Z
route: http://localhost:3481/inventory?loi=a|b|c (dev dãy K trên Postgres dãy K, Đầu chủ đã đăng nhập của [Sàn mẫu Ocean]; b là lối đã loại)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/bang-hang-theo-dia-ly/cong-pham-vi.html (trang cổng, ba lối so ngang) · ảnh ở figures/proto/ · khối gốc ở evidence/reui/
divergence: opened
ds_skill: inventory-ui
states: [phan-khu, nhieu-toa, dien-thoai, toa]
breakpoints: [mobile-390, desktop-1440]
themes: [light]
patched: 5
deferred: 0
---
# design-pass — bang-hang-theo-dia-ly

Bản bấm được dựng thẳng trên Bảng hàng thật trong App Shell thật: cây nằm ở cột thứ hai, dưới «Theo trạng thái», trên «Góc
nhìn của tôi». `?loi=a|b|c` đổi cách vẽ cây; `?nhieu=1` thêm toà [MAU] để thấy cây khi sàn rất nhiều toà (chỉ bản mẫu).
Bấm một nơi lọc bảng thật (ô lọc Dự án, Toà hiện tên); số trên nút là số dòng thật của dữ liệu mẫu.

- Khối gốc chụp TRƯỚC khi dựng: `evidence/reui/reui-tree-goc-1440.png` (c-tree-1, c-tree-2), `reui-c-tree-7-goc-1440.png`,
  `shadcn-sidebar-11-goc-1440.png`. A và C là mã khối ReUI thật (cài `@reui/tree` bằng CLI qua giấy phép của kho — máy chủ
  ReUI của công cụ lỗi đăng nhập nhưng đường registry chạy).
- Ảnh chụp bằng Playwright, 1440×900 nền sáng, cùng vai, cùng dữ liệu, cùng nơi đang mở (phân khu The Sapphire 1, 36/60
  dòng); nút tròn «N» của công cụ dựng ẩn.

## Findings (đã sửa trong design-pass)

1. Ba tên dự án cùng cắt thành «Vinhomes Ocean …» ở cột 14 rem — không phân biệt được. Sửa: tên nơi xuống dòng.
2. Chữ trong cây A, C canh giữa (nút mặc định của khối). Sửa: canh trái.
3. Lint của kho cấm nắn mục gốc thanh bên và lớp tự chế: B dựng đúng luật cắt tên còn «S..» → loại B; A bỏ kẻ thụt lề của c-tree-2, thành dáng c-tree-1.
4. Bản đầu của A mở hết nhánh — với rất nhiều toà thì dài như B, C. Sửa: A chỉ mở nhánh đang chọn (điểm riêng của A).
5. Bản đầu chọn một toà (9 dòng) để trống nửa bảng. Sửa: ảnh chính chọn phân khu (36 dòng).

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| phan-khu | 1440 | light | figures/proto/a-phan-khu-1440-sang.png · b-… · c-… |
| nhieu-toa | 1440 | light | figures/proto/a-nhieu-toa-1440-sang.png · b-… · c-… |
| dien-thoai | 390 | light | figures/proto/a-dien-thoai-390-sang.png · b-… · c-… |
