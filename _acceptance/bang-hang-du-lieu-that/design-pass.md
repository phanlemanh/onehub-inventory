---
slug: bang-hang-du-lieu-that
at: 2026-11-15T03:20:00Z
route: http://127.0.0.1:3482/inventory?vai=ListAgent
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options:
divergence: skipped — hàng 10 không thêm khối giao diện; năm trạng thái là khối có sẵn của DataRegion (luật «một nhu cầu, một chủ»)
ds_skill: inventory-ui
states: [san-sang, cho-tai, trong, loi, khong-khop, khong-quyen]
breakpoints: [mobile-360, desktop-1440]
themes: [light, dark]
patched: 0
deferred: 1
---
# design-pass — bang-hang-du-lieu-that

Bản bấm được là Bảng hàng thật (`/inventory`) trong App Shell thật, máy dev dãy R cổng 3482, còn đọc bộ mẫu (dữ liệu thật
chưa dựng). `?vai=ListAgent` thay phiên (sẽ bị gỡ ở chính hàng này, AC-9); `?state=` dựng chờ tải, trống, lỗi, không đủ
quyền; `?ma=ZZZZ` dựng không khớp. Chụp bằng Playwright, đã ẩn nút «N» của công cụ dựng.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| san-sang | desktop-1440 | light | evidence/design-pass/san-sang-1440-sang.png |
| san-sang | desktop-1440 | dark | evidence/design-pass/san-sang-1440-toi.png |
| san-sang | mobile-360 | light | evidence/design-pass/san-sang-360-sang.png |
| san-sang | mobile-360 | dark | evidence/design-pass/san-sang-360-toi.png |
| cho-tai | desktop-1440 | light | evidence/design-pass/cho-tai-1440-sang.png |
| cho-tai | desktop-1440 | dark | evidence/design-pass/cho-tai-1440-toi.png |
| cho-tai | mobile-360 | light | evidence/design-pass/cho-tai-360-sang.png |
| cho-tai | mobile-360 | dark | evidence/design-pass/cho-tai-360-toi.png |
| trong | desktop-1440 | light | evidence/design-pass/trong-1440-sang.png |
| trong | desktop-1440 | dark | evidence/design-pass/trong-1440-toi.png |
| trong | mobile-360 | light | evidence/design-pass/trong-360-sang.png |
| trong | mobile-360 | dark | evidence/design-pass/trong-360-toi.png |
| loi | desktop-1440 | light | evidence/design-pass/loi-1440-sang.png |
| loi | desktop-1440 | dark | evidence/design-pass/loi-1440-toi.png |
| loi | mobile-360 | light | evidence/design-pass/loi-360-sang.png |
| loi | mobile-360 | dark | evidence/design-pass/loi-360-toi.png |
| khong-khop | desktop-1440 | light | evidence/design-pass/khong-khop-1440-sang.png |
| khong-khop | desktop-1440 | dark | evidence/design-pass/khong-khop-1440-toi.png |
| khong-khop | mobile-360 | light | evidence/design-pass/khong-khop-360-sang.png |
| khong-khop | mobile-360 | dark | evidence/design-pass/khong-khop-360-toi.png |
| khong-quyen | desktop-1440 | light | evidence/design-pass/khong-quyen-1440-sang.png |
| khong-quyen | desktop-1440 | dark | evidence/design-pass/khong-quyen-1440-toi.png |
| khong-quyen | mobile-360 | light | evidence/design-pass/khong-quyen-360-sang.png |
| khong-quyen | mobile-360 | dark | evidence/design-pass/khong-quyen-360-toi.png |

## Cảnh ngữ-cảnh

- Không cần: vật chụp trong khung host thật (App Shell), `context: host-embedded`.

## Findings

- Hoãn 1: ở 360 bảng còn là lưới vì thẻ điện thoại của 2b (PR #63) chưa vào main; ảnh Cổng Bằng chứng chụp sau khi gộp.
