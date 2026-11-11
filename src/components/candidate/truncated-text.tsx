"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Text that does not fit is cut with an ellipsis and can be read in full: on hover (title) and on keyboard focus,
 * where it wraps to show everything (design/states.md, long text). Only text that is actually cut takes focus,
 * so a grid of short values adds no extra Tab stops.
 */
export function TruncatedText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setCut(el.scrollWidth > el.clientWidth);
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
