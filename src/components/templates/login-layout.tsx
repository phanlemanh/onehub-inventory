import Image from "next/image";
import type { ReactNode } from "react";

import { FRAME_COPY } from "./frame-copy";

/**
 * The page frame of the sign-in family (row 1p, ReUI block auth-15): the logo on top, one narrow open column in the
 * middle of the page with no frame around it, a one-line footer. Screens outside the App Shell put their heading,
 * lead sentence and body in the slots; they keep the shape and never fork it.
 */
export function LoginLayout({
  heading,
  lead,
  footer,
  children,
}: {
  heading: string;
  lead: string;
  /** The one-line footer, written by the screen (its sentences live with the screen). */
  footer: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-svh w-full bg-background">
      <section className="flex min-h-svh w-full px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <div className="flex justify-center" data-slot="login-brand">
            <div className="inline-flex items-center gap-2">
              <Image src="/brand/logo-mark.svg" alt="" width={28} height={28} priority />
              <span className="text-base font-semibold text-foreground">{FRAME_COPY.brand}</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="flex w-full max-w-sm flex-col gap-6" data-slot="login-column">
              <div className="mb-2 flex flex-col gap-1 text-center">
                <h1 className="text-3xl leading-tight font-semibold text-balance">{heading}</h1>
                <p className="text-base text-pretty text-muted-foreground">{lead}</p>
              </div>
              {children}
            </div>
          </div>
          <footer
            className="flex justify-center text-center text-xs text-muted-foreground"
            data-slot="login-footer"
          >
            <span className="whitespace-nowrap">{footer}</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
