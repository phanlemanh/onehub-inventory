## Trong hợp đồng

- **Lint re-run says a decision is held by the named rule even when that rule never fires; spacing stays green with no-off-scale-spacing turned off**
  file: `tools/design-assembly/check.mjs:550`
  severity: high
  AC: AC-2
  source: bugs
  detail: `KINDS.lint.run` only asks whether any rule blocks each probe (`fired[index].length === 0`). It does not require `check.rule` (the rule the ledger row names) to be among the rules that fired. `ledgerView` still prints the status 'held (eslint:<rule>, re-run here)' for that rule, and lint-rerun.mjs (AC-2) treats that string as evidence. Measured on the repository: the spacing probes (`p-[13px]`, `gap-[7px]`) are blocked only by shadcn/no-arbitrary-values. onehub-ui/no-off-scale-spacing never fires, because it catches only off-scale numeric steps such as h-9.25 (tools/eslint-ui/rules/no-off-scale-spacing.mjs UTILITY), not bracketed values. color-role and type-scale are also blocked by shadcn/no-arbitrary-values alongside. On a linked temporary copy (linkedCopy), turning off only onehub-ui/no-off-scale-spacing, only onehub-ui/no-hardcoded-color, or only onehub-ui/no-arbitrary-text-size still gives `check.mjs` exit 0 and still prints '18 decisions held by 21 checks'. So three of the nine lines 'held by the repository's lint rule, re-run here' do not prove the rule the ledger row points to, and for spacing the named rule contributes nothing. The red direction (change) turns off every rule that fired at once, so it still passes 'seen failing'. AC-3 tests only raw-table, the one case with a single rule, so it does not expose this. Fix: have run() require result.fired[i].includes(check.rule) for every probe, and have change() turn off only check.rule.
  rationale: AC-2 requires nine decisions to be held by the lint rule the ledger row names, re-run here; for spacing and others that named rule never fires, so the claim fails.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The register-regeneration measure can never fail when make gen changes other files, though its header says it stops at the first problem**
  Người dùng thấy gì: If regenerating changes some other file, the acceptance check only warns and still reports success. Today nothing is broken, but a dirty tree could slip through unnoticed.
  Căn cứ: Low impact: nothing is wrong today, and the check can be tightened later at small cost without affecting users.
  file: `_acceptance/adopt-design-assembly/rang/register-regenerated.sh`
  severity: low
  Đề xuất: known-limits

- **The human-facing card still shows the old Vietnamese folder path, which no longer exists after the English rename**
  Người dùng thấy gì: The card shown to the approver names a folder under its old name, which no longer exists. A reader may be briefly confused, but the rename is recorded elsewhere.
  Căn cứ: Cosmetic only, no data or behaviour affected, and the decision log is append-only so correcting it costs more than it gains.
  file: `_acceptance/adopt-design-assembly/card.html`
  severity: low
  Đề xuất: wont-fix

- **Register lists every re-exported component a second time, with no props, under the barrel file**
  Người dùng thấy gì: Nine filter components appear twice in the component register, once with full details and once empty. An agent looking one up can get two conflicting answers about the same component.
  Căn cứ: Moderate: it can mislead whoever reads the register, but nothing is lost, and a separate fix to the register tool is cleaner than patching it inside this adoption.
  file: `tools/design-assembly/components.mjs`
  severity: medium
  Đề xuất: new-contract

- **register-regenerated.sh runs make gen on the real repository, so the evidence is overwritten and a second run passes**
  Người dùng thấy gì: If the register is out of date, the acceptance check rewrites it while checking, so a second run looks fine. The first run does report the problem, and today the register is current.
  Căn cứ: Low risk now because the first run still fails visibly; it only matters when the register goes stale, and the working tree shows the change.
  file: `_acceptance/adopt-design-assembly/rang/register-regenerated.sh`
  severity: medium
  Đề xuất: known-limits

- **exit() inside try skips finally, leaving the temporary linked copies behind**
  Người dùng thấy gì: When an acceptance check fails, two temporary folders are left behind on the machine. The check result itself is correct.
  Căn cứ: Harmless clutter in a temp directory that the system cleans up, so the fix is not worth opening work.
  file: `_acceptance/adopt-design-assembly/rang/lint-rule-off.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 — tuyên quét LỚP nhưng chỉ có điểm-case: «mỗi linh kiện xuất ra là một mục có file, level, source»**
  Người dùng thấy gì: The test claims every component has a file, level and source but only spot-checks a few. A component missing one of these could go unnoticed.
  Căn cứ: The register is generated by a tool and currently correct, so the risk is small and the test can be strengthened later cheaply.
  file: `tests/design-registry.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP nhưng chỉ có điểm-case: «both bought libraries as libraries, and the templates folder as templates»**
  Người dùng thấy gì: The test says all bought-library components are labelled as libraries but checks only one per folder. A wrongly labelled component elsewhere would not be caught.
  Căn cứ: Mislabelling would be a cosmetic register error, easy to spot and fix, and none exists now.
  file: `tests/design-registry.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm tính đứng một mình: SidebarSeparator không có variants**
  Người dùng thấy gì: One test would still pass even if the separator component vanished from the register. The register is correct today.
  Căn cứ: Tiny risk: another test already covers the register's presence of components broadly, and it is a one-line strengthening later.
  file: `tests/design-registry.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (kèm 1) — grep chuỗi lệnh trong mk/design.mk thay vì kiểm quan hệ mục đích → lệnh, và thay vì quan sát make gen hay make check**
  Người dùng thấy gì: The acceptance check looks for the right commands in the build file but not under the right step, so a misplaced command might still pass. The build file is correct now.
  Căn cứ: Only matters if someone later moves those commands, and the normal check run would likely expose it.
  file: `_acceptance/adopt-design-assembly/rang/register-regenerated.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — đếm và ngưỡng thay cho quan hệ cặp màu sáng/tối của phép kiểm tương phản**
  Người dùng thấy gì: The check counts four contrast tests but does not confirm they cover light and dark modes for both colour pairs. A wrong set of four would still pass.
  Căn cứ: The actual data is correct today, and a bad contrast setting would be visible and reversible.
  file: `_acceptance/adopt-design-assembly/rang/owner-answers.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — thẻ hứa «tắt một luật lint đang giữ quyết định» (lớp chín luật) nhưng chỉ lật một luật; tám luật còn lại chỉ dựa vào nhãn tự khai của công cụ**
  Người dùng thấy gì: The card tells the owner that turning off any of nine rules will raise an alarm, but only one rule was actually tested that way. The other eight rely on the tool's own labels.
  Căn cứ: The overclaim is on the card wording, and a real gap in one of the eight would be caught by the other finding about the lint re-run.
  file: `_acceptance/adopt-design-assembly/rang/lint-rule-off.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — «đúng chín phép kiểm loại lint» không được đếm; số 9 in ra là hằng**
  Người dùng thấy gì: The check prints that there are nine lint checks without actually counting them, so an extra duplicate would not be noticed. The count is right today.
  Căn cứ: Low impact: only a future accidental duplicate would slip through, and it is easy to correct later.
  file: `_acceptance/adopt-design-assembly/rang/lint-rerun.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
