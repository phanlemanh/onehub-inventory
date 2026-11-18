# tat-plugin-cho-cu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Claude Code session opened in this repo loads only the 3.0.0 kit plugins of the `delivery-loop` marketplace, even when the machine turns the old marketplace's plugins on at user level.

**Architecture:** Six `false` keys in `enabledPlugins` of `.claude/settings.json`. The measures live in `_acceptance/tat-plugin-cho-cu/rang/` (plain Node ESM, no dependencies), one file per eval, plus `two-way.mjs` (`node --test`) that proves each measure red on a broken copy.

**Tech Stack:** Node 24 ESM, `node:test`, `git worktree`, the `claude` CLI (stream-json).

**Spec:** `docs/superpowers/specs/2026-11-18-tat-plugin-cho-cu-design.md` · contract `_acceptance/tat-plugin-cho-cu/contract.md` · evals `_acceptance/tat-plugin-cho-cu/evals.yaml`.

## Global Constraints

- Never write `~/.claude/settings.json` or any user-level setting; the session measure only READS it to check the precondition.
- Never edit files under `_acceptance/nang-kit-3-0/`; import `sweep` from its `rang/leftover.mjs` only.
- This plan, the design doc and the `wiki/log.md` line never spell the old marketplace name, nor an old plugin name followed by `@` or inside backticks (the `nk30_leftover` sweep reads them). In code the name lives once, as `OLD_MARKET` in `rang/matrix.mjs`.
- Pinned messages are exactly the strings in `evals.yaml`.
- Commits: Conventional Commits, English.

## Review Focus

- `claude -p` waits 3 s for stdin when stdin is a pipe → spawn with stdin `ignore`.
- The probe never reaches `init` (not logged in, CLI missing, hang) → kill after 120 s and exit 2 with `phien: no init event`, never 0.
- A `.claude/settings.local.json` in the tree under test could mask the result → the session measure prints a note when the file exists.
- Temporary worktrees are removed in `finally`, even when the probe throws.
- The fixtures keep only `name`, `source`, `version` and `slash_commands` — no absolute paths (personal-data rule).

---

### Task 1: settings keys and their measure (E1)

**Files:**

- Modify: `.claude/settings.json` (`enabledPlugins`: six new `false` keys)
- Create: `_acceptance/tat-plugin-cho-cu/rang/matrix.mjs`, `rang/kit.mjs`, `rang/settings.mjs`, `rang/two-way.mjs`

**Interfaces:**

- Produces: `matrix.mjs` exports `OLD_MARKET` (string), `OLD_PLUGINS` (the six names, sorted), `NEW_MARKET = "delivery-loop"`, `NEW_PLUGINS` (six names), `NEW_VERSION = "3.0.0"`, `KIT_NAMES` (nine names of AC-3).
- Produces: `kit.mjs` exports `repoRoot(): string`, `mergeBase(root): string` (`git merge-base HEAD origin/main`), `withWorktree(rev, fn): Promise<any>` (temp detached worktree in `os.tmpdir()`, removed in `finally`), `cli(measure)` (prints `line`, exits 0 if `ok`, else `code ?? 1`).
- Produces: `settings.mjs` exports `judge(head, base): {ok, line}` and `measure({root}): Promise<{ok,line}>`.

- [ ] Step 1: in `two-way.mjs`, tests `E1 green on HEAD`, `E1 red a/b/c` building settings objects from the real HEAD file: (a) drop the tri-thuc false key, (b) flip one false key to `true`, (c) change `permissions` — each asserts `judge(...).line` equals the pinned message.
- [ ] Step 2: `node --test _acceptance/tat-plugin-cho-cu/rang/two-way.mjs` → FAIL (module missing).
- [ ] Step 3: write `matrix.mjs`, `kit.mjs`, `settings.mjs`; `judge` compares `enabledPlugins` minus the keys ending `@${OLD_MARKET}` to base, requires those keys to be exactly `OLD_PLUGINS` all `false`, and requires every other top-level key deep-equal to base.
- [ ] Step 4: add the six keys to `.claude/settings.json`; `node _acceptance/tat-plugin-cho-cu/rang/settings.mjs` → exit 0 with the pinned green line; two-way E1 tests pass.
- [ ] Step 5: commit `feat: turn off the old-marketplace kit plugins in repo settings`.

### Task 2: session measure and positive control (E2, E3)

**Files:**

- Create: `rang/phien.mjs`, `rang/init-merge-base.json`, `rang/init-head.json`
- Modify: `rang/two-way.mjs`

**Interfaces:**

- Consumes: Task 1 `matrix.mjs`, `kit.mjs`.
- Produces: `phien.mjs` exports `probe(cwd): Promise<Init>` (`Init = {plugins:[{name,source,version}], slash_commands:string[]}`), `judge(init): {ok,line}`, `precondition(): {ok,line,code}` (reads user settings; no old key `true` → `code: 3`, pinned message), `measure()` (HEAD, cwd = repo root), `control()` (merge-base worktree; ok iff `judge` is red with a line starting `phien: two versions of` and `cat-luot` is present). CLI: no flag → `measure`; `--doi-chung` → `control`; `--ghi` → write both fixtures (trimmed `Init`).

- [ ] Step 1: two-way tests: `E3 green on init-head.json`; red (a)–(e) on copies of the fixtures with the pinned messages of `evals.yaml` ((a) uses `init-merge-base.json` as is); `E2 red: control on an init with one version each → 'doi-chung: the session measure is green at merge-base — no positive control'`.
- [ ] Step 2: run two-way → FAIL.
- [ ] Step 3: write `phien.mjs`; `judge` checks in order: two versions of one name in `KIT_NAMES` · a `source` ending `@${OLD_MARKET}` · the `@delivery-loop` set ≠ `NEW_PLUGINS` · a version ≠ `NEW_VERSION` · `acceptance-gate:cat-luot` present · `acceptance-gate:scope-slice` or `feature-loop:feature-loop` missing.
- [ ] Step 4: `node rang/phien.mjs --ghi` to record both fixtures from real sessions; then `node rang/phien.mjs` → exit 0 green line; `node rang/phien.mjs --doi-chung` → exit 0; two-way passes.
- [ ] Step 5: commit `test: session measure for the kit plugins a session loads`.

### Task 3: old-name sweep relation (E4)

**Files:**

- Create: `rang/quet-ten-cu.mjs`
- Modify: `rang/two-way.mjs`

**Interfaces:**

- Consumes: `sweep(root)` from `_acceptance/nang-kit-3-0/rang/leftover.mjs`; Task 1 `withWorktree`, `OLD_PLUGINS`.
- Produces: `quet-ten-cu.mjs` exports `judge(lines): {ok,line}`, `measure({root})`.

- [ ] Step 1: two-way tests in a temp worktree at HEAD: green; red (a) append a line naming the old marketplace to `wiki/log.md` → `quet-ten-cu: sweep line outside .claude/settings.json: wiki/log.md`; red (b) drop the road-map false key → `quet-ten-cu: sweep finds 5 false-key lines, want 6`.
- [ ] Step 2: run → FAIL.
- [ ] Step 3: write `quet-ten-cu.mjs`; a line counts only if it is in `.claude/settings.json` and matches `"<p>@<OLD_MARKET>": false` with `p` in `OLD_PLUGINS`.
- [ ] Step 4: run → green line, two-way passes.
- [ ] Step 5: commit `test: the old-name sweep finds only the false keys`.

### Task 4: wire executors, log line, full check (E5, E6, E7)

**Files:**

- Modify: `_acceptance/config.yaml` (`executors.script`: `tpc_settings`, `tpc_phien`, `tpc_doi_chung`, `tpc_quet_ten_cu`, `tpc_two_way`), `wiki/log.md` (one line, no old marketplace name)

- [ ] Step 1: add the five executors (`node _acceptance/tat-plugin-cho-cu/rang/<file>`; `tpc_doi_chung` adds `--doi-chung`; `tpc_two_way` is `node --test …/two-way.mjs`).
- [ ] Step 2: append the `wiki/log.md` line.
- [ ] Step 3: run `make check` → exit 0; `node _acceptance/nang-kit-3-0/rang/settings.mjs` → exit 0; `node --test …/two-way.mjs` → `pass 11`, `fail 0`.
- [ ] Step 4: commit `chore: wire the tat-plugin-cho-cu measures and log the round`.

All four tasks: `independent: false` (Tasks 2–4 consume Task 1's `matrix.mjs` and `kit.mjs`, and all append to `two-way.mjs`). Executed in order in the main loop.

| Task | Evals served       | Verify                                           |
| ---- | ------------------ | ------------------------------------------------ |
| 1    | E1, part of E7     | `node rang/settings.mjs`; two-way E1 tests       |
| 2    | E2, E3, part of E7 | `node rang/phien.mjs`; `--doi-chung`; two-way    |
| 3    | E4, part of E7     | `node rang/quet-ten-cu.mjs`; two-way             |
| 4    | E5, E6, E7         | `make check`; `nk30_settings`; two-way `pass 11` |
