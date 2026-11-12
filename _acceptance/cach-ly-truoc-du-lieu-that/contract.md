---
schema_version: 1
feature: Bộ kiểm cách ly giữa các sàn bắt thêm tám kẽ hở đã nêu ở hàng 7 trước khi nối dữ liệu thật
slug: cach-ly-truoc-du-lieu-that
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: _acceptance/cach-ly-truoc-du-lieu-that/design.md
---

# Acceptance Contract: cach-ly-truoc-du-lieu-that

## Context

Hàng 7 dựng nền cách ly giữa các sàn và bộ kiểm cách ly. Ở Cổng Bằng chứng của hàng 7, chủ kho chọn mở hợp đồng mới cho
tám mục mà bộ kiểm chưa bắt (Ngoài-1, 4, 5, 6, 14, 19, 20, 30). Hàng 7a đóng các kẽ hở ấy bằng ca kiểm đỏ được khi phá,
trước hàng 10 (nối dữ liệu thật). Luật chạm: SP-1 — chỉ siết, không nới ở đâu.

Source input: hàng 7a của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/cach-ly-truoc-du-lieu-that/opportunity.md`
đã quyết «build» bởi Manh Phan; tám mục trong `_acceptance/cach-ly-moi-san/review-findings.md` và `decisions.jsonl`.

## Criteria

- AC-1 (Ngoài-30): Given hai sàn A, B dưới vai của API với sàn A, When A thêm một thoả thuận đứng tên A và sửa một thoả
  thuận của A, Then mỗi lệnh chạm đúng một dòng và đọc lại thấy dòng đã thêm, giá trị đã sửa; khi quyền thêm của vai bị
  rút thì bộ kiểm đỏ với dòng ghim `HỎNG a-ghi-duoc-dong-cua-minh`.
- AC-2 (Ngoài-4, 6, 20): Given cơ sở dữ liệu đã áp mọi migration, When bộ kiểm đọc quyền của vai API trên mọi bảng, dạng
  xem ở mọi schema không phải hệ thống — gồm quyền cấp thẳng, qua PUBLIC và qua vai mẹ — và thử xoá sạch bảng thoả thuận
  dưới vai API, Then không có quyền TRUNCATE, TRIGGER, REFERENCES nào và lệnh xoá sạch bị từ chối; cấp xoá sạch cho vai,
  hay cấp gắn trigger cho PUBLIC, làm bộ kiểm đỏ với dòng ghim nêu tên bảng và quyền.
- AC-3 (Ngoài-19, bảng mới thiếu luật): Given cơ sở dữ liệu đã áp mọi migration, When bộ kiểm liệt mọi bảng thường, phân
  vùng, ngoại mà vai API có bất kỳ quyền nào ở BẤT KỲ schema nào, Then mỗi bảng bật và ép luật theo dòng, vai không có
  quyền tạo ở schema nào và không vào được schema danh tính; một bảng có cột sàn ở schema mới, hay một bảng ở `public`
  không cột sàn, không luật mà cấp cho vai, làm bộ kiểm đỏ với dòng ghim nêu schema và tên bảng.
- AC-4 (Ngoài-4, 14, 19): Given cơ sở dữ liệu đã áp mọi migration, When bộ kiểm liệt mọi dạng xem vai API đọc được, Then
  mỗi dạng xem chạy theo quyền người đọc và không dạng xem vật chất hoá nào cấp cho vai; một dạng xem thường trên bảng
  thoả thuận, hay một dạng xem vật chất hoá cấp cho vai, làm bộ kiểm đỏ với dòng ghim nêu tên dạng xem.
- AC-5 (Ngoài-4, 14, 19): Given cơ sở dữ liệu đã áp mọi migration, When bộ kiểm liệt mọi hàm chạy bằng quyền người tạo
  mà vai API gọi được (trực tiếp hay qua PUBLIC) hoặc mà một trigger trên bảng vai chạm được gọi tới, Then tập ấy bằng
  đúng danh sách viết tay 10 hàm (schema, tên, chủ `quy_hang_identity`) và mỗi hàm ghim đường tìm; thêm một hàm đặc quyền
  gọi được qua PUBLIC, hay một hàm trigger đặc quyền trên bảng thoả thuận, làm bộ kiểm đỏ với dòng ghim nêu tên hàm.
- AC-6 (Ngoài-5): Given mã nguồn trong `src`, When bài quét một cửa đọc từng tệp ngoài cửa, Then không tệp nào chứa câu
  đổi vai (`set role`, `reset role`, `set session authorization`, `reset all`, `discard all`) hay đặt biến của phiên
  (`set_config(`, `set app.…`), viết hoa hay thường, xuống dòng hay không; tệp sạch đi qua cửa không bị nêu, và mỗi dạng
  trong ma trận viết trước bị nêu đúng tệp, đúng dòng.
- AC-7 (Ngoài-1): Given cơ sở dữ liệu đã áp mọi migration, When bài kiểm so tập giá trị loại, chiều, trạng thái mà bảng
  thoả thuận nhận với tập của `ontology/entities/Agreement.yaml`, Then hai tập bằng nhau từng giá trị, và thêm một
  thoả thuận mỗi loại của mô hình đều được bảng nhận; mô hình có một loại bảng không nhận, hay bảng nhận một loại mô hình
  không có, làm bài kiểm đỏ với thông điệp nêu giá trị lệch.
- AC-8 (Ngoài-1): Given cơ sở dữ liệu đã áp mọi migration, When bài kiểm liệt các ràng buộc kiểm của bảng thoả thuận ngoài
  bốn ràng buộc dạng cột và ràng buộc thời hạn, Then mỗi ràng buộc ứng với đúng một luật có tên trong
  `ontology/entities/Agreement.yaml` mà `implemented_in` trỏ tới migration chứa nó; ràng buộc mới không có luật, hay luật
  trỏ tới ràng buộc không còn, làm bài kiểm đỏ với thông điệp nêu tên ràng buộc.
- AC-9: Given Postgres của dãy, When chạy bộ kiểm cách ly trên bản lành, Then lần áp migration thứ hai không áp gì, mọi ca
  cũ và năm ca SQL mới in `ok` đúng một lần, năm ca phá thử mới đỏ với dòng ghim, và dòng cuối là
  `cach-ly: 29 ca đạt, vai quy_hang_app`; một tệp phá bị xoá, không còn làm đỏ, hay lỗi cú pháp thì bộ chạy in `HỎNG pha-thu-<ca>: <tệp>: …` và không in dòng 29 ca đạt.

## Coverage

Phạm vi đã chốt bằng tám mục chủ kho chọn ở Cổng Bằng chứng hàng 7 — bỏ quét không gian, xem dòng `bỏ coverage-scan`
trong sổ quyết định. Bảng phủ tay:

| Mục hàng 7 | Kẽ hở | AC |
|---|---|---|
| Ngoài-1 | bảng thoả thuận lệch mô hình | AC-7, AC-8 |
| Ngoài-4 | dạng xem, hàm đặc quyền, quyền xoá sạch | AC-2, AC-4, AC-5 |
| Ngoài-5 | mã trong cửa đổi vai, đổi sàn — đóng một phần: câu viết thẳng; gốc (vai đăng nhập) đề xuất hàng riêng | AC-6 |
| Ngoài-6 | quyền xoá sạch và quyền bảng khác | AC-2 |
| Ngoài-14 | dạng xem, hàm đặc quyền, schema khác | AC-3, AC-4, AC-5 |
| Ngoài-19 | dạng xem, dạng xem vật chất hoá, hàm đặc quyền, schema khác | AC-3, AC-4, AC-5 |
| Ngoài-20 | TRUNCATE, TRIGGER, REFERENCES của vai API | AC-2 |
| Ngoài-30 | sàn ghi được dòng của mình | AC-1 |

Trục lối vào của quyền (cấp thẳng · qua PUBLIC · qua vai mẹ) phủ ở AC-2 và AC-5; trục chiều (xanh trên bản lành · đỏ trên
bản phá) phủ ở mọi AC.

## Đường đo

| Thước của ô cơ hội | Số từ đâu | AC bảo đảm |
|---|---|---|
| Mỗi kẽ hở trong tám mục có một ca kiểm đỏ được khi phá | dòng `ok pha-thu-<ca>` của bộ chạy cách ly và ca phá của bài kiểm cơ sở dữ liệu, bài quét một cửa | AC-1 đến AC-9 |

## Out of scope

- Đổi vai đăng nhập của ứng dụng sang một vai không phải chủ, để `reset role` trong cửa không đưa về vai chủ — việc
  đóng tận gốc kẽ hở K3; đề xuất thành hàng lộ trình riêng trước hàng 10.
- Chạy bộ kiểm cách ly trên CI (Ngoài-3 của hàng 7, chủ kho ghi giới hạn đã biết).
- Quét luật viết lại câu (CREATE RULE) và trigger sự kiện.
- Luật riêng của loại «xử lý bằng AI» ở Quỹ hàng (mỗi sàn một thoả thuận, chỉ quản trị sàn được thêm) — thuộc hàng nhập
  bằng AI.

## Notes

- Hỏi-1 (chủ kho, Cổng Phạm vi): bảng nhận đủ tám loại thoả thuận hay mô hình rút về sáu; ghi hai luật của bảng vào mô
  hình hay không. Kế hoạch viết theo lối khuyên (tám loại · ghi hai luật); chủ kho chọn khác thì AC-7, AC-8 và migration
  đổi theo.
- Migration 005 chỉ đúng khi hàng 9a gộp trước với 004 (giám sát, C-1211-2).
- Known limits: luật quét một cửa chỉ bắt câu viết thẳng trong mã nguồn — câu ghép lúc chạy không bị bắt (AC-6).
