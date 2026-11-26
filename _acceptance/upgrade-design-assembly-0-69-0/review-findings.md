## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **lint-scope measure (AC-7) passes when ESLint lints none of the three probe files**
  Người dùng thấy gì: If a later config change silently stopped checking the tool folder and the probe files, the acceptance check would still report green. Today's product is not affected; only the check's ability to warn is weaker.
  Căn cứ: No user-facing harm now since the current setup is correct; it only weakens an internal safety net for a future mistake, and can be fixed cheaply later if that mistake ever becomes likely.
  file: `_acceptance/upgrade-design-assembly-0-69-0/rang/lint-scope.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims a class sweep but has only point cases): tool-tree has nine red conditions, and the two-way pairing shows only five of them failing**
  Người dùng thấy gì: Four ways the tool version record could drift from the plugin's templates were never shown to be caught by the check. Users see no effect now, but a future drift of that kind might go unnoticed.
  Căn cứ: The current state is correct and verified green; the gap only affects how well the check catches future drift, and it can be added later without any user impact.
  file: `_acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (asserts a string is present when the promise is a relation): the decision-states red case accepts any break and does not show that only raw-table changed**
  Người dùng thấy gì: The check that proves one design decision changes state when its safeguard is removed could pass for a wrong reason if the old tool crashed. Users are not affected; it only makes the proof less strict.
  Căn cứ: Only an unusual crash of the old tool would trigger it, nothing is lost or exposed for users, and tightening it later is cheap.
  file: `_acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
