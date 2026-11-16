"use client";

import { useEffect } from "react";

/**
 * Marks the page hydrated: `data-hydrated` on <html>, set once React has hydrated the root (row 1u). Browser tests
 * wait for it before they change the page, so a test never edits HTML that React has not taken over yet. Same mark as
 * the data region's (row VP4). Renders nothing.
 */
export function HydrationMark() {
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "");
  }, []);
  return null;
}
