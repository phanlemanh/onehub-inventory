# Review findings: bo-o-tim-cua-vung (round 1)

## Trong hợp đồng

- **Hình dạng 3 (khẳng định 'chuỗi có mặt' cho một lời hứa là quan hệ): thước đổi-bài-kiểm nhận mọi chuỗi con của tệp, kể cả chú thích hay dòng import, là 'ca mới có thật'**
  file: `_acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs:105`
  severity: medium
  AC: AC-9
  detail: `problem()` coi một hàng là đạt khi `readFileSync(path).includes(r.newCase)`. E18 hứa 'mỗi hàng mới trỏ tới tệp và tên ca có thật', tức là hàng phải nối với một ca kiểm thật, nhưng phép đo chỉ xem chuỗi có nằm đâu đó trong tệp hay không. Bảng hiện có những hàng chỉ đạt nhờ chỗ lỏng này. Dòng 55 của doi-bai-kiem.md lấy `// Every grid screen with a region runs every region case` làm ca mới. Đây chỉ là chú thích trong suite.ts, không phải ca kiểm. Dòng 43 lấy `firstColumnHas,`, một dòng import. Thước vẫn in 'moi ca moi co that' và thoát 0 với cả hai hàng này.
  rationale: AC-9 đòi mỗi khẳng định cũ có khẳng định mới đo cùng điều; bảng đối chiếu có hàng trỏ tới chú thích và dòng import, không phải ca kiểm thật.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier (check 10): high tier, needs a code owner before merge**
  Người dùng thấy gì: Thay đổi này cần chủ kho duyệt trước khi gộp; nếu gộp tự động thì phần mô hình nghiệp vụ được đổi mà chưa có người chịu trách nhiệm xem qua.
  Căn cứ: Không mất dữ liệu hay hỏng màn nào, chỉ là bước duyệt còn thiếu và làm bù ở cổng gộp được ngay, rất rẻ.
  file: `ontology/entities/SavedView.yaml`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests (check 2): a signed row-3 threshold is lowered and the owner has not approved it yet**
  Người dùng thấy gì: Cạnh hồ sơ căn đang mở ở khổ 1024, người dùng chỉ còn thấy cột Căn chứ không còn thấy cả Toà như trước, cho tới khi chủ kho đồng ý.
  Căn cứ: Người dùng vẫn dùng được và thấy được căn; chỉ bớt một cột ở khổ vừa, và chủ kho sẽ quyết ở cổng bằng chứng nên không cần sửa thêm.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Design (check 9): two labels left unused after the «Lọc» button was removed**
  Người dùng thấy gì: Hai chữ nhãn của nút Lọc cũ vẫn nằm trong kho dù không còn hiện ở đâu; người dùng không thấy gì khác.
  Căn cứ: Người dùng không bị ảnh hưởng chút nào; để lại chỉ làm kho hơi lộn xộn và dọn lúc nào cũng được.
  file: `src/components/candidate/grid-copy.ts`
  severity: low
  Đề xuất: wont-fix

- **Design (check 9): the listings module's public door is widened for tests only**
  Người dùng thấy gì: Người dùng không thấy khác biệt; chỉ là mã của phân hệ hàng lộ thêm hai thứ chỉ để bài kiểm dùng.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; ghi chú một dòng là đủ, sửa đắt hơn lợi.
  file: `src/modules/listings/ui/index.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn/bản mô phỏng thay vì đầu ra): bài 'mọi màn Lưới chạy đủ ca vùng' đếm danh sách ca do một hàm tự viết trong bài dựng, không đếm ca mà suite.ts sinh ra**
  Người dùng thấy gì: Bài kiểm khẳng định mọi màn lưới chạy đủ ca nhưng không đo bộ sinh thật, nên nếu sau này có người cho một màn bỏ qua ca thì bài vẫn xanh và lỗi lọt qua.
  Căn cứ: Hôm nay màn vẫn chạy đúng; rủi ro là về sau lọt lỗi mà không báo, và gia cố bài kiểm có thể làm ở đợt riêng khi cần.
  file: `tools/e2e_templates/e2e-templates.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm tính đứng một mình): 'chạy trên chính kho thì cặp FormDialog xanh' chỉ kiểm rằng không có mã so-mien-***
  Người dùng thấy gì: Bài kiểm xác nhận khối FormDialog qua cổng chứng từ có thể vẫn xanh dù khối ấy bị xoá khỏi sổ, nên một lỗi như vậy có thể không bị bắt.
  Căn cứ: Hiện cặp vẫn qua nên người dùng không bị ảnh hưởng; đây chỉ là lưới an toàn yếu, thêm đối chứng sau này rẻ.
  file: `tools/proof_gate/proof-gate-0023.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
