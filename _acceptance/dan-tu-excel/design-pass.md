---
slug: dan-tu-excel
at: 2026-11-15T04:00:00Z
route: http://127.0.0.1:3487/inventory?vai=ListAgent
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: ba lối cho bản xem trước — A hộp thoại danh sách (khuyên), B đánh dấu trên lưới kèm thanh Áp/Thôi, C ngăn bên cạnh bảng; cùng một vùng dán 4 dòng × 3 cột
divergence: open
ds_skill: inventory-ui
states: [xem-truoc, khong-o-nao, dang-ap, da-ap, ap-mot-phan, hoan-tac-hong, khong-quyen]
breakpoints: [desktop-1024, desktop-1440]
themes: [light, dark]
patched: 1
deferred: 1
---
# design-pass — dan-tu-excel

Bản bấm được dựng thẳng trên Bảng hàng thật (`/inventory`, dữ liệu mẫu MAU) trong App Shell thật, cổng 3487 của dãy H.
`?vai=<Vai>` thay cho phiên đăng nhập. Lối A là mã thật (đường dán của lưới → luật hàng 4 → bản xem trước → cửa lưu →
hoàn tác cả vùng, đã chạy tay: 6 lần ghi rồi 6 lần ghi ngược); lối B, C là lớp tạm `?xem=B|C` chỉ để chụp, gỡ sau khi chủ
kho chọn. Mã bản bấm được CHƯA commit: phần dựng chờ hàng 2b vào main; bản vá ở thư mục ghi chú chung của đợt
(`h-5/ban-bam-duoc.patch`).

Vùng dán dùng chung cho mọi ảnh (chọn ô Trạng thái căn 1101):

```text
Tạm ngừng	2,8 tỷ	60
Đang bán	4,4 tỷ	70
Đã bán	hai tỷ
Đang giao dịch	9 tỷ	80
```

## Ma trận capture

| tình huống | 1440 sáng | 1440 tối | 1024 sáng |
|---|---|---|---|
| lối A — hộp thoại | `figures/lua-chon-A.png` | `figures/lua-chon-A-toi.png` | `figures/lua-chon-A-1024.png` |
| lối B — trên lưới | `figures/lua-chon-B.png` | — (sau khi chọn) | — |
| lối C — ngăn bên | `figures/lua-chon-C.png` | — (sau khi chọn) | — |
| tham chiếu: Bảng hàng, hộp «Đổi sang Đã bán» của hàng 4 | `figures/tham-chieu-bang-hang.png`, `figures/tham-chieu-hop-da-ban.png` | — | — |

## Findings

- Đã vá: lời lý do lặp «Chưa hiểu «…» — gõ như…» với chữ đã dán đứng trước; bản xem trước nay in «chữ đã dán» rồi lý do
  một lần.
- Phát hiện, nêu ở Cổng Phạm vi: hộp thoại của kho có bề rộng cố định (khuôn `DialogContent` không cho đổi), nên với 6
  dòng sẽ đổi thì phần «Bị bỏ», «Sai kiểu» nằm dưới, phải cuộn mới thấy; dòng đếm ở đầu hộp vẫn nói đủ bốn số. Đây là giá
  của lối A.
- Để sau: ảnh tối và 1024 của lối B, C chụp khi chủ kho chọn lối khác A.
