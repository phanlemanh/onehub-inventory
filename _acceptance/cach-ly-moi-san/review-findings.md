# Review findings: cach-ly-moi-san (round 3)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Domain: the agreements table disagrees with ontology/entities/Agreement.yaml**
  Người dùng thấy gì: Một số loại thoả thuận hợp lệ theo mô hình nghiệp vụ sẽ bị cơ sở dữ liệu từ chối khi lưu, và mô hình chưa ghi hai luật mà cơ sở dữ liệu đang áp.
  Căn cứ: Chưa có tính năng nào lưu các loại thoả thuận đó nên chưa ai gặp lỗi, nhưng sẽ vướng ngay khi nối dữ liệu thật và sửa về sau phải qua một đợt riêng có người duyệt.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: high
  Đề xuất: new-contract

- **Migration comments point to files and an ADR that do not exist in this repo (the migration is permanent once merged)**
  Người dùng thấy gì: Các ghi chú trong tệp nền chỉ người viết mã về sau sang chỉ dẫn nhầm nơi, người dùng cuối không bị ảnh hưởng gì.
  Căn cứ: Chỉ là ghi chú sai chỗ, không làm mất hay lộ dữ liệu, và có thể bù bằng một ghi chú đúng ở nơi khác thay vì sửa tệp đã chốt.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: medium
  Đề xuất: known-limits

- **SP-1: the isolation suite is not run by make check or CI**
  Người dùng thấy gì: Bộ kiểm cách ly giữa các sàn chưa tự chạy mỗi lần gộp mã, nên một thay đổi làm hở dữ liệu giữa các sàn có thể lọt nếu không ai chạy tay.
  Căn cứ: Rủi ro lộ dữ liệu giữa sàn là nặng nhưng chỉ xảy ra khi có thay đổi lược đồ mới, và việc thêm bước tự chạy đã được ghi là việc của chủ kho.
  file: `db/scripts/cach-ly.sh`
  severity: medium
  Đề xuất: known-limits

- **SP-1: the isolation suite misses views, SECURITY DEFINER functions and TRUNCATE grants**
  Người dùng thấy gì: Bộ kiểm hiện không bắt được ba kiểu thay đổi về sau có thể làm một sàn đọc hoặc xoá dữ liệu của sàn khác mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hậu quả nếu xảy ra là lộ hoặc mất dữ liệu nhiều sàn, nhưng hiện chưa có view hay hàm nào như vậy và thêm ca kiểm sau này rẻ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **One door: code inside withCompany can switch company or role, and the scan does not catch it**
  Người dùng thấy gì: Mã nghiệp vụ viết sai về sau có thể tự đổi sang sàn khác ngay trong cửa truy vấn mà bộ quét không phát hiện.
  Căn cứ: Cần người viết mã cố ý hoặc vô ý làm vậy nên khả năng thấp, nhưng nếu xảy ra thì lộ dữ liệu giữa sàn; thêm luật quét về sau khá rẻ.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: new-contract

- **The isolation suite never checks TRUNCATE (or other table privileges), and Postgres row security does not apply to TRUNCATE**
  Người dùng thấy gì: Nếu một thay đổi về sau cấp quyền xoá sạch bảng cho vai của API, một sàn có thể xoá dữ liệu của mọi sàn và bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả là mất dữ liệu của tất cả các sàn nên nặng, nhưng hiện chưa có quyền đó được cấp và thêm một ca kiểm là việc nhỏ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Hinh dang 5 (tuyen quet LOP nhung chi co diem-case): ma tran lenh x dang cua danh sach cho phep thieu o UPDATE va o ngoai le doc sai bang/sai ten**
  Người dùng thấy gì: Bộ kiểm tự đỏ chưa thử hết các kiểu phá luật, nên một lỗi trong chính bộ kiểm có thể không bị phát hiện.
  Căn cứ: Bộ kiểm vẫn bắt đúng bốn kiểu phá đã cam kết và không có dữ liệu nào bị ảnh hưởng, nên chấp nhận và bổ sung dần khi có ca thật.
  file: `db/scripts/cach-ly.sh`
  severity: medium
  Đề xuất: known-limits

- **Hinh dang 5 (tuyen 'moi loai tep nguon' nhung chi co diem-case): ca nap driver phu 5/8 duoi tep va 4/6 driver**
  Người dùng thấy gì: Bài kiểm của bộ quét một cửa chưa thử đủ mọi loại tệp và mọi thư viện kết nối, nên nếu ai làm hỏng một phần bộ quét thì có thể không bị phát hiện ngay.
  Căn cứ: Rủi ro chỉ nằm ở việc bộ quét suy yếu âm thầm, không đụng dữ liệu người dùng, và bổ sung sau rất rẻ nếu cần.
  file: `src/modules/identity/one-door.test.ts`
  severity: medium
  Đề xuất: wont-fix

- **Hinh dang 2 (fixture khong lay tu writer that): ca Prettier goi format() voi tuy chon mac dinh thay vi cau hinh cua repo**
  Người dùng thấy gì: Một bài kiểm dùng cấu hình định dạng mặc định thay vì cấu hình thật của dự án, người dùng cuối không bị ảnh hưởng gì.
  Căn cứ: Chỉ là độ chính xác của một ca thử, ví dụ hiện tại vẫn cho kết quả đúng, và không có hậu quả với dữ liệu hay người dùng.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Authorization/isolation (SP-1): cửa withCompany giao client thô, việc bên trong tự thoát được vai không sở hữu bảng (r2)**
  Người dùng thấy gì: Mã nghiệp vụ viết sai hoặc cố ý có thể tự thoát khỏi vai hạn chế và nhìn thấy dữ liệu của sàn khác. Hiện chưa có mã nào làm vậy, nhưng nền chưa chặn được.
  Căn cứ: Chỉ xảy ra khi có người viết mã cố tình vòng qua cửa, hiện chưa có mã nghiệp vụ nào, và sửa sau vẫn rẻ khi cửa được dùng thật.
  file: `src/modules/identity/with-company.ts`
  severity: medium
  Đề xuất: known-limits

- **Authorization/isolation (SP-1): rollback lỗi thì kết nối vẫn được trả về bể như kết nối lành (r2)**
  Người dùng thấy gì: Khi một lần huỷ giao dịch cũng lỗi, kết nối nửa chừng có thể quay lại bể và một yêu cầu sau dùng nhầm trạng thái của sàn trước. Trường hợp này hiếm.
  Căn cứ: Hiếm gặp, chỉ khi kết nối đã hỏng, người dùng tự khắc phục được bằng thử lại, và sửa sau không tốn kém.
  file: `src/modules/identity/with-company.ts`
  severity: low
  Đề xuất: known-limits

- **Domain (AGENTS: rule/relation phải có trong ontology) và quyết định 0014: migration mở đường đọc chéo sàn qua thoả thuận hợp tác mà ontology và MVP không có (r2)**
  Người dùng thấy gì: Sàn đối tác đọc được cả dòng thoả thuận của sàn kia, gồm tên người duyệt và điều khoản riêng, dù mô hình nghiệp vụ chưa mô tả quyền này.
  Căn cứ: Quyền đọc này chỉ áp cho thoả thuận hợp tác mà MVP chưa dùng, nên chưa có dữ liệu thật bị lộ, và đóng lại sau bằng một bước nâng cấp mới là đủ.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: medium
  Đề xuất: known-limits

- **Tier (governance/autonomy.yaml): cửa và lưới của SP-1 nằm ở đường mức thấp hoặc trung bình (r2 · tệp đã đổi)**
  Người dùng thấy gì: Về sau một thay đổi chỉ chạm cửa truy vấn hoặc bộ kiểm cách ly có thể được gộp mà không cần chủ kho duyệt, làm yếu luật cách ly giữa các sàn.
  Căn cứ: Đợt này vẫn cần chủ kho duyệt nên chưa mất gì; rủi ro chỉ về sau và chủ kho tự thêm đường vào mức cao là xong.
  file: `src/modules/identity/one-door.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-6: ca quét danh mục bỏ sót view, hàm SECURITY DEFINER và schema khác, trong khi chủ bảng là superuser (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này có người thêm một dạng xem hoặc hàm đặc quyền, nó có thể trả dữ liệu của mọi sàn mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hiện chưa có dạng xem hay hàm nào như vậy nên chưa lộ gì, nhưng nếu xảy ra thì lộ chéo sàn khá nặng nên đáng làm thành việc riêng.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Records: phần expected của AC-6 trong evals.yaml còn mô tả phép dò chuỗi cũ, và thẻ Cổng 1 vẫn để AC-8 ở mục «Sẽ KHÔNG làm» (r2)**
  Người dùng thấy gì: Hồ sơ nghiệm thu mô tả sai cách giữ luật cách ly và xếp nhầm một việc đã làm vào mục không làm, người duyệt có thể hiểu sai.
  Căn cứ: Không ảnh hưởng người dùng hay dữ liệu, chỉ gây hiểu lầm cho người duyệt, sửa lại hồ sơ rất rẻ.
  file: `_acceptance/cach-ly-moi-san/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims a whole class, covers only some points): loc_theo_san says five forms fail closed, but only some have a break file, and the function has no direct test matrix (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một vài dạng luật mở quá rộng chưa có ca thử chứng minh bộ kiểm sẽ báo đỏ, nên chưa chắc chặn được.
  Căn cứ: Không có dữ liệu thật bị lộ và các dạng chính đã được thử, bổ sung ca thử sau rẻ.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

- **Shape 5 / Shape 4: the break list is hand-written and not matched against the folder, and a case with no files is still counted as passing (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một bản phá thử thêm sau có thể quên đăng ký mà không ai biết, nên bộ kiểm có thể báo đạt dù thực ra chưa được thử.
  Căn cứ: Hiện cả bảy tệp đều đã đăng ký đúng, rủi ro chỉ về sau và người dùng không bị ảnh hưởng.
  file: `db/scripts/cach-ly.sh`
  severity: low
  Đề xuất: known-limits

- **Authorization/isolation (SP-1): withCompany đưa client thô cho việc, việc tự thoát được vai và sàn (r1)**
  Người dùng thấy gì: Mã nghiệp vụ viết sau này về lý thuyết có thể tự đổi sàn hoặc thoát khỏi lớp cách ly giữa chừng, và hiện chưa có lưới nào bắt việc đó. Hiện chưa có đường truy vấn thật nên chưa ai bị ảnh hưởng.
  Căn cứ: Rủi ro chỉ xuất hiện khi có mã thật kết nối cơ sở dữ liệu, mà việc đó là hàng sau; ghi lại ngay bây giờ rồi xử lý cùng lúc nối dữ liệu thật là rẻ nhất.
  file: `src/modules/identity/with-company.ts`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-6: ca quét danh mục bỏ sót view, view vật chất hoá, hàm security definer và schema khác (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này có người tạo một dạng xem hay hàm đặc quyền trên dữ liệu thoả thuận, sàn này có thể đọc được dữ liệu sàn khác mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hậu quả là lộ dữ liệu giữa các sàn và khó tự phát hiện, nhưng chỉ xảy ra khi có thay đổi lược đồ sau này, nên nên làm thành một việc riêng có phạm vi rõ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Authorization (SP-1): không kiểm quyền TRUNCATE/TRIGGER/REFERENCES của vai API (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu migration sau lỡ cấp quyền rộng cho vai của API, một sàn có thể xoá sạch dữ liệu mọi sàn mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả nặng nếu xảy ra vì mất dữ liệu của mọi sàn, nhưng chỉ khi có cấp quyền sai trong tương lai; thêm một ca kiểm là rẻ nên đáng làm thành việc riêng.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Domain/Records: migration đưa lại trần lớp dữ liệu mà quyết định 0014 đã bỏ, và lệch ontology Agreement (r1)**
  Người dùng thấy gì: Mô hình dữ liệu thoả thuận trong cơ sở dữ liệu còn lệch với mô tả nghiệp vụ và một quyết định cũ, nên người đọc sau có thể hiểu sai quy tắc.
  Căn cứ: Không mất hay lộ dữ liệu, chỉ gây nhầm lẫn khi đọc tài liệu; ghi rõ lệch này và để chủ kho chọn bên khi đụng tới thoả thuận.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-8: bộ quét một cửa hẹp, dễ vòng qua (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một người viết mã sau này có thể mở kết nối ngoài cửa bằng cách đặt tên khác mà bộ quét không phát hiện, làm mất lớp bảo vệ cách ly ở mã nguồn.
  Căn cứ: Lỗ chỉ có ý nghĩa khi gói kết nối thật được thêm vào; thêm luật cấm import khi đó là rẻ và hợp thời điểm hơn.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: known-limits

- **Design/one door: server.ts lộ câu đổi vai và câu đặt sàn ra ngoài module (r1)**
  Người dùng thấy gì: Module khác về lý thuyết có thể tự dựng một cửa thứ hai thay vì dùng cửa chung, làm luật cách ly nằm ở hai nơi.
  Căn cứ: Không ảnh hưởng người dùng hiện tại và dễ gỡ bất cứ lúc nào, nên ghi lại là đủ.
  file: `src/modules/identity/server.ts`
  severity: low
  Đề xuất: known-limits

- **Records: chú thích trong migration chỉ tới bộ kiểm không có trong kho (r1)**
  Người dùng thấy gì: Người viết bảng mới sau này có thể đi tìm bộ kiểm ở chỗ không tồn tại trong kho này.
  Căn cứ: Chỉ làm mất chút thời gian của lập trình viên, không ảnh hưởng dữ liệu; ghi chú chỉ đúng chỗ là đủ.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: low
  Đề xuất: known-limits

- **Conventions (AGENTS.md Language): tên tệp và định danh viết tiếng Việt (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một số tên tệp và hàm kiểm dùng tiếng Việt trái quy ước đặt tên tiếng Anh của kho, nhưng người dùng cuối không thấy gì.
  Căn cứ: Chỉ là quy ước nội bộ, đổi tên có chi phí duyệt lại các phép đo nên ghi ngoại lệ là hợp lý.
  file: `db/scripts/cach-ly.sh`
  severity: low
  Đề xuất: known-limits

- **Intent: thẻ Cổng 1 xếp AC-8 vào nhóm «Sẽ KHÔNG làm» dù hợp đồng có làm (r1)**
  Người dùng thấy gì: Thẻ duyệt hiện việc chặn mã mở kết nối ngoài cửa dưới mục không làm, người duyệt có thể tưởng nó bị cắt.
  Căn cứ: Hợp đồng đã duyệt ghi rõ việc này có làm, nên chỉ cần ghi chú; không mất dữ liệu và sửa thẻ rất rẻ.
  file: `_acceptance/cach-ly-moi-san/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Evidence: make check đỏ tại máy vì tệp sinh ra của lượt nghiệm thu (r1)**
  Người dùng thấy gì: Trên máy này bước kiểm tra mã báo đỏ do một tệp tạm của lượt nghiệm thu, còn trên CI vẫn xanh.
  Căn cứ: Tệp tạm tự mất khi dọn thư mục chạy, không ảnh hưởng sản phẩm hay CI nên chấp nhận.
  file: `.acceptance-runs/cach-ly-moi-san/acceptance-verify.js`
  severity: low
  Đề xuất: wont-fix

- **A failed rollback is swallowed and the client is still returned to the pool as healthy (r1)**
  Người dùng thấy gì: Trong tình huống hiếm khi việc huỷ giao dịch cũng lỗi, một kết nối nửa chừng có thể bị dùng lại cho yêu cầu của sàn khác.
  Căn cứ: Hiếm gặp và chỉ có thể xảy ra khi có kết nối thật, nhưng hậu quả có thể là lẫn dữ liệu giữa sàn nên cần ghi rõ để xử lý khi nối dữ liệu thật.
  file: `src/modules/identity/with-company.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình, dòng ghim không phân biệt được): dòng ghim của phá thử luat-them-khong-kiem cũng khớp với dòng HỎNG do chính lệnh tự in (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bản phá thử có thể báo đỏ vì một lý do không liên quan mà vẫn được tính là đã bắt đúng lỗi, nên độ tin cậy của lưới kiểm kém hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng người dùng và bộ kiểm vẫn bắt được lỗi thật; ghi nhận là hạn chế đã biết.
  file: `db/scripts/cach-ly.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính không có đối chứng dương): ca a-khong-them-dong-ten-b / a-khong-chuyen-dong-sang-b không có ca sàn A ghi được dòng của chính mình (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ kiểm không chứng minh được sàn vẫn ghi được dữ liệu của chính mình, nên một lỗi chặn mọi lần ghi có thể lọt qua.
  Căn cứ: Hậu quả là chức năng ghi hỏng chứ không lộ dữ liệu, và sẽ lộ ngay khi dùng thật; thêm ca đối chứng là rẻ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét lớp nhưng số phần tử không được ghim): số bảng quét được in ra nhưng không assert bằng ma trận viết trước (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bộ quét bỏ sót một bảng công ty, bộ kiểm vẫn xanh mà không ai nhận ra số bảng bị thiếu.
  Căn cứ: Chỉ xảy ra khi bộ quét bản thân có lỗi, hiếm và không mất dữ liệu ngay; ghi nhận là đủ.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): bộ quét một cửa có 5 nhánh mẫu nhưng đối chứng chỉ phủ 2 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một số kiểu mở kết nối trái phép chưa có ví dụ chứng minh bộ quét bắt được, nên lưới có thể có lỗ chưa ai thử.
  Căn cứ: Không ảnh hưởng người dùng hiện tại và thêm ví dụ kiểm là việc nhỏ khi có mã kết nối thật.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): withCompany chỉ chạy trên bể giả gõ theo interface do chính cửa định nghĩa (r1)**
  Người dùng thấy gì: Cửa truy vấn chưa từng được chạy thật trên cơ sở dữ liệu thật, nên hành vi thật của nó chưa được xác nhận.
  Căn cứ: Đã được nêu từ đầu và sẽ được làm khi nối dữ liệu thật đầu tiên; chưa có mã thật nào dùng cửa này nên chưa gây hại.
  file: `src/modules/identity/with-company.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
