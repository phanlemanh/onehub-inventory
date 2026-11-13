# Quét độ phủ — da-gui-tren-luoi (preset entity-feature)

## Ngữ cảnh

- Sản phẩm: onehub-inventory, màn Đã gửi đọc link mẫu — chân sản phẩm: đào kho (`docs/tri-thuc/wiki/chu-de/da-gui-va-trang-khach.md`,
  `docs/plan/pham-vi-mvp-dot-1.md`, `ontology/roles.yaml`) · chân ngành: theo dõi link chia sẻ của DocSend và HubSpot
  Documents (mỗi link: người nhận, lượt xem, lần xem gần nhất) `[NGÀNH: DocSend, HubSpot Documents]`.

## Trục

- Trục A — dạng một link trên màn: chưa mở | đã mở, không quan tâm căn nào | có quan tâm | đã tắt hay hết hạn
  [thước CE: luật của `ontology/entities/ShareLink.yaml` + sổ bối cảnh `[SUY-TỪ-REPO: docs/tri-thuc/wiki/chu-de/da-gui-va-trang-khach.md]`]
- Trục B — cỡ dữ liệu: 1 căn | 30 căn (trần một lần gửi) | tên người nhận dài | số đếm lớn (hàng nghìn lượt mở)
  [thước CE: sổ bối cảnh «một Lần gửi tối đa 30 căn»; `design/states.md` dòng Chữ dài]
- Trục C — vai × phạm vi: Đầu khách của mình | Đầu chủ của mình | Trưởng nhóm cả đội | Quản trị sàn
  [thước CE: `[SUY-TỪ-REPO: ontology/roles.yaml]`]
- Trục D — vào và ra của màn: vào từ dữ liệu mẫu | vào từ dữ liệu thật · ra ngăn chi tiết | ra sao chép hay gửi lại link |
  ra xuất bảng [thước CE: `[NGÀNH: DocSend, HubSpot Documents]` có sao chép link và xuất số liệu]

Cross-cutting (khổ, sáng tối, trạng thái vùng, môi trường) đã cố định bởi `design/states.md` và `design/patterns/luoi.md`,
không thành trục.

## Core (≈20% ô có nghĩa)

1. A chưa mở · A đã mở không quan tâm · A có quan tâm, trên dữ liệu mẫu — AC-1, AC-2 (ba dạng link thật sự khác nhau trên màn).
2. B 1 căn · B 30 căn · B tên dài — AC-1, AC-5, AC-9 (biên của cột số và cột đầu).
3. D ra ngăn chi tiết — AC-5 (quyết định 0024).

## Later

- A đã tắt hay hết hạn — hàng 17 (K8).
- B số đếm lớn (hàng nghìn lượt mở) — dữ liệu thật của hàng 18; cột số đếm của Lưới đã có độ dài mẫu.
- C bốn vai với phạm vi thật — bảng quyền của hàng 18; hàng này khai ý định ở Vai × Màn.
- C chuyển giao link khi người gửi nghỉ — hàng 18a.
- D dữ liệu thật — hàng 18; D sao chép hay gửi lại link — hàng 16.
- Dữ liệu cá nhân của người nhận (khung pháp lý về dữ liệu cá nhân của Việt Nam, ⏱ cần tra bản hiện hành) — hàng 18 khi
  người nhận thành khách được lưu `[GIẢ ĐỊNH: chưa tra bản luật hiện hành ở vòng này]`.

## Never

- D xuất bảng — bản phạm vi bỏ xuất bảng (L3, `docs/plan/pham-vi-mvp-dot-1.md`).
