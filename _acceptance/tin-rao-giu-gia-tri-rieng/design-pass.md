---
slug: tin-rao-giu-gia-tri-rieng
at: 2026-11-27T03:12:34Z
route: http://127.0.0.1:3489/inventory?role=ListAgent
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-trang)
options: _acceptance/tin-rao-giu-gia-tri-rieng/cong-pham-vi.html
divergence: opened
ds_skill: inventory-ui
states: [c-0606, c-0905, c-0905-cuon, c-1202, dau-badge, dau-dot, dau-icon, dau-mo, dau-mo-da-ban, dau-mo-danh-ba, hai-sua-a, ho-so-da-ban, ho-so-khac, ho-so-quan-tri, ho-so-tep, hop-sua, loai-can-sau, loai-can-truoc, loi-a, loi-b, luoi-toi, mot-sua-b, mot-sua-b-hop, o-sua-loi, the]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 6
deferred: 0
---
# design-pass — tin-rao-giu-gia-tri-rieng

Bản bấm được là Bảng hàng thật (`/inventory`) trong App Shell thật, máy dev dãy R cổng 3489, chế độ mẫu (không cơ sở
dữ liệu; `?role=` thay vai; `?columns=five` là lối B năm cột; `?mark=dot|badge|icon` là ba ứng viên dấu). Khung ngăn
chi tiết căn giữ như main (G-2711, chờ chủ kho chốt lối ngăn ở phiên BH). Chụp bằng Playwright.

Mở bước phân kỳ ở hai chỗ: (1) dấu khác danh mục — ba ứng viên ReUI (chấm `c-badge-22`, nhãn `c-badge-16`, biểu tượng
`c-tooltip-3`), máy khuyên chấm; (2) chỗ sửa trên lưới — lối A hai cột (Diện tích, Phòng ngủ; máy khuyên, theo lời chủ
kho «Bảng hàng đủ cột là hàng riêng») và lối B năm cột.

## Ma trận capture

Lượt hai (sau soi G-2711-8); ảnh lượt một giữ ở `evidence/design-pass/` làm vết.

| state | breakpoint | theme | file |
|---|---|---|---|
| c-0606 | 1440 | light | evidence/design-pass/vong-2/c-0606--1440--sang.png |
| c-0905 | 1440 | light | evidence/design-pass/vong-2/c-0905--1440--sang.png |
| c-0905 | 360 | light | evidence/design-pass/vong-2/c-0905--360--sang.png |
| c-0905-cuon | 1440 | light | evidence/design-pass/vong-2/c-0905-cuon--1440--sang.png |
| c-1202 | 1440 | light | evidence/design-pass/vong-2/c-1202--1440--sang.png |
| dau-badge | 1024 | light | evidence/design-pass/vong-2/dau-badge--1024--sang.png |
| dau-badge | 1440 | light | evidence/design-pass/vong-2/dau-badge--1440--sang.png |
| dau-dot | 1024 | light | evidence/design-pass/vong-2/dau-dot--1024--sang.png |
| dau-dot | 1440 | light | evidence/design-pass/vong-2/dau-dot--1440--sang.png |
| dau-icon | 1024 | light | evidence/design-pass/vong-2/dau-icon--1024--sang.png |
| dau-icon | 1440 | light | evidence/design-pass/vong-2/dau-icon--1440--sang.png |
| dau-mo | 1440 | light | evidence/design-pass/vong-2/dau-mo--1440--sang.png |
| dau-mo-da-ban | 1440 | light | evidence/design-pass/vong-2/dau-mo-da-ban--1440--sang.png |
| dau-mo-danh-ba | 1440 | light | evidence/design-pass/vong-2/dau-mo-danh-ba--1440--sang.png |
| hai-sua-a | 1440 | light | evidence/design-pass/vong-2/hai-sua-a--1440--sang.png |
| hai-sua-a | 360 | light | evidence/design-pass/vong-2/hai-sua-a--360--sang.png |
| ho-so-da-ban | 1440 | light | evidence/design-pass/vong-2/ho-so-da-ban--1440--sang.png |
| ho-so-khac | 1024 | light | evidence/design-pass/vong-2/ho-so-khac--1024--sang.png |
| ho-so-khac | 1440 | light | evidence/design-pass/vong-2/ho-so-khac--1440--sang.png |
| ho-so-khac | 1440 | dark | evidence/design-pass/vong-2/ho-so-khac--1440--toi.png |
| ho-so-khac | 360 | light | evidence/design-pass/vong-2/ho-so-khac--360--sang.png |
| ho-so-khac | 414 | light | evidence/design-pass/vong-2/ho-so-khac--414--sang.png |
| ho-so-quan-tri | 1440 | light | evidence/design-pass/vong-2/ho-so-quan-tri--1440--sang.png |
| ho-so-tep | 1440 | light | evidence/design-pass/vong-2/ho-so-tep--1440--sang.png |
| hop-sua | 1440 | light | evidence/design-pass/vong-2/hop-sua--1440--sang.png |
| hop-sua | 1440 | dark | evidence/design-pass/vong-2/hop-sua--1440--toi.png |
| hop-sua | 360 | light | evidence/design-pass/vong-2/hop-sua--360--sang.png |
| loai-can-sau | 1440 | light | evidence/design-pass/vong-2/loai-can-sau--1440--sang.png |
| loai-can-truoc | 1440 | light | evidence/design-pass/vong-2/loai-can-truoc--1440--sang.png |
| loi-a | 1024 | light | evidence/design-pass/vong-2/loi-a--1024--sang.png |
| loi-a | 1440 | light | evidence/design-pass/vong-2/loi-a--1440--sang.png |
| loi-b | 1024 | light | evidence/design-pass/vong-2/loi-b--1024--sang.png |
| loi-b | 1440 | light | evidence/design-pass/vong-2/loi-b--1440--sang.png |
| luoi-toi | 1440 | dark | evidence/design-pass/vong-2/luoi-toi--1440--toi.png |
| mot-sua-b | 1440 | light | evidence/design-pass/vong-2/mot-sua-b--1440--sang.png |
| mot-sua-b-hop | 1440 | light | evidence/design-pass/vong-2/mot-sua-b-hop--1440--sang.png |
| o-sua-loi | 1440 | light | evidence/design-pass/vong-2/o-sua-loi--1440--sang.png |
| the | 360 | light | evidence/design-pass/vong-2/the--360--sang.png |
| the | 414 | light | evidence/design-pass/vong-2/the--414--sang.png |

## Cảnh ngữ-cảnh

- Không cần: vật nhúng trong host thật (Bảng hàng trong App Shell).

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- Dấu đặt sát giá trị, cùng vị trí ở mọi cột và trong ngăn (G-2711-8 điểm 1).
- Nhãn «khác» không còn đè số hay ổ khoá: cột thuộc tính rộng thêm theo kiểu dấu (điểm 2).
- Căn đã bán: ổ khoá cạnh «CĂN», dòng lý do, «Lấy lại» tắt kèm lý do (điểm 6).
- Thẻ điện thoại có dấu cạnh giá trị khác (điểm 7).
- Màu dấu là token «info» của hệ thiết kế ở cả hai nền (điểm 8).
- Ẩn dấu «N» của máy dev khi chụp (điểm 3).

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- (không còn; hai điểm lượt một đã vá ở Nhóm 1)
