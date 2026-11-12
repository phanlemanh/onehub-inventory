"use client";

import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { typedColumn } from "@/components/candidate/column-kind";
import { DataRegion, type GridRow, type RegionRecord } from "@/components/candidate/data-region";
import { RecordActions, type RecordAction } from "@/components/candidate/row-actions";
import { Frame, FrameHeader, FramePanel } from "@/components/reui/frame";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import { label } from "@/modules/company-config";
import { allowedScope } from "@/modules/identity";
import { PermittedAction, SessionRoles } from "@/modules/identity/ui";
import type { Role } from "@/generated/ontology";

import { PROTO_COPY as C } from "./copy";

/**
 * The template sample of row 9e (bo-nut-theo-quyen): the button set the owner chose at the scope gate, built from the
 * real parts — the add button in the page head through PermittedAction, one «…» per row in the shared grid's last
 * column, the record's actions at the head of the record panel, removing actions confirmed through useChange — and
 * decided by the real permission table (ontology/actions.yaml) for the role chosen on the control board.
 */
export type Choice = {
  screen: "listings" | "contacts";
  role: Role;
  open?: "menu" | "remove" | "refused";
};

const ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];

/** Made-up units and contacts: codes, placeholder names and reserved test numbers only. Row ids say whose they are. */
function sample(screen: Choice["screen"]): GridRow[] {
  return Array.from({ length: 8 }, (_, i) => {
    const mine = i % 3 !== 1;
    const keeper = mine ? C.me : `[Tên] ${String(i + 2).padStart(2, "0")}`;
    if (screen === "listings") {
      const building = `S${(i % 3) + 1}.0${(i % 4) + 1}`;
      return {
        id: `${mine ? "cua-toi" : "nguoi-khac"}-can-${i + 1}`,
        "Listing.unitNumber": `${building}-${String(12 + i).padStart(2, "0")}0${(i % 8) + 1}`,
        "Listing.listPrice": 2_100_000_000 + i * 350_000_000,
        // The sample's keeper, in a text column (the grid has no keeper field yet).
        "Listing.subdivisionName": keeper,
      };
    }
    return {
      id: `${mine ? "cua-toi" : "nguoi-khac"}-lh-${i + 1}`,
      "Contact.fullName": `[Tên] ${String(i + 1).padStart(2, "0")}`,
      "Contact.phones": `0900 000 0${String(i + 1).padStart(2, "0")}`,
      // The sample's creator, in a text column (contacts have no creator field yet).
      "Listing.subdivisionName": keeper,
    };
  });
}

const isMine = (row: GridRow) => row.id.startsWith("cua-toi");
const titleOf = (row: GridRow) => String(row["Listing.unitNumber"] ?? row["Contact.fullName"]);

/** The actions of one record of the sample, by permission-table name; the menu keeps the ones the role may run. */
function recordActions(screen: Choice["screen"], row: GridRow): RecordAction[] {
  const title = titleOf(row);
  const done = (verb: string) => () => notifyResult({ message: C.done(verb) });
  const remove = (verb: string, what: string) => ({
    verb: `${verb} ${title}`,
    what,
    done: C.done(verb),
    apply: async () => {},
  });
  if (screen === "listings")
    return [
      { action: "updateListing", label: label("Edit"), onSelect: done(label("Edit")) },
      {
        action: "removeListing",
        label: label("RemoveListing"),
        remove: remove(label("RemoveListing"), C.removeWhat),
      },
    ];
  return [
    { action: "updateContact", label: label("Edit"), onSelect: done(label("Edit")) },
    {
      action: "mergeContacts",
      label: C.mergeWith(label("Contact")),
      onSelect: done(label("MergeContacts")),
    },
    {
      action: "removeContact",
      label: label("RemoveContact"),
      remove: remove(label("RemoveContact"), C.removeWhat),
    },
    {
      action: "eraseContactPersonalData",
      label: C.eraseOnRequest(label("EraseContactPersonalData")),
      remove: remove(label("EraseContactPersonalData"), C.eraseWhat),
    },
  ];
}

function Controls({ choice, set }: { choice: Choice; set: (patch: Partial<Choice>) => void }) {
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
      <FramePanel className="grid gap-4 md:grid-cols-2">
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
      </FramePanel>
    </Frame>
  );
}

export function ButtonShowcase({ initial, bare = false }: { initial: Choice; bare?: boolean }) {
  const [choice, setChoice] = useState<Choice>(initial);
  const set = (patch: Partial<Choice>) => setChoice((c) => ({ ...c, ...patch, open: undefined }));
  return (
    <div className="grid gap-6">
      {bare ? null : <Controls choice={choice} set={set} />}
      {/* The sample stands in for a session holding the chosen role: the real rule, a chosen set of roles. */}
      <SessionRoles roles={[choice.role]}>
        <Sample key={`${choice.screen}-${choice.role}`} choice={choice} />
      </SessionRoles>
    </div>
  );
}

function Sample({ choice }: { choice: Choice }) {
  const listings = choice.screen === "listings";
  const noun = listings ? label("Unit") : label("Contact");
  const screenTitle = listings ? label("Inventory") : label("Contact");
  const rows = useMemo(() => sample(choice.screen), [choice.screen]);
  const roles = [choice.role];
  const canView =
    (listings ? allowedScope(roles, "viewListings") : allowedScope(roles, "viewContacts")) !== null;
  const addText = listings ? label("CreateListing") : label("CreateContact");
  const opened = useRef(false);

  const columns = listings
    ? [
        typedColumn({ field: "Listing.unitNumber", header: noun }),
        typedColumn({ field: "Listing.listPrice", header: label("ListPrice") }),
        typedColumn({ field: "Listing.subdivisionName", header: label("OwnerMember") }),
      ]
    : [
        typedColumn({ field: "Contact.fullName", header: noun }),
        typedColumn({ field: "Contact.phones", header: C.phone }),
        typedColumn({ field: "Listing.subdivisionName", header: C.creator }),
      ];

  const record: RegionRecord = {
    render: (row) => ({
      title: titleOf(row),
      body: <p className="text-muted-foreground">{C.recordNote}</p>,
      actions: (
        <RecordActions
          main={{
            action: listings ? "updateListing" : "updateContact",
            label: label("Edit"),
            onSelect: () => notifyResult({ message: C.done(label("Edit")) }),
          }}
          actions={recordActions(choice.screen, row).slice(1)}
          mine={isMine(row)}
          title={titleOf(row)}
        />
      ),
    }),
  };

  // Screenshot helpers: open the second row's «…», the first own row's removing confirmation, or the refusal notice.
  useEffect(() => {
    if (opened.current || !choice.open) return;
    opened.current = true;
    if (choice.open === "refused") {
      setTimeout(() => notifyResult({ message: FRAME_COPY.refusedAction }), 300);
      return;
    }
    // The grid draws its rows after it measures the page: wait until the row's «…» is there.
    const id = choice.open === "menu" ? rows[1]?.id : rows.find(isMine)?.id;
    const press = (selector: string, then?: () => void, tries = 40) => {
      const el = document.querySelector<HTMLElement>(selector);
      // Once there, a beat more: the grid takes focus when it settles, which would close a menu opened before.
      if (el)
        setTimeout(() => {
          el.click();
          then?.();
        }, 600);
      else if (tries > 0) setTimeout(() => press(selector, then, tries - 1), 150);
    };
    press(`[data-row-actions-for="${id}"] [data-slot="row-actions"]`, () => {
      if (choice.open === "remove") press('[role="menuitem"][data-variant="destructive"]');
    });
  });

  const add = (
    <Button onClick={() => notifyResult({ message: C.done(addText) })}>
      <PlusIcon aria-hidden data-icon="inline-start" />
      {addText}
    </Button>
  );
  const addButton = listings ? (
    <PermittedAction action="createListing">{add}</PermittedAction>
  ) : (
    <PermittedAction action="createContact">{add}</PermittedAction>
  );

  return (
    <>
      <PageHeader
        title={`${screenTitle} · ${label(choice.role)}`}
        action={canView ? addButton : undefined}
      />
      <DataRegion
        title={screenTitle}
        columns={columns}
        rows={canView ? rows : []}
        status={canView ? "ready" : "forbidden"}
        headAction={canView ? addButton : undefined}
        rowActions={(row) => ({ actions: recordActions(choice.screen, row), mine: isMine(row) })}
        record={record}
      />
    </>
  );
}
