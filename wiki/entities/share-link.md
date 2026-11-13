---
type: entity
title: ShareLink (Link đã gửi)
links: [ontology/entities/ShareLink.yaml]
sources:
  [docs/tri-thuc/wiki/chu-de/da-gui-va-trang-khach.md, "https://dd.reso.org/DD2.1/ContactListings/"]
---

# ShareLink (Link đã gửi)

## Definition

Một link một thành viên của sàn gửi cho một người nhận, gói một hay nhiều lần chào; khách mở link không cần đăng nhập.
Khái niệm riêng của kho: `ContactListings` của RESO là từng lần chào gửi cho từng liên hệ, còn link gói nhiều lần chào
trong một lần gửi, nên không mượn tên ấy.

## Rules

Sàn giữ link của mình (`companyId` bắt buộc); không sàn nào khác thấy.

Số căn (`listingCount`) suy từ quan hệ «link gồm lần chào», không ai gõ. Khách đánh dấu quan tâm nhiều nhất một lần mỗi
căn của một link, nên số quan tâm không vượt số căn. Link chưa mở lần nào không có lúc mở gần nhất; link đã mở thì lúc mở
không sớm hơn lúc gửi.

Người nhận hiện chỉ là tên hiển thị, đánh dấu dữ liệu cá nhân; nối hay không sang [Contact](contact.md) do hàng 18 (lưu
khách) quyết. Mã link, hạn link và bản che của trang khách là của hàng 16, 17, chưa khai.

## Where in the code

`src/modules/sharing/sample.ts` — dữ liệu mẫu và bộ kiểm luật; `src/modules/sharing/ui/` — màn Đã gửi trên Lưới.

## History

Thêm cùng màn Đã gửi trên Lưới với dữ liệu mẫu, 13/11/2026 (hàng lộ trình 6, `_acceptance/da-gui-tren-luoi/`), giám sát
đợt duyệt mở ranh giới, chủ kho soi ở Cổng Phạm vi.
