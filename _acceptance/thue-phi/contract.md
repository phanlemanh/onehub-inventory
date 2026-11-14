---
schema_version: 1
feature: Quản trị sàn đặt Thuế phí và thấy Bảng hàng tính theo mức đó
slug: thue-phi
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api, config]
screens: [tuy-chinh-san, inventory]
status: draft
design_doc: docs/superpowers/specs/2026-11-14-thue-phi-design.md
---

# Acceptance Contract: thue-phi

## Context

Hàng 19 của `docs/plan/lo-trinh.json` (T3, dãy N, đợt `dieu-phoi-nen`), ô cơ hội `_acceptance/thue-phi/opportunity.md` đã
quyết «build» (Manh Phan, 13/11/2026). Đứng trên hàng 9 và 9a; hàng 11 (nhập Sheet) đứng trên hàng này. Dựng sau khi hàng 7e
(PR #53, màn «Tuỳ chỉnh của sàn») và hàng 9c (PR #60, khối `FramedList` của họ danh sách khung) vào nhánh chính. Mức thuế phí của sàn gồm ba khoản cố định — Thuế thu nhập cá nhân 2% và
Lệ phí trước bạ 0,5% theo luật, Phí môi giới 0–5% (mặc định 1%) — mỗi khoản bật hay tắt khỏi giá bao phí. Về tay của một hàng
Bao phí = Giá chào × (1 − tổng tỉ lệ các khoản đang bật). Tỉ lệ lưu bằng phần vạn số nguyên.

Luật chạm: **SP-1** (bảng mới `company_fee_schedules` có `company_id`, luật theo dòng ép buộc trong cùng migration, ca mới ở
bộ kiểm cách ly, mọi truy vấn qua `withCompany`); **SP-4** giữ (mức, khoản, Về tay và Điều kiện phí là nội bộ; hàng này không
thêm gì vào dữ liệu ra ngoài). Không chạm SP-3. Người xem Bảng hàng theo dòng `viewListings` của bảng quyền (Đầu chủ, Đầu
khách, Trưởng nhóm); Quản trị sàn đặt mức, không được mở Bảng hàng ở hàng này.

## Criteria

- **AC-1** — Lõi tính Về tay theo các khoản đang bật.
  Given hai khoản theo luật (Thuế thu nhập cá nhân 2%, Lệ phí trước bạ 0,5%) và các khoản riêng của sàn (mặc định chỉ có Phí
  môi giới 1%), với bảng viết trước: mọi tập con của hai khoản luật × khoản riêng 0, 1, 2 hay 5 khoản đang bật ở các tỉ lệ
  0, 1, 2,5, 5%,
  When tính Về tay cho Giá chào 3 tỷ Bao phí, 3 tỷ Không bao phí, 1 đồng, chưa có giá, và chưa có điều kiện,
  Then chỉ khoản đang bật bị trừ; mặc định cho 3 tỷ Bao phí → 2.895.000.000 đồng; Không bao phí → bằng Giá chào; làm tròn
  xuống tới đồng; chưa có giá hay chưa có điều kiện → trống; và hàm kiểm mức từ chối: tỉ lệ khoản riêng dưới 0, trên 5, lẻ
  quá 0,1; tên khoản riêng rỗng, quá 40 ký tự hay trùng tên khoản khác; quá 5 khoản riêng đang dùng; tổng tỉ lệ các khoản
  đang bật quá 10%; không khoản nào đang bật — mỗi lỗi nêu đúng khoản sai.

- **AC-2** — Màn Thuế phí hiện các khoản, tỉ lệ và nguồn.
  Given Quản trị sàn mẫu ở Tuỳ chỉnh của sàn › Thuế phí, sàn đã đổi Phí môi giới thành 1,5% và thêm khoản riêng «Phí dịch vụ
  hồ sơ» 0,3%,
  When mở phần,
  Then hai dòng đầu là Thuế thu nhập cá nhân 2% và Lệ phí trước bạ 0,5% ghi «theo luật», không ô sửa tỉ lệ, không «…»; sau
  đó các khoản riêng theo thứ tự thêm (Phí môi giới 1,5%, Phí dịch vụ hồ sơ 0,3%), mỗi dòng có ô tỉ lệ; mỗi dòng một công
  tắc «Tính vào giá bao phí»; dòng mang nguồn «Mặc định» / «Đã đổi · [Tên] · <ngày>» / «Sàn thêm · [Tên] · <ngày>»; mọi
  chữ đến từ `ontology/labels.yaml` hay tệp chữ của mô-đun; chân khung có dòng ví dụ «Giá chào 3 tỷ bao phí → về tay …»
  tính theo mức đang gõ, đổi ngay khi gõ, trước khi Lưu (Hỏi-6).

- **AC-3** — Quản trị sàn lưu mức một lần; sai thì không ghi. (cross-layer)
  Given Quản trị sàn ở phần Thuế phí, sàn đang dùng mặc định,
  When đặt Phí môi giới 2 (và ở ca thứ hai gõ «1,5») và tắt Lệ phí trước bạ rồi bấm Lưu,
  Then đúng một lần `PUT /api/v1/company/fee-schedule` mang cả mức («1,5» gửi 150 phần vạn); thông báo «Đã lưu thuế phí»;
  tải lại giữ giá trị; cơ sở dữ liệu ghi người và lúc đổi trên đúng các khoản đã đổi; «Trả về mặc định» ở dòng đã đổi rồi Lưu
  đưa khoản ấy về mặc định; mức sai theo AC-1 thì Lưu khoá, lý do gắn đúng dòng, và API nhận thẳng mức ấy trả 400 nêu khoản
  sai, cơ sở dữ liệu không đổi.

- **AC-4** — Vai khác chỉ đọc. (cross-layer)
  Given người mang Đầu chủ, Đầu khách hay Trưởng nhóm (không Quản trị sàn) của sàn mẫu,
  When mở phần Thuế phí và gửi `PUT /api/v1/company/fee-schedule`,
  Then phần hiện ba dòng không ô sửa, không nút Lưu, kèm dòng «Chỉ Quản trị sàn đổi được thuế phí»; API trả 403 và cơ sở
  dữ liệu không đổi; bảng quyền có hai dòng mới `readFeeSchedule` (bốn vai, phạm vi sàn) và `setFeeSchedule` (chỉ Quản trị
  sàn), và cơ sở dữ liệu chặn ghi theo đúng dòng ấy kể cả khi gọi thẳng dưới vai ứng dụng.

- **AC-5** — Mỗi hàng mang Điều kiện phí.
  Given mô hình nghiệp vụ và hàng mẫu của Bảng hàng,
  When sinh mã (`make gen`) và đọc hàng mẫu,
  Then `Listing` có thuộc tính `feeInclusion` với hai giá trị `Included` (nhãn «Bao phí») và `Excluded` (nhãn «Không bao
  phí»), khai là riêng của ta (RESO 2.1 không có), có ở `ontology/glossary.md` và `labels.yaml` cùng các khái niệm
  `FeeSchedule` (Thuế phí), ba khoản và «Về tay»; hàng mẫu có cả hàng Bao phí, hàng Không bao phí và ít nhất một hàng thiếu
  điều kiện; và có ít nhất một hàng Bao phí Giá chào 3.000.000.000 đồng và ít nhất một hàng thiếu Giá chào (hai hàng mà AC-6
  dùng).

- **AC-6** — Bảng hàng tính Về tay theo mức của sàn. (cross-layer)
  Given sàn mẫu A đã đặt Phí môi giới 2% và tắt Lệ phí trước bạ, sàn B dùng mặc định,
  When Đầu chủ của A mở Bảng hàng, rồi Quản trị A đổi Phí môi giới về 1% và Đầu chủ mở lại Bảng hàng,
  Then cột «Về tay» đứng ngay sau «Giá chào» và hiện sẵn; hàng Bao phí 3 tỷ hiện 2,88 tỷ rồi 2,91 tỷ sau lần đổi; hàng
  Không bao phí bằng Giá chào; hàng thiếu giá hay thiếu điều kiện thì trống; cột «Điều kiện phí» có trong menu Cột, ẩn
  sẵn, bật lên hiện «Bao phí» / «Không bao phí»; Về tay sắp được như cột tiền; Đầu chủ của B thấy 2,895 tỷ ở hàng cùng giá;
  ở khổ 1440, khi cột thứ hai của App Shell mở, cột Về tay nằm trong khung nhìn đầu cạnh Giá chào (không phải cuộn mới thấy);
  các cột sau Về tay cuộn ngang như cột riêng của sàn ở hàng 7e; ở 360, 414 và 1024 Bảng hàng giữ cách hiện sẵn có của khổ
  ấy và có cột Về tay.

- **AC-7** — Sàn khác không đọc, không ghi được mức của nhau. (SP-1)
  Given sàn A đã đặt mức, sàn B chưa đặt,
  When người sàn B đọc, ghi mức qua API và truy vấn thẳng bảng dưới vai ứng dụng,
  Then B nhận mức mặc định, không thấy dòng của A, không sửa được dòng của A; bảng khoản phí của sàn (`company_fee_items`, một dòng mỗi khoản sàn đã đổi hay thêm) có `company_id`, luật theo dòng bật và
  ép buộc trong cùng migration; bộ kiểm cách ly có ca cho bảng mới và xanh trên Postgres của dãy N.

- **AC-9** — Phần Thuế phí ghép từ khối của họ danh sách khung, đủ bộ nút theo vai.
  Given khối chung `FramedList` của hàng 9c (`src/components/candidate/framed-list.tsx`) và màn Thành viên đã gộp,
  When dựng phần Thuế phí và đặt nó cạnh màn Thành viên ở 1440 và 360,
  Then phần Thuế phí chỉ điền khe của `FramedList` (đầu khung có tên «Thuế phí», dòng đếm «n khoản · m đang tính vào giá
  bao phí» và nút «Thêm khoản»; mỗi khoản một dòng; chỗ chỉnh cuối dòng; chân khung có ghi chú và nút Lưu), không khung,
  viền hay nhãn tự vẽ bằng thẻ trần; lề, bo góc, cỡ chữ đầu khung và cỡ chữ dòng giống màn Thành viên; và bộ nút theo vai
  đúng bảng «Bộ nút theo vai» dưới: «Thêm khoản», chỗ chỉnh cuối dòng, «…» ở khoản riêng và nút Lưu chỉ hiện với
  `setFeeSchedule`; ba vai đọc thấy giá trị, không ô sửa, không «Thêm khoản», không «…», không Lưu.

- **AC-10** — Quản trị sàn thêm, đổi tên, bỏ khoản riêng. (cross-layer)
  Given Quản trị sàn ở phần Thuế phí, sàn có Phí môi giới mặc định,
  When bấm «Thêm khoản», gõ tên «Phí dịch vụ hồ sơ» và 0,3, Lưu; rồi «…» › Đổi tên thành «Phí hồ sơ», Lưu; rồi «…» › Bỏ
  khoản, Lưu,
  Then sau lần đầu Bảng hàng trừ thêm 0,3% ở hàng Bao phí; sau lần hai dòng mang tên mới, Về tay không đổi; sau lần ba khoản
  ra khỏi danh sách và khỏi Về tay, còn dòng ở cơ sở dữ liệu đánh dấu ngừng dùng kèm người và lúc, mã khoản không dùng lại;
  hai khoản theo luật không có «Đổi tên», «Bỏ khoản» ở màn và API trả 400 nếu gửi thẳng; khoản thứ sáu, tên trùng hay tổng
  quá 10% thì «Thêm khoản» báo lý do và không ghi.

- **AC-8** — Điều đang đúng đã ghi.
  Given hàng xong,
  When đọc wiki và sổ màn,
  Then có trang `wiki/entities/fee-schedule.md`, trang `listing` nói Điều kiện phí, một dòng ở `wiki/log.md`; sổ màn
  `design/screens.yaml` có phần Thuế phí của `tuy-chinh-san` với `setFeeSchedule`; trang tri thức Cài đặt sàn được báo đổi
  qua yêu cầu `viec-phu` (không tự sửa kho tri thức); và `make check` xanh.

## Vai × Màn

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
| --- | --- | --- | --- | --- |
| tuy-chinh-san | được — đọc phần Thuế phí, không sửa | được — đọc phần Thuế phí, không sửa | được — đọc phần Thuế phí, không sửa | được — đặt mức ở phần Thuế phí, Lưu |
| inventory | được — đọc cột Về tay | được — đọc cột Về tay | được — đọc cột Về tay | chặn — không có Bảng hàng (bảng quyền 9a) |

## Bộ nút theo vai

| Việc | Ở đâu | Quản trị sàn | Đầu chủ · Đầu khách · Trưởng nhóm | Dòng bảng quyền |
| --- | --- | --- | --- | --- |
| Xem mức (ba khoản, tỉ lệ, nguồn, dòng ví dụ) | phần Thuế phí | có | có (chỉ đọc) | `readFeeSchedule` |
| Bật hay tắt khoản khỏi bao phí | công tắc cuối dòng | có | thấy công tắc khoá | `setFeeSchedule` |
| Đổi tỉ lệ môi giới | ô số cuối dòng Phí môi giới | có | thấy số, không ô | `setFeeSchedule` |
| Trả về mặc định | «…» cuối dòng đã đổi | có | không hiện | `setFeeSchedule` |
| Lưu | chân khung | có | không hiện; chân ghi «Chỉ Quản trị sàn đổi được thuế phí» | `setFeeSchedule` |
| Thêm khoản | đầu khung | chờ Hỏi-7 (khuyên: có, khoản riêng) | không hiện | `setFeeSchedule` |
| Đổi tên, bỏ khoản | «…» cuối dòng khoản riêng | chờ Hỏi-7 (khuyên: có; hai khoản luật thì không) | không hiện | `setFeeSchedule` |
| Xem cột Về tay, sắp, lọc, ẩn hiện, lưu góc nhìn | Bảng hàng | không có Bảng hàng (bảng quyền 9a; Hỏi-6) | có | `viewListings` |
| Sửa Về tay trên ô | Bảng hàng | — | bỏ — Về tay tính từ Giá chào, sửa Giá chào ở ô của hàng 4 | — |
| Sửa Điều kiện phí trên ô | Bảng hàng | — | chờ Hỏi-8 (khuyên: để hàng 10) | `updateListing` |

## Đường đo

Ngưỡng của ô cơ hội chưa khai (mục «Ngưỡng chết / ngưỡng UAT» còn trống). Đường đo theo câu giao, từng vế:

- Thước: Quản trị sàn đặt được mức · số từ: E3, E3-ui · bảo đảm bởi: AC-2, AC-3
- Thước: Bảng hàng tính theo mức đó · số từ: E6, E6-ui · bảo đảm bởi: AC-1, AC-6
- Thước: sàn khác không bị ảnh hưởng · số từ: E7 · bảo đảm bởi: AC-7

Timebox và ngưỡng sống/chết: chủ kho khai ở Cổng Giá trị (UAT một lần cuối lộ trình MVP).

## Coverage

Quét không gian AC (morphological, preset entity-feature, rút gọn):

- Trục A — khoản: Thuế thu nhập cá nhân · Lệ phí trước bạ · Phí môi giới; bật · tắt [thước CE: trang Cài đặt sàn]
- Trục B — tỉ lệ môi giới: 0 · trong khoảng · 5 · dưới 0 · trên 5 · lẻ quá 0,1 [thước CE: trang Cài đặt sàn]
- Trục C — điều kiện của hàng: Bao phí · Không bao phí · thiếu điều kiện · thiếu giá; bán · cho thuê [thước CE: Quỹ hàng
  luật 12; mô hình hôm nay chưa có loại giao dịch, mọi hàng là bán]
- Trục D — ai: Quản trị sàn · ba vai đọc · sàn khác · vai ứng dụng gọi thẳng [thước CE: bảng quyền, SP-1]
- Trục E — chỗ thấy: phần Thuế phí · Bảng hàng · menu Cột · API · cơ sở dữ liệu · trang khách [thước CE: SP-4]
- Core: A×B ở AC-1, AC-3; C ở AC-1, AC-6; D ở AC-4, AC-7, AC-9; E ở AC-2, AC-6, AC-9; ghi chép AC-8.
- Later: dấu định nghĩa lúc tính trên từng giá (hàng 10) · Về tay ở hồ sơ căn · sửa Điều kiện phí trên ô · nhập Điều kiện
  phí từ Sheet (hàng 11) · nhật ký đổi cấu hình (N10).
- Never: tỉ lệ, khoản hay Về tay ra trang khách · cách tính do sàn tự viết (số tiền cố định, bậc thang, tính trên giá khác).
- Chờ chủ kho: sàn thêm, đổi tên, bỏ khoản riêng (Hỏi-7); sửa Điều kiện phí trên ô (Hỏi-8).

## Out of scope

- Dấu định nghĩa lúc tính trên từng giá (Quỹ hàng luật 13): hàng của Bảng hàng còn là dữ liệu mẫu; hàng 10 làm khi giá thật
  vào cơ sở dữ liệu (Hỏi-4).
- Hàng cho thuê: ba khoản là thuế phí của chuyển nhượng; mô hình chưa có loại giao dịch nên mọi hàng hôm nay là bán. Khi
  mô hình có hàng cho thuê, Về tay của hàng ấy để trống.
- Sửa Điều kiện phí trên ô, và Về tay ở hồ sơ căn hay màn cuộc gọi.
- Nhập Điều kiện phí từ Sheet («Phí CN», «BP») — hàng 11.
- Nhật ký đổi cấu hình — trang N10.
- Mở Bảng hàng cho Quản trị sàn — việc của bảng quyền.
- Tỉ lệ, khoản hay Về tay ra trang khách — Never (SP-4).

## Notes

- Hỏi-1 (Điều kiện phí cho từng hàng), Hỏi-2 (chỗ đặt mức), Hỏi-3 (cột hiện sẵn), Hỏi-4 (dấu lúc tính) chờ chủ kho ở Cổng
  Phạm vi; khuyến nghị ở sổ quyết định.
- Hỏi-7 (danh sách khoản cố định hay sàn thêm, đổi tên, bỏ khoản riêng) và Hỏi-8 (sửa Điều kiện phí trên ô) chờ chủ kho;
  hợp đồng hiện viết theo ba khoản cố định — chủ kho chọn B hay C thì AC-1, AC-2, AC-3, AC-9, bảng «Bộ nút theo vai» và
  migration đổi theo (một bảng khoản theo dòng), thêm tiêu chí thêm/đổi tên/bỏ và trần, rồi trình lại thẻ.
- Hỏi-6 (Quản trị sàn thấy kết quả thế nào) chờ chủ kho: khuyên một dòng ví dụ tính sẵn trong phần Thuế phí; lối khác mở
  Bảng hàng cho Quản trị sàn ngay ở hàng này.
- Hỏi-5 (mặc định môi giới 1%, bước 0,1%) chờ chủ kho; đổi mặc định thì các số ghim 2,895 tỷ ở AC-1, AC-6, E1, E6-e2e đổi
  theo.
- Đổi `ontology/` (thuộc tính `Listing.feeInclusion`, khái niệm `FeeSchedule`, ba khoản, hai dòng bảng quyền, nhãn) cần chủ
  kho duyệt ở cổng này.
