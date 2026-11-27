---
slug: tin-rao-giu-gia-tri-rieng
at: 2026-11-27T02:52:12Z
route: http://127.0.0.1:3489/inventory?role=ListAgent
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-trang)
options: _acceptance/tin-rao-giu-gia-tri-rieng/cong-pham-vi-ban-dau.html
divergence: opened
ds_skill: inventory-ui
states: [dau-mo, ho-so-da-ban, ho-so-khac, ho-so-quan-tri, ho-so-tep, hop-sua, luoi-dau-bieu-tuong, luoi-dau-cham, luoi-dau-nhan, luoi-nam-cot, luoi-the, o-sua-loi, o-sua-mo]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 0
deferred: 2
---
# design-pass — tin-rao-giu-gia-tri-rieng

Bản bấm được là Bảng hàng thật (`/inventory`) trong App Shell thật, máy dev dãy R cổng 3489, chế độ mẫu (không cơ sở
dữ liệu; `?role=` thay vai; `?columns=five` là lối B năm cột; `?mark=dot|badge|icon` là ba ứng viên dấu). Khung ngăn
chi tiết căn giữ như main (G-2711, chờ chủ kho chốt lối ngăn ở phiên BH). Chụp bằng Playwright.

Mở bước phân kỳ ở hai chỗ: (1) dấu khác danh mục — ba ứng viên ReUI (chấm `c-badge-22`, nhãn `c-badge-16`, biểu tượng
`c-tooltip-3`), máy khuyên chấm; (2) chỗ sửa trên lưới — lối A hai cột (Diện tích, Phòng ngủ; máy khuyên, theo lời chủ
kho «Bảng hàng đủ cột là hàng riêng») và lối B năm cột.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| dau-mo | 1440 | light | evidence/design-pass/dau-mo--1440--sang.png |
| ho-so-da-ban | 1440 | light | evidence/design-pass/ho-so-da-ban--1440--sang.png |
| ho-so-khac | 1024 | light | evidence/design-pass/ho-so-khac--1024--sang.png |
| ho-so-khac | 1440 | light | evidence/design-pass/ho-so-khac--1440--sang.png |
| ho-so-khac | 1440 | dark | evidence/design-pass/ho-so-khac--1440--toi.png |
| ho-so-khac | 360 | light | evidence/design-pass/ho-so-khac--360--sang.png |
| ho-so-khac | 414 | light | evidence/design-pass/ho-so-khac--414--sang.png |
| ho-so-quan-tri | 1440 | light | evidence/design-pass/ho-so-quan-tri--1440--sang.png |
| ho-so-tep | 1440 | light | evidence/design-pass/ho-so-tep--1440--sang.png |
| hop-sua | 1440 | light | evidence/design-pass/hop-sua--1440--sang.png |
| hop-sua | 1440 | dark | evidence/design-pass/hop-sua--1440--toi.png |
| hop-sua | 360 | light | evidence/design-pass/hop-sua--360--sang.png |
| luoi-dau-bieu-tuong | 1440 | light | evidence/design-pass/luoi-dau-bieu-tuong--1440--sang.png |
| luoi-dau-cham | 1024 | light | evidence/design-pass/luoi-dau-cham--1024--sang.png |
| luoi-dau-cham | 1440 | light | evidence/design-pass/luoi-dau-cham--1440--sang.png |
| luoi-dau-cham | 1440 | dark | evidence/design-pass/luoi-dau-cham--1440--toi.png |
| luoi-dau-nhan | 1440 | light | evidence/design-pass/luoi-dau-nhan--1440--sang.png |
| luoi-nam-cot | 1440 | light | evidence/design-pass/luoi-nam-cot--1440--sang.png |
| luoi-the | 360 | light | evidence/design-pass/luoi-the--360--sang.png |
| luoi-the | 414 | light | evidence/design-pass/luoi-the--414--sang.png |
| o-sua-loi | 1440 | light | evidence/design-pass/o-sua-loi--1440--sang.png |
| o-sua-mo | 1440 | light | evidence/design-pass/o-sua-mo--1440--sang.png |

## Cảnh ngữ-cảnh

- Không cần: vật nhúng trong host thật (Bảng hàng trong App Shell).

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- (không có)

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- Dấu chấm nằm góc trái trên của ô số canh phải, xa con số ở cột rộng (ảnh luoi-dau-cham--1440); đề xuất đặt sát trái
  con số — cần khe `cellMark` của khung lưới nhận chỗ đặt.
- Kiểu nhãn «khác» đè lên con số ở cột Diện tích hẹp (ảnh luoi-dau-nhan--1440); kiểu này chỉ dùng được nếu cột rộng thêm.
