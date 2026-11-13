---
schema_version: 1
feature: "Đầu chủ chép đường dẫn một căn gửi đồng nghiệp mở đúng căn và đúng lần chào, và gõ mã căn ở thanh trên để mở thẳng hồ sơ căn trên Bảng hàng"
slug: loi-vao-ho-so
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/loi-vao-ho-so/design.md
---

# Acceptance Contract: loi-vao-ho-so

## Context

Hàng 3f của lộ trình (`docs/plan/lo-trinh.json`), một trong năm hàng chủ kho quyết «Build cả năm hàng» (2026-11-12) sau khi
so hồ sơ căn của Quỹ hàng với hàng 3. Hàng 3 mở hồ sơ một căn nổi cạnh Bảng hàng, và địa chỉ `/inventory?ho-so=<id lần
chào>` mở lại đúng hồ sơ ấy. Ở Cổng Phạm vi chủ kho chọn giữ nguyên cách xem này, không làm trang riêng cho một căn («Tôi
muốn lối Lối khác, đơn giản hơn, vì giữ đúng ux hiện nay.»). Hàng này thêm nút «Chép đường dẫn» ở đầu hồ sơ (khe nút của
hàng 9e) và ô tìm ⌘K ở thanh trên của App Shell — chỗ tìm duy nhất của sản phẩm theo lời chốt sau của chủ kho («Đồng ý lối
A, một điểm tôi muốn bổ sung là đưa search đúng vào (⌘K) ở thanh trên đây cũng là nơi shell đã có ux?»; ô tìm của vùng bỏ ở
mọi bảng Lưới, hàng 2e). Cả hai đều dẫn về Bảng hàng.

Luật sản phẩm: SP-1 — tìm căn theo mã chỉ trong các dòng Bảng hàng đã đọc, không mở đường đọc dữ liệu mới; SP-3 — chỉ chép
vào bộ nhớ chép, người tự dán và tự gửi; SP-4 — đường dẫn là địa chỉ nội bộ của Bảng hàng, không phải trang khách. Không
luật nào bị nới.

Source input: ô `_acceptance/loi-vao-ho-so/opportunity.md` (build), lời giao của giám sát đợt «nen», bảng so «Chi tiết căn
Quỹ hàng ↔ Inventory» mục 4, 5, 6, 40, lời chủ kho ở Cổng Phạm vi (sổ quyết định, `stage: gate1`).

## Criteria

- AC-1: Given hồ sơ một căn đang mở cạnh Bảng hàng ở 1440, 1024 và toàn màn ở 414, 360, When nhìn đầu hồ sơ, Then có nút
  «Chép đường dẫn» đứng trước «Trước», «Sau», «Đóng» (ở 414 và 360 nút chỉ hiện biểu tượng, tên vẫn đọc được, và cả bốn
  nút nằm trọn trong khung nhìn); thân hồ sơ không đổi so với hàng 3.
- AC-2: Given hồ sơ một căn đang mở, When bấm «Chép đường dẫn», Then bộ nhớ chép giữ đúng địa chỉ đầy đủ
  `<gốc>/inventory?ho-so=<id lần chào>` của căn ấy và có báo «Đã chép đường dẫn»; When trình duyệt không cho chép, Then báo
  «Chưa chép được. Bạn chép đường dẫn trong ô địa chỉ của trình duyệt.» và không báo đã chép.
- AC-3: Given đường dẫn chép từ hồ sơ, When một người cùng sàn mở nó trong một phiên trình duyệt khác, Then thấy Bảng hàng
  với hồ sơ của đúng căn và đúng lần chào ấy bật sẵn.
- AC-4: Given đường dẫn mang id lần chào không còn trong Bảng hàng, When mở nó, Then Bảng hàng hiện bình thường, không hồ sơ
  nào bật, và có báo «Căn trong đường dẫn không còn trong Bảng hàng.» (Hỏi-2 trên thẻ).
- AC-5: Given một người có vai thấy Bảng hàng, ở bất kỳ màn nào có App Shell, When mở ô ⌘K trên thanh trên (bấm ô, hoặc
  ⌘K / Ctrl+K, hoặc «/» khi không đứng trong ô nhập) và gõ, Then ô gợi ý các căn khớp (mã căn; thêm toà và dự án nếu Hỏi-2
  chọn thế), mỗi gợi ý ghi rõ loại; chọn một gợi ý hay Enter thì về Bảng hàng với chữ ấy điền sẵn ở đầu cột tương ứng và
  hàng lọc mở; một dòng khớp mã căn thì hồ sơ của nó bật thêm (khoảng trắng hai đầu bỏ qua, chữ hoa thường như nhau); Enter
  khi ô rỗng thì không đi đâu; Esc đóng ô; người có vai không thấy Bảng hàng thì không có ô và phím tắt.
- AC-6: Given một mã căn có ở hai toà trở lên trong Bảng hàng, When gõ mã ấy rồi Enter, Then Bảng hàng chỉ còn các dòng của
  mã ấy (mã ở đầu cột Căn), mỗi toà một dòng, và hồ sơ KHÔNG tự bật khi còn hơn một dòng — người chọn bằng cách bấm mã căn ở
  một dòng.
- AC-7: Given một mã không có ở dòng nào của Bảng hàng, When gõ mã ấy rồi Enter, Then Bảng hàng hiện trạng thái «Không có
  dòng nào khớp» kèm «Xoá lọc», mã nằm ở đầu cột Căn, không hồ sơ nào bật.
- AC-8: Given hồ sơ có nút «Chép đường dẫn», Bảng hàng lọc theo mã ở nhiều toà, và ô ⌘K đang mở có gợi ý, When nhìn ở 1440,
  1024, 414, 360, sáng và tối, Then không cuộn ngang, chữ không đè nhau, và quét trợ năng không lỗi mức nghiêm trọng hay nguy
  cấp.

## Vai × Màn

Hôm nay khung chưa bắt đăng nhập ở dữ liệu mẫu nên ô dưới là ý định, giống hàng 2 và hàng 3.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — chép đường dẫn, ô ⌘K | được — chép đường dẫn, ô ⌘K | được — chép đường dẫn, ô ⌘K | chặn — như hàng 3, không có ô ⌘K |

## Coverage

Quét theo khuôn «entity-feature» của bộ quét hình thái, trên hai lối vào một hồ sơ.

- Trục A — lối vào: đường dẫn được gửi · ô ⌘K (bấm, ⌘K, «/») · chọn gợi ý hay Enter.
- Trục B — kết quả: một căn · nhiều toà · mã lạ · id lần chào đã rút · ô rỗng · tên toà, dự án (Hỏi-2).
- Trục C — khổ và màu: 1440 · 1024 · 414 · 360; sáng · tối.
- Trục D — chép: được · bị chặn.
- Trục E — vai: có Bảng hàng · không có.

Thước: AC-1 phủ C (bốn khổ); AC-2 phủ D; AC-3, AC-4 phủ A (đường dẫn) × B (một căn, id đã rút); AC-5 phủ A («Gõ mã căn» ba
lối) × B (một căn, ô rỗng) × E; AC-6, AC-7 phủ B (nhiều toà, mã lạ); AC-8 phủ C × ba trạng thái. Ca «nhiều toà» đo trên Bảng hàng thật: dữ liệu mẫu có 10 mã ở hai
toà trở lên (0601 ở ba toà).

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng số; UAT gom một lần cuối lộ trình (sổ quyết định).

## Out of scope

- Không trang riêng cho một căn, không nút «Mở toàn màn»: chủ kho chọn giữ hồ sơ nổi cạnh Bảng hàng (Cổng Phạm vi).
- Không thêm căn khi gõ mã không khớp: thêm căn bằng mã là hàng 12; ô của hàng này chỉ tìm căn đã có trong Bảng hàng.
- Không danh sách các lần chào của căn hay đổi lần chào trong hồ sơ (hàng 3b «Hồ sơ đủ thông tin»).
- Không mở ứng dụng gửi hay Zalo: chỉ chép đường dẫn, người tự dán và tự bấm gửi (SP-3).
- Không nhảy theo tên màn trong ô ⌘K (Quỹ hàng có; thanh bên đã có lối tới các màn).
- Không bỏ ô tìm của vùng ở các bảng Lưới: việc ấy là hàng 2e; hàng này chỉ thêm ô ⌘K.
- Không cửa đăng nhập riêng: đường dẫn đi qua đúng cửa của Bảng hàng — hôm nay dữ liệu mẫu của một sàn, chưa bắt đăng nhập;
  khi Bảng hàng đọc dữ liệu thật theo sàn (hàng 10) thì đường dẫn theo cùng cửa. Đường dẫn không dành cho khách.

## Notes

- Dựng sau hàng 9e (đã gộp — khe nút đầu hồ sơ) và sau khi bộ phát lịch giao hàng (trùng tệp với 2c ở
  `src/app/(app)/inventory/**`). Mã điền sẵn ở đầu cột dùng «cách xem ban đầu» của 2c, không thêm cách thứ hai cho lưới.
- AC-7 đứng trên bản sửa Ngoài-4 của 2c: hôm nay lọc ra rỗng thì Bảng hàng giấu luôn hàng lọc đầu cột, nên mã vừa gõ không
  thấy được (bản mẫu chụp lại đúng lỗi ấy ở 1440 và 360).
- Sửa ở Cổng Phạm vi: lời giao trên lộ trình nói «trang riêng», «Mở toàn màn» và «Nhiều căn — chọn toà» với một nút mỗi toà;
  theo lối chủ kho chọn, hàng không có trang riêng và chọn toà bằng chính các dòng Bảng hàng (sổ quyết định, `stage: gate1`).
