## Trong hợp đồng

- **The spacing-unit source check ignores a --spacing set in any unit other than rem and quietly falls back to Tailwind's default**
  AC: AC-3
  file: `_acceptance/bring-out-claude-design/rang/bundle.mjs:105`
  severity: low
  source: bugs
  detail: The comment says the stylesheet's own --spacing is used "when it sets one". But spacingOf() only matches `--spacing: <number>rem;`. If src/app/globals.css sets `--spacing: 4.8px;` or `--spacing: calc(...)`, ownSpacing comes back undefined. The code then reads node_modules/tailwindcss/theme.css instead, which gives 0.25rem = 4px. So the bundle's 4px matches a source the repo has overridden, and the measure stays green with no warning. The new red case only covers an override written in rem (0.3rem), so it does not catch this. A fix: if the stylesheet has any `--spacing:` line that is not in rem, record it as a finding (or convert px too). Do not drop to the Tailwind fallback in that case. Everything else in this round checks out: I ran two-way --only bundle and --only leave and every case held, and the case counts in evals.yaml (12, 9, 43) match two-way.mjs.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **No real personal data in repo (AGENTS.md): owner's machine paths committed in the acceptance files**
  Người dùng thấy gì: Các tệp nghiệm thu lưu sẵn đường dẫn trên máy của chủ kho, nên phép đo mặc định chỉ chạy trên máy ấy và tên tài khoản của chủ kho nằm trong kho. Gói gửi cho Claude Design vẫn sạch.
  Căn cứ: Hậu quả nhẹ: không lộ dữ liệu khách hay gói gửi đi, chỉ là tên tài khoản chủ kho và phép đo khó chạy trên máy khác; chủ kho đã chấp nhận thói quen này ở nhiều hồ sơ, và sửa sau cũng rẻ.
  file: `_acceptance/bring-out-claude-design/rang/matrix.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (the promise is a relation, but only the check against a fixed constant is pinned): the round-1 fix compares typefaces to their source, yet no break case pins that comparison's message**
  Người dùng thấy gì: Nếu phép so kiểu chữ của gói với nguồn bị hỏng, vẫn có một phép kiểm khác bắt được trường hợp đổi phông sang khác Inter. Chỉ thiếu một ca thử riêng chứng minh phép so ấy tự đỏ.
  Căn cứ: Hậu quả nhẹ: lỗi kiểu chữ vẫn bị bắt bằng phép kiểm khác, không có gì lọt tới người dùng; thêm ca thử sau cũng rẻ.
  file: `_acceptance/bring-out-claude-design/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (a lone negative assertion with no pinned message): leave.mjs now checks the 'to:' and 'the leave is given' lines exactly, but no break case makes either check fail**
  Người dùng thấy gì: Phép kiểm bước gửi đã chặt hơn nhưng chưa có ca thử nào chứng minh nó đỏ khi chỗ nhận bị đổi hoặc dòng nói phép đã có biến mất. Chưa rõ phép ấy có thật sự bắt được hai lỗi này.
  Căn cứ: Hậu quả nhẹ: các lỗi gửi sai nơi hoặc ba tệp vẫn có ca thử bắt; thêm hai ca thử là việc rẻ và làm sau được.
  file: `_acceptance/bring-out-claude-design/rang/leave.mjs`
  severity: medium
  Đề xuất: known-limits

- **AGENTS.md: no real personal data in the repo (owner email in contract front matter) (r1)**
  Người dùng thấy gì: Địa chỉ thư thật của chủ kho nằm trong hồ sơ nghiệm thu, giống 78 hồ sơ khác. Người dùng cuối không thấy nó, nhưng nó nằm trong kho mã.
  Căn cứ: Nhẹ: không lộ ra khách hay màn hình nào, đây là thói quen chung của cả bộ hồ sơ nên sửa riêng một hồ sơ là không đủ và nên làm một lần cho cả bộ.
  file: `_acceptance/bring-out-claude-design/contract.md`
  severity: low
  Đề xuất: known-limits

- **Machine path of the owner's computer in a record and a measure (beside AC-6's own rule) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép đo gửi chỉ chạy được trên máy của chủ kho trừ khi đặt biến chỉ chỗ khác. Tên thư mục của chủ kho cũng nằm trong kho mã.
  Căn cứ: Nhẹ: không ảnh hưởng người dùng sản phẩm, chỉ làm việc chấm trên máy khác phải đặt thêm một biến, và hồ sơ đã ghi điều này.
  file: `_acceptance/bring-out-claude-design/rang/matrix.mjs`
  severity: low
  Đề xuất: known-limits

- **Record honesty: the push record keeps only the last push, not every push (r1)**
  Người dùng thấy gì: Sổ lần gửi chỉ còn lần gửi gần nhất, dù đã gửi ba lần ra dịch vụ ngoài. Người xem lại sau này không thấy đủ lịch sử các lần gửi.
  Căn cứ: Vừa phải: không mất dữ liệu sản phẩm, lịch sử vẫn còn trong lịch sử git, và sửa rẻ bằng cách ghi rõ tệp chỉ giữ lần cuối.
  file: `design/export/pushed.json`
  severity: low
  Đề xuất: known-limits

- **default.mjs says it checks the push record for the waiting default, but the code never does (r1)**
  Người dùng thấy gì: Chú thích của phép đo hứa kiểm một điều mà thực tế nó không kiểm. Nếu sau này có lần gửi ghi nhầm là tài khoản đã có mặc định, phép đo vẫn xanh.
  Căn cứ: Nhẹ: tiêu chí vẫn đúng, chỉ là lời chú thích hứa quá và người đọc có thể tin nhầm; sửa chú thích rất rẻ.
  file: `_acceptance/bring-out-claude-design/rang/default.mjs`
  severity: low
  Đề xuất: known-limits

- **bundle.mjs ignores whether writing the component manifest worked (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi bước chuẩn bị sổ linh kiện hỏng, phép đo báo đỏ nhưng không nói vì sao, nên người chấm phải tự tìm nguyên nhân.
  Căn cứ: Nhẹ: kết quả vẫn đỏ nên không có gì lọt qua, chỉ tốn thêm thời gian tìm nguyên nhân.
  file: `_acceptance/bring-out-claude-design/rang/bundle.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (a class sweep checked with only point cases): the private-data sweep has no full matrix of break cases for each pattern (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép quét dữ liệu riêng tư mới được thử đỏ với một phần các dạng khoá và số điện thoại. Một lỗi gõ ở dạng chưa thử có thể làm quét bỏ sót mà không ai biết.
  Căn cứ: Vừa phải: các bản xuất hiện sạch và các dạng chính đã được thử, rủi ro là bỏ sót về sau; thêm ca thử rẻ nhưng không cấp bách.
  file: `_acceptance/bring-out-claude-design/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 6 (a hardcoded path): the send step runs from the author's own plugin checkout instead of the plugin the tree under test uses (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép đo gửi chạy bản plugin có sẵn trên máy chủ kho, nên kết quả phụ thuộc bản đó và không chạy được trên máy khác nếu không đặt biến.
  Căn cứ: Vừa phải: không ảnh hưởng người dùng sản phẩm, hạn chế đã ghi trong hồ sơ và người chấm trên máy khác chỉ cần đặt một biến.
  file: `_acceptance/bring-out-claude-design/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
