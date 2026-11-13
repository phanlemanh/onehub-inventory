---
schema_version: 1
feature: "Mỗi sàn có lớp riêng của mình trên lõi chuẩn — nhãn riêng, trường riêng, từ điển giá trị, căn chờ khớp và mẫu nhập — và Bảng hàng hiện trường riêng, đọc nhãn riêng của sàn"
slug: lop-rieng-cua-san
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config, ui]
screens: [inventory, tuy-chinh-san]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: docs/superpowers/specs/2026-11-13-lop-rieng-cua-san-design.md
---

# Acceptance Contract: lop-rieng-cua-san

## Context

Hàng 7e của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/lop-rieng-cua-san/opportunity.md` đã quyết «build» bởi Manh
Phan ngày 12/11/2026. Lõi dữ liệu giữ chuẩn; phần khác nhau của từng sàn là dữ liệu ở lớp của sàn (mô-đun
`company-config`): nhãn riêng, trường riêng, từ điển giá trị, căn chờ khớp, mẫu nhập. Hàng 10 (Bảng hàng dữ liệu thật) và
11 (Nhập Sheet là lúc ghép) đứng trên hàng này. Luật chạm: SP-1 (năm bảng mới của sàn đều có `company_id`, luật theo dòng
ép buộc, qua một cửa); SP-4 (nhãn và trường riêng là chữ nội bộ, trang khách không đọc). Không chạm SP-3.

## Criteria

- AC-1 (cross-layer): Given sàn A, When người có quyền lưu nhãn riêng cho một khái niệm chuẩn qua `/api/v1` (ví dụ «Toà» →
  «Block»), Then sàn A đọc lại đúng nhãn ấy và `label()` trả nhãn riêng; mỗi khái niệm một nhãn còn dùng; khái niệm không
  có trong bảng nhãn, hay không phải `field`/`entity`, bị từ chối; chữ rỗng hay quá 40 ký tự bị từ chối; ngừng dùng thì
  về nhãn chuẩn.
- AC-2 (cross-layer): Given sàn A, When lưu trường riêng qua `/api/v1`, Then trường nhận đúng năm kiểu (chữ, số, ngày, chọn
  một, có/không) và từ chối kiểu khác; «chọn một» có 1–30 lựa chọn không trùng, kiểu khác không có lựa chọn; trường thứ 21
  còn dùng bị cả cửa API lẫn cơ sở dữ liệu từ chối, trường đã ngừng không tính vào trần; tên trường không trùng (sau khi gấp chữ) với
  trường riêng còn dùng, nhãn riêng hay nhãn chuẩn của cột Bảng hàng; mã trường cấp một lần, không đổi, không dùng lại
  sau khi ngừng.
- AC-3: Given một trường riêng của mỗi kiểu, When kiểm một giá trị cho lần chào, Then ma trận viết trước gồm giá trị đúng và
  giá trị sai của từng kiểu cho đúng kết quả (chữ ≤ 500, số hữu hạn, ngày có thật dạng `YYYY-MM-DD`, lựa chọn còn trong danh
  sách, có/không là boolean), trường đã ngừng không nhận giá trị; lần chào trong ontology có thuộc tính trường riêng.
- AC-4 (cross-layer): Given sàn A, When lưu từ điển giá trị qua `/api/v1` (ví dụ Hướng «ĐN» → Đông Nam, Trạng thái «còn»
  → Đang bán, «Hướng view» «biển» → lựa chọn «Biển»), Then tra chữ thô ra giá trị chuẩn không phân biệt hoa thường, dấu,
  khoảng trắng thừa; giá trị không thuộc tập của trường bị từ chối; trường không có tập giá trị đóng bị từ chối; một chữ
  thô gấp một giá trị cho mỗi trường; ngừng một trường riêng thì từ điển của trường ấy không còn tra ra.
- AC-5 (cross-layer): Given sàn A có căn chờ khớp «SA5-12.08» mà danh mục chưa có căn ấy, When tra mã trong sàn A, Then
  thứ tự là mã riêng → mã gốc → bộ đọc 8 dạng → căn chờ khớp, và mã ấy ra căn chờ khớp; When danh mục có căn ấy và người
  bấm khớp, Then căn chờ khớp trỏ đúng căn của danh mục, tra mã ra căn của danh mục, sàn không nhập lại gì, danh mục chung
  không đổi dòng nào; căn chờ khớp không trỏ được căn không có trong danh mục; mã ra nhiều căn thì vẫn chờ.
- AC-6 (cross-layer): Given sàn A, When lưu mẫu nhập qua `/api/v1`, Then tìm theo dạng tệp (tên cột đã gấp, đúng thứ tự)
  ra đúng mẫu, khác thứ tự hay thiếu một cột thì không ra; mỗi cột trỏ đúng một đích: trường chuẩn, trường riêng còn dùng,
  hay «bỏ cột»; đích không có thật bị từ chối; mỗi dạng tệp một mẫu còn dùng; cột trỏ trường riêng đã ngừng thì mẫu vẫn
  ra nhưng cột ấy mang dấu «đích đã ngừng» để màn nhập hỏi lại, không ghi vào trường đã ngừng.
- AC-7 (cross-layer): Given hai sàn A, B, When đọc và ghi năm bảng của lớp riêng, Then mọi bảng có `company_id`, luật theo
  dòng ép buộc; sàn B và phiên chưa chọn sàn không thấy dòng nào của A; vai API không xoá được; chỉ vai có
  quyền ghi của bảng quyền (thêm, sửa, ngừng dùng, khớp) ghi được; bộ kiểm cách ly có ca cho năm bảng và đỏ có dòng ghim khi một bảng mất luật theo dòng.
- AC-8 (cross-layer): Given sàn A có nhãn riêng «Block» cho Toà và hai trường riêng còn dùng (một đã ngừng), When mở Bảng
  hàng, Then tiêu đề cột Toà là «Block», hai trường riêng hiện sau tám cột chuẩn theo vị trí, mỗi cột theo kiểu (căn lề,
  lọc, sắp như cột chuẩn), trường đã ngừng không hiện; sàn B mở Bảng hàng thấy nhãn chuẩn và không cột riêng nào.
- AC-9 (cross-layer): Given sàn A có đủ năm phần, When mở màn «Tuỳ chỉnh của sàn», Then thấy năm phần với đúng dòng của
  sàn, và mỗi phần có đúng bộ nút của bảng `thao-tac-nhap.yaml` theo khuôn nút theo quyền của hàng 9e: «Thêm» ở đầu vùng
  (Nhãn riêng, Trường riêng, Từ điển), «Khớp với danh mục» ở đầu vùng Căn chờ khớp, «…» cuối dòng có Sửa (hay Đổi tên ở
  Mẫu nhập) và Ngừng dùng, không phần nào có Xoá; vai có quyền thấy nút theo bảng vai × nút viết sẵn, vai chỉ đọc không
  thấy nút nào; máy chủ từ chối thì hiện câu không đủ quyền; màn đủ trạng thái của `design/states.md` ở bốn khổ, sáng và
  tối, axe không lỗi.
- AC-11 (cross-layer): Given người có quyền thêm, sửa, When thêm hay sửa một nhãn riêng, trường riêng hay dòng từ điển bằng
  hộp biểu mẫu trên màn, Then lần ghi đi qua `/api/v1` và qua đúng các luật của AC-1, AC-2, AC-4 (trần 20 trường còn dùng,
  30 lựa chọn, tên không trùng, giá trị thuộc tập của trường) ở cả cửa lẫn cơ sở dữ liệu; lỗi hiện ngay dưới ô và chữ đã
  gõ còn nguyên; sửa trường riêng đổi được tên và lựa chọn nhưng không đổi được kiểu; ngừng dùng không xoá dòng nào.
- AC-10: Given mô hình nghiệp vụ, When so ontology với bảng, kiểu sinh và mã, Then năm thực thể mới có tệp ontology (tên
  riêng của kho, không mượn tên RESO cho nghĩa khác), `make gen` khớp, cột bảng khớp thuộc tính, nhãn lấy từ
  `ontology/labels.yaml`, `modules.yaml` khai sở hữu và phụ thuộc; rào ADR-0018 giữ: kiểu trường là tập đóng, không cột
  công thức, không bảng luật hay quy trình, không xoá cứng.

## Coverage

Quét theo khuôn entity-feature (skill morphological-scan). Chân sản phẩm: `[SUY-TỪ-REPO:
_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md]` (năm chỗ ghép), `[SUY-TỪ-REPO:
db/migrations/007_danh_muc_nhu_invest.sql]`, `[SUY-TỪ-REPO: db/tests/cach-ly.sql]`. Chân ngành: `[NGÀNH: Quỹ hàng
migration 039, 043, 045, 051, 052; ADR-0018]`.

- Trục A — phần của lớp: nhãn riêng | trường riêng | giá trị trường riêng | từ điển | căn chờ khớp | mẫu nhập. [thước CE:
  bảng năm chỗ ghép của đề xuất]
- Trục B — mặt lời hứa: lưu và đọc | luật hợp lệ và trần | cách ly theo sàn | ai được ghi | Bảng hàng đọc | bảng xem lại |
  khớp ontology và rào ADR-0018. [thước CE: câu «Bật khi» của hàng]
- Trục C — ai dùng ngay: Bảng hàng (7e) | màn nhập (hàng 11) | dữ liệu thật (hàng 10). [thước CE: `dung_tren` của hàng 10, 11]

Core: A×«lưu, luật» cho nhãn (AC-1), trường (AC-2), giá trị (AC-3), từ điển (AC-4), căn chờ (AC-5), mẫu (AC-6); B cách ly
và quyền (AC-7); Bảng hàng (AC-8); màn Tuỳ chỉnh và bộ nút (AC-9); thêm, sửa trên màn (AC-11); ontology và rào (AC-10).
Later: lưu giá trị trường riêng trên lần chào thật (hàng 10); ghép khi nhập, bốn dấu mỗi ô, «không ô nào mất» (hàng 11);
màn Cài đặt sàn đầy đủ (H4); trạng thái riêng của sàn (L4 phần còn lại); thêm căn chờ khớp bằng tay (hàng 12, theo Hỏi-7).
Never: trường tính bằng công thức; đối tượng tự tạo; từ điển có điều kiện; sửa danh mục chung từ lớp của sàn.
Ô gạch: «trang khách × nhãn riêng» — trang khách chưa dựng; luật ghi ở Notes, đo ở hàng của trang khách.

## Đường đo

Ô cơ hội khai ngưỡng sống là câu «Bật khi» của hàng. Mỗi vế một thước:

- Sàn lưu và đọc được nhãn riêng, trường riêng (năm kiểu, trần 20/30), từ điển, căn chờ khớp, mẫu nhập → AC-1, AC-2, AC-4,
  AC-5, AC-6.
- Mọi bảng có khoá sàn, qua bộ kiểm cách ly, sàn khác không thấy → AC-7.
- Bảng hàng hiện trường riêng sau cột chuẩn, nhãn riêng thay nhãn chuẩn → AC-8.
- Căn chờ khớp dùng được ngay và khớp vào danh mục mà không nhập lại → AC-5.
- Bảng xem lại tối giản → AC-9; chủ kho nâng thành đủ bộ nút thêm, sửa, ngừng dùng (2026-11-13) → AC-9, AC-11.
- Rào ADR-0018 → AC-10. Màn Cài đặt sàn đầy đủ để H4 → Out of scope.

## Out of scope

- Cột giá trị trường riêng trên bảng lần chào thật, ghi giá trị khi sửa ô: hàng 10 (7e để lại hàm kiểm của AC-3).
- Ghép năm chỗ khi nhập, bốn dấu mỗi ô, luật «không ô nào mất», hoàn tác lần nhập: hàng 11 (7e để lại tra bốn nguồn, cửa
  ghi, tìm mẫu theo dạng tệp, ngừng dùng để gỡ phần vừa học).
- Ghi vào danh mục chung và ba kẽ hở cơ sở dữ liệu của danh mục (căn thiếu phân khu dù toà thuộc phân khu; khoá ngoại ghép
  không chặn việc ấy; mã gốc trỏ đối tượng không có thật): hàng 12 «Thêm căn», hay hàng 11 nếu nhập ghi danh mục. Hàng này
  không mở đường ghi danh mục.
- Màn Cài đặt sàn đầy đủ (H4), nhật ký đổi cấu hình (N10), nhập có AI (H5).
- Luồng đề xuất–duyệt của từ điển như Quỹ hàng.
- Trạng thái riêng của sàn: theo Hỏi-6 (máy khuyên để hàng sau; câu giao của 7e liệt năm phần, không có trạng thái).

## Notes

- Migration số 010 (giám sát cấp). Trang quyết định 0029 (giám sát cấp, R-1311-9).
- Sửa ngoài mô-đun `company-config`: `architecture/modules.yaml`, `ontology/` (năm thực thể, hai thao tác, nhãn), `db/tests/cach-ly.sql`,
  Bảng hàng (`src/modules/listings/ui/`, `src/app/(app)/inventory/`), `src/components/candidate/column-kind.ts` (cột có kiểu
  khai sẵn), thanh bên.
- Trang khách không đọc nhãn riêng, trường riêng (SP-4): ghi ở trang thực thể, đo ở hàng của trang khách.
- Dòng sửa đổi L4/L5 ở `docs/plan/pham-vi-mvp-dot-1.md` đã có (2026-11-12) — không thêm dòng trùng.
