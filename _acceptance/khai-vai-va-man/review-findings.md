# Review findings: khai-vai-va-man (round 1)

## Trong hợp đồng

- **Design: UI surface detection does not match the kit's single source for surfaces**
  file: `tools/coverage_matrix/contracts.py:121`
  severity: low
  AC: AC-5
  source: invariants
  detail: `touches_ui` matches the exact strings ui, web and web-ui inside a YAML list. The kit (`lib/lop-nhin-thay.cjs`, tokensOf/canon) lowercases the values and also accepts a comma-separated string. So `surfaces: [UI]` or `surfaces: ui, web` count as UI for the kit, but this check would not ask for a block. Fix: normalise the same way the kit does (lowercase, split a string on commas, strip brackets and quotes) and add one test case for each form.

- **A contract whose surfaces line is written as plain text or in capitals is treated as not touching the UI, so the role × screen block is never demanded**
  file: `tools/coverage_matrix/contracts.py:122`
  severity: medium
  AC: AC-5
  source: bugs
  detail: Lines 121-123 turn a scalar `surfaces` into `[surfaces]` and then compare each item exactly with {ui, web, web-ui}. The kit is meant to be the single source for this rule (lib/lop-nhin-thay.cjs `tokensOf`). It splits on commas, removes the brackets, trims and lowercases, and its contract template says the values are comma-separated. So `surfaces: ui, config`, which YAML reads as the single string 'ui, config', and `surfaces: [UI]` both count as UI for the kit, but here touches_ui is False. Tried on a copy of the repo: a `status: draft` contract with either form and no `## Vai × Màn` section gave exit 0 with the message 'coverage-matrix: ok (... 0 contracts touching screens)'. An open UI round therefore passes `make check` with no block at all, and the report never counts it as a round that touches screens. The fix is to tokenise the same way the kit does: join, split on ',', strip '[]"\'', lowercase, then map the aliases.

- **If design/screens.yaml is not a mapping at the top level, the page-against-register check is skipped and the result is still green**
  file: `tools/coverage_matrix/registry.py:103`
  severity: medium
  AC: AC-2
  source: bugs
  detail: `_load` only reports an error when the data is None. `_check_screens` runs only when `isinstance(screens_doc, dict)`, and the loop that flags 'page ... is not in design/screens.yaml' is inside `_check_screens`. If the file parses to a list or a scalar, for example someone writes `- id: today` at the top level and drops the `screens:` key, nothing is recorded as a problem. Tried on a copy of the repo: screens.yaml set to a top-level list plus an extra page src/app/ghost/page.tsx gave exit 0 with 'coverage-matrix: ok (4 roles, 0 screens, 5 pages, ...)'. This is exactly the error AC-2 is supposed to catch (an undeclared page must be red), and here it passes silently. A non-mapping document should be added to reg.errors.

- **If ontology/roles.yaml is not a mapping at the top level, the check passes with 0 roles**
  file: `tools/coverage_matrix/registry.py:81`
  severity: low
  AC: AC-1
  source: bugs
  detail: Same pattern as screens.yaml. When roles_doc parses to a list, `if isinstance(roles_doc, dict)` skips the whole block, including the `holds: many` check and the 'no roles declared' error. Tried on a copy of the repo: roles.yaml written as `- name: ListAgent` gave exit 0 with 'coverage-matrix: ok (0 roles, ...)'. With 0 roles, role_columns is empty. A contract with no Vai × Màn table then passes without any role column being required, and nothing at all reports that the role list is broken. An else branch should record the problem.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design / Intent (AC-7): a new round escapes the Vai × Màn block once it is closed**
  Người dùng thấy gì: Một vòng làm giao diện mới nếu được ký duyệt trước khi kiểm tra chạy lần đầu thì vẫn lọt qua mà không cần bảng Vai × Màn. Số liệu 'trước khối' của đợt thử có thể bị lệch nhẹ.
  Căn cứ: Hậu quả nhẹ: chỉ làm lệch số đo của đợt thử, không mất dữ liệu, người soát hồ sơ thấy được, và sửa có thể làm sau khi đợt thử có vòng thật.
  file: `tools/coverage_matrix/contracts.py`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: the plan's fallback-YAML-parser check is not in the test suite**
  Người dùng thấy gì: Trên một máy không cài sẵn bộ đọc tệp cấu hình chính, việc kiểm tra có thể hành xử khác mà chưa ai thử. Hiện tại kết quả vẫn đúng.
  Căn cứ: Không có hỏng hóc nào hiện tại, chỉ là thiếu một lưới an toàn cho máy lạ; người dùng không thấy gì và thêm sau rất rẻ.
  file: `tests/coverage-matrix.test.ts`
  severity: low
  Đề xuất: known-limits

- **Domain: the new roles have no glossary entries**
  Người dùng thấy gì: Bốn vai mới đã dùng được nhưng chưa có mục giải thích trong bảng thuật ngữ, nên người đọc tài liệu chưa tra được nghĩa chính thức.
  Căn cứ: Đã được quyết định hoãn có chủ ý sang hàng 9a, chỉ ảnh hưởng người đọc tài liệu, không mất dữ liệu và bổ sung sau rất rẻ.
  file: `ontology/roles.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay cho quan hệ): bảng 'contracts › block errors' không ghim thông điệp vào đúng hồ sơ, màn và vai**
  Người dùng thấy gì: Nếu máy kiểm báo lỗi nhầm màn hoặc nhầm vai thì bộ thử hiện tại có thể không phát hiện. Hiện chưa thấy lỗi nhầm nào xảy ra.
  Căn cứ: Chỉ là lưới thử còn lỏng, chưa có sai thật; nếu có sai người làm kho vẫn thấy lỗi đỏ, và siết lại phép thử sau rất rẻ.
  file: `tests/coverage-matrix.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
