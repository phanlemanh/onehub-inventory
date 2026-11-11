"use client";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { PageState } from "@/components/templates/page-state";

/** A screen that broke while rendering: the frame stays, the main region explains and offers a retry. */
export default function ScreenError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <>
      <title>{`${FRAME_COPY.error.title} · ${FRAME_COPY.brand}`}</title>
      <PageState kind="error" onRetry={retry} />
    </>
  );
}
