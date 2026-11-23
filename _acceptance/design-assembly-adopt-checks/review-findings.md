## Trong hợp đồng

- **The 'nothing else changed' check (AC-4) fails on the branch: the plan document is not in its list of allowed files**
  AC: AC-4
  file: `_acceptance/design-assembly-adopt-checks/rang/matrix.mjs:30`
  severity: high
  source: conventions
  detail: In matrix.mjs, FILES (lines 29-35) lists the only files the branch may change outside _acceptance/. It includes the record's design doc (docs/superpowers/specs/2026-11-23-design-assembly-adopt-checks-design.md) but leaves out the plan, docs/superpowers/plans/2026-11-23-design-assembly-adopt-checks.md. Commit b31b78dd ('plan and measures ready for grading') added that plan, so it is in the diff against the merge-base 9bf4054f. I ran `bash _acceptance/design-assembly-adopt-checks/rang/chay.sh shape` on HEAD. It fails with 'shape: file changed outside the matrix: docs/superpowers/plans/2026-11-23-design-assembly-adopt-checks.md'. E6 expects a pass and the line '... files changed: 5'. For the same reason, the two-way test 'shape: green on the repository' (hai-chieu.mjs:96-98) goes red, so E4 cannot reach 17/17. The fixed count 'files changed: 5' in matrix.mjs:56, evals.yaml E6 and hai-chieu.mjs:97 is also wrong now: HEAD has 6 files outside _acceptance/ and the gate views. Either the plan is added to FILES and the count changes to 6, or the plan comes out of the branch. As committed, AC-4 cannot pass. The other two record checks pass on HEAD: pointers prints '10 rows point at their check', and rules prints the expected line. The tool check.mjs prints '22 decisions held by 30 checks...'.
  rationale: AC-4 allows outside _acceptance/ only the three design ledgers, the record's design doc and one wiki log line; the branch also carries the plan doc, so AC-4 fails.

- **AC-4 measure (E6) and the two-way suite (E4) fail at HEAD: the plan doc added in b31b78dd is outside the matrix**
  AC: AC-4
  file: `_acceptance/design-assembly-adopt-checks/rang/matrix.mjs:30`
  severity: high
  source: bugs
  detail: Commit b31b78dd ('plan and measures ready for grading') added docs/superpowers/plans/2026-11-23-design-assembly-adopt-checks.md. That file is not in FILES, which lists only the three design ledgers and DESIGN_DOC, and it is not under LOG_FOLDER. At HEAD, with merge-base origin/main = 9bf4054f, `bash rang/chay.sh shape` fails and prints 'shape: file changed outside the matrix: docs/superpowers/plans/2026-11-23-design-assembly-adopt-checks.md'. The expected output was a pass with '... files changed: 5'. For the same reason, `chay.sh two-way` reports 17 tests, 16 pass, 1 fail: 'shape: green on the repository' (hai-chieu.mjs:96-97) fails. So E6 (AC-4) and E4 (AC-2) are red on the branch the record claims is ready for grading. The red-case tests in the shape suite still pass, because they only check that the output contains the pinned message, and this extra fault does not stop that. One of two fixes is needed: drop or move the plan doc off the branch, or add it to FILES and update the pinned 'files changed: 5' in matrix.mjs, evals.yaml E6 and contract AC-4.
  rationale: Same root cause: the extra plan doc is a changed file outside the set AC-4 permits, so AC-4 fails.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Shape 3 (asserts a string is present when the promise is a relation): the pointers measure takes a file-wide comment label as proof that the check exists**
  Người dùng thấy gì: Một quyết định thiết kế có thể được tính là đã có kiểm tra chỉ vì tệp kiểm thử còn dòng ghi chú mang tên nó, dù chưa chắc có bài kiểm thử nào thật sự giữ quyết định đó. Người dùng cuối không thấy gì khác ngay, nhưng sau này một quyết định có thể mất kiểm tra mà bộ kiểm không báo.
  Căn cứ: Rủi ro nhẹ và chỉ ảnh hưởng độ chắc của lưới kiểm tra nội bộ, không làm mất dữ liệu; sửa sau được rẻ khi cần nên ghi là hạn chế đã biết.
  file: `_acceptance/design-assembly-adopt-checks/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (asserts a string is present when the promise is a relation): the shape measure prints '8 rows gained a check' as a fixed line and accepts a row whose check was changed rather than added**
  Người dùng thấy gì: Phép đo có thể báo đúng tám dòng được thêm kiểm tra trong khi một dòng thật ra chỉ bị đổi kiểm tra cũ. Với nhánh này điều đó không xảy ra, nên người dùng không bị ảnh hưởng.
  Căn cứ: Chỉ là kẽ hở trong công cụ chấm ở một tình huống chưa xảy ra, không ảnh hưởng người dùng hay dữ liệu; sửa sau rẻ nếu cần.
  file: `_acceptance/design-assembly-adopt-checks/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
