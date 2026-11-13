---
slug: lop-rieng-cua-san
at: 2026-11-13T11:05:00Z
route: /proto/lop-rieng-cua-san (dev server trên Postgres dãy R, người đăng nhập vai Quản trị sàn)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/lop-rieng-cua-san/cong-pham-vi.html (trang cổng, hai lối so ngang) · ảnh ở cong/ · khối gốc ở evidence/reui/
divergence: opened
ds_skill: inventory-ui
states: [a-truong, b-dau-trang, b-ca-trang, a-can-cho, bang-hang, bang-hang-cuon-phai, a-mau-2c]
breakpoints: [mobile-360, desktop-1440]
themes: [light]
patched: 6
deferred: 0
---
# design-pass — lop-rieng-cua-san (làm lại sau rà soát cổng 2026-11-13)

Lần đầu trình ba lối A, B, C bị trả lại (rà soát: `.acceptance-runs/dieu-phoi-nen/trinh/ra-soat-cong-7e/`). Lần này
câu hỏi đặt lại: năm bảng riêng (A) hay một trang danh sách gọn thấy hết (B). Lối thẻ tab bị loại vì phần lớn khung hình
giống A.

- A dựng trong cột thứ hai thật của App Shell: bản mẫu thêm một mục thanh bên chỉ ở bản phát triển (`src/app/(app)/nav.ts`,
  `PROTO_NAV`), năm phần là năm mục như góc nhìn của 2c. Gỡ trước lượt chấm; bản dựng thêm mục thật.
- B dựng theo hình khối ReUI settings-4 (ảnh gốc chụp trước khi dựng lại: `evidence/reui/settings-4-goc-1440.png`), chưa
  phải mã khối vì máy chủ ReUI lỗi đăng nhập. Giữ khung, nhóm có tiêu đề và một dòng, dòng gọn có «…»; bỏ nút thêm mới
  (Hỏi-2), biểu tượng hãng, tiêu đề khung (trùng tiêu đề trang); nhãn trạng thái chỉ ở Căn chờ khớp.
- Ảnh chụp bằng Playwright trên Postgres dãy R, người vai Quản trị sàn của [Sàn mẫu Ocean]; ô «Gõ để tìm» của vùng ẩn
  trong bản mẫu (bỏ theo hàng 2e). Cùng dữ liệu mẫu cho hai lối.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| a-can-cho | 1440 | light | cong/a-can-cho-1440-sang.png |
| a-mau-2c | 1440 | light | cong/a-mau-2c-1440-sang.png |
| a-truong | 1440 | light | cong/a-truong-1440-sang.png |
| a-truong | 360 | light | cong/a-truong-360-sang.png |
| b-ca-trang | 1440 | light | cong/b-ca-trang-1440-sang.png |
| b-ca-trang | 360 | light | cong/b-ca-trang-360-sang.png |
| b-dau-trang | 1440 | light | cong/b-dau-trang-1440-sang.png |
| b-dau-trang | 360 | light | cong/b-dau-trang-360-sang.png |
| bang-hang | 1440 | light | cong/bang-hang-1440-sang.png |
| bang-hang-cuon-phai | 1440 | light | cong/bang-hang-cuon-phai-1440-sang.png |

## Findings

- Đã sửa sáu lỗi của lần trình đầu: A không ở cột thứ hai; B, C không giống khối; ảnh không cùng điều kiện; bảng ba dòng
  trong khung cao hết màn; ảnh chưa đăng nhập, có dải «Bản mẫu» và ô tìm đã bỏ; danh sách năm phần căn giữa.
- Sửa sau lần soát của giám sát: hai ảnh Bảng hàng từng trùng ảnh lối A (cookie chọn dáng không đổi), nay chụp đúng và cắt
  đúng vùng Bảng hàng; B chụp từ đầu trang, mỗi phần ba dòng như khối gốc, thêm ảnh cả trang.
- Ảnh tối và trạng thái (rỗng, lỗi, chỉ đọc) để sau khi anh chọn lối.
