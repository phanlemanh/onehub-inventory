---
schema_version: 1
feature: Chép lại công cụ design-assembly từ plugin — sổ linh kiện hết ghi trùng linh kiện xuất lại qua tệp gom
slug: refresh-design-assembly-tool
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, tooling]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-15
design_doc: docs/superpowers/specs/2026-11-15-refresh-design-assembly-tool-design.md
---

# Acceptance Contract: refresh-design-assembly-tool

## Context

Thay đổi đã làm sẵn trên nhánh `chore/refresh-design-assembly-tool` (commit `c0fed73`) theo lời chủ kho ngày 2026-11-15
(«Chép công cụ mới sang Inventory, nhánh riêng»): thư mục `tools/design-assembly/` chép lại từ plugin design-assembly ở
commit `feea58d`, và sổ linh kiện sinh lại bằng công cụ mới. Cổng trước khi gộp của kit đòi hồ sơ có chữ ký người vì
nhánh đổi đường dẫn T3 (`tools/**`). Hồ sơ này chấm đúng những gì nhánh đã làm.

Source input: mục Ngoài-7 của hồ sơ `adopt-design-assembly` («mở hợp đồng mới», chủ kho, 2026-11-15); lời chủ kho ngày
2026-11-15 («Chép công cụ mới sang Inventory, nhánh riêng», «Dựng hồ sơ»); design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh `chore/refresh-design-assembly-tool` ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có
  dòng `design-assembly: 17 decisions held by 20 checks, each seen failing on a changed copy` và dòng
  `component manifest: design/component-registry.json is up to date (<k> components)`.
- AC-2: Given sổ linh kiện ở HEAD, When đọc nó, Then không tên linh kiện nào có hơn một mục; chín linh kiện
  `FilterAdvancedRow`, `FiltersAdvancedPanel`, `FiltersAdvanced`, `FilterFieldPicker`, `FiltersBuilder`,
  `FilterValuePopover`, `FilterOperatorPopover`, `FilterRuleMenuItems`, `FilterChip` mỗi cái đúng một mục, ở tệp định nghĩa
  nó theo ma trận viết trước ở đầu `evals.yaml`. Given cùng mã nguồn, When công cụ ghi sổ của commit `0861fdc` (trước khi
  chép) chạy trên một bản dựng tạm, Then nó cho nhiều mục hơn nhưng cùng đúng bộ tên với sổ ở HEAD, và ghi hai lần đúng
  chín tên trên.
- AC-3: Given thư mục `tools/design-assembly/` ở HEAD, When tính mã cây git của nó từ tên và nội dung mọi tệp, Then mã
  ấy bằng mã cây mà chính kho plugin design-assembly cho thư mục công cụ của nó ở commit `feea58d`
  (`357987f790b1a0b52630f683780290933800fc3f`), và thư mục có 27 tệp.
- AC-4: Given các commit riêng của nhánh (từ chỗ rời `main` tới HEAD), When kê tệp đổi dưới `design/`, Then chỉ có
  `design/component-registry.json`; và `design/theme.json` không khai phép kiểm nào loại `screen-actions`.
- AC-5: Given sổ linh kiện ở HEAD, When chạy bài kiểm sổ linh kiện (`tests/design-registry.test.ts`) và chạy cổng chứng
  minh màn trên kho, Then mọi bài đạt, và cổng in `proof-gate: mọi màn đang mở đã chứng minh đúng lối`.

## Coverage

Phủ theo ba việc nhánh đã làm (design doc, mục «Thay đổi») và những bên đọc thứ bị đổi; không quét không gian tiêu chí
(dòng sổ `descope` «bỏ coverage-scan»):

| Thứ bị đổi | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| Bộ đọc linh kiện (`components.mjs`) và sổ linh kiện sinh lại | AC-2, AC-1 (sổ khớp mã) |
| Cả thư mục công cụ chép từ plugin | AC-3 |
| Phần đọc sổ màn nối mô hình đi kèm (`check.mjs`, `contract.mjs`, `screen-ledger.mjs`, `screen-actions.mjs`) | AC-1 (vẫn 17 quyết định, 20 lệnh kiểm), AC-4 (không phép kiểm mới nào được khai) |
| Các sổ thiết kế khác | AC-4 |
| Bên đọc sổ linh kiện: bài kiểm sổ, cổng chứng minh màn, `make check` | AC-5, AC-1. Cổng chứng minh màn chỉ đọc bộ tên của sổ; AC-2 giữ bộ tên ấy không đổi |
| Dòng nhật ký wiki | Ngoài phạm vi: ghi chép, `make check` giữ định dạng wiki |

## Out of scope

- Bật phép kiểm «sổ màn nối với mô hình nghiệp vụ» ở kho này.
- Hành vi của phần đọc sổ màn nối mô hình: bài kiểm của nó ở kho design-assembly.
- Các giới hạn đã ghi ở hồ sơ `adopt-design-assembly`.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Mã cây của AC-3 ghim theo một phiên bản của plugin. Lần chép công cụ sau sẽ làm phép đo ấy đỏ nếu hồ sơ này bị kéo ra
  ghim lại; khi đó phép đo được thay bằng phép đo của hồ sơ mới.
- Các con số của tiêu chí (27 tệp, mã cây, 17 và 20, chín tên) đọc từ kết quả nhánh đã có: chép và sinh lại là việc tất
  định, và hồ sơ này chấm sau khi làm.
- Các phép đo của hồ sơ nằm ở `rang/`: chúng chạy ở lượt chấm và lượt ghim lại, không chạy trong `make check`. Sau khi
  gộp, `make check` vẫn giữ sổ linh kiện khớp mã; thứ không ai giữ nữa là việc thư mục công cụ còn khớp plugin.
