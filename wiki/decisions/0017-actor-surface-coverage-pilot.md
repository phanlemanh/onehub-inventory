---
type: decision
title: Thử khối Vai × Màn ở mỗi vòng
links:
  [
    wiki/decisions/0016-permission-model.md,
    docs/plan/lo-trinh.json,
    docs/plan/dot-nen/hang-viec.json,
  ]
sources:
  [
    "user, 2026-11-10",
    "https://github.com/phanlemanh/acceptance-gate-kit/issues/490",
    "onehub-quy-hang _acceptance/*/contract.md",
  ]
---

# 0017 Thử khối Vai × Màn ở mỗi vòng

## Status

Accepted, 2026-11-10.

## Context

Feature-loop của kit mặc định quét phủ, nhưng máy chỉ kiểm mục Độ phủ có mặt, không kiểm có đủ vai và màn hay không, và bài chấm giao diện không đăng nhập theo vai. Ở Quỹ hàng, trong 98 hợp đồng chạm giao diện chỉ khoảng 33 nhắc cả vai lẫn màn (đếm theo từ khoá, nên là ước lượng). Lỗi sửa hàng không kiểm vai nằm ở mảng đã có hai vòng quét nhưng không có trục vai. Đã đề xuất với kit, và kit cần số đo từ một kho thử.

## Decision

Thử ở kho này, ở cấp kho, trước khi kit chuẩn hoá.

- Hàng `1d` khai danh sách vai và sổ màn cho máy đọc. Trang chưa khai thì kiểm tra đỏ. Hợp đồng của vòng chạm màn hoặc quyền phải có khối Vai × Màn, danh sách vai lấy từ khai báo, thiếu vai thì đỏ. Vai không liên quan vẫn phải ghi kèm lý do.
- Hàng `9b` chạy bài kiểm trình duyệt theo sổ màn, đủ mọi cặp vai và màn ở bốn khổ, gồm cả đường bị từ chối.
- Máy chỉ kiểm đủ ô. Đúng hay sai vẫn do người xét ở Cổng Phạm vi.

Hàng `1d` đặt trước hàng `2` để có số liệu từ vòng giao diện đầu tiên.

## Consequences

- Số đo:
  - Tỉ lệ vòng chạm màn hoặc quyền có đủ ô, so với mốc khoảng 33/98 của Quỹ hàng.
  - Tỉ lệ ô ghi «không liên quan», để thấy khối có bị điền cho qua không.
  - Số lỗi sai quyền lọt qua Cổng Bằng chứng.
  - Đối chứng âm: bỏ một vai khỏi khối, hoặc gỡ chặn một cặp không được vào, thì kiểm tra phải đỏ.
- Sau 10 vòng có khối này, báo số đo về issue 490 của kit. 10 là ngưỡng ít dữ liệu của chính kit.
- `make e2e` chưa chạy trong CI. Cho đến khi chủ kho thêm vào, phần của hàng `9b` chỉ được giữ ở máy, chưa phải ở CI.
- Khi kit có bản chuẩn hoá, kho này chuyển sang bản của kit và bỏ kiểm tra cấp kho.
