---
slug: loi-vao-ho-so
at: 2026-11-12T23:22:29Z
route: http://127.0.0.1:3491/proto/loi-vao-ho-so
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/loi-vao-ho-so/design-pass/ung-vien/ (ảnh ba khối ReUI) và design-pass/*.png (bản đề xuất trên dữ liệu mẫu)
divergence: opened
ds_skill: inventory-ui
states: [ngan, go-ma, mot, nhieu, khong, cu]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 4
deferred: 0
---
# design-pass — loi-vao-ho-so

Bản bấm được ở `/proto/loi-vao-ho-so` trong App Shell thật, dữ liệu mẫu (lần chào đầu: 0905 · S1.01), dựng bằng thành
phần thật của kho: thân `ListingRecordBody` của hàng 3, `PageHeader`, `Frame`, `Dialog`, `InputGroup`, `Empty`. Cảnh
«ngan» chép đầu hồ sơ của hàng 3 vì khe nút của hàng 9e chưa ở nhánh chính. Cảnh «nhieu» mượn toà thứ hai từ dữ liệu mẫu.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| ngan | 1440 | light | design-pass/ngan-1440-sang.png |
| ngan | 1440 | dark | design-pass/ngan-1440-toi.png |
| ngan | 1024 | light | design-pass/ngan-1024-sang.png |
| ngan | 1024 | dark | design-pass/ngan-1024-toi.png |
| ngan | 414 | light | design-pass/ngan-414-sang.png |
| ngan | 414 | dark | design-pass/ngan-414-toi.png |
| ngan | 360 | light | design-pass/ngan-360-sang.png |
| ngan | 360 | dark | design-pass/ngan-360-toi.png |
| go-ma | 1440 | light | design-pass/go-ma-1440-sang.png |
| go-ma | 1440 | dark | design-pass/go-ma-1440-toi.png |
| go-ma | 1024 | light | design-pass/go-ma-1024-sang.png |
| go-ma | 1024 | dark | design-pass/go-ma-1024-toi.png |
| go-ma | 414 | light | design-pass/go-ma-414-sang.png |
| go-ma | 414 | dark | design-pass/go-ma-414-toi.png |
| go-ma | 360 | light | design-pass/go-ma-360-sang.png |
| go-ma | 360 | dark | design-pass/go-ma-360-toi.png |
| mot | 1440 | light | design-pass/mot-1440-sang.png |
| mot | 1440 | dark | design-pass/mot-1440-toi.png |
| mot | 1024 | light | design-pass/mot-1024-sang.png |
| mot | 1024 | dark | design-pass/mot-1024-toi.png |
| mot | 414 | light | design-pass/mot-414-sang.png |
| mot | 414 | dark | design-pass/mot-414-toi.png |
| mot | 360 | light | design-pass/mot-360-sang.png |
| mot | 360 | dark | design-pass/mot-360-toi.png |
| nhieu | 1440 | light | design-pass/nhieu-1440-sang.png |
| nhieu | 1440 | dark | design-pass/nhieu-1440-toi.png |
| nhieu | 1024 | light | design-pass/nhieu-1024-sang.png |
| nhieu | 1024 | dark | design-pass/nhieu-1024-toi.png |
| nhieu | 414 | light | design-pass/nhieu-414-sang.png |
| nhieu | 414 | dark | design-pass/nhieu-414-toi.png |
| nhieu | 360 | light | design-pass/nhieu-360-sang.png |
| nhieu | 360 | dark | design-pass/nhieu-360-toi.png |
| khong | 1440 | light | design-pass/khong-1440-sang.png |
| khong | 1440 | dark | design-pass/khong-1440-toi.png |
| khong | 1024 | light | design-pass/khong-1024-sang.png |
| khong | 1024 | dark | design-pass/khong-1024-toi.png |
| khong | 414 | light | design-pass/khong-414-sang.png |
| khong | 414 | dark | design-pass/khong-414-toi.png |
| khong | 360 | light | design-pass/khong-360-sang.png |
| khong | 360 | dark | design-pass/khong-360-toi.png |
| cu | 1440 | light | design-pass/cu-1440-sang.png |
| cu | 1440 | dark | design-pass/cu-1440-toi.png |
| cu | 1024 | light | design-pass/cu-1024-sang.png |
| cu | 1024 | dark | design-pass/cu-1024-toi.png |
| cu | 414 | light | design-pass/cu-414-sang.png |
| cu | 414 | dark | design-pass/cu-414-toi.png |
| cu | 360 | light | design-pass/cu-360-sang.png |
| cu | 360 | dark | design-pass/cu-360-toi.png |

## Findings

- Đã sửa: hộp «Gõ mã căn» mở sẵn lúc dựng trên máy chủ thì không hiện; nay mở sau khi trang chạy để ảnh cảnh go-ma thấy hộp.
- Ở 360, đầu trang riêng xuống hai dòng (tên căn rồi nút «Chép đường dẫn») — chấp nhận, đúng cách `PageHeader` xuống dòng.
- Trong bản mẫu, dòng địa chỉ chỉ để chủ kho thấy đường dẫn trông thế nào; trang thật không in địa chỉ.

- Đã sửa theo bộ rào của kho (màn không tự dựng hộp thoại, báo nổi, trạng thái trống): hộp gõ mã dùng hộp biểu mẫu sẵn của
  kho (có thêm nút «Thôi»), báo đã chép đi qua kênh báo kết quả của kho, trạng thái «nhiều căn» và «không có căn» ở bản mẫu
  vẽ tay cùng bố cục (trang thật sẽ mở rộng trạng thái trang của kho). Bản mẫu chuyển về trang thử chung, cùng địa chỉ.

- Lối chủ kho chọn ở Cổng Phạm vi (giữ hồ sơ nổi cạnh Bảng hàng): bỏ cảnh trang riêng; ba cảnh «nhiều toà», «mã lạ»,
  «đường dẫn cũ» nay là chính Bảng hàng thật trên dữ liệu mẫu (cảnh nhiều toà thêm một lần chào giả của mã 0905 ở toà khác).
- Đã sửa: ở 360 đầu hồ sơ không chứa đủ bốn nút có chữ («Đóng» bị đẩy ra ngoài, rồi tên căn bị ép dọc) — trên điện thoại
  «Chép đường dẫn» chỉ hiện biểu tượng và tên căn xuống một dòng riêng (Hỏi-3).
- Đã sửa trong hợp đồng: với mã lạ trên điện thoại, chữ đã gõ không thấy vì hàng lọc cột bị ẩn — trang thật đưa mã vào ô
  tìm. Bản mẫu vẫn lọc bằng cột Căn.

- Lời chốt sau của chủ kho về ô tìm (ô ⌘K ở thanh trên là chỗ tìm duy nhất): ô ⌘K có gợi ý ghi rõ loại; chọn gợi ý hay
  Enter mở Bảng hàng thật với mã ở đầu cột Căn và hàng lọc mở (cảnh «mot» bật thêm hồ sơ). Bản mẫu dựng bảng lệnh bằng hộp
  biểu mẫu của kho vì gói cmdk chưa cài — có thêm «Thôi», «Mở» mà bảng lệnh thật không có. Ô «Gõ để tìm» của vùng vẫn còn
  trong ảnh: việc bỏ nó là hàng 2e.
- Phát hiện: lọc ra rỗng thì Bảng hàng giấu hàng lọc đầu cột (ảnh «khong» ở 1440 và 360) — mã vừa gõ không thấy được. Đúng
  mục Ngoài-4 của hàng 2a mà hàng 2c đang sửa; AC-7 của 3f đứng trên bản sửa ấy.

## Nấc

- context: host-embedded — chụp trong App Shell thật.
- reaction: nac-1 — ảnh gửi kèm thẻ Cổng Phạm vi, chủ kho phản ứng ở cổng.
