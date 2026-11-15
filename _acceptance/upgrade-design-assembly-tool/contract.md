---
schema_version: 1
feature: Lên đời công cụ design-assembly bằng lệnh upgrade của plugin bản 0.1.0 — sổ linh kiện ghi lại quan hệ dựng từ, kho ghi dấu phiên bản công cụ
slug: upgrade-design-assembly-tool
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-16
design_doc: docs/superpowers/specs/2026-11-16-upgrade-design-assembly-tool-design.md
---

# Acceptance Contract: upgrade-design-assembly-tool

## Context

Thay đổi đã làm sẵn trên nhánh `chore/upgrade-design-assembly` (commit `158cf51`, cắt từ `main` ở `b6f4f29`) theo lời chủ
kho ngày 2026-11-16 («Cho phép» lên đời Inventory bằng `upgrade`, trên nhánh riêng kèm hồ sơ nghiệm thu). Lệnh `upgrade`
của plugin design-assembly bản 0.1.0 viết sáu tệp công cụ, ghi lại sổ linh kiện và thêm `design/tool-stamp.json`. Cổng
trước khi gộp của kit đòi hồ sơ có chữ ký người vì nhánh đổi đường dẫn T3 (`tools/**`). Hồ sơ này chấm đúng những gì nhánh
đã làm.

Source input: lời chủ kho ngày 2026-11-16 («Cho phép»); mục 1.4 trong kế hoạch của kho design-assembly; hạn chế Ngoài-3
của hồ sơ `refresh-design-assembly-tool`; design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có dòng
  `design-assembly: 17 decisions held by 20 checks, each seen failing on a changed copy` và dòng
  `component manifest: design/component-registry.json is up to date (291 components)`.
- AC-2: Given thư mục `tools/design-assembly/` và `design/tool-stamp.json` ở HEAD, When tính mã cây git của thư mục từ tên
  và nội dung mọi tệp, Then mã ấy bằng mã plugin ghi cho bản 0.1.0 trong sổ phát hành của nó
  (`4f5d879929427743a4d10ea5aafc435afd0e1034`), thư mục có 27 tệp, và dấu phiên bản ghi `version` `0.1.0` cùng `tree` bằng
  đúng mã ấy; và sổ phát hành của plugin (`plugins/design-assembly/references/releases.json`), đọc ở commit `34a7938` của
  kho design-assembly mà lệnh upgrade chạy từ đó, ghi cho bản 0.1.0 đúng mã cây này.
- AC-3: Given sổ linh kiện trên `main` ở `b6f4f29` và sổ commit lên đời `158cf51` ghi, When so từng linh kiện theo tên,
  Then sổ commit lên đời ghi có thêm
  đúng ba mục «dựng từ» — `Filters` dựng từ `FiltersAdvanced`; `FiltersRow` dựng từ `FilterChip` và `FiltersBuilder` — và
  ngoài ba mục ấy không linh kiện nào đến hay đi, không trường nào của mục nào đổi.
- AC-4: Given commit lên đời `158cf51` và commit cha `b6f4f29`, When kê tệp commit ấy đổi, Then đúng tám tệp: sáu tệp công
  cụ `adapters/eslint.mjs`, `check.mjs`, `columns.mjs`, `components.mjs`, `lint.mjs`, `tokens.mjs` dưới
  `tools/design-assembly/`, `design/component-registry.json` và `design/tool-stamp.json`; không tệp nào khác, kể cả
  `design/theme.json`, `design/tokens.json` và stylesheet.
- AC-5: Given sổ linh kiện ở HEAD, When chạy bài kiểm sổ linh kiện (`tests/design-registry.test.ts`) và chạy cổng chứng
  minh màn trên kho, Then mọi bài đạt, và cổng in `proof-gate: mọi màn đang mở đã chứng minh đúng lối`.
- AC-6: Given nhánh ở HEAD trước khi gộp, When kê tệp nhánh đổi từ chỗ rời `main` tới HEAD, Then mỗi tệp là một trong tám
  tệp của AC-4 hoặc một tệp của chính hồ sơ này (thư mục hồ sơ, `_acceptance/config.yaml`, design doc, kế hoạch,
  `wiki/log.md`, bản đồ sản phẩm, trang lộ trình); không tệp nào khác, kể cả `design/tokens.json`, `design/theme.json`,
  stylesheet và `mk/design-assembly.mk`.

## Coverage

Phủ theo ba thứ lệnh upgrade đã viết (design doc, mục «Thay đổi») và những bên đọc thứ bị đổi. Không quét không gian tiêu
chí: dòng sổ `descope` «bỏ coverage-scan».

| Thứ bị đổi | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| Sáu tệp công cụ, cả thư mục so với bản 0.1.0 | AC-2 |
| Sổ linh kiện ghi lại | AC-3; AC-1 (sổ khớp mã) |
| Dấu phiên bản mới | AC-2 |
| Những gì lệnh không được ghi: stylesheet, sổ token, dữ liệu lệnh kiểm, dòng sổ người viết, bước cổng | AC-4 (commit lên đời), AC-6 (cả nhánh) |
| Nguồn của mã cây ghim | AC-2 (đối chiếu sổ phát hành của plugin) |
| Lệnh kiểm vẫn giữ đủ quyết định | AC-1 (vẫn 17 quyết định, 20 lệnh kiểm) |
| Bên đọc sổ linh kiện: bài kiểm sổ, cổng chứng minh màn, `make check` | AC-5, AC-1 |
| Cách lệnh upgrade chạy | Ngoài phạm vi: lệnh nằm ở plugin, có bài kiểm ở kho design-assembly (dòng sổ `descope`) |
| Dòng nhật ký wiki | Ngoài phạm vi: ghi chép, `make check` giữ định dạng wiki |

## Out of scope

- Hành vi của lệnh `upgrade`, `status` hay `audit` của plugin.
- Chép bước cổng mới của plugin (`mk/design-assembly.mk`) sang kho này.
- Phép kiểm thường trực giữ thư mục công cụ trùng dấu phiên bản sau khi gộp.
- Ghim lại hồ sơ `refresh-design-assembly-tool`, hay sửa phép đo đã ghim theo bản cũ của nó.
- Các giới hạn đã ghi ở hồ sơ `adopt-design-assembly` và `refresh-design-assembly-tool`, trừ Ngoài-3 mà AC-3 đo.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.
- Sửa lời báo của lệnh upgrade khi kho chưa cài thư viện: việc của kho design-assembly, đã ghi ở sổ giới hạn của plugin,
  dòng `upgrade-blames-ledger-for-missing-dependencies`.

## Notes

- Mã cây của AC-2 ghim theo bản 0.1.0 của plugin. Lần lên đời sau sẽ làm phép đo ấy đỏ nếu hồ sơ này bị kéo ra ghim lại;
  khi đó phép đo được thay bằng phép đo của hồ sơ mới.
- Phép đo «khớp plugin ở feea58d» của hồ sơ `refresh-design-assembly-tool` (E3 của hồ sơ đó) sẽ đỏ nếu ai ghim lại hồ sơ
  ấy sau khi nhánh này gộp; E2 của hồ sơ này thay chỗ nó.
- Các con số của tiêu chí (27 tệp, mã cây, 17 và 20, 291 linh kiện, ba mục) đọc từ kết quả nhánh đã có: lên đời là việc
  tất định, và hồ sơ này chấm sau khi làm.
- Các phép đo của hồ sơ nằm ở `rang/`: chúng chạy ở lượt chấm và lượt ghim lại, không chạy trong `make check`. Các commit
  được ghim theo mã, nên AC-3 và AC-4 đọc như nhau trước và sau khi gộp. AC-6 thì không: sau khi gộp không còn gì giữa
  `main` và HEAD, và phép đo nói đúng điều đó thay vì báo xanh.
- Phép đo nguồn của AC-2 đọc kho design-assembly trên máy chủ kho (`~/dev/design-assembly`, hoặc thư mục trong biến
  `DESIGN_ASSEMBLY_REPO`). Máy không có kho ấy thì phép đo đỏ với lời «cannot read», không xanh suông.
