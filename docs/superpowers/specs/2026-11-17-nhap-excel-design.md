# Nhập Excel — lần nhập là lúc ghép chuẩn với không chuẩn (hàng 11)

Ngày 17/11/2026 · dãy D · hồ sơ `_acceptance/nhap-excel/` · hạng T3 (migration, ontology).

## Vì sao

Đây là đường chính để sàn bỏ Sheet. Lời chủ kho 12/11: «MVP sẽ cho người dùng bắt đầu bằng import file google sheet hay
excel mà họ đang làm việc quản lý bảng hàng vào […] Khi Import vào thì đây chính là thời điểm mapping giữa sự chuẩn hoá
của onehub-inventory và sự không chuẩn của người dùng.» Hàng 7d dựng lõi chuẩn và mã riêng của sàn, hàng 7e dựng lớp riêng
của sàn (nhãn riêng, trường riêng, từ điển giá trị, căn chờ khớp, mẫu nhập) cùng cửa đọc ghi từng mục, hàng 10 đưa Bảng
hàng lên dữ liệu thật. Hàng này nối ba thứ ấy thành một luồng: nạp tệp, ghép, xem trước, áp, và học.

Ba luật của đề xuất `_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md`:

1. **Không mất ô nào.** Mỗi ô có một đích: trường chuẩn, trường riêng, hoặc giữ chữ gốc ở lần nhập kèm dấu «cần người».
2. **Máy đề xuất, người chốt.** Mỗi ô mang một trong bốn dấu: giữ nguyên · máy sửa (kèm lý do) · cần người · chặn. Không
   có đường nhập thẳng.
3. **Ghép một lần, dùng mãi.** Lựa chọn của người ở màn xem trước ghi vào lớp riêng của sàn khi lần nhập thành công.

## Luồng

Màn mới «Nạp tệp» (`/nhap-tep`, vai có quyền nhập, chỉ máy tính), năm bước theo khuôn Luồng nhiều bước mà Quỹ hàng đã chọn
(`solution-crm-6`, Hỏi-3):

1. **Chọn tệp.** Kéo thả hay chọn tệp `.xlsx` hoặc `.csv` (Google Sheet: Tệp → Tải xuống). Tệp đọc ngay trên trình duyệt;
   tệp không lên máy chủ, chỉ bảng chữ (tiêu đề + ô) được gửi. Trần 10 MB, 5.000 dòng. `.xlsx` nhiều trang tính
   thì đọc trang đầu có dữ liệu và nói tên các trang không đọc. Dòng tiêu đề là dòng đầu không rỗng.
2. **Ghép cột.** Mỗi cột một dòng: tên cột của tệp · đích · dấu · lý do. Máy đi theo thứ tự: mẫu nhập của sàn (cùng dạng
   tệp) → nhãn riêng của sàn → nhãn chuẩn của sản phẩm → từ điển tiêu đề chuẩn (cách viết hay gặp: «Mã căn», «Giá KBP»,
   «DT», «PN»…). Không ra thì «cần người»: người chọn trường chuẩn, trường riêng đang dùng, tạo trường riêng mới (tên =
   tên cột, người chọn kiểu; «chọn một» lấy sẵn các giá trị khác nhau trong cột, tối đa 30) hay «bỏ cột» có chủ ý. Cột
   trỏ đích của người khác chọn thì máy hỏi «Gọi cột này là “Block” trên Bảng hàng?» (mặc định có) — đó là nhãn riêng.
3. **Giá trị và căn.** Câu hỏi gom theo giá trị, không theo ô: «“ĐN” ở cột Hướng (37 ô) là gì?». Người chọn một giá trị
   chuẩn (máy nhớ vào từ điển của sàn, mặc định có) hay để giữ chữ gốc. Mã căn gom theo mã: một căn → giữ nguyên hay máy
   sửa («đọc “SA5-12.08” là Sapphire 5 · tầng 12 · căn 08»); nhiều căn → người chọn một (máy nhớ thành mã riêng của sàn);
   không có trong danh mục → mặc định thành căn chờ khớp của sàn, giữ nguyên mã.
4. **Xem trước.** Lưới các dòng của tệp, mỗi ô một dấu; đầu lưới đếm bốn dấu và số căn sẽ thêm, con số do máy chủ trả.
   Còn ô «chặn» thì nút Áp tắt và nói còn bao nhiêu chỗ phải gỡ. Ô «cần người» chưa trả lời thì giữ chữ gốc ở lần nhập;
   nút nói rõ «Áp 214 căn · 6 ô giữ chữ gốc».
5. **Xong.** Đã thêm bao nhiêu căn, sàn vừa học những gì (nhãn, trường, cách viết, mã riêng, căn chờ khớp, mẫu nhập), ô nào
   giữ chữ gốc; nút «Mở Bảng hàng» và «Hoàn tác lần nhập». Đầu màn «Nạp tệp» có «Lần nhập gần đây» (10 lần mới nhất của
   sàn) với Hoàn tác.

Lần sau cùng dạng tệp: mẫu nhập trả đích cho mọi cột, từ điển trả giá trị đã chọn, mã riêng trả căn đã chọn — bước 2 và 3
không còn câu nào đã trả lời, người đi thẳng tới xem trước. Giá trị mới chưa gặp vẫn hỏi; cột trỏ trường riêng đã ngừng
thì hỏi lại cột ấy (hàng 7e AC-6).

## Các chỗ ghép và dấu

| Chỗ ghép | Giữ nguyên                      | Máy sửa (kèm lý do)                                                | Cần người                                                                                                         | Chặn                                                                                                                          |
| -------- | ------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Cột      | đích từ mẫu nhập hay trùng nhãn | đích từ từ điển tiêu đề («Giá KBP» → Giá chào, phí: không bao)     | tên cột lạ                                                                                                        | hai cột cùng một đích; thiếu cột mã căn; cột chủ nhà, số điện thoại (ghi ở hồ sơ căn, hàng 13) cho tới khi người bấm «bỏ cột» |
| Tên cột  | nhãn trùng nhãn chuẩn           | —                                                                  | tên khác nhãn chuẩn → lưu thành nhãn riêng?                                                                       | —                                                                                                                             |
| Giá trị  | đúng giá trị chuẩn              | gấp chữ, theo từ điển của sàn, đọc giá «4,65 tỷ» → 4.650.000.000 đ | chữ lạ ở cột tập đóng; giá không đọc được; số, ngày, có/không sai kiểu; Đã bán thiếu giá bán hay ngày             | —                                                                                                                             |
| Căn      | mã gốc ra một căn               | mã riêng, bộ đọc 8 dạng                                            | ra nhiều căn; không có trong danh mục (mặc định thành căn chờ khớp); căn đã có lần chào mở trên Bảng hàng (Hỏi-6) | cùng một căn hai lần trong tệp (dòng sau); ô mã căn trống                                                                     |
| Dạng tệp | mẫu nhập có sẵn                 | —                                                                  | —                                                                                                                 | —                                                                                                                             |

Ô trống là «giữ nguyên» với đích là ô trống của trường. Mỗi ô có đúng một dấu và một đích; luật dấu là một hàm thuần ở
`src/modules/imports/` (`markCell`), máy chủ và giao diện cùng gọi, không viết hai lần.

## Dữ liệu (migration mới, số tạm 015 — G-1711-6)

- Bảng `import_runs` (Lần nhập, mô-đun `imports`): `company_id`, người nhập, đầu chủ của các căn, tên tệp, tên trang tính,
  dạng tệp, số dòng, số căn đã thêm, danh sách phần vừa học (mã từng mục), các ô giữ chữ gốc (dòng, cột, chữ, lý do),
  lúc nhập, lúc hoàn tác. Luật theo dòng ép buộc, vai ứng dụng chỉ select/insert/update, không xoá.
- `listings`: thêm `import_run_id` (trỏ lần nhập đã tạo nó). Vai ứng dụng được INSERT, luật thu hẹp đòi `createListing`,
  `WITH CHECK` theo sàn. DELETE chỉ cho căn của một lần nhập chưa hoàn tác, `version = 1` (chưa ai sửa), đòi quyền hoàn
  tác lần nhập (G-1711-6 (2)).
- `listing_units`: trỏ được căn danh mục (`upi`) hoặc căn chờ khớp của sàn — đúng một trong hai; mỗi căn chờ khớp một lần
  chào mở. Đổi mô hình miền: Lần chào trỏ căn chờ khớp (Hỏi-2, theo `/ontology-add`).
- Không cột mới ở danh mục chung; danh mục chung không đổi dòng nào khi nhập.

## Cửa ghi (`/api/v1`)

- `POST /api/v1/imports/preview` — nhận bảng chữ và các lựa chọn của người, trả dấu từng ô, câu hỏi gom và con số. Không
  ghi gì.
- `POST /api/v1/imports` — áp trong MỘT giao dịch: tính lại dấu ở máy chủ (con số khác số người đã thấy thì 409 «tệp hay
  lớp riêng vừa đổi, xem lại»), còn ô chặn thì 400, tạo lần nhập, tạo căn chờ khớp mới, tạo lần chào, ghi phần học vào lớp
  riêng (qua hàm của mô-đun `company-config` và `catalog`), rồi trả mã lần nhập và con số. Hỏng giữa chừng thì không gì
  được ghi, không học gì.
- `POST /api/v1/imports/[id]/undo` — gỡ lần chào của lần nhập chưa ai sửa, ngừng dùng các mục lớp riêng do chính lần
  nhập tạo (mục có từ trước giữ nguyên), căn chờ khớp do lần nhập tạo mà không còn lần chào nào thì ngừng dùng; căn đã sửa
  sau lần nhập thì giữ và liệt kê. Hoàn tác lần hai trả 409.
- Quyền: thao tác mới `importListings` (nạp, áp, hoàn tác lần nhập), `createListing` chuyển `live`. Theo Hỏi-7: Đầu chủ
  (căn mang đầu chủ là mình), Trưởng nhóm (chọn đầu chủ cho cả lần nhập); Đầu khách, Quản trị sàn không.
- Hàm tạo lần chào ở cửa server của mô-đun `listings` (tệp mới `create.ts`); mô-đun `imports` không chạm bảng của mô-đun
  khác. `architecture/modules.yaml`: `imports` sở hữu ImportRun, phụ thuộc identity, catalog, company-config, listings.

## Bảng hàng

Trạng thái trống «Sàn chưa có căn» thêm một liên kết «Nạp tệp» trong câu (vai có quyền nhập; luật design-assembly: trạng thái trống chỉ có nút khi điền được ngay trên màn); đầu màn Bảng hàng có nút viền «Nạp tệp» theo
vai. Căn chờ khớp hiện trên Bảng hàng: cột Căn là mã gốc của sàn, Toà là chữ toà trong tệp, các cột thuộc tính căn trống —
phần sửa đường đọc Bảng hàng làm SAU CÙNG, sau khi 3g gộp (G-1711-6 (3)).

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng trống «Sàn chưa có căn» → Nạp tệp → chọn tệp → ghép cột → giá trị và căn → xem trước → Áp → Xong
  (điểm ra: Bảng hàng có các căn vừa thêm).
- Biên: tệp cùng dạng lần trước (đi thẳng tới xem trước, 0 câu hỏi); tệp có cột chủ nhà; tệp toàn căn chưa có trong danh
  mục; vai không có quyền nhập; dưới 768 px.
- Lỗi & quay lại: tệp hỏng/sai đuôi/quá cỡ ở bước 1 → câu ba phần + «Chọn tệp khác»; mất mạng khi xem trước hay khi áp →
  băng «chưa ghi gì» + «Thử lại», giữ mọi lựa chọn; 409 khi áp → «lớp riêng vừa đổi, xem lại» và mở lại bước xem trước;
  «Quay lại» ở mọi bước giữ lựa chọn đã làm.

### 2. Kiểm kê màn

| Màn                     | MỘT việc của màn                                                     | Vào từ / ra tới                                       |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| Nạp tệp (`nhap-tep`)    | Đưa căn từ một tệp bảng tính vào Bảng hàng qua năm bước có xem trước | Bảng hàng (nút Nạp tệp, trạng thái trống) / Bảng hàng |
| Bảng hàng (`inventory`) | (sẵn có) thêm nút Nạp tệp và hiện căn chờ khớp                       | —                                                     |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái               | Màn       | Hiển thị gì                                                    | Người làm gì tiếp       |
| ------------------------ | --------- | -------------------------------------------------------------- | ----------------------- |
| ST-nhap-tep-mac-dinh     | Nạp tệp   | Bước 1, vùng thả tệp, «Lần nhập gần đây»                       | chọn tệp                |
| ST-nhap-tep-dang-doc     | Nạp tệp   | từ 1 giây: khung chờ đúng bố cục bước kế                       | chờ                     |
| ST-nhap-tep-tep-loi      | Nạp tệp   | câu ba phần nói đúng lỗi (đuôi, cỡ, hỏng, mật khẩu, quá dòng)  | chọn tệp khác           |
| ST-nhap-tep-tep-rong     | Nạp tệp   | «Tệp không có dòng nào dưới dòng tiêu đề»                      | chọn tệp khác           |
| ST-nhap-tep-cho-nguoi    | Nạp tệp   | bước 2–3 còn N câu, số câu ở thanh bước                        | trả lời từng câu        |
| ST-nhap-tep-con-chan     | Nạp tệp   | xem trước, nút Áp tắt, «Còn N chỗ chặn» dẫn tới chỗ đầu        | gỡ chỗ chặn             |
| ST-nhap-tep-mat-mang     | Nạp tệp   | băng «Chưa ghi gì — mất kết nối mạng.» + Thử lại, giữ lựa chọn | Thử lại                 |
| ST-nhap-tep-xung-dot     | Nạp tệp   | «Lớp riêng của sàn vừa đổi — xem lại trước khi áp.»            | xem lại                 |
| ST-nhap-tep-khong-quyen  | Nạp tệp   | «Vai của anh chưa nạp tệp được.», không vùng tệp               | về Bảng hàng            |
| ST-nhap-tep-dien-thoai   | Nạp tệp   | dưới 768 px: «Nạp tệp dùng trên máy tính.»                     | về Bảng hàng            |
| ST-nhap-tep-xong         | Nạp tệp   | con số đã thêm, phần vừa học, ô giữ chữ gốc, Hoàn tác          | Mở Bảng hàng / Hoàn tác |
| ST-nhap-tep-hoan-tac-loi | Nạp tệp   | câu nói căn nào chưa gỡ và vì sao + Thử lại                    | Thử lại                 |
| ST-inventory-trong-nap   | Bảng hàng | «Sàn chưa có căn nào đang chào» + liên kết Nạp tệp trong câu   | Nạp tệp                 |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Tệp: `.xlsx`, `.csv` (UTF-8 có hay không BOM, phân cách phẩy hay chấm phẩy); 10 MB, 5.000 dòng.
- Bàn phím: thanh bước đi bằng Tab; mỗi câu hỏi là một nhóm chọn đi bằng mũi tên; «Tiếp» là nút chính của bước; Esc không
  đóng màn (màn là trang, không phải hộp thoại).
- Lưới xem trước dùng `DataRegion` của họ Lưới (cột giữ luật căn lề, định dạng của `design/behaviors.md`).
- Chữ: mọi chữ từ `ontology/labels.yaml` hay tệp chữ của mô-đun; nhãn mới tối đa 17 ký tự.

### 5. Xuất xứ component

| Component                                      | Nấc (dùng / ghép / mở rộng / tạo)                 | Vì sao (1 dòng)                                               |
| ---------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| Khung năm bước (thanh bước + thân + chân bước) | ghép từ ReUI `solution-crm-6` (Hỏi-3)             | kho chưa có khuôn Luồng nhiều bước; Quỹ hàng đã chọn khối này |
| Vùng thả tệp                                   | ghép từ vùng tải của `solution-crm-6`             | kho chưa có ô chọn tệp                                        |
| Lưới xem trước                                 | dùng `DataRegion`                                 | một nhu cầu một chủ: lưới của kho                             |
| Câu hỏi gom (nhóm chọn)                        | dùng `RadioGroup`, `Select` của shadcn            | thành phần nhà cung cấp                                       |
| Trạng thái lỗi, trống, không quyền             | dùng `RegionError`, `RegionEmpty`, `RegionDenied` | trạng thái của kho                                            |
| Thông báo xong, hoàn tác                       | dùng thông báo của `use-change`                   | luật hoàn tác của hàng 4                                      |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: wizard
Căn cứ: (ii) chọn từ danh sách — việc là một chuỗi bước có thứ tự, bước sau cần kết quả bước trước (đích cột quyết câu hỏi
giá trị), và Quỹ hàng đã chạy khuôn này năm bước (`qh:design/patterns/nhap-excel.md`, khối `solution-crm-6`). Đã tra danh
mục ReUI ngoại tuyến: `solution-crm-6` (năm bước nhập CSV có ghép cột), `onboarding-2` (bước dọc ở cột trái), `wizard-1`
(ba bước ngang) — ảnh ở Cổng Phạm vi.

### 7. Thẻ việc

| Trường     | Giá trị                                                                                 |
| ---------- | --------------------------------------------------------------------------------------- |
| Ai dùng    | Đầu chủ; Trưởng nhóm nhập hộ                                                            |
| Việc chính | Đưa bảng hàng đang giữ ở Excel hay Sheet vào sản phẩm, đúng chuẩn mà không phải sửa tệp |
| Tần suất   | hiếm (ngày đầu, rồi mỗi khi có bảng hàng mới)                                           |
| Số bản ghi | hàng trăm trở lên                                                                       |
| Thiết bị   | máy tính                                                                                |

<!-- UX-SPEC-TEMPLATE>>> -->

## Từ Quỹ hàng

- Giữ: năm bước, đọc tệp trên trình duyệt, con số từ máy chủ, hoàn tác cả lần nhập, căn đã sửa sau lần nhập thì không gỡ,
  dòng nhập không tính là vừa xác nhận với chủ nhà, bộ ghép tất định + bộ nhớ của sàn (`qh:docs/adr/0011`).
- Bỏ: AI (H5). Bước «trùng» riêng và «tin bổ sung cho căn người khác»: theo Hỏi-11 (máy khuyên gộp vào dấu của ô căn, tin bổ sung để hàng sau).
- Sửa lỗi Quỹ hàng đã gặp: hai cột cùng một đích thì cột thứ hai không được soát → ở đây là «chặn» (AC-2); bài kiểm xanh
  trên cả mã cũ lẫn mới → mọi phép đo mới có cặp phá thử ghim thông điệp.

## Ngoài phạm vi

- Cập nhật lần chào đã có từ tệp (Hỏi-6), đọc qua đường dẫn Google Sheet, nhập có AI (H5), số chủ nhà từ tệp (hàng 13),
  thuộc tính căn của căn chờ khớp (Hỏi-9), màn tạo căn tay (hàng 12), nhiều trang tính trong một lần nhập.

## Cách kiểm

Bộ tệp thử bẩn có đáp án ở `tests/fixtures/nhap-excel/` (ba tệp: `.xlsx` gọn, `.xlsx` bẩn — viết tắt, dấu lộn, giá chữ,
mã căn tám dạng, cột trùng đích, cột chủ nhà, căn trùng —, `.csv` do Google Sheet «Tải xuống» ghi — phẩy, UTF-8 —, thêm một `.csv` chấm phẩy có BOM như Excel bản Việt lưu) + `dap-an.json` ghi
dấu và đích từng ô. Dữ liệu thử dùng `[Tên]` và `0900 000 0xx`.
