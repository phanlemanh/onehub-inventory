"use client";

// The paste preview of the shared grid (row 5): before anything is written, the person sees each cell a pasted region
// will change (old → new), each cell left out and why, each cell whose words are not of the column's kind; they apply
// once, or cancel. Composed from the store: the form dialog of row 9, Item rows, a Checkbox per change, a Badge for a
// mark. The screen builds the lines from its own rules and writes through its own door; row 11 reuses this preview.
import { useState } from "react";

import { Badge } from "@/components/reui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Item } from "@/components/ui/item";

import { FormDialog } from "./form-dialog";
import { PASTE_COPY } from "./paste-copy";

/** One cell that will change. `where` names the row (e.g. «Căn 1101»), `field` the column's header. */
export interface PasteChangeLine {
  id: string;
  where: string;
  field: string;
  from: string;
  to: string;
  /** A short mark the screen's rules put on the line, e.g. «+72%» for a big price change. */
  mark?: string;
  /** The change cannot be undone once applied (its way back is not an allowed move). */
  final?: boolean;
  /** Left unticked when the preview opens: the person ticks it to write it (a price far from the old one, row 5 Hỏi-6). */
  held?: boolean;
}

/** One cell left out, or whose words are not of the column's kind: what was pasted, and why. */
export interface PasteOutLine {
  id: string;
  where: string;
  field?: string;
  raw?: string;
  why: string;
}

export interface PastePreviewProps {
  open: boolean;
  /** «Dán vào 3 căn»: the screen names its rows. */
  title: string;
  changes: readonly PasteChangeLine[];
  skipped: readonly PasteOutLine[];
  wrong: readonly PasteOutLine[];
  /** Cells the paste leaves as they are (same value, empty cell): only counted. */
  same: number;
  busy: boolean;
  /** Applies the changes still ticked, by id. */
  onApply: (ids: string[]) => void;
  onClose: () => void;
}

function Line({ head, children }: { head: string; children: React.ReactNode }) {
  return (
    <Item size="sm">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
        <span className="font-medium">{head}</span>
        {children}
      </span>
    </Item>
  );
}

function OutList({
  name,
  lines,
  slot,
}: {
  name: string;
  lines: readonly PasteOutLine[];
  slot: string;
}) {
  if (lines.length === 0) return null;
  return (
    <section className="flex flex-col gap-1" data-slot={slot}>
      <h3 className="text-sm font-medium text-muted-foreground">
        {name} · {lines.length}
      </h3>
      <div role="list" aria-label={name} className="flex flex-col divide-y">
        {lines.map((l) => (
          <div role="listitem" key={l.id} data-paste-line={l.id}>
            <Line head={[l.where, l.field].filter(Boolean).join(" · ")}>
              <span className="text-muted-foreground">
                {l.raw !== undefined && l.raw.trim() !== "" ? `«${l.raw.trim()}» — ` : ""}
                {l.why}
              </span>
            </Line>
          </div>
        ))}
      </div>
    </section>
  );
}

/** The lists of a paste preview, without their frame: the dialog wraps them (lối A); a panel may too. */
export function PastePreviewBody({
  changes,
  skipped,
  wrong,
  picked,
  setPicked,
  busy,
}: {
  changes: readonly PasteChangeLine[];
  skipped: readonly PasteOutLine[];
  wrong: readonly PasteOutLine[];
  picked: ReadonlySet<string>;
  setPicked: (update: (all: ReadonlySet<string>) => ReadonlySet<string>) => void;
  busy: boolean;
}) {
  return (
    <div className="-mx-1 flex max-h-96 flex-col gap-4 overflow-y-auto px-1">
      {changes.length > 0 ? (
        <section className="flex flex-col gap-1" data-slot="paste-changes">
          <h3 className="text-sm font-medium text-muted-foreground">
            {PASTE_COPY.changes} · {changes.length}
          </h3>
          <div role="list" aria-label={PASTE_COPY.changes} className="flex flex-col divide-y">
            {changes.map((c) => {
              const head = `${c.where} · ${c.field}`;
              return (
                <div role="listitem" key={c.id} data-paste-line={c.id}>
                  <Item size="sm">
                    <span className="flex w-full items-center gap-3">
                      <Checkbox
                        checked={picked.has(c.id)}
                        disabled={busy}
                        aria-label={PASTE_COPY.pick(head)}
                        onCheckedChange={(on) =>
                          setPicked((all) => {
                            const next = new Set(all);
                            if (on) next.add(c.id);
                            else next.delete(c.id);
                            return next;
                          })
                        }
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
                        <span className="font-medium">{head}</span>
                        <span className="flex flex-wrap items-center gap-2 tabular-nums">
                          <span className="text-muted-foreground line-through">{c.from}</span>
                          <span aria-hidden="true">→</span>
                          <span className="sr-only">{PASTE_COPY.becomes}</span>
                          <span data-part="to">{c.to}</span>
                          {c.mark ? <Badge variant="warning-light">{c.mark}</Badge> : null}
                          {c.final ? <Badge variant="secondary">{PASTE_COPY.noUndo}</Badge> : null}
                        </span>
                      </span>
                    </span>
                  </Item>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      <OutList name={PASTE_COPY.wrong} lines={wrong} slot="paste-wrong" />
      <OutList name={PASTE_COPY.skipped} lines={skipped} slot="paste-skipped" />
    </div>
  );
}

/** Give it a new `key` for each paste: a new paste ticks every change it brings. */
export function PastePreview({
  open,
  title,
  changes,
  skipped,
  wrong,
  same,
  busy,
  onApply,
  onClose,
}: PastePreviewProps) {
  const [picked, setPicked] = useState<ReadonlySet<string>>(
    () => new Set(changes.filter((c) => !c.held).map((c) => c.id)),
  );
  const count = changes.filter((c) => picked.has(c.id)).length;
  const description =
    changes.length === 0
      ? PASTE_COPY.nothing
      : PASTE_COPY.count({
          change: changes.length,
          skip: skipped.length,
          wrong: wrong.length,
          same,
        });
  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose();
      }}
      title={title}
      description={description}
      submitLabel={PASTE_COPY.apply(count)}
      busyLabel={PASTE_COPY.busy}
      busy={busy}
      canSubmit={count > 0}
      focusSubmit
      onSubmit={() => onApply(changes.filter((c) => picked.has(c.id)).map((c) => c.id))}
      slot="paste-preview"
    >
      <PastePreviewBody
        changes={changes}
        skipped={skipped}
        wrong={wrong}
        picked={picked}
        setPicked={setPicked}
        busy={busy}
      />
    </FormDialog>
  );
}
