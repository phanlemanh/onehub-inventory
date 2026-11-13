---
slug: bo-nut-theo-quyen
at: 2026-11-12T11:20:00Z
route: http://127.0.0.1:3489/proto/bo-nut-theo-quyen
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: evidence/ban-bam/thanh-*, dong-*, hop-*, chu-*, khac-*, vai-* (ứng viên ReUI dựng trên thành phần của kho, trong App Shell thật)
divergence: opened
ds_skill: inventory-ui
states: [man-mau, menu-dong, ho-so, hop-go, vung-khong-du-quyen, tu-choi-403]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 4
deferred: 1
---
# design-pass — bo-nut-theo-quyen

Bản bấm được là trang mẫu `/proto/bo-nut-theo-quyen` trong App Shell thật (chỉ bản dev, dữ liệu mẫu `[Tên]` và `0900 000 0xx`,
không gọi API ghi). Bảng chọn trên đầu đổi màn (Bảng hàng · Liên hệ), vai và từng ứng viên; `?bang=an` ẩn bảng chọn để chụp.
Quyền đi qua đúng hàm `allowedScope` của hàng 9a với bảng nháp `draft-permissions.ts`. Dãy V chạy ở cổng 3489.

## Ma trận capture

Màn mẫu ở bốn khổ × sáng/tối (`man-mau-*`); ứng viên ở 1440 sáng; hộp gỡ thêm 414; mỗi vai thêm 414.

| ảnh | tệp |
|---|---|
| chu-H1-lien-he | evidence/ban-bam/chu-H1-lien-he.png |
| chu-H1 | evidence/ban-bam/chu-H1.png |
| chu-H2-lien-he | evidence/ban-bam/chu-H2-lien-he.png |
| chu-H2 | evidence/ban-bam/chu-H2.png |
| dong-R1 | evidence/ban-bam/dong-R1.png |
| dong-R2 | evidence/ban-bam/dong-R2.png |
| dong-R3-ho-so | evidence/ban-bam/dong-R3-ho-so.png |
| dong-R3 | evidence/ban-bam/dong-R3.png |
| hop-X1-414 | evidence/ban-bam/hop-X1-414.png |
| hop-X1 | evidence/ban-bam/hop-X1.png |
| hop-X2-414 | evidence/ban-bam/hop-X2-414.png |
| hop-X2 | evidence/ban-bam/hop-X2.png |
| hop-X3-414 | evidence/ban-bam/hop-X3-414.png |
| hop-X3 | evidence/ban-bam/hop-X3.png |
| khac-O1 | evidence/ban-bam/khac-O1.png |
| khac-O2 | evidence/ban-bam/khac-O2.png |
| man-mau-1024-sang | evidence/ban-bam/man-mau-1024-sang.png |
| man-mau-1024-toi | evidence/ban-bam/man-mau-1024-toi.png |
| man-mau-1440-sang | evidence/ban-bam/man-mau-1440-sang.png |
| man-mau-1440-toi | evidence/ban-bam/man-mau-1440-toi.png |
| man-mau-360-sang | evidence/ban-bam/man-mau-360-sang.png |
| man-mau-360-toi | evidence/ban-bam/man-mau-360-toi.png |
| man-mau-414-sang | evidence/ban-bam/man-mau-414-sang.png |
| man-mau-414-toi | evidence/ban-bam/man-mau-414-toi.png |
| thanh-A | evidence/ban-bam/thanh-A.png |
| thanh-B | evidence/ban-bam/thanh-B.png |
| thanh-C | evidence/ban-bam/thanh-C.png |
| tu-choi | evidence/ban-bam/tu-choi.png |
| vai-BuyerAgent-414 | evidence/ban-bam/vai-BuyerAgent-414.png |
| vai-BuyerAgent | evidence/ban-bam/vai-BuyerAgent.png |
| vai-CompanyAdmin-414 | evidence/ban-bam/vai-CompanyAdmin-414.png |
| vai-CompanyAdmin | evidence/ban-bam/vai-CompanyAdmin.png |
| vai-ListAgent-414 | evidence/ban-bam/vai-ListAgent-414.png |
| vai-ListAgent | evidence/ban-bam/vai-ListAgent.png |
| vai-TeamLead-414 | evidence/ban-bam/vai-TeamLead-414.png |
| vai-TeamLead | evidence/ban-bam/vai-TeamLead.png |

## Findings

- Đã vá: menu «…» mở hai lần ở máy tính (bản thẻ điện thoại ẩn vẫn dựng) → chỉ dựng bản hợp khổ.
- Đã vá: hộp X2 tràn chữ trong nút lý do ở 414 → nút ngắn «Căn thôi bán» · «Tạo nhầm», lời giải thích bên dưới.
- Đã vá: nút đang chọn ở bảng chọn khó thấy trong chế độ tối → nút chính.
- Đã vá: cột «Người giữ» ở màn Liên hệ đổi thành «Người tạo».
- Để lại: nút «N» của Next ở góc dưới trái là chỉ báo của bản dev, không có ở bản thật.
- Bản mẫu dựng lưới ReUI trực tiếp cho nhanh; bản thật đặt khe thao tác dòng vào `DataRegion` (khuôn luoi).
