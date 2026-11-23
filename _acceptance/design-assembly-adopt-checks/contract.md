---
schema_version: 1
feature: Tiếp nhận design-assembly — tám quyết định thiết kế đã ghi được nối vào kiểm tra sẵn có, thêm hai dòng phông chữ
slug: design-assembly-adopt-checks
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [config, tooling]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-23
design_doc: docs/superpowers/specs/2026-11-23-design-assembly-adopt-checks-design.md
---

# Acceptance Contract: design-assembly-adopt-checks

## Context

Thay đổi đã làm sẵn trên nhánh `chore/design-assembly-adopt` (commit `48c33f30`, PR 111) theo lời chủ kho ngày
2026-11-23: sau lần kiểm tra hệ thiết kế, chạy bước tiếp nhận của design-assembly ở nhánh riêng và nối cả tám quyết định
đã ghi mà chưa trỏ tới kiểm tra nào («Nối cả 8»). Công cụ tiếp nhận viết lại ba tệp: bản ghi quyết định
(`design/decisions.yaml`), dữ liệu kiểm tra (`design/theme.json`) và trang luật cho tác tử dựng màn
(`.claude/rules/design-assembly.md`); thêm một dòng nhật ký wiki. Cổng nghiệm thu trên CI đỏ vì PR thiếu hồ sơ. Hồ sơ này
chấm đúng những gì nhánh đã làm.

Source input: lời chủ kho ngày 2026-11-23 («Có, nhánh riêng», «Nối cả 8», «Chạy vòng nghiệm thu»); design doc ở
`design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0 và đầu ra có dòng
  `design-assembly: 22 decisions held by 30 checks, each seen failing on a changed copy` (trước nhánh: 19 quyết định).
- AC-2: Given bản ghi quyết định ở HEAD, When đọc mười dòng của ma trận viết trước ở `rang/matrix.mjs`, Then mỗi dòng
  trỏ đúng kiểm tra ma trận ghi: bốn tệp kiểm thử được trỏ mang nhãn `decision:<mã>` của chính dòng ấy, và ba dòng
  `target-size`, `font-loaded`, `typeface` có mục kiểm tra trong `design/theme.json`.
- AC-3: Given nhánh ở HEAD, When chạy hai tệp kiểm thử đơn vị được trỏ (`tests/format.test.ts`, `tests/grid.test.tsx`) và
  bộ kiểm thử trình duyệt của kho (gồm `tests/e2e/frame.spec.ts`, `tests/e2e/grid.spec.ts`), Then mọi bài đạt.
- AC-4: Given chỗ nhánh rời `origin/main` (lúc mở hồ sơ là `9bf4054f`), When so bản ghi quyết định và danh sách tệp đổi, Then đúng tám dòng
  có thêm một dòng `check:`, đúng hai dòng mới (`font-loaded`, `typeface`), không dòng nào khác đổi hay mất, và ngoài
  `_acceptance/` chỉ ba tệp sổ thiết kế trên, tài liệu thiết kế của hồ sơ này và một dòng nhật ký wiki đổi — không bảng
  kiểu, mã màn hay thành phần nào. Commit so sánh là chỗ nhánh rời `origin/main` lúc chạy, nên gộp `main` vào nhánh không
  làm đổi phép so.
- AC-5: Given trang luật cho tác tử ở HEAD, When so nó với dữ liệu kiểm tra `design/theme.json`, Then trang có đủ sáu mục
  của ma trận, mục «Controls» nói đúng cỡ chạm mà dữ liệu kiểm tra giữ (24px), mục «Type» nói đúng phông tiêu đề mà dữ
  liệu kiểm tra giữ (`var(--font-sans)`), và chỉ đúng một dòng sai đã biết (Hỏi-1).

## Coverage

Phủ theo từng thứ nhánh đổi và bên đọc của nó; không quét không gian tiêu chí (dòng sổ `descope` «bỏ coverage-scan»):

| Thứ bị đổi | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| Tám dòng có thêm `check:` | AC-2 (trỏ đúng, đích có thật), AC-3 (đích chạy xanh), AC-4 (chỉ thêm `check:`) |
| Hai dòng mới `font-loaded`, `typeface` | AC-2 (có mục kiểm tra), AC-1 (công cụ giữ và đã thấy đỏ trên bản đổi) |
| Dữ liệu kiểm tra `design/theme.json` | AC-1, AC-2 |
| Trang luật cho tác tử | AC-5 (khớp dữ liệu kiểm tra, đúng một dòng sai đã biết — Hỏi-1). Bên đọc là tác tử dựng màn |
| Phần cắt khỏi vòng | Ba dòng sổ `descope`: nguồn phông Inter, 16 loại phần tử chưa đo cỡ chạm, ba luật lint |
| Không gì khác đổi | AC-4 |
| Dòng nhật ký wiki | Ngoài phạm vi: ghi chép, `make check` giữ định dạng wiki |

## Out of scope

- Sửa dòng sai về phông thân bài trong trang luật cho tác tử: lỗi của công cụ design-assembly, sửa ở kho ấy.
- Đo các control chưa đo được của cỡ chạm (16 loại phần tử trong menu, hộp thoại, thanh bên): công cụ chỉ đọc chiều cao
  khai trong mã thành phần.
- Dòng nguồn phông Inter trong sổ nguồn: cần người viết, kèm giấy phép.
- Ba luật lint bắt hẹp hơn mẫu thử của công cụ (tên class ghép, ngoại lệ không lý do, khoảng cách ngoài thang).
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Các con số (22 và 30, tám dòng, hai dòng, bốn tệp) đọc từ kết quả nhánh đã có: tiếp nhận là việc tất định, hồ sơ chấm
  sau khi làm.
- Phép đo AC-4 tính lại chỗ nhánh rời `origin/main` mỗi lần chạy; mã ghim ở `rang/matrix.mjs` chỉ dùng khi không đọc
  được `origin/main`. Sau khi PR đã gộp, phép đo không còn gì để so.
- Trang luật cho tác tử ghi «Running text is set in `undefined`» và dẫn tới `design/blueprint.json` không có trong kho
  (Hỏi-1). AC-5 giữ rằng đó là dòng sai duy nhất và hai luật có số của trang khớp dữ liệu kiểm tra; cổng vẫn giữ phông bằng
  hai dòng `font-loaded`, `typeface`.
