"use client";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

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
    <div data-slot="record-panel-header" className="flex flex-wrap items-center gap-2 border-b p-4">
      {title}
      <div className="flex items-center gap-2">
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

const TITLE_CLASS = "min-w-0 flex-1 basis-40 text-lg font-semibold break-words";

/**
 * The one record panel of the app (design/behaviors.md, open the record panel). From 768 px it is a column standing
 * beside the grid, the grid's own height, two fifths of the region: the grid shrinks to its left and stays usable, nothing
 * covers its toolbar. On a phone it is the whole screen. Esc or «Đóng» closes it and focus goes back to the row that
 * opened it; «Trước» and «Sau» walk the rows in the order the grid shows them, inside the same frame. The panel knows
 * nothing about listings or people: the screen gives `render`.
 */
export function RecordPanel({
  ids,
  openId,
  onNavigate,
  render,
}: {
  /** The rows in the order the grid shows them now (after search). */
  ids: readonly string[];
  openId: string | null;
  onNavigate: (id: string | null) => void;
  render: (id: string) => RecordView;
}) {
  // The record last shown: closing clears `openId`, and focus then goes to this row's button.
  const lastShown = useRef<string | null>(openId);
  useEffect(() => {
    if (openId !== null) lastShown.current = openId;
  }, [openId]);
  const isPhone = useIsMobile();
  const index = openId === null ? -1 : ids.indexOf(openId);
  const view = openId === null ? null : render(openId);
  const previous = index > 0 ? ids[index - 1] : undefined;
  const next = index >= 0 && index < ids.length - 1 ? ids[index + 1] : undefined;
  const focusRow = useCallback(() => {
    if (lastShown.current === null) return;
    document.querySelector<HTMLElement>(recordOpenSelector(lastShown.current))?.focus();
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

/**
 * The panel as a column beside the grid. It does not hold focus: the grid beside it stays in the tab order. Opening it
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
      className="flex min-h-0 min-w-0 flex-col md:w-2/5 md:shrink-0"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        onNavigate(null);
      }}
    >
      <Frame
        data-slot="record-panel"
        data-record-layout="column"
        data-record-id={openId}
        className="min-h-0 flex-1 text-sm"
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
