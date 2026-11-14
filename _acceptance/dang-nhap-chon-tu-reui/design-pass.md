---
slug: dang-nhap-chon-tu-reui
at: 2026-11-14T02:02:00Z
route: http://127.0.0.1:3487/ban-mau-1p/a (b, c; khối gốc ở /ban-mau-1p/goc/auth-15, auth-19, auth-13)
material: real-components
context: standalone
context_scenes: [chua-dang-nhap]
reaction: nac-1 (anh-gui-kem-the)
options: ba lối — A auth-15, B auth-19, C auth-13; trang Cổng Phạm vi cong-pham-vi.html
divergence: open
ds_skill: inventory-ui
states: [email]
breakpoints: [mobile-390, desktop-1440]
themes: [light, dark]
patched: 3
deferred: 1
---
# design-pass — dang-nhap-chon-tu-reui

Bản bấm được dựng trên cổng 3487 của dãy H. Mỗi lối bọc đúng biểu mẫu thật của hàng 8 (bản sao chỉ đổi dáng ô email và
nút); khối gốc lấy nguyên mã từ kho ReUI (registry `@reui`, khoá Pro) và chạy cạnh đó để chụp. Mã bản mẫu không commit
(thư mục `src/app/ban-mau-1p/` chỉ có ở máy). Ảnh chụp bằng Playwright, cùng khổ, cùng email `nhan-vien@example.test`,
ẩn nút dev của Next.

## Ma trận capture

| tình huống | 1440 | 390 |
|---|---|---|
| bước email, đã gõ email — A, B, C, ba khối gốc, màn hiện tại | sáng, tối | sáng, tối |

Bước nhập mã và các lỗi chụp sau khi chủ kho chọn lối (cần cơ sở dữ liệu làn H).

## Findings

- Đã vá: logo ngang mất chữ ở nền tối → dùng dấu hình + chữ theo màu chủ đề (cả ba lối).
- Đã vá: lối B dùng Card của khối → Frame của kho (một họ khung cho màn nhân viên).
- Đã vá: lối C thiếu nền nhiễu của khối → thêm.
- Để sau: lối C cần một ảnh riêng của OneHub lưu trong kho; bản mẫu dùng ảnh của khối.
