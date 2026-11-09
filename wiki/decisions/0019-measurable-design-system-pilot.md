---
type: decision
title: Tối ưu hệ design theo số lần làm lại, thử thật cho kit
links:
  [
    wiki/decisions/0015-measurable-design-gate.md,
    wiki/decisions/0017-actor-surface-coverage-pilot.md,
    docs/plan/lo-trinh.json,
    docs/plan/dot-nen/hang-viec.json,
  ]
sources:
  [
    "user, 2026-11-10",
    "onehub-quy-hang docs/plan/ma-tran-kiem-ke-design-claude-code.md",
    "onehub-quy-hang docs/plan/dong-nhat-bang-hang-lien-he.md",
    "onehub-quy-hang docs/adr/0019-cong-chon-khoi.md",
    "acceptance-gate-kit docs/findings/2026-11-01-ban-do-khuon-vao-kit.md",
  ]
---

# 0019 Tối ưu hệ design theo số lần làm lại, thử thật cho kit

Số 0018 để trống vì `AGENTS.md` đang trỏ ADR-0018 của Quỹ hàng về giới hạn cấu hình theo sàn.

## Status

Accepted, 2026-11-10.

## Context

Ở Quỹ hàng, 55% số lần làm lại nằm ở bài kiểm và hạ tầng, 15% ở trạng thái và hành vi, 5% ở chọn thành phần, 0% ở màu. Trong sổ quyết định của kho này, tầng hành vi chưa có quyết định nào có kiểm, còn tầng màu đã có phần lớn. Tỉ lệ 53% quyết định có kiểm vì tính ngang nhau nên che mất điều đó.

Ở ca màn Liên hệ, cổng ba lối chấm đồng nhất theo tên thành phần: cùng DataGrid nên ghi là khớp Bảng hàng, sau đó kiểm ra 43 chỗ khác, 25 chỗ vô cớ. Thứ tự Trong kho, ReUI, Vẽ tay là một cái thang nhưng được trình như thực đơn. Trong 15 vòng, không có số đo nào cho thấy cổng làm các agent bớt khác nhau.

## Decision

Tách ba quyết định mà cổng đang gộp, và xếp ưu tiên theo số lần làm lại.

- Họ màn và màn mẫu: người quyết một lần mỗi họ. Mỗi họ có một câu triết lý kiểm được. Họ Lưới là thay Sheet và Excel cho Đầu chủ. Màn chỉ thành màn mẫu khi đạt đủ ma trận trạng thái.
- Thang Trong kho, ReUI, Vẽ tay: rơi xuống bậc dưới phải nêu đã tra gì, ứng viên gần nhất, vì sao không dùng được.
- Trình ở cổng: màn thuộc họ đã có thì một bản thật cạnh màn mẫu, cùng dữ liệu, kèm bảng từng chỗ khác có lý do hay không. Họ mới thì hai đến ba hướng thật sự khác nhau.
- Năm hàng: `1e` hành vi nằm trong Lưới và khung, `1f` bộ bài kiểm sinh từ sổ màn, `1c` đổi thành cổng chứng minh có màn mẫu, `1g` danh mục ReUI máy đọc được, `1h` số đo mỗi vòng và mốc đối chứng.

Không chọn:

- Chép bộ mã cổng ba lối từ Quỹ hàng: rào đó lọt 4 trên 16 lần vì không nối CI, và sẽ thành một bản nữa phải giữ.
- Chờ kit làm trước: mục tương ứng của kit đang chờ một kho thử qua ít nhất ba vòng.

## Consequences

- Đây là đợt chạy thật cho kit. Kho giữ giá trị, kit giữ cơ chế. Số đo báo về kit: ít nhất ba vòng cho mục chụp cạnh màn mẫu, 10 vòng cho issue 490.
- Mốc đối chứng phải đo trước khi hàng `1a` gộp, vì kho mới sạch tự nó đã bớt lệch.
- Đợt `nen` có 15 hàng trên bốn dãy. Dãy giao diện đổi tên từ G sang K vì kit dùng G làm đích của giám sát (issue 480 của kit).
- Nhất quán không chứng minh trải nghiệm tốt. Nhóm số đo với người dùng thật vẫn là thước riêng.
