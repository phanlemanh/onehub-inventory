---
slug: bang-hang-dung-tay-nhu-sheet
at: 2026-11-12T06:45:00Z
route: http://localhost:3481/inventory
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/bang-hang-dung-tay-nhu-sheet/evidence/reui/ (ảnh hai khối nhóm dòng của ReUI và khối đích data-grid-editing-6)
divergence: opened
ds_skill: inventory-ui
states: [mac-dinh, loc-mo, nhom, chon-vung, menu-cot, sap-xep, cuon-ngang]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 4
deferred: 2
---
# design-pass — bang-hang-dung-tay-nhu-sheet

Bản bấm được là chính Bảng hàng trong App Shell thật, dữ liệu mẫu 60 căn, khuôn Lưới dùng chung đã mang các thói quen Sheet
(commit trên nhánh của hàng). Ảnh gốc ở `evidence/design-pass/`, chụp bằng trình duyệt tự động ở bốn khổ.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| mac-dinh | 1024 | dark | evidence/design-pass/1-mac-dinh-1024-dark.png |
| mac-dinh | 1024 | light | evidence/design-pass/1-mac-dinh-1024-light.png |
| mac-dinh | 1440 | dark | evidence/design-pass/1-mac-dinh-1440-dark.png |
| mac-dinh | 1440 | light | evidence/design-pass/1-mac-dinh-1440-light.png |
| mac-dinh | 360 | dark | evidence/design-pass/1-mac-dinh-360-dark.png |
| mac-dinh | 360 | light | evidence/design-pass/1-mac-dinh-360-light.png |
| mac-dinh | 414 | dark | evidence/design-pass/1-mac-dinh-414-dark.png |
| mac-dinh | 414 | light | evidence/design-pass/1-mac-dinh-414-light.png |
| loc | 1024 | light | evidence/design-pass/2-loc-1024-light.png |
| loc | 1440 | light | evidence/design-pass/2-loc-1440-light.png |
| loc | 360 | light | evidence/design-pass/2-loc-360-light.png |
| loc | 414 | light | evidence/design-pass/2-loc-414-light.png |
| nhom | 1024 | dark | evidence/design-pass/3-nhom-1024-dark.png |
| nhom | 1024 | light | evidence/design-pass/3-nhom-1024-light.png |
| nhom | 1440 | dark | evidence/design-pass/3-nhom-1440-dark.png |
| nhom | 1440 | light | evidence/design-pass/3-nhom-1440-light.png |
| nhom | 360 | dark | evidence/design-pass/3-nhom-360-dark.png |
| nhom | 360 | light | evidence/design-pass/3-nhom-360-light.png |
| nhom | 414 | dark | evidence/design-pass/3-nhom-414-dark.png |
| nhom | 414 | light | evidence/design-pass/3-nhom-414-light.png |
| chon-vung | 1024 | dark | evidence/design-pass/4-chon-vung-1024-dark.png |
| chon-vung | 1024 | light | evidence/design-pass/4-chon-vung-1024-light.png |
| chon-vung | 1440 | dark | evidence/design-pass/4-chon-vung-1440-dark.png |
| chon-vung | 1440 | light | evidence/design-pass/4-chon-vung-1440-light.png |
| chon-vung | 360 | dark | evidence/design-pass/4-chon-vung-360-dark.png |
| chon-vung | 360 | light | evidence/design-pass/4-chon-vung-360-light.png |
| chon-vung | 414 | dark | evidence/design-pass/4-chon-vung-414-dark.png |
| chon-vung | 414 | light | evidence/design-pass/4-chon-vung-414-light.png |
| cot | 1024 | light | evidence/design-pass/5-cot-1024-light.png |
| cot | 1440 | light | evidence/design-pass/5-cot-1440-light.png |
| cot | 360 | light | evidence/design-pass/5-cot-360-light.png |
| cot | 414 | light | evidence/design-pass/5-cot-414-light.png |
| sap-xep | 1024 | light | evidence/design-pass/6-sap-xep-1024-light.png |
| sap-xep | 1440 | light | evidence/design-pass/6-sap-xep-1440-light.png |
| sap-xep | 360 | light | evidence/design-pass/6-sap-xep-360-light.png |
| sap-xep | 414 | light | evidence/design-pass/6-sap-xep-414-light.png |
| cuon-ngang | 1024 | light | evidence/design-pass/7-cuon-ngang-1024-light.png |
| cuon-ngang | 1440 | light | evidence/design-pass/7-cuon-ngang-1440-light.png |
| cuon-ngang | 360 | light | evidence/design-pass/7-cuon-ngang-360-light.png |
| cuon-ngang | 414 | light | evidence/design-pass/7-cuon-ngang-414-light.png |

## Bước phân kỳ

- Hướng «Lắp từ kho» (đang dựng) — trục: khuôn Lưới + thành phần lưới ReUI đã cài · động cơ: một nơi cho mọi màn Lưới, giữ nguyên thành phần · đánh đổi: đầu cột là menu (Hỏi-3).
- Hướng «Dòng nhóm dải màu» (data-grid-grouping-1) — trục: nhóm nổi bằng nền · động cơ: nhìn ra ranh giới toà nhanh · đánh đổi: cần chữ mô tả mỗi toà mà dữ liệu chưa có (Hỏi-1).
- Hướng «Dòng nhóm là dòng bảng» (data-grid-grouping-2, Quỹ hàng chọn) — trục: nhóm nằm trong lưới · động cơ: hợp cuộn ảo và cột đứng yên · đánh đổi: kém nổi hơn dải màu.
- Hướng «Đầu cột tự viết, bấm là sắp» — trục: một lần bấm · động cơ: đúng chữ «bấm tiêu đề để sắp xếp» · đánh đổi: bậc 3, mất ghim cột (Hỏi-3).

## Cảnh ngữ-cảnh

- Không cần cảnh riêng: bản bấm được nhúng trong App Shell thật; ảnh lọc mở từ lối tắt «Đang bán» cho thấy lối vào từ cột thứ hai.

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- Phím không chạy sau khi lưới đổi mật độ: bộ chọn ô bám thân bảng cũ; nay dựng lại cùng thân bảng (ảnh 4-chon-vung).
- Tắt ghim ở đầu cột làm ba cột đầu thôi đứng yên ở 360; trả ghim, đầu cột dùng menu của ReUI (ảnh 7-cuon-ngang-360).
- Nhãn nhóm bị cắt trong cột Toà; số dòng của nhóm dời sang cột kế (ảnh 3-nhom).
- Ô lọc quá hẹp ở cột ngắn (Căn); hàng lọc mở thì mỗi cột rộng ít nhất 11 ký tự (ảnh 2-loc).

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- Dáng dòng nhóm: hai ứng viên ReUI (Hỏi-1).
- Đầu cột là menu thay vì bấm một lần là sắp (Hỏi-3).

### Nhóm 3 — hỏi-người-biết

- Lọc ngày theo số ngày đã qua hay theo chữ ngày (Hỏi-2).
