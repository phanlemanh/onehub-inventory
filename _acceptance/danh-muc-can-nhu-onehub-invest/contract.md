---
schema_version: 1
feature: "Danh mục căn dùng chung lưu cùng cách với onehub-invest: có cấp phân khu dưới dự án, tầng lưu theo RESO, toà · trục · căn có khoá riêng, mã căn gốc giữ làm bí danh"
slug: danh-muc-can-nhu-onehub-invest
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: docs/superpowers/specs/2026-11-12-danh-muc-can-nhu-onehub-invest-design.md
---

# Acceptance Contract: danh-muc-can-nhu-onehub-invest

## Context

Hàng 7d của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/danh-muc-can-nhu-onehub-invest/opportunity.md` đã quyết
«build» bởi Manh Phan ngày 12/11/2026. Hai sản phẩm onehub-inventory và onehub-invest phải đọc chung một danh mục căn,
nên danh mục của kho này đổi sang cách lưu của onehub-invest, giữ khoá sàn mà onehub-invest không có. Luật chạm: SP-1
(bảng dùng chung không có `company_id` là ngoại lệ đã khai, chỉ đọc, và bộ kiểm cách ly phải bắt bảng chưa khai). Không
chạm SP-3, SP-4.

## Criteria

- AC-1: Given danh mục có dự án và phân khu, When lưu một phân khu, Then phân khu mang tên RESO `ComplexName` và cha của
  nó phải là một dự án; lưu phân khu không cha, phân khu có cha là phân khu, hay dự án có cha đều bị cơ sở dữ liệu từ
  chối; toà đứng được dưới phân khu hoặc thẳng dưới dự án.
- AC-2: Given một căn, When lưu tầng, Then tầng là chữ theo RESO `UnitFloorLocation` khớp `^[0-9]+[A-Z]?$` (nhận `7`,
  `15A`; từ chối chuỗi rỗng, `07`, `-1`, `15-A`), và bộ đọc mã bỏ số 0 đầu của tầng (`07` → `7`).
- AC-3: Given toà, trục, căn, When cấp khoá, Then khoá là tiền tố `bld_`, `stk_`, `unt_` cộng 26 ký tự Crockford, cấp một
  lần không suy từ nội dung; cơ sở dữ liệu từ chối khoá sai tiền tố, sai độ dài, có chữ `I L O U`; cấp hai lần cho cùng
  nội dung ra hai khoá khác nhau.
- AC-4: Given mỗi toà, trục, căn của danh mục, When giữ mã gốc, Then mã gốc nằm trong bảng bí danh dạng
  `<dự án>/<MÃ VIẾT HOA>`, tra mã ra đúng một đối tượng; thêm một mã gốc còn hiệu lực trùng `(nguồn, loại, giá trị)` bị từ
  chối, còn mã đã ngừng thì thêm lại được.
- AC-5: Given ma trận viết trước gồm đúng 8 dạng mã của onehub-invest, When bộ đọc tách mã, Then mỗi dạng tách đúng toà,
  tầng, trục của mã mẫu của nó; mỗi mã đúng khớp đúng một dạng; mỗi mã suýt đúng khớp không dạng nào và bị từ chối với
  lý do `khong-khop-khuon`; chuỗi rỗng bị từ chối với `ma-rong`; một bảng dạng có hai dạng trùng cho `nhieu-khuon`.
- AC-6 (cross-layer): Given danh mục mẫu cũ (432 căn, 60 căn được lần chào trỏ tới), When chuyển sang cách lưu mới và nạp
  vào cơ sở dữ liệu, Then vẫn đủ 432 căn và 60 căn ấy, mỗi căn giữ `upi`, tên toà, số căn, tầng, trục, diện tích, hướng;
  mỗi mã căn cũ tra nguyên văn qua bí danh ra đúng căn cũ; không căn nào mất, không căn nào nhân đôi; 60 lần chào mẫu dựng
  từ danh mục mới giống hệt 60 lần chào dựng từ danh mục cũ.
- AC-7 (cross-layer): Given năm bảng danh mục chung không có `company_id`, When vai của API đọc và ghi, Then mọi sàn và
  phiên chưa chọn sàn đọc được cùng các dòng; vai không thêm, sửa, xoá, xoá sạch được; bộ kiểm cách ly xanh với năm bảng
  nằm trong danh sách danh mục chung đã khai, và đỏ với dòng ghim khi vai được cấp quyền thêm trên một bảng danh mục hay
  khi một bảng không `company_id` chưa khai được cấp quyền đọc.
- AC-8: Given mô hình nghiệp vụ, When so với bảng và kiểu sinh, Then mỗi thực thể danh mục có một tệp ontology mang tên
  RESO đã nêu, `make gen` sinh kiểu khớp, cột của mỗi bảng khớp đúng thuộc tính của thực thể tương ứng, và nhãn Phân khu,
  Trục, Tầng, Mã gốc, Mã riêng lấy từ `ontology/labels.yaml`.

- AC-9 (cross-layer): Given hai sàn A, B và danh mục chung, When sàn A lưu mã hay tên riêng của mình cho một toà hay một
  căn (ví dụ toà «S1.05» A gọi là «Sapphire 5», căn «S1.05-1208» A ghi «SA5-12.08»), Then tra mã ấy trong sàn A ra đúng
  đối tượng của danh mục chung, theo thứ tự: mã riêng của sàn → mã gốc của danh mục → bộ đọc 8 dạng; sàn B không thấy mã
  riêng của A (phiên chưa chọn sàn cũng không thấy) và được gán cùng chuỗi ấy cho đối tượng khác; mã riêng trỏ đối tượng không có
  trong danh mục bị từ chối; danh mục chung không đổi dòng nào; một mã riêng chỉ trỏ một
  đối tượng trong một sàn; bộ kiểm cách ly có ca cho bảng mã riêng.

## Coverage

Quét theo khuôn entity-feature (skill morphological-scan). Chân sản phẩm: `[SUY-TỪ-REPO: ontology/entities/Unit.yaml]`,
`[SUY-TỪ-REPO: src/modules/catalog/sample.ts]`, `[SUY-TỪ-REPO: db/tests/cach-ly.sql]`. Chân ngành: `[NGÀNH: RESO Data
Dictionary 2.1]` (Property, Building) và sản phẩm chị em `[NGÀNH: onehub-invest migration 082, ADR-0016]`.

- Trục A — cấp: dự án | phân khu | toà | trục | tầng | căn | mã gốc. [thước CE: ADR-0016 §2 của invest + RESO]
- Trục B — mặt lời hứa: khoá | quan hệ cha con | dạng giá trị | duy nhất | ai đọc, ai ghi | khớp ontology.
  [thước CE: ràng buộc migration 082 của invest + bộ kiểm cách ly của kho]
- Trục D — ai sở hữu: danh mục chung (mọi sàn đọc, không sàn nào sửa) | lớp của sàn (chỉ sàn ấy đọc, ghi). [thước
  CE: ADR-0018 của Quỹ hàng, ba lớp «lõi chuẩn · cách gọi riêng · trường riêng»]
- Trục C — nguồn dữ liệu: mẫu chuyển sang | mã người gõ (8 dạng của invest) | dữ liệu thật. [thước CE: ma trận dạng của
  `ma-can-s08.test.mjs` của invest]

Core: A×B cho dự án, phân khu (AC-1), tầng (AC-2), khoá ba cấp (AC-3), mã gốc (AC-4), ai đọc ghi (AC-7), khớp ontology
(AC-8); C mã người gõ (AC-5), mẫu chuyển sang (AC-6).
D lớp của sàn: mã và tên riêng của sàn (AC-9).
Later: ghi danh mục qua API; vòng đời gộp, tách, ngừng; luật đọc mã theo dự án; `ListingUnit` trỏ `unitKey`; nhãn riêng,
trường riêng, từ điển giá trị của sàn (đề xuất hàng 7e). Never: tầng kiểu số (RESO và invest đều dùng chữ); khoá suy từ nội dung (invest cấm vì đổi tên là đổi khoá).
Ô gạch: «dữ liệu thật × mọi cấp» — chưa có dữ liệu thật, thuộc hàng 10.

## Đường đo

Ô cơ hội khai ngưỡng sống là chính câu «Bật khi» của hàng. Mỗi vế một thước:

- Cấp phân khu là con của dự án → AC-1 (E1, E2).
- Tầng dạng chữ theo `UnitFloorLocation` → AC-2 (E3, E4).
- Toà, trục, căn có khoá riêng có tiền tố → AC-3 (E5, E6).
- Mã gốc giữ làm bí danh, bộ đọc tách nhiều dạng → AC-4 (E7), AC-5 (E8).
- 60 căn mẫu chuyển sang không mất căn nào → AC-6 (E9, E10, E15).
- Bộ kiểm cách ly xanh với danh mục dùng chung là ngoại lệ đã khai → AC-7 (E11, E12).
- Giữ khoá sàn mà onehub-invest không có (lớp của sàn trên danh mục chung) → AC-9 (E16, E17).

## Out of scope

- Ghi danh mục qua `/api/v1` (thêm căn, nhập Excel) và luật «ghi phải có thoả thuận nguồn còn hiệu lực»: hàng 12.
- Vòng đời toà, căn (gộp, tách, ngừng) và chặn xoá bằng trigger như invest.
- `ListingUnit` trỏ `unitKey` thay cho `upi`; màn Bảng hàng theo địa lý (hàng 2d).
- Luật đọc mã theo dự án.
- Nhãn riêng, trường riêng, từ điển giá trị, căn chờ khớp và mẫu nhập của sàn — đề xuất hàng 7e làm ngay sau hàng này,
  cùng hàng 11 mở rộng thành năm chỗ ghép khi nhập Sheet (`de-xuat-nhap-la-luc-anh-xa.md`); chủ kho quyết.
- Đồng bộ thật với cơ sở dữ liệu của onehub-invest.

## Notes

- Chạm SP-1, giữ đúng ngoại lệ đã có, không nới thêm: AGENTS.md «The shared catalog is the only exception»; danh sách danh
  mục chung đã khai của hàng 9a (`db/tests/cach-ly.sql`, ca 17). Mọi thứ riêng của một sàn nằm ở bảng có `company_id`, không
  bao giờ ở danh mục chung.
- Không màn nào đọc `floor` hay `buildingKey` hôm nay (Bảng hàng đọc tên toà, số căn); E15 ghim điều đó bằng đầu ra 60 lần
  chào mẫu trước và sau.

- Migration số 007 (giám sát cấp, `tra-loi` R-1211-8); tạo sau khi hàng 9a (006) đã vào nhánh chính.
- Sửa ngoài vùng cần giám sát duyệt trước khi dựng: `db/tests/cach-ly.sql` (thêm năm bảng vào danh sách danh mục chung
  của hàng 9a), `tests/sample-data.test.ts` (tầng thành chữ), `architecture/modules.yaml` (catalog sở hữu thực thể mới),
  `wiki/entities/unit.md` và trang thực thể mới.
