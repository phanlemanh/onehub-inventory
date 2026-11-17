# Review findings: upgrade-design-assembly-0-7-0 (round 3)

## Trong hợp đồng

(không có finding nào)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Evidence: CI at the PR head is red and HEAD has no CI result**
  Người dùng thấy gì: The latest changes are not yet pushed or checked by the automatic pipeline, so the last visible run is red. Nothing is broken for end users; the branch just cannot be merged until the checks are re-run and go green.
  Căn cứ: No user-facing harm: the red run is on an older version and re-running the checks at the current version settles it with no separate work item.
  file: `_acceptance/upgrade-design-assembly-0-7-0/evidence-report.md`
  severity: medium
  Đề xuất: wont-fix

- **Records: decision 0030 lists the same link twice**
  Người dùng thấy gì: One internal note page lists the same reference twice. Users of the product never see it and nothing behaves differently.
  Căn cứ: Purely cosmetic in internal notes, harmless to users, and fixing it later costs almost nothing.
  file: `wiki/decisions/0030-so-man-khai-cua-vao-va-nut.md`
  severity: low
  Đề xuất: wont-fix

- **Tests: comments still promise a drift check that the committed table no longer gives**
  Người dùng thấy gì: A comment in the tests still says a permission change would show up as a mismatch, but the table is now regenerated each time. A reader could be misled; the product itself is unaffected.
  Căn cứ: Only misleads developers reading the comment, never users, and the owner already accepted it as a known limit.
  file: `tests/e2e-db/vai-man.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Records: no decision page for moving the ledgers out of git (AGENTS.md: significant technical choice)**
  Người dùng thấy gì: The team has no written explanation of why the design ledgers were moved out of version control. End users see no effect; future maintainers may have to guess the reason.
  Căn cứ: No effect on users and no data at risk; the owner already accepted it and the page can be written later at low cost.
  file: `wiki/log.md`
  severity: low
  Đề xuất: known-limits

- **Personal data: record files contain absolute paths with the machine's username**
  Người dùng thấy gì: Some internal record files include the developer's computer username in file paths. Customers are not affected, but it is a small amount of personal information kept in the repository.
  Căn cứ: Low exposure limited to a machine username in internal records, already accepted by the owner, and removable later by editing the files.
  file: `_acceptance/upgrade-design-assembly-0-7-0/s4-args-r2.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): bài đỏ phía nhánh của change-list nạp danh sách tay qua --branch-changes nên đường đọc merge-base mới sửa không bao giờ chạy**
  Người dùng thấy gì: The check that decides which files the branch changed is not proven to catch a wrongly added file through its real path. This affects only the review process, so a stray change could in theory go unnoticed, not harm customers.
  Căn cứ: No customer impact; it only weakens one internal safety check, and a fresh review can still catch stray changes.
  file: `_acceptance/upgrade-design-assembly-0-7-0/rang/measures-two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Design / Records: skill and proof-gate template tell agents to write ledger lines into a derived, gitignored copy (r2)**
  Người dùng thấy gì: Người làm theo hướng dẫn trong kỹ năng sẽ ghi dòng mới vào một bản sao tạm thời. Dòng đó không vào git và bị ghi đè ở lần chạy sau, nên việc của họ lặng lẽ mất.
  Căn cứ: Mất công việc mà không báo lỗi nên dễ gặp lại, nhưng chỉ ảnh hưởng người làm theo hướng dẫn và sửa rẻ bằng một thay đổi riêng về lời dặn.
  file: `.claude/skills/inventory-ui/SKILL.md`
  severity: high
  Đề xuất: new-contract

- **Design: Python readers prefer the stale out-of-git copy over the fragment folder (the real ledger) (r2)**
  Người dùng thấy gì: Sau khi sửa sổ mà chưa vẽ lại, cổng chứng minh có thể chấm theo dữ liệu cũ nên cho kết quả xanh hoặc đỏ sai.
  Căn cứ: Chỉ sai trong khoảng giữa lúc sửa và lúc vẽ lại, tự hết khi chạy make check, không mất dữ liệu nào.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **Proof gate: row 1q and registry lookups turn off silently when design/component-registry.json is absent (r2)**
  Người dùng thấy gì: Khi chạy cổng chứng minh riêng trên bản tải mới, một linh kiện thêm mà chưa kê có thể vẫn báo xanh.
  Căn cứ: Chỉ xảy ra khi bỏ qua make check, còn make check vẫn bắt được, nên hậu quả nhẹ và người dùng cuối không thấy.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: role × screen × button drift guard is now vacuous, test descriptions still promise it (r2)**
  Người dùng thấy gì: Bài kiểm về bảng quyền theo vai, màn, nút không còn bắt được lệch nữa dù lời mô tả vẫn hứa vậy, nên một thay đổi quyền sai có thể lọt.
  Căn cứ: Là hàng rào bị yếu đi chứ không phải lỗi đang hiện ra, và việc lệch quyền vẫn còn bài kiểm khác giữ một phần.
  file: `tests/bo-nut-vai-man.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Records: no wiki decision for taking ledgers out of git; decision 0034 now states a check that no longer holds (r2)**
  Người dùng thấy gì: Nhóm không có trang ghi lại vì sao sổ ra khỏi git, và một trang cũ còn nói điều đã không còn đúng, nên người đọc sau có thể hiểu sai.
  Căn cứ: Chỉ là tài liệu, không ảnh hưởng người dùng cuối, bổ sung sau rất rẻ.
  file: `wiki/decisions/0034-component-register-written-by-design-assembly.md`
  severity: medium
  Đề xuất: known-limits

- **CI and tooling: wiki front-matter links and make targets depend on derived files that a clean checkout lacks (r2)**
  Người dùng thấy gì: Chạy riêng một số lệnh kiểm trên bản tải mới có thể báo đỏ với lời báo sai nguyên nhân.
  Căn cứ: Chạy make check đầy đủ vẫn đúng, chỉ gây nhầm cho người chạy lẻ và họ tự gỡ được bằng cách chạy lại đủ.
  file: `mk/derived.mk`
  severity: medium
  Đề xuất: known-limits

- **Secrets: gitleaks detect reports 2 leaks introduced by the branch (false positives, not allowlisted) (r2)**
  Người dùng thấy gì: Công cụ quét bí mật báo hai cảnh báo giả trong tệp hồ sơ, có thể làm đỏ lần quét toàn lịch sử và gây hoang mang.
  Căn cứ: Không có bí mật thật bị lộ, chỉ gây báo động giả, và có thể xử lý bằng cách thêm ngoại lệ sau.
  file: `_acceptance/upgrade-design-assembly-0-7-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **Personal data: committed record carries absolute local paths with the machine username (r2)**
  Người dùng thấy gì: Tệp hồ sơ lộ tên người dùng máy và cách tổ chức thư mục cá nhân của chủ kho.
  Căn cứ: Thông tin lộ ở mức thấp, không phải mật khẩu hay dữ liệu khách, nhưng đã vào lịch sử git nên khó gỡ hẳn.
  file: `_acceptance/upgrade-design-assembly-0-7-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **Records: duplicate front-matter link in decision 0030 (r2)**
  Người dùng thấy gì: Một trang quyết định có hai liên kết giống nhau, người đọc không bị ảnh hưởng gì.
  Căn cứ: Chỉ là lỗi thẩm mỹ trong tài liệu, không ảnh hưởng ai, nên không đáng mở việc riêng.
  file: `wiki/decisions/0030-so-man-khai-cua-vao-va-nut.md`
  severity: low
  Đề xuất: wont-fix

- **Design / Records: the skill and the proof-gate template tell people to add a line to a derived, gitignored file (r1)**
  Người dùng thấy gì: Hướng dẫn cho tác tử vẫn chỉ vào một tệp sao chép tự sinh, nên dòng khai báo khối mới thêm theo hướng dẫn sẽ bị ghi đè và không bao giờ vào kho. Người làm theo sẽ tưởng đã khai báo xong mà thực tế khối không được nhận.
  Căn cứ: Hậu quả vừa phải: công sức bị mất lặng lẽ nhưng chỉ xảy ra khi có người làm theo hướng dẫn cũ, phát hiện được khi khối không xuất hiện, và sửa lời hướng dẫn là việc rẻ nhưng nên đi kèm sửa kiểm tra liên quan nên tách thành việc riêng.
  file: `.claude/skills/inventory-ui/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **CI and tooling: wiki front-matter links point at derived files, so `make ontology` and `make coverage-matrix` fail on a clean checkout (r1)**
  Người dùng thấy gì: Trên bản tải mới, chạy riêng lệnh kiểm tra ontology hoặc ma trận phủ sẽ báo đỏ với thông báo chỉ sai nguyên nhân. Chạy lệnh kiểm tra tổng thì vẫn xanh, nên người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ gây nhầm lẫn cho người phát triển khi chạy lẻ từng lệnh, không mất hay lộ dữ liệu, chạy lại lệnh tổng là qua, nên ghi nhận là hạn chế đã biết.
  file: `wiki/decisions/0030-so-man-khai-cua-vao-va-nut.md`
  severity: medium
  Đề xuất: known-limits

- **Records: a duplicate front-matter link in decision 0030 (r1)**
  Người dùng thấy gì: Một trang ghi chép quyết định liệt kê trùng một liên kết. Người dùng không thấy khác biệt nào.
  Căn cứ: Hoàn toàn vô hại với người dùng, không mất dữ liệu, chi phí sửa nhỏ nhưng lợi ích gần như bằng không nên chấp nhận và ghi vết.
  file: `wiki/decisions/0030-so-man-khai-cua-vao-va-nut.md`
  severity: low
  Đề xuất: wont-fix

- **Criteria and tests: the drift guard for the role x screen x button table no longer guards anything, and its descriptions were not updated (r1)**
  Người dùng thấy gì: Bảng vai trò, màn hình và nút bấm không còn được so sánh để phát hiện lệch, nên đổi quyền làm thay đổi nút hiển thị có thể không bị bắt sớm. Lời chú thích trong bài kiểm vẫn hứa điều đã không còn đúng.
  Căn cứ: Rủi ro thật là lệch quyền không bị bắt tự động, nhưng đây là hệ quả của quyết định đã được chủ kho duyệt và các bài kiểm quyền khác vẫn còn, nên ghi lại thành hạn chế đã biết.
  file: `tests/e2e-db/vai-man.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Proof gate passes green with no component registry: row 1q and the registry lookups turn off without a word (r1)**
  Người dùng thấy gì: Khi chạy cổng chứng minh riêng trên bản tải mới, một linh kiện thêm lén không có dòng khai báo vẫn được báo là đạt. Cổng im lặng bỏ qua một phép kiểm mà không cảnh báo.
  Căn cứ: Nặng vì cổng cho kết quả xanh sai và người dùng tin là đã kiểm, nhưng chỉ xảy ra khi chạy riêng cổng, đường chạy chuẩn qua lệnh tổng vẫn bắt được, và sửa cần thiết kế riêng nên tách thành việc mới.
  file: `tools/proof_gate/model.py`
  severity: high
  Đề xuất: new-contract

- **Python readers take the stale out-of-git copy over the folder, which is the real ledger; JS readers take the folder (r1)**
  Người dùng thấy gì: Nếu bản sao tự sinh đã cũ, cổng chứng minh và ma trận phủ có thể đánh giá theo dữ liệu cũ và vẫn báo xanh. Người sửa sổ màn hay sổ khối có thể thấy kiểm tra đạt dù thay đổi chưa được xét.
  Căn cứ: Có thể cho kết quả sai lặng lẽ nhưng chỉ khi chạy riêng sau khi sửa sổ mà chưa vẽ lại, đường chạy chuẩn vẽ lại trước nên bắt được, vẫn cần một việc sửa riêng để đồng bộ thứ tự đọc.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: new-contract

- **`make design` and `make coverage-matrix` read derived files but never write them first; `make check` passes only because of target order (r1)**
  Người dùng thấy gì: Chạy riêng lệnh kiểm thiết kế hoặc ma trận phủ trên bản tải mới sẽ đỏ với lời báo sai nguyên nhân, và chạy song song lệnh tổng cũng có thể hỏng. Chạy tuần tự lệnh tổng vẫn xanh.
  Căn cứ: Gây phiền cho người phát triển nhưng không ảnh hưởng người dùng cuối hay dữ liệu, người chạy tự khắc phục được bằng cách chạy lệnh tổng hoặc vẽ lại tệp, nên ghi nhận là hạn chế đã biết.
  file: `mk/derived.mk`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: phép đo AC-8 chỉ assert dòng 'gate passes' và số khối, không đo việc cổng thực sự đọc thư mục màn design/screens (r1)**
  Người dùng thấy gì: Phép đo nghiệm thu chưa chứng minh cổng thực sự đọc được các màn từ thư mục mới, nên nếu cổng đọc ra không màn nào thì phép đo vẫn xanh. Lời tuyên rằng cổng vẫn bật khi chỉ có thư mục mảnh mới được chứng một nửa.
  Căn cứ: Là lỗ hổng trong độ tin cậy của bằng chứng chứ không phải lỗi sản phẩm, không mất dữ liệu, bổ sung phép đo là việc riêng khá rẻ nhưng nằm ngoài tiêu chí đã ký.
  file: `_acceptance/upgrade-design-assembly-0-7-0/rang/proof-gate-fragments.mjs`
  severity: high
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
