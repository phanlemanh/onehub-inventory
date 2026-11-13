---
slug: ngan-chi-tiet-ghim-thanh-cot
at: 2026-11-14T00:40:00Z
route: /inventory, /sent (máy chụp riêng của bộ kiểm có cơ sở dữ liệu, Postgres dãy D)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: một dáng ghim (cột cạnh bảng, vạch chia kéo được — lời chủ kho ở hàng 3); một câu hỏi điện thoại
divergence: closed
ds_skill: inventory-ui
states: [noi, ghim, ghim-keo, sent-ghim, dien-thoai]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 2
deferred: 0
---
# design-pass — ngan-chi-tiet-ghim-thanh-cot

Bản bấm được dựng thẳng trên khung hồ sơ thật (`RecordPanel`) của Bảng hàng và Đã gửi, trong App Shell thật, đăng nhập
vai Đầu chủ của sàn mẫu qua cửa đăng nhập theo vai của 9b. Áp sẵn đầu hồ sơ hai dòng của hàng 3e (chưa gộp) để nút Ghim
nằm đúng chỗ sẽ ra mắt; ô tìm của vùng (hàng 2e gỡ) ẩn bằng CSS trong lượt chụp. Mã CHƯA commit: bản vá ở thư mục ghi chú chung của
đợt (`3a-ban-bam-duoc.patch`). Vạch chia dựng theo hình tay cầm
Resizable của ReUI, chưa phải mã thành phần.

## Ma trận capture

| tình huống | 1440 | 1024 | 414 | 360 |
|---|---|---|---|---|
| noi · ghim | sáng, tối | sáng, tối | — | — |
| ghim-keo · sent-ghim | sáng | sáng | — | — |
| dien-thoai (hồ sơ toàn màn) | — | — | sáng | sáng |

Ảnh: `evidence/proto/`. Khối gốc ReUI: `evidence/reui/app-shell-11.png`, `evidence/reui/ai-chat-2.png`.

## Findings

1. (đã sửa) Dấu dev của Next ở góc trái lọt vào ảnh — ẩn trong lượt chụp.
2. (đã sửa) Nút Ghim khi đang bấm trông như chưa bấm — thêm nền nhấn theo `aria-pressed`.
3. (rủi ro, đưa lên đầu trang cổng) 1024 với cột hai App Shell mở: bảng còn trọn hai cột dữ liệu khi ghim.
