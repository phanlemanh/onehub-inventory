---
schema_version: 1
feature: Đầu chủ nạp tệp Excel hay Sheet đang dùng, ghép cột, tên cột, giá trị và mã căn của mình vào chuẩn ngay ở màn xem trước, áp vào bảng và hoàn tác được; lần sau cùng dạng tệp không phải ghép lại
slug: nhap-excel
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config, ui]
screens: [nhap-tep, inventory]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-17
design_doc: docs/superpowers/specs/2026-11-17-nhap-excel-design.md
---

# Acceptance Contract: nhap-excel

## Context

Hàng 11 của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/nhap-excel/opportunity.md` đã quyết «build» bởi Manh Phan
ngày 15/11/2026. Dựng trên hàng 10 (Bảng hàng dữ liệu thật) và 7e (lớp riêng của sàn). Lần nhập là lúc ghép chuẩn của kho
với chữ của sàn ở năm chỗ: cột, tên cột, giá trị, căn, dạng tệp; mỗi ô một trong bốn dấu (giữ nguyên · máy sửa kèm lý do ·
cần người · chặn); lựa chọn của người ghi vào lớp riêng khi lần nhập thành công. Không AI (H5). Luật chạm: SP-1 (bảng lần
nhập mới, quyền tạo và xoá có rào trên lần chào, qua một cửa); SP-4 (chữ của sàn không ra trang khách — hàng này không chạm
trang khách). Không chạm SP-3. Hàng này làm chủ cửa tạo lần chào ở máy chủ (G-1711-6, Hỏi-1).

## Criteria

- AC-1 (cross-layer): Given Đầu chủ trên màn Nạp tệp khổ 1440, When chọn một tệp, Then tệp `.xlsx` (trang tính đầu có dữ
  liệu; tên các trang khác được nói ra) và `.csv` UTF-8 (có hay không BOM, phân cách phẩy hay chấm phẩy) đọc ra đúng tiêu
  đề và ô như bảng viết trước; ma trận lỗi viết trước — sai đuôi, trên 10 MB, trên 5.000 dòng, tệp rỗng, chỉ
  có dòng tiêu đề, tệp hỏng, tệp khoá mật khẩu — mỗi ca một câu ba phần đúng lỗi và «Chọn tệp khác»; tệp không lên máy chủ:
  không yêu cầu nào mang thân tệp, chỉ bảng chữ JSON tới `/api/v1/imports/preview`.
- AC-2: Given bảng tiêu đề viết trước (ít nhất 20 ca), When máy ghép cột, Then mỗi cột có đúng một đích (trường chuẩn,
  trường riêng đang dùng, trường riêng mới, bỏ cột) và một dấu theo thứ tự mẫu nhập → nhãn riêng → nhãn chuẩn → từ điển
  tiêu đề chuẩn; tên cột lạ là «cần người»; hai cột trỏ cùng một đích là «chặn» ở cả hai cột cho tới khi người đổi một
  bên; thiếu cột mã căn là «chặn»; cột chủ nhà hay số điện thoại là «chặn» kèm lý do «ghi ở hồ sơ căn, hàng 11b» (Hỏi-12) cho tới khi người
  bỏ cột; tạo trường riêng mới qua đúng luật của 7e (năm kiểu, trần 20 trường, 30 lựa chọn, tên không trùng).
- AC-3 (cross-layer): Given người chọn đích cho cột «Block» là Toà, When lần nhập thành công với ô «Gọi cột này là “Block”
  trên Bảng hàng» để mặc định, Then sàn có nhãn riêng Toà = «Block» và tiêu đề cột Toà của Bảng hàng là «Block»; bỏ chọn
  ô ấy thì không nhãn nào được ghi; tên cột trùng nhãn chuẩn (sau gấp chữ) thì không hỏi; khái niệm ngoài tám khái niệm
  đặt nhãn được thì không hỏi.
- AC-4: Given bảng giá trị viết trước (ít nhất 30 ca), When máy đọc từng ô của cột đã có đích, Then mỗi ca rơi đúng dấu và
  giá trị: tập đóng (trạng thái, lý do ngừng, hướng, phí, nội thất, người ở, chọn một của sàn) khớp sau gấp chữ là «máy sửa»
  hay «giữ nguyên», khớp từ điển của sàn là «máy sửa» kèm lý do «theo cách viết của sàn», không khớp là «cần người»; giá
  đọc bằng `readPrice` của hàng 4; số, ngày, có/không của trường riêng qua `checkCustomValue` của 7e; Đã bán thiếu giá bán
  hay ngày, Ngừng hẳn thiếu lý do là «cần người»; cột ngày xác nhận (Hỏi-13) đọc ra ngày có thật không sau hôm nay là
  «máy sửa», ngày sau hôm nay hay không đọc được là «cần người»; ô trống là «giữ nguyên» với đích trống. Câu hỏi gom theo (cột, chữ gấp):
  một câu cho mọi ô cùng chữ.
- AC-5 (cross-layer): Given danh mục mẫu của 7d và lớp riêng của sàn A, When máy tra cột mã căn, Then thứ tự là mã riêng →
  mã gốc → bộ đọc 8 dạng → căn chờ khớp (hàm của 7e); ra một căn là «giữ nguyên» (mã gốc) hay «máy sửa» kèm lý do (mã
  riêng, bộ đọc); ra nhiều căn là «cần người» và người chọn một (mặc định nhớ thành mã riêng của sàn); không ra là «cần
  người» với lối mặc định «thành căn chờ khớp, giữ nguyên mã»; cùng một căn ở hai dòng thì dòng sau «chặn»; ô mã căn trống
  là «chặn»; căn đã có lần chào mở trên Bảng hàng thì theo Hỏi-6.
- AC-6 (cross-layer): Given bộ ba tệp thử bẩn có đáp án viết trước (`tests/fixtures/nhap-excel/`), When chạy ghép không có lựa chọn của
  người rồi với bộ lựa chọn viết trước, Then 100% ô có đúng một dấu và một đích như đáp án (trường chuẩn, trường riêng, hay
  giữ chữ gốc kèm «cần người»), không ô nào thiếu dấu hay đích; con số bốn dấu trên màn xem trước bằng con số máy chủ trả;
  còn ô «chặn» thì nút Áp tắt, máy chủ trả 400 nếu vẫn gửi; không có đường áp nào bỏ qua bước xem trước.
- AC-7 (cross-layer): Given xem trước không còn ô chặn, When bấm Áp, Then `POST /api/v1/imports` mở một lần nhập rồi ghi
  theo gói 200 dòng (Hỏi-14) — mỗi gói một giao dịch tính lại dấu, gửi lại cùng gói không ghi trùng — và tạo đúng N lần chào (căn danh mục và căn chờ khớp; dòng có căn đã có lần chào mở không tạo lần chào
  nào và không tính vào N), đầu chủ theo Hỏi-7 (Trưởng nhóm chọn một Đầu chủ của chính sàn; Đầu chủ chỉ nhập cho mình), trạng thái theo Hỏi-5, Xác
  nhận lúc theo cột ngày của tệp hay để trống (Hỏi-13); con số khác số người đã thấy thì 409 và gói ấy không ghi gì; một gói
  hỏng thì các gói đã ghi giữ nguyên, gói hỏng không ghi dòng nào, màn nói đúng số dòng đã ghi và «Thử lại» gửi đúng gói hỏng; bảng quyền
  viết sẵn 4 vai × `importListings`, `createListing` thử ở cửa API và ở cơ sở dữ liệu; bộ kiểm cách ly có ca cho bảng lần
  nhập và quyền tạo, xoá lần chào, đỏ có dòng ghim khi phá; ontology có thực thể Lần nhập, lần chào trỏ được căn chờ khớp,
  `make gen` khớp, `modules.yaml` khai sở hữu và phụ thuộc.
- AC-8 (cross-layer): Given một lần nhập có người chọn đích cột, nhãn riêng, trường riêng mới, cách viết giá trị, mã riêng
  của căn và căn chờ khớp, When lần nhập thành công, Then đúng các mục ấy được ghi vào lớp riêng của sàn (mẫu nhập, nhãn
  riêng, trường riêng, từ điển, mã riêng, căn chờ khớp) và màn Xong liệt kê chúng; bỏ chọn «nhớ» ở một câu thì mục ấy không
  ghi; phần học ghi một lần sau gói cuối thành công, nên lần nhập còn gói chưa ghi hay gặp 409 thì chưa mục nào được ghi;
  mục đã có từ trước không bị ghi lần hai.
- AC-9 (cross-layer): Given lần nhập thứ nhất của một dạng tệp đã thành công, When nạp tệp thứ hai cùng dạng (cùng tên
  cột, cùng thứ tự) với dữ liệu khác, Then số câu đã trả lời được hỏi lại là 0 (cột, tên cột, cách viết, mã căn đã chọn);
  chữ mới chưa gặp vẫn hỏi; cột trỏ trường riêng đã ngừng thì hỏi lại cột ấy; tệp khác thứ tự cột thì hỏi lại đích cột
  nhưng cách viết và mã riêng vẫn nhớ; sàn B nạp cùng tệp thì không thấy gì sàn A đã học.
- AC-10 (cross-layer): Given một lần nhập vừa thêm N căn và học K mục, When bấm Hoàn tác lần nhập (ở màn Xong hay ở «Lần
  nhập gần đây»), Then mọi lần chào chưa ai sửa của lần nhập ấy bị gỡ, K mục do chính lần nhập tạo được ngừng dùng (mục có
  từ trước giữ nguyên), căn chờ khớp do lần nhập tạo mà không còn lần chào nào được ngừng dùng; căn đã sửa sau lần nhập
  thì giữ và được liệt kê đích danh; hoàn tác lần hai trả 409; hoàn tác hỏng (mất mạng, 403) thì câu nói rõ chưa gỡ gì kèm
  «Thử lại»; quyền xoá ở cơ sở dữ liệu chỉ chạm lần chào của lần nhập chưa hoàn tác, `version = 1`.
- AC-11 (cross-layer): Given sàn chưa có căn nào, When vai có quyền nhập mở Bảng hàng, Then câu của trạng thái trống có MỘT
  liên kết «Nạp tệp» dẫn tới màn Nạp tệp (luật design-assembly: trạng thái trống chỉ có nút khi điền được ngay trên màn,
  nên ở đây là liên kết trong câu); đầu màn Bảng hàng có nút viền «Nạp tệp» cho vai có quyền và không có cho vai không quyền;
  vai không quyền không thấy liên kết; sau
  khi áp, Bảng hàng hiện đúng N căn vừa thêm, căn chờ khớp hiện mã gốc của sàn ở cột Căn và chữ toà của tệp ở cột Toà.
- AC-12: Given màn Nạp tệp, When soi theo `design/states.md` và Vai × Màn, Then mười ba trạng thái của đặc tả UX có ở bốn
  khổ (dưới 768 px là «Nạp tệp dùng trên máy tính»), sáng và tối, axe không lỗi; chỉ bàn phím đi hết năm bước (Tab qua thanh
  bước và câu hỏi, mũi tên trong nhóm chọn, Enter ở nút chính); vai không quyền thấy «không đủ quyền» và cửa API trả 403;
  màn có dòng trong `design/screens.yaml`, chứng minh màn theo quyết định 0019 và 0023, mọi chữ từ `ontology/labels.yaml`
  hay tệp chữ của mô-đun (nhãn mới tối đa 17 ký tự).

## Coverage

Quét theo khuôn entity-feature (skill morphological-scan). Chân sản phẩm: `[SUY-TỪ-REPO:
_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md]` (năm chỗ ghép, ba luật), `[SUY-TỪ-REPO:
docs/tri-thuc/wiki/chu-de/nhap-excel.md]` (thói quen và lỗi của Quỹ hàng), `[SUY-TỪ-REPO:
db/migrations/010_lop_rieng_cua_san.sql]` (đích học). Chân ngành: `[NGÀNH: Quỹ hàng màn Nhập Excel, ADR-0011]`, `[NGÀNH:
HubSpot Import — ghép cột, «Don't import column», tạo thuộc tính ngay lúc nhập]`, `[NGÀNH: Salesforce Data Import Wizard —
ghép trường, xem trước trước khi nạp]`.

- Trục A — chỗ ghép: cột | tên cột | giá trị | căn | dạng tệp. [thước CE: bảng năm chỗ ghép của đề xuất]
- Trục B — dấu ô: giữ nguyên | máy sửa | cần người | chặn. [thước CE: câu «Bật khi» của hàng, ADR-0011 Quỹ hàng]
- Trục C — vòng đời lần nhập: nạp | ghép | xem trước | áp | học | lần hai | hoàn tác. [thước CE: năm bước Quỹ hàng, luồng
  HubSpot]
- Trục D — ai, ở đâu: Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn × máy tính | điện thoại. [thước CE: bảng quyền 9a]

Core: nạp (AC-1); A × B cho cột (AC-2), tên cột (AC-3), giá trị (AC-4), căn (AC-5); «không ô nào mất» trên bộ tệp bẩn
(AC-6); áp, quyền, cách ly, ontology (AC-7); học (AC-8); lần hai (AC-9); hoàn tác (AC-10); Bảng hàng (AC-11); màn, trạng
thái, vai (AC-12). Later: cập nhật lần chào đã có từ tệp (theo Hỏi-6); thuộc tính căn của căn chờ khớp (theo Hỏi-9); đọc
qua đường dẫn Google Sheet; nhiều trang tính một lần; số chủ nhà từ tệp (hàng 13). Never: nhập thẳng không xem trước; ghi
danh mục chung từ lần nhập; AI ở MVP (H5). Ô gạch: «điện thoại × nạp tệp» — màn chỉ máy tính, AC-12 nói ra.
[GIẢ ĐỊNH] chữ cột chủ nhà nhận bằng từ điển tiêu đề («Chủ nhà», «SĐT», «Số chủ», «Điện thoại») — chủ kho gạch tại cổng.

## Vai × Màn

Nạp, áp và hoàn tác lần nhập theo thao tác mới `importListings`; tạo lần chào theo `createListing` (chuyển `live`). Theo
Hỏi-7 (khuyên): Đầu chủ và Trưởng nhóm có cả hai; Đầu khách, Quản trị sàn không.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| nhap-tep | được — nạp, ghép, áp; căn mang đầu chủ là mình; Hoàn tác lần nhập của sàn | không — «không đủ quyền» | được — như Đầu chủ, chọn đầu chủ cho cả lần nhập | không — «không đủ quyền» |
| inventory | được — nút Nạp tệp ở đầu màn và ở trạng thái trống | được — không nút Nạp tệp | được — như Đầu chủ | được — không nút Nạp tệp |

## Đường đo

Ô cơ hội khai ngưỡng sống là câu «Bật khi» của hàng. Mỗi vế một thước:

- Năm chỗ ghép, mỗi ô một trong bốn dấu, không đường nhập thẳng → AC-2, AC-3, AC-4, AC-5, AC-6.
- Trên bộ tệp thử bẩn có đáp án 100% ô có đích, không ô nào bị bỏ lặng lẽ → AC-6 (số ô đúng / tổng ô, in ra).
- Lựa chọn của người ghi vào lớp riêng khi lần nhập thành công → AC-8.
- Lần nhập thứ hai cùng dạng tệp không hỏi lại câu nào đã trả lời → AC-9 (số câu hỏi lại, in ra, phải 0).
- Hoàn tác gỡ cả ô lẫn phần vừa học → AC-10.
- Không dùng AI → AC-7 (không lời gọi mô-đun `llm` nào trên đường nhập; bài dò mã).
- Trạng thái trống của Bảng hàng dẫn tới «Nạp tệp» → AC-11.

## Out of scope

- Hàng 11b «Nhập lại cập nhật căn và số chủ nhà» (Hỏi-8, sau hàng 13): cập nhật giá, trạng thái của căn chính người
  nhập giữ (Hỏi-6), số và tên chủ nhà vào liên hệ (Hỏi-12), tin bổ sung cho căn người khác giữ (Hỏi-11).
- Thuộc tính căn (diện tích, phòng ngủ, hướng) cho căn chờ khớp (Hỏi-9 khuyên giữ chữ gốc ở lần nhập).
- Đọc qua đường dẫn Google Sheet (bắt sàn mở bảng có số chủ nhà ra ngoài); nhiều trang tính trong một lần nhập.
- Màn tạo căn tay (hàng 12 — dùng lại cửa tạo của hàng này).
- Nhập có AI (H5); bước «trùng» riêng và «tin bổ sung cho căn người khác» của Quỹ hàng.

## Notes

- Migration số tạm 015 (G-1711-6: 014 là của VP6 dãy K); số chốt theo thứ tự gộp.
- Hàng này nhận cửa tạo lần chào ở máy chủ, trước thuộc hàng 12 (G-1711-6, Hỏi-1); hàng 12 còn màn tạo tay.
- Sửa ngoài vùng khai của dãy D — xin G mở bằng yêu cầu `cham-tep` sau Cổng Phạm vi, trước khi chạm: `src/app/(app)/nhap-tep/**`,
  `src/app/api/v1/imports/**`, `src/app/(app)/inventory/page.tsx`, `src/app/(app)/nav.ts`, `src/modules/listings/` (tệp
  mới `create.ts`, dòng export ở `server.ts`, sửa đường đọc Bảng hàng sau cùng, sau khi 3g gộp), `src/modules/company-config/`
  (hàm ghi một lượt phần học), `src/modules/catalog/` (ghi mã riêng của sàn), `db/migrations/015_*.sql`, `db/tests/cach-ly.sql`,
  `db/tests/pha-thu/`, `ontology/` (thực thể ImportRun, quan hệ Lần chào → căn chờ khớp, hai thao tác, nhãn), `src/generated/**`
  (chỉ qua `make gen`), `architecture/modules.yaml`, `design/screens.yaml`, `design/so-khoi.yaml`, `_acceptance/config.yaml`
  (bốn lệnh chấm của hàng), `package.json` + `package-lock.json` (thư viện đọc `.xlsx`, Hỏi-4), `tests/**` (tệp mới).
- Tệp thử: máy dựng không có Excel hay LibreOffice, nên các tệp `.xlsx` do một thư viện ghi khác thư viện đọc tạo ra, có ô
  ngày dạng số ngày của Excel và chuỗi dùng chung; nguồn từng tệp ở `tests/fixtures/nhap-excel/NGUON.md` (gap-probe P1).
  Chủ kho thả một tệp Excel thật (đã thay tên, số bằng `[Tên]`, `0900 000 0xx`) vào thư mục ấy thì bài E1 đọc thêm.
