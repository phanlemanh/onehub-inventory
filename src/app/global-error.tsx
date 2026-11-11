"use client";

import "./globals.css";

import { Button } from "@/components/ui/button";
import { FRAME_COPY } from "@/components/templates/frame-copy";

/** The root layout itself failed: a bare page with the three-part sentence and a retry. */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="vi">
      <body>
        <title>{`${FRAME_COPY.appError.title} · ${FRAME_COPY.brand}`}</title>
        <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
          <h1 className="text-lg font-semibold">{FRAME_COPY.appError.title}</h1>
          <p className="text-muted-foreground">{FRAME_COPY.appError.detail}</p>
          <Button onClick={retry}>{FRAME_COPY.retry}</Button>
        </main>
      </body>
    </html>
  );
}
