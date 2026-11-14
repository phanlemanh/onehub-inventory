"use client";

import { ChevronLeftIcon, ChevronRightIcon, PinIcon, PinOffIcon, XIcon } from "lucide-react";
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { usePanelRef } from "react-resizable-panels";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog } from "@base-ui/react/dialog";

import { GRID_COPY } from "./grid-copy";
import {
  PIN_DEFAULT_SHARE,
  PIN_MAX_SHARE,
  PIN_MIN_WIDTH,
  clampPinWidth,
  pinAvailable,
  widestPin,
  useRecordPin,
  type PinState,
} from "./record-pin";

/** The address parameter that names the open record (design/behaviors.md: the record panel has its own address). */
export const RECORD_PARAM = "ho-so";

/** What a screen says about one record: its name and its content. The frame around it is not the screen's. */
export interface RecordView {
  title: string;
  body: ReactNode;
  /** The record's actions, usually a RecordActions (row 9e): at the head, before «Trước», «Sau» and «Đóng». */
  actions?: ReactNode;
  /**
   * One button stuck to the foot of the record, outside the scrolling body: the next step with a person (row 3e,
   * the ask-the-listing-agent button). Absent, the record looks as before.
   */
  footer?: ReactNode;
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

/**
 * The panel's header, two lines on every width (owner, 2026-11-13, «Có, mọi khổ»): the record's name on its own line,
 * then the record's actions, «Trước» and «Sau» in the grid's order, and «Đóng» on the line below, at the right.
 */
function PanelHeader({
  title,
  previous,
  next,
  onNavigate,
  close,
  actions,
  pin,
}: {
  title: ReactNode;
  actions?: ReactNode;
  /** The frame's pin button (row 3a): after the record's actions, before «Trước»; absent on a phone. */
  pin?: ReactNode;
  previous: string | undefined;
  next: string | undefined;
  onNavigate: (id: string | null) => void;
  close: ReactNode;
}) {
  return (
    <div data-slot="record-panel-header" className="flex flex-col gap-2 border-b p-4">
      {title}
      <div data-slot="record-panel-actions" className="flex items-center justify-end gap-1">
        {actions}
        {pin}
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

const TITLE_CLASS = "min-w-0 text-lg font-semibold break-words";

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
  const pin = useRecordPin();
  const index = openId === null ? -1 : ids.indexOf(openId);
  const view = openId === null ? null : render(openId);
  const previous = index > 0 ? ids[index - 1] : undefined;
  const next = index >= 0 && index < ids.length - 1 ? ids[index + 1] : undefined;
  const focusRow = useCallback(() => {
    const id = lastShown.current;
    if (id === null) return;
    if (returnFocusRef.current?.(id)) return;
    // Closing a pinned record widens the grid, which may redraw its rows (row 3a): while the row that took focus is
    // replaced and focus falls back to the page, give it to the new row, for a few frames at most.
    let tries = 0;
    const attempt = () => {
      const opener = document.querySelector<HTMLElement>(recordOpenSelector(id));
      opener?.focus();
      watch(opener);
    };
    // Only a replaced row gets focus again: focus that someone moved away, even to the page, stays where it went.
    const watch = (opener: HTMLElement | null) => {
      if (tries++ >= 30) return;
      requestAnimationFrame(() => {
        if (opener && !opener.isConnected && document.activeElement === document.body) attempt();
        else if (opener?.isConnected) watch(opener);
      });
    };
    attempt();
  }, []);

  if (!isPhone)
    return (
      <RecordColumn
        pin={pin.state}
        onPin={pin.set}
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
            actions={view?.actions}
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
          {view?.footer}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** The App Shell's top bar and work area, by their slots; a page without the App Shell uses the whole window. */
const TOP_BAR = '[data-slot="app-shell-top-bar"]';
const WORK_AREA = '[data-slot="sidebar-inset"]';
/** The data region's toolbar: the floating record stands below it (AC-4 of row 3a). */
const REGION_TOOLS = '[data-slot="region-toolbar"]';

/**
 * Where the floating panel stands: from just under the App Shell's top bar to the bottom of the work area, flush with
 * its right edge (owner's choice at row 3's scope gate, «Trừ thanh trên»). Measured, not fixed in a class, because the
 * top bar hides in full screen (row 2a) and the panel then runs the whole height.
 */
function useWorkAreaBounds(open: boolean) {
  const [bounds, setBounds] = useState({
    top: 0,
    tools: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    window: 0,
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
        tools: document.querySelector(REGION_TOOLS)?.getBoundingClientRect().bottom ?? 0,
        right: area ? Math.max(0, window.innerWidth - area.right) : 0,
        bottom: area ? Math.max(0, window.innerHeight - area.bottom) : 0,
        left: area ? Math.max(0, area.left) : 0,
        width: area ? area.width : window.innerWidth,
        window: window.innerWidth,
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

/** The frame's pin button: an icon named for what a press does, pressed while the record is a column (row 3a). */
function PinButton({ pinned, onToggle }: { pinned: boolean; onToggle: () => void }) {
  const name = pinned ? GRID_COPY.record.unpin : GRID_COPY.record.pin;
  return (
    <Button
      variant={pinned ? "secondary" : "ghost"}
      size="icon-sm"
      aria-label={name}
      title={name}
      aria-pressed={pinned}
      data-slot="record-pin"
      onClick={onToggle}
    >
      {pinned ? <PinOffIcon aria-hidden="true" /> : <PinIcon aria-hidden="true" />}
    </Button>
  );
}

/** The floating record's width: two fifths of the window, between 320 and 512 px, as row 3 built it. */
function floatWidth(windowWidth: number): number {
  return Math.min(512, Math.max(PIN_MIN_WIDTH, windowWidth * PIN_DEFAULT_SHARE));
}

/**
 * The record beside the grid, from 768 px. Floating, it lies over the right of the work area (decision 0024). Pinned
 * (row 3a, decision 0031), it is a column flush with the work area's right edge with a divider to drag (ReUI
 * app-shell-11, Resizable), and the data region gives up the same width (`--record-pinned`) so no row and no column
 * hides under it. Both shapes are one tree — only classes and the column's size change — so pinning keeps the record's
 * scroll and the focus on the pin button. It does not hold focus: the grid beside it stays in the tab order. Opening it
 * from a closed state moves focus to its title; walking to another row leaves focus where it is. Esc closes it only
 * from inside the record.
 */
function RecordColumn({
  openId,
  view,
  previous,
  next,
  onNavigate,
  focusRow,
  pin,
  onPin,
}: {
  openId: string | null;
  view: RecordView | null;
  previous: string | undefined;
  next: string | undefined;
  onNavigate: (id: string | null) => void;
  focusRow: () => void;
  pin: PinState;
  onPin: (next: PinState, fallbackWidth: number) => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = usePanelRef();
  const bounds = useWorkAreaBounds(openId !== null);
  const wasOpen = useRef(false);
  useEffect(() => {
    const open = openId !== null;
    if (open && !wasOpen.current) titleRef.current?.focus();
    if (!open && wasOpen.current) focusRow();
    wasOpen.current = open;
  }, [openId, focusRow]);
  const canPin = pinAvailable(bounds.width);
  const shown = openId !== null && view !== null;
  const pinned = pin.pinned && canPin && shown;
  const area = bounds.width;
  // Unpinned before, the column keeps the floating record's width, so pinning does not reflow the record.
  const pinnedWidth = clampPinWidth(pin.width ?? floatWidth(bounds.window), area);
  const width = pinned ? pinnedWidth : floatWidth(bounds.window);
  // The column follows the state: pinned width from the cookie, the float's own width otherwise.
  useEffect(() => {
    if (!shown || area === 0) return;
    panelRef.current?.resize(width);
  }, [shown, area, width, panelRef]);
  // The data region makes room for the pinned column; nothing to make room for when it floats or is closed.
  useEffect(() => {
    const root = document.documentElement;
    if (pinned) root.style.setProperty("--record-pinned", `${pinnedWidth}px`);
    else root.style.removeProperty("--record-pinned");
    return () => {
      root.style.removeProperty("--record-pinned");
    };
  }, [pinned, pinnedWidth]);
  if (!shown || view === null || openId === null) return null;
  const titleId = `record-panel-title-${openId}`;
  return (
    <div
      data-slot="record-panel-layer"
      style={
        {
          // Floating, the record stands below the region's toolbar so the toolbar stays usable (AC-4 of row 3a, after
          // the supervisor's ruling D-1411-1: the owner's newer word wins over row 3's «Trừ thanh trên»); pinned, the
          // region gives up its width, so the column runs from just under the top bar.
          "--record-top": `${pinned ? bounds.top : Math.max(bounds.top, bounds.tools)}px`,
          "--record-right": `${bounds.right}px`,
          "--record-bottom": `${bounds.bottom}px`,
          "--record-left": `${bounds.left}px`,
        } as CSSProperties
      }
      // The layer lets clicks through to the grid; only the record and, when pinned, the divider take them. The vendor
      // parts take no classes, so the layer styles them by their slots.
      className={`pointer-events-none fixed top-(--record-top) right-(--record-right) bottom-(--record-bottom) left-(--record-left) [&_[data-slot=resizable-panel]:has(aside)]:pointer-events-auto ${pinned ? "z-40 [&_[data-slot=resizable-handle]]:pointer-events-auto" : "z-50 [&_[data-slot=resizable-handle]]:hidden"}`}
    >
      <ResizablePanelGroup
        orientation="horizontal"
        disabled={!pinned}
        onLayoutChanged={(layout, meta) => {
          if (!pinned || !meta.isUserInteraction) return;
          // The new layout, as shares of the work area: the panel's own size may still be the old one here.
          const share = layout["record-column"];
          if (share === undefined) return;
          const size = clampPinWidth((share / 100) * area, area);
          onPin({ pinned: true, width: size }, size);
        }}
      >
        <ResizablePanel id="record-grid" minSize={`${100 - PIN_MAX_SHARE * 100}`} />
        <ResizableHandle withHandle aria-label={GRID_COPY.record.resize} />
        <ResizablePanel
          id="record-column"
          panelRef={panelRef}
          defaultSize={width}
          minSize={PIN_MIN_WIDTH}
          maxSize={area > 0 ? `${(widestPin(area) / area) * 100}` : `${PIN_MAX_SHARE * 100}`}
        >
          {/* A non-modal dialog: it has its own name and «Đóng», and the grid beside it stays usable. */}
          <aside
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            className={`flex h-full flex-col bg-background ${pinned ? "" : "border-l p-2"}`}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.stopPropagation();
              onNavigate(null);
            }}
          >
            <Frame
              data-slot="record-panel"
              data-record-layout={pinned ? "pinned" : "float"}
              data-record-id={openId}
              className={`min-h-0 flex-1 text-sm ${pinned ? "rounded-none border-0 p-0 shadow-none" : "shadow-lg"}`}
            >
              <FramePanel
                className={`flex min-h-0 flex-1 flex-col p-0 ${pinned ? "rounded-none border-0 shadow-none" : ""}`}
              >
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
                  actions={view.actions}
                  pin={
                    canPin ? (
                      <PinButton
                        pinned={pinned}
                        onToggle={() => onPin({ pinned: !pinned, width: pin.width }, pinnedWidth)}
                      />
                    ) : null
                  }
                  close={
                    <Button variant="ghost" size="sm" onClick={() => onNavigate(null)}>
                      <XIcon aria-hidden="true" />
                      {GRID_COPY.record.close}
                    </Button>
                  }
                />
                {/* The body scrolls when the record is taller than its column: keyboard users reach it with Tab. */}
                <div
                  data-slot="record-panel-body"
                  role="region"
                  aria-labelledby={titleId}
                  tabIndex={0}
                  className="min-h-0 flex-1 overflow-y-auto p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {view.body}
                </div>
                {view.footer}
              </FramePanel>
            </Frame>
          </aside>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
