"use client";

import { EllipsisIcon, PencilIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { RegionForbidden } from "@/components/candidate/region-state";
import { Frame, FrameHeader, FramePanel } from "@/components/reui/frame";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { label } from "@/modules/company-config";
import { allowedScope, type ActionName } from "@/modules/identity";
import type { Role } from "@/generated/ontology";

import { PROTO_COPY as C } from "./copy";
import { SampleGrid } from "./sample-grid";
import { DRAFT_ACTIONS, type DraftAction } from "./draft-permissions";

export type Choice = {
  screen: "listings" | "contacts";
  role: Role;
  toolbar: "A" | "B" | "C";
  row: "R1" | "R2" | "R3";
  words: "H1" | "H2";
  others: "O1" | "O2";
  confirm: "X1" | "X2" | "X3";
  open?: "menu" | "remove" | "record" | "refused";
};

const ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];

/** A row of the sample: a code, a second line, and whether the viewer keeps it (own scope). */
type SampleRow = { id: string; title: string; detail: string; extra: string; mine: boolean };

/** Made-up units and contacts: codes, placeholder names and reserved test numbers only. */
function sample(screen: Choice["screen"]): SampleRow[] {
  return Array.from({ length: 8 }, (_, i) => {
    const mine = i % 3 !== 1;
    const keeper = mine ? C.me : `[Tên] ${String(i + 2).padStart(2, "0")}`;
    if (screen === "listings") {
      const building = `S${(i % 3) + 1}.0${(i % 4) + 1}`;
      return {
        id: `can-${i + 1}`,
        title: `${building}-${String(12 + i).padStart(2, "0")}0${(i % 8) + 1}`,
        detail: `${(2.1 + i * 0.35).toFixed(2).replace(".", ",")} tỷ`,
        extra: keeper,
        mine,
      };
    }
    return {
      id: `lh-${i + 1}`,
      title: `[Tên] ${String(i + 1).padStart(2, "0")}`,
      detail: `0900 000 0${String(i + 1).padStart(2, "0")}`,
      extra: keeper,
      mine,
    };
  });
}

/** What a role sees for one action on one record: the button, a dimmed button with its reason, or nothing. */
type Seen = { kind: "show" } | { kind: "dim"; reason: string } | { kind: "hide" };

function seen(
  role: Role,
  action: DraftAction,
  mine: boolean,
  others: Choice["others"],
  ownWhy: string,
): Seen {
  const scope = allowedScope([role], action as ActionName, DRAFT_ACTIONS);
  if (scope === null) return { kind: "hide" };
  if (scope === "company" || mine) return { kind: "show" };
  return others === "O1" ? { kind: "hide" } : { kind: "dim", reason: ownWhy };
}

type RowAction = { key: DraftAction; text: string; danger: boolean; seen: Seen };

function rowActions(choice: Choice, row: SampleRow): RowAction[] {
  const listings = choice.screen === "listings";
  const why = listings ? C.ownOnly : C.ownOnlyContact;
  const make = (key: DraftAction, text: string, danger = false): RowAction => ({
    key,
    text,
    danger,
    seen: seen(choice.role, key, row.mine, choice.others, why),
  });
  const edit = make(listings ? "updateListing" : "updateContact", C.actions.edit);
  if (choice.words === "H1") {
    return [
      edit,
      make(
        listings ? "removeListingCreatedByMistake" : "removeContactCreatedByMistake",
        listings ? C.actions.deleteUnit : C.actions.deleteContact,
        true,
      ),
    ];
  }
  return listings
    ? [
        edit,
        make("withdrawListing", C.actions.withdraw, true),
        make("removeListingCreatedByMistake", C.actions.removeMistake, true),
      ]
    : [
        edit,
        make("mergeContacts", C.actions.merge),
        make("removeContactCreatedByMistake", C.actions.removeMistake, true),
        make("eraseContactPersonalData", C.actions.erase, true),
      ];
}

function Segmented<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="text-muted-foreground text-xs font-medium">{name}</span>
      <div role="group" aria-label={name} className="flex flex-wrap gap-1">
        {(Object.keys(options) as T[]).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={key === value ? "default" : "outline"}
            aria-pressed={key === value}
            onClick={() => onChange(key)}
          >
            {options[key]}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Controls({
  choice,
  set,
  onRefuse,
}: {
  choice: Choice;
  set: (patch: Partial<Choice>) => void;
  onRefuse: () => void;
}) {
  const roles = Object.fromEntries(ROLES.map((r) => [r, label(r)])) as Record<Role, string>;
  return (
    <Frame data-proto-controls>
      <FrameHeader>
        <h2 className="text-sm font-semibold">{C.controls.heading}</h2>
        <p className="text-muted-foreground text-xs">{C.controls.note}</p>
      </FrameHeader>
      <FramePanel className="grid gap-4 md:grid-cols-2">
        <Segmented
          name={C.controls.screen}
          value={choice.screen}
          options={C.screens}
          onChange={(screen) => set({ screen })}
        />
        <Segmented
          name={C.controls.role}
          value={choice.role}
          options={roles}
          onChange={(role) => set({ role })}
        />
        <Segmented
          name={C.controls.toolbar}
          value={choice.toolbar}
          options={C.options.toolbar}
          onChange={(toolbar) => set({ toolbar })}
        />
        <Segmented
          name={C.controls.row}
          value={choice.row}
          options={C.options.row}
          onChange={(row) => set({ row })}
        />
        <Segmented
          name={C.controls.words}
          value={choice.words}
          options={C.options.words}
          onChange={(words) => set({ words })}
        />
        <Segmented
          name={C.controls.others}
          value={choice.others}
          options={C.options.others}
          onChange={(others) => set({ others })}
        />
        <Segmented
          name={C.controls.confirm}
          value={choice.confirm}
          options={C.options.confirm}
          onChange={(confirm) => set({ confirm })}
        />
        <div className="flex items-end">
          <Button size="sm" variant="outline" onClick={onRefuse}>
            {C.controls.refuse}
          </Button>
        </div>
      </FramePanel>
    </Frame>
  );
}

/** The «…» menu of one record: allowed actions, dimmed ones with their reason, removing ones last and apart. */
function MoreMenu({
  actions,
  onPick,
  defaultOpen,
  title,
}: {
  actions: RowAction[];
  onPick: (action: RowAction) => void;
  defaultOpen?: boolean;
  title: string;
}) {
  const visible = actions.filter((a) => a.seen.kind !== "hide");
  if (visible.length === 0) return null;
  const plain = visible.filter((a) => !a.danger);
  const danger = visible.filter((a) => a.danger);
  const item = (a: RowAction) => (
    <DropdownMenuItem
      key={a.key}
      variant={a.danger ? "destructive" : "default"}
      disabled={a.seen.kind === "dim"}
      onClick={() => onPick(a)}
    >
      <span className="flex flex-col">
        <span>{a.text}</span>
        {a.seen.kind === "dim" ? (
          <span className="text-muted-foreground text-xs">{a.seen.reason}</span>
        ) : null}
      </span>
    </DropdownMenuItem>
  );
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={`${C.more} — ${title}`} />}
      >
        <EllipsisIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {plain.length > 0 ? <DropdownMenuGroup>{plain.map(item)}</DropdownMenuGroup> : null}
        {plain.length > 0 && danger.length > 0 ? <DropdownMenuSeparator /> : null}
        {danger.length > 0 ? <DropdownMenuGroup>{danger.map(item)}</DropdownMenuGroup> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The buttons at the end of a row, by the row option: «…» only, Edit plus «…», or none (the record holds them). */
function RowButtons({
  choice,
  row,
  onPick,
  openMenu,
}: {
  choice: Choice;
  row: SampleRow;
  onPick: (row: SampleRow, action: RowAction) => void;
  openMenu: boolean;
}) {
  if (choice.row === "R3") return null;
  const actions = rowActions(choice, row);
  const [edit, ...rest] = actions;
  const inMenu = choice.row === "R2" ? rest : actions;
  return (
    <div className="flex items-center justify-end gap-1">
      {choice.row === "R2" && edit && edit.seen.kind !== "hide" ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`${edit.text} — ${row.title}`}
          disabled={edit.seen.kind === "dim"}
          title={edit.seen.kind === "dim" ? edit.seen.reason : undefined}
          onClick={() => onPick(row, edit)}
        >
          <PencilIcon aria-hidden />
        </Button>
      ) : null}
      <MoreMenu
        actions={inMenu}
        title={row.title}
        defaultOpen={openMenu}
        onPick={(a) => onPick(row, a)}
      />
    </div>
  );
}

function ConfirmRemove({
  choice,
  target,
  onClose,
  onDone,
}: {
  choice: Choice;
  target: { row: SampleRow; action: RowAction } | null;
  onClose: () => void;
  onDone: (text: string) => void;
}) {
  const [reason, setReason] = useState<"withdraw" | "mistake">("withdraw");
  if (!target) return null;
  const what = `${target.action.text} ${target.row.title}`;
  const unit = label("Unit").toLocaleLowerCase("vi");
  let title: string;
  let body: ReactNode;
  let verb = target.action.text;
  if (choice.confirm === "X2" && choice.screen === "listings") {
    title = C.confirm.reasonTitle(`${unit} ${target.row.title}`);
    verb = reason === "withdraw" ? C.actions.withdraw : C.actions.removeMistake;
    body = (
      <fieldset className="grid gap-2">
        <legend className="text-muted-foreground mb-2 text-sm">{C.confirm.reasonWhy}</legend>
        <div className="flex flex-wrap gap-2">
          {(["withdraw", "mistake"] as const).map((key) => (
            <Button
              key={key}
              variant={reason === key ? "default" : "outline"}
              aria-pressed={reason === key}
              onClick={() => setReason(key)}
            >
              {key === "withdraw" ? C.confirm.reasonWithdrawShort : C.confirm.reasonMistakeShort}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          {reason === "withdraw" ? C.confirm.reasonWithdraw : C.confirm.reasonMistake}
        </p>
      </fieldset>
    );
  } else if (choice.confirm === "X3") {
    title = C.confirm.consequencesTitle(what);
    body = (
      <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
        {C.confirm.consequences.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    );
  } else {
    title = C.confirm.shortTitle(what);
    body = null;
  }
  return (
    <Dialog open onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent showCloseButton={false} role="alertdialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{C.confirm.shortWhy}</DialogDescription>
        </DialogHeader>
        {body}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>{C.cancel}</DialogClose>
          <Button variant="destructive" onClick={() => onDone(verb)}>
            {verb}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ButtonShowcase({ initial, bare = false }: { initial: Choice; bare?: boolean }) {
  const [choice, setChoice] = useState<Choice>(initial);
  const [query, setQuery] = useState("");
  const [record, setRecord] = useState<SampleRow | null>(null);
  const [removing, setRemoving] = useState<{ row: SampleRow; action: RowAction } | null>(null);
  const [refuseNext, setRefuseNext] = useState(false);
  const wide = useWide();
  const set = (patch: Partial<Choice>) => setChoice((c) => ({ ...c, ...patch, open: undefined }));

  const rows = useMemo(() => sample(choice.screen), [choice.screen]);
  const shown = rows.filter((r) =>
    `${r.title} ${r.detail}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")),
  );
  const listings = choice.screen === "listings";
  const canView =
    allowedScope(
      [choice.role],
      (listings ? "viewListings" : "viewContacts") as ActionName,
      DRAFT_ACTIONS,
    ) !== null;
  const canAdd =
    allowedScope(
      [choice.role],
      (listings ? "createListing" : "createContact") as ActionName,
      DRAFT_ACTIONS,
    ) !== null;
  const screenTitle = listings ? label("Listing") : label("Contact");

  const refuse = (): boolean => {
    if (!refuseNext) return false;
    setRefuseNext(false);
    toast.error(C.refused.title, { description: C.refused.detail });
    return true;
  };
  const pick = (row: SampleRow, action: RowAction) => {
    if (refuse()) return;
    if (action.danger) setRemoving({ row, action });
    else toast(C.done(action.text));
  };
  const add = () => {
    if (refuse()) return;
    toast(C.done(listings ? C.actions.addUnit : C.actions.addContact));
  };

  const addButton = canAdd ? (
    <Button onClick={add} data-action={listings ? "createListing" : "createContact"}>
      <PlusIcon aria-hidden data-icon="inline-start" />
      {listings ? C.actions.addUnit : C.actions.addContact}
    </Button>
  ) : null;

  const search = (
    <div className="w-full sm:w-64">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          aria-label={C.search}
          placeholder={C.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
    </div>
  );
  const count = <span className="text-muted-foreground text-xs">{C.rows(shown.length)}</span>;

  const openFirstMenu = choice.open === "menu";
  const table = (
    <>
      {wide ? (
        <div>
          <SampleGrid
            rows={shown}
            headers={[
              listings ? label("Unit") : label("Contact"),
              listings ? C.columns.price : C.columns.phone,
              listings ? C.columns.keeper : C.columns.creator,
            ]}
            onOpen={(id) => setRecord(shown.find((r) => r.id === id) ?? null)}
            buttonsLabel={C.more}
            buttons={(row, i) => (
              <RowButtons
                choice={choice}
                row={row as SampleRow}
                onPick={pick}
                openMenu={openFirstMenu && i === 1}
              />
            )}
          />
        </div>
      ) : (
        <ul className="divide-y">
          {shown.map((row, i) => (
            <li key={row.id} className="flex items-center gap-2 py-2">
              <div className="min-w-0 flex-1">
                <Button variant="link" size="sm" onClick={() => setRecord(row)}>
                  {row.title}
                </Button>
                <span className="text-muted-foreground block px-2.5 text-xs">
                  {row.detail} · {row.extra}
                </span>
              </div>
              <RowButtons
                choice={choice}
                row={row}
                onPick={pick}
                openMenu={openFirstMenu && i === 1}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );

  let region: ReactNode;
  if (!canView) {
    region = (
      <Frame>
        <FrameHeader>
          <h2 className="text-sm font-semibold">{screenTitle}</h2>
        </FrameHeader>
        <FramePanel>
          <RegionForbidden />
        </FramePanel>
      </Frame>
    );
  } else if (choice.toolbar === "A") {
    region = (
      <Frame>
        <FrameHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">{screenTitle}</h2>
            {count}
          </div>
          {addButton}
        </FrameHeader>
        <FramePanel className="grid gap-3">
          {search}
          {table}
        </FramePanel>
      </Frame>
    );
  } else if (choice.toolbar === "B") {
    region = (
      <Frame>
        <FramePanel className="grid gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {search}
            {count}
            <div className="ml-auto">{addButton}</div>
          </div>
          {table}
        </FramePanel>
      </Frame>
    );
  } else {
    region = (
      <Frame>
        <FrameHeader>
          <h2 className="text-sm font-semibold">{screenTitle}</h2>
        </FrameHeader>
        <FramePanel className="grid gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {search}
            {count}
          </div>
          {table}
        </FramePanel>
      </Frame>
    );
  }

  const recordActions = record ? rowActions(choice, record) : [];
  const recordEdit = recordActions[0];
  return (
    <div className="grid gap-6">
      {bare ? null : <Controls choice={choice} set={set} onRefuse={() => setRefuseNext(true)} />}
      <PageHeader
        title={`${screenTitle} · ${label(choice.role)}`}
        action={choice.toolbar === "C" && canView ? (addButton ?? undefined) : undefined}
      />
      {region}
      <Sheet open={record !== null} onOpenChange={(open) => (open ? null : setRecord(null))}>
        <SheetContent>
          <SheetHeader>
            <div>
              <SheetTitle>{record?.title}</SheetTitle>
              <SheetDescription>
                {C.record} · {record?.detail} · {record?.extra}
              </SheetDescription>
            </div>
            {record ? (
              <div className="flex items-center gap-1">
                {recordEdit && recordEdit.seen.kind !== "hide" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={recordEdit.seen.kind === "dim"}
                    onClick={() => pick(record, recordEdit)}
                  >
                    {recordEdit.text}
                  </Button>
                ) : null}
                <MoreMenu
                  actions={recordActions.slice(1)}
                  title={record.title}
                  onPick={(a) => pick(record, a)}
                />
              </div>
            ) : null}
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ConfirmRemove
        key={removing?.row.id ?? "none"}
        choice={choice}
        target={removing}
        onClose={() => setRemoving(null)}
        onDone={(verb) => {
          setRemoving(null);
          toast(C.done(verb));
        }}
      />
      {choice.open === "remove" && !removing ? (
        <AutoOpenRemove choice={choice} rows={shown} onOpen={setRemoving} />
      ) : null}
      {choice.open === "record" && !record ? <AutoOpen rows={shown} onOpen={setRecord} /> : null}
      {choice.open === "refused" ? <AutoRefuse /> : null}
    </div>
  );
}

/** For screenshots: opens the second record once (?mo=record). */
function AutoOpen({ rows, onOpen }: { rows: SampleRow[]; onOpen: (row: SampleRow) => void }) {
  useState(() => {
    if (rows[0]) queueMicrotask(() => onOpen(rows[0]!));
    return null;
  });
  return null;
}

/** For screenshots: opens the removing dialog of the first own record once (?mo=remove). */
function AutoOpenRemove({
  choice,
  rows,
  onOpen,
}: {
  choice: Choice;
  rows: SampleRow[];
  onOpen: (target: { row: SampleRow; action: RowAction }) => void;
}) {
  useState(() => {
    const row = rows.find((r) => r.mine);
    const action = row
      ? rowActions(choice, row).find((a) => a.danger && a.seen.kind === "show")
      : undefined;
    if (row && action) queueMicrotask(() => onOpen({ row, action }));
    return null;
  });
  return null;
}

/** For screenshots: shows the refusal notice once (?mo=refused). */
function AutoRefuse() {
  useEffect(() => {
    const id = setTimeout(
      () => toast.error(C.refused.title, { description: C.refused.detail }),
      300,
    );
    return () => clearTimeout(id);
  }, []);
  return null;
}

/** True from the sm breakpoint up (640px): the grid there, the card list below it. */
function useWide(): boolean {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}
