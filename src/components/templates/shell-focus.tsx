"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Focus mode of the App Shell (row 2a, «Toàn màn hình»): while one region holds the whole screen, the shell's rails,
 * top bar and the page header step aside so the region fills the screen, as a sheet does in full screen. A region asks
 * for it; without a provider (a region outside the shell, a test) asking does nothing.
 */
interface ShellFocus {
  focused: boolean;
  setFocused: (focused: boolean) => void;
}

const NO_SHELL: ShellFocus = { focused: false, setFocused: () => undefined };

const ShellFocusContext = createContext<ShellFocus>(NO_SHELL);

export function ShellFocusProvider({ children }: { children: ReactNode }) {
  const [focused, setFocused] = useState(false);
  // Focus mode belongs to one screen: a new address (Back, a gesture, a link) gives the next screen the whole shell
  // (row 2c, Ngoài-5 of 2a). The region that asked also gives it back when it goes.
  const pathname = usePathname();
  const [focusedAt, setFocusedAt] = useState(pathname);
  if (focusedAt !== pathname) {
    setFocusedAt(pathname);
    if (focused) setFocused(false);
  }
  const value = useMemo(() => ({ focused, setFocused }), [focused]);
  return <ShellFocusContext.Provider value={value}>{children}</ShellFocusContext.Provider>;
}

export function useShellFocus(): ShellFocus {
  return useContext(ShellFocusContext);
}

/** Shell parts that step aside in focus mode: the rails, the top bar, the second column, the page header. */
export function HiddenInFocus({ children }: { children: ReactNode }) {
  return useShellFocus().focused ? null : <>{children}</>;
}

/** The content area: its usual padding, or a thin one in focus mode so the region reaches the screen's edges. */
export function ShellContent({ children }: { children: ReactNode }) {
  const { focused } = useShellFocus();
  return (
    <div
      data-slot="app-shell-content"
      data-focus={focused || undefined}
      className={focused ? "flex flex-col gap-2 p-2" : "flex flex-col gap-6 p-4 lg:p-8"}
    >
      {children}
    </div>
  );
}
