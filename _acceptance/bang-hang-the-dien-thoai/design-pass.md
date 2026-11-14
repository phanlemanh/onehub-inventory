---
slug: bang-hang-the-dien-thoai
at: 2026-11-14T14:45:00Z
route: http://localhost:3491/inventory (?the=a|b, ?loc=hang|ngan, ?the=bang cho bảng hôm nay — chỉ bản bấm được)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/bang-hang-the-dien-thoai/cong-pham-vi.html (trình lại: Hỏi-1 Ô | Gọn, Hỏi-2 Nút | Hàng ô, ở 360) · ảnh ở cong/v2-* · khối gốc ở evidence/reui/
divergence: opened
ds_skill: inventory-ui
states: [hom-nay, a, b, loc-hang, loc-nut, loc-ngan-mo, ho-so-tu-the, nguong-768]
breakpoints: [mobile-360, mobile-414, tablet-768]
themes: [light]
patched: 3
deferred: 1
---
# design-pass — bang-hang-the-dien-thoai

Bản bấm được dựng thẳng trên Bảng hàng thật trong App Shell thật, máy dev dãy V cổng 3491. Mã bản bấm được CHƯA commit
(vùng Lưới dùng chung đang chờ 7e và 2d; phần dựng bắt đầu sau khi 7e gộp). Ảnh chụp bằng Playwright trên Postgres dãy V
(5570), người thử đăng nhập qua màn đăng nhập thật của [Sàn thử phiên]; nút tròn «N» của công cụ dựng ẩn; cùng 60 căn
mẫu cho mọi lối. Ảnh khối gốc ReUI chụp ở 360 từ trang xem trước công khai trước khi dựng.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| hom-nay | 360, 414 | light | cong/hom-nay-360-sang.png, cong/hom-nay-414-sang.png |
| a | 360, 414 | light | cong/a-360-sang.png, cong/a-414-sang.png |
| b | 360, 414 | light | cong/b-360-sang.png, cong/b-414-sang.png |
| loc-hang | 360 | light | cong/loc-hang-360-sang.png |
| loc-nut, loc-ngan-mo | 360 | light | cong/loc-nut-360-sang.png, cong/loc-ngan-mo-360-sang.png |
| ho-so-tu-the | 360 | light | cong/ho-so-tu-the-360-sang.png |
| nguong-768 | 768 | light | cong/nguong-768-sang.png |

## Findings

- Đã vá: vùng dùng nút «Cột» cần ngữ cảnh của lưới → danh sách thẻ nằm trong cùng ngữ cảnh; nút «Cột» ẩn dưới 768.
- Đã vá: thẻ không có dấu để hồ sơ trả tiêu điểm → nút thẻ mang dấu mở hồ sơ; đã thử: cuộn 1500 px, mở, lùi → vẫn 1500 px,
  tiêu điểm ở thẻ.
- Đã vá: lối B không nhóm thì mỗi thẻ một khung → một khung chia vạch cho cả danh sách.
- Để sau: ảnh tối và các trạng thái tải, trống, lỗi trên thẻ — chụp sau khi chủ kho chọn lối (luật mười điểm, điểm 4).

## Trình lại (2026-11-14, sau bốn ý của chủ kho)

| state | breakpoint | theme | file |
|---|---|---|---|
| v2-o, v2-g, v2-khong-anh | 360, 414 | light | cong/v2-o-*.png, cong/v2-g-*.png, cong/v2-khong-anh-*.png |
| v2-loc-nut, v2-loc-ngan, v2-loc-hang | 360 | light | cong/v2-loc-*.png |
| v2-them, v2-nhom, v2-cuon, v2-ho-so | 360 | light | cong/v2-them-360-sang.png, cong/v2-nhom-360-sang.png, cong/v2-cuon-360-sang.png, cong/v2-ho-so-360-sang.png |
| v2-nguong | 768 | light | cong/v2-nguong-768-sang.png |

Đếm căn trọn màn đầu (máy đo): 360 — 7 (Ô, Gọn, chưa ảnh), 6 khi đang lọc; 414 — 8. Đã vá: hàng ô lọc (lối Hàng ô) dính
sát mép trái vì cuộn bắt điểm → thêm lề cuộn. Thẻ danh sách chuyển vào `ListingCard` (luật đồng nhất màn của giám sát).
