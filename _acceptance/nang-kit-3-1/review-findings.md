## Trong hợp đồng

- **dot.mjs compares docNhomKeHoach through JSON.stringify of a Map, which is always "{}", so that check can never fail**
  AC: AC-9
  file: `_acceptance/nang-kit-3-1/rang/dot.mjs:46`
  severity: medium
  source: bugs
  detail: `readWith` records each reader's result as `JSON.stringify(mod[fn](args[which]) ?? null)`, and `judge` then compares the 3.0 and 3.1 strings. `nguon-hang.mjs` `docNhomKeHoach(gocKho)` returns a `Map` in both kit versions. `JSON.stringify` of any Map is "{}". I checked this: on this repo the 3.1 reader returns a Map with 69 entries and prints `{}`, and on a path that does not exist it returns an empty Map and also prints `{}`. So for docNhomKeHoach, `a[k] !== b[k]` is always false. The measure prints "reading batch dieu-phoi-nen alike in both" and AC-9 claims 3.1 "returns the same result as 3.0", but nothing compares the roadmap groups those readers return. A 3.1 reader that returned different groups, or none at all, would still pass. The two-way test in E10 does not cover this: its red cases only touch the changed-file list, a missing batch folder and the s4 lock. Today the only difference between the two nguon-hang.mjs versions is inside the catch branch, so the current verdict is probably right by luck rather than by measurement. Fix: turn the result into JSON-safe data before comparing, for example `v instanceof Map ? [...v] : v`, and add a red case that changes one Map entry.
  rationale: AC-9 đòi bản 3.1 trả cùng kết quả với 3.0 cho bộ đọc nhóm kế hoạch, nhưng phép đo không so được gì nên không chứng minh được điều đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Check 8 + Coverage — the bảng Coverage leaves out kit files that changed in 3.1, including a new path where the machine merges the PR**
  Người dùng thấy gì: Bản kit mới có thêm một đường để phiên tự gộp PR khi người ký kèm lời «gộp khi CI xanh». Đường này đang tắt vì cờ chưa bật, nhưng hồ sơ và mô tả PR chưa nhắc tới, nên chủ kho có thể không biết.
  Căn cứ: Hiện không gây hại vì cờ đang tắt và không mất dữ liệu; chỉ cần ghi một dòng vào giới hạn đã biết và mô tả PR, sửa rất rẻ.
  file: `_acceptance/nang-kit-3-1/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Records — the spec repeats the Hỏi-3 line**
  Người dùng thấy gì: Tài liệu gửi chủ kho ở cổng phạm vi có một câu hỏi bị lặp hai lần. Người đọc chỉ thấy thừa một dòng.
  Căn cứ: Hậu quả gần như không có, không ảnh hưởng quyết định hay dữ liệu, và tài liệu đã được duyệt nên không đáng sửa lại.
  file: `docs/superpowers/specs/2026-11-22-nang-kit-3-1-design.md`
  severity: low
  Đề xuất: wont-fix

- **AC-9 measure reads another checkout's batch folder, and the contract does not say so**
  Người dùng thấy gì: Khi chấm từ bản sao ngoài, kiểm tra về đợt công việc đang đọc thư mục của bản làm việc chính chứ không phải bản đang chấm, mà hồ sơ không nói rõ điều đó.
  Căn cứ: Chỉ đọc, không làm mất hay đổi dữ liệu; ghi rõ vào giới hạn đã biết là đủ và rẻ.
  file: `_acceptance/nang-kit-3-1/rang/dot.mjs`
  severity: low
  Đề xuất: known-limits

- **Kit cache trusted by HEAD commit only**
  Người dùng thấy gì: Nếu bộ kit tải về tạm bị sửa tay thì phép đo vẫn tin nó là đúng và có thể cho kết quả xanh sai.
  Căn cứ: Rất hiếm xảy ra, chỉ ảnh hưởng máy chấm, người dùng tự khắc phục bằng cách xoá thư mục tạm và chạy lại.
  file: `_acceptance/nang-kit-3-1/rang/kit.mjs`
  severity: low
  Đề xuất: known-limits

- **Two-way test leaves temp folders behind**
  Người dùng thấy gì: Mỗi lần chạy kiểm tra hai chiều sẽ để lại vài thư mục tạm trên máy, chiếm chỗ dần.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu, hệ điều hành tự dọn thư mục tạm và người dùng xoá tay được.
  file: `_acceptance/nang-kit-3-1/rang/two-way.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hard-coded ROOT path (shape 6): settings.mjs measure() reads its own file from `root` but the base and ci.yml from repoRoot()**
  Người dùng thấy gì: Nếu sau này chấm trên một bản sao khác, phép đo cài đặt có thể so với nhánh gốc của bản đang giữ script thay vì bản đang chấm.
  Căn cứ: Hiện chưa có ai gọi theo cách đó nên chưa gây sai kết quả, không mất dữ liệu; ghi lại là đủ và sửa sau rẻ.
  file: `_acceptance/nang-kit-3-1/rang/settings.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
