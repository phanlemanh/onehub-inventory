---
type: decision
title: Tin rao giữ giá trị riêng của thuộc tính căn
links:
  [
    wiki/entities/listing.md,
    ontology/entities/Listing.yaml,
    db/migrations/020_tin_rao_gia_tri_rieng.sql,
    src/modules/listings/unit-attributes.ts,
    src/modules/listings/ui/listing-record-full.tsx,
    src/modules/listings/ui/listing-paste.ts,
    design/behaviors.md,
    design/decisions.yaml,
  ]
sources:
  [
    "user, 2026-11-27 (Cổng Phạm vi hàng 3h; «Duyệt cả bốn nhóm» ở phiên BH; «Theo luật mới» ở phiên R)",
    _acceptance/tin-rao-giu-gia-tri-rieng/contract.md,
    _acceptance/tin-rao-giu-gia-tri-rieng/decisions.jsonl,
  ]
---

# 0054 Tin rao giữ giá trị riêng của thuộc tính căn

## Status

Accepted, 2026-11-27, ở hàng 3h. Chủ kho duyệt Cổng Phạm vi và kế hoạch tại phiên R («Kế hoạch 3h · duyệt hay sửa:
duyệt»). Bốn nhóm thân hồ sơ A–D được duyệt sau Cổng Phạm vi tại phiên BH, nguyên văn «Duyệt cả bốn nhóm». Dòng lý do
thay nút bị chặn được duyệt tại phiên R, nguyên văn «Theo luật mới».

## Context

Danh bạ căn (danh mục) là dữ liệu dùng chung của mọi sàn, nên sàn không được sửa. Khi một sàn biết diện tích, tầng,
phòng ngủ, hướng hay loại hình của căn khác với danh mục, trước hàng này sàn không có chỗ ghi điều mình biết. Quỹ hàng và
onehub-invest đều cho tin rao giữ giá trị của chính nó, còn danh mục chỉ làm giàu.

## Decision

- Mỗi tin rao có thể giữ năm giá trị riêng: Diện tích, Tầng, Phòng ngủ, Hướng, Loại hình. Tên theo RESO của căn. Mỗi giá
  trị nhớ nguồn của nó (`AttributeSource`: sàn gõ, hoặc nhập từ tệp). Thứ tự thắng: sàn gõ, rồi tệp, rồi danh mục.
  Danh mục không bao giờ đè giá trị riêng, và không sàn nào sửa danh mục.
- Ghi chỉ qua `/api/v1` (`unitAttributes`), có khoá phiên bản như hàng 4. Tin Đã bán và Ngừng hẳn giữ nguyên.
- Bảng hàng sửa Diện tích và Phòng ngủ trên ô từ 768px, và dán vào hai cột này theo cùng luật đọc. Hồ sơ căn sửa cả
  năm trường trong một hộp. Giá trị khác danh mục có dấu màu trung tính; bấm dấu thì thấy giá trị danh mục và có lệnh
  «Lấy lại».
- Việc bị chặn vì trạng thái hay vì chưa ai giữ căn thì hiện một dòng chữ nhạt nói lý do, không hiện nút mờ.
- Thân hồ sơ căn theo bốn nhóm A–D:
  - (A) mỗi điều nói một lần;
  - (B) căn đủ thông tin gọn một dòng, tên phần còn thiếu bấm được;
  - (C) quá 14 ngày chưa xác nhận thì có nhắc;
  - (D) cột nhãn cố định, lịch sử lần chào như đường dẫn.

## Consequences

- Migration `020` thêm mười cột vào `listings`. Bộ cách ly có thêm ca 27 và 28, mỗi ca kèm bản phá.
- Nhập tệp ghi giá trị nguồn «tệp». Có lệnh chạy một lần (`make tin-rao-doc-lai`) để đọc lại những lần nhập cũ.
- Lật một số luật đã ký, mỗi chỗ có dòng sửa sau ký trong sổ của hồ sơ ấy:
  - hàng 4 và hàng 5: nay Diện tích, Phòng ngủ sửa và dán được;
  - hàng 3, 3b và 3g: đầu và thân hồ sơ đổi dáng;
  - hàng 3e: nút bị chặn thành dòng lý do;
  - VP10: bài 44px đo đáy có nút;
  - hàng 10: ca cách ly 23.
- Còn để sau:
  - khoá một giá trị (lát B);
  - nút «Gắn sang căn khác» trên màn (chờ ô tìm mã căn của hàng 12);
  - tên người xác nhận (chờ hàng 3c).
