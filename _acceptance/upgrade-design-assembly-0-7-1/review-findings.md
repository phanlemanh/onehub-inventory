# Review findings: upgrade-design-assembly-0-7-1 (round 1)

## Trong hợp đồng

- **Criteria and tests: phép đo của AC-4 không kiểm mã thoát khác 0**
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/shallow-bite.mjs:55`
  severity: medium
  AC: AC-4
  source: invariants
  detail: AC-4 (contract.md) đòi: thêm design/patterns/trang-moi.md thì `make design-assembly` không thoát 0; thêm tests/the-thu.test.ts gắn thẻ decision:khong-co-hang thì lệnh cũng không thoát 0. Nhưng shallow-bite.mjs dòng 55 và 57 chỉ kiểm `page.out` và `tag.out` có dòng ghim (`page.code` và `tag.code` không được đọc). Chỉ ca fixtures (dòng 60-62) kiểm `fixtures.code === 0`. Nếu cổng in đúng lời nhưng thoát 0, ví dụ khi hàng bị hạ xuống debt hay cảnh báo, thì E6 vẫn xanh, và E7 (--omit-checks) cũng không bắt được. Như vậy nửa 'không thoát 0' của AC-4 không có phép đo nào đỏ khi thiếu thay đổi. Cách sửa: thêm `if (page.code === 0) found.push(...)` và `if (tag.code === 0) found.push(...)`, kèm một ca đỏ trong shallow-two-way.mjs.

- **Assert về cổng ở BASE luôn đúng, nên phía đỏ của shallow-check không chứng được điều nó tự nhận**
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/shallow-two-way.mjs:41`
  severity: medium
  AC: AC-2
  source: bugs
  detail: Dòng `assert.ok(!out.includes(`did not say: ${gateLine(BASE_GATE)}`))` luôn đúng. shallow-check.mjs chỉ in `make check did not say: X` cho các dòng có trong `mustSay = [gateLine(GATE), manifestLine(N)]`, nên không bao giờ in dòng 17/25. Khi make check xanh, nó cũng không in lại đầu ra của make check. Chú thích của test và quyết định d-25 nói rằng ở 8925e8ff cổng giữ 17 bởi 25 và dòng manifest 294 vẫn in, để thiếu dòng 295 chứng được rằng chỗ ghim manifest tự cắn. Thực tế không có gì kiểm điều đó. Nếu make check ở BASE hỏng sớm, trước khi in cổng và manifest, hai dòng 'did not say' vẫn xuất hiện, exit vẫn là 1, và test vẫn đạt. Vậy E3 coi chỗ ghim 295 là đã thấy cắn mà không có bằng chứng.

- **shallow-bite không kiểm mã thoát ở ca trang mới và ca thẻ lạ, dù AC-4 đòi lệnh không thoát 0**
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/shallow-bite.mjs:59`
  severity: medium
  AC: AC-4
  source: bugs
  detail: AC-4 trong contract.md đòi `make design-assembly` không thoát 0 khi thêm design/patterns/trang-moi.md, và cũng vậy khi thêm tests/the-thu.test.ts. Ở hai ca `page` và `tag`, phép đo chỉ kiểm `out.includes(NEW_PAGE.line)` và `out.includes(UNTOLD_TAG.line)`, bỏ qua `page.code` và `tag.code`. Chỉ ca fixtures mới kiểm `fixtures.code === 0`. Giả sử công cụ in dòng ấy dưới dạng ghi chú hay nợ (debt) mà không chặn cổng: exit 0, trang mới lọt qua, mà E6 vẫn xanh. Đây đúng là kiểu lọt im lặng mà hai hàng owner-calls và decision-sheet sinh ra để chặn.

- **Hình dạng 4 (assertion âm tính một mình): assert về cổng 17/25 tại 8925e8ff không bao giờ có thể đỏ**
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/shallow-two-way.mjs:41`
  severity: high
  AC: AC-2
  source: measurement
  detail: Ca 'shallow-check: red on 8925e8ff' chạy assert.ok(!out.includes(`did not say: ${gateLine(BASE_GATE)}`)). Nhưng shallow-check.mjs chỉ đưa vào mustSay hai giá trị gateLine(GATE) (19/27) và manifestLine(--components), nên nó không bao giờ in dòng 'did not say: ...17 decisions held by 25 checks...'. Phép phủ định này đúng với mọi đầu ra, nên không đo được gì. Lời chú ở dòng 31 nói 'at BASE the gate holds 17 by 25, and the manifest line still says 294', E1 và E3 trong evals.yaml cũng dựa vào điều đó, nhưng không có đối chứng dương nào xác nhận đầu ra ở BASE thật sự có gateLine(BASE_GATE) hay manifestLine(294). shallow-check.mjs cũng không in lại đầu ra thô của make, chỉ in 6 dòng cuối khi lỗi. Vì vậy hai dòng đỏ 'did not say 19/27' và 'did not say ...295 components' vẫn khớp nếu make check ở BASE chết sớm, trước khi cổng hay manifest chạy. Ca đỏ này không phân biệt được 'cổng in 17/25' với 'không chạy tới cổng'.

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): rows-mirror hứa 'nothing else changed in the two files' nhưng chỉ ledger có ca đỏ**
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/measures-two-way.mjs:83`
  severity: medium
  AC: AC-6
  source: measurement
  detail: Dòng xanh của rows-mirror.py (và của E10) là '...nothing else changed in the two files since 8925e8ff'. Lời hứa gồm hai phần tử: design/decisions.yaml và design/theme.json. Trong measures-two-way.mjs và E16 chỉ có ca đỏ 'design/decisions.yaml changed beyond the two rows'. Thông điệp 'design/theme.json changed beyond the two checks since 8925e8ff' (rows-mirror.py:93) chưa từng được thấy đỏ. Tương tự ở ca tool-tree (dòng 45): dòng xanh hứa 'the stamp says the same' (cả version lẫn tree), nhưng chỉ có ca đỏ cho version 0.7.0. Nhánh 'the stamp's tree ... is not the tree of version 0.7.1' (tool-tree.mjs:25) không có ca đỏ. Tệp này tự đặt quy tắc 'A measure never seen red proves nothing', mà số ca đỏ lại ít hơn số phần tử được hứa.

- **Hình dạng 3 (chuỗi có mặt thay cho giá trị ghim): số bài 2460/2 bỏ qua không được phép đo so**
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/shallow-check.mjs:28`
  severity: low
  AC: AC-1
  source: measurement
  detail: matrix.mjs ghim TESTS = { passed: 2460, skipped: 2 }, nhưng không phép đo nào đọc hằng này (grep trong rang/ chỉ thấy chỗ định nghĩa). shallow-check.mjs chỉ đòi out.match(/Tests\s+(\d+) passed/) có mặt rồi in lại số tìm được ở dòng 34. Số bài sai vẫn ra exit 0, số bỏ qua không được đọc, và không có ca đỏ nào cho số bài. Lời hứa '2460 tests passed' của E2 chỉ được người chấm so bằng mắt, không phải do phép đo ghim.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records: số dòng đổi của owner-calls.mjs trong design doc sai**
  Người dùng thấy gì: Tài liệu thiết kế ghi sai số dòng thay đổi của một công cụ. Người dùng cuối không thấy gì, chỉ người duyệt có thể đọc nhầm quy mô thay đổi.
  Căn cứ: Hậu quả nhẹ, chỉ là con số trong tài liệu nội bộ, không mất dữ liệu và sửa lại rất rẻ bất cứ lúc nào.
  file: `docs/superpowers/specs/2026-11-18-upgrade-design-assembly-0-7-1-design.md`
  severity: low
  Đề xuất: known-limits

- **Records: không có trang quyết định trong wiki, và phép đo AC-8 cấm thêm**
  Người dùng thấy gì: Lý do lâu dài của thay đổi chưa có trang riêng trong wiki, nên người đến sau khó tìm hiểu vì sao có hai chặn mới. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ, chỉ ảnh hưởng việc tra cứu nội bộ, lý do vẫn có ở hồ sơ nghiệm thu và nhật ký, và hồ sơ 0.7.0 trước đó cũng không có trang này.
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/measures-two-way.mjs`
  severity: low
  Đề xuất: known-limits

- **owner-calls.mjs ghi đè GIT_SSH_COMMAND, làm mất core.sshCommand và GIT_SSH của người dùng khi fetch trên bản sao nông**
  Người dùng thấy gì: Trên máy hoặc CI dùng khóa ssh riêng để lấy mã, hai chặn mới có thể báo không lấy được dữ liệu từ kho gốc và làm lượt kiểm đỏ. Hiện CI dùng HTTPS nên chưa gặp.
  Căn cứ: Hậu quả nhẹ và hiện ra rõ ràng chứ không âm thầm, không mất dữ liệu; chỉ dính khi đổi cách xác thực, và lỗi nằm ở plugin nên sửa ở đó.
  file: `tools/design-assembly/owner-calls.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
