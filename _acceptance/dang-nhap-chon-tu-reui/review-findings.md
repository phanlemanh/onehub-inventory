# Review findings: dang-nhap-chon-tu-reui

## Trong hợp đồng

- **Hình dạng 5 — tuyên quét LỚP (bốn khổ × sáng và tối) nhưng ma trận chỉ phủ nền sáng**
  file: `tests/e2e/dang-nhap-khoi.spec.ts:56`
  severity: medium
  AC: AC-5
  source: measurement
  detail: Dòng 2 của evals.yaml (ghi chú đầu tệp) gán cả bài là «bốn khổ, sáng và tối». E5 (evals.yaml) đòi 'khong-cuon-ngang' và 'nut-trong-man-dau' «xanh ở bốn khổ, sáng và tối». Nhưng hai ca này (dòng 56-70) không gọi page.emulateMedia, nên chỉ chạy ở chế độ màu mặc định của Playwright, tức nền sáng. Bốn khổ đến từ các project trong playwright.config.ts, còn chiều sáng/tối không có project nào lặp lại. 'dang-cua-khoi' và 'khong-dang-nhap-ngoai' cũng vậy. Chỉ 'logo-doc-duoc-nen-toi' (chỉ nền tối) và 'axe-dang-nhap' (vòng lặp light/dark) đổi chế độ màu. Như vậy lời hứa nói phủ 4×2 ô, còn hai ca bố cục của E5 chỉ đo 4×1. Nếu ở nền tối có tràn ngang hoặc nút bị đẩy khỏi màn đầu thì không ca nào đỏ. Bản ghi phá thử cũng xác nhận: pha-thu-day-nut chỉ chạy ở nền sáng, khổ 360.
  rationale: AC-5 đòi không cuộn ngang và nút «Gửi mã» nằm trong khung nhìn đầu ở bốn khổ, nền sáng và tối; ca kiểm chỉ chạy nền sáng nên nửa điều kiện nền tối của AC-5 không được chứng minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
