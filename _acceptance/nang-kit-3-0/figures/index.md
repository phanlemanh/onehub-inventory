# Hình tại Cổng Phạm vi — nang-kit-3-0

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Cách làm A/B/C (dòng sổ «Áp lại bản vá đã diễn tập…», «kit-root chỉ đọc khoá…») | 3 nhánh rẽ | `ba-cach.html` |
| Hỏi-2 — máy chưa cài chợ mới: cài trước khi gộp (kit-root không đọc lùi) hay đọc lùi có cảnh báo | 4 bước nối tiếp + 2 nhánh rẽ | `trinh-tu-gop.html` |
| Hỏi-1 — ai sửa ba dòng `ci.yml` | dưới ngưỡng: 2 lối, 1 bước | — |
| Hỏi-3 — chợ ghim `ref: v3.0.0` hay theo nhánh chính | dưới ngưỡng: 2 lối, 1 bước | — |
| Descope: tên đợt `dieu-phoi-nen`, khoá cấu hình giữ tên | dưới ngưỡng: 1 lối | — |
| Descope: bỏ coverage-scan, bỏ đặc tả UX | dưới ngưỡng: 1 lối | — |

## Đề bài `ba-cach.html`

- Loại: so sánh ba nhánh (decision tree ngang), mỗi nhánh kết bằng «máy chạy kit nào · CI chạy kit nào».
- Nút: A «áp bản vá + dọn tên cũ; kit-root chỉ đọc chợ mới» → máy chưa cài chợ: không có kit, báo lỗi to · máy đã cài: 3.0 · CI: 3.0.
- B «như A nhưng kit-root đọc lùi chợ cũ» → máy chưa cài: 2.38 lặng lẽ · CI: 3.0 → đánh dấu «hai bản kit chấm một kho».
- C «chỉ đổi ci.yml» → máy: 2.38 · CI: 3.0 → cùng dấu.
- AC liên quan: AC-1, AC-5, AC-6. Nhãn bằng chữ tiếng Việt.

## Đề bài `trinh-tu-gop.html`

- Loại: dòng thời gian (timeline) có một chỗ rẽ.
- Bước: (1) vòng `upgrade-design-assembly-0-7-1` gộp → (2) PR #83 gộp → (3) gộp `main` vào nhánh này, chạy lại cổng → rẽ:
  nhánh khuyên «(4a) anh cài chợ delivery-loop trên máy (bước 2.4) → (5a) gộp PR này → phiên mới nạp 6 plugin 3.0»;
  nhánh khác «(4b) gộp PR này → khoảng trống: phiên mới không có plugin kit, kit-root in rỗng → (5b) anh cài chợ».
- AC liên quan: AC-2 (đo lại sau ký), Known limit (1). Nhãn bằng chữ tiếng Việt.
