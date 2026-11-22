---
schema_version: 1
feature: Lên đời công cụ design-assembly từ 0.7.1 lên 0.36.1 bằng lệnh upgrade, chỉ phần máy — không quyết định thiết kế nào đổi trạng thái
slug: upgrade-design-assembly-0-33-0
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-22
design_doc: docs/superpowers/specs/2026-11-22-upgrade-design-assembly-0-33-0-design.md
---

# Acceptance Contract: upgrade-design-assembly-0-33-0

## Context

PR #107, nhánh `chore/upgrade-design-assembly-0.33.0`. Commit `26ab13af` (cắt từ `main` ở `6ce94d9f`) đã chạy `upgrade`
của plugin design-assembly 0.33.0: 26 tệp công cụ, dấu phiên bản, một dòng nhật ký wiki. Nhánh đã gộp `origin/main` ở
`dda3487e`. Đích của vòng là plugin **0.36.1**: bản ấy mang bản sửa cảnh báo CodeQL ở `adapters/vite.mjs` (PR
phanlemanh/design-assembly#99). Khi phiên design-assembly báo 0.36.1 đã cài trên máy, nhánh chạy lại `upgrade` (xem
trước rồi mới làm) thành một commit thứ hai. Từ 0.35.0, `upgrade` cũng viết `mk/design-assembly.mk` khi tệp ấy khác mẫu
của plugin (quyết định 0086 của design-assembly).

Nhánh đổi `tools/**`, nên cổng trước khi gộp đòi hồ sơ có chữ ký người. Hồ sơ chấm cây sau lần chạy lại ấy.

Source input: lời chủ kho ngày 2026-11-22 (kiểm và cài design-assembly); việc giao của phiên design-assembly (lên đời
chỉ phần máy, PR #107; đích đổi thành 0.36.1 cùng ngày); design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có các dòng
  `design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy`,
  `component manifest: design/component-registry.json is up to date (294 components)`, `determinism: 47/67 = 70%` và
  dòng số bài mà ma trận ghim (cây hiện tại: `Tests  2607 passed | 2 skipped (2609)`).
- AC-2: Given HEAD, When chạy riêng cổng design-assembly và lệnh tính độ tất định của nó, Then cổng in dòng 19/27 như
  trong AC-1 và lệnh tính in `determinism rate: 47/67 (70%)` cùng `19 held and re-run here, 28 claimed by another check and not
  re-run`; khi `design/theme.json` của một bản chép mất một phép kiểm thì phép đo đỏ vì cổng không in dòng 19/27.
- AC-3: Given thư mục `tools/design-assembly/`, `design/tool-stamp.json` và `mk/design-assembly.mk` ở HEAD, When tính mã
  git từ tên và nội dung tệp, Then dấu phiên bản ghi `0.36.1`, thư mục có 44 tệp và mã cây
  `f53b64535e01adcf1421d594d23413facdb455d5` mà sổ phát hành của plugin 0.36.1 ghi, dấu ghi cùng mã, và
  `mk/design-assembly.mk` có mã `15c4208b99e238f16a5d7b1826e66629ebf5d510` của mẫu bước cổng 0.36.1; và trong thư mục bản 0.36.1 của plugin đã cài trên máy, sổ phát hành ghi đúng mã cây ấy, thư mục
  mẫu công cụ có mã cây ấy và mẫu bước cổng có mã của `mk/design-assembly.mk`.
- AC-4: Given sổ thiết kế của kho ở HEAD, When chạy lệnh tính độ tất định một lần với công cụ ở HEAD và một lần với
  công cụ 0.7.1 (thư mục `tools/design-assembly/` của `6ce94d9f`) trên cùng cây, Then cả hai thoát 0 và cho mỗi quyết
  định trong 67 quyết định cùng một trạng thái; khi phía 0.7.1 đọc một `design/theme.json` mà quyết định `raw-table` mất
  phép kiểm thì phép đo đỏ và gọi tên `raw-table`.
- AC-5: Given một bản sao sâu 1 commit của HEAD, dựng như `db/scripts/ci-thu.sh` dựng nhưng `origin` là một kho trung
  gian có `main` ghim ở chỗ HEAD rời `origin/main`, When chạy riêng `make design-assembly`, Then lệnh thoát 0, đầu ra có
  dòng 19/27 của AC-1, mỗi hàng `decision-sheet` và `owner-calls` in lời của công cụ rằng bản sao nông đã lấy `main` và
  lịch sử từ `origin` (lời ghim ở ma trận; ở 0.33.0 là `a shallow checkout: main and the history back to where this
  branch left it were fetched from origin`), và chỗ HEAD rời `main` vừa lấy là chỗ đã ghim; khi kho trung gian không có
  `main` thì lệnh không thoát 0 và cả hai hàng báo không có nhánh chính để so (ở 0.33.0: `origin has neither main nor
  master`).
- AC-6: Given commit `26ab13af` và cha `6ce94d9f`, When kê tệp commit đổi, Then đúng 28 tệp của ma trận; commit chạy lại
  `upgrade` với 0.36.1 đổi đúng 9 tệp mà bản xem trước kê (7 tệp trong `tools/design-assembly/`, `mk/design-assembly.mk`,
  `design/tool-stamp.json`) cùng một tệp trong `wiki/log/`; và từ chỗ nhánh rời `origin/main` tới HEAD, nhánh không đổi
  tệp nào ngoài các tệp của hai commit ấy, `PRODUCT-MAP.md` và `LO-TRINH.html` ở đúng dòng nói hồ sơ này hay số đếm
  việc theo nấc, và thư mục
  `_acceptance/upgrade-design-assembly-0-33-0/`, `docs/superpowers/specs/2026-11-22-upgrade-design-assembly-0-33-0-design.md`
  và `docs/superpowers/plans/2026-11-22-upgrade-design-assembly-0-33-0.md`. Khi nhánh đã vào `origin/main`, phép đo chỉ
  so commit và nói đúng điều đó.

## Coverage

Phủ theo tệp của hai commit lên đời và từng bên đọc bị đổi. Không quét không gian tiêu chí: dòng sổ `descope` «bỏ
coverage-scan».

| Tệp của commit, hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| Tệp công cụ trong `tools/design-assembly/` (0.33.0 rồi 0.36.1) | AC-3 (cây bằng bản phát hành); AC-1, AC-2 (cổng xanh, cùng số); AC-6 |
| `design/tool-stamp.json` | AC-3 |
| `mk/design-assembly.mk` (`upgrade` viết lại khi khác mẫu, từ 0.35.0) | AC-3 (bằng mẫu 0.36.1); AC-6 |
| Dòng nhật ký `wiki/log/` | AC-6 |
| Sổ quyết định và khai báo phép kiểm (không đổi) | AC-4 (mọi quyết định cùng trạng thái); AC-6 (không tệp nào đổi) |
| `make check` trên cây đã gộp `main` | AC-1 |
| Hai hàng so với `main` trên bản sao nông | AC-5 |
| `make check` trên bản sao nông, cơ sở dữ liệu | Ngoài phép đo trên máy: job `check`, `e2e-db` của CI chứng nó |
| Cảnh báo CodeQL ở `adapters/vite.mjs` | Chưa có phép đo trên máy: job CodeQL của PR đang đỏ; mục đã biết tới lần chạy lại 0.36.1, rồi job ấy phải xanh trước Cổng Bằng chứng |
| Lệnh lấy `main` không còn ghi đè cách nối SSH của máy (0.33.0) | Ngoài phạm vi: lợi ích của plugin, có bài kiểm ở kho design-assembly; AC-5 lấy qua đường dẫn cục bộ nên không chứng nó |
| Cách lệnh `upgrade` chạy | Ngoài phạm vi: lệnh nằm ở plugin, có bài kiểm ở kho design-assembly |

## Out of scope

- Hành vi của lệnh `upgrade`, `status`, `audit` hay `decide` của plugin.
- Sửa `tools/design-assembly/` bằng tay, sửa kho design-assembly, hay tắt cảnh báo CodeQL: lỗi tìm ra ở công cụ là việc
  của plugin.
- Dòng chú thích cũ về 0.7.2 trong `Makefile`.
- Nhận 14 quyết định mà bản kiểm kê nói có bằng chứng nhưng chưa có con trỏ, hay nhận bất kỳ hàng sổ, phép kiểm, quy tắc
  thiết kế mới nào mà 0.33.0 tới 0.36.1 mở ra.
- Ghim lại hay sửa các hồ sơ đã ký (`upgrade-design-assembly-0-7-1` và trước đó).
- Chạy `db/scripts/ci-thu.sh`; mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Số không phụ thuộc phiên bản công cụ (19 và 27, 47/67, 67 quyết định, 294 linh kiện) đọc từ cây hiện tại. Lên đời chỉ
  phần máy không được đổi chúng: bản xem trước 0.36.1 hay lượt chấm thấy chúng đổi thì vòng dừng và trình chủ kho.
- Số thuộc phiên bản 0.36.1 (mã cây, số tệp, mã bước cổng, danh sách tệp) đọc từ bản xem trước và sổ phát hành của
  plugin đã cài ngày 2026-11-22; mã commit chạy lại và lời hai hàng in trên bản sao nông ghim vào `rang/matrix.mjs` khi
  commit có, kèm một dòng sổ `fix`.
- Bước cổng 0.36.1 nối các bước dựng tệp suy ra vào danh sách chung khi bộ lệnh của kho có danh sách ấy; kho này chưa
  có, nên bước cổng giữ đường cũ. Nó thêm một lệnh in trạng thái và vai của từng màn (`design-screen-facts`).
- `PRODUCT-MAP.md` và `LO-TRINH.html` do bộ kiểm vẽ lại mỗi lần ký cổng; AC-6 cho chúng đổi chỉ ở dòng của hồ sơ này
  và số đếm việc theo nấc. Gộp
  `main` thêm lần nữa thì số bài có thể đổi: cũng một dòng `fix`, tiêu chí giữ nguyên nghĩa.
- Không chạy lại `upgrade` trước khi phiên design-assembly báo 0.36.1 đã cài trên máy. Tới lúc ấy cảnh báo CodeQL «làm
  sạch nhiều ký tự chưa trọn» ở `tools/design-assembly/adapters/vite.mjs` dòng 83 (bỏ chú thích HTML khỏi `index.html`
  trước khi đọc thẻ script) là mục đã biết: đọc là báo nhầm, không tắt, không sửa tay.
- Cổng Bằng chứng chỉ trình khi job CodeQL của PR đã xanh trên commit chạy lại 0.36.1. Không gộp khi cảnh báo còn mở.
- Mọi phép đo ở `rang/` suy gốc kho từ vị trí của chính tệp đo và in mã HEAD của cây đã đo trong dòng xanh, nên chấm từ
  bản chép bên ngoài (Hỏi-1) đo đúng cây của bản chép.
- Phép đo AC-3 đọc thư mục bản của plugin trong bộ nhớ đệm trên máy (`~/.claude/plugins/cache/design-assembly/
  design-assembly/0.36.1`), không đọc kho design-assembly. Máy không có thư mục ấy thì phép đo đỏ với lời «cannot read».
- Phép đo cây công cụ của hồ sơ 0.7.1 (E8, E9, ghim 0.7.1) sẽ đỏ nếu ai ghim lại hồ sơ ấy sau khi gộp; AC-3 thay chỗ nó.
- Bản sao của AC-5 lấy `origin` là kho trung gian chia đối tượng với kho này, `main` ghim ở chỗ HEAD rời `origin/main`
  (hiện là `dda3487e`). Trong `make check` hai hàng không in lời «fetched» vì cổng chứng minh màn đã lấy cả lịch sử trước.
- Lỗi lượt chấm tìm ra trong `tools/design-assembly/` không sửa tay trên nhánh và không sửa ở kho plugin: vòng dừng và
  trình chủ kho.
