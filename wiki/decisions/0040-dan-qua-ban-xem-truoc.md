---
type: decision
title: Dán từ Excel đi qua bản xem trước và cửa lưu của sửa trên ô
links:
  [
    src/modules/listings/paste-rules.ts,
    src/modules/listings/ui/listing-paste.ts,
    src/components/candidate/paste-preview.tsx,
    src/components/candidate/data-region.tsx,
    src/components/candidate/use-change.tsx,
    design/so-khoi.yaml,
    _acceptance/dan-tu-excel/contract.md,
  ]
sources: [_acceptance/dan-tu-excel/decisions.jsonl, _acceptance/dan-tu-excel/design-pass.md]
---

# 0040 Dán từ Excel đi qua bản xem trước và cửa lưu của sửa trên ô

## Status

Accepted, 2026-11-15, ở hàng 5 (Dán từ Excel). Chủ kho duyệt Cổng Phạm vi với sáu câu hỏi theo khuyến nghị.

## Context

Lưới ReUI của Bảng hàng đã biết dán một khối chữ lên vùng đang chọn theo luật của bảng tính, nhưng tự nó sẽ ghi thẳng vào
ô. Hàng 4 vừa dựng luật sửa Giá chào và Trạng thái trên ô (đọc giá theo cách nói của nghề, nấc trạng thái hợp lệ, hỏi lại
khi giá lệch quá 20%) và một cửa lưu duy nhất có hoàn tác. Một lần dán có thể đổi hàng chục ô của nhiều căn cùng lúc, nên
Đầu chủ cần thấy trước ô nào đổi, ô nào bị bỏ và vì sao.

## Decision

- Lưới chung không ghi gì khi dán: nó trao cả vùng cho màn một lần, kèm ô nào lưới không mở (cột không sửa, ô khoá), và
  chỉ khi bảng quyền cho phiên hành động sửa. Cắt, Xoá, kéo điền không ghi.
- Mỗi ô dán được đọc bằng đúng luật của hàng 4 (`paste-rules.ts` gọi `edit-rules.ts`); không có luật thứ hai.
- Bản xem trước là hộp thoại danh sách (lối A): ô sẽ đổi (cũ → mới, bỏ chọn được từng ô), ô bị bỏ kèm lý do, ô sai kiểu.
  Giá lệch quá 20% mang dấu phần trăm và để bỏ chọn sẵn; dán «Đã bán» hay «Ngừng hẳn» bị bỏ, mở ô để đổi.
- Áp một lần: các lần ghi đi tuần tự qua cùng cửa lưu, hai ô của một căn nối phiên bản; một thông báo, một Hoàn tác ghi
  ngược từng ô theo thứ tự ngược. Hoàn tác hỏng thì thông báo đứng yên, nêu ô còn mang giá trị mới, có Thử lại.
- Bản xem trước là khối dùng chung `PastePreview` trong sổ khối; hàng 11 (nhập tệp) dùng lại.

## Consequences

- Dán theo đúng quyền sửa mà hàng 10 dựng: hàng 5 không ghi cứng vai nào, chỉ hỏi bảng quyền như sửa trên ô.
- Dưới 768 px Bảng hàng là thẻ căn, không có ô để dán.
- Cột tính (như «Về tay» của hàng 19) truyền vào `planPaste` để bị bỏ với lý do riêng; hàng nào gộp sau nối vào.
- Cột riêng của sàn, cột «Điều kiện phí», kéo điền và Ctrl/Cmd+Z để các hàng sau.
