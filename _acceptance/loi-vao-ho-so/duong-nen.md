---
slug: loi-vao-ho-so
at: 2026-11-12T23:56:27.111Z
sha: f7f17b19433559713646afc086201079eb45f32e
nen: do
cong_cu: xanh
suite: do
luoi: xanh
engine: xanh
---

## Dòng đỏ

- nen suite: DO SAN executors.script.check ma 2
- nen suite: DO SAN executors.script.e2e ma 2

## Dòng vàng

- nen luoi: 1 vi pham cua chinh vong (khong tinh)
- VIOLATION [loi-vao-ho-so]: hồ sơ có bằng chứng nhưng status chưa arm cổng — status=draft; PR đổi code chịu cổng (design/screens.yaml…) mà hồ sơ trong PR chưa arm. Cổng chỉ chấm hồ sơ ở implemented/verified/signed-off, hồ sơ này đang tàng hình. Đặt status: implemented để cổng chấm, hoặc gỡ evidence-report.md / tách hồ sơ khỏi PR nếu bằng chứng thuộc phạm vi đã bỏ.

## Đọc lại của dãy R (2026-11-13)

- Kiểm định dạng đỏ vì `.claude/launch.json` đã sửa cục bộ để chạy máy chủ thử ở cổng 3491, chưa commit — tệp đã hoàn lại; không phải lỗi của nền hay của hàng.
- Bộ trình duyệt: 799 xanh, 4 hết giờ ở 1440 (hồ sơ căn, bộ bài sinh từ sổ màn, ngăn chờ) khi tải máy trung bình 23; lần chạy trước trên cùng cây 803/803 xanh. Hàng chưa đổi mã sản phẩm nào; chạy lại ở lượt chấm.
