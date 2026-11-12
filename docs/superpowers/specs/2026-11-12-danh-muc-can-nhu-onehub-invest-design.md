# Thiết kế: danh mục căn dùng chung lưu như onehub-invest (hàng 7d)

Hồ sơ: `_acceptance/danh-muc-can-nhu-onehub-invest/` · hạng T3 (chạm `ontology/**`, `db/**`) · không có màn.

## Vì sao

Chủ kho chốt ngày 12/11/2026 (phiên dãy K, ô Cổng Đáng đã quyết «build»): onehub-inventory và onehub-invest phải đọc
chung một danh mục căn, nên lưu cùng cách. Hàng này đi trước «Bảng hàng theo địa lý» (2d) và trước khi nối dữ liệu thật.
Lời chốt cùng ngày ở hàng 2 (`bang-hang-ban-doc#d-20261112T025927Z-35`): khái niệm `Subdivision` (RESO
`SubdivisionName`) mang nhãn «Dự án»; cấp phân khu, tầng dạng chữ và khoá danh mục theo onehub-invest là hàng riêng —
chính là hàng này.

## Hôm nay

- Danh mục chỉ sống trong mã mẫu (`src/modules/catalog/sample.ts`): 3 dự án, 6 toà, 432 căn; 60 lần chào mẫu trỏ 60 căn
  bằng `upi`. Chưa có bảng nào trong cơ sở dữ liệu.
- `Unit` (ontology) gộp mọi cấp vào một dòng: `subdivisionKey`, `buildingKey` (là mã toà người gõ, ví dụ `S1.05`),
  `stack`, `floor` kiểu số nguyên. Không có cấp phân khu, toà và trục không có khoá riêng, mã căn gốc không được giữ.
- Bộ đọc mã căn chỉ hiểu một dạng (`S1.05-1208`).

## onehub-invest lưu thế nào (đọc ở `~/dev/onehub-invest`, chỉ đọc)

| Cấp             | Nơi lưu                                                                                                                                                             | Khoá                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Dự án, phân khu | `asset_nodes` (migration 026, 032): `node_type`, `slug` duy nhất, `parent_id`, `dd_field` = `SubdivisionName` hay `ComplexName`                                     | `slug`                                      |
| Toà             | `buildings` (082)                                                                                                                                                   | `bld_` + ULID 26 ký tự Crockford, kèm `upi` |
| Trục            | `stacks` (082), mở rộng riêng ngoài RESO                                                                                                                            | `stk_` + ULID                               |
| Căn             | `units` (082): `floor text` khớp `^[0-9]+[A-Z]?$`, `sub_id` = RESO `UniversalPropertySubId`                                                                         | `unt_` + ULID                               |
| Mã gốc          | `registry_aliases` (055, 082): `object_key`, `kind` (`ma_nguon`, `ten`), `value` = `<dự án>/<MÃ>`, `source`, duy nhất theo `(source, kind, value)` khi còn hiệu lực | —                                           |

Khoá cấp một lần, không suy từ nội dung (`pipeline/lib/danh-ba-vat-the.mjs`). Bộ đọc `tachMa`
(`pipeline/lib/ma-can-s08.mjs`) có 8 dạng, mỗi dạng phải khớp trọn chuỗi, khớp không dạng nào hay khớp hai dạng thì từ
chối kèm lý do; tầng bỏ số 0 đầu, giữ chữ đuôi. Quyết định: `docs/adr/0016-danh-ba-vat-the-va-nguoi.md`. Invest không có
khoá sàn nào (không `company_id`, không luật theo dòng theo sàn).

## Từ Quỹ hàng

Đọc ở `~/dev/onehub-quy-hang` commit `1729b11f` (chỉ đọc):

- `packages/db/migrations/010_danh_muc_dung_chung.sql`: hai bảng `catalog_subdivisions`, `catalog_units`; toà, trục,
  tầng là cột của căn, `floor int`; khoá chính là UPI của nguồn. **Bỏ**: hàng này tách toà, trục thành bảng có khoá riêng
  như invest.
- Cùng tệp, dòng 18–33 và 74–93: bảng dùng chung không có `company_id`, ép luật theo dòng, mọi sàn đọc (`using (true)`);
  ghi phải qua thoả thuận `catalog_source` còn hiệu lực của một sàn tin cậy, mỗi dòng mang `agreement_id`, sàn khác
  không đọc được cột này (`014_danh_muc_doc_cua_minh.sql`). **Giữ** phần bảng dùng chung chỉ đọc; **để hàng 12** phần
  ghi có thoả thuận nguồn (dấu sàn cấp dòng chỉ có nghĩa khi có đường ghi).
- `docs/adr/0018-cau-hinh-theo-san.md` và `docs/product/tham-chieu.md:111-124`: ba lớp «lõi chuẩn · cách gọi riêng ·
  trường riêng», có rào — không đối tượng tự tạo, không công thức, không bố cục tự dựng; trường riêng là `jsonb` trên lần
  chào kèm bảng định nghĩa theo sàn (`043_truong_rieng.sql`, trần 20 trường, 30 lựa chọn); nhãn riêng ở
  `company_settings` (`039_cach_goi_rieng.sql`); từ điển giá trị cho ba trường (`051_tu_dien_cua_san.sql`). Lời chủ kho
  ghi trong ADR: «trước đây sự thiếu linh hoạt thường mang lại thất bại». **Giữ** khung ba lớp: hàng này dựng lõi và một
  phần lớp của sàn chạm thẳng danh mục (mã và tên riêng); nhãn riêng, trường riêng, từ điển đề xuất thành hàng 7e.
- Quỹ hàng **không có** bảng nối mã riêng của một sàn với danh mục chung (ADR-0026 chỉ gợi ý, «mã ngoài danh mục vẫn lưu
  được»). Đây là chỗ hở hàng này lấp: sàn gõ mã theo thói quen của mình mà vẫn trỏ đúng căn chuẩn.
- `packages/core/src/catalog/code-rule.ts`: luật đọc mã là dữ liệu theo dự án, một luật. **Bỏ** cho bộ đọc này: lấy bộ 8
  dạng của invest vì hai sản phẩm phải đọc chung mã; luật theo sàn để sau.
- `packages/db/tests/danh-muc-dung-chung.test.mjs`: bộ kiểm riêng cho bảng dùng chung (đọc được ở mọi sàn, không ai
  ghi, cột đọc được viết sẵn). **Giữ** cách ấy trong một tệp kiểm mới của hàng này.
- Không có bảng bí danh mã căn (chỉ `company_value_aliases` cho ba trường). **Không có** — lấy từ invest.

## Khung: chuẩn ở lõi, linh hoạt ở lớp của sàn

Chủ kho 12/11: chuẩn hoá danh mục như onehub-invest vì cùng gốc RESO, nhưng không cứng — sàn môi giới thường thiếu
chuẩn hoá, triển khai không đổi được thì thất bại. Hai lực ấy không trái nhau nếu tách hai lớp:

| Lớp                                      | Ai đọc, ai ghi                                   | Gồm                                                                                               | Hàng       |
| ---------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------- |
| Lõi chuẩn — danh mục chung               | Mọi sàn đọc, invest đọc chung; không sàn nào sửa | Dự án, phân khu, toà, trục, căn, mã gốc; tên và khoá theo RESO                                    | 7d         |
| Lớp của sàn — chạm danh mục              | Chỉ sàn ấy                                       | Mã và tên riêng sàn gọi toà, căn                                                                  | 7d         |
| Lớp của sàn — cách gọi và thông tin thêm | Chỉ sàn ấy                                       | Nhãn riêng (đổi chữ hiện của Dự án, Phân khu, Trục…), trường riêng trên lần chào, từ điển giá trị | đề xuất 7e |

Luật của khung: một sàn không bao giờ sửa được lõi; mọi thứ riêng của sàn nằm ở bảng có `company_id` và luật theo dòng
như mọi bảng của sàn; nghĩa vẫn do lõi giữ, chữ riêng chỉ là chữ hiện (Quỹ hàng `packages/core/src/labels/index.ts:3-5`).
Rào giữ theo ADR-0018: không đối tượng tự tạo, không công thức, không luồng tự vẽ.

## Thiết kế

### Mô hình nghiệp vụ (`ontology/`, chủ kho soi từng thay đổi)

| Thay đổi     | Tên mã                                                                                                                 | Nhãn           | RESO                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------- |
| Thực thể mới | `Subdivision` — dự án, gốc của danh mục                                                                                | Dự án (đã có)  | `SubdivisionName`                             |
| Thực thể mới | `Complex` — phân khu, con của một dự án                                                                                | Phân khu (mới) | `Building.ComplexName`                        |
| Thực thể mới | `Building` — toà; cha là phân khu nếu biết, không thì dự án                                                            | Toà (đã có)    | `Building`: `BuildingKey`, `BuildingName`     |
| Thực thể mới | `Stack` — trục của một toà                                                                                             | Trục (mới)     | mở rộng riêng, như invest                     |
| Sửa          | `Unit` thêm `unitKey`, `stackKey`, `complexKey`; `buildingKey` đổi nghĩa thành khoá `bld_`; `floor` đổi từ số sang chữ | Tầng (mới)     | `UnitFloorLocation`, `UniversalPropertySubId` |
| Thực thể mới | `CompanyCatalogAlias` — mã, tên riêng sàn gọi toà, căn; có `companyId`                                                 | Mã riêng (mới) | không có; riêng của ta                        |
| Thực thể mới | `CatalogAlias` — mã gốc và tên của toà, trục, căn                                                                      | Mã gốc (mới)   | không có; riêng của ta                        |
| Luật mới     | `complex-under-project`, `prefixed-keys`, `floor-text`, `one-active-original-code`                                     | —              | —                                             |

`Unit.upi` giữ nguyên để `ListingUnit` không đổi (đổi liên kết sang `unitKey` là việc sau). `subdivisionKey` của căn
giữ tên, nghĩa là khoá dự án. Bảng thuật ngữ thêm năm dòng: Phân khu, Trục, Tầng, Mã gốc, Mã riêng, kèm từ tránh dùng («Khu»
vẫn tránh như lời chốt ở hàng 2).

### Lưu trữ (migration 007, số do giám sát cấp)

Bảng ở schema `public`, tên mở đầu `catalog_` như Quỹ hàng:

- `catalog_nodes`: `id`, `node_type` ∈ {`project`, `complex`}, `slug` duy nhất, `name`, `parent_id`, `reso_field`.
  Phân khu phải có cha là dự án, dự án không có cha — giữ bằng khoá ngoại ghép `(parent_id, parent_type)` →
  `(id, node_type)` với `parent_type` sinh từ `node_type`, không cần trigger.
- `catalog_buildings` (`building_key` khớp `^bld_[0-9A-HJKMNP-TV-Z]{26}$`, `node_id`, `building_name`, `upi` duy nhất),
  `catalog_stacks` (`stack_key` `stk_…`, `building_key`, `stack_code`), `catalog_units` (`unit_key` `unt_…`,
  `building_key`, `stack_key` có thể trống, `floor text` khớp `^[0-9]+[A-Z]?$`, `unit_number`, `upi` duy nhất, `sub_id`
  = `stack_key:floor` hay `unit_key` khi chưa biết trục, cùng các trường RESO đang có của `Unit`).
- `catalog_aliases`: `object_key` khớp `^(bld|stk|unt)_`, `kind` ∈ {`ma_goc`, `ten`}, `value`, `source`, `first_seen`,
  `retired_at`; mã gốc còn hiệu lực là duy nhất theo `(source, kind, value)`; giá trị mã gốc là
  `<slug dự án>/<MÃ VIẾT HOA>` như invest.
- Mã và tên riêng của sàn (Hỏi-1): `company_catalog_aliases` — `company_id`, `building_key` hay `unit_key` (khoá ngoại tới danh mục, đúng một trong hai),
  `kind` ∈ {`ma`, `ten`}, `value`, `created_at`, `retired_at`; duy nhất theo `(company_id, kind, value)` khi còn hiệu
  lực; luật theo dòng dạng chuẩn `company_id = app.current_company_id()` cho đọc và ghi. Là bảng của sàn bình thường, nằm
  trong phạm vi các ca có sẵn của bộ kiểm cách ly, không phải ngoại lệ.
- Tra mã (`index.ts`, thuần): mã riêng của sàn → mã gốc của danh mục → bộ đọc 8 dạng; hàm nhận mã riêng của đúng một sàn.
- Mỗi bảng bật và ép luật theo dòng, một luật đọc `using (true)`, vai của API chỉ được đọc; không ai ghi qua API ở hàng
  này. Năm bảng vào danh sách danh mục chung đã khai của bộ kiểm cách ly (cạnh `app.permissions` của hàng 9a), nên bảng
  thứ sáu không khai vẫn làm bộ kiểm đỏ.

### Mã nguồn (`src/modules/catalog/`)

- `index.ts` (thuần, chạy được ở trình duyệt): `mintKey(prefix, now, random)` cấp khoá ULID, `readUnitCode(code)` đọc
  đúng 8 dạng của invest, trả `{ building, floor, stack, form }` hay `{ refused: reason }`. Mã mẫu cũ `S1.05-1208` không
  thuộc dạng nào: nó được giữ nguyên văn làm mã gốc và tra qua bảng bí danh (Hỏi-4).
- `sample.ts`: danh mục mẫu dựng lại theo cấp mới — 3 dự án, phân khu «The Sapphire 1» (tên công khai) dưới Ocean Park 1,
  toà của Ocean Park 2 và 3 đứng thẳng dưới dự án (cả hai đường cha đều có mẫu); khoá mẫu cấp tất định từ một đồng hồ
  mẫu cố định và bộ đếm, không từ nội dung; mỗi căn, toà, trục có mã gốc làm bí danh. `upi`, tên toà, số căn, diện tích,
  hướng của 432 căn giữ nguyên.
- `server.ts`: nạp danh mục mẫu vào cơ sở dữ liệu dưới vai chủ bảng (dùng cho bài kiểm và môi trường thử).

### Kiểm

- Thuần (`src/modules/catalog/*.test.ts`): bộ đọc theo ma trận viết trước — mỗi dạng một mã đúng (khớp đúng một dạng)
  và một mã suýt đúng (khớp không dạng nào); ba lý do từ chối. Khoá: tiền tố, độ dài, bảng chữ Crockford, không trùng.
- Chuyển mẫu (`tests/` tệp mới): so danh mục mới với ảnh chụp danh mục cũ lấy từ commit trước — 432 căn, 60 căn của lần
  chào, từng căn giữ `upi`, toà, tầng, trục; mã cũ tra qua bí danh ra đúng căn; 60 lần chào mẫu dựng từ danh mục mới
  giống hệt bản dựng từ danh mục cũ (không màn nào đọc `floor` hay `buildingKey` hôm nay, bài này giữ điều đó).
- Cơ sở dữ liệu (`tests/db/` tệp mới, Postgres dãy R): ràng buộc khoá, tầng, cha của phân khu, mã gốc trùng; mọi sàn và
  phiên chưa chọn sàn đọc được; vai API không thêm, sửa, xoá, xoá sạch; mã riêng của sàn A không lộ sang B; các cột vai đọc
  được khớp danh sách viết trước; cột của bảng khớp thuộc tính của ontology.
- Bộ kiểm cách ly (`db/scripts/cach-ly.sh`) xanh, kèm một tệp phá mới: cấp quyền thêm trên `catalog_units` cho vai API thì
  đỏ với dòng ghim.

## Đặc tả UX

Không có — hàng này không đổi màn nào (sổ: «bỏ đặc-tả-UX»).

## Lựa chọn và căn cứ

Xem `_acceptance/danh-muc-can-nhu-onehub-invest/decisions.jsonl`. Năm câu cho chủ kho: Hỏi-1 «khoá sàn» là lớp của sàn trên danh mục,
Hỏi-2 tên toà là cột hay bí danh, Hỏi-3 duyệt các thay đổi mô hình nghiệp vụ, Hỏi-4 bộ đọc đúng 8 dạng của invest, Hỏi-5 mở hàng 7e (nhãn riêng, trường riêng, từ điển giá
trị của sàn) ngay sau hàng này, lật quyết định hoãn L4/H4 của phạm vi MVP — máy khuyên mở; lối khác: giữ hoãn tới đợt 3.

## Ngoài phạm vi

- Ghi danh mục qua `/api/v1` (thêm căn, nhập Excel) và vòng đời gộp, tách, ngừng của toà, căn: hàng 12 và sau.
- `ListingUnit` trỏ `unitKey` thay cho `upi`; màn Bảng hàng theo địa lý (2d).
- Luật đọc mã theo dự án.
- Nhãn riêng, trường riêng, từ điển giá trị của sàn: đề xuất hàng 7e (xem Khung).
- Đồng bộ thật với cơ sở dữ liệu của onehub-invest.
