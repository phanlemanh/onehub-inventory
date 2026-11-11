import type { Metadata } from "next";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { PageState } from "@/components/templates/page-state";

export const metadata: Metadata = { title: FRAME_COPY.notFound.title };

/**
 * An address that matches no route. Next sends every unknown URL here, including mistyped customer links,
 * so the page carries no internal frame and no internal label (AGENTS.md, invariant 3).
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh p-4">
      <PageState kind="not-found" />
    </main>
  );
}
