# Lưới và ô theo kiểu — Implementation Plan

**Goal:** one shared grid: typed cells, region header, region states, search, pagination, read-only cell rule.
**Spec:** `_acceptance/luoi-va-o-theo-kieu/design.md`, `contract.md`, `evals.yaml`. Executed natively, tasks in order (each consumes the previous).

## Global Constraints
- Candidate components never import `@/modules/*` or `@/app/*`; screen words come in through props (`label()` at the screen).
- No concept label from `ontology/labels.yaml` typed in `src/` (sample lengths are numbers, not label strings).
- No inline style, no arbitrary Tailwind values: column widths go to the grid as TanStack `size` in px (ch × measured ch px).
- ReUI `DataGrid` only, labels translated through its `i18n` prop.

### Task 1: Column rules — `src/components/candidate/column-kind.ts` · E2, E3, E4 · tests in `tests/grid.test.tsx`
`FieldKey = keyof typeof FIELD_DISPLAY`; `KIND_SAMPLE_LENGTH: Record<DisplayKind, number>` (money 9, area 11, count 6, date 10, datetime 16, phone 12, status 14, boolean 5, text 16, person 20, select 14); `alignFor(kind)`; `columnWidthCh(header, kind) = max(header.length, sample) + 2`; `densityFor(totalCh, containerCh)` → `"dense"` only when strictly greater; `DENSITY_ROW_CLASS`; `typedColumn({ field, header, lockedReason?, editable? })` → `{ field, header, kind, align, widthCh, … }` with no `kind`/`align`/`width` input.

### Task 2: Cell and copy — `typed-cell.tsx`, `grid-copy.ts` · E1, E9
`TypedCell({ kind, value, transaction?, lockedReason? })`: status badge (`statusTone`, `statusLabel`), boolean «Có»/«Không», text kinds truncate with `title`, others `formatByKind`; null/undefined/"" → «—»; falsy 0/false shown; locked → lock icon + `aria-description` + `title`.

### Task 3: Region header and states — `region-header.tsx`, `region-state.tsx` · E5, E8
`RegionHeader({ title, total, shown?, query, onQuery, action? })`; `RegionState` kinds `loading` (skeleton rows × columns, `.onehub-reveal-after-1s`), `empty`, `no-match` (`onClear` required), `error` (`onRetry`), `forbidden`; `PartialBanner({ onRetry })`.

### Task 4: Grid — `data-region.tsx` · E2, E4, E6, E7
`DataRegion({ title, columns, rows, state, onRetry, emptyAction, action, pageSize = 50 })`: search over text kinds, density from measured container, `useTable({ features: dataGridFeatures, … })`, `DataGrid` + `DataGridTable` + `DataGridPagination` only when rows > pageSize.

### Task 5: Prototype and browser checks — `src/app/(app)/proto/[slug]/grid-showcase.tsx`, page branch, `tests/e2e/grid.spec.ts` · E6, E8, E10, E11, E14
120 deterministic fake rows (`[Tên]`-free; unit codes and numbers only), `?state=loading|error|empty|partial|forbidden`, `?columns=few`.

### Task 6: Close — `make gen` (registry), `make check`, `make e2e`, wiki log line, contract `implemented`.
