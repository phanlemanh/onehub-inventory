# Đổi chữ commit «wip» — bảng mã trước và sau

Ngày 2026-11-28. Chủ kho cho tại phiên giám sát: «Cho đổi chữ». Chủ kho xác nhận lại tại phiên dãy D, nguyên văn «Cho đổi chữ».
Việc này cho PR #130 qua bài kiểm khuôn tên commit. Chỉ CHỮ của một commit đổi; mã nguồn không đổi một byte.

- Nhánh sao lưu nguyên trạng: `backup/nhap-excel-truoc-doi-chu-2026-11-28` → `ac5f98f87ecb1e30b74691bce15d1da126444c23`. Giữ nhánh này tới khi #130 gộp.
- Đỉnh cũ `ac5f98f87ecb1e30b74691bce15d1da126444c23` → đỉnh mới `7203b7a3ffabd59c1b7bb8c8008d82bc87f55761`. Đẩy bằng `--force-with-lease`, chỉ lên `claude/agitated-dewdney-3cdf78`.
- `git diff ac5f98f8 7203b7a3`: rỗng (0 byte).
- `git range-diff origin/main ac5f98f8 7203b7a3`: 1 commit đổi; mọi commit còn lại `=`.
  - `21:  c2414e82 ! 21:  280c38e9 wip(imports): the Nạp tệp screen — five steps, batched apply; three known red checks listed in dang-o-dau.md (row 11)`
  - dòng chữ: `wip(imports): the Nạp tệp screen …` → `feat(imports): the Nạp tệp screen …`

Các tệp của hồ sơ ghi trước ngày này (run-log, sổ quyết định, báo cáo vòng 1–3, thẻ) dẫn mã TRƯỚC khi đổi chữ. Tra bảng
dưới để biết mã ấy nay là mã nào. Không tệp nào bị sửa để xoá dấu vết.

| Mã trước khi đổi chữ | Mã sau | Commit |
| --- | --- | --- |
| `0586a445` | `0586a445` | docs(nhap-excel): design, contract, evals and scope gate card of row 11 |
| `9b74832c` | `9b74832c` | docs(nhap-excel): scope gate fixes from supervisor review (preview grid width, status rule |
| `0602d182` | `0602d182` | docs(nhap-excel): baseline green on a clean copy of HEAD |
| `945bb803` | `945bb803` | docs(nhap-excel): four gaps against Quy hang become scope gate questions (owner columns, c |
| `606ddb1a` | `606ddb1a` | docs(nhap-excel): Gate 1 approved — Manh Phan |
| `580fc6a1` | `580fc6a1` | docs(nhap-excel): implementation plan of row 11 |
| `ac4b232e` | `ac4b232e` | chore(nhap-excel): plan approved, clickable prototype of the scope gate, where-we-are note |
| `955c1457` | `955c1457` | Merge remote-tracking branch 'origin/main' into claude/agitated-dewdney-3cdf78 |
| `7a98fe99` | `7a98fe99` | feat(ontology): ImportRun, listing on a pending unit, importListings and createListing liv |
| `8cb09e32` | `8cb09e32` | feat(ontology): four import actions and createListing live; signed tests follow the new sc |
| `c6335f25` | `c6335f25` | feat(db): 015 import runs, listings on pending units, create and limited delete of listing |
| `e1f03665` | `e1f03665` | chore(nhap-excel): where-we-are note after tasks 0-2 |
| `a90c6dac` | `a90c6dac` | feat(imports): read xlsx and csv in the browser, test files with their sources (row 11) |
| `2822af69` | `2822af69` | feat(imports): deterministic marks for columns, values and units, grouped questions (row 1 |
| `89dad584` | `89dad584` | chore(nhap-excel): where-we-are note after task 4 |
| `2a827cf3` | `2a827cf3` | feat(listings,company-config,catalog): create door of listings, learning and undo of what  |
| `1e0f95dc` | `1e0f95dc` | feat(imports): preview, open, batched apply, learn, undo and recent imports over /api/v1/i |
| `037619af` | `037619af` | chore(nhap-excel): where-we-are note after the server door |
| `1f9f44e2` | `1f9f44e2` | test(db): named isolation case for imports — cross-company insert and delete, positive con |
| `89d1a6bb` | `89d1a6bb` | test(db): imports on lane Postgres through the real handlers — marks, no direct path, appl |
| `ed50165a` | `ed50165a` | feat(db,imports): 016 team leads see the company's list agents to pick a keeper; learning  |
| `c2414e82` | `280c38e9` | feat(imports): the Nạp tệp screen — five steps, batched apply; three known red checks list |
| `dc518fc1` | `a3f38ba5` | feat(imports): Nạp tệp screen behind PermittedAction; signed register tests follow the bui |
| `e0202254` | `15d6903e` | test(imports): the Nạp tệp screen without a server — read, counts, apply, undo, wrong file |
| `c2423797` | `51ded0b4` | feat(imports): Nạp tệp in the sidebar, gated by importListings (row 11) |
| `857f4e77` | `d4857916` | feat(imports): Nạp tệp shows recent imports, «Chọn tệp khác» on a wrong file, and what was |
| `c2db7109` | `56619977` | test(imports): browser cases of the Nạp tệp screen — no file leaves, states at four widths |
| `5be1938a` | `d4c5e204` | feat(imports): skip or keep a row on the preview step (row 11) |
| `bd11426c` | `539e54dc` | Merge origin/main into row 11 (nhap-excel) |
| `addf15ad` | `38e5d450` | fix(imports): the Nạp tệp screen holds every state of its matrix (row 11) |
| `c6f4784e` | `fb09a1e5` | docs(imports): family profile, block ledger line and screen proof of Nạp tệp (row 11) |
| `da89bdb8` | `4fefe267` | test(imports): the numbers of Nạp tệp are the server's, preview to Xong (row 11, E20) |
| `4a7de6d7` | `2e9fb9e8` | docs(imports): where row 11 stands after the batch restart |
| `f5f58529` | `67bac08a` | docs(design): owner keeps the multi-step screen family (row 11) |
| `2866c3b3` | `776e6fc7` | feat(imports): take floor and property type columns, kept as written on the import (row 11 |
| `1078c980` | `5f479e5c` | Merge remote-tracking branch 'origin/main' into claude/agitated-dewdney-3cdf78 |
| `5f8266b4` | `a516f5df` | test(imports): the words of Nạp tệp say their numbers and names (row 11) |
| `869014b1` | `77f486c1` | feat(inventory): Nạp tệp entry and pending units on the inventory (row 11) |
| `ae56ca46` | `4631f0e5` | docs(imports): wiki and screen proof for the inventory part of row 11 |
| `7b48c51c` | `48696698` | fix(imports): Đầu khách and Quản trị sàn do not see imports, on the owner's word (row 11) |
| `a940f4b0` | `42e80cdd` | Merge remote-tracking branch 'origin/main' into claude/agitated-dewdney-3cdf78 |
| `233f48f1` | `bcd86ca4` | chore(design): write the design exports again after merging main |
| `e951265d` | `c2d9d0f2` | chore(nhap-excel): implemented, ready to grade |
| `c4bf51d8` | `ead8a39b` | fix(imports): Xong names what the import learned in the person's words (row 11) |
| `bcd7c0d0` | `df57c2d8` | chore(nhap-excel): screen proof for the inventory, grader steps for E18 and E19 |
| `b20ecac8` | `9039886e` | chore(nhap-excel): template evals for the two screen families (E23, E24) |
| `2e18c925` | `1feca45a` | chore(nhap-excel): S4 round 1 evidence — REJECT, six findings in the contract and the inve |
| `e9e58e38` | `f82930ca` | fix(imports): the six in-contract findings of S4 round 1 (row 11) |
| `f8f49b38` | `1b391e61` | test(nhap-excel): write the cases and breaks eight evals promised (E4, E6, E8, E9, E11, E1 |
| `3e109362` | `b28ff720` | chore(nhap-excel): S4 round 2 evidence — REJECT, every eval and suite green, three finding |
| `bc97b401` | `366c3803` | fix(imports): the three in-contract findings of S4 round 2 (row 11) |
| `6bfdb182` | `0fab800e` | fix(db): a listing's pending unit is of its own company, held by the database (row 11, SP- |
| `7051a0d5` | `e0dbb8b8` | chore(nhap-excel): S4 round 3 evidence — verdict PASS with two findings in the contract (t |
| `dc547b47` | `84d6433e` | docs(nhap-excel): evidence card and evidence page after S4 round 3, for the supervisor to  |
| `da42abe6` | `473a6d8c` | fix(test): the fixture writer escapes quotes in XML attributes (CodeQL) |
| `ac5f98f8` | `7203b7a3` | fix(imports): a retry after a lost answer reaches Xong with the right count (row 11, S4 ro |
