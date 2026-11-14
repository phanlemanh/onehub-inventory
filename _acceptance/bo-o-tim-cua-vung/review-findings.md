# Review findings — bo-o-tim-cua-vung (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **AGENTS.md Autonomy tiers: «Never delete or weaken a test to get green» (review-change check 2, criteria and tests)**
  Người dùng thấy gì: Chủ kho có thể ký nhận nhầm rằng không bài kiểm nào bị nới, trong khi số cột nhìn thấy cạnh hồ sơ căn đã giảm (3 ở màn lớn, 1 ở màn vừa). Mức giảm này đã ghi rõ ở chỗ khác để chủ kho xem.
  Căn cứ: Không mất dữ liệu và không ảnh hưởng người dùng cuối; chỉ là cách trình bày cho chủ kho, đã có chỗ ghi riêng và chủ kho vẫn phải ký nên sửa sau cũng rẻ.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Product invariants SP-1 / SP-3 / SP-4 (PRODUCT-INVARIANTS.md marker scan)**
  Người dùng thấy gì: Không có vấn đề gì với người dùng: đã rà và không thấy dữ liệu nội bộ lộ ra, không có cách gửi tin tự động, không lẫn dữ liệu giữa các công ty.
  Căn cứ: Không phải lỗi nên không có hậu quả cho người dùng và không có gì cần sửa.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3 (assert 'có thay đổi' trong khi lời hứa là QUAN HỆ): E8 không so số dòng ở điện thoại với 1440**
  Người dùng thấy gì: Nếu ô lọc trên điện thoại lọc sai kiểu (ví dụ khớp theo cột khác) thì bài kiểm vẫn báo đạt, nên lỗi như vậy có thể lọt qua mà không ai biết.
  Căn cứ: Hiện không có dấu hiệu lọc sai thật, chỉ là lưới an toàn mỏng; người dùng không mất dữ liệu và gõ lại là thấy kết quả, siết bài kiểm sau cũng không đắt.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (quan hệ bị thay bằng phép so luôn đúng): 'ô lọc nằm dưới tiêu đề' so với đỉnh của chính ô tiêu đề chứa nó**
  Người dùng thấy gì: Nếu sau này ô lọc bị đặt lên trên tên cột trên điện thoại, bài kiểm vẫn không báo lỗi, người dùng sẽ thấy bố cục ngược.
  Căn cứ: Hậu quả chỉ là sai bố cục thấy được ngay, không mất dữ liệu, tải lại hoặc sửa là xong; hiện bố cục đúng nên để ghi nhận hạn chế.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert dương không đối chứng): filterHit chỉ đo ô lọc đầu tiên, không có ca phá**
  Người dùng thấy gì: Hồ sơ căn mở bên phải có thể che ô lọc của cột nằm dưới nó (như cột Toà ở màn vừa) mà bài kiểm không phát hiện, khiến người dùng không gõ được vào ô đó.
  Căn cứ: Chỉ ảnh hưởng một vài ô lọc khi hồ sơ đang mở, đóng hồ sơ là gõ lại được và không mất dữ liệu; bổ sung phép đo sau là việc rẻ.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: a signed threshold was loosened, but the old-to-new test table says no threshold was loosened (r2 · tệp đã đổi)**
  Người dùng thấy gì: Hồ sơ đối chiếu bài kiểm nói chưa có ngưỡng nào bị nới, nhưng thực ra số cột tối thiểu cạnh hồ sơ căn đã giảm. Người duyệt có thể hiểu sai là không có gì đổi so với điều đã ký ở hàng 3.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ làm hồ sơ nghiệm thu kể thiếu; lý do nới đã ghi ở phán quyết khác, sửa một câu là xong và rẻ.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Design: hiding the vendor's unpin button with a CSS selector on its internal markup (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nút Bỏ ghim của cột đầu được giấu dựa vào cấu trúc bên trong của thư viện giao diện. Nếu sau này thư viện đổi, nút có thể hiện lại dưới tiêu đề cột Toà.
  Căn cứ: Hiện chưa gây lỗi gì cho người dùng, chỉ có thể hỏng sau một lần nâng cấp thư viện và khi đó nhìn thấy ngay, tải lại không cứu nhưng sửa dễ.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **Design/copy: one no-match message for every filter kind (r2)**
  Người dùng thấy gì: Khi không dòng nào khớp do lọc chọn từ danh sách hoặc lọc số, ngày, câu giải thích vẫn nói về chữ bạn gõ ở ô lọc. Người dùng chưa gõ gì có thể thấy câu này lạ.
  Căn cứ: Chỉ là một câu hơi lệch, dữ liệu không mất và nút Xoá lọc vẫn đưa lại đủ dòng; sửa chữ rẻ nhưng không gấp.
  file: `src/components/candidate/grid-copy.ts`
  severity: low
  Đề xuất: known-limits

- **The first column is not actually locked as frozen; only its «Bỏ ghim» button is hidden, and the header menu can still unpin it (r2 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng vẫn có thể bỏ ghim cột Căn qua menu của tiêu đề cột, và nếu ghim lại thì thứ tự cột ghim đổi, Căn đứng sau Toà. Bảng vẫn dùng được nhưng bố cục cột đầu có thể lệch so với thiết kế.
  Căn cứ: Không mất dữ liệu và người dùng tự đưa về được bằng tải lại hoặc ghim lại, nhưng cột đầu lệch chỗ làm bảng khó đọc; cần một việc riêng để khoá hẳn.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3 — thước đổi bài kiểm chỉ đo «tên ca có trong tệp», trong khi lời hứa là quan hệ dòng cũ → khẳng định mới (r2)**
  Người dùng thấy gì: Công cụ kiểm bảng đối chiếu bài kiểm chỉ xác nhận tên ca có trong tệp, chưa chắc khẳng định mới còn đo đúng điều cũ. Một khẳng định bị xoá có thể vẫn không bị bắt.
  Căn cứ: Không chạm người dùng cuối, chỉ làm lưới an toàn nghiệm thu lỏng hơn; rủi ro là bỏ sót một lần xoá bài kiểm, và rà tay hoặc siết thước sau đều được.
  file: `_acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tier (check 10): high tier, needs a code owner before merge (r1)**
  Người dùng thấy gì: Thay đổi này cần chủ kho duyệt trước khi gộp; nếu gộp tự động thì phần mô hình nghiệp vụ được đổi mà chưa có người chịu trách nhiệm xem qua.
  Căn cứ: Không mất dữ liệu hay hỏng màn nào, chỉ là bước duyệt còn thiếu và làm bù ở cổng gộp được ngay, rất rẻ.
  file: `ontology/entities/SavedView.yaml`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests (check 2): a signed row-3 threshold is lowered and the owner has not approved it yet (r1 · tệp đã đổi)**
  Người dùng thấy gì: Cạnh hồ sơ căn đang mở ở khổ 1024, người dùng chỉ còn thấy cột Căn chứ không còn thấy cả Toà như trước, cho tới khi chủ kho đồng ý.
  Căn cứ: Người dùng vẫn dùng được và thấy được căn; chỉ bớt một cột ở khổ vừa, và chủ kho sẽ quyết ở cổng bằng chứng nên không cần sửa thêm.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Design (check 9): two labels left unused after the «Lọc» button was removed (r1)**
  Người dùng thấy gì: Hai chữ nhãn của nút Lọc cũ vẫn nằm trong kho dù không còn hiện ở đâu; người dùng không thấy gì khác.
  Căn cứ: Người dùng không bị ảnh hưởng chút nào; để lại chỉ làm kho hơi lộn xộn và dọn lúc nào cũng được.
  file: `src/components/candidate/grid-copy.ts`
  severity: low
  Đề xuất: wont-fix

- **Design (check 9): the listings module's public door is widened for tests only (r1 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng không thấy khác biệt; chỉ là mã của phân hệ hàng lộ thêm hai thứ chỉ để bài kiểm dùng.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; ghi chú một dòng là đủ, sửa đắt hơn lợi.
  file: `src/modules/listings/ui/index.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn/bản mô phỏng thay vì đầu ra): bài 'mọi màn Lưới chạy đủ ca vùng' đếm danh sách ca do một hàm tự viết trong bài dựng, không đếm ca mà suite.ts sinh ra (r1)**
  Người dùng thấy gì: Bài kiểm khẳng định mọi màn lưới chạy đủ ca nhưng không đo bộ sinh thật, nên nếu sau này có người cho một màn bỏ qua ca thì bài vẫn xanh và lỗi lọt qua.
  Căn cứ: Hôm nay màn vẫn chạy đúng; rủi ro là về sau lọt lỗi mà không báo, và gia cố bài kiểm có thể làm ở đợt riêng khi cần.
  file: `tools/e2e_templates/e2e-templates.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm tính đứng một mình): 'chạy trên chính kho thì cặp FormDialog xanh' chỉ kiểm rằng không có mã so-mien-* (r1)**
  Người dùng thấy gì: Bài kiểm xác nhận khối FormDialog qua cổng chứng từ có thể vẫn xanh dù khối ấy bị xoá khỏi sổ, nên một lỗi như vậy có thể không bị bắt.
  Căn cứ: Hiện cặp vẫn qua nên người dùng không bị ảnh hưởng; đây chỉ là lưới an toàn yếu, thêm đối chứng sau này rẻ.
  file: `tools/proof_gate/proof-gate-0023.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
