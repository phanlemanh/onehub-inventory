---
schema_version: 1
feature: Đầu chủ đăng nhập và thấy, sửa được hàng thật của sàn mình trên Bảng hàng
slug: bang-hang-du-lieu-that
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api]
screens: [inventory]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-15
design_doc: docs/superpowers/specs/2026-11-15-bang-hang-du-lieu-that-design.md
---

# Acceptance Contract: bang-hang-du-lieu-that

## Context

Hàng 10 của lộ trình (N5, chặng 4). Bảng hàng, hồ sơ căn, ô ⌘K và cây địa lý đang đọc một bộ dữ liệu mẫu chung cho
mọi sàn; sửa trên ô ghi vào bộ mẫu và mất khi tải lại. Hàng này thêm bảng căn chào của sàn vào cơ sở dữ liệu, đọc và
ghi thật qua `/api/v1` theo bảng quyền từng vai, và trả các nợ đã dồn về hàng 10 (bảng ở mục 3 của thiết kế). Chạm luật
sản phẩm SP-1 (bảng mới của sàn, cửa truy vấn theo sàn). T3 vì sửa `db/**` (migration 013) và `ontology/**` (thuộc
tính người giữ căn trên `Listing`, ba thao tác sang «đang chạy»).

Source input: ô cơ hội `_acceptance/bang-hang-du-lieu-that/opportunity.md` (build, Manh Phan, 2026-11-15) · hàng 10 của
`docs/plan/lo-trinh.json` · trang `docs/tri-thuc/wiki/chu-de/bang-hang.md` · lời giao của giám sát (nợ của 4, 3f, 1o,
2d, 19, 7e) · báo cáo RS2 `trinh/ra-soat-crud/bao-cao.md` của đợt.

## Criteria

- AC-1: Given cơ sở dữ liệu sau migration 013, When bộ cách ly (`db/scripts/cach-ly.sh`) chạy, Then hai bảng
  `listings`, `listing_units` có `company_id`, bật và ép luật theo dòng, có luật theo sàn cho bốn lệnh và luật thu hẹp
  theo bảng quyền, vai nối ứng dụng không chủ bảng; một phiên của sàn B đọc, sửa căn của sàn A theo id thì không thấy
  dòng nào và không đổi dòng nào; bảng thiếu một luật thì bộ đỏ gọi tên bảng. Luật dữ liệu nằm trong bảng: Đã bán thiếu
  giá chốt hay ngày, Ngừng hẳn thiếu lý do, căn thứ hai đang mở cùng sàn — đều bị từ chối. (cross-layer)
- AC-2: Given hai sàn [MAU] và [MAU-2] có căn khác nhau trong cơ sở dữ liệu, When một Đầu chủ của [MAU] đăng nhập mở Bảng
  hàng, Then lưới hiện đúng các căn đang chào của [MAU] với số dòng «n / N căn» bằng số dòng trong bảng, giá trị trường
  riêng của sàn và Về tay tính từ giá đã lưu; đổi sàn sang [MAU-2] ở App Shell thì chỉ còn căn của [MAU-2]. Không còn
  đường nào của trang đọc bộ mẫu trong bộ nhớ. (cross-layer)
- AC-3: Given Đầu chủ của [MAU] đã đăng nhập, When gõ vào ô ⌘K, mở cây địa lý ở cột thứ hai và mở hồ sơ một căn, Then gợi
  ý, các nút cây (Dự án → Phân khu → Toà) và hồ sơ đều dựng từ cùng các dòng đọc cho sàn đang đăng nhập — không hiện
  toà, căn nào của [MAU-2]; toà không còn căn nào không hiện; mục cây không mang số đếm; một lượt dựng trang chỉ có một
  lần đọc căn chào (đo ở cửa đọc). Chuột giữa trên một nút cây mở thẻ mới, không áp nơi ở thẻ đang mở. (cross-layer)
- AC-4: Given Đầu chủ đang xem căn mình giữ, When sửa Giá chào trên ô thành «2,8 tỷ» rồi Enter, Then đúng một yêu cầu
  `PATCH /api/v1/listings/<id>` mang phiên bản đang có; tải lại trang và đăng nhập ở phiên khác vẫn thấy 2,8 tỷ; phiên
  bản trong bảng tăng một; Xác nhận lúc là lúc vừa sửa. (cross-layer)
- AC-5: Given bảng quyền từng nấc (đưa lên «Đang bán» là `activateListing`: Đầu chủ với căn mình giữ hoặc căn chưa ai
  giữ, Trưởng nhóm toàn sàn), When một Đầu chủ mở ô Trạng thái của căn người khác giữ, Then nấc «Đang bán» không hiện;
  gửi thẳng yêu cầu ấy tới API thì nhận 403 và dòng không đổi; cùng việc với căn mình giữ, căn chưa ai giữ, hay bằng
  Trưởng nhóm thì được. Hồ sơ căn hiện tên người giữ căn thật của sàn, hay «Chưa ai giữ». (cross-layer)
- AC-6: Given hai phiên cùng mở một căn ở phiên bản 3, When phiên một đổi giá xong rồi phiên hai đổi trạng thái, Then
  phiên hai nhận câu xung đột tại ô, ô hiện giá trị mới nhất do máy chủ trả, không ghi đè mù; và When người đổi trạng
  thái rồi bấm Hoàn tác lần đổi giá trước đó, Then bảng giữ trạng thái mới, chỉ giá trở về (nợ 3 của hàng 4). (cross-layer)
- AC-7: Given vai được sửa căn, When đổi ô Điều kiện phí từ «Bao phí» sang «Không bao phí», Then giá trị được lưu qua cùng
  đường `PATCH`, Về tay của dòng tính lại theo điều kiện mới, tải lại vẫn giữ; vai không được sửa không thấy ô mở.
  (cross-layer)
- AC-8: Given Bảng hàng trên dữ liệu thật, When đọc đang chạy · sàn chưa có căn nào · không đọc được cơ sở dữ liệu ·
  lọc không còn dòng · vai không có quyền xem, Then vùng hiện đúng một trong năm trạng thái của `DataRegion` — chờ tải,
  trống (câu của màn), lỗi có «Tải lại» (khi lần đọc thật hỏng, không chỉ công tắc của bản dev), không khớp có «Xoá lọc», «Không đủ quyền» — ở bốn khổ 1440, 1024, 414, 360, sáng
  và tối, không lỗi trợ năng mức nghiêm trọng.
- AC-9: Given bản chạy CÓ cơ sở dữ liệu và không có phiên đăng nhập, When mở `/inventory` (kể cả `/inventory?vai=TeamLead`),
  Then về trang đăng nhập và `?vai=` không thay vai nào; bộ mẫu trong bộ nhớ và `?vai=` chỉ còn sống ở đúng một chỗ —
  máy không cấu hình cơ sở dữ liệu, ngoài bản chạy thật (theo Hỏi-6) — nên không bao giờ đứng cạnh dữ liệu thật. Quản trị
  sàn mở Bảng hàng thì theo câu chủ kho chọn ở Hỏi-1 (lối B: vùng «Không đủ quyền», không bảng, không thẻ).
- AC-10: Given 5.000 căn của một sàn trong cơ sở dữ liệu, When Đầu chủ mở Bảng hàng, Then lần đọc ở máy chủ dưới 1,5 giây
  ở bài cơ sở dữ liệu và trang cuộn liền tới dòng cuối không lỗi (không lặp lỗi sập của Quỹ hàng); Đầu chủ của sàn khác
  vẫn chỉ thấy căn của mình.

## Vai × Màn

| Vai | Bảng hàng | Hồ sơ căn | Sửa trên ô |
| --- | --- | --- | --- |
| Đầu chủ (ListAgent) | xem | xem | giá, điều kiện phí, trạng thái theo Hỏi-2; «Đang bán» với căn mình giữ hoặc chưa ai giữ |
| Đầu khách (BuyerAgent) | xem | xem | theo Hỏi-2 |
| Trưởng nhóm (TeamLead) | xem | xem | toàn sàn |
| Quản trị sàn (CompanyAdmin) | theo Hỏi-1 | theo Hỏi-1 | không |

## Đường đo

- Ô cơ hội chưa khai ngưỡng (các ô «…» để trống). Đường đo của hàng: số căn đọc được của mỗi sàn và số lần ghi thành
  công / bị từ chối / xung đột đếm được từ bảng `listings` (`version`, `updated_at`) — AC-1, AC-4, AC-6 bảo đảm có vật để
  đếm. Không thêm bảng đếm riêng.

## Coverage

Quét theo preset entity-feature, rút theo hàng (thiết kế mục 7). Trục: vòng đời căn chào trên màn · vai × phạm vi · kết
cục của lần đọc/ghi · chỗ hiện cùng dữ liệu. Chân ngành: RESO Data Dictionary 2.1 (`ListAgentKey`, `StandardStatus`);
Quỹ hàng (cận kề). Bảng thao tác đủ vòng đời ở thiết kế mục 8.

- [GIẢ ĐỊNH] Ngưỡng 1,5 giây cho 5.000 căn là số máy chọn từ bài thử 5.000 dòng của Quỹ hàng (ADR-0004), chưa đo trên
  máy của kho này.
- [GIẢ ĐỊNH] Người giữ căn là một người (không nhóm người giữ) — theo `ListAgentKey` của RESO.

## Out of scope

- Thêm căn — để hàng 12 (ai quyết: chủ kho, lộ trình).
- Sửa pháp lý, nội thất, tài chính, tình trạng sử dụng — để hàng 3g (ai quyết: chủ kho, Cổng Đáng 15/11).
- Sửa nhanh trên điện thoại — để hàng 3d (ai quyết: chủ kho, lộ trình).
- Gỡ căn khỏi danh sách — để hàng 18b (ai quyết: chủ kho, lộ trình).
- Đổi người giữ căn, bàn giao khi nghỉ — để hàng 18a (ai quyết: chủ kho, lộ trình).
- Nạp tệp Excel, Sheet — để hàng 11 (ai quyết: chủ kho, lộ trình).
- Màn Liên hệ — để hàng 13a (ai quyết: chủ kho, Cổng Đáng 15/11).
- Nhận căn chưa ai giữ — chờ Hỏi-4 (ai quyết: chủ kho).
- Sửa giá trị trường riêng trên ô — chờ Hỏi-3 (ai quyết: chủ kho).
- Dấu mức thuế phí lúc tính trên từng giá — chờ Hỏi-5 (ai quyết: chủ kho).
- Phân trang phía máy chủ — không làm (ai quyết: chủ kho, «cuộn liền» chốt 11/11 ở hàng 2).
- Làm việc khi mất mạng, bản sao trên máy — sau MVP (ai quyết: chủ kho, AGENTS.md).

## Câu hỏi cho chủ kho

- Hỏi-1 · Quản trị sàn và Bảng hàng: khuyên **A — cấp `viewListings` cho Quản trị sàn (xem, chỉ đọc, không sửa)** và đặt
  cửa vào của màn Bảng hàng là `viewListings` trong sổ màn. Hệ quả cho sổ cặp vai × màn của 9b: ô inventory × Quản trị
  sàn giữ «được — thấy Bảng hàng», không đổi kỳ vọng nào đã ký. Lối khác: B — đặt cửa vào `viewListings` mà KHÔNG cấp
  cho Quản trị sàn: người chỉ mang vai Quản trị thấy «Không đủ quyền» (vế AC-9 mà hàng 2b chuyển sang hàng 10), ô cặp
  vai × màn của 9b đổi thành «không được» và phải ký lại dòng ấy; giá: Quản trị phải nhờ người khác kiểm cấu hình trên
  căn thật.
- Hỏi-2 · Ai sửa giá, điều kiện phí và trạng thái (trừ «Đang bán») của căn: khuyên **A — Đầu chủ, Đầu khách, Trưởng
  nhóm toàn sàn**, đúng bảng quyền Quỹ hàng đã ký ngày 05/11 và thói quen sổ chung; siết sau là đổi một ô bảng quyền.
  B — Đầu chủ chỉ căn mình giữ hoặc chưa ai giữ, Trưởng nhóm toàn sàn, Đầu khách không sửa («thường chỉ vài người sửa,
  cả đội xem»); giá: căn nhập chưa có người giữ thì Đầu khách phải nhờ Đầu chủ.
- Hỏi-3 · Sửa giá trị trường riêng của sàn trên căn thật: khuyên **để hàng 3g** (cùng loại «sửa thông tin căn»; hàng
  10 lưu và hiện). Lối khác: làm ở hàng 10 — thêm một kiểu ô sửa theo kiểu trường (chữ, số, chọn, ngày), ước thêm hai tiêu
  chí.
- Hỏi-4 · Nhận căn chưa ai giữ: khuyên **để hàng 18a, mở rộng câu giao thành «giao và bàn giao căn»** (RS2 đề xuất);
  hàng 10 hiện «Chưa ai giữ» và cho đưa căn ấy lên «Đang bán». Lối khác: làm ở hàng 10 — nút «Nhận căn» trong hồ sơ, một
  tiêu chí, một thao tác mới trong bảng quyền.
- Hỏi-5 · Dấu mức thuế phí lúc tính trên từng giá (chủ kho chọn «để hàng 10» ở hàng 19): khuyên **hoãn sang một hàng
  riêng «Lịch sử mức thuế phí»** — cần bảng lịch sử mức mà hàng 19 chưa có; hàng 10 ghi giới hạn đã biết «đổi mức thì Về
  tay của giá cũ đổi theo». Lối khác: làm ở hàng 10 — thêm bảng lịch sử mức và cột dấu trên căn chào, ước thêm ba tiêu
  chí, vượt cỡ hợp đồng.

- Hỏi-6 · Bảng hàng khi máy không có cơ sở dữ liệu (11 tệp bài trình duyệt hôm nay mở Bảng hàng trên bộ mẫu, ba tệp chọn vai
  bằng `?vai=`): khuyên **B — giữ chế độ mẫu chỉ khi máy không cấu hình cơ sở dữ liệu và không phải bản chạy thật**; có cơ
  sở dữ liệu thì luôn bắt đăng nhập, `?vai=` không còn tác dụng — dữ liệu thật và cửa thay vai không bao giờ cùng có mặt.
  Lối khác: A — gỡ hẳn chế độ mẫu, chuyển cả 11 tệp sang làn có cơ sở dữ liệu và đăng nhập theo vai của 9b (đúng chữ «Dọn
  cửa thử» của LUAT); giá: khoảng nửa ngày chuyển bài, bộ kiểm trình duyệt chậm hơn, hàng 10 dài thêm.

## Notes

- Phần S0–S2 làm trên main 0861fdc cộng nhánh lộ trình `chore/nen-lo-trinh-dot-15-11`; phần dựng chờ 2b (#63), 2d (#65),
  19 (#64) vào main rồi gộp main.
- Tệp tầng cao sẽ sửa: `db/migrations/013_*.sql`, `db/tests/cach-ly.sql`, `db/scripts/` (lệnh nạp mẫu),
  `ontology/entities/Listing.yaml`, `ontology/actions.yaml`, có thể `ontology/roles.yaml` (theo Hỏi-1). Không chạm
  `src/modules/identity/**` ngoài việc gọi cửa công khai; không chạm `tools/**`.
