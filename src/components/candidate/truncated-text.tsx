"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Text that does not fit is cut with an ellipsis and can be read in full: on hover (title) and on keyboard focus,
 * where it wraps to show everything (design/states.md, long text). Only text that is actually cut takes focus,
 * so a grid of short values adds no extra Tab stops. The cut is measured again whenever the cell changes size,
 * not only when it first renders.
 */
export function TruncatedText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let width = el.clientWidth;
    const measure = () => setCut(el.scrollWidth > el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    // Only a change of width counts: on focus the cut text wraps to show everything, which changes its height,
    // and measuring then would find nothing cut and take its Tab stop away.
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      measure();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);
  return (
    <span
      ref={ref}
      data-slot="truncated-text"
      data-cut={cut ? "true" : undefined}
      tabIndex={cut ? 0 : undefined}
      title={text}
      className="block truncate rounded-sm outline-none focus-visible:break-words focus-visible:whitespace-normal focus-visible:ring-2 focus-visible:ring-ring"
    >
      {text}
    </span>
  );
}
