import type { ReactNode } from "react";

import { HiddenInFocus } from "./shell-focus";

/**
 * The head of a screen: its one `h1`, and the screen's primary action beside it when it has one. It steps aside while
 * a region holds the whole screen (App Shell focus mode).
 */
export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <HiddenInFocus>
      <header data-slot="page-header" className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {action ? <div data-slot="page-header-action">{action}</div> : null}
      </header>
    </HiddenInFocus>
  );
}
