---
schema_version: 1
feature: "Đầu chủ dùng Bảng hàng bằng tay như Sheet: đi giữa các ô bằng phím mũi tên, bôi một vùng ô rồi chép sang Zalo hay Excel, bấm tiêu đề để sắp xếp, lọc từng cột, nhóm dòng theo toà, ẩn hiện cột"
slug: bang-hang-dung-tay-nhu-sheet
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: _acceptance/bang-hang-dung-tay-nhu-sheet/design.md
---

# Acceptance Contract: bang-hang-dung-tay-nhu-sheet

## Context

Lớp hai của «thói quen Sheet» trên Bảng hàng (`/inventory`), sau hàng 2 «đọc như Sheet». Mọi hành vi nằm trong khuôn Lưới
dùng chung (`DataRegion`) để Đã gửi (hàng 6) và các màn Lưới sau dùng lại. Hàng 3 (hồ sơ căn) chạy song song trên cùng màn;
cách sống chung ở `design.md`. Không ghi dữ liệu, không gửi ra ngoài: chép vùng là người tự dán (SP-3 không bị chạm); không
truy vấn cơ sở dữ liệu (SP-1); không phải trang khách (SP-4).

Source input: hàng `2a` của `docs/plan/lo-trinh.json`, ô `opportunity.md` (build), LUAT đợt «nen» mục 2026-11-11 13:50Z và
2026-11-12 06:20Z, trang `docs/tri-thuc/wiki/chu-de/bang-hang.md`.

## Criteria

- AC-1: Given Bảng hàng 60 dòng ở mỗi khổ 1440, 1024, 414, 360, When chọn một ô rồi bấm lần lượt mũi tên phải, xuống, Tab,
  Shift+Tab, End, Home, Ctrl+End, Ctrl+Home, PageDown, Then sau mỗi phím ô chọn ở đúng dòng và cột của bảng viết trước (End
  là cột Xác nhận lúc, Ctrl+End là dòng 60), và ô ấy nằm trọn trong khung cuộn của bảng, không bị ba cột đứng yên hay tiêu đề
  che; và When Esc, Then không còn vùng chọn.
- AC-2: Given một ô của dòng 3 cột Căn, When Shift+xuống hai lần rồi Shift+phải một lần và Ctrl+C (Cmd+C trên Mac), Then
  khay chép mang đúng chữ các ô đang hiện của vùng 3 dòng × 2 cột (Căn, Toà), cột tách bằng tab, dòng tách bằng xuống dòng,
  không dòng tiêu đề, không cột số dòng; chân bảng ghi «6 ô đã chọn · Ctrl+C để chép»; và Given một vùng gồm Trạng thái và
  Giá chào, Then chữ chép là nhãn trạng thái và giá «x,xx tỷ» đúng như ô hiện (không phải mã hay số thô); và Given một cột bị
  ẩn nằm giữa vùng, Then chữ chép bằng đúng các cột còn hiện.
- AC-3: Given 60 dòng, When mở menu tiêu đề một cột và chọn Tăng dần, rồi Giảm dần, Then thứ tự dòng bằng thứ tự của luật
  sắp xếp trên chính 60 dòng ấy cho mỗi kiểu cột (chữ, tiền, diện tích, số, trạng thái, ngày giờ): ô trống luôn cuối, trạng
  thái theo thứ tự trạng thái, chữ «Toà 2» trước «Toà 10»; số dòng vẫn 1 đến 60 liền; bỏ sắp xếp thì về thứ tự ban đầu.
- AC-4: Given 60 dòng và hàng lọc mở, When gõ hay chọn ở ô lọc của từng cột theo ma trận viết trước (chữ «toa e» không dấu,
  trạng thái chọn hai giá trị, giá `<=5` tỷ, diện tích `60-80`, phòng ngủ `>=3`, xác nhận lúc `>5` ngày, một luật sai
  `5 tỷ`), Then tập dòng còn lại bằng đúng tập tính lại từ dữ liệu nguồn cho mỗi ô; các ô lọc cộng dồn; luật sai được báo ở ô
  và không lọc gì; chân và thanh công cụ ghi «n / 60 dòng»; «Xoá lọc» trả về 60 dòng; lọc ra rỗng thì vùng ở trạng thái «Không
  có dòng nào khớp» có «Xoá lọc».
- AC-5: Given 60 dòng (có và không lọc), When bật «Nhóm theo Toà», Then mỗi toà có một dòng nhóm theo thứ tự đọc (số như số),
  mang tên toà và số dòng của toà ấy sau lọc, các dòng dữ liệu nằm dưới đúng toà của mình, số dòng đếm liền 1 đến n qua các
  nhóm và dòng nhóm không có số; gập một nhóm thì dòng của nó ẩn, số của dòng nhóm khác không đổi; và When sắp Giá chào tăng
  rồi giảm khi đang nhóm, Then thứ tự toà giữ nguyên và giá theo đúng chiều trong từng toà.
- AC-6: Given 60 dòng, When mở nút «Cột», Then menu liệt kê bảy cột trừ Căn; tắt một cột thì tiêu đề và ô của cột ấy biến mất,
  bật lại thì hiện lại đúng chỗ; tắt Toà khi đang nhóm thì nhãn nhóm sang cột đầu còn hiện; ba cột số dòng, Căn, Toà vẫn đứng
  yên khi cuộn ngang ở 360; và When bỏ ghim Toà ở menu tiêu đề của nó, Then Toà thôi đứng yên mà Căn vẫn đứng yên.
- AC-7 (cross-layer): Given cột thứ hai của App Shell, When đọc sáu lối tắt trạng thái, Then mỗi lối trỏ
  `/inventory?status=<trạng thái>` và thứ tự sáu lối bằng thứ tự lựa chọn trong ô lọc Trạng thái của lưới và bằng thứ tự nhãn
  trạng thái trong `ontology/labels.yaml`; When mở từng lối tắt trên bản chạy, Then trang đưa đúng bộ lọc vào lưới, lưới chỉ
  còn các dòng mang trạng thái ấy (đếm lại từ dữ liệu mẫu), hàng lọc mở với trạng thái ấy đã chọn, lối tắt ấy sáng
  (`aria-current`) còn «Tất cả hàng» thì không; `?status=` lạ thì bảng không lọc; và When mở lối tắt «Đang bán» rồi gõ thêm
  `<=5` ở Giá chào, Then tập dòng là giao của hai điều kiện, lọc trạng thái vẫn còn.
- AC-8: Given khuôn Lưới dùng chung, When một màn khác dựng `DataRegion` (trang mẫu khuôn Lưới) mà không viết mã phím, lọc,
  sắp xếp, cột nào, Then màn ấy có cùng thanh Lọc · Cột, menu tiêu đề và ô chọn; không tệp màn nào nhập thẳng thành phần lưới
  ReUI (bước chấm khuôn); và Given vùng có hồ sơ (`record`), When Enter trên một ô, Then lối «mở dòng» được gọi với id dòng
  ấy, không có hồ sơ thì Enter đi xuống ô dưới.
- AC-9: Given Bảng hàng ở bốn khổ, sáng và tối, ở ba trạng thái (mặc định, hàng lọc mở có lọc, nhóm theo toà), When quét trợ
  năng, Then không có lỗi nặng; Tab đi qua đúng danh sách điểm dừng viết trước trong vùng lưới (các nút tiêu đề, các ô lọc khi
  hàng lọc mở, rồi bảng), thân bảng là đúng một điểm dừng trước và sau khi trang chạy; trang không cuộn ngang.
- AC-10: Given Bảng hàng đang chạy, When nhìn ở bốn khổ, sáng và tối, với hàng lọc mở, nhóm theo toà và một vùng ô đã bôi,
  Then nút công cụ, ô lọc, dòng nhóm và vùng chọn đọc được, không chữ chồng chữ, vùng chọn và dòng nhóm phân biệt được với dòng
  thường. (judgment)
- AC-11: Given Bảng hàng ở khổ 1440 và 1024, When bấm «Toàn màn hình», Then trình duyệt vào toàn màn hình, cột biểu tượng,
  cột thứ hai, thanh trên và đầu màn «Bảng hàng» ẩn đi, lưới dày và kéo tới đáy màn hình mà trang không cuộn, số dòng thấy
  được nhiều hơn lúc thường (1440 × 900: từ 18 lên 21; 1024 × 768: từ 13 lên 17); menu «Cột», menu tiêu đề và ô chọn trạng
  thái mở ra vẫn hiện trên bảng; phím, chép, lọc, nhóm chạy như thường; When Esc hay bấm «Thoát toàn màn hình», Then App Shell
  và đầu màn trở lại như trước; dưới khổ 768 không có nút này.

## Vai × Màn

Như hàng 2: khung chưa có vai thật. Các thói quen chỉ đổi cách xem của người đang xem, không ghi gì, nên không đổi quyền.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — đọc, lọc, sắp, nhóm, chép mọi căn của sàn | được — như Đầu chủ | được — như Đầu chủ | chặn — vùng báo không đủ quyền theo bản khai vai; bảng quyền của hàng 9a quyết |

## Coverage

Quét trục tại chỗ theo khuôn «entity-feature» của bộ quét hình thái (sổ quyết định):

- Trục 1 — thao tác: phím đi ô · bôi vùng và chép · sắp xếp · lọc · nhóm · ẩn hiện cột · lối tắt · mở dòng · toàn màn hình.
- Trục 2 — kiểu cột: chữ · tiền · diện tích · số · trạng thái · ngày giờ.
- Trục 3 — khổ và giao diện: 360 · 414 · 1024 · 1440; sáng · tối.
- Trục 4 — kết hợp: lọc + nhóm · sắp + nhóm · ẩn cột + nhóm · ẩn cột + chép · lối tắt + lọc thêm.
- Trục 5 — chiều đo: ca chính xanh · ca phá đỏ với thông điệp ghim.
- Trục 6 — nơi dùng: Bảng hàng · màn Lưới khác (trang mẫu khuôn).

Thước: AC-1 trục 1 (phím) × trục 3; AC-2 trục 1 (chép) × trục 2 (chữ, tiền, trạng thái) × trục 4 (ẩn cột); AC-3 trục 1
(sắp) × trục 2; AC-4 trục 1 (lọc) × trục 2; AC-5 trục 4 (lọc, sắp + nhóm); AC-6 trục 4 (ẩn cột + nhóm), trục 3 (360), ghim;
AC-7 lối tắt, trục 4 (lối tắt + lọc thêm); AC-8 trục 6, mở dòng; AC-11 toàn màn hình × trục 3 (1440, 1024); AC-9,
AC-10 trục 3; mọi eval máy khai cặp hai chiều (trục 5). [CE chưa kiểm chứng]: kéo chuột bôi vùng chỉ đo trên trình duyệt ở
1440 (bài phím phủ phần còn lại).

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng (sổ quyết định).

## Out of scope

- Không sửa trên ô (hàng 4), không dán từ Excel hay xoá ô (hàng 5): lưới chỉ đọc, dán và xoá không làm gì.
- Không bảng thẻ điện thoại (hàng 2b); trên 414, 360 vẫn là lưới cuộn ngang trong vùng.
- Không lưu cách xem (góc nhìn) trên máy hay lên địa chỉ, trừ tham số trạng thái của lối tắt: cắt khỏi MVP (L7).
- Không lọc theo dự án, phân khu ở cột thứ hai, không nhóm theo loại căn (dữ liệu mẫu chưa có), không kéo đổi thứ tự hay đổi
  rộng cột, không dòng tổng, không xuất tệp.
- Không đo 5.000 dòng (hàng nối dữ liệu thật).
- Không lưu cách xem thành mục ở cột thứ hai (góc nhìn lưu, hàng H7 đang gác); không toàn màn hình trên điện thoại.

## Notes

- Hỏi-1 (dáng dòng nhóm), Hỏi-2 (lọc ngày theo số ngày đã qua), Hỏi-3 (tiêu đề cột là menu của ReUI), Hỏi-4 (bỏ nút Xuất)
  chờ chủ kho ở Cổng Phạm vi.
- Ngoài-1 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Trên Bảng hàng, lưới vẫn vừa màn hình và chân bảng vẫn thấy được. Nếu sau này đổi chiều cao đầu trang hay thanh công cụ, hoặc một màn Lưới khác dùng khuôn này, chân bảng có thể tụt khỏi màn hình mà không có kiểm tra nào báo. — `src/components/candidate/data-region.tsx`
- Ngoài-2 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Trên một màn Lưới khác có đầu trang hay thanh công cụ cao khác Bảng hàng, bảng có thể bị cuộn thừa hoặc chừa khoảng trống. Bảng hàng hiện tại vẫn hiển thị đúng. — `src/components/candidate/data-region.tsx`
- Ngoài-3 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Người dùng thấy các trạng thái đúng thứ tự trên mọi màn hiện nay. Nguy cơ là về sau sửa thứ tự ở một nơi mà quên nơi kia thì hai danh sách lệch nhau. — `src/components/candidate/grid-view.ts`
- Ngoài-6 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Người dùng không thấy gì khác đi; chỉ là một phép kiểm chép vùng ô không thật sự chạy nên một lỗi chép sai có thể lọt qua mà không bị bắt. — `tests/e2e/sheet.spec.ts`
- Ngoài-7 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Nếu giá hay trạng thái hiển thị sai thì phép kiểm chép vẫn báo đạt, vì nó so với chính thứ đang hiển thị. — `tests/e2e/sheet.spec.ts`
- Ngoài-8 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Chưa chứng minh được rằng phép kiểm menu nằm trên cùng khi toàn màn hình thật sự bắt được lỗi, nên menu bị khuất có thể lọt qua. — `tests/e2e/sheet.spec.ts`
- Ngoài-10 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Người dùng bàn phím có thể gặp thêm điểm dừng Tab thừa hoặc thứ tự Tab bị đảo mà phép kiểm vẫn báo đạt. — `tests/e2e/sheet.spec.ts`
- Ngoài-11 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Lọc giá sai đơn vị mà vẫn bớt vài dòng thì phép kiểm vẫn báo đạt, nên người dùng có thể thấy thiếu hay thừa dòng khi lọc kết hợp. — `tests/e2e/sheet.spec.ts`
- Ngoài-12 (máy định tuyến 2026-11-12, đề xuất S4 known-limits): Nếu PageDown chỉ xuống một dòng như mũi tên xuống thì phép kiểm vẫn báo đạt, người dùng sẽ thấy phím nhảy trang không nhảy xa. — `tests/e2e/sheet.spec.ts`
