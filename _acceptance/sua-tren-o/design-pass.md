---
slug: sua-tren-o
at: 2026-11-13T03:10:00Z
route: http://127.0.0.1:3487/inventory?vai=ListAgent
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: một phương án — khung sửa neo dưới ô (Popover của Base UI) trên ReUI data-grid; trang Cổng Phạm vi nhúng ảnh
divergence: closed
ds_skill: inventory-ui
states: [sua-gia, gia-chua-hieu, gia-hoi-lai, da-ghi, trang-thai-da-ban, trang-thai-ngung-han, hoan-tac-hong, o-khoa, khong-quyen-sua, chi-doc-dien-thoai]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 2
deferred: 1
---
# design-pass — sua-tren-o

Bản bấm được dựng thẳng trên Bảng hàng thật (`/inventory`, dữ liệu mẫu MAU) trong App Shell thật, cổng 3487 của dãy H.
`?vai=<Vai>` thay cho phiên đăng nhập (máy dev không có cơ sở dữ liệu), `?loi=` thay cho cổng lưu hỏng. Mã bản bấm được
CHƯA commit: bản vá nằm ở thư mục ghi chú chung của đợt (`4-sua-tren-o-ban-bam-duoc.patch`), vì lưới dùng chung đang do
hàng 2c, 2e gộp trước. Ảnh đầy đủ (48 khung: 10 tình huống × 1440, 1024 × sáng, tối; Bảng hàng và vai không quyền ở 360,
414) chụp bằng Playwright; trang Cổng Phạm vi nhúng 14 khung đã nén.

## Ma trận capture

| tình huống | 1440 | 1024 | 414 | 360 |
|---|---|---|---|---|
| bang · sua-gia · gia-chua-hieu · gia-hoi-lai · da-ghi · trang-thai-da-ban · trang-thai-ngung-han · hoan-tac-hong · o-khoa · khong-quyen-sua | sáng, tối | sáng, tối | — | — |
| bang · khong-quyen-sua (chỉ đọc) | — | — | sáng, tối | sáng, tối |

## Findings

- Đã vá: nhãn hai lý do dài quá 17 ký tự («Chủ đã bán nơi khác», «Không liên lạc được») → «Chủ bán nơi khác», «Mất liên lạc».
- Đã vá: điện thoại mở được khung sửa → khung chỉ mở từ 768 px.
- Để sau: ô tìm của vùng còn hiện trong ảnh — hàng 2e gỡ; ảnh Cổng Bằng chứng chụp sau khi 2e gộp.
- Ở 1024 khung trạng thái lật lên trên ô khi gần đáy màn — chấp nhận (ô vẫn thấy được).
