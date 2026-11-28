# Review findings: tin-rao-giu-gia-tri-rieng (round 1)

## Trong hợp đồng

- **«Gắn sang căn khác» misses open listings that sit on a matched pending unit, so a catalog unit can end up with two open listings**
  file: `src/modules/listings/listings-http.ts:171`
  severity: medium
  AC: AC-10
  source: bugs
  detail: moveUnit decides whether the target unit is taken with one query: `select 1 from listing_units where upi = $1 and open and listing_id <> $2`. Row 11 lets an open listing sit on a company pending unit (listing_pending_units) that was later matched to a catalog unit (company_pending_units.unit_key). The import's own check counts those listings against the catalog unit. See store.ts context(): "A pending unit matched to the catalog since keeps its open listings on the pending link: they count for its catalog unit too, so the unit never gets a second open listing (Listing rule one-open-listing; S4-r2 t4)". moveUnit does not do this. The database does not catch it either: the unique index listing_units_one_open only covers listing_units, and the listing_one_unit_link trigger only blocks a listing that has both kinds of link. So a PATCH {field:'unit', upi} can point a listing at a catalog unit that already has an open listing through a matched pending unit. That breaks Listing rule one-open-listing-per-unit. Fix: also look in listing_pending_units joined to company_pending_units where cpu.unit_key equals the target unit's unit_key and p.open.
  rationale: AC-10 requires that a target unit already holding an open listing be rejected with no change; this finding shows a case where it is not rejected.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SP-1 / AGENTS invariant 1: writes to company tables bypass withCompany and row security (owner connection)**
  Người dùng thấy gì: Lệnh chạy một lần để đọc lại các lần nhập cũ ghi vào tin của mọi sàn bằng quyền chủ cơ sở dữ liệu, không qua cửa cách ly từng sàn. Hôm nay không có dữ liệu nào lẫn giữa các sàn, nhưng việc giữ cách ly dựa vào mã chứ chưa phải cơ sở dữ liệu.
  Căn cứ: Chỉ là lệnh chạy một lần do người vận hành bấm, không lộ dữ liệu cho người dùng nào; nhưng đây là điều giới hạn cứng nên cần người ký nhìn thấy và nhận.
  file: `db/scripts/doc-lai-tep.ts`
  severity: high
  Đề xuất: known-limits

- **Records: PR 'Người cần quyết' does not list the SP-1 marker hit**
  Người dùng thấy gì: Bản mô tả thay đổi chưa nêu việc lệnh đọc lại dùng quyền chủ cơ sở dữ liệu, nên người ký có thể không biết để cân nhắc.
  Căn cứ: Người dùng cuối không thấy gì khác đi; chỉ cần một dòng ghi chú vào mô tả khi ký, sửa rất rẻ và không mất dữ liệu.
  file: `src/modules/imports/reread.ts`
  severity: medium
  Đề xuất: wont-fix

- **Domain: new database door listing_units update (upi) is not declared in ontology/actions.yaml**
  Người dùng thấy gì: Bảng khai quyền chưa ghi việc đổi liên kết căn của tin, nên bảng quyền theo vai có thể thiếu một dòng. Người dùng không thấy khác biệt trên màn.
  Căn cứ: Chỉ là khai báo thiếu, không làm lộ hay mất dữ liệu và không đổi cách dùng; bổ sung sau rất rẻ.
  file: `ontology/actions.yaml`
  severity: low
  Đề xuất: known-limits

- **Convention: migration numbers reused (015, 020) against /new-migration 'highest number plus one'**
  Người dùng thấy gì: Hai cặp tệp cập nhật cơ sở dữ liệu dùng chung số thứ tự, thứ tự chạy dựa vào tên. Người dùng không nhận ra gì nếu mọi thứ chạy đúng thứ tự.
  Căn cứ: Không ảnh hưởng người dùng và có tiền lệ trong quyết định cũ; chỉ cần ghi vết ngoại lệ.
  file: `db/migrations/015_vai_danh_tinh_tam_quyen_tao.sql`
  severity: low
  Đề xuất: wont-fix

- **Evidence: CI not green on the reviewed commit**
  Người dùng thấy gì: Một bước kiểm tra tự động của bản này đang đỏ và vài bước chưa xong, nên chưa thể coi kết quả kiểm thử là đã qua.
  Căn cứ: Đỏ này đã được báo trước và sẽ hết sau vòng chấm; không đụng tới dữ liệu người dùng, và người gộp sẽ thấy trước khi gộp.
  file: `.github/workflows/deploy.yml`
  severity: low
  Đề xuất: known-limits

- **A living area of 0 from a file shows as a kept value in the preview, then is dropped without notice on write**
  Người dùng thấy gì: Nếu tệp nhập ghi diện tích là 0, bản xem trước báo sẽ giữ giá trị ấy nhưng khi ghi thì bỏ đi âm thầm, tin không có diện tích riêng.
  Căn cứ: Hiếm gặp, chỉ mất một ô vốn vô nghĩa và người dùng gõ lại được; nhưng lời hứa ở bước xem trước lệch với kết quả.
  file: `src/modules/imports/mark.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (presence of a string where the promise is a relation), with shape 1: the markValue sweep greps the source for the token `choice:` instead of checking that the person's choice is passed**
  Người dùng thấy gì: Một bài kiểm tra chỉ dò xem chữ có mặt trong mã chứ chưa chứng minh lựa chọn của người dùng được truyền đi, nên có thể bỏ sót một lỗi sau này.
  Căn cứ: Không ảnh hưởng người dùng hôm nay; chỉ làm lưới an toàn lỏng hơn tên bài hứa, bổ sung sau không đắt.
  file: `tests/nhap-excel-noi-ghi.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 / shape 4: the «Khớp» column of the rebuilt carried blocks compares the new block with itself and can never show «KHÔNG»**
  Người dùng thấy gì: Bảng bằng chứng của một việc khác báo «khớp» luôn là «có», nên chủ kho có thể tin vào một phép so sánh chưa từng được làm.
  Căn cứ: Chỉ là tài liệu bằng chứng của việc khác, không chạm người dùng cuối; đáng ghi vết nhưng không đáng mở việc.
  file: `_acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs`
  severity: medium
  Đề xuất: wont-fix

- **Shape 3: the E1 surface test claims ⌘K and the place tree are built from the listing's own value, but asserts only that they are non-empty**
  Người dùng thấy gì: Bài kiểm tra nói rằng ô tìm nhanh và cây địa lý đọc giá trị riêng của sàn, nhưng chỉ kiểm tra là có kết quả, nên nếu chúng đọc nhầm danh mục thì không bị bắt.
  Căn cứ: Hai chỗ này không hiện thuộc tính căn nên rủi ro cho người dùng thấp; chỉ là lưới kiểm tra lỏng.
  file: `tests/tin-rao-gia-tri-rieng.test.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 4/10 lỗi rơi vào file không bộ đo nào phủ (db/scripts/doc-lai-tep.ts, .github/workflows/deploy.yml, tests/nhap-excel-noi-ghi.test.ts, _acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
