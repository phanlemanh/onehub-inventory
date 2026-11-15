# Review findings: bang-hang-theo-dia-ly (round 6)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SP-1 / one place per rule: the geography tree is built twice, from different rows**
  Người dùng thấy gì: The side list of places and the table are built separately, so in the edge-case sample view they could disagree about which places exist. Today it only affects sample data.
  Căn cứ: No data is lost or leaked and nobody sees it with the normal sample; it only matters once real data is connected, and it is already planned for a later row.
  file: `src/app/(app)/layout.tsx`
  severity: medium
  Đề xuất: known-limits

- **Design: the filterIsEmpty doc comment moved onto wholeName**
  Người dùng thấy gì: A code note sits above the wrong function. Users see nothing different.
  Căn cứ: It has no effect on users and costs almost nothing to fix later whenever someone touches that file.
  file: `src/components/candidate/grid-view.ts`
  severity: low
  Đề xuất: wont-fix

- **Module boundaries: a module test imports from the app layer**
  Người dùng thấy gì: A test file reaches into the screen layer, against the project's layering rule. Users see no difference.
  Căn cứ: It affects only how the code is organised, not the product, and can be tidied at any time without risk to users.
  file: `src/modules/listings/ui/geo-tree.test.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative assertion with no positive control): the checks for place-count and geo-tree slots look for selectors no code ever renders**
  Người dùng thấy gì: The check that the side list shows no counts could stay green even if counts came back in another form. Users could later see numbers the owner removed without any test noticing.
  Căn cứ: Nothing is wrong on screen today and a regression would be visible and easy to fix, but the safety net is weaker than claimed.
  file: `tests/dia-ly.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Shape 1 (measures the expectation instead of the output): checkKept is fed a value the test computes, not what the screen shows**
  Người dùng thấy gì: One check that the status filter is kept after picking a building does not read the screen, so it could miss a bug where that filter is dropped. The browser-level test still covers it.
  Căn cứ: The behaviour is covered by another test, so the risk is low and a miss would be visible and recoverable by reloading.
  file: `tests/dia-ly.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Shape 2 (hand-built fixture): the 'empty building in the catalog' break pushes a node into the finished tree instead of going through the catalog**
  Người dùng thấy gì: The check that an empty building never appears in the side list is partly staged by hand. Another test still confirms the real behaviour.
  Căn cứ: Users are not affected today and the main behaviour is tested elsewhere; only the failure message is less precise.
  file: `src/modules/listings/ui/geo-tree.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims to scan a whole class but checks a sample): E2 does not walk imports from the 5 files it names**
  Người dùng thấy gì: The automatic check that the side list adds no new way to read company data looks at fewer files than promised. A new read added elsewhere might go unnoticed.
  Căn cứ: No extra read exists today, so no data is exposed; the gap only weakens a future safety net and can be closed later at low cost.
  file: `tests/dia-ly.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (count where a set relation was promised): E8 and E7 compare footer counts, not sets of row ids**
  Người dùng thấy gì: The browser tests confirm the number of rows after picking a place, not that they are exactly the right rows. A wrong set with the same count would pass.
  Căn cứ: A mix-up with identical counts is unlikely and would be visible to users and fixed by refiltering; the test can be tightened later.
  file: `tests/e2e-db/dia-ly.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative assertion that passes by default): footerCount returns 60 when the footer does not match**
  Người dùng thấy gì: If the row-count line under the table disappeared or changed wording, several browser tests would still read it as 60 rows and pass.
  Căn cứ: The footer is displayed and checked by other tests, so the chance of a hidden problem is small and the fix is cheap but not urgent.
  file: `tests/e2e-db/dia-ly.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 1 (measures the instructions instead of the output): E10 greps behaviors.md for the rule text**
  Người dùng thấy gì: One check only confirms a sentence exists in a design document; the typing-filter behaviour itself is tested separately. Users are not affected.
  Căn cứ: It is harmless extra evidence with no effect on users, so fixing it is not worth the effort.
  file: `tests/dia-ly.test.tsx`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
