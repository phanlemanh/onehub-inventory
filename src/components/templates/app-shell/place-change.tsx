"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * What the second column knows about the open place beyond its address (row 2c): whether the person changed it since
 * opening it (a saved view whose arrangement moved, marked «đã đổi»), and a way to open it afresh when its entry is
 * pressed again. The screen tells; the column shows. Without a provider nothing is marked and pressing again does
 * nothing more than following the link.
 */
interface PlaceChange {
  /** The entry whose place has unsaved changes and the screen's word for it («đã đổi»), or null. */
  changed: { href: string; mark: string } | null;
  setChanged: (changed: { href: string; mark: string } | null) => void;
  /** Goes up by one each time the open entry is pressed again; a screen keys its region on it to drop its changes. */
  reopened: number;
  reopen: () => void;
}

const NONE: PlaceChange = {
  changed: null,
  setChanged: () => undefined,
  reopened: 0,
  reopen: () => undefined,
};

const PlaceChangeContext = createContext<PlaceChange>(NONE);

export function PlaceChangeProvider({ children }: { children: ReactNode }) {
  const [changed, setChanged] = useState<PlaceChange["changed"]>(null);
  const [reopened, setReopened] = useState(0);
  const value = useMemo(
    () => ({
      changed,
      setChanged,
      reopened,
      reopen: () => {
        setChanged(null);
        setReopened((n) => n + 1);
      },
    }),
    [changed, reopened],
  );
  return <PlaceChangeContext.Provider value={value}>{children}</PlaceChangeContext.Provider>;
}

export function usePlaceChange(): PlaceChange {
  return useContext(PlaceChangeContext);
}
