---
type: decision
title: Ngăn nổi để xem chi tiết một dòng
links:
  [
    wiki/decisions/0023-chon-truoc-tao-sau.md,
    design/behaviors.md,
    src/components/candidate/record-panel.tsx,
    _acceptance/ho-so-can/design.md,
  ]
sources:
  [
    "user, 2026-11-12",
    _acceptance/ho-so-can/decisions.jsonl,
    "onehub-quy-hang docs/design/danh-gia-ngan-chi-tiet-can.md",
    "onehub-quy-hang docs/adr/0024-he-bo-cuc.md",
  ]
---

# 0024 Ngăn nổi để xem chi tiết một dòng

## Status

Accepted, 2026-11-12, tại Cổng Phạm vi của hàng 3 (hồ sơ căn). Lời chủ kho, nguyên văn: «Lấy B có ghim» (chọn ngăn nổi làm
cách chung, có nút ghim), rồi «Trừ thanh trên» (độ cao của ngăn).

## Context

Màn nào có một danh sách nhiều dòng cũng cần mở chi tiết một dòng mà không rời danh sách: căn ở Bảng hàng, người ở Liên hệ,
lần gửi ở Đã gửi, việc ở Hôm nay, người ở Thành viên. Có hai lối đặt chi tiết trên máy tính:

- **A — cột đứng cạnh bảng**, đẩy bảng sang trái (Quỹ hàng chọn ngày 05/11 sau khi đo: ngăn nổi của họ che nút Lọc, Nhóm,
  Cột và thanh trên, ở 1280 còn khoảng ba cột).
- **B — ngăn nổi bên phải**, bảng đứng yên, ngăn phủ phần phải.

Hàng 3 dựng cả hai trên Bảng hàng thật. Hồ sơ mở thì bên trái còn 5 cột ở 1440 và 3 cột ở 1024 với cả hai lối. Chỗ khác
nhau là cả ứng dụng: sắp có lớp trò chuyện với AI cũng đứng bên phải. Theo lối A, hồ sơ cộng AI là ba cột và bảng ở 1440
chỉ còn khoảng ba cột; theo lối B, hồ sơ và AI dùng chung một chỗ và bảng không xô lệch.

## Decision

1. Ngăn nổi bên phải là cách chung của cả ứng dụng để xem chi tiết một dòng, và là chỗ của lớp trò chuyện với AI. Khung dựng
   một lần (`RecordPanel` qua `DataRegion`); màn chỉ khai nội dung của một dòng.
2. Ba điều kiện:
   - không che thanh trên của App Shell: ngăn chạy từ ngay dưới thanh trên tới đáy màn hình; khi toàn màn (thanh trên ẩn)
     ngăn cao hết màn;
   - không khoá bảng: không lớp mờ, bảng bên trái vẫn bấm và cuộn được, bấm dòng khác thì ngăn đổi nội dung; có «Trước»,
     «Sau»;
   - có nút ghim biến ngăn thành cột đẩy bảng (lối A) cho việc làm lâu, kèm kéo đổi rộng.
3. Bên phải chỉ có một chỗ: hồ sơ và AI là hai thẻ của cùng một ngăn, không chồng hai ngăn lên nhau.
4. Ngăn che phần phải của tên màn và thanh công cụ của vùng, nên nút của thanh công cụ đứng sát ô tìm, phía trái.
5. Trên điện thoại chi tiết mở toàn màn, không đổi.

Không chọn: lối A làm mặc định. Nó hợp việc làm lâu nhưng làm bảng co mỗi lần mở, và cộng lớp AI thì thành ba cột; lối A
còn lại dưới dạng nút ghim.

## Consequences

- Hàng 3 dựng ngăn nổi với hai điều kiện đầu. Nút ghim là hàng 3a của lộ trình. Lớp trò chuyện với AI chưa thành hàng.
- Đã gửi, Liên hệ, Hôm nay, Thành viên mở chi tiết bằng chính ngăn này khi tới lượt; không màn nào dựng ngăn riêng (rào
  `tests/behavior-guard.test.ts`).
- Khung chi tiết là khuôn của kho: đổi ở một chỗ, áp mọi nơi đang dùng (quyết định 0023, điều 8).
- Hàng 2a (dùng tay như Sheet) đặt các nút Lọc, Cột, Toàn màn sát ô tìm để ngăn không che.
