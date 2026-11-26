# roadmap-merge-driver Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gộp nhánh chính vào nhánh PR không vấp `LO-TRINH.html`, thước của hồ sơ ra khỏi phạm vi quét CodeQL, và trang
quyết định về nhịp nâng repo-setup.

**Architecture:** Ba thay đổi nhỏ ở tệp cấu hình và tài liệu, mỗi thay đổi một thước Node trong
`_acceptance/roadmap-merge-driver/rang/`. Thước đọc dữ liệu chung ở `matrix.mjs`, gọi lệnh bằng mảng đối số, nhận
`--root <thư mục>` để chạy trên bản phá.

**Tech Stack:** Git 2.50, Node 24 (`node:child_process`, `node:test`), `make`, kit delivery-loop 3.0.0.

**Spec:** `docs/superpowers/specs/2026-11-21-roadmap-merge-driver-design.md`, hợp đồng
`_acceptance/roadmap-merge-driver/contract.md`.

## Global Constraints

- Không sửa plugin của kit, `governance/**`, `.claude/**`, `package.json`, `tools/**`, `mk/**`, `Makefile`.
- Trong `.github/**` chỉ đổi `workflows/security.yml`, và chỉ bằng `git apply _acceptance/roadmap-merge-driver/security-yml.patch`.
- `_acceptance/config.yaml`: chỉ các dòng `rmd_*` đã thêm ở bước thiết kế; khối `risk_tiers` giữ nguyên.
- Thước: `execFileSync(lệnh, [đối số])`; không ghép chuỗi lệnh; không đọc biến môi trường để dựng lệnh.
- Mã, tên tệp, thông điệp của thước: tiếng Anh. Tài liệu dưới `docs/` và `wiki/`: tiếng Việt.
- Mỗi thước mới có cặp hai chiều trong `two-way.mjs`: xanh trên cây, đỏ với thông điệp ghim trên bản phá.

## Review Focus

- Bản kéo có `.gitattributes` toàn cục của người dùng gắn `merge=` cho `*.html`: kho tạm của thước phải không bị ảnh
  hưởng (đặt `core.attributesFile` về tệp rỗng trong kho tạm).
- Máy đặt `commit.gpgsign` hay hook toàn cục: kho tạm tắt ký và không dùng hook.
- `git worktree add` thất bại vì thư mục tạm còn sót: thước dùng thư mục `mkdtemp` mới và luôn gỡ cây tạm trong `finally`.
- Trang của nền bằng trang của HEAD (không có gì để thử): thước `redraw` từ chối (thoát 2), không báo đạt.
- Một mục của `BEN_GOI` không khớp tệp nào: thước `codeql` từ chối, không coi là «0 bên gọi».

---

### Task 1: Dữ liệu chung, thước `attr`, và dòng mới của `.gitattributes`

**Files:**

- Create: `_acceptance/roadmap-merge-driver/rang/lib.mjs`, `rang/matrix.mjs`, `rang/attr.mjs`
- Modify: `.gitattributes` (khối cuối)

**Interfaces — Produces:**

- `lib.mjs`: `REPO` (gốc kho suy từ vị trí script), `rootOf(argv)` (giá trị `--root`, mặc định `REPO`), `opt(argv, name)`,
  `git(cwd, ...args) → string`, `run(cmd, args, opts) → {status, stdout, stderr}`, `read(root, rel) → string`,
  `baseSha() → string` (`git merge-base HEAD origin/main`), `atBase(rel) → string`, `done(name, failures, line)`
  (in `name: <lỗi>` ra stderr và thoát 1, hoặc in `line` và thoát 0), `refuse(name, why)` (thoát 2),
  `scratchRepo() → dir` (kho tạm đã tắt ký, hook và thuộc tính toàn cục), `rm(dir)`.
- `matrix.mjs`: `PAGE`, `MAP`, `ATTR_LINE`, `MAP_LINE`, `DRIVER_KEY`, `DRIVER_CMD`, `GOP` (9 ca), `PATTERN`,
  `PATCH_LINES` (4 dòng), `PATCH_ANCHOR`, `ALERT_FILES` (4), `BEN_GOI`, `UPGRADES` (4 vòng), `OWNER_SENTENCE`,
  `MILESTONE_SENTENCE`, `SECTION_TITLE`, `LIMIT_GITHUB`, `LIMIT_OLD_BRANCH`, `ROUND_FILES`.

- [ ] Viết `matrix.mjs` và `lib.mjs`.
- [ ] Viết `attr.mjs` theo E1; chạy trên cây chưa đổi: phải đỏ `attr: no line LO-TRINH.html merge=generated-file`.
- [ ] Sửa `.gitattributes`: chú thích khối gọi tên cả hai tệp và trỏ `docs/START-HERE.md`; thêm
      `LO-TRINH.html merge=generated-file` ngay sau dòng `PRODUCT-MAP.md`.
- [ ] Chạy `node _acceptance/roadmap-merge-driver/rang/attr.mjs`: thoát 0.

**Verify:** `node _acceptance/roadmap-merge-driver/rang/attr.mjs` · **Phục vụ:** E1 · **independent:** false

### Task 2: Thước `merge` (chín ca gộp)

**Files:** Create `rang/merge.mjs`

- [ ] `merge.mjs` chạy script `prepare` rút từ `package.json` dưới `--root` trong một kho tạm, đòi
      `git config --get merge.generated-file.driver` trả `true`; rồi chạy từng ca của `GOP` trên kho tạm riêng. Nhận
      `--control <tệp>` thay cho bản `.gitattributes` bỏ dòng mới.
- [ ] Chạy: `merge: 9 of 9 cases as expected (5 clean, 4 conflict)`.

**Verify:** `node _acceptance/roadmap-merge-driver/rang/merge.mjs` · **Phục vụ:** E2 · **independent:** false

### Task 3: Đoạn dạy dựng máy, thước `docs` và `redraw`

**Files:**

- Modify: `docs/START-HERE.md` (mục mới «Gộp nhánh chính và tệp máy sinh», đặt trước «Điều gì tự chạy»)
- Create: `rang/docs.mjs`, `rang/redraw.mjs`

- [ ] Viết `docs.mjs` theo E4; chạy trước khi sửa trang: đỏ `docs: section … is missing`.
- [ ] Viết mục tài liệu: `make setup` đặt driver; lệnh đặt tay; lệnh kiểm; vẽ lại rồi commit (lệnh
      `executors.script.product_map` bỏ `--check`); hai tên tệp; hai giới hạn.
- [ ] Viết `redraw.mjs` theo E3: cây tạm bằng `git worktree add --detach`, nhận `--kit <thư mục>` thay gốc kit.
- [ ] Chạy cả hai: thoát 0.

**Verify:** `node …/rang/docs.mjs && node …/rang/redraw.mjs` · **Phục vụ:** E3, E4 · **independent:** false

### Task 4: Trang quyết định 0046 và thước `decision`

**Files:**

- Create: `wiki/decisions/0046-repo-setup-upgrades-per-milestone.md`, một tệp dưới `wiki/log/` (bằng `make log`),
  `rang/decision.mjs`

- [ ] Viết `decision.mjs` theo E5; chạy trước: đỏ vì trang chưa có.
- [ ] Viết trang theo khuôn `decision`: `Status` (Accepted, 2026-11-21, chủ kho quyết), `Context` (bốn vòng, hạng, ngày),
      `Decision` (câu của chủ kho, định nghĩa mốc theo Hỏi-1, ngoại lệ bản vá), `Consequences` (thước sau gộp,
      `risk_tiers` không đổi, đề xuất chưa làm).
- [ ] `make log m="…"`; `make derived`; chạy `decision.mjs` và `make ontology`: thoát 0.

**Verify:** `node …/rang/decision.mjs && make ontology` · **Phục vụ:** E5 · **independent:** false

### Task 5: Bản vá CodeQL và thước `codeql`

**Files:**

- Modify: `.github/workflows/security.yml` (chỉ bằng `git apply` tệp vá đã duyệt)
- Create: `rang/codeql.mjs`

- [ ] Viết `codeql.mjs` theo E6; chạy trước: đỏ `codeql: the init step has no paths-ignore`.
- [ ] `git apply _acceptance/roadmap-merge-driver/security-yml.patch`.
- [ ] Chạy: thoát 0, in số tệp dưới `rang/` và số tệp bên gọi đã soát.

**Verify:** `node …/rang/codeql.mjs` · **Phục vụ:** E6 · **independent:** false

### Task 6: Thước `change-set` và cặp hai chiều

**Files:** Create `rang/change-set.mjs`, `rang/two-way.mjs`

- [ ] `change-set.mjs`: xuất `judge({files, baseConfig, headConfig})`, CLI lấy dữ liệu từ git (`base...HEAD`).
- [ ] `two-way.mjs`: bảy bài xanh trên cây và các bản phá của AC-8, mỗi bản phá so thông điệp ghim.
- [ ] Commit mọi thay đổi, rồi chạy `node --test …/rang/two-way.mjs` và `node …/rang/change-set.mjs`: thoát 0.

**Verify:** `node --test …/rang/two-way.mjs && node …/rang/change-set.mjs` · **Phục vụ:** E7, E8 · **independent:** false

### Task 7: Trọn bộ kiểm của kho

- [ ] `make format` rồi `make check`: thoát 0. Vẽ lại bản đồ, commit.

**Verify:** `make check` · **Phục vụ:** E9 · **independent:** false
