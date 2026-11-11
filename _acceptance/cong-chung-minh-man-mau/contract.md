---
schema_version: 1
feature: Vòng dựng màn phải chứng minh giải được và đồng nhất với màn mẫu trước khi trình, rời khỏi thang Trong kho, ReUI, Vẽ tay thì phải nêu căn cứ
slug: cong-chung-minh-man-mau
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: _acceptance/cong-chung-minh-man-mau/design.md
---

# Acceptance Contract: cong-chung-minh-man-mau

## Context

Quyết định 0019 thay cổng chọn khối của Quỹ hàng, vốn chấm đồng nhất theo tên thành phần. Vòng này cho kho một lưới chứng minh
màn: máy suy lối của từng màn (họ mới · màn mẫu mới · theo mẫu) từ sổ màn và bản đồ khuôn, rồi đỏ khi vòng chưa chứng minh
đúng lối ấy; cộng họ Lưới khai trong bản đồ khuôn và hướng dẫn trong skill giao diện. Hạng T3 vì lưới nằm trong `tools/`.

Source input: hàng `1c` của `docs/plan/lo-trinh.json`, ô `_acceptance/cong-chung-minh-man-mau/opportunity.md`.

Trong bài dưới, «kho mẫu» là một kho dựng trong thư mục tạm có `design/screens.yaml`, `design/states.md`,
`design/component-registry.json`, `design/reui-catalog.json`, `design/patterns/` và các hồ sơ `_acceptance/<slug>/`;
«lưới» là `python3 tools/proof_gate/check.py --root <kho>`.

## Criteria

- AC-1: Given kho mẫu có hồ sơ với mọi trạng thái hợp đồng (`draft`, `approved`, `implemented`, `verified`, `signed-off`,
  `machine-cleared`) × ba loại khai màn (một màn Lưới thiếu tệp chứng minh, chỉ màn `dev`, `screens: []`), When chạy lưới,
  Then đỏ đúng hai ô (màn Lưới thiếu chứng minh ở `implemented` và `verified`), mỗi dòng gọi tên hồ sơ, màn và mã
  `thieu-chung-minh`; các ô khác im; và `--report` luôn thoát 0, đếm hồ sơ đã đóng vào «trước cổng», đếm số màn theo từng lối, số chỗ lệch có lý do và vô cớ,
  và số khối rơi khỏi «trong kho».
- AC-2: Given màn theo mẫu (họ có màn mẫu khác nó), When tệp chứng minh thiếu ảnh ở một khổ so của họ, ảnh không có, ảnh không
  phải PNG, bề ngang ảnh khác khổ, hai ảnh một khổ trùng byte, hay nhãn dữ liệu rỗng, Then lưới đỏ với mã riêng cho từng ca;
  và xanh khi đủ cặp ảnh mọi khổ.
- AC-3: Given màn theo mẫu, When bảng mặt so thiếu một mặt của họ, hay một dòng `giống` không chỉ ảnh nào, Then lưới đỏ gọi tên
  mặt; dòng `giống` mà căn cứ chỉ gồm tên thành phần có trong kho hay danh mục ReUI thì mang cờ `ten-thanh-phan` («chấm theo
  tên thành phần»).
- AC-4: Given màn theo mẫu, When bảng có dòng `khác — vô cớ`, hay dòng `khác — có lý do` mà căn cứ không trỏ tệp có thật trong
  kho hay mã quyết định có thật, Then lưới đỏ, dòng tổng in đúng số chỗ lệch vô cớ; dòng có lý do với căn cứ thật thì im.
- AC-5: Given hai bản phát lại ca màn Liên hệ của Quỹ hàng (màn `contacts` theo màn mẫu `inventory`): lời của cổng cũ (mọi mặt
  `giống` vì «cùng DataGrid», không ảnh) và bảng thật của bản kiểm (43 chỗ khác, 18 có lý do, 25 vô cớ), cả hai ghim kho, commit và mục gốc của bản kiểm ở Quỹ hàng, When chạy lưới trên
  từng bản, Then cả hai đỏ: bản một gắn cờ `ten-thanh-phan` trên đủ 12 mặt và báo thiếu ảnh; bản hai in «25 chỗ lệch vô cớ».
- AC-6: Given màn thuộc họ có tệp bản đồ ghi `Màn: chưa có`, hay ghi `Màn: <id của chính màn ấy>`, When ma trận trạng thái của tệp chứng minh thiếu một trạng thái của
  `design/states.md`, ghi «đạt» mà tệp bài kiểm không có, hay ghi «không áp» không lý do, Then lưới đỏ gọi tên trạng thái;
  đủ ma trận thì xanh; và tệp bản đồ ghi `Màn: <id>` mà không tệp chứng minh nào (hồ sơ mở hay đã đóng) chứng đủ ma trận cho màn
  ấy thì đỏ `man-mau-chua-dat`.
- AC-7: Given màn họ mới (`family` null hay họ chưa có tệp bản đồ) ở hồ sơ từ `approved`, When bảng hướng có dưới hai hướng, hai
  hướng cùng một ảnh (trùng byte), một hướng thiếu ảnh, động cơ hay đánh đổi, hoặc số hướng được chọn khác một, Then lưới đỏ
  với mã riêng; hồ sơ `draft` thì im.
- AC-8: Given bảng khối của bất kỳ lối nào, When tệp chứng minh không có bảng khối hay bảng không có dòng nào (mã
  `thieu-bang-khoi`), khối bậc `trong-kho` không có tên trong `design/component-registry.json`, khối
  bậc `reui` không có tên trong `design/reui-catalog.json`, hay khối rơi khỏi `trong-kho` thiếu đã tra, ứng viên gần nhất (tên có
  thật trong kho hay danh mục) hoặc vì sao không dùng, Then lưới đỏ gọi tên khối với mã `roi-bac-thieu-can-cu` hay
  `khoi-khong-co`; bậc khác ba bậc cũng đỏ.
- AC-9: Given kho thật, When chạy `make test`, Then bài «kho thật» của `tools/proof_gate/proof-gate.test.ts` chạy lưới trên chính
  kho và xanh; trên bản sao kho có thêm một hồ sơ `implemented` khai màn `inventory` không tệp chứng minh thì cùng bài thấy đỏ;
  và `design/patterns/luoi.md` qua bộ đọc bản đồ khuôn của kit không lỗi lược đồ, mang đủ bốn mục Triết lý, Màn mẫu
  (`Màn: chưa có`), Khổ so (360, 414, 1024, 1440), Mặt so (12 mặt).
- AC-10: Given skill `.claude/skills/inventory-ui/SKILL.md`, khuôn `tools/proof_gate/khuon-chung-minh.md` và
  `design/patterns/luoi.md`, When một agent dựng màn đọc chúng, Then nó biết lối nào áp cho màn của mình, phải làm tệp chứng minh
  nào trước khi trình, rơi bậc phải ghi gì, và chạy lệnh nào để tự kiểm; dòng tra danh mục ReUI của hàng 1g còn nguyên.
  (judgment)

## Coverage

Quét trục tại chỗ theo khuôn quét hình thái (không gọi skill: không gian kê hết được từ quyết định 0019).

- Trục lối: họ mới | màn mẫu mới | theo mẫu. AC-7, AC-6, AC-2–AC-4; thang chung mọi lối AC-8.
- Trục trạng thái hồ sơ: `draft` | `approved` | `implemented` | `verified` | đã đóng. AC-1 (kê đủ), AC-7 (`approved`).
- Trục khai màn: màn sản phẩm | chỉ `dev` | rỗng. AC-1.
- Trục vật chứng theo mẫu: ảnh (thiếu khổ · không có · không PNG · lệch khổ · trùng byte · nhãn rỗng) | mặt so (thiếu mặt ·
  giống không ảnh · tên thành phần) | chỗ lệch (vô cớ · lý do không căn cứ · lý do thật). AC-2, AC-3, AC-4.
- Trục thang: trong kho | ReUI | vẽ tay | bậc lạ. AC-8.
- Trục màn mẫu: chưa có | là chính màn này | màn khác, đạt | màn khác, chưa đạt. AC-6, AC-2–AC-4.
- Trục chỗ chạy: kho mẫu | ca phát lại | kho thật trong `make test`. AC-1–AC-8, AC-5, AC-9.
- Trục người đọc: agent dựng màn (skill, khuôn). AC-10.

## Đường đo

- Thước: màn thuộc họ đã có mà thiếu ảnh cạnh màn mẫu hoặc còn chỗ lệch vô cớ thì đỏ · số từ: lưới trong `make test` · bảo đảm
  bởi: AC-2, AC-3, AC-4, AC-9
- Thước: họ mới thiếu hai hướng thì đỏ · số từ: lưới · bảo đảm bởi: AC-7
- Thước: rơi xuống bậc dưới mà thiếu căn cứ thì đỏ · số từ: lưới · bảo đảm bởi: AC-8
- Thước: phát lại ca màn Liên hệ của Quỹ hàng thì bị gắn cờ · số từ: hai bản phát lại trong `proof-gate.test.ts` · bảo đảm bởi:
  AC-5
- Thước cho kit (số vòng theo lối, lệch có lý do / vô cớ, rơi bậc) · số từ: `check.py --report` · bảo đảm bởi: AC-1

## Out of scope

- In tệp chứng minh và ảnh lên thẻ cổng của kit (mục chờ KH2, KH3 của kit).
- Tự chụp ảnh hay so ảnh từng điểm ảnh; bảng mặt so do vòng lập, người soi ở cổng.
- Gán họ cho màn Hôm nay và các màn chưa có họ trong `design/screens.yaml`.
- Sửa `mk/`, `Makefile`, `_acceptance/config.yaml` hay `tools/reui_catalog/`.
- Ghi bản số đo cho hồ sơ đã đóng, hay chứng minh ngược các màn đã có.

## Notes

- Hạng T3 theo `risk_tiers.t3_paths` (`tools/**`).
- Lúc thiết kế, nhánh chính và các nhánh đang mở không có hồ sơ còn mở nào khai màn sản phẩm, nên gộp hàng này không làm đỏ
  vòng nào đang chạy. Từ khi gộp, vòng nào khai màn sản phẩm phải có tệp chứng minh trước lượt chấm.
