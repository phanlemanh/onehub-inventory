# Review findings: english-route-names (round 1)

## Trong hợp đồng

- **Tiêu chí và bài kiểm: AC-5 / E8 không còn khớp với việc bài kiểm thực sự đo cho địa chỉ bản mẫu cũ**
  AC: AC-5
  file: `tests/e2e/bo-nut.spec.ts:195`
  severity: medium
  source: invariants
  detail: AC-5 (contract.md:50) và E8 (evals.yaml:79) đã được duyệt với nội dung: cả hai địa chỉ cũ trả mã 404 kèm trang chung cho địa chỉ lạ. Ca dia-chi-cu-khong-con chỉ kiểm mã 404 cho /tuy-chinh-san. Với /proto/bo-nut-theo-quyen, ca này không kiểm mã trả về mà lại khẳng định một trang /proto/[slug] trống mang tiêu đề 'bo-nut-theo-quyen' (tức bản dev trả 200). Việc đổi nghĩa này chỉ ghi là dòng 'fix' d-20261123T051520Z-25, không có decided_by. AC-5 và E8 vẫn ghi 404, nên bằng chứng E8 'xanh' khẳng định điều mà bài kiểm không đo. Ở bản chạy thật, E15 có phủ mã 404. Cách sửa: hoặc đưa chủ kho duyệt câu AC-5/E8 mới ('dev: rơi vào trang bản mẫu chung, không có bộ nút; bản thật: 404') và ghi việc này vào mục cần người quyết của PR, hoặc làm cho bài kiểm đo đúng câu đã duyệt.

- **Tiêu chí và bài kiểm: vế «không được phép» của AC-1 bị tác giả tự bỏ, E9 vẫn hứa có ca này**
  AC: AC-1
  file: `_acceptance/english-route-names/evals.yaml:92`
  severity: medium
  source: invariants
  detail: Kỳ vọng của E9 vẫn ghi 'ca vai-khong-quyen với vai không có readCompanyLayer thấy chữ «không được phép»', và Gate 1 đã nhận nó như một mục đã sửa (P1 trên thẻ). Nhưng tests/e2e-db/lop-rieng.spec.ts không có ca này: dòng descope d-20261123T051742Z-26 do một mình tác giả bỏ nó, không có decided_by. Lý do nêu ra (mọi vai đều có readCompanyLayer) nghe hợp lý, nhưng vế ấy của AC-1 giờ không còn bài kiểm nào. Chốt kiểm quyền ở src/app/(app)/company-layer/page.tsx là mã nằm trong thư mục tuyến vừa đổi tên mà không có bài kiểm phủ. Cách sửa: thêm một bài kiểm đơn vị hoặc trang với phiên giả lập không có readCompanyLayer, hoặc sửa E9/AC-1 và đưa việc descope cho chủ kho duyệt.

- **Tiêu chí và bài kiểm: E1 không quét mã màn trần `tuy-chinh-san` (AC-8 có nêu mã màn)**
  AC: AC-8
  file: `_acceptance/english-route-names/rang/old-names.mjs:22`
  severity: low
  source: invariants
  detail: AC-8 nói phép quét phủ cả mã màn. Có mẫu `\bproto-bo-nut\b` cho mã màn trần của bản mẫu, nhưng mã màn cũ tuy-chinh-san chỉ được bắt khi đi sau dấu gạch chéo (`/tuy-chinh-san`). Một mã màn sót, ví dụ khoá LONGEST_FITS, danh sách MEASURED hay mục trong bài kiểm sổ màn, vẫn qua quét. Dấu hiệu là `old_ids: [tuy-chinh-san]` trong design/screens/company-layer.yaml không cần dòng giữ, trong khi dòng tương ứng proto-bo-nut thì cần. Cách sửa: thêm mẫu `\btuy-chinh-san\b` cho vùng code (trừ tên tệp ảnh đã ghim) và ghim dòng old_ids.

- **Eval E9 still requires a 'vai-khong-quyen' case that was dropped and does not exist**
  AC: AC-1
  file: `_acceptance/english-route-names/evals.yaml:92`
  severity: medium
  source: bugs
  detail: E9's `expected` text still requires "ca 'vai-khong-quyen' với vai không có readCompanyLayer thấy chữ «không được phép»", and card.html (the clean-context review block) says "fixed: E9 thêm ca vai-khong-quyen". No such case exists. tests/e2e-db/lop-rieng.spec.ts adds only 'phan-cu-khong-doc' and 'chua-dang-nhap' in the new "english route names" test, and a grep for vai-khong-quyen finds nothing under tests/. decisions.jsonl d-20261123T051520Z-26 later dropped this case, but evals.yaml and card.html were never updated to match. As a result, E9's command (lop_rieng_e2e) can go green while its stated expectation names a check that never ran. Fix: remove the case from E9's expected text (and the 'fixed' claim in the card), or add the case.

- **Assertion âm-tính-một-mình (hình 4): ca 'closed contract passes — proof gate' không thể đỏ**
  AC: AC-7
  file: `tests/screen-old-ids.test.ts:61`
  severity: medium
  source: measurement
  detail: Ca này chỉ có `expect(out(r)).not.toMatch(/^fixture · tuy-chinh-san/m)`. Nó không kiểm r.status, không ghim dòng dương nào cho thấy cổng đã đọc và xét hồ sơ đóng. Trong tools/proof_gate/check.py, run() xét hồ sơ CLOSED bằng `judge(..., sink=[])`: mọi phát hiện về hồ sơ đã ký bị bỏ đi. Kiểm ma-man-cu cũng chỉ chạy với hồ sơ OPEN. Vì thế, theo cách dựng, không dòng nào bắt đầu bằng `fixture · tuy-chinh-san` có thể xuất hiện cho hồ sơ đóng. Assertion đúng sẵn, bất kể repo.screen() có phân giải mã cũ hay không. Nếu cổng sập (ví dụ `assert fam is not None` trong judge() khi family_of không tìm ra màn qua old_ids), traceback không khớp regex và ca vẫn xanh. Ca coverage-matrix cùng cặp có kiểm `r.status === 0`, ca này thì không. Phần thay đổi thật cho hồ sơ đóng (product_screens/family_of đi qua Repo.screen) vì vậy không được đo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Thiết kế / mỗi luật một chỗ: phần đọc old_ids bị chép ở hai bộ đọc sổ màn, và bên proof_gate không kiểm**
  Người dùng thấy gì: Quy tắc đọc mã màn cũ nằm ở hai nơi nên sau này có thể lệch nhau. Hiện người dùng chưa gặp gì sai.
  Căn cứ: Chưa gây lỗi nào cho người dùng và cổng kiểm vẫn bắt được sai sót hiện tại; dọn gộp có thể làm sau mà không mất gì.
  file: `tools/proof_gate/model.py`
  severity: low
  Đề xuất: known-limits

- **Tiêu chí và bài kiểm: phía proof_gate của AC-7 không có cặp phá thử và không kiểm mã thoát**
  Người dùng thấy gì: Nếu cổng kiểm hồ sơ đang mở lặng lẽ ngừng chặn mã màn cũ, việc này có thể chưa bị phát hiện ngay. Người dùng cuối không thấy ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng nội bộ quy trình nghiệm thu, không chạm dữ liệu hay màn người dùng, và đã có một bài kiểm khác phủ một phần.
  file: `tests/screen-old-ids.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hạng rủi ro: high (đường dẫn tools/ được bảo vệ), cần chủ code duyệt**
  Người dùng thấy gì: Thay đổi chạm các công cụ được bảo vệ nên cần chủ mã duyệt trước khi gộp. Không có lỗi nào với người dùng.
  Căn cứ: Đây là thông báo quy trình, không phải sự cố; chủ mã sẽ duyệt theo luật sẵn có.
  file: `tools/coverage_matrix/contracts.py`
  severity: low
  Đề xuất: wont-fix

- **The old-ids break pair counts any failure, including a crash, as red for the right reason**
  Người dùng thấy gì: Phép thử thử-phá có thể báo đỏ vì công cụ hỏng chứ không vì đúng lý do. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm giảm độ tin cậy của một phép thử nội bộ, không ảnh hưởng người dùng, và chạy lại là thấy.
  file: `_acceptance/english-route-names/rang/old-ids.sh`
  severity: low
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ (hình 3): số 'giu' không được đối chiếu với số dòng ghim**
  Người dùng thấy gì: Phép quét chữ cũ có thể bỏ qua một dòng chữ cũ thêm vào sau này nếu nó nằm cùng tệp với dòng được giữ. Người dùng chưa gặp ảnh hưởng.
  Căn cứ: Rủi ro chỉ là chữ cũ lọt lại về sau, nhìn thấy được và sửa rẻ; hiện tại cây đang sạch.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case (hình 5): mẫu 'ten phan cu' chỉ bắt 5 ngữ cảnh cú pháp, self-test chỉ cấy 1 dạng**
  Người dùng thấy gì: Phép quét có thể bỏ sót vài cách viết tên phần cũ. Nếu sót thì chỉ là một địa chỉ hoặc tên cũ còn lại, không làm hỏng màn.
  Căn cứ: Hậu quả nhẹ, tự lộ khi mở màn và sửa rẻ; chưa có chỗ sót nào được chứng minh.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thiếu ma trận viết-trước ở cột nhãn (hình 5): nhãn kỳ vọng của 'cot-hai' rút từ chính PART_TITLE mà nav dùng**
  Người dùng thấy gì: Nếu hai nhãn trong cột bên bị đổi chỗ nhầm, bài kiểm hiện tại có thể không báo. Người dùng sẽ thấy nhãn sai ngay khi mở màn.
  Căn cứ: Lỗi nhãn sai dễ nhìn thấy và sửa nhanh, không mất dữ liệu.
  file: `tests/company-layer-route.test.ts`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/english-route-names/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
