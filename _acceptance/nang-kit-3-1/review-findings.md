# Review findings: nang-kit-3-1 (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Check 8 (CI and agent privileges) + Coverage: kit 3.1 adds paths where the machine merges PRs, and the record does not name them**
  Người dùng thấy gì: Sau khi nâng, bộ công cụ mới có thêm đường để máy tự gộp một thay đổi khi chữ ký của chủ kho có câu cho phép. Hồ sơ chưa nói rõ điều này và quy tắc «không tự gộp» chưa được đối chiếu.
  Căn cứ: Hậu quả là nhẹ vì đường tự gộp chỉ chạy khi chủ kho gõ câu cho phép, không mất dữ liệu, và chỉ cần thêm một dòng ghi chú để sửa, rất rẻ.
  file: `_acceptance/nang-kit-3-1/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Records (check 11): PR #109 description is stale and has no honest 'Human decisions needed'**
  Người dùng thấy gì: Phần mô tả của yêu cầu gộp còn ghi thứ tự gộp cũ nên người duyệt có thể đọc sai tình trạng hiện tại và việc còn chờ mình quyết.
  Căn cứ: Chỉ gây hiểu nhầm nhất thời cho người đọc, không ảnh hưởng người dùng cuối hay dữ liệu, và người ký tự sửa được ngay lúc viết mô tả cuối.
  file: `_acceptance/nang-kit-3-1/contract.md`
  severity: low
  Đề xuất: wont-fix

- **Records: evidence does not cover HEAD — the AC-9 measure and two-way test changed after round 1 PASS**
  Người dùng thấy gì: Bản báo cáo kiểm hiện có chưa phản ánh các sửa mới nhất, nên chưa thể dùng để ký. Vòng kiểm tiếp theo đang chạy sẽ thay nó.
  Căn cứ: Không ảnh hưởng người dùng vì vòng kiểm mới đang chạy sẽ tự thay bản cũ, và chỉ cần không ký bằng bản cũ.
  file: `_acceptance/nang-kit-3-1/evidence-report.md`
  severity: low
  Đề xuất: wont-fix

- **AC-9 measure reads the batch folder of a hard-coded sibling checkout, and the contract does not say so**
  Người dùng thấy gì: Khi chấm từ bản kéo ngoài, phép kiểm đọc thư mục đợt của bản làm việc chính theo tên đoán trước, và hồ sơ chưa nói điều đó. Nếu tên khác thì phép kiểm báo lỗi rõ ràng.
  Căn cứ: Hậu quả nhẹ vì sai tên chỉ làm phép kiểm báo đỏ chứ không cho xanh giả, không mất dữ liệu, và ghi thêm một dòng giới hạn là đủ.
  file: `_acceptance/nang-kit-3-1/rang/dot.mjs`
  severity: low
  Đề xuất: known-limits

- **Records: the design doc repeats the Hỏi-3 line**
  Người dùng thấy gì: Tài liệu thiết kế có một câu bị lặp hai lần, chỉ làm người đọc thấy thừa, không đổi nội dung quyết định.
  Căn cứ: Chỉ là lỗi trình bày, không ảnh hưởng người dùng hay dữ liệu, và công sửa không đáng so với lợi ích.
  file: `docs/superpowers/specs/2026-11-22-nang-kit-3-1-design.md`
  severity: low
  Đề xuất: wont-fix

- **Check 8 + Coverage — the bảng Coverage leaves out kit files that changed in 3.1, including a new path where the machine merges the PR (r1)**
  Người dùng thấy gì: Bản kit mới có thêm một đường để phiên tự gộp PR khi người ký kèm lời «gộp khi CI xanh». Đường này đang tắt vì cờ chưa bật, nhưng hồ sơ và mô tả PR chưa nhắc tới, nên chủ kho có thể không biết.
  Căn cứ: Hiện không gây hại vì cờ đang tắt và không mất dữ liệu; chỉ cần ghi một dòng vào giới hạn đã biết và mô tả PR, sửa rất rẻ.
  file: `_acceptance/nang-kit-3-1/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Records — the spec repeats the Hỏi-3 line (r1)**
  Người dùng thấy gì: Tài liệu gửi chủ kho ở cổng phạm vi có một câu hỏi bị lặp hai lần. Người đọc chỉ thấy thừa một dòng.
  Căn cứ: Hậu quả gần như không có, không ảnh hưởng quyết định hay dữ liệu, và tài liệu đã được duyệt nên không đáng sửa lại.
  file: `docs/superpowers/specs/2026-11-22-nang-kit-3-1-design.md`
  severity: low
  Đề xuất: wont-fix

- **AC-9 measure reads another checkout's batch folder, and the contract does not say so (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi chấm từ bản sao ngoài, kiểm tra về đợt công việc đang đọc thư mục của bản làm việc chính chứ không phải bản đang chấm, mà hồ sơ không nói rõ điều đó.
  Căn cứ: Chỉ đọc, không làm mất hay đổi dữ liệu; ghi rõ vào giới hạn đã biết là đủ và rẻ.
  file: `_acceptance/nang-kit-3-1/rang/dot.mjs`
  severity: low
  Đề xuất: known-limits

- **Kit cache trusted by HEAD commit only (r1)**
  Người dùng thấy gì: Nếu bộ kit tải về tạm bị sửa tay thì phép đo vẫn tin nó là đúng và có thể cho kết quả xanh sai.
  Căn cứ: Rất hiếm xảy ra, chỉ ảnh hưởng máy chấm, người dùng tự khắc phục bằng cách xoá thư mục tạm và chạy lại.
  file: `_acceptance/nang-kit-3-1/rang/kit.mjs`
  severity: low
  Đề xuất: known-limits

- **Two-way test leaves temp folders behind (r1 · tệp đã đổi)**
  Người dùng thấy gì: Mỗi lần chạy kiểm tra hai chiều sẽ để lại vài thư mục tạm trên máy, chiếm chỗ dần.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu, hệ điều hành tự dọn thư mục tạm và người dùng xoá tay được.
  file: `_acceptance/nang-kit-3-1/rang/two-way.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hard-coded ROOT path (shape 6): settings.mjs measure() reads its own file from `root` but the base and ci.yml from repoRoot() (r1)**
  Người dùng thấy gì: Nếu sau này chấm trên một bản sao khác, phép đo cài đặt có thể so với nhánh gốc của bản đang giữ script thay vì bản đang chấm.
  Căn cứ: Hiện chưa có ai gọi theo cách đó nên chưa gây sai kết quả, không mất dữ liệu; ghi lại là đủ và sửa sau rẻ.
  file: `_acceptance/nang-kit-3-1/rang/settings.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
