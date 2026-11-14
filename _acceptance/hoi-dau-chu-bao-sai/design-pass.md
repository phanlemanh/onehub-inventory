---
slug: hoi-dau-chu-bao-sai
at: 2026-11-13T01:45:50Z
route: http://localhost:3488/inventory?vai=BuyerAgent&ho-so=<mã hàng mẫu> (nhánh proto/3e-hoi-dau-chu)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: evidence/ban-bam/hoi-*, chua-ai-giu-*, minh-giu-*, quan-tri-*, bao-sai-*; ứng viên ReUI evidence/reui/sheet-8.png, product-detail-5.png
divergence: opened
ds_skill: inventory-ui
states: [hoi-co-nguoi-giu, hoi-chua-ai-giu, hoi-minh-giu, hoi-khong-quyen, hoi-da-chep, bao-mo, bao-thieu, bao-da-chep]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 2
deferred: 1
---
# design-pass — hoi-dau-chu-bao-sai

Bản bấm được dựng thẳng trên hồ sơ căn thật của Bảng hàng (hàng 3), ở nhánh riêng `proto/3e-hoi-dau-chu` (không gộp), bản vá
ở thư mục ghi chú của đợt (`3e-ban-bam-duoc.patch`). Dữ liệu mẫu MAU; người giữ căn mẫu theo số hàng (`[Tên] 0x`, chính người
xem, chưa ai). Vai đổi bằng `?vai=<vai>` chỉ ở bản thử (khung chưa đăng nhập không có vai). Bảng chia sẻ giả trong lượt chụp
ghi lại đối số: tin «Hỏi về căn 1101 · S1.01», đường dẫn `/inventory?ho-so=4d415500-0001-4000-8000-000000000002` — đúng căn.

## Ma trận capture

| ảnh | tệp |
|---|---|
| thanh hỏi, bốn khổ × sáng tối | evidence/ban-bam/hoi-{1440,1024,414,360}-{light,dark}.png |
| căn chưa ai giữ | evidence/ban-bam/chua-ai-giu-1440-light.png, chua-ai-giu-360-dark.png |
| người xem giữ căn (không thanh) | evidence/ban-bam/minh-giu-1440-light.png, minh-giu-360-light.png |
| Quản trị sàn (không thanh, còn nút báo sai) | evidence/ban-bam/quan-tri-1440-light.png |
| máy không có bảng chia sẻ → «Đã chép tin hỏi» | evidence/ban-bam/hoi-da-chep-414-light.png |
| hộp báo sai đã điền | evidence/ban-bam/bao-sai-1440-light.png, bao-sai-360-dark.png |
| hộp báo sai bấm khi ô trống | evidence/ban-bam/bao-sai-trong-1024-dark.png |
| hộp báo sai, máy chỉ chép → «Đã chép» | evidence/ban-bam/bao-sai-da-chep-414-light.png |

## Findings

- Đã sửa: nhãn «Khu» trong tin báo sai đổi thành «Dự án» theo bảng nhãn (Subdivision hiện «Dự án» trên hồ sơ).
- Đã sửa: hộp dùng chung `FormDialog` không tắt nút gửi theo ô; ô giá trị đúng trống thì báo lỗi tại ô, đúng cách báo lỗi
  trường của kho — hợp đồng AC-6 viết lại theo cách ấy thay cho «nút tắt» của Quỹ hàng.
- Hoãn: ở 414 và 360 thông báo «Đã chép tin hỏi» hiện đè lên thanh đáy vài giây (vị trí toast mặc định của kho). Không chặn
  việc; ghi để Cổng Bằng chứng xem lại.
- Đã thấy: Quản trị sàn có ô đọc danh mục nên vẫn thấy «Báo sai thông tin» (Hỏi-2 nói rõ).
