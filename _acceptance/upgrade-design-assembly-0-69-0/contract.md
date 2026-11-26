---
schema_version: 1
feature: Lên đời công cụ design-assembly từ 0.36.1 lên 0.69.0 bằng lệnh upgrade, chỉ phần máy — không quyết định thiết kế nào đổi trạng thái
slug: upgrade-design-assembly-0-69-0
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-26
design_doc: docs/superpowers/specs/2026-11-26-upgrade-design-assembly-0-69-0-design.md
---

# Acceptance Contract: upgrade-design-assembly-0-69-0

## Context

PR #120, nhánh `chore/upgrade-design-assembly-0-69-0`, cắt từ `main` ở `1ea13196`. Commit `7174ab43` đã chạy `upgrade`
của plugin design-assembly 0.69.0: 25 tệp công cụ, bước cổng `mk/design-assembly.mk`, ba phép kiểm mới trong
`design/theme.json`, dấu phiên bản, bài trình duyệt `tests/e2e/floating-parts.spec.ts`, và hai chỗ sửa để cổng của kho xanh
(`eslint.config.js`, `tests/ci-ban-sao-nong.test.ts`). Commit `78124335` thêm một dòng nhật ký wiki.

Nhánh đổi `tools/**` và `mk/**`, nên cổng trước khi gộp đòi hồ sơ có chữ ký người. Trên PR, mọi kiểm khác đã xanh.

Source input: lời chủ kho ngày 2026-11-26 («Kiểm version design assembly mới nhất và cách hoạt động hiệu quả với onehub
inventory», rồi «Nâng lên 0.69.0», rồi «Chạy vòng nghiệm thu»); design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có các dòng
  `design-assembly: 22 decisions held by 33 checks, each seen failing on a changed copy`,
  `component manifest: design/component-registry.json is up to date (294 components)`, `determinism: 57/69 = 83%` và
  dòng số bài mà ma trận ghim (cây hiện tại: `Tests  2663 passed | 2 skipped (2665)`).
- AC-2: Given HEAD, When chạy riêng cổng design-assembly và lệnh tính độ tất định của nó, Then cổng in dòng 22/33 như
  trong AC-1, lệnh tính in `determinism rate: 57/69 (83%)` cùng `22 held and re-run here, 35 claimed by another check and
  not re-run`; khi `design/theme.json` của một bản chép mất một phép kiểm thì phép đo đỏ vì cổng không in dòng 22/33.
- AC-3: Given thư mục `tools/design-assembly/`, `design/tool-stamp.json` và `mk/design-assembly.mk` ở HEAD, When tính mã
  git từ tên và nội dung tệp, Then dấu phiên bản ghi `0.69.0`, thư mục có 51 tệp và mã cây
  `0f6ddbdf348d9c36ed7cac07c2cfd1972200df31`, dấu ghi cùng mã, `mk/design-assembly.mk` có mã
  `a9af3d808fc7f156d659ada3f6528cfe3482264c`; và trong thư mục bản 0.69.0 của plugin đã cài trên máy, sổ phát hành ghi
  đúng mã cây ấy, thư mục mẫu công cụ có mã cây ấy, mẫu bước cổng có mã của `mk/design-assembly.mk`.
- AC-4: Given sổ thiết kế, When chạy lệnh tính độ tất định một lần với công cụ ở HEAD trên sổ ở HEAD và một lần với công
  cụ 0.36.1 trên sổ ở chỗ nhánh rời `main` (thư mục `tools/design-assembly/` và `design/theme.json` của `1ea13196`), Then
  cả hai thoát 0 và cho mỗi quyết định trong 69 quyết định cùng một trạng thái; khi phía 0.36.1 đọc một `design/theme.json`
  mà quyết định `raw-table` mất phép kiểm thì phép đo đỏ và gọi tên `raw-table`.
- AC-5: Given một bản sao sâu 1 commit của HEAD, dựng như `db/scripts/ci-thu.sh` dựng nhưng `origin` là một kho trung gian
  có `main` ghim ở `1ea13196`, When chạy riêng `make design-assembly`, Then lệnh thoát 0, đầu ra có dòng 22/33 của AC-1,
  mỗi hàng `decision-sheet` và `owner-calls` in lời của công cụ rằng bản sao nông đã lấy `main` và lịch sử từ `origin`, và
  chỗ HEAD rời `main` vừa lấy là `1ea13196`; và trên một bản sao như thế mới dựng, phép kiểm `choose-first` chạy trước mọi
  thứ tự lấy `main` và đọc được chỗ nhánh rời. Khi kho trung gian không có `main` thì lệnh không thoát 0 và `choose-first`
  không đọc được chỗ rời; khi `main` của kho trung gian cũ hơn chỗ nhánh rời thì phép đo đỏ và gọi tên chỗ cũ ấy.
- AC-6: Given commit `7174ab43` và `78124335`, When kê tệp mỗi commit đổi so với cha của nó, Then đúng 31 tệp của ma trận
  cho commit thứ nhất và đúng một tệp `wiki/log/` cho commit thứ hai; và từ chỗ nhánh rời `origin/main` tới HEAD, nhánh không
  đổi tệp nào ngoài các tệp ấy, thư mục `_acceptance/upgrade-design-assembly-0-69-0/`,
  `docs/superpowers/specs/2026-11-26-upgrade-design-assembly-0-69-0-design.md` và
  `docs/superpowers/plans/2026-11-26-upgrade-design-assembly-0-69-0.md`, cùng `PRODUCT-MAP.md` và `LO-TRINH.html` khi mỗi
  trang đúng bằng bản bộ vẽ của kit vẽ lại từ hồ sơ ở HEAD. Khi nhánh đã vào `origin/main`, phép đo chỉ so commit và nói
  đúng điều đó.
- AC-7: Given `eslint.config.js` ở HEAD, When lint `tools/design-assembly/contract.mjs`, một tệp thử trong `src/` và một
  tệp thử `.mjs` cạnh thư mục công cụ (`tools/hook-probe.mjs`), hai tệp thử cùng gọi một hàm tên bắt đầu bằng `use` từ một
  hàm thường, Then tệp công cụ không có lỗi `react-hooks/rules-of-hooks` và mỗi tệp thử có lỗi ấy; khi bỏ chỗ tắt luật thì
  phép đo đỏ gọi tên tệp công cụ; khi chỗ tắt luật phủ mọi tệp thì phép đo đỏ gọi tên tệp thử trong `src/`; khi nó phủ cả
  `tools/` thì phép đo đỏ gọi tên `tools/hook-probe.mjs`.
- AC-8: Given một bản sao của HEAD có `main` ở `1ea13196`, When chạy cổng design-assembly trước và sau một commit thêm tệp
  thành phần `src/components/candidate/probe-badge.tsx` không có dòng nào của sổ nhận khối, Then trước thì cổng xanh với
  dòng 22/33, sau thì cổng đỏ và nói tệp ấy giữ `ProbeBadge`, một thành phần nhánh thêm mà sổ nhận khối không có dòng nào;
  rồi một commit thêm dòng sổ nhận khối cho tệp ấy (dựng từ dòng `design/intake/bang-nhieu-dong.yaml` mà bên ghi của plugin
  đã viết, đổi tên, tệp và nhu cầu) thì cổng xanh lại với dòng 22/33. Khi `design/theme.json` không có phép kiểm
  `choose-first` thì cổng để tệp ấy lọt qua và phép đo đỏ; khi dòng sổ trỏ một tệp khác thì cổng vẫn đỏ và phép đo đỏ.

## Coverage

Phủ theo tệp của hai commit và từng bên đọc bị đổi, gồm hai bên đọc mới của vòng này: phép kiểm `choose-first` đọc tệp
thành phần của mọi nhánh sau này, và job `e2e` của CI đọc `tests/e2e/floating-parts.spec.ts`. Không quét không gian tiêu
chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp của commit, hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| Tệp công cụ trong `tools/design-assembly/` | AC-3 (cây bằng bản phát hành); AC-1, AC-2 (cổng xanh, cùng số); AC-6 |
| `design/tool-stamp.json` | AC-3 |
| `mk/design-assembly.mk` (viết lại bằng mẫu 0.69.0) | AC-3 (bằng mẫu); AC-1 (mọi đích cũ còn chạy trong `make check`); AC-6 |
| `design/theme.json` (ba phép kiểm mới) | AC-2 (33 phép kiểm, phá thì đỏ); AC-4 (không quyết định nào đổi trạng thái); AC-8 (`choose-first`) |
| `choose-first` đọc tệp thành phần của nhánh sau này | AC-8 hai chiều: thiếu dòng nhận khối thì đỏ, có dòng thì xanh, dòng trỏ tệp khác thì đỏ |
| `tests/e2e/floating-parts.spec.ts`, job `e2e` của CI | AC-6 (tệp có trong commit); job `e2e` của PR phải xanh trên đúng HEAD đã chấm trước Cổng Bằng chứng (Notes) |
| `eslint.config.js` | AC-7; AC-1 (lint trong `make check`) |
| `tests/ci-ban-sao-nong.test.ts` | AC-5 (lý do của dòng mới là thật trên bản sao nông); AC-1 (bài xanh trong `make check`) |
| Dòng nhật ký `wiki/log/` | AC-6 |
| Phép kiểm `taken-down`, `floating-parts` giữ khối nguồn ngoài | Ngoài phạm vi: kho chưa ghim nguồn ngoài, hai phép kiểm chưa giữ gì |
| `make check` trên bản sao nông, cơ sở dữ liệu | Ngoài phép đo trên máy: job `check`, `e2e-db` của CI chứng nó |
| Cách lệnh `upgrade` chạy | Ngoài phạm vi: lệnh nằm ở plugin, có bài kiểm ở kho design-assembly |

## Out of scope

- Hành vi các lệnh `upgrade`, `status`, `audit`, `decide` của plugin; sửa kho design-assembly.
- Sửa tay `tools/design-assembly/`: lỗi tìm ra ở công cụ là việc của plugin.
- Bốn câu màu đang chờ chủ kho, ba sổ còn thiếu (kiểu cột, trạng thái màn, khổ màn hình) và sáu quyết định chưa có phép
  kiểm.
- Ghim ReUI hay nguồn nào khác làm nguồn ngoài, hồ sơ conform đầu tiên.
- Ghim lại hay sửa các hồ sơ đã ký (`upgrade-design-assembly-0-33-0` và trước đó).
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Số không phụ thuộc phiên bản công cụ (22 quyết định, 57/69, 69 quyết định, 294 linh kiện) đọc từ cây hiện tại và từ chỗ
  nhánh rời `main`. Lên đời chỉ phần máy không được đổi chúng; số phép kiểm đi từ 30 lên 33 vì ba phép kiểm mới.
- Số thuộc phiên bản 0.69.0 (mã cây, số tệp, mã bước cổng, danh sách tệp) đọc từ bản xem trước, commit `7174ab43` và sổ
  phát hành của plugin trong bộ nhớ đệm trên máy (`~/.claude/plugins/cache/design-assembly/design-assembly/0.69.0`).
- Gộp `main` vào nhánh thì số bài và danh sách nhánh có thể đổi: một dòng sổ `fix`, tiêu chí giữ nguyên nghĩa.
- Mọi phép đo ở `rang/` suy gốc kho từ vị trí của chính tệp đo và in mã HEAD của cây đã đo trong dòng xanh, nên chấm từ
  bản chép bên ngoài đo đúng cây của bản chép.
- Trên bản sao nông của AC-5, `choose-first` không in lời «fetched» khi hai hàng trước nó đã lấy `main`; vì thế phép đo
  chạy riêng nó trên một bản sao thứ hai mới dựng.
- Lỗi lượt chấm tìm ra trong `tools/design-assembly/` không sửa tay trên nhánh: vòng dừng và trình chủ kho.
- Cổng Bằng chứng chỉ trình khi job `e2e` của PR đã xanh trên đúng commit đã chấm: đó là chỗ duy nhất chạy bài
  `floating-parts.spec.ts` (0 ca, vì kho chưa có hồ sơ conform).
- Mã đã có trên nhánh trước khi có hồ sơ (`7174ab43`, `78124335`). Kế hoạch của vòng là kế hoạch đo: viết bộ phép đo và
  ghim số, không viết thêm mã sản phẩm. Gộp Gate 1.5 vào Cổng Phạm vi hay duyệt riêng là câu Hỏi-2 của thẻ.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-26:
  - Ngoài-1: nếu một lần đổi cấu hình lint sau này làm lint bỏ qua cả tệp công cụ lẫn hai tệp thử, phép đo tầm của chỗ
    tắt luật (E12) vẫn báo xanh.
  - Ngoài-2: bốn kiểu lệch giữa dấu phiên bản, sổ phát hành và mẫu của plugin chưa có ca phá riêng, nên nếu chúng lệch
    sau này thì phép đo cây công cụ (E4, E5) chưa được chứng là bắt được.
  - Ngoài-3: ca phá của phép đo «quyết định giữ trạng thái» (E7) có thể đạt nhầm lý do nếu công cụ cũ bị lỗi, vì nó chỉ
    kiểm có dòng nói về `raw-table` chứ không kiểm đó là dòng khác biệt duy nhất.
