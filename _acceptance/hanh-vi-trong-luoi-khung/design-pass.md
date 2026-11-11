---
slug: hanh-vi-trong-luoi-khung
at: 2026-11-11T04:49:07Z
route: http://127.0.0.1:3481/proto/hanh-vi-trong-luoi-khung
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options:
divergence: skipped — mọi hành vi đã có câu trả lời đóng trong design/behaviors.md, không còn hướng mở
ds_skill: inventory-ui
states: [ho-so, ho-so-nguoi, ho-so-dien-thoai, xac-nhan, hoan-tac, loi, cho-10s]
breakpoints: [mobile-360, desktop-1440]
themes: [light, dark]
patched: 2
deferred: 1
---
# design-pass — hanh-vi-trong-luoi-khung

Bản mẫu chạy trong khung ứng dụng thật (nhóm route có thanh bên), sau cờ bản phát triển; thành phần là thành phần thật của hàng.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| ho-so | desktop-1440 | light | evidence/design-pass/ho-so-1440-light.png |
| ho-so-nguoi | desktop-1440 | light | evidence/design-pass/ho-so-nguoi-1440-light.png |
| ho-so-dien-thoai | mobile-360 | dark | evidence/design-pass/ho-so-360-dark.png |
| xac-nhan | mobile-360 | light | evidence/design-pass/xac-nhan-360-light.png |
| hoan-tac | desktop-1440 | dark | evidence/design-pass/hoan-tac-1440-dark.png |
| loi | desktop-1440 | light | evidence/design-pass/loi-1440-light.png |
| cho-10s | desktop-1440 | light | evidence/design-pass/cho-10s-1440-light.png |

## Cảnh ngữ-cảnh

- Không cần: bản mẫu nằm trong khung ứng dụng thật (context host-embedded).

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- Hồ sơ căn hiện mã trạng thái tiếng Anh («Pending»): nội dung bản mẫu dùng ô theo kiểu của Lưới, nay hiện «Đang giao dịch».
- Tên hồ sơ bị cắt trên điện thoại vì nằm chung dòng với ba nút: tên nay xuống dòng riêng khi hẹp.

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- Khung hồ sơ không dùng Sheet của kho: Sheet cố định ba phần tư bề rộng trên điện thoại và không nhận lớp, trong khi design/behaviors.md đòi toàn màn. Khung dựng thẳng trên hộp thoại của Base UI, không lớp phủ mờ (luật kho cấm lớp phủ tự vẽ), nên Lưới vẫn thấy bên cạnh.
