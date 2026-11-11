## Trong hợp đồng

- **grounds_exist now fails a whole cell on any prose word or URL that contains '/'**
  file: `tools/proof_gate/check.py:127`
  severity: low
  AC: AC-4
  source: conventions
  detail: The new rule says every token with '/' is a file reference that must resolve with is_file(). The tokenizer (`[^\s`,;()«»·]+`) still splits on whitespace only. So ordinary Vietnamese prose such as 'và/hoặc' or 'đọc/ghi', and any URL, are counted as missing files and turn the cell red. Checked against the real repo: grounds_exist('design/states.md') -> True, but grounds_exist('design/states.md (đọc/ghi)') -> False and grounds_exist('design/states.md và/hoặc AGENTS.md') -> False. A 'khác — có lý do' reason that cites the RESO dictionary URL (AGENTS.md makes RESO the naming source) also fails, even next to a valid ADR. Before this change, the same cells passed whenever one real reference was present. Rows hit: 'khác — có lý do' (ly-do-khong-can-cu, AC-4) and 'đạt' (bai-kiem-khong-co, AC-6). The gate fails closed, so nothing slips through; the cost is false red that the person writing the proof can only clear by rewording. Neither new test (proof-gate.test.ts:428 and :510) covers prose or a URL that contains '/', so this narrowing is untested and was not mentioned in decision d-20261111T050922Z-17. Possible fixes: only count a token as a path when it looks like one (file extension or a known top-level folder such as tests/, src/, design/, wiki/; URL schemes excluded), or document the restriction in khuon-chung-minh.md and add a test for it.
  rationale: AC-4 requires a 'khác — có lý do' row with a real file or decision ground to stay silent, but a real ground next to prose like 'và/hoặc' turns the cell red.

- **grounds_exist treats every word containing '/' as a file reference, so slashes in prose, URLs or markdown links now fail valid grounds**
  file: `tools/proof_gate/check.py:127`
  severity: medium
  AC: AC-4
  source: bugs
  detail: The new rule is that every reference must resolve, but any token containing '/' still counts as a file reference. If the token is not an existing file, the whole cell fails. Prose, URLs and markdown links in the grounds column therefore turn real grounds red. Reproduced with Repo(root=repo) and a real file F = tools/proof_gate/check.py: `F` alone -> True; `F — chờ/tải tách riêng` -> False; `F (Chờ tải/Trống)` -> False; `F ListSide/BuyerSide` -> False; `F N/A` -> False; `F xem https://dd.reso.org/DD2.1/` -> False; `[F](F)` (markdown link to a real file) -> False because the `[F]` token fails is_file; `ADR-0002/ADR-0003` -> False even though both decisions exist. Result: the gate emits `ly-do-khong-can-cu` (aspects table) and `bai-kiem-khong-co` (state matrix) for rows whose grounds point to a real file. The new tests only cover a folder and a real file next to a missing one; nothing checks that a slash in plain prose stays silent. tools/proof_gate/khuon-chung-minh.md does not tell writers to avoid slashes or links either. Fix: count a token as a path reference only when it looks like a repo path (known extension, or a prefix such as src/ tests/ design/ wiki/ tools/ _acceptance/), skip URL schemes, and pull the target out of markdown links before the check.
  rationale: AC-4 says a reason row with a real ground must be silent, yet slashes in prose, URLs or markdown links make a real ground fail.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 — kiểm âm tính đứng một mình: luật 'mọi căn cứ phải có thật' không có ca đối chứng 'tệp thật + tệp thật'**
  Người dùng thấy gì: The checks have no case proving that a cell with two real references stays quiet. If the rule ever wrongly flagged every multi-reference cell, the test suite would not notice.
  Căn cứ: Low impact: nothing is wrong for users today, only a safety net is thin, and the gap is cheap to close later in a follow-up.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — nói là quét cả LỚP nhưng chỉ kiểm vài điểm: ba loại căn cứ, mà luật 'một cái thiếu là hỏng cả ô' chỉ được kiểm với đường dẫn tệp**
  Người dùng thấy gì: Missing decision references and missing wiki references are not covered by tests when mixed with a real one. A future change could break them without anyone being warned.
  Căn cứ: Low impact: no data is lost and nobody sees a wrong result today; it only weakens future protection, and adding the cases later is cheap.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: low
  Đề xuất: known-limits

- **The gate reads the screen register itself instead of reusing the existing reader (r1)**
  Người dùng thấy gì: Hai công cụ kiểm có thể hiểu khác nhau về một màn hay một hồ sơ đã đóng, nên có lúc một vòng qua cổng này mà bị bên kia đếm khác. Người dùng cuối không thấy gì.
  Căn cứ: Hậu quả nhẹ và chỉ hiện khi có người đổi quy ước ở một bên; không mất dữ liệu, bên kia vẫn báo đỏ, sửa sau không đắt.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **Image paths in the proof file can point outside the contract folder (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một vòng có thể qua cổng bằng cách trỏ tới ảnh nằm ngoài hồ sơ, nên người soi ở cổng có thể không thấy đúng ảnh đặt cạnh màn mẫu.
  Căn cứ: Chỉ xảy ra khi người lập vòng cố ý hoặc vô ý trỏ sai đường, người soi vẫn xem được và sửa lại dễ; không mất dữ liệu.
  file: `tools/proof_gate/check.py`
  severity: medium
  Đề xuất: known-limits

- **The state matrix passes with no checks when design/states.md has no readable table (r1)**
  Người dùng thấy gì: Nếu bảng trạng thái của kho bị đổi tên hay hỏng, cổng im lặng bỏ qua việc kiểm trạng thái và mọi màn mẫu mới đều qua.
  Căn cứ: Cần có người làm hỏng tệp nguồn trước, hiếm gặp và dễ lộ khi xem kho; sửa rẻ nhưng không có AC bắt buộc.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **If the states list is missing or unreadable, every state matrix passes with no rows (r1)**
  Người dùng thấy gì: Khi danh sách trạng thái không đọc được, cổng báo xanh cho mọi màn mẫu mới mà không cảnh báo gì, nên màn thiếu trạng thái có thể được trình.
  Căn cứ: Chỉ xảy ra khi tệp nguồn hỏng, hiếm; người soi ở cổng vẫn là lớp chặn cuối và sửa sau rẻ.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **The proof gate quietly skips contracts with broken front matter or an unknown status (r1)**
  Người dùng thấy gì: Hồ sơ gõ sai trạng thái hoặc hỏng phần đầu sẽ bị cổng bỏ qua và vẫn báo xanh, dù công cụ khác trong bộ kiểm chung có thể đỏ.
  Căn cứ: Bộ kiểm chung vẫn bắt được lỗi này nên rủi ro thấp; sửa dễ nhưng ngoài hợp đồng.
  file: `tools/proof_gate/model.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): cong-cu.md là lời cổng cũ dựng lại theo khuôn của lưới mới, không phải phát lại (r1)**
  Người dùng thấy gì: Bài thử ca Liên hệ cũ dùng bản viết tay nên chưa chắc chứng minh lưới bắt được đúng lời cổng cũ thật; người dùng có thể tin vào độ phủ hơn mức đã đo.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ giảm độ tin của bài thử; ghi rõ giới hạn là đủ, làm lại cần lấy lại nguồn cũ nên tốn.
  file: `tools/proof_gate/fixtures/lien-he-quy-hang/cong-cu.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): số 43/18/25 của ban-kiem.md chỉ đếm trên chính bản chép tay (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bản chép tay bảng kiểm Liên hệ chép sai hay sót dòng thì không bài thử nào phát hiện, nên con số 25 chỗ lệch có thể không khớp bản gốc.
  Căn cứ: Chỉ làm sai bài thử một lần, không chạm dữ liệu thật; đối chiếu lại bằng tay rẻ khi cần.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): đầu tệp hứa mỗi luật có ca xanh và ca đỏ, nhưng 3 mã lỗi không có bài nào (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ba loại lỗi của cổng chưa có bài thử riêng nên nếu chúng hỏng thì không ai biết ngay, dù người dùng vẫn được bảo vệ bởi các luật khác.
  Căn cứ: Là khoảng trống bài thử ở góc hiếm, không làm sai kết quả hiện tại; thêm bài sau rẻ.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận thiếu trục): ma trận 6 × 3 của AC-1 gộp mọi màn sản phẩm vào một màn Lưới, bỏ trục lối (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài thử toàn phần chưa kê hết các lối của màn, nên tổ hợp trạng thái hồ sơ với lối họ mới chỉ được thử rời.
  Căn cứ: Các tổ hợp quan trọng đã được thử riêng, rủi ro thấp; mở rộng ma trận là việc thêm, không gấp.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1/3 (đo chỉ dẫn bằng chuỗi có mặt): bài 'skill trỏ đúng' chỉ grep SKILL.md (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hướng dẫn cho người dựng màn có thể trỏ tới tệp đã đổi tên mà bài thử vẫn xanh, khiến người dựng màn đi theo chỉ dẫn lỗi thời.
  Căn cứ: AC-10 vốn do người xét, đổi tên tệp sẽ lộ ngay khi dựng màn và sửa chữ rất rẻ; không đáng mở thêm việc.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
