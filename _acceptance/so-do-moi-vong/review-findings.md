# Review findings: so-do-moi-vong (round 1)

## Trong hợp đồng

- **kiem-moc misses the 1a profile once it reaches da-cham-boi-thuc-te, so a baseline measured after 1a merged still passes**
  AC: AC-8
  file: `tools/round_metrics/round_metrics.py:282`
  severity: medium
  source: bugs
  detail: The 'do sau khi 1a gop' check only matches `^status:\s*(signed-off|machine-cleared)\b` in _acceptance/khung-va-giao-dien/contract.md at the baseline commit. In the kit, `da-cham-boi-thuc-te` is the seventh status, set by a person after the profile has shipped (kit GUIDE status table, ADR-0020). It also comes after the Evidence Gate. The same file already treats it as a post-gate status in TRANG_THAI_DOI (line 44). If the baseline commit points to a tree where 1a is already at `da-cham-boi-thuc-te`, kiem-moc prints no error and exits 0. That breaks AC-8 ('ở commit đó hồ sơ khung-va-giao-dien chưa có hoặc chưa qua Cổng Bằng chứng') without any message. Fix: match every post-gate status, for example reuse the TRANG_THAI_DOI set minus `verified`. Then add a breaking case to the test that uses `status: da-cham-boi-thuc-te`.
  rationale: AC-8 đòi hồ sơ khung-va-giao-dien chưa có hoặc chưa qua Cổng Bằng chứng; trạng thái da-cham-boi-thuc-te là sau cổng mà lệnh vẫn cho xanh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Check 6, input validated at the boundary (path traversal): `--slug` is not checked before the file is written**
  Người dùng thấy gì: Nếu ai đó gõ nhầm hoặc cố ý gõ tên hồ sơ có dấu đi lên thư mục cha, tệp số đo có thể bị ghi ra ngoài thư mục hồ sơ nghiệm thu.
  Căn cứ: Chỉ chủ kho hoặc agent chạy lệnh này trên máy mình, không có người dùng ngoài chạm tới; hậu quả nhẹ, chỉ một tệp nằm sai chỗ và xoá đi là xong.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **The Gate 1 card puts AC-1, the main recording criterion, under 'Sẽ KHÔNG làm'**
  Người dùng thấy gì: Thẻ chủ kho đọc để duyệt kế hoạch ghi việc ghi số đo chính ở mục Sẽ KHÔNG làm, nên bản duyệt có thể bị hiểu sai về phạm vi.
  Căn cứ: Không mất dữ liệu và sản phẩm chạy đúng hợp đồng; chủ kho đã duyệt và có thể đọc lại hợp đồng, nên chỉ cần ghi lại chỗ trình bày sai.
  file: `_acceptance/so-do-moi-vong/card-plain.json`
  severity: medium
  Đề xuất: known-limits

- **ghi silently drops every layer already declared when the existing so-do-vong.json cannot be read, then overwrites it**
  Người dùng thấy gì: Nếu bản số đo cũ bị hỏng, chạy lại lệnh ghi sẽ lặng lẽ mất các tầng đã khai trước đó và trông như chưa từng khai.
  Căn cứ: Chỉ xảy ra khi tệp đã hỏng, hiếm; mất khai báo nhưng khai lại được từ sổ chạy và tệp nằm trong git nên lấy lại được.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **gop silently skips unreadable so-do-vong.json files, so the report undercounts with no warning**
  Người dùng thấy gì: Báo cáo gộp có thể bỏ qua một bản số đo hỏng mà không báo, làm số vòng và tỉ lệ làm lại thấp hơn thực tế.
  Căn cứ: Chỉ lệch số khi có tệp hỏng và lệnh kiểm vẫn bắt hỏng ở các hồ sơ đã qua chấm; tính lại được sau khi sửa tệp.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: lời hứa 'lấy từ dòng cuối của từng loại' là quan hệ giữa nhiều dòng, nhưng bài chỉ so một giá trị với dòng duy nhất**
  Người dùng thấy gì: Bài kiểm chưa chứng minh được số vật, thước, nhát, giờ máy lấy từ dòng cuối, nên nếu sau này lấy nhầm dòng đầu thì có thể không ai biết.
  Căn cứ: Hiện chưa có số sai thật, chỉ là lưới bắt lỗi còn thưa; bổ sung bài kiểm sau rẻ và không ảnh hưởng người dùng ngay.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: bản chữ của gop chỉ được kiểm là có tên tầng, không kiểm quan hệ 'mang cùng số' với bản --json**
  Người dùng thấy gì: Báo cáo dạng chữ có thể in lệch cột hoặc sai số so với bản máy đọc mà bài kiểm vẫn xanh.
  Căn cứ: Chưa thấy số sai thật; nếu sai thì người đọc báo cáo có thể thấy lệch và đối chiếu với bản JSON, sửa không mất dữ liệu.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: phép kiểm 'đo sau khi 1a gộp' chỉ có ca đỏ, thiếu đối chứng dương khi khung có mặt nhưng chưa qua Cổng**
  Người dùng thấy gì: Chưa có bài kiểm cho trường hợp khung có mặt nhưng chưa qua cổng, nên lưới có thể chặn nhầm mốc hợp lệ mà không ai thấy.
  Căn cứ: Chưa gây lỗi thật; nếu chặn nhầm thì lệnh báo đỏ ngay và người dùng thấy được, nên hậu quả nhẹ và bổ sung ca sau rẻ.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: trục 'giao diện theo surfaces' chỉ có điểm-case 'ui', thiếu các phần tử web và web-ui của lớp**
  Người dùng thấy gì: Hồ sơ khai kiểu giao diện web hoặc web-ui có thể bị bỏ sót khỏi lưới mà bài kiểm không phát hiện.
  Căn cứ: Chỉ rủi ro nếu ai đó sửa bỏ các giá trị này; hậu quả nhẹ là sót đòi số đo và thêm ca kiểm sau rẻ.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
