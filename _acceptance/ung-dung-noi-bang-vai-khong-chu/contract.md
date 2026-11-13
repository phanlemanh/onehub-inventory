---
schema_version: 1
feature: Ứng dụng nối cơ sở dữ liệu bằng một vai đăng nhập không phải chủ bảng, chỉ là thành viên của vai API, để mã trong cửa có đổi vai cũng không về được vai chủ
slug: ung-dung-noi-bang-vai-khong-chu
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/ung-dung-noi-bang-vai-khong-chu/design.md
---

# Acceptance Contract: ung-dung-noi-bang-vai-khong-chu

## Context

Ứng dụng hôm nay nối bằng vai chủ bảng; cửa `withCompany` chỉ đổi sang vai API trong từng giao dịch, nên mã trong cửa
chạy `reset role` hay `set role <chủ>` là về lại vai chủ và đọc ghi được mọi sàn. Hàng 7a chỉ chặn câu viết thẳng
(Ngoài-5 của hàng 7, «đóng một phần»). Hàng này đóng tận gốc: ứng dụng nối bằng vai đăng nhập `quy_hang_login` — không
sở hữu gì, chỉ là thành viên của `quy_hang_app`, đổi sang được nhưng không kế thừa — và cửa từ chối chạy trên vai nối nào
về được vai chủ. Luật chạm: SP-1 (chỉ siết). Phải xong trước hàng 10.

Source input: hàng 7c của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/ung-dung-noi-bang-vai-khong-chu/opportunity.md`
đã quyết «build» bởi Manh Phan; dòng `d-20261112T020920Z-10` trong `_acceptance/cach-ly-truoc-du-lieu-that/decisions.jsonl`.

## Criteria

- AC-1: Given cơ sở dữ liệu nháp đã áp mọi migration (lần hai không áp gì), When bộ kiểm cách ly đọc danh mục hệ thống
  về vai `quy_hang_login`, Then vai đăng nhập được; không siêu người dùng, không tạo vai, không tạo cơ sở dữ liệu, không
  nhân bản, không vượt luật theo dòng; không sở hữu bảng, dạng xem, hàm hay schema nào ở schema không phải hệ thống; không
  có quyền thẳng trên bảng hay hàm nào; quyền hiệu lực của nó (tính cả quyền cấp cho mọi người và quyền mặc định của hàm)
  không gồm bảng nào và chỉ gồm những hàm `quy_hang_app` cũng chạy được (tập đã được các ca của hàng 7a duyệt); tập vai nó là thành viên (trực tiếp hay gián tiếp) đúng bằng {`quy_hang_login`,
  `quy_hang_app`}, lời cấp `quy_hang_app` có đổi-sang, không kế thừa, không quản — và bộ chạy in đúng một lần
  `ok vai-dang-nhap-khong-ve-chu`.
- AC-2 (cross-layer): Given kết nối ĐĂNG NHẬP BẰNG `quy_hang_login` vào cơ sở nháp ấy, When phiên thử `set role` sang vai
  chủ bảng `companies` (đọc từ danh mục), `set role quy_hang_identity`, `set session authorization` sang vai chủ, và sau
  `set local role quy_hang_app` thì `reset role` rồi đọc `companies` và `agreements`, Then ba lệnh đổi vai bị từ chối với
  lỗi thiếu quyền, sau `reset role` vai hiện hành là `quy_hang_login` và cả hai lệnh đọc bị từ chối — bộ chạy in đúng một
  lần `ok dang-nhap-khong-ve-vai-chu`.
- AC-3: Given cùng cơ sở nháp có sàn A và sàn B mỗi sàn một thoả thuận (ghi bằng vai chủ), When kết nối đăng nhập bằng
  `quy_hang_login` chạy đúng hai câu của cửa (`SET_ROLE_SQL`, `SET_CONTEXT_SQL` với sàn A) rồi đếm thoả thuận, Then đếm
  được đúng 1 và đó là thoả thuận của A — bộ chạy in `ok dang-nhap-qua-cua-doc-duoc` (đối chứng dương của AC-2).
- AC-4: Given bảy bản phá, mỗi bản chạy trong một giao dịch rút lại cùng ca danh mục — cấp vai chủ cho
  `quy_hang_login`; cấp `quy_hang_identity`; đổi lời cấp `quy_hang_app` sang kế thừa; cho `quy_hang_login` sở hữu bảng
  `agreements`; cho nó vượt luật theo dòng; cấp thẳng quyền đọc `agreements`; cấp riêng cho nó quyền chạy một hàm chạy
  bằng quyền chủ — When bộ chạy chạy ca phá
  `pha-thu-vai-dang-nhap`, Then mỗi bản đỏ với dòng ghim nêu đúng lý do (bảng ghim ở evals), và sau bảy bản ca danh mục
  chạy lại vẫn `ok` (không dấu phá nào ở lại trên cụm); bộ chạy in `ok pha-thu-vai-dang-nhap`.
- AC-5: Given bản lành, When chạy bộ chạy cách ly, Then dòng cuối là `cach-ly: <n> ca đạt, vai quy_hang_app, nối bằng
  quy_hang_login` với `<n>` = số ca của bộ chạy trên cây đã gộp nhánh chính (31 hôm nay + 4 của hàng này, cộng ca của hàng
  2c khi nó gộp trước); mọi tên ca và dòng ghim của bộ chạy ở nhánh chính trước hàng này còn nguyên từng chữ; và trên bản
  sao thư mục kiểm mà tệp phá `cap-vai-chu` bị thay bằng `select 1;`, bộ chạy thoát khác 0 và in đúng
  `HỎNG pha-thu-vai-dang-nhap: cap-vai-chu: bộ kiểm vẫn xanh trên bản phá`.
- AC-6 (cross-layer): Given pool của cửa nối bằng một vai về được vai chủ — vai chủ `postgres`; một vai đăng nhập tạm là
  thành viên của `quy_hang_app` và của vai chủ; một vai đăng nhập tạm là thành viên của `quy_hang_app` và
  `quy_hang_identity` — When gọi `withCompany` lần đầu, Then lời gọi ném lỗi mở đầu `cửa từ chối vai nối` nêu tên vai và
  lý do (`về được vai chủ <vai>` hoặc `vượt được luật theo dòng qua <vai>`), hàm truyền vào không chạy câu nào, và không
  dòng nào của bất kỳ sàn nào được đọc hay ghi; cùng lời gọi trên pool nối bằng `quy_hang_login` chạy và đọc đúng dữ liệu
  sàn của mình.
- AC-7 (cross-layer): Given pool của cửa nối bằng `quy_hang_login` và hai sàn A, B mỗi sàn một thoả thuận, When mã chạy
  trong `withCompany` (phiên sàn A) gọi `reset role` rồi đọc `agreements`, hoặc `set role` sang vai chủ, hoặc
  `set session authorization` sang vai chủ, Then mỗi lệnh bị từ chối với lỗi thiếu quyền, giao dịch rút lại, và vai chủ
  đếm thoả thuận của A và B không đổi (mỗi sàn vẫn 1).
- AC-8: Given cây sau hàng này trên Postgres của dãy C, When chạy mọi bài cơ sở dữ liệu (`tests/db/*.db.test.ts`) trong
  một lệnh không bộ lọc bỏ ca và mọi bài trình duyệt có cơ sở dữ liệu (`playwright.db.config.ts`), Then cả hai thoát 0;
  pool sản phẩm của mọi bài và `DATABASE_URL` của máy chủ dev trong bài trình duyệt nối bằng `quy_hang_login`; và bài quét
  nguồn kiểm báo đỏ đúng tệp khi một bản sao đưa chuỗi nối vai chủ (`db.url`, `DB_URL`) cho `createPool` hay
  `DATABASE_URL`.
- AC-9: Given `.env.example` của nhánh chính, When so với cây sau hàng này, Then mọi dòng cũ còn nguyên, có thêm dòng chuỗi
  nối mẫu bằng `quy_hang_login` và dòng `PSQL_LOGIN` cho bộ kiểm cách ly khi `PSQL` đặt; và `make check` xanh.

## Coverage

Quét theo khuôn rủi ro (skill `morphological-scan`, preset risk-premortem; chân ngành: tài liệu PostgreSQL 16 mục «Role
Membership» và «SET ROLE» `[NGÀNH: PostgreSQL 16 docs]`; chân sản phẩm: `src/modules/identity/with-company.ts`,
`db/migrations/001_nen_cong_ty.sql`, `db/migrations/002_dang_nhap_ma_email.sql` `[SUY-TỪ-REPO]`).

| Trục | Ô | AC |
|---|---|---|
| Lối đổi vai trong phiên | `reset role` · `set role <chủ>` · `set role quy_hang_identity` · `set session authorization` | AC-2, AC-7 |
| Thuộc tính của vai đăng nhập | siêu người dùng · tạo vai/cơ sở dữ liệu · nhân bản · vượt luật theo dòng · kế thừa · sở hữu · quyền thẳng | AC-1, AC-4 |
| Lớp đo | danh mục hệ thống · phiên đăng nhập thật · cửa của ứng dụng | AC-1/AC-4 · AC-2/AC-3 · AC-6/AC-7 |
| Chỗ chạy | bộ kiểm cách ly · bài cơ sở dữ liệu · bài trình duyệt có cơ sở dữ liệu · máy chủ thật | AC-1–5 · AC-6–8 · AC-8 · AC-6 (cửa từ chối) |
| Đối chứng | phiên đi đúng cửa đọc đúng sàn · pool đúng vai chạy | AC-3, AC-6 |

Later: xoay mật khẩu vai đăng nhập, giới hạn số kết nối của vai (vận hành, hàng 10). Never: vai riêng cho từng sàn —
luật theo dòng đã cách ly, nhân vai theo sàn ngoài ý định. `[CE chưa kiểm chứng]` lối `set role` qua hàm
`security definer`: Postgres cấm `SET ROLE` trong hàm ấy; không có ca riêng.

## Đường đo

| Thước của ô cơ hội | Số từ đâu | AC bảo đảm |
|---|---|---|
| Chuỗi nối của ứng dụng dùng vai đăng nhập riêng không sở hữu bảng nào | ca `vai-dang-nhap-khong-ve-chu`; cửa từ chối chuỗi nối vai chủ; bài quét chuỗi nối của bài kiểm | AC-1, AC-6, AC-8 |
| Từ vai ấy lệnh đổi về vai chủ bị từ chối | ca `dang-nhap-khong-ve-vai-chu`; bài cửa đổi vai | AC-2, AC-7 |
| Bộ kiểm cách ly và mọi bài cơ sở dữ liệu chạy dưới vai ấy vẫn xanh | dòng cuối của bộ chạy; lệnh `tests/db` và bài trình duyệt có cơ sở dữ liệu | AC-3, AC-5, AC-8 |
| Ca phá cấp lại quyền chủ thì đỏ | `ok pha-thu-vai-dang-nhap` với bảy dòng ghim | AC-4 |

## Out of scope

- Đặt mật khẩu và đổi `DATABASE_URL` trên cơ sở dữ liệu thật — việc ngoài kho của chủ kho ở hàng 10.
- Chạy bộ kiểm cách ly và bài cơ sở dữ liệu trên CI — hàng 1s (hàng này chỉ thêm dòng `.env.example` cho nó).
- Viết lại 20 ca SQL cũ của bộ kiểm cách ly để chạy hẳn trên kết nối vai đăng nhập — đo bằng ca phiên thật mới.
- Vai riêng cho từng sàn.

## Notes

- Chưa có bản thật nào nối được cơ sở dữ liệu (quyết định 0010: kho chưa có bí mật của bản thật, triển khai chưa bật).
  Khi chuyển bản thật (hàng 10), đặt mật khẩu `quy_hang_login` và đổi `DATABASE_URL` TRƯỚC lần triển khai đầu có cửa này:
  cửa từ chối chuỗi nối vai chủ.
- Vai và lời cấp vai dùng chung cả cụm Postgres: migration 008 chỉ tạo vai khi chưa có và không bao giờ đụng mật khẩu;
  bộ trợ giúp bài kiểm thử nối bằng vai đăng nhập trước và chỉ đặt mật khẩu khi chưa nối được, thử lại khi Postgres báo
  sửa đồng thời.

- Migration 008 (số giám sát cấp). Không sửa migration đã gộp.
- Hàng 2c (dãy K) gộp trước và sửa `db/tests/cach-ly.sql`, `db/scripts/cach-ly.sh`: trước lượt chấm gộp nhánh chính có
  2c, giữ cả hai bên, tính lại số ca ở AC-5 trên cây đã gộp.
