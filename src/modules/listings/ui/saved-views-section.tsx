import type { NavSection } from "@/components/templates/app-shell";
import { PermittedAction } from "@/modules/identity/ui";

import type { SavedView } from "../saved-view";
import { savedViewHref } from "./saved-view-api";
import { savedViewCopy, type SavedViewLabels } from "./saved-view-copy";
import { SavedViewMenu } from "./saved-view-menu";

/**
 * The «my views» group of the inventory's second column (row 2c), drawn like every other entry of the column: one
 * line per view, its «…» at the end, a sentence while there is none. Null when the person cannot list views.
 */
export function savedViewsSection(
  views: readonly SavedView[] | null,
  labels: SavedViewLabels,
): NavSection | null {
  if (views === null) return null;
  const copy = savedViewCopy(labels);
  const names = views.map((v) => v.name);
  return {
    title: copy.mine,
    empty: copy.empty,
    items: views.map((v) => ({
      href: savedViewHref(v.id),
      title: v.name,
      trailing: (
        <PermittedAction action="removeView">
          <SavedViewMenu
            id={v.id}
            name={v.name}
            taken={names.filter((n) => n !== v.name)}
            labels={labels}
          />
        </PermittedAction>
      ),
    })),
  };
}
