"use client";

import { EllipsisIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useActionPermission } from "./action-permission";
import { GRID_COPY } from "./grid-copy";
import { useChange, type Change } from "./use-change";

/** A removing action: always confirmed first, never undone from a toast (design/behaviors.md, «Bộ nút theo quyền»). */
export type RemoveChange = Omit<Extract<Change, { reversible: false }>, "reversible">;

/** One thing a person can do to a record, named by its row in the permission table (ontology/actions.yaml). */
export type RecordAction = {
  action: string;
  /** Verb plus noun from the labels, e.g. label("RemoveListing"). */
  label: string;
} & ({ onSelect: () => void; remove?: never } | { remove: RemoveChange; onSelect?: never });

/**
 * The actions the session may run on this record, in the menu's order: ordinary ones first, removing ones last.
 * `mine` says the record is the viewer's own (own scope); an action without permission is dropped, never disabled.
 */
export function useRecordActions(
  actions: readonly RecordAction[],
  mine: boolean,
): { plain: RecordAction[]; removing: RecordAction[] } {
  const permitted = useActionPermission();
  const allowed = actions.filter((a) => permitted(a.action, mine));
  return {
    plain: allowed.filter((a) => a.remove === undefined),
    removing: allowed.filter((a) => a.remove !== undefined),
  };
}

/**
 * The «…» of one record (row 9e, R1): ordinary actions first, removing ones last, apart behind a line and in red;
 * a removing action opens the short confirmation (X1) through the store's `useChange`. Nothing permitted, no «…».
 * Pass `run` when the screen keeps one confirmation for many rows; otherwise this menu keeps its own.
 */
export function RowActions({
  actions,
  mine,
  title,
  run,
  inGrid = false,
}: {
  actions: readonly RecordAction[];
  mine: boolean;
  /** The record's name, so each «…» has its own accessible name. */
  title: string;
  run?: (change: Change) => Promise<boolean>;
  /** In the shared grid the table is the one keyboard stop: the «…» opens by a click, or Enter on its cell. */
  inGrid?: boolean;
}) {
  const own = useChange();
  const { plain, removing } = useRecordActions(actions, mine);
  if (plain.length === 0 && removing.length === 0) return null;
  const start = run ?? own.run;
  const pick = (a: RecordAction) => {
    if (a.remove) void start({ ...a.remove, reversible: false });
    else a.onSelect?.();
  };
  const item = (a: RecordAction, danger: boolean) => (
    <DropdownMenuItem
      key={a.action}
      variant={danger ? "destructive" : "default"}
      data-action={a.action}
      onClick={() => pick(a)}
    >
      {a.label}
    </DropdownMenuItem>
  );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              data-slot="row-actions"
              data-cell-interactive={inGrid ? "" : undefined}
              tabIndex={inGrid ? -1 : undefined}
              aria-label={GRID_COPY.rowActions.more(title)}
            />
          }
        >
          <EllipsisIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {plain.length > 0 ? (
            <DropdownMenuGroup>{plain.map((a) => item(a, false))}</DropdownMenuGroup>
          ) : null}
          {plain.length > 0 && removing.length > 0 ? <DropdownMenuSeparator /> : null}
          {removing.length > 0 ? (
            <DropdownMenuGroup>{removing.map((a) => item(a, true))}</DropdownMenuGroup>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {run ? null : own.dialog}
    </>
  );
}

/**
 * The actions at the head of an open record (row 9e): one main button (usually the edit button) when permitted, then the «…»
 * of the rest. Goes in the record panel's header, beside «Trước», «Sau» and «Đóng».
 */
export function RecordActions({
  main,
  actions,
  mine,
  title,
}: {
  main?: { action: string; label: string; icon?: ReactNode; onSelect: () => void };
  actions: readonly RecordAction[];
  mine: boolean;
  title: string;
}) {
  const permitted = useActionPermission();
  const showMain = main !== undefined && permitted(main.action, mine);
  return (
    <div data-slot="record-actions" className="flex items-center gap-1">
      {showMain ? (
        <Button size="sm" data-action={main.action} onClick={main.onSelect}>
          {main.icon}
          {main.label}
        </Button>
      ) : null}
      <RowActions actions={actions} mine={mine} title={title} />
    </div>
  );
}
