## Trong hợp đồng

- **Criteria and tests: AC-5 is only half met, and the test checks the deviation instead of the approved criterion**
  file: `tests/e2e/bo-nut.spec.ts:195`
  severity: medium
  AC: AC-5
  source: invariants
  detail: The approved AC-5 in contract.md says both old addresses, /tuy-chinh-san and /proto/bo-nut-theo-quyen, return 404 with the app's shared not-found page. For /tuy-chinh-san the case dia-chi-cu-khong-con does check this (lines 186-194). For /proto/bo-nut-theo-quyen in the dev build, the same case (lines 195-203) expects the opposite: the address falls through to /proto/[slug], draws an empty prototype page titled 'bo-nut-theo-quyen', and the only check is that the button set is gone. The 404 is only verified for production, through E15. The authors know this: decisions.jsonl d-25 and d-32 removed the proxy fix and moved the dev half of AC-5 to the Evidence Gate as an out-of-contract item. Even so, the approved criterion is not met, and this test would stay green if the old address still answered 200. Fix: the owner either rewrites AC-5 (404 in production only, and in dev the shared empty /proto/[slug] page) or the change makes the old proto slug return 404. Until then the PR has to state it as an open owner decision, not as passing. This does not break SP-1, SP-3 or SP-4.
  rationale: AC-5 yêu cầu cả hai địa chỉ cũ trả 404 với trang chung; bản dev của địa chỉ bản mẫu cũ không trả 404 nên đúng tiêu chí này chưa đạt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier: autonomy gate reports high because protected tools/ files change**
  Người dùng thấy gì: Thay đổi này chạm vào các công cụ kiểm tra được bảo vệ nên phải có chủ mã duyệt mới được gộp, không tự gộp được. Người dùng cuối không thấy khác biệt nào.
  Căn cứ: Chỉ làm chậm việc gộp chứ không ảnh hưởng người dùng hay dữ liệu; chỉ cần ghi rõ trong mô tả để người có quyền duyệt.
  file: `tools/coverage_matrix/contracts.py`
  severity: low
  Đề xuất: known-limits

- **New keep entry for company-layer.yaml uses the bare old id, which hides a reverted old address in the screen register from the old-word scan**
  Người dùng thấy gì: Công cụ kiểm tra chữ cũ có thể bỏ sót nếu sau này ai đó đưa địa chỉ cũ trở lại trong sổ màn của màn Tuỳ chỉnh của sàn. Hiện tại người dùng vẫn vào đúng địa chỉ mới.
  Căn cứ: Hiện chưa có lỗi nào xảy ra với người dùng, chỉ là lưới an toàn về sau hơi lỏng; sửa sau rẻ và không mất dữ liệu.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): dòng giữ mới có chữ giữ trùng nguyên mẫu, nên miễn quét cả tệp chứ không ghim một dòng**
  Người dùng thấy gì: Bộ quét chữ cũ miễn cho cả hai tệp thay vì chỉ một dòng, nên nếu địa chỉ cũ quay lại ở đó thì có thể không bị báo. Người dùng hiện chưa bị ảnh hưởng.
  Căn cứ: Không gây lỗi nhìn thấy được cho người dùng và cây hiện tại sạch; chỉ làm yếu việc phát hiện hồi quy sau này, sửa sau không tốn kém.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thiết kế / mỗi luật một chỗ: phần đọc old_ids bị chép ở hai bộ đọc sổ màn, và bên proof_gate không kiểm (r1)**
  Người dùng thấy gì: Quy tắc đọc mã màn cũ nằm ở hai nơi nên sau này có thể lệch nhau. Hiện người dùng chưa gặp gì sai.
  Căn cứ: Chưa gây lỗi nào cho người dùng và cổng kiểm vẫn bắt được sai sót hiện tại; dọn gộp có thể làm sau mà không mất gì.
  file: `tools/proof_gate/model.py`
  severity: low
  Đề xuất: known-limits

- **Tiêu chí và bài kiểm: phía proof_gate của AC-7 không có cặp phá thử và không kiểm mã thoát (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu cổng kiểm hồ sơ đang mở lặng lẽ ngừng chặn mã màn cũ, việc này có thể chưa bị phát hiện ngay. Người dùng cuối không thấy ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng nội bộ quy trình nghiệm thu, không chạm dữ liệu hay màn người dùng, và đã có một bài kiểm khác phủ một phần.
  file: `tests/screen-old-ids.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hạng rủi ro: high (đường dẫn tools/ được bảo vệ), cần chủ code duyệt (r1)**
  Người dùng thấy gì: Thay đổi chạm các công cụ được bảo vệ nên cần chủ mã duyệt trước khi gộp. Không có lỗi nào với người dùng.
  Căn cứ: Đây là thông báo quy trình, không phải sự cố; chủ mã sẽ duyệt theo luật sẵn có.
  file: `tools/coverage_matrix/contracts.py`
  severity: low
  Đề xuất: wont-fix

- **The old-ids break pair counts any failure, including a crash, as red for the right reason (r1)**
  Người dùng thấy gì: Phép thử thử-phá có thể báo đỏ vì công cụ hỏng chứ không vì đúng lý do. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm giảm độ tin cậy của một phép thử nội bộ, không ảnh hưởng người dùng, và chạy lại là thấy.
  file: `_acceptance/english-route-names/rang/old-ids.sh`
  severity: low
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ (hình 3): số 'giu' không được đối chiếu với số dòng ghim (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép quét chữ cũ có thể bỏ qua một dòng chữ cũ thêm vào sau này nếu nó nằm cùng tệp với dòng được giữ. Người dùng chưa gặp ảnh hưởng.
  Căn cứ: Rủi ro chỉ là chữ cũ lọt lại về sau, nhìn thấy được và sửa rẻ; hiện tại cây đang sạch.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case (hình 5): mẫu 'ten phan cu' chỉ bắt 5 ngữ cảnh cú pháp, self-test chỉ cấy 1 dạng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép quét có thể bỏ sót vài cách viết tên phần cũ. Nếu sót thì chỉ là một địa chỉ hoặc tên cũ còn lại, không làm hỏng màn.
  Căn cứ: Hậu quả nhẹ, tự lộ khi mở màn và sửa rẻ; chưa có chỗ sót nào được chứng minh.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thiếu ma trận viết-trước ở cột nhãn (hình 5): nhãn kỳ vọng của 'cot-hai' rút từ chính PART_TITLE mà nav dùng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu hai nhãn trong cột bên bị đổi chỗ nhầm, bài kiểm hiện tại có thể không báo. Người dùng sẽ thấy nhãn sai ngay khi mở màn.
  Căn cứ: Lỗi nhãn sai dễ nhìn thấy và sửa nhanh, không mất dữ liệu.
  file: `tests/company-layer-route.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
