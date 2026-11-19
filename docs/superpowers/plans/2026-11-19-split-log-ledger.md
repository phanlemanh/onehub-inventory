# Tách sổ log của wiki — kế hoạch thi công

Hồ sơ: `_acceptance/split-log-ledger/` (T2, Cổng Phạm vi duyệt 2026-11-19). Thiết kế:
`docs/superpowers/specs/2026-11-19-split-log-ledger-design.md`. Như hồ sơ PR 88, việc đã làm trước khi trình; kế
hoạch ghi lại thứ tự đã làm để lượt chấm đối chiếu.

| Việc                                                                                 | Tệp                                                                                            | Kiểm từng việc                                                            | Phục vụ   | independent |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------- | ----------- |
| 1. `make split L=log DRY=1`, đọc kết quả; rồi `make split L=log` (commit `2e47d841`) | `wiki/log.md`, `wiki/log/*.md`, `.repo-setup.json`                                             | `python3 tools/ledgers.py shape log` in `fragments`; `make ledgers-check` | E1, E3    | false       |
| 2. Sửa hai lời dặn ghi tay, thêm mục log bằng `make log` (`05acd321`)                | `docs/van-hanh/xoay-khoa.md`, `docs/plan/dot-nen/LUAT-rieng.md`, `wiki/log/2026-11-19-02-*.md` | `node _acceptance/split-log-ledger/rang/docs-log.mjs`                     | E4        | true        |
| 3. Gỡ hai mục trùng (`c1272ef7`, Hỏi-3)                                              | `wiki/log/2026-11-11-20-*.md`, `wiki/log/2026-11-13-11-*.md`                                   | `node _acceptance/split-log-ledger/rang/so-log.mjs`                       | E1        | false       |
| 4. Sửa sau chữ ký ba phép đo, E10 khai không-chạy (Hỏi-2)                            | `_acceptance/{don-no-bo-kiem,tat-plugin-cho-cu,upgrade-repo-setup-0-9-0}/…`                    | `node _acceptance/split-log-ledger/rang/do-cu.mjs`                        | E5, E3    | true        |
| 5. Phép đo của hồ sơ và cặp hai chiều                                                | `_acceptance/split-log-ledger/rang/*`, `_acceptance/config.yaml`                               | `node --test _acceptance/split-log-ledger/rang/two-way.mjs`               | E1–E7, E9 | false       |
| 6. `make check`, `npm run build`, hook pre-commit trên tệp đổi                       | —                                                                                              | cả ba thoát 0                                                             | E8        | false       |
| 7. Đẩy nhánh, mở PR bản nháp, chờ CI                                                 | —                                                                                              | `node _acceptance/split-log-ledger/rang/ci-pr.mjs`                        | E6        | false       |
