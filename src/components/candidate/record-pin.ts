// Whether the record panel is pinned as a column beside the grid, and how wide (roadmap row 3a, decision 0031). A choice
// of the person's interface, kept in one cookie like the App Shell's second column: two numbers, no record, no company,
// no data (the repository's offline rule keeps company data off the device).
import { useCallback, useSyncExternalStore } from "react";

export const PIN_COOKIE = "ho_so_ghim";
const MAX_AGE = 60 * 60 * 24 * 365;
/** The narrowest pinned column, in px: the floating panel's own minimum (`min-w-80`). */
export const PIN_MIN_WIDTH = 320;
/** The widest pinned column, as a share of the work area: the grid keeps at least two fifths. */
export const PIN_MAX_SHARE = 0.6;
/** The default pinned width, as a share of the work area: as wide as the floating panel. */
export const PIN_DEFAULT_SHARE = 0.4;
/** The narrowest work area the pin button shows in: a 320 px column beside a 480 px grid. */
export const PIN_MIN_AREA = 800;
/** Above this no screen is wide enough, so a larger value is a broken cookie. */
const PIN_MAX_WIDTH = 4000;

export interface PinState {
  pinned: boolean;
  /** The column's width in px, or null for the default share of the work area. */
  width: number | null;
}

const UNPINNED: PinState = { pinned: false, width: null };

/** Reads the cookie's value; anything broken or out of bounds reads as not pinned. */
export function readPin(value: string | undefined | null): PinState {
  const match = /^([01]):(\d{1,5})$/.exec(value ?? "");
  if (!match) return UNPINNED;
  const width = Number(match[2]);
  if (width < PIN_MIN_WIDTH || width > PIN_MAX_WIDTH) return UNPINNED;
  return { pinned: match[1] === "1", width };
}

/** The cookie line that keeps the state: two numbers, nothing else. */
export function writePin(state: { pinned: boolean; width: number }): string {
  const width = Math.round(Math.min(PIN_MAX_WIDTH, Math.max(PIN_MIN_WIDTH, state.width)));
  return `${PIN_COOKIE}=${state.pinned ? 1 : 0}:${width}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

/** Throws when a cookie line carries the open record: the pin is an interface choice, never company data. */
export function assertNoRecordData(cookieLine: string, recordId: string): void {
  if (cookieLine.includes(recordId)) throw new Error("pin cookie carries record data");
}

/** The narrowest grid beside a pinned column, in px (PIN_MIN_AREA less the narrowest column). */
export const PIN_MIN_GRID = PIN_MIN_AREA - PIN_MIN_WIDTH;

/** The widest pinned column for a work area of `area` px: three fifths, and never less than 480 px of grid beside it. */
export function widestPin(area: number): number {
  return Math.max(PIN_MIN_WIDTH, Math.min(area * PIN_MAX_SHARE, area - PIN_MIN_GRID));
}

/** Keeps a pinned width inside its bounds for a work area of `area` px. */
export function clampPinWidth(width: number, area: number): number {
  return Math.round(Math.min(Math.max(width, PIN_MIN_WIDTH), widestPin(area)));
}

/** Whether the work area is wide enough for the pin button to show. */
export function pinAvailable(area: number): boolean {
  return area >= PIN_MIN_AREA;
}

function cookieValue(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${PIN_COOKIE}=`))
    ?.slice(PIN_COOKIE.length + 1);
}

const listeners = new Set<() => void>();
let current: PinState = UNPINNED;
let read = false;

function snapshot(): PinState {
  if (!read) {
    current = readPin(cookieValue());
    read = true;
  }
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The pin state shared by every record panel of the page, and the one way to change it. */
export function useRecordPin() {
  const state = useSyncExternalStore(subscribe, snapshot, () => UNPINNED);
  const set = useCallback((next: PinState, fallbackWidth: number) => {
    current = next;
    document.cookie = writePin({ pinned: next.pinned, width: next.width ?? fallbackWidth });
    for (const listener of listeners) listener();
  }, []);
  return { state, set };
}
