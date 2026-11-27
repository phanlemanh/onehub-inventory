# Kế hoạch — tin-rao-giu-gia-tri-rieng (hàng 3h, sau Cổng Phạm vi)

> **Cho tác tử thi công:** dùng superpowers:executing-plans (một phiên làm tuần tự từng việc). Mỗi việc đi theo nhịp: bài
> đỏ → mã → bài xanh → commit.

**Mục tiêu:** tin rao của sàn giữ giá trị riêng cho Diện tích, Tầng, Phòng ngủ, Hướng, Loại hình. Danh mục chỉ điền chỗ
sàn chưa có, ô khác danh mục có dấu chấm, và lệnh «lấy lại theo danh mục» đưa ô về giá trị danh mục.

**Kiến trúc:** năm cột giá trị và năm cột nguồn nằm trên bảng `listings`, thêm bằng một migration mới. Mọi chỗ đọc đi qua
một hàm thuần `effectiveAttributes` (đã có ở `src/modules/listings/unit-attributes.ts`). Mọi chỗ ghi đi qua một cửa:
`PATCH /api/v1/listings/[id]` với thay đổi `unitAttributes`. Bản bấm được ở chế độ mẫu đã có sẵn mô hình, luật đọc, dấu,
hộp sửa và dòng khoá. Kế hoạch này nối chúng vào dữ liệu thật.

**Nguồn:** `_acceptance/tin-rao-giu-gia-tri-rieng/contract.md` (approved 27/11), `design.md`, `evals.yaml`.

## Phụ thuộc — phải có trước khi dựng

| Điều kiện                                   | Vì sao                                                                                                      | Ai lo |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----- |
| Hàng 11 (nhập Excel, dãy D) vào main        | migration của 3h chốt số sau 015/016 của 11; nhập tệp ghi giá trị nguồn «tệp» trên đường ghi của 11         | dãy D |
| VP10 `khung-luoi-va-ngan-chi-tiet` vào main | ngăn chi tiết nổi, đầu ngăn một dòng; ảnh bằng chứng của 3h chụp trên khung này                             | dãy H |
| VP11 `chuan-hoa-he-design` vào main         | cách bấm và sửa ô mới (Enter là sửa, bấm ra ngoài là lưu); hai ô sửa được của 3h dựng một lần trên cách này | dãy H |

Thứ tự của giám sát (G-2711-17), ba nhịp:

1. Việc 1–3 (cột cơ sở dữ liệu, cửa ghi, gắn sang căn khác) dựng ngay sau khi kế hoạch được duyệt, không chờ ai.
   Migration của 3h lấy số sau số lớn nhất của nhánh hàng 11 (`origin/claude/agitated-dewdney-3cdf78`, nay là 019)
   và của main, tức `020`, vì 11 gộp trước (G-2711-33, G-2811-20). Đổi ontology Listing đúng phạm vi đã duyệt, chạy `make gen`, không nới ô
   `agent:` nào.
2. Việc 6–7 (nhập tệp, căn chờ khớp) dựng chồng lên nhánh hàng 11 trước khi 11 vào main (G-2811-3); khi 11 vào main thì
   gộp main vào nhánh.
3. Việc 4, 5, 5b, 8 (lưới, ngăn, thân hồ sơ, hồ sơ đã ký) chờ VP10 và VP11 vào main. Trong lúc chờ, không sửa năm tệp khung dùng chung.

Một hồ sơ, một PR: không mở PR riêng cho phần nền. Lượt chấm S4 chỉ xin khi cả tám việc xong, trên main đã có 11, VP10
và VP11.

Mỗi lần bắt đầu dựng: gộp `origin/main` vào nhánh, chạy `make check`, rồi chạy đường nền lại (`duong-nen` của đợt).

## Ràng buộc chung

- Ghi chỉ qua `/api/v1`. Mọi truy vấn qua `withCompany`. Không chạm `catalog_units` (SP-1, AC-6).
- Chữ người dùng thấy đọc từ `ontology/labels.yaml`. Màn dùng chữ «danh mục» (Hỏi-4), không dùng «Danh bạ».
- Luật «…» đã duyệt: đầu mục căn có «Sửa» và «Báo sai thông tin» là hai việc thường, nên hiện thẳng.
- Chuẩn nút đã duyệt:
  - việc bị chặn vì trạng thái → một dòng chữ nhạt có ổ khoá nói lý do; không nút mờ, không biến mất im lặng;
  - nút trên điện thoại có vùng bấm ít nhất 44px.
- Sửa trên ô theo luật hiện hành của kho (sau VP11). Không chép phím của hàng 4 vào mã hay bài của 3h.
- Không sửa `src/components/ui`, `src/components/reui`, `.github/workflows/`, `governance/`.
- Năm tệp khung dùng chung thuộc VP10. 3h chỉ đổi phần nội dung trong ngăn: `record-panel.tsx`, `data-region.tsx`,
  `region-header.tsx`, `second-column.tsx`, `save-view-buttons.tsx`.

## Điểm dễ hỏng mà chưa bài nào phủ (Review Focus)

1. Hai người sửa cùng một tin: một người sửa giá trên ô, người kia sửa diện tích trong hồ sơ. Phiên bản cũ phải bị từ chối
   với câu của hàng 4, không ghi đè im lặng. Bài thêm ở việc 2.
2. «Lấy lại» khi danh mục trống: ô phải hiện trống, không hiện «0» hay «null». Bài thêm ở việc 1.
3. Tầng «7» trên tin và «07» trên danh mục: so theo luật tầng của danh mục, không theo chữ. Hai giá trị coi như bằng thì
   không có dấu. Bài thêm ở việc 1.
4. Tin Đã bán được nhập lại từ tệp: giá trị tệp không được ghi vào tin đã khoá. Bài thêm ở việc 6.
5. Dán vào cột Diện tích một vùng có cả dòng Đã bán: dòng ấy bỏ, kèm lý do khoá, các dòng khác vẫn dán. Bài thêm ở việc 4.

---

### Việc 1: Cột trong cơ sở dữ liệu và đường đọc thật

**Tệp:** `db/migrations/020_tin_rao_gia_tri_rieng.sql` (sau 019 của hàng 11, G-2811-20; số lại tăng nếu main có số lớn hơn lúc dựng; dùng skill
`/new-migration`), `src/modules/listings/inventory-read.ts`, `src/modules/listings/load-sql.ts`, `db/scripts/cach-ly.sh`,
`tests/db/tin-rao-gia-tri-rieng.db.test.ts`.

**Giao diện:** đọc ra `Listing` có thêm năm cặp `<field>` và `<field>Source` (tên đã sinh từ `ontology/entities/Listing.yaml`).

- Migration thêm vào `listings` các cột `living_area numeric`, `floor text`, `bedrooms_total integer`,
  `direction_faces text`, `property_sub_type text`, mỗi cột kèm `<cột>_source text`.
- Ràng buộc trong migration:
  - `<cột>_source in ('Typed','File')`;
  - `(<cột> is null) = (<cột>_source is null)`;
  - `living_area > 0`, `bedrooms_total >= 0`;
  - `direction_faces` thuộc tám hướng (`src/modules/catalog/directions.ts`);
  - `property_sub_type` thuộc bốn giá trị đã có.
- Quyền: vai ứng dụng chỉ được update các cột mới, theo đúng mẫu grant của 013. Không có chính sách mới, vì bảng đã ép
  cách ly theo dòng.
- Bộ kiểm cách ly thêm ca: người sàn B select năm cột của tin sàn A ra 0 dòng, update ra 0 dòng.
- `readInventory` đọc mười cột. Mọi nơi dựng hàng lưới, hồ sơ, thẻ điện thoại, chữ ⌘K, lá cây địa lý và lọc đều qua
  `effectiveAttributes`. Bản mẫu đã làm điều này; việc này nối nó vào đường đọc thật.
- Bài đỏ trước, theo E1 và E1b:
  - ma trận 5 thuộc tính × 4 nguồn ra 20 khẳng định;
  - lọc Phòng ngủ = 2 trả đúng tin có giá trị riêng 2 trong khi danh mục ghi 3;
  - ca Review Focus 2: lấy lại khi danh mục trống;
  - ca Review Focus 3: tầng «7» so với «07».
- Kiểm: `make db-up DB_LANE=r DB_PORT=5565`, rồi `npx vitest run src/modules/listings tests/db/tin-rao-gia-tri-rieng.db.test.ts`, rồi `bash db/scripts/cach-ly.sh`.
- Phục vụ: E1, E1b, E6, E11 (phần cơ sở dữ liệu).

### Việc 2: Cửa ghi `unitAttributes`

**Tệp:** `src/modules/listings/listings-http.ts` (bỏ dòng từ chối 400 ở dòng 85), `src/modules/listings/save-door.ts`,
`src/modules/listings/listings-http.test.ts`, `tests/db/tin-rao-gia-tri-rieng.db.test.ts`.

**Giao diện:**

- Thân request: `{version, change: {field: "unitAttributes", livingArea?, floor?, bedroomsTotal?, directionFaces?,
propertySubType?, sources?}}`.
- Giá trị `null` nghĩa là lấy lại theo danh mục: xoá giá trị và nguồn.
- `sources` chỉ nhận `"File"`, và chỉ để Hoàn tác trả lại nguồn cũ. Vắng thì máy chủ đặt `Typed`.

- Mỗi giá trị kiểm bằng luật đọc có sẵn (`readLivingArea`, `readBedrooms`, `readFloor`, `readDirection`). Không viết luật
  thứ hai.
- Ghi kèm khoá phiên bản như hàng 4, và ghi `lastConfirmedAt` như 3g AC-10.
- Tin Closed hoặc Withdrawn → 400 với lý do khoá. Vai không có `updateListing` → 403.
- Bài đỏ trước:
  - bảng bốn vai × ba lệnh (sửa, lấy lại, gắn sang căn khác) ra đúng 12 khẳng định;
  - băm và số dòng `catalog_units` không đổi sau mọi lệnh;
  - ca Review Focus 1: hai người sửa cùng tin ra 409.
- Kiểm: `npx vitest run src/modules/listings/listings-http.test.ts`, rồi bài cơ sở dữ liệu của việc 1.
- Phục vụ: E2, E6, E11.

### Việc 3: Gắn sang căn khác

**Tệp:** `listings-http.ts` (thay đổi mới `{field: "unit", upi}`), `src/modules/listings/ui/listing-record-full.tsx` (lệnh
trong hồ sơ), ô tìm mã căn của hàng 12 (dùng lại, không viết mới).

- Tin chuyển liên kết sang căn mới; giá trị theo danh mục tính lại theo căn ấy, giá trị riêng giữ nguyên.
- Luật «một căn một tin mở» của 013 trả 409. Câu lỗi nêu mã căn, đọc từ bảng nhãn.
- Không có lệnh này trên ô của lưới.
- Bài đỏ: E10 (máy chủ), E10b (hồ sơ ở 1440 và 360).
- Phục vụ: E10, E10b.

### Việc 4: Sửa trên ô và dán (chờ VP11)

**Tệp:** `src/modules/listings/ui/use-listing-cell-edit.tsx`, `listing-cell-edit.tsx`, `http-save-door.ts`,
`listing-paste.ts`, `src/modules/listings/paste-rules.ts`.

- Ô Diện tích và Phòng ngủ mở sửa theo luật sửa trên ô của VP11, từ 768px trở lên. Dưới 768px không mở.
- Ô ghi qua cửa thật của việc 2. Hoàn tác trả đúng giá trị và nguồn trước đó.
- Dán (hàng 5) vào hai cột này theo cùng luật đọc. Dòng đã khoá bị bỏ, kèm lý do (Review Focus 5).
- Bài:
  - E2: luật đọc và cửa giả;
  - E13: bộ bài của hàng 4 chạy lại không đổi, cộng ca 360;
  - E2b: Bảng hàng đăng nhập, Postgres dãy R, 1024 và 1440. Bài mở sửa bằng helper e2e dùng chung của VP11, không viết
    tay phím.
- Phục vụ: E2, E2b, E13.

### Việc 5: Hồ sơ căn — khối thuộc tính, dấu, lấy lại, dòng khoá (chờ VP10)

**Tệp:** `src/modules/listings/ui/listing-record-full.tsx`, `unit-attributes-edit.tsx`, `attribute-differs-mark.tsx`,
`ask-list-agent.tsx`, `src/modules/listings/ui/unit-attribute-copy.ts`, `ontology/labels.yaml`.

- Khối thuộc tính căn chỉ để đọc cho tới khi bấm «Sửa» (C16). Hộp «Sửa» lưu cả năm trường một lần:
  - Tầng theo luật tầng của danh mục;
  - Hướng chọn từ tám hướng;
  - Loại căn không có ô gõ, luôn suy từ Phòng ngủ (Hỏi-2).
- Dòng nào khác danh mục có dấu chấm. Mở dấu thấy giá trị danh mục và lệnh «Lấy lại theo danh mục».
- Tin Đã bán hoặc Ngừng hẳn:
  - chỗ «Sửa» là dòng chữ nhạt có ổ khoá (C1);
  - chỗ «Hỏi đầu chủ» ở đáy hồ sơ là dòng chữ nhạt nói lý do (C2).
  - Tin chưa ai giữ cũng vậy: nút chính mờ «Căn chưa có đầu chủ giữ» ở đáy thành dòng chữ nhạt nói lý do (G, khi soi ảnh
    VP10). Ba trạng thái (đã bán, ngừng hẳn, chưa ai giữ) dùng chung một cách xử lý.
- Chữ dòng khoá theo mẫu chủ kho duyệt ở chuẩn nút: «Căn đã bán, không sửa». Lời ngừng hẳn và lời cho «Hỏi đầu chủ» viết
  cùng một mẫu, đặt trong `labels.yaml`, và thay chữ của bản mẫu («Đã bán — giữ nguyên như lúc bán»).
- Điện thoại: nút «Sửa» ở đầu mục có vùng bấm ít nhất 44px (C10). Máy tính giữ 28px.
- Màu dấu: sau khi VP11 đổi màu trạng thái, máy kiểm dấu không trùng màu trạng thái nào ở cả nền sáng lẫn nền tối, bằng
  bài trùng màu VP11 thêm. Nếu trùng, dấu chuyển sang token trung tính và ghi một dòng `design/decisions.yaml`.
- Lệnh Sửa, Lấy lại, Gắn sang căn khác hiện theo bộ nút theo quyền (`updateListing`). «Báo sai thông tin căn» còn cho mọi vai.
- Bài: E3, E3b, E4, E5, E11b (bốn vai), E14 (ma trận ba trạng thái × hai vai), E14b (khung VP10, 360 và 1440, sáng và tối, đo vùng bấm).
- Phục vụ: E3, E3b, E4, E5, E11b, E14, E14b.
- **Đã dựng (G-2811-8, chồng lên VP10 lát 1 @86a4c667, trước VP11):**
  - Dòng khoá ở chỗ «Sửa» và ở chỗ «Hỏi đầu chủ» theo một mẫu: `RECORD_COPY.blocked(căn, trạng thái, việc)`, ví dụ
    «Căn đã bán, không sửa». Chữ của từng mảnh lấy từ bảng nhãn.
  - Tin chưa ai giữ có dòng «Căn chưa có đầu chủ giữ» thay nút mờ. `design/behaviors.md` đã sửa câu này, bài E4 và E5 của
    hàng 3e đổi theo; phải ghi sửa-sau-ký ở việc 8.
  - `load-sql.ts` nạp năm giá trị riêng của dữ liệu mẫu (sót từ việc 1).
  - Bài: `tests/tin-rao-giu-gia-tri-rieng.test.tsx` (E14, E11b, E3b) và `tests/e2e-db/tin-rao-gia-tri-rieng.spec.ts`
    (E3 ở 4 khổ, E4, E5, E14b).
- **Để sau VP11:** phép kiểm màu dấu không trùng màu trạng thái. Dấu tạm dùng token `--info` đang có, không viết mã màu
  tay.
- **Chờ khung VP10:** vùng bấm 44px của «Sửa» trên điện thoại. Lớp
  `[&_[data-slot=${RECORD_SECTION_HEADER}]_button]:min-h-11` trong `record-panel.tsx` viết bằng chuỗi nội suy nên Tailwind
  không sinh ra; nút đầu mục ra `min-height: auto` (28px), nút đáy vẫn 44px. Bài E14b ở 360 đỏ đúng chỗ này. Tệp khung
  thuộc VP10, 3h không sửa.

### Việc 5b: Thân hồ sơ căn theo bốn nhóm A–D (chờ VP10, VP11)

Thêm sau khi kế hoạch được duyệt. Chủ kho duyệt bốn nhóm ở phiên BH, nguyên văn «Duyệt cả bốn nhóm»; G-2711-20 xếp chúng
vào 3h. Hợp đồng ghi ở mục «Sửa sau Cổng Phạm vi», đo bằng AC-12.

**Tệp:** `src/modules/listings/ui/listing-record-full.tsx`, `listing-record.tsx`, `record-copy.ts`, `ontology/labels.yaml`,
`tests/tin-rao-gia-tri-rieng.test.tsx`, `tests/e2e-db/tin-rao-gia-tri-rieng.spec.ts`. Không đụng khung ngăn
(`record-panel.tsx` thuộc VP10).

- (A) Thân mở bằng một dòng: trạng thái bên trái, giá bên phải, ở mọi khổ. Dòng kế là «dự án · loại hình».
  - Bỏ mã căn lặp trong thân và bỏ dải ba dữ kiện.
  - Thuộc tính căn chỉ nằm ở khối căn của việc 5.
- (B) Mức đủ:
  - căn đủ hiện một dòng «✓ Đủ thông tin · 5/5»;
  - căn thiếu giữ thanh và số đếm. Mỗi tên trong «Còn thiếu» là nút: bấm thì nhảy tới dòng ấy và mở «Sửa» của khối ấy;
  - giá trị thiếu đọc «Chưa có», có chấm hổ phách trước nhãn;
  - cách đếm vẫn là hàm của hàng 3b (Hỏi-8).
- (C) Dòng «Xác nhận với chủ nhà N ngày trước». Quá 14 ngày thì thêm dòng hổ phách «Quá 14 ngày — nên xác nhận lại».
  Chưa hiện tên người xác nhận; tên chờ hàng 3c.
- (D) Bố cục:
  - cột nhãn khoảng 120px, điện thoại khoảng 104px;
  - lần chào đang xem đọc «Lần n · đang xem», không nền xám; các lần khác như liên kết có «›»;
  - dưới 360px mỗi lần chào hai dòng đều nhau.
- Màu hổ phách và chấm lấy từ bảng màu VP11, không viết mã màu tay.
- Bài: E15 (ma trận thân hồ sơ), E15b (320, 360 và 1440, sáng và tối, đo cột nhãn và dòng trạng thái và giá).
- Phục vụ: E15, E15b.

### Việc 6: Nhập tệp ghi giá trị «tệp», đọc lại lần nhập cũ, dấu ở bước xem trước

**Tệp:**

- `src/modules/imports/` (đường ghi của 11, `writeBatch`);
- `src/modules/listings/unit-attributes.ts` (thêm `mergeSource(current: EffectiveSource | null, incoming:
AttributeSource): boolean`, đúng khi giá trị mới được ghi);
- lệnh một lần `make tin-rao-doc-lai`, gọi `node tools/...` hoặc một tuyến máy chủ nội bộ theo lệ của kho;
- bước xem trước của 11.

- Tin mới tạo từ tệp nhận năm giá trị đọc được, nguồn «tệp». Ô không đọc được ở lại `kept` kèm dấu cần người.
- Lệnh đọc lại `import_runs.kept` (lý do «unit-attribute») chỉ đặt giá trị cho tin chưa có giá trị riêng. Chạy hai lần ra
  cùng kết quả.
- Máy chọn lệnh `make` thay vì migration, vì bước này cần `listingIdOf` của mã TypeScript.
- Tin đã khoá không nhận giá trị tệp (Review Focus 4).
- Bước xem trước: ô khác danh mục mang cùng dấu của lưới, kèm giá trị danh mục.
- Bài: E7, E8.
- Phục vụ: E7, E8.
- **Đã dựng (nhịp 2, G-2811-3, chồng lên nhánh hàng 11):**
  - Không thêm `mergeSource`. Luật «chỉ đặt khi chưa có giá trị riêng» nằm một chỗ, ở `setFileValues`
    (`src/modules/listings/create.ts`), nên khỏi có hàm thứ hai trùng luật với `sourceWins`.
  - Tin mới nhận giá trị tệp ngay trong câu chèn của `createListings`.
  - Lệnh đọc lại là `make tin-rao-doc-lai` (`db/scripts/doc-lai-tep.ts` → `rereadImportValues` của
    `src/modules/imports/reread.ts`). Nó nối bằng tài khoản chủ cơ sở dữ liệu. Lớp cấu hình của sàn đọc qua `readLayer` dưới
    vai ứng dụng với đúng sàn của lần nhập; kept sai hình thì dừng với «kept shape unread». Giới hạn: d-…-30. Không tăng
    phiên bản, bỏ qua tin đã khoá: d-…-31.
  - Bước xem trước: ô khác danh mục mang `catalog` (`withCatalogDiffers` trong `store.ts`) và hiện `AttributeDiffersMark`
    của lưới. Chữ của năm thuộc tính chuyển sang `src/app/(app)/unit-attribute-words.ts`, dùng chung cho Bảng hàng và
    màn nhập.

### Việc 7: Căn chờ khớp

**Tệp:** đường khớp căn chờ khớp của 11 và 12, `effectiveAttributes` (danh mục vắng → không dấu).

- Bài E9:
  - trước khi khớp, năm giá trị hiện không dấu;
  - sau khi khớp, giá trị riêng giữ nguyên và ô nào khác danh mục mới có dấu.
- Phục vụ: E9.
- **Đã dựng (nhịp 2):**
  - `matchPendingUnits` của hàng 11 (`src/modules/company-config/store.ts`) chỉ ghi khoá căn danh mục lên căn chờ.
  - Bước đọc Bảng hàng lấy `cpu.unit_key` và đọc căn ấy bằng `readCatalogUnitsByKey` (cửa mới của catalog). Căn chờ đã
    khớp mượn năm thuộc tính để so, còn tên vẫn là mã của sàn.
  - «Gắn sang căn khác» từ chối tin trên căn chờ, vì căn chờ chưa có liên kết danh mục để chuyển (d-…-32).
  - Không đụng đường khớp của hàng 11.

### Việc 8: Hồ sơ đã ký, ghim lại, wiki

- Mỗi hồ sơ một dòng `sua-sau-ky.md`: hàng 4 (`sua-tren-o`), hàng 5 (`dan-tu-excel`), 3g (`sua-thong-tin-can`), 3e
  (`hoi-dau-chu-bao-sai`), 12 (`them-can`), 10 (`bang-hang-du-lieu-that`: ca cách ly 23 nay chứng gắn sang căn đã có tin mở bị chặn, thay cho «không đổi được căn»).
- Chép ghi chú lưới mười hai cột của hàng 4 và 7e từ hồ sơ 3g (PR #129) về đúng hồ sơ.
- Ghim lại 4, 5, 3e, 7e bằng một lượt `ghim-lai` của đợt (xin khoá, chạy `repin-lane.mjs`, nhả). Eval của 7e cần Postgres
  dãy R.
- Wiki: `make log`, `wiki/entities/listing.md`, `design/behaviors.md`. Phần «…», khung và chuẩn nút VP10 đã ghi; 3h chỉ
  ghi chỗ sửa thuộc tính.
- Dựng `_acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh` cho các eval có `cmd` trỏ về nó, và `chung-minh-man.md`.
- Kiểm: `make check`, `make e2e`, rồi S4.
- Phục vụ: E12 và mọi eval (S4).

## Bảng tóm tắt cho người duyệt

| Người dùng thấy gì khác                                                             | Việc    | Tiêu chí    |
| ----------------------------------------------------------------------------------- | ------- | ----------- |
| Sửa diện tích, phòng ngủ ngay trên ô; tải lại trang vẫn còn                         | 1, 2, 4 | AC-2        |
| Sửa năm thuộc tính trong chi tiết căn ở mọi cỡ màn                                  | 1, 2, 5 | AC-3        |
| Ô khác danh mục có dấu chấm; lấy lại về danh mục                                    | 1, 5    | AC-4, AC-5  |
| Danh mục đổi không đè giá trị của sàn; sàn không sửa được danh mục                  | 1, 2    | AC-1, AC-6  |
| Nhập tệp ghi giá trị của tệp; lần nhập cũ được đọc lại                              | 6       | AC-7, AC-8  |
| Căn chờ khớp giữ giá trị khi được khớp                                              | 7       | AC-9        |
| Gắn tin sang căn khác trong chi tiết căn                                            | 3       | AC-10       |
| Đúng quyền, sàn khác không thấy                                                     | 1, 2    | AC-11       |
| Căn đã bán, ngừng hẳn: dòng khoá nói lý do thay cho nút                             | 5       | AC-12       |
| Chi tiết căn mỗi thứ nói một lần; bấm «Còn thiếu» để sửa; nhắc xác nhận quá 14 ngày | 5b      | AC-12 (A–D) |
