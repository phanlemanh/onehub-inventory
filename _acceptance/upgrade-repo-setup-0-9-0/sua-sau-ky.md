# upgrade-repo-setup-0-9-0 · Sửa sau chữ ký

## AC-9 sau khi tách sổ log, 19/11/2026

AC-9 nói bốn sổ là `one-file` ở HEAD. Hồ sơ `split-log-ledger` tách sổ log đúng như mục Out of scope của hồ sơ này
hẹn (PR 2 đến 5 của kế hoạch), nên E10 (`rs090_ledgers`) đỏ «ledger log is fragments, not one-file», và ca «ledgers»
của `rang/two-way.mjs` đỏ vì bản lành dựng ở HEAD.

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `evals.yaml`, E10: `status: not-run` và `superseded_by: split-log-ledger#AC-3`. AC-3 của hồ sơ ấy đo lại những gì còn đúng (sổ log `fragments`, `make split DRY=1` không ghi gì cho cả bốn sổ, `mk/design-role-table.mk`, `make -n test`); câu «index, glossary, gen là one-file» không mang theo vì PR 2 tách chúng | Không | AC-3 và AC-5 của `split-log-ledger` | Cổng Phạm vi của `split-log-ledger`, Hỏi-2 |
| `rang/two-way.mjs`, ca «ledgers»: cả bản lành và bản phá dựng ở `702e71dd` (commit đã chấm của hồ sơ này) thay vì HEAD | Không. Ca vẫn chứng phép đo: xanh trên bản lành, đỏ khi `wiki/log.md` mang dấu vẽ | Ca ấy đạt; AC-5 của `split-log-ledger` | Cổng Phạm vi của `split-log-ledger`, Hỏi-2 |

Ca «rules-kept» đã đỏ trên `main` trước khi tách (`CODEOWNERS differs on lines [], not [3]`); ca «change-set» đỏ ở
mọi nhánh chưa vào `origin/main` (phép đo chỉ so commit khi nhánh đã vào). Lần sửa này không chạm hai ca ấy.
