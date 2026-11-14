# Bảng hàng thẻ điện thoại (row 2b) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Below 768 px the inventory grid region shows its rows as a full-width list of horizontal listing cards with a
sticky one-line toolbar; tapping a card opens the existing full-screen record; from 768 px the table is unchanged.

**Architecture:** `DataRegion` (shared grid region) gains one optional slot, `phoneList`; below 768 px (`useIsMobile`) and
with rows to show it drops its frame and renders `PhoneList` (new, `src/components/candidate/phone-list.tsx`) from the same
table state — filters, sort, grouping, record address, row actions. The card is the existing `ListingCard` with a new
`layout="row"`. The inventory screen passes the phone list, its unit actions (9e template) and the add button.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, shadcn on Base UI, ReUI data grid, Vitest + Testing Library (jsdom),
Playwright (four sizes).

**Spec:** `_acceptance/bang-hang-the-dien-thoai/design.md`, `contract.md` (approved 2026-11-14), `evals.yaml`.
Prototype: `2b-ban-bam-duoc-v4.patch` in the batch's shared notes folder — start from it, then remove the prototype
switches.

## Global Constraints

- Threshold: cards below 768 px, table from 768 px (`src/hooks/use-mobile.ts`, `MOBILE_BREAKPOINT = 768`).
- Owner choices (Cổng Phạm vi): unit without photo → muted 64 px tile with the building code; filters → icon button
  «Lọc»/«Lọc (n)» opening a bottom `Sheet` with «Sắp theo» first, active filters as chips + «Xoá lọc»; «…» on each card
  and in the record head (9e); «Thêm căn» in the page head; Căn-column pin lock is NOT in this row.
- No fake photos in the build (G-1411-91): `ListingCard` takes `photo?: string`; nothing passes one until row 15.
- Toolbar icon buttons: accessible name and a tooltip/label on long press; touch target ≥ 44 px (`size-11`).
- Words from `ontology/labels.yaml` via `label()` in `src/app`; component copy in `grid-copy.ts`. No hard-coded label in
  `src/` outside the copy files. No `<button>` (use `Button`), no arbitrary Tailwind values, no classes on `SheetContent`.
- Remove every prototype switch before S4: `?the=`, `?loc=`, `?o=`, `?nut=`, `?anh=`, `samplePhotoOf`.
- Unit actions (Sửa, Xoá căn) and «Thêm căn» are planned actions: the slots are built and tested on the 9e template rows;
  on `/inventory` the add button and the actions stay behind `PermittedAction` and appear only once rows 12, 18b, 3d make
  them live — this row does not invent their behaviour.
- Edge data seam `?mau=bien` is development-only through a pure function in the style of `inventoryStateFrom`.

## Review Focus

- Turning the phone across 768 with a filter, a sort and grouping on — all three must survive (Task 2 test «doi-kho»).
- A record opened from a card scrolled far down, closed with the browser back — scroll and focus must return (Task 4).
- Long unit codes and three-digit-tỷ prices at 360 — no overflow (Task 5, `?mau=bien`).
- A role without remove rights opening «…» — the item is absent, never disabled (Task 3).
- An empty filter result inside the sheet flow — «Không có dòng nào khớp» shows in the list with the chips still there
  (Task 2).

---

### Task 1: `ListingCard` row layout

**Files:**

- Modify: `src/modules/listings/ui/listing-record.tsx` (`ListingCard`)
- Test: `tests/the-dien-thoai.test.tsx` (new; block «the»)

**Interfaces:**

- Produces: `ListingCard({ view, priceLabel, layout?: "stacked" | "row", photo?: string, noPhoto?: "tile" | "none",
building?: string })`. `layout` defaults to `"stacked"` (record head unchanged). Row slots: `listing-card-unit`,
  `listing-card-price`, `listing-card-place`, `listing-card-status`, `listing-card-facts`, root `data-layout="row"`.

- [ ] Write tests: row card of one sample row shows unit, `formatByKind("money")` price, place «Toà · Dự án», status label,
      facts «<diện tích> · <n> phòng ngủ»; without `photo` a tile with the building code; with `photo` an `img` and no tile;
      stacked layout renders exactly as before (snapshot of slots). Break pair: drop the area → `phone card missing fact`.
- [ ] Run `npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false` — FAIL.
- [ ] Implement from the v4 patch's `layout === "row"` branch; replace the raw `img` with `next/image` (`unoptimized`,
      64×64) so lint passes.
- [ ] Run the test — PASS. Commit `feat(listings): row layout of the listing card for phone lists`.

### Task 2: Phone list in the grid region

**Files:**

- Create: `src/components/candidate/phone-list.tsx`
- Modify: `src/components/candidate/data-region.tsx` (prop `phoneList`, phone branch of `body`, frameless wrapper),
  `src/components/candidate/grid-copy.ts` («Sắp theo», «Thêm», «Bỏ lọc …» copy)
- Test: `tests/the-dien-thoai.test.tsx` (blocks «danh-sach», «loc», «sap-theo», «nhom», «trang-thai», «doi-kho»)

**Interfaces:**

- Produces: `RegionPhoneList<Row> = { card(row): ReactNode; label(row): string }`; `DataRegion` prop
  `phoneList?: RegionPhoneList<GridRow>`. `PhoneList` props as in the v4 patch minus `filters` mode (sheet only):
  `data, columns, column, options, activeFields, count, group?, more?, rowAction?, sort?, onOpen, onClear, noMatch`.
- Consumes: `useIsMobile`, the region's `table`, `data`, `filters`, `sorting`/`setSorting`, `setGrouped`, `toolbarAction`,
  `rowActions`, `removing.run`, `openRecord`.

- [ ] Tests at 360 (matchMedia matching) and 1440 (not matching), same `DataRegion` input: E1 (no `table`, 60
      `phone-card`, ids in grid order, footer «60 dòng», no `[data-slot^=frame]` around the list), E4 (4 filter cases set
      through the sheet, chips, «Lọc (n)», no-match, «Xoá lọc»), E4 «sap-theo» (3 cases equal the 1440 order; `onViewChange`
      carries the sort), E6 (group rows equal), E7 (5 states, 0 cards except partial 40), E5 (three opening inputs). Each
      with its pinned break message from `evals.yaml`.
- [ ] Run — FAIL. Implement from the v4 patch; drop the strip mode; toolbar sticky `top-12`; tooltips on the icon
      buttons. Run — PASS. Commit `feat(grid): phone card list below 768 in the grid region`.

### Task 3: Unit actions on cards and in the record

**Files:**

- Modify: `src/modules/listings/ui/inventory-grid.tsx`, `src/app/(app)/inventory/page.tsx`
- Test: `tests/the-dien-thoai.test.tsx` (block «bo-nut», E14)

**Interfaces:**

- Consumes: `RowActions`, `RecordActions`, `PermittedAction` (9e); labels `Edit`, `RemoveListing`, `CreateListing`.
- Produces: `InventoryGrid` builds `phoneList` with `ListingCard layout="row"` and passes `rowActions`; record head gets
  the same `RecordActions`. Actions wired only for permission-table actions that are live; planned ones stay out.

- [ ] Test the role matrix of E14 on a 9e-template region (headAction add, rowActions Sửa + Xoá căn): ListAgent mine
      [Sửa, Xoá căn], not mine [Sửa], BuyerAgent [Sửa], TeamLead [Sửa, Xoá căn]; no disabled items; remove confirms first;
      same set on the 1440 row. Break: disabled item shown → `row action shown disabled: <vai> <mục>`.
- [ ] Implement; remove all prototype switches. Run — PASS. Commit `feat(inventory): phone list and unit actions slot`.

### Task 4: Browser tests and edge data

**Files:**

- Create: `tests/e2e/the-dien-thoai.spec.ts`
- Modify: `src/modules/listings/ui/inventory-rows.ts` (`inventoryEdgeRowsFrom(param, env)`), `src/app/(app)/inventory/page.tsx`
- Add: axe entries for the phone list in light and dark (repo rule 12)

- [ ] E2 «nguong» (6 widths), «doi-kho»; E3 «mo-va-lui» (scroll ≥1000, open, «Sau», back and «Đóng», ±1 px, focus);
      E8 «du-lieu-bien» (9 cards, no overflow, screenshot); E9 «vai» (3 reading roles + CompanyAdmin forbidden), «tiep-can»
      (names, ≥44 px, Tab order, Enter), axe 360/414 light/dark; E13 unit test of `inventoryEdgeRowsFrom` (4 cases).
- [ ] Run only `npx playwright test tests/e2e/the-dien-thoai.spec.ts` outside a grading lock (load rule). Commit
      `test(inventory): phone list browser tests`.

### Task 5: Records

**Files:** `design/behaviors.md`, `design/patterns/luoi.md`, `design/so-khoi.yaml` (extend the `the-can` line with the
row layout; one line for `phone-list`), `wiki/entities/listing.md`, `wiki/log.md`, `CHANGELOG.md`,
`_acceptance/bang-hang-the-dien-thoai/chung-minh-man.md` (state matrix at 360, Khối with rungs), `design/component-registry.json`
(`make gen`).

- [ ] Write; run `python3 tools/proof_gate/check.py --root .` and `make check` — green. Commit `docs(bang-hang-the-dien-thoai): behaviours, grid pattern, store and wiki`.
