---
schema_version: 1
feature: Ghi sáu quyết định lõi còn mở của hệ thiết kế theo lời chủ kho, và bộ chữ tiếng Việt của sổ hệ thiết kế
slug: design-decisions-40-of-40
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [config, docs]
status: implemented
veto_state: mo
veto_opened_at: 2026-11-26T06:30:00Z
approved_by:
approved_at:
---

# Acceptance Contract: design-decisions-40-of-40

## Context

PR #124, nhánh `claude/design-book-1cac12`, cắt từ `main` ở `50314af6`. Commit `902fc742` ghi vào sổ quyết định thiết kế
(`design/decisions.yaml`) sáu quyết định lõi còn mở: `terms`, `error-copy`, `test-screen-sizes`,
`reference-implementation`, `screen-ledger`, `screen-actions`. Lời chủ kho được ghi bằng lệnh `decide` của plugin
design-assembly. Năm quyết định trỏ vào phép kiểm kho đã có; mỗi bài kiểm được gắn tên quyết định bằng một dòng
`// decision:<id>` ở đầu tệp. `error-copy` là luật do người soát, cố ý không có phép kiểm. Commit cũng thêm
`design/book-words.json` (bộ chữ tiếng Việt của sổ hệ thiết kế) và một dòng nhật ký wiki.

Mã có trên nhánh trước khi có hồ sơ này: hồ sơ viết sau, vì cổng trước khi gộp đòi nó. Kế hoạch của vòng là kế hoạch đo,
không viết thêm mã.

Source input: lời chủ kho ngày 2026-11-26: «Phân tích và đề xuất cho tôi», rồi «Đồng ý, ghi cả 6 câu và mở PR», rồi
«Chạy cổng nghiệm thu».

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có các dòng
  `design-assembly: 25 decisions held by 36 checks, each seen failing on a changed copy`,
  `component manifest: design/component-registry.json is up to date (297 components)`, `determinism: 62/73 = 85%` và
  `Tests  2698 passed | 2 skipped (2700)`.
- AC-2: Given HEAD, When chạy lệnh kiểm tra (audit) của plugin design-assembly, Then nó nói 40 trong 40 quyết định lõi có
  câu trả lời, chia 14 có phép kiểm đã chạy lại, 19 có phép kiểm chưa chạy lại, 7 là lời người đã ghi, và mọi tầng ở
  trạng thái «đã đạt» hoặc «đủ, dựa trên phép kiểm chưa chạy lại»; khi một bài kiểm mất dòng gắn tên quyết định thì phép đo
  đỏ và nói 39 trên 40.
- AC-3: Given HEAD, When đọc trạng thái từng quyết định trong sáu quyết định, Then `error-copy` là lời người đã ghi, và mỗi
  quyết định còn lại có phép kiểm, đúng phép kiểm hợp đồng này nêu: `terms` ← `tests/language.test.ts`,
  `test-screen-sizes` ← `tests/e2e/frame.spec.ts`, `reference-implementation` ← `tests/proof-matrix-self.test.ts`,
  `screen-ledger` ← `tools/coverage_matrix/check.py`, `screen-actions` ← `tests/bo-nut-vai-man.test.ts`; khi một bài kiểm
  mất dòng gắn tên, hay một dòng trỏ sang bài kiểm khác, thì phép đo đỏ và gọi tên quyết định ấy.
- AC-4: Given HEAD, When đọc ghi chú của sáu dòng và bảng quyết định của plugin, Then mỗi ghi chú kết bằng
  `confirmed by Manh Phan on 2026-11-26: Đồng ý, ghi cả 6 câu`, không câu nào trong sáu câu còn chờ trên bảng, và bốn câu
  về màu (`color-roles-sidebar`, `color-roles-neutral`, `color-roles-status`, `color-roles-chart`) vẫn chờ, chưa câu nào
  được trả lời; khi một ghi chú trở lại «a person has not confirmed it» thì phép đo đỏ và gọi tên dòng ấy.
- AC-5: Given HEAD, When so dòng `test-screen-sizes`, các dự án trình duyệt của `playwright.config.ts` và ma trận trạng
  thái `design/states.md`, Then cả ba nói đúng 360, 414, 1024, 1440; khi dự án trình duyệt hay dòng sổ đổi một khổ thì phép
  đo đỏ và in khổ lệch.
- AC-6: Given chỗ nhánh rời `main` và HEAD, When so bốn bài kiểm được gắn tên, Then mỗi tệp đúng bằng bản ở chỗ rời cộng
  đúng một dòng đầu `// decision:<id>` của quyết định nó giữ, và `tools/proof_gate/proof-gate.test.ts` (tệp khoá theo dấu
  vân tay) không đổi; khi một tệp có thêm dòng khác, hay tệp khoá bị gắn tên, thì phép đo đỏ và gọi tên tệp.
- AC-7: Given chỗ nhánh rời `main` và HEAD, When kê tệp nhánh đổi, Then nhánh chỉ đổi `design/decisions.yaml`,
  `design/book-words.json`, bốn bài kiểm, đúng một tệp `wiki/log/`, thư mục `_acceptance/design-decisions-40-of-40/`, cùng
  `PRODUCT-MAP.md` và `LO-TRINH.html` khi mỗi trang đúng bằng bản bộ vẽ của kit vẽ lại;
  khi nhánh có thêm một tệp mã thì phép đo đỏ và gọi tên tệp.
- AC-8: Given `design/book-words.json` ở HEAD, When so với khuôn chữ của sổ (`book.mjs --words-template` của plugin), Then
  tệp là JSON, có đúng các khoá của khuôn, mục câu hỏi có đúng sáu mã quyết định, và không chứa giá trị màu hay tên kho;
  khi tệp thêm một khoá lạ, có một mã màu, hay thiếu một câu hỏi thì phép đo đỏ.
- AC-9: Given chỗ nhánh rời `main` và HEAD, When so mọi dòng khác của `design/decisions.yaml`, Then các dòng ngoài sáu dòng
  giữ nguyên chữ và thứ tự, và sáu dòng đều có mặt; khi một dòng khác bị sửa thì phép đo đỏ và gọi tên dòng ấy.

## Coverage

Phủ theo tệp nhánh đổi và theo từng bên đọc chúng. Không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp, hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| `design/decisions.yaml`, sáu dòng | AC-2, AC-3 (trạng thái), AC-4 (lời chủ kho), AC-5 (khổ màn) |
| `design/decisions.yaml`, mọi dòng khác | AC-9 |
| Bốn bài kiểm gắn tên | AC-6; AC-1 (chúng vẫn xanh trong `make check`) |
| Tệp khoá `tools/proof_gate/proof-gate.test.ts` | AC-6 (không đổi); AC-1 (bài khoá `proof-gate-0023` xanh) |
| `design/book-words.json` | AC-8 |
| Dòng nhật ký `wiki/log/` | AC-7 |
| Cổng design-assembly và độ tất định của kho đọc sổ | AC-1 |
| Bảng quyết định của plugin đọc sổ | AC-4 |
| Sổ hệ thiết kế vẽ bằng bộ chữ | Ngoài phép đo: sổ vẽ vào thư mục git bỏ qua, chủ kho đã xem bản vẽ |

## Out of scope

- Bốn câu về màu đang chờ chủ kho: không trả lời, không đổi.
- Phép kiểm cho màn tham chiếu của kiểu Đăng nhập và Danh sách khung: dòng sổ nói rõ chưa có.
- Phép kiểm máy cho câu báo lỗi: chủ kho chọn để người soát.
- Mười hai thành phần đang dùng mà sổ nhận khối chưa ghi, và hai mươi ba khối chưa ghim nguồn (bản kiểm kê ngày
  2026-11-26).
- Sửa plugin design-assembly hay bộ công cụ của nó trong kho (`tools/design-assembly/`).
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Mọi phép đo ở `rang/do.mjs` suy gốc kho từ vị trí của chính tệp đo và in mã HEAD của cây đã đo; chỗ rời `main` lấy bằng
  `git merge-base origin/main HEAD` hoặc `--base`.
- `rang/hai-chieu.mjs` dựng mỗi ca trên một bản sao mới của HEAD (`git clone --shared`, gói liên kết, bản kê thành phần
  do `make` vẽ chép vào vì git không giữ nó), xanh trước khi phá và đỏ sau khi phá.
- Phép đo đọc plugin design-assembly ở thư mục chủ kho cài (`$DA_PLUGIN`, mặc định
  `/Users/manhphan/dev/design-assembly/plugins/design-assembly`), bản 0.69.0 như dấu công cụ của kho.
- Gộp `main` vào nhánh thì số bài và chỗ rời có thể đổi: một dòng sổ `fix`, tiêu chí giữ nguyên nghĩa.
- Lần chạy đầu, `reference-implementation` trỏ vào `tools/proof_gate/proof-gate.test.ts`; bài khoá
  `proof-gate-0023.test.ts` đỏ vì tệp đã ký đổi. Dòng được trỏ sang `tests/proof-matrix-self.test.ts` trước commit
  `902fc742`, và AC-6 giữ tệp khoá không đổi.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-26:
  - Phản biện-1: phép đo chỉ thấy lời xác nhận của chủ kho trong ghi chú, không so nội dung sáu câu trả lời với đề xuất chủ
    kho đã đồng ý.
  - Phản biện-2: chưa có ca phá chứng rằng phép đo đỏ khi máy tự trả lời một câu về màu.
  - Phản biện-3: phép đo đỏ khi một tầng tụt, nhưng chưa có ca phá chứng điều đó.
  - Phản biện-4: hợp đồng không nói «sổ màn» được giữ bằng công cụ chạy trong kiểm toàn kho thay vì dòng gắn tên, và chưa
    có ca phá cắt mối nối ấy.
  - Phản biện-5: phép dò bộ chữ chỉ bắt mã màu hex, rgb, hsl, oklch và một cách viết tên kho.
- Vòng 2 (2026-11-26): gộp `main` có PR #123 (`7e08ffd1`) vào nhánh; số ghim của AC-1, AC-2 cập nhật và AC-7 nhận hai trang
  bộ vẽ của kit, theo dòng sổ `fix` cùng ngày. Chữ ký vòng 1 không áp cho bằng chứng vòng 2.
- Vòng 3 (2026-11-26): gộp `main` có PR #83 (`c68aeac2`) vào nhánh; số ghim của AC-1 cập nhật (297 thành phần, 2698 bài)
  theo dòng sổ `fix` cùng ngày. Máy chủ kho đã lên plugin design-assembly 0.76.0 nhưng kho vẫn ghi 0.69.0: phép đo chạy với
  `$DA_PLUGIN` trỏ vào bản 0.69.0 (commit `d52453d` của kho plugin). Chữ ký vòng 2 không áp cho bằng chứng vòng 3.
