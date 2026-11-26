# Lùi bản sau khi xoay mật khẩu vai đăng nhập — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps
> use checkbox (`- [ ]`) syntax for tracking.

**Goal:** the rollback case after rotating the login role's password is written once, as the section
`## Lùi bản sau khi xoay mật khẩu vai đăng nhập` of `docs/van-hanh/xoay-khoa.md`; every other runbook paragraph about
rolling back points to it; a standing test keeps both.

**Architecture:** Markdown edits in `docs/van-hanh/` plus one Vitest file, `tests/so-tay-lui-ban.test.ts`, that reads the
runbooks and the deploy command's source (no import of tool code beyond `STEPS`). No code under `tools/` changes.

**Tech Stack:** Markdown, Vitest, Node 24.

**Spec:** `docs/superpowers/specs/2026-11-22-lui-ban-luc-xoay-mat-khau-design.md`; contract
`_acceptance/lui-ban-luc-xoay-mat-khau/contract.md` (approved 2026-11-22, Hỏi-1 = runbooks only); measurement plan
`_acceptance/lui-ban-luc-xoay-mat-khau/evals.yaml`.

## Global Constraints

- Section title, verbatim: `Lùi bản sau khi xoay mật khẩu vai đăng nhập`. Pointer outside xoay-khoa.md names it in «»
  and links `[xoay-khoa.md](xoay-khoa.md)`; inside xoay-khoa.md it names it in «» only.
- The section table names, verbatim, the nine lines the test reads from the code (see the matrix at the top of
  `evals.yaml`) and every step of `STEPS` in backticks.
- Outside the section no paragraph contains «mật khẩu cũ».
- Keep what the previous row signed: the «Đạt khi» lines of steps 2 and 5, the `bien`/`vai-dang-nhap` rows' «đừng bấm
  dựng lại trên Vercel», the «Redeploy» paragraph, README việc 10.
- No key value in any line. Docs in Vietnamese; test code and commits in English (Conventional Commits).

## Tasks

### Task 1 — the section in xoay-khoa.md (phục vụ E1, E2, E3) · independent: false

**Files:** `docs/van-hanh/xoay-khoa.md`

- [ ] Add `## Lùi bản sau khi xoay mật khẩu vai đăng nhập` between «Các bước» and «Đỏ thì làm gì»: the rule by build, how
      to pick a deployment, the health yardstick, and the table «Dòng · Bản đang chạy · Làm gì».
- [ ] Bước 3 «Đỏ thì»: keep the gap sentence, move the rollback part out, point to the section.
- [ ] «Đỏ thì làm gì» line two: point only.
- **Verify:** `bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E2` → the «một chỗ» and «đủ dòng» cases pass.

### Task 2 — pointers in the other runbooks (phục vụ E4, E5, E6) · independent: false

**Files:** `docs/van-hanh/dua-ban-len.md`, `docs/van-hanh/lui-ban.md`, `docs/van-hanh/README.md`

- [ ] dua-ban-len.md: bước 3, 5, 6 «Đỏ thì»; the opening of «Đỏ thì làm gì» (the three zones move to the section);
      rows `gan-ten-mien` and the three `kiem-nhanh-ten-mien` rows stop restating and point.
- [ ] lui-ban.md: opening paragraph; «Khi nào dùng»; bước 4 and 5 «Đỏ thì»; rows `kiem-nhanh-ten-mien ĐỎ` and Instant
      Rollback.
- [ ] README.md: the `make rollback` row of the command table; việc 13 «Đỏ thì».
- **Verify:** `bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E4` and `… E5` pass.

### Task 3 — the standing test (phục vụ E2, E4, E5) · independent: false

**Files:** `tests/so-tay-lui-ban.test.ts` (drafted before Gate 1, finished here)

- [ ] Four rules, the fifteen-place coverage case, and every red case of `evals.yaml` with its pinned message.
- [ ] Break-test in the verify: each red case already breaks a copy of the real runbooks; additionally break the real
      file once by hand (remove one pointer in bước 6 of dua-ban-len.md), run E4, see it red with the pinned message,
      restore.
- **Verify:** `npx vitest run tests/so-tay-lui-ban.test.ts --coverage.enabled=false` green; `make lint typecheck`.

### Task 4 — wiki log and full check (phục vụ E7)

**Files:** `wiki/log/…` (via `make log`)

- [ ] `make log m="…"`.
- **Verify:** `make check` exit 0.
