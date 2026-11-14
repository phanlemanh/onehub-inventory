---
schema_version: 1
feature: Nhận plugin design-assembly — lệnh kiểm chạy lại lint của kho, sổ linh kiện do công cụ của plugin ghi thay công cụ viết tay
slug: nhan-design-assembly
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, tooling]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-14
design_doc: docs/superpowers/specs/2026-11-14-nhan-design-assembly-design.md
---

# Acceptance Contract: nhan-design-assembly

## Context

Thay đổi đã làm sẵn trên nhánh `chore/adopt-design-assembly` (PR #58) theo lời cho phép của chủ kho ngày 2026-11-14:
nhận plugin design-assembly, cho lệnh kiểm của nó chạy lại lint của kho trên đoạn mã phạm từng quyết định, và cho công
cụ của nó ghi `design/component-registry.json` thay `tools/design_registry.mjs`. Cổng trước khi gộp của kit đòi hồ sơ có
chữ ký người vì PR đổi đường dẫn T3 (`tools/**`, `mk/**`). Hồ sơ này chấm đúng những gì nhánh đã làm, bằng lệnh của kho
này.

Source input: lời chủ kho trong phiên design-assembly ngày 2026-11-14 («Cho, nhánh riêng» cho bước 1 và 2, cho lát hai,
cho bước 3; «Giữ cả ba» cho ba lời đáp; «Đẩy và mở PR»; «Tách sang PR sau»; «Dựng hồ sơ»), bản ghi quyết định
[0032](../../wiki/decisions/0032-so-linh-kien-do-design-assembly-ghi.md), design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh `chore/adopt-design-assembly` ở HEAD, When chạy `make check`, Then lệnh thoát 0, và trong đầu ra có
  dòng `design-assembly: 18 decisions held by <m> checks, each seen failing on a changed copy` và dòng
  `component manifest: design/component-registry.json is up to date (<k> components)`.
- AC-2: Given lệnh kiểm design-assembly, When in trạng thái từng dòng sổ (`--rate`), Then đúng 18 dòng ở trạng thái
  `held`, đúng bằng ma trận viết trước ở đầu `evals.yaml`; trong đó chín dòng `color-role`, `color-palette`, `type-scale`,
  `spacing`, `radius`, `raw-controls`, `raw-table`, `no-restyled-component`, `no-inline-style` được giữ bằng luật lint mà
  dòng sổ nêu, chạy lại ở đây; và `design/theme.json` có đúng chín phép kiểm loại lint, mỗi phép trỏ cùng luật ấy.
- AC-3: Given một bản dựng tạm của kho mà mọi tệp trỏ về kho, trừ cấu hình lint, When cấu hình lint là bản của kho, Then
  lệnh kiểm design-assembly chạy trên bản ấy thoát 0; When cấu hình lint thêm một mục tắt luật `onehub-ui/no-raw-table`,
  Then lệnh kiểm thoát khác 0 và in `raw-table: the repository's lint lets through` kèm đoạn `<table />`.
- AC-4: Given commit trước khi nhận `1226ec5`, When so từng dòng của `design/decisions.yaml` ở commit ấy với HEAD, Then mọi
  dòng còn nguyên từng byte, trừ đúng dòng `component-level`, mà chỉ phép trỏ đổi từ `tool:tools/design_registry.mjs`
  sang `tool:tools/design-assembly/components.mjs`.
- AC-5: Given sổ linh kiện ở HEAD, When đọc nó, Then mỗi linh kiện xuất ra là một mục có `file`, `level`, `source`;
  `SidebarMenuButton` có thuộc tính `isActive`, không có `variant` hay `className` trong thuộc tính, có biến thể
  `size=lg`; `EmptyMedia` có đúng hai biến thể `variant=default` và `variant=icon`; một linh kiện ở
  `src/components/reui/` có `source: library`; `PageHeader` có `level: template` và `source: own`.
- AC-6: Given mã nguồn ở HEAD, When chạy công cụ ghi sổ không ghi, Then nó thoát 0 và in `is up to date`; Given một bản
  dựng tạm của kho có thêm một tệp linh kiện mới mà sổ không ghi lại, When chạy lệnh kiểm design-assembly trên bản ấy,
  Then nó thoát khác 0 và gọi tên linh kiện mới kèm `is not in the file`.
- AC-7: Given HEAD, When kiểm, Then `tools/design_registry.mjs` không còn; `mk/design.mk` gọi
  `node tools/design-assembly/components.mjs --write` ở `gen-design` và `node tools/design-assembly/components.mjs` ở
  `design`; và chạy `make gen` rồi so `design/component-registry.json` với bản đã commit thì không khác.
- AC-8: Given sổ linh kiện mới, When chạy bài kiểm của cổng chứng minh màn (`tools/proof_gate`) và chạy chính cổng ấy trên
  kho ở HEAD, Then mọi bài đạt, và cổng in `proof-gate: mọi màn đang mở đã chứng minh đúng lối`.
- AC-9 (judgment): Given skill `inventory-ui` và bài kiểm sổ linh kiện, When đọc mục 1 của skill, Then nó tả đúng hình dạng
  mà bài kiểm khẳng định: mỗi linh kiện xuất ra, tệp, cấp, nguồn thư viện hay của kho, thuộc tính, biến thể và mặc định —
  không còn nói «mỗi phần».
- AC-10: Given ba lời đáp của chủ kho, When đọc dữ liệu của lệnh kiểm và sổ quyết định, Then `design/theme.json` ghi
  `conformanceLevel: AA` và `productType: application`; sổ có ba dòng `conformance-level`, `source-color`,
  `product-type` loại `judgment`; `color-contrast` được giữ bằng bốn phép kiểm tương phản ngưỡng 4.5 (sáng và tối, màu
  chính trên nền và chữ trên màu chính); và `--onehub-blue` trong stylesheet là `#0246ff`.
- AC-11: Given stylesheet ở HEAD, When chạy công cụ sổ token không ghi, Then nó thoát 0 và in
  `design/tokens.json is up to date`, và `design/tokens.json` ghi màu `primary` là `#0246ff`.

## Coverage

Phủ theo sáu bước nhánh đã làm, kê ở design doc mục «Thay đổi, theo thứ tự trên nhánh»:

| Bước | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| 1. Nhận plugin: công cụ, mục trong cổng, sổ token, dữ liệu lệnh kiểm, sáu dòng máy giữ | AC-1, AC-2, AC-11 |
| 2. Ba lời đáp, tương phản, số phiên bản sổ màn | AC-10; số phiên bản sổ màn do `ledger-shapes` giữ, ở AC-2 |
| 3. Chạy lại lint của kho | AC-2, AC-3 |
| 4. Sổ linh kiện do plugin ghi, công cụ cũ bỏ, người đọc sổ | AC-4, AC-5, AC-6, AC-7, AC-8, AC-9 |
| 5. Thoát đủ ký tự | Ngoài phạm vi: mã của plugin, có bài kiểm ở kho design-assembly; quét mã của PR là phép đo độc lập |
| 6. Gộp `main` hai lần | AC-1 (cổng xanh trên cây đã gộp), AC-6 (sổ khớp mã đã gộp) |

Người đọc sổ linh kiện, kê trước từ việc tìm tên tệp trên toàn kho: `mk/design.mk` (AC-7), `tools/design-assembly/`
(AC-1, AC-6), `tests/design-registry.test.ts` (AC-5), `tools/proof_gate/` (AC-8), `.claude/skills/inventory-ui/SKILL.md`
(AC-9). Các nhắc tới trong `docs/` và `_acceptance/` là ghi chép của lúc đó, không đọc sổ.

## Out of scope

- Sửa hai luật lint còn để lọt đoạn mã phạm: `whole-class-names` (tên lớp ghép bằng dấu cộng) và `lint-exceptions`
  (ngoại lệ không lý do cho luật ngoài `onehub-ui/`, và tắt mọi luật cho cả tệp).
- Khai sổ token và sổ linh kiện với kit nghiệm thu (PR #59).
- Chốt `DataRegion` là khuôn hay organism.
- Phép so sổ mới với sổ cũ (đo ở kho design-assembly, ghi ở design doc).
- Bài kiểm cho bản sửa thoát ký tự (bước 5): nó ở kho design-assembly.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Hai quyết định lint vẫn chỉ khai, không được chạy lại, vì lint để lọt đoạn mã phạm: `whole-class-names`,
  `lint-exceptions`.
- Hướng nhập giữa các phần (`tier-direction`) chưa có đoạn mã phạm, nên luật của nó không được chạy lại.
- Ba phép đo mới của hồ sơ nằm ở `rang/`: chúng chạy ở lượt chấm và lượt ghim lại, không chạy trong `make check`. Sau khi
  gộp, `make check` vẫn giữ chín phép kiểm lint qua lệnh kiểm design-assembly, và lệnh ấy đỏ khi dữ liệu của nó trỏ luật
  khác luật dòng sổ nêu; thứ không ai giữ nữa là việc các dòng sổ cũ còn nguyên (AC-4).
