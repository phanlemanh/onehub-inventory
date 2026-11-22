# Review findings: upgrade-design-assembly-0-33-0

## Trong hợp đồng

- **AC-6 check on the two drawn pages accepts any change that only alters digits, on any record's line**
  AC: AC-6
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs:43`
  severity: medium
  source: bugs
  detail: The contract (contract.md AC-6, evals.yaml header) says PRODUCT-MAP.md and LO-TRINH.html may change only on lines that name this record, or in the per-stage task counts. `drawnPageProblems` does not test that. Before pairing removed segments with added ones, it runs `norm = (s) => s.replace(/chưa có/g, "0 việc").replace(/\d+/g, "#")` on every segment. So if another record's line changes only a number (for example `Đầu chủ gõ mã căn ... 7d` becoming `... 8d`, a PR number, a date, or a progress figure like `52/69`), the removed and added segments both normalize to the same text, cancel out, and the check stays green. The pattern that would have kept this to counts, `DRAWN_LINE_MAY` (/\d+ việc|chưa có|"so":|"dem":|<b>\d+<\/b>/) in rang/matrix.mjs:115, is exported but never imported or used anywhere. The break case in two-way.mjs (gõ→nhập) changes only words, so it never exercises this path, and the measure is weaker than its criterion without anyone seeing it. Two smaller looseness points: a line removed and re-added unchanged in another place cancels out the same way, and once the record's own line is added, any added `#` heading is allowed. Suggested fix: normalize digits only inside segments that match DRAWN_LINE_MAY, and add a break case that changes one digit on another record's line.
  rationale: AC-6 cho hai trang vẽ đổi chỉ ở dòng nói hồ sơ này hoặc số đếm việc theo nấc; phép đo bỏ qua thay đổi chỉ-số trên dòng hồ sơ khác nên không giữ đúng điều AC-6 viết.

- **Shape 3 (asserting a string is present when the promise is a relation): the no-main red case never ties each row to its own no-main message**
  AC: AC-5
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/shallow-two-way.mjs:33`
  severity: medium
  source: measurement
  detail: AC-5 and E9 promise that when origin has no main, both decision-sheet and owner-calls report that there is no main branch to compare with. The red case at lines 30-35 checks two separate things. First, `...ROWS.map((row) => `${row}: what this branch`)` checks each row prefix. Second, `NO_MAIN` ('origin has neither main nor master') is checked once, anywhere in the whole output (`wants.filter((want) => !r.out.includes(want))`). In the tool, the text after 'what this branch' is generic: 'writes cannot be compared: ${branch.problem}' (owner-calls.mjs:393) and 'adds cannot be read ...: ${branch.problem}' (owner-calls.mjs:447). The problem can have several causes: 'no remote named origin' (:275), 'is not one git knows' (:152), 'none of main, master' (:161), and 'neither main nor master' (:249). So the case still passes when only one row prints NO_MAIN and the other row fails for a different reason. The per-row link between the row and the no-main message is never asserted. A correct check would require each `${row}: ... neither main nor master` on the same line.
  rationale: AC-5 đòi cả hai hàng đều báo không có nhánh chính để so; phép đo chỉ tìm câu báo ở đâu đó trong đầu ra, không buộc từng hàng.

- **Shape 5 (claims to cover a whole class but has only point cases): the drawn-page rule ignores the matrix written first and masks every number**
  AC: AC-6
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs:37`
  severity: low
  source: measurement
  detail: AC-6 allows `PRODUCT-MAP.md` and `LO-TRINH.html` to change only 'on lines that name this record, or on the per-stage counts'. matrix.mjs:115 writes that class down first as `DRAWN_LINE_MAY = [new RegExp(SLUG), /\d+ việc|chưa có|"so":|"dem":|<b>\d+<\/b>/]`. evals.yaml says 'every measure reads it', but no measure imports `DRAWN_LINE_MAY` (grep finds only its definition). Instead, `drawnPageProblems` uses `norm = s.replace(/\d+/g, "#")` at line 37, so any change made only of digits counts as allowed. That includes dates, row numbers and other records' figures, not just the per-stage counts. The only red case for drawn pages (two-way.mjs:128-132) changes a word ('gõ' to 'nhập'). No case tries a number changed on another record's line, so the class of allowed changes is never shown to be the class the matrix declares.
  rationale: Cùng gốc với t1: lớp thay đổi được phép của AC-6 (dòng hồ sơ này hoặc số đếm theo nấc) bị phép đo nới thành mọi thay đổi chỉ-số.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
