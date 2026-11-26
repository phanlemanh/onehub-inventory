# Review findings: english-route-names (round 3)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E2, E3, E5 and E8 now run through rang/chay.sh, but their paths do not list chay.sh, so a later change to the script can carry old results forward**
  Người dùng thấy gì: Người dùng không thấy gì khác đi: các địa chỉ mới vẫn chạy đúng. Rủi ro chỉ nằm ở bộ nghiệm thu, nếu sau này kịch bản chạy bài kiểm bị sửa thì kết quả cũ có thể bị dùng lại mà không chạy lại, nên một lỗi có thể lọt qua mà không ai biết.
  Căn cứ: Không ảnh hưởng người dùng hay dữ liệu, chỉ làm bộ nghiệm thu có thể tin kết quả cũ trong một vòng sau; hiện tại các kết quả đang đúng, và hợp đồng đã ghi các hạn chế tương tự về công cụ kiểm tra.
  file: `_acceptance/english-route-names/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **E1 and E13 run rang/old-names.mjs but their paths leave out the script and giu.txt; in round 2 E13 was already carried forward after old-names.mjs changed**
  Người dùng thấy gì: Người dùng không bị ảnh hưởng: địa chỉ cũ vẫn trả trang không có và địa chỉ mới vẫn mở đúng. Chỉ là phép quét chữ cũ có thể không được chạy lại sau khi bị sửa, nên một địa chỉ cũ quay lại có thể không bị báo ngay.
  Căn cứ: Hậu quả nhẹ và nằm ở khâu kiểm tra nội bộ, không làm mất dữ liệu; kết quả hiện tại đã được xác nhận đúng và hạn chế gần giống đã được chủ kho chấp nhận ở cổng bằng chứng.
  file: `_acceptance/english-route-names/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Tier: autonomy gate reports high because protected tools/ files change (r2)**
  Người dùng thấy gì: Thay đổi này chạm vào các công cụ kiểm tra được bảo vệ nên phải có chủ mã duyệt mới được gộp, không tự gộp được. Người dùng cuối không thấy khác biệt nào.
  Căn cứ: Chỉ làm chậm việc gộp chứ không ảnh hưởng người dùng hay dữ liệu; chỉ cần ghi rõ trong mô tả để người có quyền duyệt.
  file: `tools/coverage_matrix/contracts.py`
  severity: low
  Đề xuất: known-limits

- **New keep entry for company-layer.yaml uses the bare old id, which hides a reverted old address in the screen register from the old-word scan (r2)**
  Người dùng thấy gì: Công cụ kiểm tra chữ cũ có thể bỏ sót nếu sau này ai đó đưa địa chỉ cũ trở lại trong sổ màn của màn Tuỳ chỉnh của sàn. Hiện tại người dùng vẫn vào đúng địa chỉ mới.
  Căn cứ: Hiện chưa có lỗi nào xảy ra với người dùng, chỉ là lưới an toàn về sau hơi lỏng; sửa sau rẻ và không mất dữ liệu.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): dòng giữ mới có chữ giữ trùng nguyên mẫu, nên miễn quét cả tệp chứ không ghim một dòng (r2)**
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

- **Tiêu chí và bài kiểm: phía proof_gate của AC-7 không có cặp phá thử và không kiểm mã thoát (r1)**
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

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ (hình 3): số 'giu' không được đối chiếu với số dòng ghim (r1)**
  Người dùng thấy gì: Phép quét chữ cũ có thể bỏ qua một dòng chữ cũ thêm vào sau này nếu nó nằm cùng tệp với dòng được giữ. Người dùng chưa gặp ảnh hưởng.
  Căn cứ: Rủi ro chỉ là chữ cũ lọt lại về sau, nhìn thấy được và sửa rẻ; hiện tại cây đang sạch.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case (hình 5): mẫu 'ten phan cu' chỉ bắt 5 ngữ cảnh cú pháp, self-test chỉ cấy 1 dạng (r1)**
  Người dùng thấy gì: Phép quét có thể bỏ sót vài cách viết tên phần cũ. Nếu sót thì chỉ là một địa chỉ hoặc tên cũ còn lại, không làm hỏng màn.
  Căn cứ: Hậu quả nhẹ, tự lộ khi mở màn và sửa rẻ; chưa có chỗ sót nào được chứng minh.
  file: `_acceptance/english-route-names/rang/old-names.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thiếu ma trận viết-trước ở cột nhãn (hình 5): nhãn kỳ vọng của 'cot-hai' rút từ chính PART_TITLE mà nav dùng (r1)**
  Người dùng thấy gì: Nếu hai nhãn trong cột bên bị đổi chỗ nhầm, bài kiểm hiện tại có thể không báo. Người dùng sẽ thấy nhãn sai ngay khi mở màn.
  Căn cứ: Lỗi nhãn sai dễ nhìn thấy và sửa nhanh, không mất dữ liệu.
  file: `tests/company-layer-route.test.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (_acceptance/english-route-names/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
