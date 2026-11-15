"use client";

import type { MouseEvent, ReactElement } from "react";

/**
 * A 44 × 44 px touch target around a smaller control (row 2b; WCAG 2.5.5, the platforms' 44 pt): the control keeps the
 * supplier's own size, and a tap on the wrapper's empty edge is handed to the control inside. Two targets side by side
 * touch without overlapping. Used below 768 px, where a finger, not a pointer, presses.
 */
export function TouchTarget({ children }: { children: ReactElement }) {
  const forward = (event: MouseEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget) return;
    event.currentTarget.querySelector<HTMLElement>("button, a")?.click();
  };
  return (
    // The wrapper is not a control of its own: the control inside keeps the focus, the name and the keys.
    <span
      data-slot="touch-target"
      className="relative inline-flex size-11 shrink-0 items-center justify-center"
      onClick={forward}
    >
      {children}
    </span>
  );
}
