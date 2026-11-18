# Review findings: tat-plugin-cho-cu (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **wiki/log.md: the new entry is followed by a blank line, which breaks the one-line-per-entry list**
  Người dùng thấy gì: A blank line in the change log makes the newest entry look slightly different from the others when the page is displayed. Nothing breaks and no information is lost.
  Căn cứ: The effect is cosmetic only, no data is lost, and it can be fixed later by deleting one blank line at almost no cost.
  file: `wiki/log.md`
  severity: low
  Đề xuất: known-limits

- **precondition() swallows every read/parse error of ~/.claude/settings.json and reports it as 'no old-marketplace plugin is on'**
  Người dùng thấy gì: If the user's personal settings file is broken, the check stops with a message that blames the wrong cause. It never reports a false pass, so the person only loses a little time working out what is wrong.
  Căn cứ: The check still stops and never passes by mistake, and the user can find the problem by retrying after fixing the file, so the harm is a misleading message only.
  file: `_acceptance/tat-plugin-cho-cu/rang/phien.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 5: the coverage table claims two classes of the machine-install axis, but the two-way tests check only one member of each**
  Người dùng thấy gì: The self-tests for the check prove it catches one example from each group of old plugins, not every one. A narrower check that only looked at some old plugins could still go unnoticed.
  Căn cứ: The settings file itself is correct and the real session check on the machine still counts every plugin, so the risk is a future weaker check, and adding the missing cases later is cheap and safe.
  file: `_acceptance/tat-plugin-cho-cu/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
