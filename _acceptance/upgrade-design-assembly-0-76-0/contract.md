---
schema_version: 1
feature: Lên đời công cụ design-assembly từ 0.69.0 lên 0.76.0 bằng lệnh upgrade và viết 13 chữ tiếng Việt cho trang logo và bộ biểu tượng của sổ thiết kế — không quyết định thiết kế nào đổi trạng thái
slug: upgrade-design-assembly-0-76-0
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci, docs]
status: draft
design_doc: docs/superpowers/specs/2026-11-26-upgrade-design-assembly-0-76-0-design.md
---

# Acceptance Contract: upgrade-design-assembly-0-76-0

## Context

PR #128, nhánh `chore/design-assembly-0.76.0`, cắt từ `main` ở `f1fd7038`. Commit `afcb1ca2` đã chạy `upgrade` của plugin
design-assembly 0.76.0 (bản xem trước thoát 0: không mất mục nào, cổng design-assembly xanh): 11 tệp công cụ và dấu phiên
bản; cùng commit thêm 13 chữ tiếng Việt mà khuôn chữ của sổ 0.76.0 có thêm cho trang logo và bộ biểu tượng
(`design/book-words.json`) và một dòng nhật ký wiki. Lệnh upgrade không đổi bước cổng, `design/theme.json`, lint hay bài
kiểm nào.

Nhánh đổi `tools/**`, nên cổng trước khi gộp đòi hồ sơ có chữ ký người. Trên PR, mọi kiểm khác đã xanh.

Source input: phiên «Book hệ thiết kế cho toàn kho Inventory» giao việc ngày 2026-11-26 (máy chủ kho đã lên 0.76.0; hồ sơ
`design-decisions-40-of-40` đỏ phép đo khuôn chữ với 0.76.0), rồi «chạy» cho vòng nghiệm thu; design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có các dòng
  `design-assembly: 25 decisions held by 36 checks, each seen failing on a changed copy`,
  `component manifest: design/component-registry.json is up to date (297 components)`, `determinism: 62/73 = 85%` và
  dòng số bài mà ma trận ghim (cây hiện tại: `Tests  2698 passed | 2 skipped (2700)`).
- AC-2: Given HEAD, When chạy riêng cổng design-assembly và lệnh tính độ tất định của nó, Then cổng in dòng 25/36 như
  trong AC-1, lệnh tính in `determinism rate: 62/73 (85%)` cùng `25 held and re-run here, 37 claimed by another check and
  not re-run`; khi `design/theme.json` của một bản chép mất một phép kiểm thì phép đo đỏ vì cổng không in dòng 25/36.
- AC-3: Given thư mục `tools/design-assembly/`, `design/tool-stamp.json` và `mk/design-assembly.mk` ở HEAD, When tính mã
  git từ tên và nội dung tệp, Then dấu phiên bản ghi `0.76.0`, thư mục có 51 tệp và mã cây
  `80ed15e5d52b6cd1682e5a299772586e0854ee35`, dấu ghi cùng mã, `mk/design-assembly.mk` có mã
  `a9af3d808fc7f156d659ada3f6528cfe3482264c`; và plugin đã cài trên máy ghi phiên bản `0.76.0` trong tệp khai của nó, sổ
  phát hành ghi đúng mã cây ấy, thư mục mẫu công cụ có mã cây ấy, mẫu bước cổng có mã của `mk/design-assembly.mk`.
- AC-4: Given sổ thiết kế ở HEAD, When chạy lệnh tính độ tất định một lần với công cụ 0.76.0 ở HEAD và một lần với công cụ
  0.69.0 của `f1fd7038` (mỗi lần công cụ tự viết sổ linh kiện trước, như `make check`), Then cả hai thoát 0 và cho mỗi
  quyết định trong 73 quyết định cùng một trạng thái; khi phía 0.69.0 đọc một `design/theme.json` mà quyết định `raw-table`
  mất phép kiểm thì phép đo đỏ và gọi tên `raw-table`.
- AC-5: Given một bản sao của HEAD, When chạy lệnh kiểm tra (audit) của plugin đã cài, Then nó in
  `coverage: 40 of 40 core decisions answered (14 held and re-run here, 19 claimed and not re-run, 7 recorded)`; khi sổ
  quyết định của bản sao mất dòng `error-copy` thì phép đo đỏ với `39 of 40`.
- AC-6: Given `design/book-words.json` ở HEAD, When so với khuôn chữ của sổ (`book.mjs --words-template` của plugin đã cài),
  Then tệp có đúng các khoá của khuôn (ngoài `questions`), sáu câu hỏi của PR #124, và mỗi khoá trong 13 khoá `brand…` là
  một câu tiếng Việt riêng: không rỗng, khác chữ tiếng Anh của khuôn, ở dạng Unicode NFC, không có dấu chấm than, emoji,
  giá trị màu, tên kho, dấu thanh kiểu cũ hay chữ «sàn»; bảng `rang/brand-words.md` đúng bằng chữ của khuôn và của tệp.
  Mỗi lỗi ấy trên một bản chép làm phép đo đỏ và gọi tên khoá.
- AC-7: Given một bản sao của HEAD, When plugin vẽ sổ thiết kế, Then sổ được viết (thoát 0, hoặc 1 kèm lời «note: the components are not drawn» của chính lệnh), nói 40/40 và không có trang logo (kho
  chưa có dòng logo hay bộ biểu tượng); và trên ba bản sao được thêm dòng mẫu — một bộ biểu tượng có cỡ và nét, một bộ không
  có, một dòng logo trỏ tệp không có — trang logo hiện cả 13 chữ tiếng Việt đúng chỗ của nó (trong đúng khung chữ quanh nó: tiêu đề mục logo, tiêu đề mục bộ biểu
  tượng, «… 16, 20 px», «… <code>tệp</code>»…) và không chữ tiếng Anh nào của khuôn cho 13 khoá ấy. Khi một khoá vắng hay mang
  chữ tiếng Anh thì phép đo đỏ và gọi tên khoá. Chữ của một khoá có đúng nghĩa khoá ấy không (ví dụ hai khoá tráo chữ cho
  nhau) là việc của AC-9: sổ luôn đặt chữ của khoá vào chỗ của khoá, nên phép vẽ không phân biệt được.
- AC-8: Given commit `afcb1ca2`, When kê tệp nó đổi so với cha, Then đúng 14 tệp của ma trận; và từ chỗ nhánh rời
  `origin/main` tới HEAD, nhánh không đổi tệp nào ngoài các tệp ấy, thư mục `_acceptance/upgrade-design-assembly-0-76-0/`,
  `docs/superpowers/specs/2026-11-26-upgrade-design-assembly-0-76-0-design.md` và
  `docs/superpowers/plans/2026-11-26-upgrade-design-assembly-0-76-0.md`, cùng `PRODUCT-MAP.md` và `LO-TRINH.html` khi mỗi
  trang đúng bằng bản bộ vẽ của kit vẽ lại từ hồ sơ ở HEAD. Khi nhánh đã vào `origin/main`, phép đo chỉ so commit và nói
  đúng điều đó.
- AC-9 (judgment): Given bảng `rang/brand-words.md` và `design/language.md`, When một hội đồng đọc 13 câu tiếng Việt cạnh câu
  tiếng Anh của khuôn, Then mỗi câu nói cùng điều câu tiếng Anh nói, viết hoa chữ đầu như câu tiếng Anh của khuôn (câu đứng riêng
  viết hoa, mảnh ghép giữa dòng viết thường), và không dùng chữ mà `design/language.md` bảo tránh. Chọn «Logo» hay chữ khác
  cho «the mark» là câu Hỏi-3 của chủ kho, không phải của hội đồng.

## Coverage

Phủ theo tệp của commit `afcb1ca2` và từng bên đọc bị đổi. Không quét không gian tiêu chí: dòng sổ `descope` «bỏ
coverage-scan».

| Tệp của commit, hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| 11 tệp công cụ trong `tools/design-assembly/` | AC-3 (cây bằng bản phát hành); AC-1, AC-2 (cổng xanh, cùng số); AC-4 (không quyết định nào đổi trạng thái); AC-8 |
| `design/tool-stamp.json` | AC-3; AC-8 |
| `mk/design-assembly.mk` (lệnh upgrade giữ nguyên) | AC-3 (bằng mẫu 0.76.0); AC-1 |
| `design/book-words.json` | AC-6 (khoá, câu hỏi, luật chữ); AC-7 (sổ vẽ chữ ấy); AC-9 (nghĩa và giọng); AC-8 |
| Phép kiểm tra của plugin đọc sổ quyết định | AC-5 (40/40, như hồ sơ `design-decisions-40-of-40`) |
| Dòng nhật ký `wiki/log/` | AC-8 |
| Phép kiểm mới của 0.76.0 (`icon-set-use`, `logo-pins`, `logo-use`) | Ngoài phạm vi: chỉ thêm khi kho có dòng logo hay bộ biểu tượng; kho chưa có, AC-4 chứng không quyết định nào đổi |
| `tests/e2e/floating-parts.spec.ts`, job `e2e` của CI | Lệnh upgrade giữ tệp của kho; job `e2e` của PR phải xanh trên đúng HEAD đã chấm trước Cổng Bằng chứng (Notes). Chốt máy: lệnh gộp theo lời ký (`dieu-phoi.mjs gop --theo-loi`) chỉ gộp khi CI xanh trên đầu nhánh |
| `make check` trên bản sao nông, cơ sở dữ liệu | Ngoài phép đo trên máy: job `quick`, `e2e-db` của CI chứng nó, cùng chốt máy ở dòng trên |
| Cách lệnh `upgrade` chạy | Ngoài phạm vi: lệnh nằm ở plugin, có bài kiểm ở kho design-assembly |

## Out of scope

- Hành vi các lệnh `upgrade`, `audit`, `book` của plugin; sửa kho design-assembly.
- Sửa tay `tools/design-assembly/`: lỗi tìm ra ở công cụ là việc của plugin.
- Dịch phần chữ trang logo mà plugin tự viết không qua khuôn chữ (nguồn «the package … at …», câu lỗi của dòng nguồn).
- Ghi dòng logo hay bộ biểu tượng vào `design/sources/` cho kho: việc của chủ kho, có giấy phép do người ghi.
- Sửa hồ sơ đã ký `design-decisions-40-of-40` hay `upgrade-design-assembly-0-69-0`.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Số không phụ thuộc phiên bản công cụ (25 quyết định, 36 phép kiểm, 62/73, 297 linh kiện, 2698 bài) đọc từ cây hiện tại;
  cùng các số ấy đứng ở `f1fd7038`. Lên đời không được đổi chúng.
- Số thuộc phiên bản 0.76.0 (mã cây, số tệp, danh sách tệp) đọc từ bản xem trước, commit `afcb1ca2` và sổ phát hành của
  plugin trong bản cài trên máy chủ kho (`/Users/manhphan/dev/design-assembly/plugins/design-assembly`, `plugin.json` ghi
  0.76.0; bộ nhớ đệm plugin không có 0.76.0). Biến `DA_PLUGIN` trỏ chỗ khác khi chấm trên máy khác.
- Gộp `main` vào nhánh thì số bài và danh sách nhánh có thể đổi: một dòng sổ `fix`, tiêu chí giữ nguyên nghĩa.
- Mọi phép đo ở `rang/` suy gốc kho từ vị trí của chính tệp đo và in mã HEAD của cây đã đo trong dòng xanh, nên chấm từ bản
  chép bên ngoài đo đúng cây của bản chép. `rang/two-way.mjs` chạy mỗi phép đo xanh trên vật lành và đỏ với thông điệp ghim
  trên bản phá (39 ca, đã chạy trước cổng).
- Lệnh vẽ sổ thoát 1 khi sổ được viết mà thiếu hình thành phần (bản dựng này không vẽ thành phần); AC-7 nhận 0 hoặc 1 khi
  `book.html` có, và đỏ ở mọi mã khác.
- Lỗi lượt chấm tìm ra trong `tools/design-assembly/` không sửa tay trên nhánh: vòng dừng và trình chủ kho.
- Cổng Bằng chứng chỉ trình khi job `e2e` của PR đã xanh trên đúng commit đã chấm.
- Mã đã có trên nhánh trước khi có hồ sơ (`afcb1ca2`). Kế hoạch của vòng là kế hoạch đo: viết bộ phép đo và ghim số, không
  viết thêm mã sản phẩm. Gộp Gate 1.5 vào Cổng Phạm vi hay duyệt riêng là câu Hỏi-2 của thẻ.
