# Khung, định dạng và thông báo — Implementation Plan

> **For agentic workers:** executed natively in the main loop (T2, tasks share interfaces). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the app frame, page states, formatters, notification channels and light/dark theme that every screen stands on.

**Architecture:** Route group `src/app/(app)` owns a layout that renders `AppShell` once; error/loading/not-found of the group render inside it. Root layout holds `<html>`, theme provider, toaster, title template. Templates take content through props (they may not import modules); all frame copy lives in `src/components/templates/frame-copy.ts`. Formatters are pure functions in `src/lib/format/`.

**Tech Stack:** Next.js 16 (App Router, `error.tsx` gets `retry`), React 19, shadcn Sidebar on Base UI, ReUI Badge, sonner, next-themes, Vitest + Testing Library (jsdom), Playwright + axe at 360/414/1024/1440.

**Spec:** `_acceptance/khung-va-giao-dien/design.md`, `contract.md`, `evals.yaml`.

## Global Constraints

- No new dependency; `package-lock.json`, `ontology/**`, `design/decisions.yaml`, `_acceptance/config.yaml`, `src/components/ui/**`, `src/components/reui/**` untouched.
- Screen names via `label()` from `@/modules/company-config`; no concept label (pref/lease/alt of `ontology/labels.yaml`) typed in `src/`.
- Templates never import `@/modules/*` (ESLint); UI lint rules of `tools/eslint-ui` apply (no raw `<button>`/`<input>`, no raw palette, spacing on scale, no `transition-all`).
- Routes and query names in English: `/login?next=`, `?state=error|slow|session-expired`.
- Every browser check has a paired control that breaks the real page and expects the check to throw a pinned message.
- New screens join the axe test in light and dark.

## Review Focus

- Theme flash / hydration mismatch on first paint → `suppressHydrationWarning` on `<html>`, no console hydration error (checked in E14 run).
- Next dev error overlay hiding the error page → error test asserts the page's own `h1`, not the overlay.
- Sheet stays open after navigating on phone → NavMenu closes `openMobile` on click (E5).
- Offline banner never leaves when network returns → `online` event clears it (E13).
- 999.999.999 written «1.000 triệu» → unit chosen after rounding (E9).

---

### Task 1: Formatters and status tone

**Files:** Create `src/lib/format/index.ts`; Test `tests/format.test.ts` (tags `decision:format-number-date`, `decision:status-tone`). Serves E9, E10. `independent: true`.

**Interfaces — Produces:**
- `formatMoney(v: number | null | undefined): string`, `formatArea`, `formatCount`, `formatDate(v: string | Date | null | undefined)`, `formatDateTime`, `formatPhone(v: string | null | undefined)`; all return `EMPTY = "—"` for missing/invalid.
- `formatByKind(kind: DisplayKind, v: unknown): string` for `money|area|count|date|datetime|phone`; other kinds → `String(v ?? EMPTY)`.
- `STATUS_TONE: Readonly<Record<ListingStandardStatus, StatusTone>>`, `statusTone(s)`, `statusLabel(s, transaction?: "sale" | "lease")` via `label(\`Status${s}\`)`.
- Rule: money ≥ 1e9 → `Intl` max 2 fraction digits of v/1e9 + « tỷ»; ≥ 1e6 → max 1 fraction digit of v/1e6, if the rounded value is ≥ 1000 promote to tỷ; < 1e6 → `Intl` currency VND; negative → EMPTY. Dates in `Asia/Ho_Chi_Minh`. NBSP replaced by space in all output.

- [ ] Write the 32-cell matrix test exactly as E9 lists, the constant `32` written in the test, `formatByKind` over every `FIELD_DISPLAY` key of a numeric/date kind, the six-tone test of E10, `statusLabel` lease cases, and the control: a `checkMatrix(formatters)` helper run on a broken money formatter (no promotion) must throw `format mismatch: money 999999999`.
- [ ] Run `npx vitest run tests/format.test.ts` → FAIL (module missing).
- [ ] Implement `src/lib/format/index.ts`.
- [ ] Run again → PASS; commit `feat(format): Intl vi-VN formatters and status tones`.

### Task 2: Frame templates

**Files:** Create in `src/components/templates/`: `frame-copy.ts`, `page-header.tsx`, `page-state.tsx`, `page-skeleton.tsx`, `nav-menu.tsx`, `notify.ts`, `screen-banner.tsx`, `theme.tsx`; Modify `app-shell.tsx`; Test `tests/frame.test.tsx` (jsdom, tags `decision:notification-channel`, `decision:mobile-navigation`). Serves E3, E4, E12, E16. `independent: false` (Task 3 consumes it).

**Interfaces — Produces:**
- `NavItem { href: string; title: string; roles?: readonly string[] }`; `visibleNav(items, role?: string): NavItem[]`.
- `AppShell({ nav, role?, children })` — skip link to `#main-content`, Sidebar with `NavMenu`, `SidebarInset id="main-content" tabIndex={-1}`, top bar with `SidebarTrigger aria-label={COPY.openSidebar}`, `ThemeSwitch`, `ScreenBanner`, `ConnectionWatcher`.
- `NavMenu({ items, role? })` client: `usePathname()`, `isActive` + `aria-current="page"`, closes mobile sheet on click.
- `PageHeader({ title: string; action?: ReactNode })` — `<header data-slot="page-header">` with `h1`; action wrapped in `data-slot="page-header-action"` only when given.
- `PageState({ kind: "error" | "not-found" | "session-expired"; onRetry?: () => void; returnTo?: string; homeHref?: string })` — h1 + three-part copy from `COPY`; `loginHref(returnTo) = \`${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}\``.
- `PageSkeleton({ delayMs = 1000 })` client, `data-slot="page-skeleton"` only after the delay.
- `channelFor(event: "field" | "result" | "screen"): "inline" | "toast" | "banner"`; `notifyResult({ message, undo? })` → sonner `toast(message, undo ? { action: { label: COPY.undo, onClick: undo } } : undefined)`.
- `showScreenBanner({ message, retry? })`, `clearScreenBanner()`, `useScreenBanner()`; `saveWithBanner(save: () => Promise<void>)` — on throw while `navigator.onLine === false` sets the offline-save banner with retry, otherwise rethrows.
- `ThemeProvider` (next-themes, `attribute="class"`, `defaultTheme="system"`, `enableSystem`), `ThemeSwitch` (DropdownMenu radio: Sáng, Tối, Theo thiết bị).

- [ ] Write tests: PageHeader with/without action + control `assertOnePrimary` throws `more than one primary action`; the 4×4 role matrix rendered through `SidebarProvider` + `NavMenu` (mock `next/navigation`), constant `16`, control throws `role filter leaked: <title>`; `channelFor` three kinds; `notifyResult` undo/no-undo (mock sonner); `saveWithBanner` offline/online; `loginHref`.
- [ ] Run `npx vitest run tests/frame.test.tsx` → FAIL.
- [ ] Implement the files.
- [ ] Run → PASS; `npx eslint src/components/templates`; commit `feat(templates): app frame, page states, banner and theme`.

### Task 3: Routes on the frame

**Files:** Modify `src/app/layout.tsx`; Move `src/app/page.tsx` → `src/app/(app)/page.tsx`, `src/app/nav.ts` → `src/app/(app)/nav.ts`, `src/app/proto/[slug]/page.tsx` → `src/app/(app)/proto/[slug]/page.tsx`; Create `src/app/(app)/layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `inventory/page.tsx`, `sent/page.tsx`, `proto/[slug]/frame-showcase.tsx`, `src/app/not-found.tsx`, `src/app/global-error.tsx`. Serves E1, E2, E5–E8, E11, E13–E15. `independent: false`.

- Root metadata `title: { template: "%s · OneHub", default: "OneHub" }`; pages export `metadata.title = label(...)`.
- Proto `/proto/khung-va-giao-dien` renders `FrameShowcase`: format table, six status badges, a field with inline error, a toast button with undo, a text input + save button using `saveWithBanner` (fetch `/` with `cache: "no-store"`), links to the three states. `?state=error` throws during render (cleared by a sessionStorage flag set when the error page's retry is pressed); `?state=slow` awaits 3 s; `?state=session-expired` renders `PageState kind="session-expired"` with the current path.
- Other slugs keep the old behaviour: `PageHeader title={slug}`.
- [ ] Implement, `npm run build` → success; commit `feat(app): routes stand on the frame`.

### Task 4: Browser checks

**Files:** Create `tests/e2e/frame.spec.ts`; Modify `tests/e2e/shell.spec.ts` (axe over the 9-screen list in light and dark). Tags `decision:theme-modes`, `decision:mobile-navigation`, `decision:notification-channel`, `decision:status-tone`. Serves E1, E2, E5–E8, E11, E13, E14.

- [ ] Write each case named exactly as in `evals.yaml`, each with its control and pinned message.
- [ ] `make e2e` → all green at four sizes; commit `test(e2e): frame, states, offline banner, theme`.

### Task 5: Close

- [ ] Append one line to `wiki/log.md`; `make check` green; set contract `status: implemented`.
