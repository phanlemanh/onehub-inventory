---
schema_version: 1
feature: "Đầu chủ mở một căn ở trang riêng bằng nút «Mở toàn màn», chép đường dẫn gửi đồng nghiệp mở đúng căn và đúng lần chào, và gõ mã căn ở thanh trên để tới thẳng hồ sơ căn"
slug: loi-vao-ho-so
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [unit, inventory]
status: draft
design_doc: _acceptance/loi-vao-ho-so/design.md
---

# Acceptance Contract: loi-vao-ho-so

## Context

Hàng 3f của lộ trình (`docs/plan/lo-trinh.json`), một trong năm hàng chủ kho quyết «Build cả năm hàng» (2026-11-12) sau khi
so hồ sơ căn của Quỹ hàng với hàng 3. Hàng 3 mở hồ sơ một căn cạnh Bảng hàng và địa chỉ `?ho-so=<id>` mở lại được, nhưng
không có trang riêng cho một căn và không có chỗ gõ mã căn. Hàng này thêm trang riêng (dùng lại thân hồ sơ của hàng 3, khung
hồ sơ dùng chung của Lưới theo quyết định 0023), nút «Mở toàn màn», nút «Chép đường dẫn» và ô «Gõ mã căn» ở thanh trên của
App Shell. Nút ở đầu hồ sơ đặt trong khe nút của hàng 9e, nên hàng này dựng sau 9e.

Luật sản phẩm: SP-1 — trang đọc cùng nguồn với Bảng hàng, không mở đường đọc dữ liệu mới; SP-3 — chỉ chép vào bộ nhớ chép,
người tự dán và tự gửi; SP-4 — trang riêng là trang nội bộ cần đăng nhập, không phải trang khách. Không luật nào bị nới.

Source input: ô `_acceptance/loi-vao-ho-so/opportunity.md` (build), lời giao của giám sát đợt «nen», bảng so «Chi tiết căn
Quỹ hàng ↔ Inventory» mục 4, 5, 6, 40.

## Criteria

- AC-1: Given hồ sơ một căn đang mở cạnh Bảng hàng ở 1440, 1024 và toàn màn ở 414, 360, When nhìn đầu hồ sơ, Then có nút
  biểu tượng tên «Mở toàn màn» đứng trước «Trước», «Sau», «Đóng»; bấm nó thì sang trang riêng của căn ấy, địa chỉ
  `/inventory/units/<mã căn>?toa=<toà>&ho-so=<id lần chào>`; nút lùi của trình duyệt đưa về Bảng hàng với hồ sơ ấy đang mở.
- AC-2: Given trang riêng của một căn có trong Bảng hàng, When trang mở, Then thân trang là chính thân hồ sơ của hàng 3
  (thẻ căn rồi tám trường, cùng giá trị như hồ sơ cạnh bảng của căn ấy), đầu trang là «<mã căn> · <toà>» kèm nút «Chép đường
  dẫn», và có lối «Bảng hàng» quay về Bảng hàng.
- AC-3: Given trang riêng, When bấm «Chép đường dẫn», Then bộ nhớ chép giữ đúng địa chỉ đầy đủ của trang (có `toa` và
  `ho-so`) và có báo «Đã chép đường dẫn»; When trình duyệt không cho chép, Then báo «Chưa chép được. Bạn chép đường dẫn trong
  ô địa chỉ của trình duyệt.» và không báo đã chép.
- AC-4: Given đường dẫn chép từ trang riêng, When một người cùng sàn mở nó trong một phiên trình duyệt khác, Then thấy đúng
  căn và đúng lần chào ấy; When `ho-so` vắng hoặc không thuộc căn ấy, Then trang mở lần chào đầu tiên của căn theo thứ tự
  Bảng hàng.
- AC-5: Given một mã căn không có ở toà nào trong Bảng hàng người ấy thấy, When mở trang riêng của
  mã ấy, Then thấy «Không có căn này trong Bảng hàng», câu vì sao nêu lại mã đã gõ, và nút «Về Bảng hàng»; không thân hồ
  sơ nào hiện.
- AC-6: Given một mã căn có ở hai toà trở lên trong Bảng hàng, When mở trang riêng của mã ấy không kèm toà, Then thấy «Nhiều
  căn — chọn toà» với đúng một nút cho mỗi toà có mã ấy, mỗi nút mở trang riêng của căn ở toà đó; mã có ở một toà thì mở
  thẳng căn ấy; địa chỉ kèm một toà không có mã ấy thì xử như không kèm toà.
- AC-7: Given một người có vai thấy Bảng hàng, ở bất kỳ màn nào có App Shell, When bấm «Gõ mã căn» trên thanh trên (hoặc
  ⌘K / Ctrl+K, hoặc «/» khi không đứng trong ô nhập), gõ một mã rồi Enter, Then tới trang riêng của mã ấy (khoảng trắng hai
  đầu bỏ qua, chữ hoa thường như nhau); Enter khi ô rỗng thì báo «Bạn gõ mã căn trước đã.» dưới ô và hộp không đóng; Esc
  đóng hộp; người có vai không thấy Bảng hàng thì không có nút và phím tắt.
- AC-8: Given trang riêng ở ba trạng thái (có căn, nhiều căn, không có căn) và hộp gõ mã đang mở, When nhìn ở 1440, 1024,
  414, 360, sáng và tối, Then không cuộn ngang, chữ không đè nhau, và quét trợ năng không lỗi mức nghiêm trọng hay nguy cấp.

## Vai × Màn

Hôm nay khung chưa bắt đăng nhập ở dữ liệu mẫu nên ô dưới là ý định, giống hàng 2 và hàng 3.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| unit | được — trang riêng mọi căn của sàn | được — trang riêng mọi căn của sàn | được — trang riêng mọi căn của sàn | chặn — trạng thái trang không đủ quyền; bảng quyền của hàng 9a quyết |
| inventory | được — thêm nút «Mở toàn màn» | được — thêm nút «Mở toàn màn» | được — thêm nút «Mở toàn màn» | chặn — như hàng 3 |

## Coverage

Quét theo khuôn «entity-feature» của bộ quét hình thái, trên ba lối vào của một hồ sơ.

- Trục A — lối vào: «Mở toàn màn» · địa chỉ được gửi · «Gõ mã căn» (nút, ⌘K, «/»).
- Trục B — kết quả tìm: một căn · nhiều toà · mã lạ · toà sai · `ho-so` lạ hay vắng · ô rỗng.
- Trục C — khổ và màu: 1440 · 1024 · 414 · 360; sáng · tối.
- Trục D — chép: được · bị chặn.
- Trục E — vai: có Bảng hàng · không có.

Thước: AC-1 phủ A («Mở toàn màn») × C (bốn khổ); AC-4 phủ A (địa chỉ) × B (`ho-so` lạ, vắng); AC-5, AC-6 phủ B (mã lạ, toà
sai, nhiều toà, một toà); AC-7 phủ A («Gõ mã căn» ba lối) × B (ô rỗng) × E; AC-3 phủ D; AC-2 phủ thân hồ sơ; AC-8 phủ C ×
ba trạng thái. [CE chưa kiểm chứng]: B «nhiều toà» trên Bảng hàng thật — dữ liệu mẫu không có mã ở hai toà, ca này chỉ đo
trên dòng dựng tay trong bài kiểm.

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng số; UAT gom một lần cuối lộ trình (sổ quyết định).

## Out of scope

- Không thêm căn khi gõ mã không khớp: thêm căn bằng mã là hàng 12; ô của hàng này chỉ tìm căn đã có trong Bảng hàng.
- Không danh sách các lần chào của căn hay đổi lần chào trên trang riêng (hàng 3b «Hồ sơ đủ thông tin»).
- Không «Trước», «Sau» trên trang riêng; không ghim hồ sơ thành cột (hàng 3a).
- Không mở bảng chia sẻ của thiết bị hay gửi qua Zalo: chỉ chép đường dẫn (SP-3).
- Không gợi ý mã khi đang gõ, không nhảy theo tên màn trong hộp gõ mã (Quỹ hàng có; thanh bên đã có lối tới các màn).
- Không đường dẫn cho người ngoài sàn: người không đăng nhập hay khác sàn không xem được trang này; trang khách là luồng Gửi.

## Notes

- Dựng sau hàng 9e (khe nút đầu hồ sơ) và sau khi bộ phát lịch giao hàng (trùng tệp với 2c, 9e ở `src/app/(app)/inventory/**`
  và App Shell).
