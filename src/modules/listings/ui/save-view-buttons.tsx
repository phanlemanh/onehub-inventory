"use client";

import { BookmarkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EMPTY_VIEW, type GridView } from "@/components/candidate/grid-view";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { notifyResult } from "@/components/templates/notify";
import { Button } from "@/components/ui/button";
import { PermittedAction } from "@/modules/identity/ui";

import { SAVED_VIEWS_BASE_PATH, type SavedView } from "../saved-view";
import { JSON_HEADERS, readOutcome, savedViewHref, storedView } from "./saved-view-api";
import type { SavedViewCopy } from "./saved-view-copy";
import { ViewNameDialog } from "./view-name-dialog";

/** Names the grid's arrangement and saves it as a new view, then opens it (behind saveView). */
function SaveViewDialog({
  view,
  asNew,
  taken,
  copy,
}: {
  view: GridView | null;
  asNew: boolean;
  taken: readonly string[];
  copy: SavedViewCopy;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <ViewNameDialog
      open={open}
      onOpenChange={setOpen}
      copy={copy}
      trigger={{
        render: (
          <Button
            variant="outline"
            size="sm"
            data-slot={asNew ? "save-view-as-new" : "save-view"}
          />
        ),
        label: asNew ? (
          copy.labels.saveAsNew
        ) : (
          <>
            <BookmarkIcon aria-hidden="true" />
            {copy.labels.save}
          </>
        ),
      }}
      title={asNew ? copy.labels.saveAsNew : copy.labels.save}
      description={asNew ? copy.saveAsNewDescription : copy.saveDescription}
      taken={taken}
      send={(name) =>
        readOutcome(
          fetch(SAVED_VIEWS_BASE_PATH, {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({
              screen: "inventory",
              name,
              view: storedView(view ?? EMPTY_VIEW),
            }),
          }),
        )
      }
      onDone={({ view: saved }) => {
        notifyResult({ message: copy.saved(saved.name) });
        router.push(savedViewHref(saved.id));
        router.refresh();
      }}
    />
  );
}

/** Overwrites the open view with the grid's arrangement (behind editView). */
function SaveChangesButton({
  open,
  view,
  copy,
}: {
  open: SavedView;
  view: GridView | null;
  copy: SavedViewCopy;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  return (
    <>
      <Button
        size="sm"
        data-slot="save-view-changes"
        disabled={busy || !view}
        onClick={async () => {
          if (!view) return;
          setBusy(true);
          const outcome = await readOutcome(
            fetch(`${SAVED_VIEWS_BASE_PATH}/${encodeURIComponent(open.id)}`, {
              method: "PATCH",
              headers: JSON_HEADERS,
              body: JSON.stringify({ view: storedView(view) }),
            }),
          );
          setBusy(false);
          if (outcome.ok) {
            setProblem(null);
            notifyResult({ message: copy.changesSaved(open.name) });
            router.refresh();
          } else setProblem(outcome.error === "refused" ? FRAME_COPY.refusedAction : copy.failed);
        }}
      >
        {busy ? copy.busy : problem ? FRAME_COPY.retry : copy.labels.saveChanges}
      </Button>
      {problem ? (
        <span role="alert" data-slot="save-view-error" className="text-sm text-destructive">
          {problem}
        </span>
      ) : null}
    </>
  );
}

/**
 * The region's save button (row 2c, S1 chosen at the scope gate): «save view» names the grid's arrangement; while an
 * open view has unsaved changes it becomes «save changes» (overwrites that view) and «save as new» (a second one).
 * Nothing saves by itself (Hỏi-5). Each button stands behind its row of the permission table.
 */
export function SaveViewButtons({
  current,
  open,
  changed,
  taken,
  copy,
}: {
  /** The grid's arrangement now. */
  current: GridView | null;
  /** The view the grid opened, if any. */
  open: SavedView | null;
  changed: boolean;
  /** Names of the person's views. */
  taken: readonly string[];
  copy: SavedViewCopy;
}) {
  if (open && changed) {
    return (
      <div data-slot="save-view-buttons" className="flex flex-wrap items-center gap-2">
        <PermittedAction action="editView">
          <SaveChangesButton open={open} view={current} copy={copy} />
        </PermittedAction>
        <PermittedAction action="saveView">
          <SaveViewDialog view={current} asNew taken={taken} copy={copy} />
        </PermittedAction>
      </div>
    );
  }
  return (
    <PermittedAction action="saveView">
      <SaveViewDialog view={current} asNew={false} taken={taken} copy={copy} />
    </PermittedAction>
  );
}
