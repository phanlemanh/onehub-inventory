"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { RowActions } from "@/components/candidate/row-actions";
import { PermittedAction } from "@/modules/identity/ui";

import { SAVED_VIEWS_BASE_PATH } from "../saved-view";
import { JSON_HEADERS, SAVED_VIEW_PARAM, readOutcome } from "./saved-view-api";
import { savedViewCopy, type SavedViewLabels } from "./saved-view-copy";
import { ViewNameDialog } from "./view-name-dialog";

/** Renames one view; only the name changes (behind editView). */
function RenameViewDialog({
  id,
  name,
  taken,
  open,
  onOpenChange,
  copy,
}: {
  id: string;
  name: string;
  taken: readonly string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copy: ReturnType<typeof savedViewCopy>;
}) {
  const router = useRouter();
  return (
    <ViewNameDialog
      open={open}
      onOpenChange={onOpenChange}
      copy={copy}
      title={copy.labels.rename}
      description={copy.renameDescription}
      initialName={name}
      taken={taken}
      send={(next) =>
        readOutcome(
          fetch(`${SAVED_VIEWS_BASE_PATH}/${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: JSON_HEADERS,
            body: JSON.stringify({ name: next }),
          }),
        )
      }
      onDone={() => router.refresh()}
    />
  );
}

/**
 * The «…» at the end of a saved view in the second column (row 9e's pattern): rename, a line, remove in red and last,
 * confirmed first, each item shown by its row of the permission table. Removing the open view goes back to every unit;
 * removing another keeps the place. The menu itself stands behind removeView, the request it sends; renaming sends
 * from its own dialog behind editView.
 */
export function SavedViewMenu({
  id,
  name,
  taken,
  labels,
}: {
  id: string;
  name: string;
  /** Names of the person's other views. */
  taken: readonly string[];
  labels: SavedViewLabels;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const openId = useSearchParams().get(SAVED_VIEW_PARAM);
  const [renaming, setRenaming] = useState(false);
  const copy = savedViewCopy(labels);
  return (
    <>
      <RowActions
        title={name}
        mine
        actions={[
          { action: "editView", label: labels.rename, onSelect: () => setRenaming(true) },
          {
            action: "removeView",
            label: labels.remove,
            remove: {
              verb: labels.remove,
              what: copy.removeWhat(name),
              done: copy.removed(name),
              apply: async () => {
                const res = await fetch(`${SAVED_VIEWS_BASE_PATH}/${encodeURIComponent(id)}`, {
                  method: "DELETE",
                });
                if (!res.ok && res.status !== 404)
                  throw new Error(`saved view delete: ${res.status}`);
                if (pathname === "/inventory" && openId === id) router.push("/inventory");
                router.refresh();
              },
            },
          },
        ]}
      />
      <PermittedAction action="editView">
        <RenameViewDialog
          id={id}
          name={name}
          taken={taken}
          open={renaming}
          onOpenChange={setRenaming}
          copy={copy}
        />
      </PermittedAction>
    </>
  );
}
