# Review findings: thanh-vien-chon-tu-reui (round 1)

## Trong hợp đồng

- **Row 9c lock test throws when the checkout is shallow, so 'make check' fails on pull requests in CI**
  file: `tests/thanh-vien-khoa-bai.test.ts:19`
  severity: high
  AC: AC-7
  source: conventions
  detail: base() runs `git merge-base HEAD origin/main`, falls back to `main`, and otherwise throws 'no main branch to compare with'. The call `const from = base();` sits directly in the describe body, so the whole file fails at collection time. In .github/workflows/ci.yml the `check` job (which runs `make check`) uses actions/checkout@v7 with no fetch-depth. On a `pull_request` event that gives a depth-1 checkout of the PR merge ref, with no origin/main and no local main branch. So both refs fail and the file errors. The repo already has a pattern for tests that read git history: tests/danh-muc-chuyen-mau.test.ts (snapshotFromGit) returns null and skips the comparison when the checkout has no history. This test does not follow that pattern. AGENTS.md says not to edit .github/workflows/, so the fix has to be in the test: skip or degrade when there is no base. Changing the CI checkout is not an option.
  rationale: AC-7 requires make check to be green; in CI's shallow checkout this test errors, so make check fails.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New column label 'Ngày mời' (columns.invitedAt) is never used**
  Người dùng thấy gì: A label for an invite date sits unused in the Members screen's text file. Users never see it and nothing on screen changes.
  Căn cứ: Harmless to users and invisible on screen; removing it later is trivial and cheap, so it does not justify its own work item.
  file: `src/app/(app)/members/copy.ts`
  severity: low
  Đề xuất: wont-fix

- **Shape 3: the list only checks that a row contains the text «Người mời:», not that it names the right inviter**
  Người dùng thấy gì: The automatic check on the Members list would not notice if a row showed the wrong inviter or a dash by mistake. The screen itself is not shown to be wrong.
  Căn cứ: Users are not affected today since the screen builds the column correctly; the risk is only a future regression slipping through, and it can be tightened later at low cost.
  file: `tests/e2e-db/thanh-vien.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 3: the check that the badge sits beside the invite title is always true**
  Người dùng thấy gì: The automatic check that the workspace label sits next to the invite dialog title is looser than promised. The dialog itself is not shown to look wrong.
  Căn cứ: No user-visible harm now, and a height check partly covers it; a layout slip would show in the screenshot review, so recording it as a known limit is enough.
  file: `tests/e2e-db/thanh-vien.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: «no count» and «no footer» are checked only by absence, with nothing to compare against**
  Người dùng thấy gì: A check that the list frame shows no count and no footer when none is given could pass even if the frame drew an empty count line. Users see no difference today.
  Căn cứ: Nothing wrong reaches users; the gap only weakens a safety net, and the extra effort to tighten it outweighs the small risk.
  file: `tests/framed-list.test.tsx`
  severity: low
  Đề xuất: wont-fix

- **Shape 5: the nine-state matrix exists only in a comment, and the final check just counts pushes**
  Người dùng thấy gì: The check that all nine screen states were exercised only counts them, so a misnamed or duplicated state could still pass. The states on screen are not shown to be wrong.
  Căn cứ: No user impact now; it could let a missed state go unnoticed later, but it is easy to tighten in a follow-up and nothing is lost or exposed.
  file: `tests/e2e-db/thanh-vien.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
