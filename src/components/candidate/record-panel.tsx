"use client";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Frame, FramePanel } from "@/components/reui/frame";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog } from "@base-ui/react/dialog";

import { GRID_COPY } from "./grid-copy";

/** The address parameter that names the open record (design/behaviors.md: the record panel has its own address). */
export const RECORD_PARAM = "ho-so";

/** What a screen says about one record: its name and its content. The frame around it is not the screen's. */
export interface RecordView {
  title: string;
  body: ReactNode;
}

/** The selector of the button that opened a record, so focus can go back to the row it came from. */
export function recordOpenSelector(id: string): string {
  return `[data-record-open="${typeof CSS !== "undefined" ? CSS.escape(id) : id}"]`;
}

/** The record named by an address query, or null. */
export function recordIdIn(search: string, param: string = RECORD_PARAM): string | null {
  return new URLSearchParams(search).get(param);
}

/**
 * The open record kept in the page address. The panel holds the open id itself and writes it to the address
 * (`?ho-so=<id>`, a new history entry, so the browser's back closes it and the address can be shared); it reads the
 * address once after mounting and again on back and forward. It does not wait for the router to read the address
 * back, so walking from row to row never closes the panel for a frame.
 */
export function useRecordAddress(param: string = RECORD_PARAM) {
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => {
    const read = () => setOpenId(recordIdIn(window.location.search, param));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [param]);
  const navigate = useCallback(
    (id: string | null) => {
      setOpenId(id);
      const next = new URLSearchParams(window.location.search);
      if (id === null) next.delete(param);
      else next.set(param, id);
      const query = next.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      window.history.pushState(window.history.state, "", url);
    },
    [param],
  );
  return { openId, navigate };
}

/** The panel's header: the record's name, «Trước» and «Sau» in the grid's order, and «Đóng». */
function PanelHeader({
  title,
  previous,
  next,
  onNavigate,
  close,
}: {
  title: ReactNode;
  previous: string | undefined;
  next: string | undefined;
  onNavigate: (id: string | null) => void;
  close: ReactNode;
}) {
  return (
    <div data-slot="record-panel-header" className="flex items-start gap-2 border-b p-4">
      {title}
      {/* «Trước», «Sau», «Đóng» always sit top right, on every width and theme; a long name wraps instead. */}
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={previous === undefined}
          onClick={() => previous !== undefined && onNavigate(previous)}
        >
          <ChevronLeftIcon aria-hidden="true" />
          {GRID_COPY.record.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={next === undefined}
          onClick={() => next !== undefined && onNavigate(next)}
        >
          {GRID_COPY.record.next}
          <ChevronRightIcon aria-hidden="true" />
        </Button>
        {close}
      </div>
    </div>
  );
}

const TITLE_CLASS = "min-w-0 flex-1 text-lg font-semibold break-words";

/**
 * The one record panel of the app (design/behaviors.md, open the record panel; owner's choice at row 3's scope gate:
 * a floating panel is the app's one way to show a row's detail). From 768 px it floats over the right of the rows,
 * below the region's toolbar, two fifths wide: the grid does not move, its toolbar and the App Shell's top bar stay in
 * view, and the rows on its left stay usable. On a phone it is the whole screen. Esc or «Đóng» closes it and focus goes back to the row that
 * opened it; «Trước» and «Sau» walk the rows in the order the grid shows them, inside the same frame. The panel knows
 * nothing about listings or people: the screen gives `render`.
 */
export function RecordPanel({
  ids,
  openId,
  onNavigate,
  render,
  returnFocus,
}: {
  /** The rows in the order the grid shows them now (after search). */
  ids: readonly string[];
  openId: string | null;
  onNavigate: (id: string | null) => void;
  render: (id: string) => RecordView;
  /**
   * Where focus goes when the panel closes, when the screen knows better than the row's open button: a sheet grid
   * puts it on the row's cell so its keys work at once. Returns false to fall back to the button.
   */
  returnFocus?: (id: string) => boolean;
}) {
  // The record last shown: closing clears `openId`, and focus then goes to this row.
  const lastShown = useRef<string | null>(openId);
  useEffect(() => {
    if (openId !== null) lastShown.current = openId;
  }, [openId]);
  const returnFocusRef = useRef(returnFocus);
  useEffect(() => {
    returnFocusRef.current = returnFocus;
  });
  const isPhone = useIsMobile();
  const index = openId === null ? -1 : ids.indexOf(openId);
  const view = openId === null ? null : render(openId);
  const previous = index > 0 ? ids[index - 1] : undefined;
  const next = index >= 0 && index < ids.length - 1 ? ids[index + 1] : undefined;
  const focusRow = useCallback(() => {
    const id = lastShown.current;
    if (id === null) return;
    if (returnFocusRef.current?.(id)) return;
    document.querySelector<HTMLElement>(recordOpenSelector(id))?.focus();
  }, []);

  if (!isPhone)
    return (
      <RecordColumn
        openId={openId}
        view={view}
        previous={previous}
        next={next}
        onNavigate={onNavigate}
        focusRow={focusRow}
      />
    );

  // On a phone: Base UI's Dialog rather than the kit's Sheet, because the Sheet's width is fixed at three quarters
  // there and takes no classes, while design/behaviors.md asks for the whole screen.
  return (
    <Dialog.Root
      open={openId !== null}
      onOpenChange={(open) => {
        if (!open) onNavigate(null);
      }}
      onOpenChangeComplete={(open) => {
        if (!open) focusRow();
      }}
    >
      <Dialog.Portal>
        <Dialog.Popup
          data-slot="record-panel"
          data-record-layout="screen"
          data-record-id={openId ?? undefined}
          // Focus goes back once the panel has closed (onOpenChangeComplete), to the row last shown.
          finalFocus={false}
          className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-popover text-sm text-popover-foreground outline-none"
        >
          <PanelHeader
            title={<Dialog.Title className={TITLE_CLASS}>{view?.title}</Dialog.Title>}
            previous={previous}
            next={next}
            onNavigate={onNavigate}
            close={
              <Dialog.Close render={<Button variant="ghost" size="sm" />}>
                <XIcon aria-hidden="true" />
                {GRID_COPY.record.close}
              </Dialog.Close>
            }
          />
          <div data-slot="record-panel-body" className="min-h-0 flex-1 overflow-y-auto p-4">
            {view?.body}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** The App Shell's top bar and work area, by their slots; a page without the App Shell uses the whole window. */
const TOP_BAR = '[data-slot="app-shell-top-bar"]';
const WORK_AREA = '[data-slot="sidebar-inset"]';

/**
 * Where the floating panel stands: from just under the App Shell's top bar to the bottom of the work area, flush with
 * its right edge (owner's choice at row 3's scope gate, «Trừ thanh trên»). Measured, not fixed in a class, because the
 * top bar hides in full screen (row 2a) and the panel then runs the whole height.
 */
function useWorkAreaBounds(open: boolean) {
  const [bounds, setBounds] = useState<{ top: number; right: number; bottom: number }>({
    top: 0,
    right: 0,
    bottom: 0,
  });
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const bar = document.querySelector<HTMLElement>(TOP_BAR);
      const area = document.querySelector<HTMLElement>(WORK_AREA)?.getBoundingClientRect();
      const barRect = bar && bar.offsetParent !== null ? bar.getBoundingClientRect() : null;
      setBounds({
        // No top bar (full screen): the panel runs the whole height, from the top of the window.
        top: Math.max(0, barRect ? barRect.bottom : 0),
        right: area ? Math.max(0, window.innerWidth - area.right) : 0,
        bottom: area ? Math.max(0, window.innerHeight - area.bottom) : 0,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener("resize", measure);
    // The page scrolls under the sticky top bar: the bar's bottom and the work area's bottom move with it.
    window.addEventListener("scroll", measure, { passive: true });
    document.addEventListener("fullscreenchange", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      document.removeEventListener("fullscreenchange", measure);
    };
  }, [open]);
  return bounds;
}

/**
 * The panel floating over the right of the work area. It does not hold focus: the grid beside it stays in the tab order. Opening it
 * from a closed state moves focus to its title so a keyboard user lands in it; walking to another row leaves focus
 * where it is.
 */
function RecordColumn({
  openId,
  view,
  previous,
  next,
  onNavigate,
  focusRow,
}: {
  openId: string | null;
  view: RecordView | null;
  previous: string | undefined;
  next: string | undefined;
  onNavigate: (id: string | null) => void;
  focusRow: () => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bounds = useWorkAreaBounds(openId !== null);
  const wasOpen = useRef(false);
  useEffect(() => {
    const open = openId !== null;
    if (open && !wasOpen.current) titleRef.current?.focus();
    if (!open && wasOpen.current) focusRow();
    wasOpen.current = open;
  }, [openId, focusRow]);
  if (openId === null || view === null) return null;
  const titleId = `record-panel-title-${openId}`;
  return (
    // A non-modal dialog: it has its own name and «Đóng», and the grid beside it stays usable.
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      style={
        {
          "--record-top": `${bounds.top}px`,
          "--record-right": `${bounds.right}px`,
          "--record-bottom": `${bounds.bottom}px`,
        } as CSSProperties
      }
      className="fixed top-(--record-top) right-(--record-right) bottom-(--record-bottom) z-50 flex w-2/5 min-w-80 max-w-lg flex-col border-l bg-background p-2"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        onNavigate(null);
      }}
    >
      <Frame
        data-slot="record-panel"
        data-record-layout="float"
        data-record-id={openId}
        className="min-h-0 flex-1 text-sm shadow-lg"
      >
        <FramePanel className="flex min-h-0 flex-1 flex-col p-0">
          <PanelHeader
            title={
              <h2
                id={titleId}
                ref={titleRef}
                tabIndex={-1}
                className={`${TITLE_CLASS} outline-none`}
              >
                {view.title}
              </h2>
            }
            previous={previous}
            next={next}
            onNavigate={onNavigate}
            close={
              <Button variant="ghost" size="sm" onClick={() => onNavigate(null)}>
                <XIcon aria-hidden="true" />
                {GRID_COPY.record.close}
              </Button>
            }
          />
          <div data-slot="record-panel-body" className="min-h-0 flex-1 overflow-y-auto p-4">
            {view.body}
          </div>
        </FramePanel>
      </Frame>
    </aside>
  );
}
