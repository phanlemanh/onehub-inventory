---
schema_version: 1
feature: Lên đời công cụ design-assembly từ 0.36.1 lên 0.36.2 và chạy lại tiếp nhận — trang luật cho tác tử thôi ghi phông thân bài là «undefined»
slug: upgrade-design-assembly-0-36-2
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: draft
design_doc: docs/superpowers/specs/2026-11-23-upgrade-design-assembly-0-36-2-design.md
---

# Acceptance Contract: upgrade-design-assembly-0-36-2

## Context

Nhánh `chore/upgrade-design-assembly-0-36-2`, cắt từ `main` ở `25f84709` (PR #111 đã gộp). Commit `b5f48f65` chạy
`upgrade` của plugin design-assembly 0.36.2 (mã nguồn ở `~/dev/design-assembly`, merge `bdf2bcc`): hai tệp công cụ, dấu
phiên bản, một dòng nhật ký wiki. Commit `326326dc` đổi đúng dòng «Type» của trang luật cho tác tử, lấy từ trang mà
`adopt` 0.36.2 viết trên bản chép tiếp nhận lại dòng `typeface` (Hỏi-1). Chạy lại `adopt` trên kho không viết gì và chỉ
hỏi câu nguồn phông mà PR #111 đã gạt.

Nhánh đổi `tools/**`, nên cổng trước khi gộp đòi hồ sơ có chữ ký người. Hồ sơ chấm sau khi làm: lên đời là việc tất định.

Source input: lời chủ kho ngày 2026-11-23 («lên đời plugin trong Inventory và chạy lại tiếp nhận», làm riêng ngay sau khi
PR #111 gộp); design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có các dòng
  `design-assembly: 22 decisions held by 30 checks, each seen failing on a changed copy`,
  `component manifest: design/component-registry.json is up to date (294 components)`, `determinism: 57/69 = 83%` và
  `Tests  2607 passed | 2 skipped (2609)`; khi `design/theme.json` của một bản chép mất một phép kiểm thì cổng không in
  dòng 22/30.
- AC-2: Given HEAD, When tính mã git của `tools/design-assembly/`, đọc `design/tool-stamp.json`, `mk/design-assembly.mk`
  và mã nguồn plugin ở `bdf2bcc`, Then thư mục có 44 tệp và mã cây `cc732f566b65eba9439469e456c814324c2ba42e`, dấu ghi
  `0.36.2` cùng mã ấy, bước cổng có mã `15c4208b99e238f16a5d7b1826e66629ebf5d510`, và plugin ở `bdf2bcc` là bản 0.36.2,
  sổ phát hành ghi mã cây ấy, thư mục mẫu và mẫu bước cổng có đúng hai mã ấy.
- AC-3: Given công cụ ở HEAD, When bộ đọc phông của bản dựng đọc bảng kiểu của kho, Then thứ nạp `--font-sans` mang
  `via: loader`, `file: src/app/layout.tsx`, `loader: google`; với bộ đọc của 0.36.1 thì phép đo đỏ.
- AC-4: Given trang luật cho tác tử ở HEAD, When so nó với dòng «Type» mà 0.36.2 viết và với trang mà `adopt` 0.36.2 viết
  trên bản chép của HEAD tiếp nhận lại dòng `typeface`, Then dòng «Type» đúng chữ của 0.36.2 (gọi tên bộ nạp phông ở
  `src/app/layout.tsx`, dẫn tới `src/app/globals.css`), không dòng nào ghi `undefined` hay dẫn tới `design/blueprint.json`,
  trang bằng từng byte trang bản chép viết, sổ quyết định và `design/theme.json` của bản chép trở lại y như cũ; và phép
  đo E7 của hồ sơ đã ký `design-assembly-adopt-checks` đỏ với đúng một dòng
  `rules: 0 lines say undefined, the known defect is one` — tiền đề của hồ sơ ấy đã đổi, tiêu chí này thay chỗ nó.
- AC-5: Given HEAD, When chạy `adopt` 0.36.2 xem trước, Then nó thêm 0 dòng, không có tệp nào để viết, và chỉ hỏi người
  đúng một câu: dòng nguồn phông `--font-sans`, câu PR #111 đã gạt (`d-20261123T014845Z-8`).
- AC-6: Given sổ quyết định ở HEAD, When chạy lệnh tính độ tất định với công cụ ở HEAD và với công cụ 0.36.1 (thư mục
  `tools/design-assembly/` của `25f84709`) trên cùng cây, Then cả 69 quyết định cùng trạng thái; khi phía 0.36.1 đọc một
  `design/theme.json` mất phép kiểm của `raw-table` thì phép đo đỏ và gọi tên `raw-table`.
- AC-7: Given `25f84709..HEAD`, When kê tệp đổi, Then `b5f48f65` đổi đúng bốn tệp của ma trận, `326326dc` đổi đúng
  `.claude/rules/design-assembly.md`, và nhánh không đổi tệp nào ngoài hai commit ấy, thư mục hồ sơ này, design doc của nó,
  `PRODUCT-MAP.md` và `LO-TRINH.html` (hai trang lệnh ký cổng vẽ lại).

## Coverage

Phủ theo từng thứ nhánh đổi và bên đọc của nó. Không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Thứ bị đổi, hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| Hai tệp công cụ, dấu phiên bản | AC-2 (cây bằng bản phát hành), AC-3 (trường mới của bộ đọc phông), AC-7 |
| Cổng design-assembly, `make check` | AC-1 |
| Trạng thái quyết định (sổ không đổi) | AC-6 |
| Trang luật cho tác tử, dòng «Type» | AC-4. Bên đọc là tác tử dựng màn |
| Hồ sơ đã ký `design-assembly-adopt-checks`, phép đo E7 | AC-4 (tiền đề đổi, nói bằng phép đo) |
| Chạy lại tiếp nhận | AC-5 |
| Dòng nhật ký wiki | AC-7; định dạng do `make check` giữ |
| `adopt` không viết lại trang luật khi không thêm dòng | Ngoài phạm vi: hành vi của plugin, sửa ở kho design-assembly (Hỏi-1) |
| Dòng nguồn phông Inter, cỡ chạm chưa đo, ba luật lint | Ngoài phạm vi: PR #111 đã gạt bằng sổ, không đổi ở đây |

## Out of scope

- Sửa plugin design-assembly, hay sửa tay `tools/design-assembly/`.
- Sửa tệp của hồ sơ đã ký `design-assembly-adopt-checks` (kể cả `rang/matrix.mjs`, `evals.yaml`).
- Dòng nguồn phông Inter và giấy phép; 16 loại phần tử chưa đo cỡ chạm; ba luật lint bắt hẹp.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Plugin đã cài trên máy vẫn là 0.36.1. Phép đo đọc plugin từ kho nguồn `~/dev/design-assembly` ở commit ghim `bdf2bcc`
  (`git archive`), nên không phụ thuộc bản cài. Máy không có kho ấy thì AC-2, AC-4, AC-5 đỏ với «cannot read». CI không
  có kho ấy: các phép đo này chạy trên máy chấm, không trong `make check`.
- Mọi phép đo ở `rang/` suy gốc kho từ vị trí tệp đo và in mã HEAD đã đo; bản chép để phá chia đối tượng với kho và không
  ghi vào kho. Chấm từ bản chép bên ngoài (`~/dev/onehub-inventory-cham-111`) đo đúng cây của bản chép.
- Các số 22/30, 57/69, 294, 2607 đọc từ cây sau PR #111; lên đời chỉ phần máy không đổi chúng. Gộp `main` thêm thì số bài
  có thể đổi: một dòng sổ `fix`, tiêu chí giữ nghĩa.
- Hồ sơ `design-assembly-adopt-checks` ghi Ngoài-1 trong Notes của nó là dòng sai đã biết; sau nhánh này dòng ấy không
  còn. Không sửa hồ sơ ấy: AC-4 ghi điều đó bằng phép đo.
