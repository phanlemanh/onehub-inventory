"use client";

// Whether a part of the screen sits inside an open dialog (row 3g). A dialog opened from there is nested, and a nested
// Base UI dialog draws no backdrop of its own, so the content behind stays bright and seems clickable (the full-screen
// record on a phone). FormDialog reads this and asks its backdrop to render anyway.
import { createContext, useContext, type ReactNode } from "react";

const InDialogContext = createContext(false);

/** Marks its children as inside an open dialog. */
export function InDialog({ value, children }: { value: boolean; children: ReactNode }) {
  return <InDialogContext.Provider value={value}>{children}</InDialogContext.Provider>;
}

/** True inside a dialog's content. */
export const useInDialog = (): boolean => useContext(InDialogContext);
