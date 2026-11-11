"use client";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
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

/**
 * The one record panel of the app (design/behaviors.md, open the record panel): beside the grid on a wide screen,
 * the whole screen on a phone; Esc or «Đóng» closes it and focus goes back to the row that opened it; «Trước» and
 * «Sau» walk the rows in the order the grid shows them, inside the same frame. The panel knows nothing about
 * listings or people: the screen gives `render`.
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
  const index = openId === null ? -1 : ids.indexOf(openId);
  const view = openId === null ? null : render(openId);
  const previous = index > 0 ? ids[index - 1] : undefined;
  const next = index >= 0 && index < ids.length - 1 ? ids[index + 1] : undefined;

  // Built on Base UI's Dialog rather than the kit's Sheet: the Sheet's width is fixed at three quarters on a phone and
  // takes no classes, while design/behaviors.md asks for the whole screen there. No backdrop: the grid stays
  // visible beside the panel, and the dialog still keeps focus inside until it closes.
  return (
    <Dialog.Root
      open={openId !== null}
      onOpenChange={(open) => {
        if (!open) onNavigate(null);
      }}
      onOpenChangeComplete={(open) => {
        if (open || lastShown.current === null) return;
        document.querySelector<HTMLElement>(recordOpenSelector(lastShown.current))?.focus();
      }}
    >
      <Dialog.Portal>
        <Dialog.Popup
          data-slot="record-panel"
          data-record-id={openId ?? undefined}
          // Focus goes back once the panel has closed (onOpenChangeComplete), to the row last shown.
          finalFocus={false}
          className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l bg-popover text-sm text-popover-foreground shadow-lg outline-none sm:w-3/4 sm:max-w-md"
        >
          <div
            data-slot="record-panel-header"
            className="flex flex-wrap items-center gap-2 border-b p-4"
          >
            <Dialog.Title className="min-w-0 flex-1 basis-40 text-lg font-semibold break-words">
              {view?.title}
            </Dialog.Title>
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
              <Dialog.Close render={<Button variant="ghost" size="sm" />}>
                <XIcon aria-hidden="true" />
                {GRID_COPY.record.close}
              </Dialog.Close>
            </div>
          </div>
          <div data-slot="record-panel-body" className="min-h-0 flex-1 overflow-y-auto p-4">
            {view?.body}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
