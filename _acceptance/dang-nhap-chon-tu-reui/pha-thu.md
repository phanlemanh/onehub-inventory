# Phá thử — dang-nhap-chon-tu-reui

Mỗi cặp: vật lành → ca xanh; phá vật thật trong một lần sửa tạm (hoàn lại ngay sau) → ca đỏ với thông điệp ghim. Chạy
2026-11-14 trên cây của dãy H sau khi gộp main 66e5a8d. Bài trình duyệt chạy ở khổ 360; vật lành xanh 36/36 ở bốn khổ.

| Phá thử | Vật bị phá | Ca | Thông điệp đỏ |
|---|---|---|---|
| pha-thu-them-khung | bọc cột biểu mẫu bằng một khối `data-slot="frame"` | dang-cua-khoi | `dang-cua-khoi: khung bọc biểu mẫu` (Expected 0, Received 1) |
| pha-thu-them-google | thêm nút «Continue with Google» dưới biểu mẫu | khong-dang-nhap-ngoai | `khong-dang-nhap-ngoai: Google` |
| pha-thu-day-nut | thêm khoảng trống cao 900px trên tiêu đề | nut-trong-man-dau | `nut-trong-man-dau: 360` (≤ 800, nhận 1278.75) |
| pha-thu-logo-toi | chữ «OneHub» màu cố định #1a1a1a | logo-doc-duoc-nen-toi | `logo-doc-duoc-nen-toi` (color-contrast) |
| pha-thu-axe | chữ chân trang màu #dddddd | axe-dang-nhap | `axe-dang-nhap: light` (color-contrast) |
| pha-thu-sua-loi | đổi một chữ trong `tests/e2e/account.spec.ts` | giu-loi-bai-dang-nhap | `giu-loi-bai-dang-nhap: tests/e2e/account.spec.ts` |
| pha-thu-doi-cau | đổi «Gửi mã mới» thành «Gửi lại mã» trong `copy.ts` | giu-cau-copy | `giu-cau-copy: resend` |
| pha-thu-day-nut-toi | khoảng trống cao 900px chỉ hiện ở nền tối | nut-trong-man-dau | `nut-trong-man-dau: 360 dark` |
| pha-thu-loi-ngoai-cot | đặt biểu mẫu (và câu báo lỗi) ra ngoài cột giữa trang | loi-may-chu-trong-cot | `loi-may-chu-trong-cot: bao loi trong cot` |
