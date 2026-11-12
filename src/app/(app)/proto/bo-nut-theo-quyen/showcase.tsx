"use client";

import { EllipsisIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { typedColumn } from "@/components/candidate/column-kind";
import { DataRegion } from "@/components/candidate/data-region";
import { useChange } from "@/components/candidate/use-change";
import { Frame, FrameHeader, FramePanel } from "@/components/reui/frame";
import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { label } from "@/modules/company-config";
import { allowedScope, type ActionName } from "@/modules/identity";
import type { Role } from "@/generated/ontology";

import { PROTO_COPY as C } from "./copy";
import { DRAFT_ACTIONS, type DraftAction } from "./draft-permissions";
import { SampleGrid } from "./sample-grid";

/**
 * The button set the owner chose at the scope gate of row 9e: the add button in the page head, one «…» at the end of a
 * row, plain verbs, actions on someone else's record hidden, a short confirmation through the store's useChange.
 */
export type Choice = {
  screen: "listings" | "contacts";
  role: Role;
  open?: "menu" | "remove" | "refused";
};

const ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];

/** A row of the sample: a code, a second line, and whether the viewer keeps or created it (own scope). */
type SampleRow = { id: string; title: string; detail: string; extra: string; mine: boolean };

/** Made-up units and contacts: codes, placeholder names and reserved test numbers only. */
function sample(screen: Choice["screen"]): SampleRow[] {
  return Array.from({ length: 8 }, (_, i) => {
    const mine = i % 3 !== 1;
    const other = `[Tên] ${String(i + 2).padStart(2, "0")}`;
    if (screen === "listings") {
      const building = `S${(i % 3) + 1}.0${(i % 4) + 1}`;
      return {
        id: `can-${i + 1}`,
        title: `${building}-${String(12 + i).padStart(2, "0")}0${(i % 8) + 1}`,
        detail: `${(2.1 + i * 0.35).toFixed(2).replace(".", ",")} tỷ`,
        extra: mine ? C.me : other,
        mine,
      };
    }
    return {
      id: `lh-${i + 1}`,
      title: `[Tên] ${String(i + 1).padStart(2, "0")}`,
      detail: `0900 000 0${String(i + 1).padStart(2, "0")}`,
      extra: mine ? C.me : other,
      mine,
    };
  });
}

const can = (role: Role, action: DraftAction) =>
  allowedScope([role], action as ActionName, DRAFT_ACTIONS);

/** Shown when the role has the action for the whole company, or for its own records and this one is its own. */
function shows(role: Role, action: DraftAction, mine: boolean): boolean {
  const scope = can(role, action);
  return scope === "company" || (scope === "own" && mine);
}

type RowAction = { key: DraftAction; text: string; danger: boolean; what: string };

function rowActions(choice: Choice, row: SampleRow): RowAction[] {
  const listings = choice.screen === "listings";
  const all: RowAction[] = listings
    ? [
        { key: "updateListing", text: label("Edit"), danger: false, what: "" },
        { key: "removeListing", text: label("RemoveListing"), danger: true, what: C.removeWhat },
      ]
    : [
        { key: "updateContact", text: label("Edit"), danger: false, what: "" },
        { key: "mergeContacts", text: label("MergeContacts"), danger: false, what: "" },
        { key: "removeContact", text: label("RemoveContact"), danger: true, what: C.removeWhat },
        {
          key: "eraseContactPersonalData",
          text: label("EraseContactPersonalData"),
          danger: true,
          what: C.eraseWhat,
        },
      ];
  return all.filter((a) => shows(choice.role, a.key, row.mine));
}

/** The «…» of one record: ordinary actions first, removing ones last and apart; nothing to do, no «…». */
function MoreMenu({
  actions,
  title,
  onPick,
  defaultOpen,
}: {
  actions: RowAction[];
  title: string;
  onPick: (action: RowAction) => void;
  defaultOpen?: boolean;
}) {
  if (actions.length === 0) return null;
  const plain = actions.filter((a) => !a.danger);
  const danger = actions.filter((a) => a.danger);
  const item = (a: RowAction) => (
    <DropdownMenuItem
      key={a.key}
      variant={a.danger ? "destructive" : "default"}
      onClick={() => onPick(a)}
    >
      {a.text}
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

function Controls({
  choice,
  set,
  onRefuse,
}: {
  choice: Choice;
  set: (patch: Partial<Choice>) => void;
  onRefuse: () => void;
}) {
  const option = (pressed: boolean, text: string, onClick: () => void) => (
    <Button
      key={text}
      size="sm"
      variant={pressed ? "default" : "outline"}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {text}
    </Button>
  );
  return (
    <Frame data-proto-controls>
      <FrameHeader>
        <h2 className="text-sm font-semibold">{C.controls.heading}</h2>
        <p className="text-muted-foreground text-xs">{C.controls.note}</p>
      </FrameHeader>
      <FramePanel className="grid gap-4 md:grid-cols-3">
        <div role="group" aria-label={C.controls.screen} className="flex flex-wrap gap-1">
          {option(choice.screen === "listings", label("Inventory"), () =>
            set({ screen: "listings" }),
          )}
          {option(choice.screen === "contacts", label("Contact"), () =>
            set({ screen: "contacts" }),
          )}
        </div>
        <div role="group" aria-label={C.controls.role} className="flex flex-wrap gap-1">
          {ROLES.map((r) => option(choice.role === r, label(r), () => set({ role: r })))}
        </div>
        <div>
          <Button size="sm" variant="outline" onClick={onRefuse}>
            {C.controls.refuse}
          </Button>
        </div>
      </FramePanel>
    </Frame>
  );
}

export function ButtonShowcase({ initial, bare = false }: { initial: Choice; bare?: boolean }) {
  const [choice, setChoice] = useState<Choice>(initial);
  const [query, setQuery] = useState("");
  const [refuseNext, setRefuseNext] = useState(false);
  const opened = useRef(false);
  const { run, dialog } = useChange();
  const wide = useWide();
  const set = (patch: Partial<Choice>) => setChoice((c) => ({ ...c, ...patch, open: undefined }));

  const listings = choice.screen === "listings";
  const noun = listings ? label("Unit") : label("Contact");
  const screenTitle = listings ? label("Inventory") : label("Contact");
  const rows = useMemo(() => sample(choice.screen), [choice.screen]);
  const shown = rows.filter((r) =>
    `${r.title} ${r.detail}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")),
  );
  const canView = can(choice.role, listings ? "viewListings" : "viewContacts") !== null;
  const canAdd = can(choice.role, listings ? "createListing" : "createContact") !== null;

  const refused = (): boolean => {
    if (!refuseNext) return false;
    setRefuseNext(false);
    notifyResult({ message: C.refused });
    return true;
  };
  const pick = (row: SampleRow, action: RowAction) => {
    if (refused()) return;
    if (!action.danger) {
      notifyResult({ message: C.done(action.text) });
      return;
    }
    void run({
      verb: `${action.text} ${row.title}`,
      what: action.what,
      done: C.done(action.text),
      reversible: false,
      apply: async () => {},
    });
  };

  // Screenshot helpers: open the first own record's removing confirmation, or show the refusal notice, once.
  useEffect(() => {
    if (opened.current || !choice.open || choice.open === "menu") return;
    opened.current = true;
    if (choice.open === "refused") {
      setTimeout(() => notifyResult({ message: C.refused }), 300);
      return;
    }
    const row = rows.find((r) => r.mine);
    const action = row ? rowActions(choice, row).find((a) => a.danger) : undefined;
    if (row && action) setTimeout(() => pick(row, action), 0);
  });

  const addText = listings ? label("CreateListing") : label("CreateContact");
  const addButton = canAdd ? (
    <Button onClick={() => (refused() ? null : notifyResult({ message: C.done(addText) }))}>
      <PlusIcon aria-hidden data-icon="inline-start" />
      {addText}
    </Button>
  ) : undefined;

  const buttons = (row: SampleRow, i: number) => (
    <div className="flex justify-end">
      <MoreMenu
        actions={rowActions(choice, row)}
        title={row.title}
        onPick={(a) => pick(row, a)}
        defaultOpen={choice.open === "menu" && i === 1}
      />
    </div>
  );

  const region = !canView ? (
    <DataRegion
      title={screenTitle}
      columns={[typedColumn({ field: "Listing.unitNumber", header: noun })]}
      rows={[]}
      status="forbidden"
    />
  ) : (
    <Frame>
      <FrameHeader>
        <h2 className="text-sm font-semibold">{screenTitle}</h2>
      </FrameHeader>
      <FramePanel className="grid gap-3">
        <div className="flex flex-wrap items-center gap-3">
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
          <span className="text-muted-foreground text-xs">{C.rows(shown.length)}</span>
        </div>
        {wide ? (
          <SampleGrid
            rows={shown}
            headers={[
              noun,
              listings ? label("ListPrice") : C.phone,
              listings ? label("OwnerMember") : C.creator,
            ]}
            onOpen={() => undefined}
            buttonsLabel={C.more}
            buttons={(row, i) => buttons(row as SampleRow, i)}
          />
        ) : (
          <ul className="divide-y">
            {shown.map((row, i) => (
              <li key={row.id} className="flex items-center gap-2 py-2">
                <div className="min-w-0 flex-1 px-2.5">
                  <span className="block truncate text-sm font-medium">{row.title}</span>
                  <span className="text-muted-foreground block text-xs">
                    {row.detail} · {row.extra}
                  </span>
                </div>
                {buttons(row, i)}
              </li>
            ))}
          </ul>
        )}
      </FramePanel>
    </Frame>
  );

  return (
    <div className="grid gap-6">
      {bare ? null : <Controls choice={choice} set={set} onRefuse={() => setRefuseNext(true)} />}
      <PageHeader
        title={`${screenTitle} · ${label(choice.role)}`}
        action={canView ? addButton : undefined}
      />
      {region}
      {dialog}
    </div>
  );
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
