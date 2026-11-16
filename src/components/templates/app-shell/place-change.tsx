"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * What the second column knows about the open place beyond its address (row 2c): whether the person changed it since
 * opening it (a saved view whose arrangement moved, marked «đã đổi»), a way to open it afresh when its entry is
 * pressed again, and a screen's way to take an entry in place (row 2d: a place of the inventory changes only the
 * grid's project and building filters, the others kept, instead of opening the address afresh). The screen tells; the column shows. Without a provider nothing is marked and pressing again does
 * nothing more than following the link.
 */
interface PlaceChange {
  /** The entry whose place has unsaved changes and the screen's word for it («đã đổi»), or null. */
  changed: { href: string; mark: string } | null;
  setChanged: (changed: { href: string; mark: string } | null) => void;
  /** Goes up by one each time the open entry is pressed again; a screen keys its region on it to drop its changes. */
  reopened: number;
  reopen: () => void;
  /** Asks the open screen to take this entry itself; true means it did, and the link is not followed. */
  pick: (href: string) => boolean;
  /** The open screen says which entries it takes in place; null when it leaves. */
  setPick: (pick: ((href: string) => boolean) | null) => void;
}

const NONE: PlaceChange = {
  changed: null,
  setChanged: () => undefined,
  reopened: 0,
  reopen: () => undefined,
  pick: () => false,
  setPick: () => undefined,
};

const PlaceChangeContext = createContext<PlaceChange>(NONE);

export function PlaceChangeProvider({ children }: { children: ReactNode }) {
  const [changed, setChanged] = useState<PlaceChange["changed"]>(null);
  const [reopened, setReopened] = useState(0);
  const picker = useRef<((href: string) => boolean) | null>(null);
  const value = useMemo(
    () => ({
      changed,
      setChanged,
      reopened,
      reopen: () => {
        setChanged(null);
        setReopened((n) => n + 1);
      },
      pick: (href: string) => picker.current?.(href) ?? false,
      setPick: (pick: ((href: string) => boolean) | null) => {
        picker.current = pick;
      },
    }),
    [changed, reopened],
  );
  return <PlaceChangeContext.Provider value={value}>{children}</PlaceChangeContext.Provider>;
}

export function usePlaceChange(): PlaceChange {
  return useContext(PlaceChangeContext);
}
