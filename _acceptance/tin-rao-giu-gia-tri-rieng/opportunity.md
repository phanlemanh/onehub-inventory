---
schema_version: 1
slug: tin-rao-giu-gia-tri-rieng
feature: "Đầu chủ sửa được diện tích, tầng, phòng ngủ, hướng và loại hình của căn mình chào — ngay trên ô ở máy tính và trong chi tiết căn ở mọi cỡ màn — và giá trị ấy là của sàn: danh mục dùng chung chỉ điền chỗ sàn chưa có, ô khác danh mục có dấu nhỏ và lệnh «lấy lại theo Danh bạ»"
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3h
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3h của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ sửa được diện tích, tầng, phòng ngủ, hướng và loại hình của căn mình chào — ngay trên ô ở máy tính và trong chi tiết căn ở mọi cỡ màn — và giá trị ấy là của sàn: danh mục dùng chung chỉ điền chỗ sàn chưa có, ô khác danh mục có dấu nhỏ và lệnh «lấy lại theo Danh bạ»

Vì sao: Chủ kho 2026-11-27 tại phiên dãy H: «Tin rao giữ giá trị riêng, Danh bạ chỉ làm giàu, mọi ô sửa được trừ khi khoá»; giám sát đối chiếu onehub-invest (ADR-0013 §6, ADR-0016 §7: kế thừa từ danh bạ luôn ở lớp thấp nhất, không đè, lệch là tín hiệu) và chủ kho trả «Chốt hướng» (tám điểm ở LUAT đợt dieu-phoi-nen). Hôm nay tầng, hướng, diện tích, phòng ngủ chỉ đọc từ danh mục nên không ai sửa được chỗ sai, và căn sàn tự tạo (căn chờ khớp, hàng 12) không có chỗ giữ chúng. Lát A: giá trị riêng trên tin cho năm thuộc tính, mỗi giá trị nhớ một trong ba nguồn (theo Danh bạ · sàn gõ · nhập từ tệp; thắng: sàn gõ › tệp › Danh bạ), dấu khác Danh bạ kèm «lấy lại theo Danh bạ», sửa trên ô (máy tính) và trong chi tiết căn (mọi cỡ) theo luật chỗ sửa 2026-11-17. Lát B: khoá, chủ kho quyết sau khi dùng lát A. Hàng này LẬT các dòng đã ký: hàng 4 «Never: sửa thuộc tính căn (diện tích, phòng ngủ, toà) trên ô»; hàng 5 «sửa thuộc tính căn bằng dán» ngoài phạm vi; dòng ngoài phạm vi của 3g «sửa thông tin của căn (tầng, hướng, diện tích) — thuộc danh mục, hàng 3e»; vai của 3e «Báo sai» thu về người không có quyền sửa — bốn hồ sơ ghi sửa-sau-ký khi 3h làm. Danh mục dùng chung vẫn không bị sàn sửa. Đổi thực thể Listing (tầng high). RESO đặt LivingArea, BedroomsTotal, DirectionFaces, UnitFloorLocation trên Property — chính resource của Listing — nên không tên RESO nào đổi nghĩa

## Đáng gì

- **Sửa được chỗ sai ngay tại sàn.** Hôm nay tầng, hướng, diện tích, phòng ngủ, loại hình chỉ đọc từ danh mục dùng
  chung: danh mục sai thì Đầu chủ chỉ có «Báo sai» rồi chờ, trong khi khách hỏi ngay. Sau 3h, Đầu chủ gõ giá trị đúng
  trên ô hoặc trong chi tiết căn, giá trị ấy là của sàn.
- **Căn sàn tự tạo có chỗ giữ thuộc tính.** Căn chờ khớp (hàng 12, hàng 11) hôm nay không có chỗ ghi diện tích hay
  phòng ngủ — bảng hàng hiện ô trống tới khi danh mục có căn. 3h cho các căn ấy đủ cột từ ngày đầu.
- **Danh mục vẫn sạch, lệch hiện thành tín hiệu.** Sàn không sửa danh mục (luật cũ giữ). Ô khác danh mục có dấu nhỏ;
  bấm «lấy lại theo Danh bạ» là về. Danh mục đổi về sau không đè giá trị sàn đã có — giống cách onehub-invest để kế
  thừa từ danh bạ luôn ở lớp thấp nhất.
- **Gỡ nút thắt cho nhập Sheet.** Hàng 11 nay giữ nguyên văn diện tích, phòng ngủ, hướng, tầng, loại hình trong bản ghi
  lần nhập, chưa ghi vào căn và chưa so với Danh bạ. Lát A đọc lại chúng làm nguồn «nhập từ tệp», và hiện chênh lệch so
  với Danh bạ ngay ở bước xem trước của lần nhập.

**Tên cho đúng:** thuộc tính thứ năm là «Loại hình» (Căn hộ, Nhà phố…). «Loại căn» (Studio, 2PN) là khái niệm riêng suy
từ số phòng ngủ: nó tự đổi theo phòng ngủ của tin. Cho sàn gõ đè «Loại căn» hay không là câu của Cổng Phạm vi 3h. Hàng
11 nhận cột Sheet «Loại căn» hay «Loại hình» vào Loại hình; ô kiểu «2PN» giữ nguyên văn với dấu «cần người».

## Hai lát

| Lát | Gồm | Khi nào |
|---|---|---|
| **A** | Giá trị riêng trên tin cho năm thuộc tính (diện tích, tầng, phòng ngủ, hướng, loại hình) · mỗi giá trị nhớ một trong ba nguồn: theo Danh bạ · sàn gõ · nhập từ tệp (thắng: sàn gõ › tệp › Danh bạ) · dấu nhỏ trên ô khác Danh bạ + lệnh «lấy lại theo Danh bạ» · sửa trên ô (máy tính) và trong chi tiết căn (mọi cỡ), theo luật chỗ sửa 17/11 · đổi căn hay toà chỉ trong chi tiết căn | Hàng này |
| **B** | Khoá một giá trị (không ai sửa được) | Chủ kho quyết sau khi dùng lát A — hình khoá trên Bảng hàng hôm nay đang nghĩa «căn đã bán» |

## Giá phải trả

- **Đổi mô hình Tin rao (Listing):** thêm năm giá trị và nguồn của chúng; một migration mới. Đây là vùng tầng cao —
  PR do người gộp.
- **Bốn hồ sơ đã ký ghi «sửa sau ký»:** hàng 4 (dòng «không bao giờ sửa diện tích, phòng ngủ, toà trên ô»), hàng 5
  (dán vào thuộc tính căn ngoài phạm vi), 3g (dòng ngoài phạm vi «thông tin của căn thuộc danh mục»), 3e («Báo sai»
  nay cho người không có quyền sửa).
- **Đứng sau 3g** (đang chờ chữ ký) — 3h dùng đường sửa và chi tiết căn của 3g; cùng 4, 5, 3e, 12 và 11 (giá trị nhập giữ sẵn trong bản ghi lần nhập).
- Ước máy: 0,9–8,6 giờ máy, khoảng 5,6% hạn mức tuần (dự báo của kit).

## Đã chốt (không hỏi lại)

Tám điểm chủ kho trả «Chốt hướng» ngày 27/11 (sổ đợt, mục «Hướng mô hình — Tin rao giữ giá trị riêng»): giá trị riêng
cho năm thuộc tính · ba nguồn và thứ tự thắng · dấu khác Danh bạ · đổi căn/toà chỉ trong chi tiết · giá và trạng thái
giữ luật cũ · «Báo sai» còn cho người không có quyền sửa, gửi lệch về Invest sau MVP · khoá là lát B · liên hệ chủ nhà
là dữ liệu riêng của sàn.

## Điểm mở cho chủ kho

- **(a)** Hàng chờ «Bảng hàng đủ cột như Quỹ hàng» (lời 17/11): gộp vào 3h hay để hàng riêng? Khuyến nghị: **để hàng
  riêng, đứng sau 3h** — 3h làm năm cột sửa được và nguồn của chúng; «đủ cột» là chuyện hiện/ẩn các cột còn lại (giá
  chốt, ngày bán, đầu chủ, mức đủ…) và giới hạn 8 cột đã ký ở hàng 2. Gộp thì 3h phình quá cỡ một vòng.
- **(b)** Các lỗi ở ngăn chi tiết căn ông thấy 27/11 (cách ngăn hiện ra): sửa trong trang chi tiết của 3h hay một hàng
  giao diện riêng? Khuyến nghị: **liệt kê ở đây; lỗi nào nằm đúng chỗ 3h chạm (ngăn chi tiết căn) thì sửa trong 3h,
  lỗi còn lại thành một hàng giao diện nhỏ riêng**. Cần ông kể ra từng lỗi.
- **(c)** Chữ trên màn «Tin rao» / «Danh bạ» so với chữ hôm nay «Hàng» / «danh mục»: để Cổng Phạm vi, không hỏi bây giờ.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Đầu chủ sửa một trong năm thuộc tính trên ô hoặc trong chi tiết căn thì Bảng hàng, hồ sơ căn và mức đủ thông tin hiện giá trị của sàn; danh mục dùng chung không đổi một dòng; ô khác danh mục có dấu nhỏ, bấm «lấy lại theo Danh bạ» thì ô về giá trị danh mục và nguồn về «theo Danh bạ»; danh mục đổi về sau không đè giá trị sàn gõ hay nhập từ tệp; căn chờ khớp giữ được năm thuộc tính trước khi khớp; sàn khác không thấy giá trị của sàn này (SP-1); kiểm tra, câu lỗi, hoàn tác dùng luật của hàng 4; giá và trạng thái giữ luật đã ký, ô máy tính ra không sửa» chưa?
- Kết quả nào là SỐNG: [đề xuất] Đầu chủ sửa một trong năm thuộc tính trên ô hoặc trong chi tiết căn thì Bảng hàng, hồ sơ căn và mức đủ thông tin hiện giá trị của sàn; danh mục dùng chung không đổi một dòng; ô khác danh mục có dấu nhỏ, bấm «lấy lại theo Danh bạ» thì ô về giá trị danh mục và nguồn về «theo Danh bạ»; danh mục đổi về sau không đè giá trị sàn gõ hay nhập từ tệp; căn chờ khớp giữ được năm thuộc tính trước khi khớp; sàn khác không thấy giá trị của sàn này (SP-1); kiểm tra, câu lỗi, hoàn tác dùng luật của hàng 4; giá và trạng thái giữ luật đã ký, ô máy tính ra không sửa
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Đầu chủ sửa một trong năm thuộc tính trên ô hoặc trong chi tiết căn thì Bảng hàng, hồ sơ căn và mức đủ thông tin hiện giá trị của sàn; danh mục dùng chung không đổi một dòng; ô khác danh mục có dấu nhỏ, bấm «lấy lại theo Danh bạ» thì ô về giá trị danh mục và nguồn về «theo Danh bạ»; danh mục đổi về sau không đè giá trị sàn gõ hay nhập từ tệp; căn chờ khớp giữ được năm thuộc tính trước khi khớp; sàn khác không thấy giá trị của sàn này (SP-1); kiểm tra, câu lỗi, hoàn tác dùng luật của hàng 4; giá và trạng thái giữ luật đã ký, ô máy tính ra không sửa» khi hết timebox
- Timebox: một vòng lát A (Cổng Phạm vi → Cổng Bằng chứng) trong đợt dieu-phoi-nen, sau khi 3g gộp.
