# Thiết kế — Lớp riêng của sàn (hàng 7e)

Hồ sơ `_acceptance/lop-rieng-cua-san/`, hạng T3, dãy R, đợt «dieu-phoi-nen». Ô cơ hội đã quyết «build» (Manh Phan,
2026-11-12). Đề xuất gốc: `_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md`.

## Kết luận

Lõi giữ chuẩn (RESO khi có). Phần khác nhau của từng sàn là **dữ liệu** ở năm bảng của sàn, mô-đun `company-config`:

| Phần            | Sàn ghi gì                                                                                                      | Bảng (migration 010)       |
| --------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Nhãn riêng      | Chữ sàn gọi một khái niệm chuẩn («Toà» → «Block», «Giá chào» → «Giá KBP»)                                       | `company_labels`           |
| Trường riêng    | Cột sàn có mà chuẩn không có; năm kiểu: chữ, số, ngày, chọn một, có/không; trần 20 trường còn dùng, 30 lựa chọn | `company_fields`           |
| Từ điển giá trị | Chữ sàn quen viết → giá trị chuẩn của một trường («ĐN» → Đông Nam, «còn» → Đang bán)                            | `company_value_aliases`    |
| Căn chờ khớp    | Căn sàn có mà danh mục chung chưa có, giữ nguyên mã sàn gõ; khớp vào danh mục khi danh mục có căn ấy            | `company_pending_units`    |
| Mẫu nhập        | Dạng tệp (thứ tự và tên cột) và cột nào đi vào trường nào                                                       | `company_import_templates` |

Bảng hàng đọc nhãn riêng thay nhãn chuẩn và hiện trường riêng sau tám cột chuẩn. Một màn xem lại tối giản liệt kê năm
phần. Màn nhập (hàng 11) là chỗ ghi chính; hàng 7e làm chỗ lưu, đọc, luật, cửa ghi `/api/v1` và bảng xem lại.

Rào ADR-0018 của Quỹ hàng giữ nguyên: không đối tượng tự tạo (chỉ trường trên lần chào), không công thức (trường không
tính từ trường khác), không bộ máy luật hay quy trình (từ điển là bảng tra một-một, không điều kiện). Kiểu trường là tập
đóng năm kiểu.

## Vì sao như vậy

- Chủ kho 2026-11-12: «không cứng mà cho người dùng thêm trường riêng, nhãn riêng» và «Khi Import vào thì đây chính là
  thời điểm mapping». Lớp riêng là nơi lần nhập ghi vào.
- Quỹ hàng (`onehub-quy-hang`, migration 039, 043, 045, 051, 052; ADR-0018 quyết định 8): trường riêng là bảng định
  nghĩa cộng giá trị dạng jsonb trên lần chào, không EAV; từ điển một-một theo trường; căn ngoài khu là bảng của sàn.
  **Giữ** khuôn. **Bỏ** luồng đề xuất–duyệt của từ điển (Quỹ hàng: Đầu chủ đề xuất, Quản trị duyệt) vì MVP chưa có màn
  duyệt và hàng 11 là nơi người chốt từng giá trị. **Mở rộng** kiểu trường từ hai (có/không, chọn một) lên năm theo câu
  «Bật khi» của hàng. **Mở rộng** căn ngoài khu thành căn chờ khớp cho mọi căn chưa có trong danh mục.

## Ranh giới với hàng khác

- **Không mở đường ghi vào danh mục chung.** Căn chờ khớp là dòng của sàn; «khớp» chỉ ghi khoá căn của danh mục vào dòng
  của sàn (khoá ngoại tới `catalog_units`), danh mục chung không đổi dòng nào. Ba kẽ hở cơ sở dữ liệu của danh mục (căn
  thiếu phân khu; khoá ngoại ghép không chặn; mã gốc trỏ đối tượng không có thật) **để lại cho hàng 12 «Thêm căn»** —
  hàng đầu tiên ghi vào danh mục — hoặc hàng 11 nếu nhập được ghi danh mục.
- **Giá trị của trường riêng trên lần chào để lại cho hàng 10.** Hôm nay chưa có bảng lần chào (Bảng hàng chạy trên dữ
  liệu mẫu). Hàng 7e khai thuộc tính `customFields` của lần chào trong ontology, hàm kiểm một giá trị theo kiểu trường, và
  Bảng hàng đọc giá trị từ lần chào; dữ liệu mẫu mang vài giá trị mẫu. Hàng 10 thêm cột `custom_fields jsonb` vào bảng
  lần chào thật và gọi đúng hàm kiểm ấy khi ghi.
- **Hàng 11 «Nhập»** dùng: tra căn bốn nguồn (mã riêng → mã gốc → bộ đọc 8 dạng → căn chờ khớp), tạo căn chờ khớp, ghi
  nhãn riêng, trường riêng, từ điển và mẫu nhập qua cửa `/api/v1` của 7e trong cùng lần áp; tìm mẫu nhập theo dạng tệp;
  hoàn tác gỡ phần vừa học bằng «ngừng dùng» của 7e. Thước «không ô nào mất» và bốn dấu mỗi ô là của hàng 11.
- **Hàng 10 «Bảng hàng dữ liệu thật»**: lưu giá trị trường riêng, gán lần chào vào căn chờ khớp.
- **H4** (màn Cài đặt sàn đầy đủ) để sau. **Trạng thái riêng** của L4: Hỏi-6 (máy khuyên hàng sau). H5 chỉ còn AI.
- Trang khách (SP-4) không đọc nhãn riêng hay trường riêng: chúng là chữ nội bộ của sàn.

## Lõi

- Nhãn riêng: một nhãn còn dùng cho mỗi (sàn, khái niệm); khái niệm phải có trong `ontology/labels.yaml` với `kind` là
  `field` hay `entity`; chữ 1–40 ký tự sau khi cắt khoảng trắng. `label(concept, { overrides })` đã nhận nhãn riêng — màn
  truyền nhãn của sàn vào.
- Trường riêng: mã `^[a-z][a-z0-9_]{0,31}$` cấp một lần, không đổi, không dùng lại sau khi ngừng; tên 1–40; kiểu ∈ {chữ,
  số, ngày, chọn một, có/không}; lựa chọn chỉ có ở «chọn một», 1–30, không trùng sau khi gấp chữ; vị trí sắp cột; ngừng
  dùng bằng `retired_at`. Trần 20 trường còn dùng (trường đã ngừng không tính), giữ ở cơ sở dữ liệu (trigger đếm) và ở
  cửa API. Tên trường không trùng, sau khi gấp chữ, với trường riêng còn dùng, nhãn riêng hay nhãn chuẩn của cột Bảng
  hàng — hai cột cùng tên làm màn nhập ghép nhầm. Ngừng một trường thì từ điển của trường ấy thôi tra ra; mẫu nhập có cột
  trỏ trường ấy vẫn ra nhưng cột mang dấu «đích đã ngừng» để màn nhập hỏi lại.
- Giá trị trường riêng (hàm thuần ở `company-config/index.ts`): chữ ≤ 500 ký tự; số hữu hạn; ngày `YYYY-MM-DD` có thật;
  chọn một phải là một lựa chọn còn trong danh sách; có/không là boolean; trường đã ngừng không nhận giá trị mới.
- Từ điển: (sàn, trường, chữ gấp) → một giá trị; trường là trường chuẩn có tập giá trị đóng (enum trong ontology) hoặc
  trường riêng «chọn một» còn dùng; giá trị phải thuộc tập ấy. Gấp chữ: bỏ dấu, chữ thường, gộp khoảng trắng.
- Căn chờ khớp: mã sàn gõ nguyên văn (1–80), tên toà và số căn nếu sàn tách được; `unit_key` rỗng tới khi khớp. Tra mã
  trong sàn đi bốn nguồn theo thứ tự; căn chờ khớp đã khớp thì tra ra căn của danh mục. «Khớp» chạy tra ba nguồn của 7d
  trên mã gốc của căn chờ: ra đúng một căn thì ghi `unit_key` và lúc khớp; không ra hay ra nhiều thì giữ chờ. Chạy khi
  người bấm «Khớp với danh mục» ở bảng xem lại (Hỏi-4) và khi hàng 11 áp một lần nhập.
- Mẫu nhập: tên 1–60, chữ ký dạng tệp = danh sách tên cột đã gấp theo thứ tự; mỗi cột đi tới đúng một đích: trường chuẩn
  (khoá của `FIELD_DISPLAY`), trường riêng còn dùng, hoặc «bỏ cột» có chủ ý. Mỗi (sàn, chữ ký) một mẫu còn dùng.

## Bộ nút của màn (chủ kho chọn 2026-11-13)

Chủ kho: «Tôi thấy thiếu bộ nút crud như các kiến trúc chung?» — màn Tuỳ chỉnh của sàn có đủ bộ nút theo khuôn 9e. Bảng
nút từng phần và năm thao tác nháp: `_acceptance/lop-rieng-cua-san/thao-tac-nhap.yaml` (vào `ontology/actions.yaml` trong
PR của hàng này). Không có «Xoá»: «Ngừng dùng» giữ lịch sử. Trường riêng sửa được tên và lựa chọn, không đổi kiểu. Căn
chờ khớp không thêm tay (Hỏi-7, máy khuyên để hàng 12). Mẫu nhập chỉ đổi tên và ngừng dùng; tạo mới qua màn nhập.

## Cửa và quyền

- Ghi đi qua `/api/v1/company-layer/*` bằng cửa thao tác dùng chung của mô-đun danh tính (quyết định 0026) và `withCompany`.
  Không xoá: ngừng dùng. Vai API không có quyền `delete`.
- Năm thao tác mới trong `ontology/actions.yaml` (nháp ở `thao-tac-nhap.yaml`): `readCompanyLayer` (bốn vai), `addCompanyLayer`,
  `editCompanyLayer`, `retireCompanyLayer`, `matchPendingUnits` (theo Hỏi-1). Bảng quyền migration 010 chép từ đó; luật thu hẹp theo quyền như `company_catalog_aliases`.
- `architecture/modules.yaml`: `company-config` sở hữu năm thực thể mới, dựa vào `identity` (cửa) và `catalog` (tra căn
  khi khớp). Trang quyết định 0029 (xin giám sát số).

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng → tiêu đề cột là nhãn riêng của sàn, trường riêng hiện sau tám cột chuẩn → lọc, sắp, ẩn cột như cột
  chuẩn (điểm ra: hồ sơ căn như cũ).
- Suôn sẻ: thanh bên «Tuỳ chỉnh của sàn» → năm phần ở cột thứ hai (Hỏi-3) → xem danh sách của phần → «…» cuối dòng: đổi
  chữ, ngừng dùng; phần Căn chờ khớp có «Khớp với danh mục» ở đầu vùng.
- Biên: sàn chưa có gì riêng → mỗi phần trạng thái rỗng nói lý do và chỉ màn nhập (hàng 11); vai chỉ đọc → không có nút.
- Lỗi & quay lại: máy chủ từ chối (403) → «Không đủ quyền làm việc này», trang làm mới; trùng tên, quá 40 ký tự → lỗi ngay
  dưới ô của hộp đổi chữ, giữ chữ đã gõ.

### 2. Kiểm kê màn

| Màn                     | MỘT việc của màn                          | Vào từ / ra tới               |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Bảng hàng (đổi)         | Đọc hàng của sàn bằng chữ của sàn         | thanh bên / hồ sơ căn         |
| Tuỳ chỉnh của sàn (mới) | Xem lại và chỉnh nhẹ những gì sàn đã khai | thanh bên / không đi đâu khác |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái                | Màn               | Hiển thị gì                                                          | Người làm gì tiếp         |
| ------------------------- | ----------------- | -------------------------------------------------------------------- | ------------------------- |
| ST-tuy-chinh-loading      | Tuỳ chỉnh của sàn | khung xương của vùng Lưới                                            | chờ                       |
| ST-tuy-chinh-empty        | Tuỳ chỉnh của sàn | «Sàn chưa có trường riêng. Trường riêng sinh ra khi nhập bảng hàng.» | mở Bảng hàng              |
| ST-tuy-chinh-ready        | Tuỳ chỉnh của sàn | danh sách của phần, «…» theo quyền                                   | đổi chữ, ngừng dùng, khớp |
| ST-tuy-chinh-error        | Tuỳ chỉnh của sàn | câu lỗi chung của vùng, nút Thử lại                                  | thử lại                   |
| ST-tuy-chinh-forbidden    | Tuỳ chỉnh của sàn | câu không đủ quyền của vùng                                          | về Bảng hàng              |
| ST-tuy-chinh-khop-xong    | Tuỳ chỉnh của sàn | thông báo «Đã khớp N căn, còn M căn chờ»                             | xem danh sách             |
| ST-bang-hang-truong-rieng | Bảng hàng         | cột trường riêng sau cột chuẩn, ô trống khi lần chào chưa có giá trị | lọc, sắp, ẩn              |
| ST-bang-hang-nhan-rieng   | Bảng hàng         | tiêu đề cột là nhãn riêng                                            | như cũ                    |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Cột trường riêng theo kiểu: chữ → `text`, số → `count`, ngày → `date`, chọn một → `select`, có/không → `boolean`; căn lề,
  rộng, lọc theo luật cột của `design/behaviors.md`, không quyết riêng.
- Đổi chữ: hộp biểu mẫu dùng chung (`FormDialog`), 1–40 ký tự, Enter lưu, Esc huỷ.
- Ngừng dùng: hộp xác nhận ngắn của hàng 9e; cột trường riêng biến khỏi Bảng hàng, giá trị cũ giữ ở lần chào.
- Bốn khổ 360, 414, 1024, 1440; điện thoại dùng ngăn trượt của App Shell cho cột thứ hai.

### 5. Xuất xứ component

| Component                   | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng)                                                     |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| DataRegion                  | mở rộng                           | nhận cột có kiểu khai sẵn cho trường riêng, không thêm lưới thứ hai |
| App Shell, cột thứ hai      | dùng                              | năm phần là năm mục như góc nhìn của 2c                             |
| RowActions, PermittedAction | dùng                              | khuôn nút theo quyền của 9e                                         |
| FormDialog                  | dùng                              | hộp đổi chữ                                                         |
| PageHeader                  | dùng                              | đầu màn                                                             |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: (ii) không tra mẫu thị trường (Mobbin không cần): năm phần là năm danh sách cùng dạng; App Shell đã có cột thứ hai
cho mục con (hàng 2c), nên cột thứ hai là danh sách phần và vùng phải là chi tiết. Hỏi-3 (đặt lại sau rà soát cổng
2026-11-13) hỏi đúng câu ấy: năm bảng riêng (A, danh-sách-chi-tiết) hay một trang danh sách gọn thấy hết (B, một-cột-cuộn,
dựng theo hình khối ReUI settings-4). Lối thẻ tab (settings-11) bị loại vì phần lớn khung hình giống A. Trang cổng:
`_acceptance/lop-rieng-cua-san/cong-pham-vi.html`.

### 7. Thẻ việc

| Trường     | Giá trị                                            |
| ---------- | -------------------------------------------------- |
| Ai dùng    | Quản trị sàn, Đầu chủ                              |
| Việc chính | Xem lại sàn đã khai gì riêng, sửa chữ, bỏ cái thừa |
| Tần suất   | hiếm                                               |
| Số bản ghi | vài chục                                           |
| Thiết bị   | máy tính                                           |

<!-- UX-SPEC-TEMPLATE>>> -->

## Từ Quỹ hàng (màn)

Trang tri thức `docs/tri-thuc/wiki/chu-de/cai-dat-san.md`: Quỹ hàng làm màn Cài đặt sàn bố cục Đọc với khối `settings-3`,
chỉ Quản trị sàn mở. Hàng 7e không làm màn Cài đặt (H4): bảng xem lại là danh sách, không phải biểu mẫu cài đặt, nên
`settings-3` không hợp; giữ ý «chỉ trên máy tính là chính», vẫn chạy được ở điện thoại.
