---
schema_version: 1
feature: Mỗi sàn chỉ đọc và ghi được dữ liệu của mình, mọi truy vấn đi qua một cửa
slug: cach-ly-moi-san
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: docs/superpowers/specs/2026-11-11-cach-ly-moi-san-design.md
---

# Acceptance Contract: cach-ly-moi-san

## Context

Kho mới chưa có cơ sở dữ liệu. Hàng 7 dựng nền cách ly mà mọi hàng dữ liệu thật về sau đứng lên: lược đồ nền chép
nguyên văn từ Quỹ hàng (sàn, thoả thuận, vai không sở hữu bảng, luật theo dòng), một cửa truy vấn duy nhất
`withCompany`, và bộ kiểm cách ly chạy trên Postgres của dãy dưới vai không sở hữu bảng. Luật chạm: SP-1.

Source input: hàng 7 của `docs/plan/lo-trinh.json` (mã N1), ô cơ hội `_acceptance/cach-ly-moi-san/opportunity.md`
đã quyết «build» bởi Manh Phan.

## Criteria

- AC-1: Given một cơ sở dữ liệu Postgres trống, When áp migration của kho hai lần liên tiếp, Then lần một áp
  `001_nen_cong_ty.sql` và ghi nó vào sổ migration, lần hai không áp tệp nào và không lỗi.
- AC-2: Given hai sàn A, B cùng thoả thuận của mỗi bên, mà vai chủ đếm thấy đủ trong cùng giao dịch, When một truy vấn
  chạy dưới vai của API mà chưa đặt sàn, đặt sàn là chuỗi rỗng, hoặc chạy trên kết nối mà giao dịch trước đã đặt sàn A,
  Then nó không thấy dòng nào ở bảng sàn lẫn bảng thoả thuận và không lỗi.
- AC-3: Given hai sàn A, B, B có một thoả thuận riêng và một thoả thuận hợp tác mở với A, When truy vấn chạy dưới vai
  của API với sàn A, Then nó chỉ thấy sàn A ở bảng sàn, thấy thoả thuận của A và thoả thuận hợp tác B mở với A, không
  thấy thoả thuận riêng của B.
- AC-4: Given truy vấn chạy dưới vai của API với sàn A, When nó thêm một thoả thuận đứng tên B, sửa một thoả thuận của
  B, hoặc chuyển thoả thuận của A sang tên B, Then cơ sở dữ liệu từ chối việc thêm và việc chuyển, còn việc sửa không
  chạm dòng nào; thoả thuận của B giữ nguyên.
- AC-5: Given truy vấn chạy dưới vai của API với sàn A, When nó tạo một sàn mới, sửa tên sàn A, hay xoá một thoả thuận
  của chính A, Then cơ sở dữ liệu từ chối vì vai không có quyền đó.
- AC-6: Given cơ sở dữ liệu đã áp migration, When bộ kiểm quét danh mục — mọi bảng ở schema `public` có cột
  `company_id`, cộng bảng sàn — Then mỗi bảng bật và ép luật theo dòng, có luật đọc, mọi luật của nó lọc theo sàn
  (gọi tới sàn của phiên và nhắc cột sàn, không luật nào mở cho mọi dòng), luật thêm và sửa có điều kiện kiểm; và vai
  của API không sở hữu bảng nào, không là siêu người dùng, không được vượt luật theo dòng.
- AC-7: Given cửa `withCompany` với một bể kết nối, When mã nghiệp vụ gọi nó với một người và một sàn, Then mọi câu
  chạy trong một giao dịch đã chuyển sang vai của API và đặt người, sàn chỉ cho giao dịch đó; việc thành công thì
  giao dịch được ghi, việc lỗi thì giao dịch bị huỷ và lỗi được ném lại; kết nối luôn được trả về bể; và bộ kiểm cách
  ly dùng nguyên văn hai câu đổi vai, đặt sàn của cửa.
- AC-8: Given mã nguồn trong `src/`, When bộ quét một cửa chạy, Then không dòng nào mở kết nối hay chạy câu thẳng trên
  bể ngoài tập miễn (tệp cửa và tệp bài kiểm quét); trên thư mục mẫu, tệp lành không bị tính, tệp hỏng bị gọi đúng tên
  và số dòng, và một tệp ngoài tập miễn mang nội dung của tệp bài kiểm thì bị báo.
- AC-9: Given bốn bản cơ sở dữ liệu nháp, mỗi bản phá một chỗ — gỡ ép luật theo dòng của bảng thoả thuận, luật thêm
  của nó không kiểm sàn, luật đọc của nó mở cho mọi dòng, và một bảng công ty mới có luật mở — When bộ kiểm cách ly
  chạy trên từng bản, Then nó báo đỏ và thông điệp gọi đúng ca và tên bảng bị phá.

## Coverage

Quét không gian bằng morphological-scan (preset test-matrix), bốn trục:

- Trục bảng: bảng sàn | bảng thoả thuận | bảng công ty thêm về sau [thước CE: danh mục `pg_class` có cột `company_id`]
  → AC-2..AC-5 cho hai bảng có thật, AC-6 cho mọi bảng kể cả bảng sau này.
- Trục sàn của truy vấn: chưa đặt | chuỗi rỗng | kết nối đã dùng | sàn của mình | sàn khác | sàn đối tác qua thoả
  thuận hợp tác → AC-2, AC-3, AC-4.
- Trục hỏng của luật: không ép | luật thêm mở | luật đọc mở | bảng mới luật mở → AC-9.
- Trục thao tác: đọc | thêm | sửa | chuyển sàn | xoá | tạo sàn → AC-3, AC-4, AC-5.
- Trục lớp giữ luật: lược đồ (luật theo dòng, quyền vai) | cửa thời chạy | mã nguồn | bộ kiểm tự đỏ được →
  AC-6, AC-7, AC-8, AC-9. [CE chưa kiểm chứng] cửa thời chạy chỉ đo bằng bể giả — xem Notes.
- Ô bỏ có tên: xoá dòng của sàn khác (vai không có quyền xoá — rơi vào AC-5), ca thời chạy trên Postgres thật của cửa
  (Out of scope, entry descope trong sổ).

## Đường đo

- Thước: bộ kiểm cách ly chạy dưới vai không sở hữu bảng, mọi bảng công ty chặn đọc và ghi chéo sàn · số từ: dòng tổng
  `cach-ly: 19 ca đạt, vai quy_hang_app` của `bash db/scripts/cach-ly.sh` trên Postgres của dãy · bảo đảm bởi: AC-2,
  AC-3, AC-4, AC-6, AC-9

## Out of scope

- Thêm gói `pg` và ca thời chạy của `withCompany` trên Postgres thật — hàng nối dữ liệu thật đầu tiên làm.
- Chạy bộ kiểm cách ly trên CI — cần job có Postgres ở `.github/workflows/`, việc của người.
- Bảng người dùng, thành viên, vai trong sàn, đăng nhập (hàng 8, 9).
- Đường `/api/v1` nào dùng cửa; mô-đun khác phụ thuộc identity.
- Sửa nội dung `001_nen_cong_ty.sql` — tệp chép nguyên văn, đổi gì là một migration mới.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Luật chạm: SP-1 (khó đảo). Các chỗ chạm dấu hiệu SP-1 có chủ đích: `src/modules/identity/with-company.ts`
  (`pool.connect(` — chính cái cửa); `src/modules/identity/one-door.test.ts` (`Pool.query(`, `new Pool(` — chuỗi dựng
  thư mục mẫu của bộ quét); `db/tests/pha-thu/*.sql` (`no force row level security` — bản phá thử của AC-9).
- Nguồn chép: `onehub-quy-hang` commit `1729b11f8dc57d0ebe3d8e380cdf8635705aceb8` —
  `packages/db/migrations/001_nen_cong_ty.sql` (nguyên văn), `packages/api/src/db.ts` (cửa),
  `packages/api/src/one-door.test.ts` (bộ quét), `packages/db/tests/isolation.test.mjs` (các ca đọc, ghi chéo sàn),
  `packages/db/scripts/migrate.mjs` (luật áp migration).
- Bộ kiểm chạy trên container `onehub-inventory-db-n` (`make db-up DB_LANE=n DB_PORT=5563`).
- Known limits — chọn ở Cổng Bằng chứng 2026-11-11:
  - Ngoài-2: Các ghi chú trong tệp nền chỉ người viết mã về sau sang chỉ dẫn nhầm nơi, người dùng cuối không bị ảnh hưởng gì.
  - Ngoài-3: Bộ kiểm cách ly giữa các sàn chưa tự chạy mỗi lần gộp mã, nên một thay đổi làm hở dữ liệu giữa các sàn có thể lọt nếu không ai chạy tay.
  - Ngoài-7: Bộ kiểm tự đỏ chưa thử hết các kiểu phá luật, nên một lỗi trong chính bộ kiểm có thể không bị phát hiện.
  - Ngoài-10: Mã nghiệp vụ viết sai hoặc cố ý có thể tự thoát khỏi vai hạn chế và nhìn thấy dữ liệu của sàn khác. Hiện chưa có mã nào làm vậy, nhưng nền chưa chặn được.
  - Ngoài-11: Khi một lần huỷ giao dịch cũng lỗi, kết nối nửa chừng có thể quay lại bể và một yêu cầu sau dùng nhầm trạng thái của sàn trước. Trường hợp này hiếm.
  - Ngoài-12: Sàn đối tác đọc được cả dòng thoả thuận của sàn kia, gồm tên người duyệt và điều khoản riêng, dù mô hình nghiệp vụ chưa mô tả quyền này.
  - Ngoài-13: Về sau một thay đổi chỉ chạm cửa truy vấn hoặc bộ kiểm cách ly có thể được gộp mà không cần chủ kho duyệt, làm yếu luật cách ly giữa các sàn.
  - Ngoài-15: Hồ sơ nghiệm thu mô tả sai cách giữ luật cách ly và xếp nhầm một việc đã làm vào mục không làm, người duyệt có thể hiểu sai.
  - Ngoài-16: Một vài dạng luật mở quá rộng chưa có ca thử chứng minh bộ kiểm sẽ báo đỏ, nên chưa chắc chặn được.
  - Ngoài-17: Một bản phá thử thêm sau có thể quên đăng ký mà không ai biết, nên bộ kiểm có thể báo đạt dù thực ra chưa được thử.
  - Ngoài-18: Mã nghiệp vụ viết sau này về lý thuyết có thể tự đổi sàn hoặc thoát khỏi lớp cách ly giữa chừng, và hiện chưa có lưới nào bắt việc đó. Hiện chưa có đường truy vấn thật nên chưa ai bị ảnh hưởng.
  - Ngoài-21: Mô hình dữ liệu thoả thuận trong cơ sở dữ liệu còn lệch với mô tả nghiệp vụ và một quyết định cũ, nên người đọc sau có thể hiểu sai quy tắc.
  - Ngoài-22: Một người viết mã sau này có thể mở kết nối ngoài cửa bằng cách đặt tên khác mà bộ quét không phát hiện, làm mất lớp bảo vệ cách ly ở mã nguồn.
  - Ngoài-23: Module khác về lý thuyết có thể tự dựng một cửa thứ hai thay vì dùng cửa chung, làm luật cách ly nằm ở hai nơi.
  - Ngoài-24: Người viết bảng mới sau này có thể đi tìm bộ kiểm ở chỗ không tồn tại trong kho này.
  - Ngoài-25: Một số tên tệp và hàm kiểm dùng tiếng Việt trái quy ước đặt tên tiếng Anh của kho, nhưng người dùng cuối không thấy gì.
  - Ngoài-26: Thẻ duyệt hiện việc chặn mã mở kết nối ngoài cửa dưới mục không làm, người duyệt có thể tưởng nó bị cắt.
  - Ngoài-28: Trong tình huống hiếm khi việc huỷ giao dịch cũng lỗi, một kết nối nửa chừng có thể bị dùng lại cho yêu cầu của sàn khác.
  - Ngoài-29: Bản phá thử có thể báo đỏ vì một lý do không liên quan mà vẫn được tính là đã bắt đúng lỗi, nên độ tin cậy của lưới kiểm kém hơn vẻ ngoài.
  - Ngoài-31: Nếu bộ quét bỏ sót một bảng công ty, bộ kiểm vẫn xanh mà không ai nhận ra số bảng bị thiếu.
  - Ngoài-32: Một số kiểu mở kết nối trái phép chưa có ví dụ chứng minh bộ quét bắt được, nên lưới có thể có lỗ chưa ai thử.
  - Ngoài-33: Cửa truy vấn chưa từng được chạy thật trên cơ sở dữ liệu thật, nên hành vi thật của nó chưa được xác nhận.
