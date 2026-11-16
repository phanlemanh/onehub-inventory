---
type: decision
title: Bảng hàng đọc và ghi căn chào thật — nấc ở máy chủ, quyền và dữ liệu ở cơ sở dữ liệu
links:
  [
    db/migrations/013_bang_can_chao.sql,
    src/modules/listings/inventory-read.ts,
    src/modules/listings/listings-http.ts,
    src/app/(app)/inventory-source.ts,
    tests/db/bang-hang-that.db.test.ts,
    _acceptance/bang-hang-du-lieu-that/contract.md,
  ]
sources:
  [
    _acceptance/bang-hang-du-lieu-that/decisions.jsonl,
    docs/superpowers/specs/2026-11-15-bang-hang-du-lieu-that-design.md,
    docs/superpowers/plans/2026-11-15-bang-hang-du-lieu-that.md,
  ]
---

# 0039 Bảng hàng đọc và ghi căn chào thật — nấc ở máy chủ, quyền và dữ liệu ở cơ sở dữ liệu

## Status

Accepted, 2026-11-15, ở hàng 10. Chủ kho duyệt Cổng Phạm vi theo khuyến nghị (Hỏi-1 đến Hỏi-6) và duyệt kế hoạch.
Sửa một ý của 0016: Quản trị sàn được xem Bảng hàng, chỉ đọc.

## Context

Đến hàng 10, Bảng hàng, hồ sơ căn, ô ⌘K và cây địa lý đọc một bộ mẫu chung cho mọi sàn; sửa trên ô ghi vào bộ nhớ và mất
khi tải lại. Luật sản phẩm SP-1 đòi mỗi bảng của sàn có `company_id`, ép luật theo dòng, và mọi truy vấn đi qua
`withCompany`. Luật đổi trạng thái của căn đã có một chỗ ở `src/modules/listings/edit-rules.ts` (hàng 4).

## Decision

- Hai bảng `listings`, `listing_units` (migration 013), luật theo sàn và luật thu hẹp theo bảng quyền như mọi bảng của
  sàn; vai ứng dụng chỉ đọc và sửa — thêm căn là hàng 12, gỡ căn là hàng 18b.
- Ranh giới luật, mỗi luật một chỗ: **máy chủ giữ luật nấc** (nấc nào đi được sang nấc nào, giá trần, Đã bán cần gì —
  `applyChange` gọi `edit-rules.ts`); **cơ sở dữ liệu giữ quyền và luật dữ liệu** (Đã bán có giá chốt và ngày, Ngừng hẳn có
  lý do, một lần chào đang mở mỗi căn mỗi sàn bằng chỉ mục duy nhất có điều kiện, và một trigger chặn đưa lên «Đang bán»
  trái ô `activateListing` — luật theo dòng không thấy giá trị cũ của dòng).
- Người giữ căn là `list_agent_user_id` (RESO `ListAgentKey`) kèm tên sàn gọi người ấy (`ListAgentFullName`), chép lúc
  giao căn: Đầu chủ không được xem danh sách thành viên (`listMembers`) mà vẫn phải thấy ai giữ căn.
- Một hàm nguồn hàng (`inventorySource`, bọc `cache()` của React) cho khung và trang trong một lượt dựng: có cơ sở dữ liệu thì
  đọc thật; không có và không phải bản chạy thật thì bộ mẫu, và `?vai=` chỉ thay vai ở đúng chỗ ấy (Hỏi-6 B).
- `PATCH /api/v1/listings/[id]` nhận một thay đổi mỗi lần (giá, trạng thái, điều kiện phí) cùng phiên bản người đã sửa;
  phiên bản đã đổi là xung đột trả bản hiện tại, không ghi đè. Hoàn tác gửi lại đúng trường đã đổi trên phiên bản mới nhất.
- Mô-đun căn được dùng mô-đun danh mục (`listings → catalog`): đường đọc lấy căn của danh mục qua `readCatalogUnits` của
  danh mục, trên kết nối của mô-đun căn — không đọc thẳng bảng của mô-đun khác.

## Consequences

- Bảng quyền thêm ba dòng sống: `viewListings` (bốn vai, Quản trị sàn chỉ đọc), `updateListing` (ba vai, toàn sàn),
  `activateListing` (Đầu chủ với căn mình giữ hoặc chưa ai giữ, Trưởng nhóm toàn sàn).
- Luật vào của Bảng hàng vẫn `vao: null`: cả bốn vai đều có `viewListings`, nên đặt luật vào không chặn ai mà làm mất mục
  Bảng hàng ở bản không có cơ sở dữ liệu. Trạng thái «Không đủ quyền» không xảy ra với vai thật nào hôm nay; nó được đo ở
  bài đơn vị.
- Bài trình duyệt có cơ sở dữ liệu nạp bộ mẫu vào sàn thử của mình (`tests/db/can-mau.ts`); mã căn chào của mỗi sàn suy từ
  sàn và mã mẫu, nên hai sàn không trùng mã.
- Hoãn có tên: dấu mức thuế phí lúc tính trên từng giá (Hỏi-5) sang hàng «Lịch sử mức thuế phí»; sửa cột riêng (3g), nhận
  căn chưa ai giữ (18a).
