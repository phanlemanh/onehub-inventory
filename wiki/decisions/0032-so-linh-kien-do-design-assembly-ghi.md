---
type: decision
title: Sổ linh kiện do công cụ design-assembly ghi, theo hình dạng của hợp đồng
links:
  [
    design/component-registry.json,
    tools/design-assembly/components.mjs,
    mk/design.mk,
    tests/design-registry.test.ts,
    .claude/skills/inventory-ui/SKILL.md,
    _acceptance/config.yaml,
  ]
sources:
  [
    "chủ kho, 2026-11-14: cho làm bước 3 trên nhánh riêng («Cho, nhánh riêng»)",
    "design-assembly, quyết định 0034: so bộ đọc linh kiện với công cụ của kho này trên một bản sao",
  ]
---

# 0032 Sổ linh kiện do công cụ design-assembly ghi, theo hình dạng của hợp đồng

## Status

Proposed, 2026-11-14, trên nhánh `chore/adopt-design-assembly`, chưa đẩy, chưa gộp. Chủ kho cho làm bước này trên nhánh
riêng; gộp nhánh cần người giữ mã ký, vì nhánh đụng `tools/`, `mk/` và `.claude/`.

## Context

`design/component-registry.json` do công cụ viết tay của kho ghi, theo tệp: mỗi tệp một mục, mỗi mục một danh sách
phần. Kit nghiệm thu từ chối sổ đó (số phiên bản là số, thiếu loại, phần là đối tượng), nên kit chưa khai được sổ linh
kiện và kho đứng ở bậc M1. Công cụ design-assembly đã có trong kho từ bước 1 và ghi được sổ theo hình dạng kit đọc.

So trên một bản sao, theo tên, 270 linh kiện có ở cả hai sổ: thuộc tính giống 268, biến thể giống 262 (tám chỗ khác là
thuộc tính nhận danh sách chữ, sổ mới ghi thêm vào biến thể), cấp giống 269, mười tệp khuôn như nhau. 64 tên chỉ sổ cũ
có, đều không phải linh kiện: 34 hằng số viết hoa và 30 kiểu dữ liệu.

## Decision

1. Sổ linh kiện do `tools/design-assembly/components.mjs` ghi: mỗi linh kiện xuất ra một mục, với tệp, cấp, nguồn
   (thư viện hay của kho), thuộc tính, biến thể dạng `trục=giá trị` và mặc định. Thư mục ReUI là thư viện.
2. `make gen` ghi lại sổ bằng công cụ đó; `make check` đỏ khi sổ không còn khớp mã nguồn. Công cụ cũ
   `tools/design_registry.mjs` bị bỏ, để một tệp chỉ có một bên ghi.
3. Dòng sổ quyết định «cấp linh kiện» trỏ tới công cụ mới. Bài kiểm sổ và skill `inventory-ui` đọc hình dạng mới.
4. Khai sổ token và sổ linh kiện với kit, ở `design_floor` của `_acceptance/config.yaml`.

## Consequences

- Kit đọc được cả hai sổ; trên bản sao, kho lên bậc M2.
- Tác tử dựng màn đọc sổ theo linh kiện thay vì theo tệp; tên tệp vẫn có ở mỗi mục.
- `DataRegion`: trang kiểu màn «lưới» gọi nó là khuôn, sổ cũ xếp nó là organism. Sổ mới theo trang kiểu màn, nên nó là
  khuôn. Chủ kho chưa chốt điều này.
- Các ghi chép cũ trong `docs/` và `_acceptance/` còn tả sổ theo tệp; chúng là bản ghi của lúc đó, không sửa.
