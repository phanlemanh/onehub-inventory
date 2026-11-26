import type { ReactNode } from "react";

import { PlaceCrumb } from "./app-shell/place-crumb";
import { HiddenInFocus } from "./shell-focus";

/**
 * The head of a screen, one thin row as the ReUI Verve template has it: its one `h1` (the screen's name), «›» and the
 * place open in the second column when there is one (the name then steps back to muted), and the screen's primary
 * action at the end of the row. The name of a region stays on its frame. It steps aside while a region holds the whole
 * screen (App Shell focus mode).
 */
export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <HiddenInFocus>
      <header
        data-slot="page-header"
        className="flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-2"
      >
        <div className="group/crumb flex min-w-0 items-center gap-1.5">
          <h1 className="truncate text-sm font-medium text-foreground group-has-[[data-slot=page-header-place]]/crumb:text-muted-foreground">
            {title}
          </h1>
          <PlaceCrumb title={title} />
        </div>
        {action ? <div data-slot="page-header-action">{action}</div> : null}
      </header>
    </HiddenInFocus>
  );
}
