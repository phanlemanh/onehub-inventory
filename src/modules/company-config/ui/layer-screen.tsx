"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import { customColumn, typedColumn, type TypedColumn } from "@/components/candidate/column-kind";
import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import type { RecordAction } from "@/components/candidate/row-actions";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import type { ConceptCode } from "@/generated/labels";
import { PermittedAction } from "@/modules/identity/ui";

import { label } from "../index";
import { STANDARD_VALUE_SETS, type FieldKind } from "../rules";
import type { CompanyLayer, LayerPart } from "../store";

import { LAYER_COPY as C, PART_TITLE, type ForcedState, type ShownPart } from "./copy";
import {
  AliasDialog,
  FieldDialog,
  LabelDialog,
  LAYER_API,
  RenameDialog,
  send,
  type SpellingField,
} from "./layer-dialogs";

/** The part of the URL (`?phan=`) for each part of the layer, and the API's name for it. */
const API_PART: Record<ShownPart, LayerPart> = {
  nhan: "labels",
  truong: "fields",
  "tu-dien": "aliases",
  "can-cho": "pending-units",
  mau: "templates",
};

/** Names of the standard fields a spelling can stand for, from the label table. */
const STANDARD_FIELD_NAME: Record<string, ConceptCode> = {
  "Listing.standardStatus": "StandardStatus",
  "Listing.withdrawnReason": "WithdrawnReason",
  "Unit.directionFaces": "DirectionFaces",
};

const fieldName = (field: string, layer: CompanyLayer): string => {
  const standard = STANDARD_FIELD_NAME[field];
  if (standard) return label(standard);
  return layer.fields.find((f) => f.code === field)?.name ?? field;
};

/** How a standard value reads: a status or a withdrawn reason by its label, a direction as written. */
const WITHDRAWN_TEXT: Record<string, ConceptCode> = {
  sold_elsewhere: "WithdrawnSoldElsewhere",
  owner_changed_mind: "WithdrawnOwnerChangedMind",
  unreachable: "WithdrawnUnreachable",
};
export function valueText(field: string, value: string): string {
  if (field === "Listing.standardStatus") return label(`Status${value}` as ConceptCode);
  const reason = field === "Listing.withdrawnReason" ? WITHDRAWN_TEXT[value] : undefined;
  return reason ? label(reason) : value;
}

/** The fields a spelling may stand for: the standard closed sets, then the company's single choice fields. */
function spellingFields(layer: CompanyLayer): SpellingField[] {
  return [
    ...Object.entries(STANDARD_VALUE_SETS).map(([field, values]) => ({
      field,
      name: fieldName(field, layer),
      values: values.map((v) => ({ value: v, text: valueText(field, v) })),
    })),
    ...layer.fields
      .filter((f) => f.kind === "single_select")
      .map((f) => ({
        field: f.code,
        name: f.name,
        values: f.options.map((o) => ({ value: o, text: o })),
      })),
  ];
}

/** Columns and rows of one part, in the words of the screen. */
function partGrid(
  part: ShownPart,
  layer: CompanyLayer,
): { columns: TypedColumn[]; rows: GridRow[] } {
  switch (part) {
    case "nhan":
      return {
        columns: [
          typedColumn({ field: "CompanyLabel.concept", header: C.col.concept }),
          typedColumn({ field: "CompanyLabel.label", header: C.col.own }),
        ],
        rows: layer.labels.map((l) => ({
          id: l.id,
          "CompanyLabel.concept": label(l.concept as ConceptCode),
          "CompanyLabel.label": l.label,
        })),
      };
    case "truong":
      return {
        columns: [
          typedColumn({ field: "CustomField.name", header: C.col.name }),
          typedColumn({ field: "CustomField.kind", header: C.col.kind }),
          customColumn({ code: "options", header: C.col.options, kind: "text" }),
        ],
        rows: layer.fields.map((f) => ({
          id: f.code,
          "CustomField.name": f.name,
          "CustomField.kind": C.kinds[f.kind],
          "custom.options": f.options.join(", ") || null,
        })),
      };
    case "tu-dien":
      return {
        columns: [
          typedColumn({ field: "CompanyValueAlias.field", header: C.col.field }),
          typedColumn({ field: "CompanyValueAlias.raw", header: C.col.raw }),
          typedColumn({ field: "CompanyValueAlias.value", header: C.col.value }),
        ],
        rows: layer.aliases.map((a) => ({
          id: a.id,
          "CompanyValueAlias.field": fieldName(a.field, layer),
          "CompanyValueAlias.raw": a.raw,
          "CompanyValueAlias.value": valueText(a.field, a.value),
        })),
      };
    case "can-cho":
      return {
        columns: [
          typedColumn({ field: "PendingUnit.rawCode", header: C.col.code }),
          customColumn({ code: "state", header: C.col.state, kind: "text" }),
        ],
        rows: layer.pendingUnits.map((p) => ({
          id: p.id,
          "PendingUnit.rawCode": p.rawCode,
          "custom.state": p.matchedAt ? C.matchedState : C.waiting,
        })),
      };
    case "mau":
      return {
        columns: [
          typedColumn({ field: "ImportTemplate.name", header: C.col.template }),
          customColumn({ code: "columns", header: C.col.columns, kind: "count" }),
        ],
        rows: layer.templates.map((t) => ({
          id: t.id,
          "ImportTemplate.name": t.name,
          "custom.columns": t.signature.length,
        })),
      };
  }
}

type Load = { kind: "loading" } | { kind: "error" } | { kind: "ready"; layer: CompanyLayer };

/** An edit dialog opened from a row's «…»: which part, which row. */
type Editing = { part: ShownPart; id: string } | null;

/**
 * The company layer screen (row 7e, shape A): the screen's title heads the page, and the part chosen in the App Shell's second column fills the content
 * area as one grid, with its add button at the head and «…» at the end of each row, each through the permission
 * table (row 9e). Nothing is deleted: retiring stops using a row and keeps its history.
 */
export function CompanyLayerScreen({
  part,
  concepts,
  forced: forcedAtOpen,
}: {
  part: ShownPart;
  /** The concepts a company may give its own words. */
  concepts: readonly string[];
  /** A region state a development build opens with `?state=`, as the inventory does; never set in production. */
  forced?: ForcedState | undefined;
}) {
  const [load, setLoad] = useState<Load>({ kind: "loading" });
  // «Thử lại» and «Tải lại» drop a forced state, as the inventory does: the next read is a real one.
  const [forced, setForced] = useState<ForcedState | undefined>(forcedAtOpen);
  const [tick, setTick] = useState(0);
  const [editing, setEditing] = useState<Editing>(null);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    // A forced loading state stays loading: nothing is read.
    if (forced === "loading") return;
    let alive = true;
    fetch(LAYER_API, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as CompanyLayer;
      })
      .then(
        (layer) => alive && setLoad({ kind: "ready", layer }),
        () => alive && setLoad({ kind: "error" }),
      );
    return () => {
      alive = false;
    };
  }, [tick, forced]);

  const done = (message: string) => {
    notifyResult({ message });
    reload();
  };
  const title = label(PART_TITLE[part]);
  const screenTitle = label("CompanyLayer");
  const layer = load.kind === "ready" ? load.layer : null;

  const head = headButton(part, layer, concepts, done);
  const loaded: RegionStatus =
    load.kind === "loading" ? "loading" : load.kind === "error" ? "error" : "ready";
  const status: RegionStatus =
    forced === "loading" || forced === "error" || forced === "forbidden" || forced === "partial"
      ? forced
      : forced === "empty"
        ? "ready"
        : loaded;
  const full = layer ? partGrid(part, layer) : { columns: partGrid(part, EMPTY).columns, rows: [] };
  const grid =
    forced === "empty"
      ? { ...full, rows: [] }
      : forced === "partial"
        ? { ...full, rows: full.rows.slice(0, Math.ceil(full.rows.length / 2)) }
        : full;

  const rowActions = (row: GridRow): RecordAction[] => {
    const name = rowName(part, row);
    const edit: RecordAction[] =
      part === "can-cho"
        ? []
        : [
            {
              action: "editCompanyLayer",
              label: part === "mau" ? label("RenameTemplate") : label("Edit"),
              onSelect: () => setEditing({ part, id: row.id }),
            },
          ];
    return [
      ...edit,
      {
        action: "retireCompanyLayer",
        label: label("RetireItem"),
        remove: {
          verb: `${label("RetireItem")} ${name}`,
          what: C.retireWhat,
          done: C.retired(name),
          apply: async () => {
            const r = await send(`${API_PART[part]}/${encodeURIComponent(row.id)}/retire`, "POST");
            reload();
            if (!r.ok) throw new Error(r.errors["form"] ?? C.failed);
          },
        },
      },
    ];
  };

  return (
    <div className="flex flex-col gap-4" data-part={part} data-state={load.kind}>
      <PageHeader title={screenTitle} action={head} />
      <p className="text-sm text-muted-foreground">{C.partWhy[part]}</p>
      <DataRegion
        title={title}
        columns={grid.columns}
        rows={grid.rows}
        status={status}
        onRetry={() => {
          setForced(undefined);
          setLoad({ kind: "loading" });
          reload();
        }}
        emptyAction={
          <Button
            variant="outline"
            onClick={() => {
              setForced(undefined);
              reload();
            }}
          >
            {C.reload}
          </Button>
        }
        emptyWhy={C.empty[part]}
        headAction={head}
        rowActions={(row) => ({ actions: rowActions(row), mine: true })}
      />
      {layer && editing ? editDialog(editing, layer, concepts, setEditing, done) : null}
    </div>
  );
}

const EMPTY: CompanyLayer = {
  labels: [],
  fields: [],
  aliases: [],
  pendingUnits: [],
  templates: [],
};

function rowName(part: ShownPart, row: GridRow): string {
  const key = {
    nhan: "CompanyLabel.label",
    truong: "CustomField.name",
    "tu-dien": "CompanyValueAlias.raw",
    "can-cho": "PendingUnit.rawCode",
    mau: "ImportTemplate.name",
  }[part] as keyof GridRow;
  return String(row[key] ?? "");
}

/** The button at the head of a part, from the button table of the row: add, or match on pending units; none on templates. */
function headButton(
  part: ShownPart,
  layer: CompanyLayer | null,
  concepts: readonly string[],
  done: (message: string) => void,
): ReactNode {
  switch (part) {
    case "nhan":
      return (
        <PermittedAction action="addCompanyLayer">
          <LabelDialog concepts={concepts} onDone={done} />
        </PermittedAction>
      );
    case "truong":
      return (
        <PermittedAction action="addCompanyLayer">
          <FieldDialog onDone={done} />
        </PermittedAction>
      );
    case "tu-dien":
      return (
        <PermittedAction action="addCompanyLayer">
          <AliasDialog fields={layer ? spellingFields(layer) : []} onDone={done} />
        </PermittedAction>
      );
    case "can-cho":
      return (
        <PermittedAction action="matchPendingUnits">
          <MatchButton done={done} />
        </PermittedAction>
      );
    case "mau":
      return null;
  }
}

function MatchButton({ done }: { done: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const res = await fetch("/api/v1/company-layer/pending-units/match", { method: "POST" });
          if (res.status === 403) notifyResult({ message: FRAME_COPY.refusedAction });
          else if (!res.ok) notifyResult({ message: C.failed });
          else {
            const r = (await res.json()) as { matched: number; waiting: number };
            done(C.matched(r.matched, r.waiting));
          }
        } catch {
          notifyResult({ message: C.failed });
        } finally {
          setBusy(false);
        }
      }}
    >
      {label("MatchPendingUnits")}
    </Button>
  );
}

/** The edit dialog a row's «…» opened. */
function editDialog(
  editing: NonNullable<Editing>,
  layer: CompanyLayer,
  concepts: readonly string[],
  set: (e: Editing) => void,
  done: (message: string) => void,
): ReactNode {
  const close = (open: boolean) => {
    if (!open) set(null);
  };
  const key = `${editing.part}:${editing.id}`;
  switch (editing.part) {
    case "nhan": {
      const l = layer.labels.find((x) => x.id === editing.id);
      return l ? (
        <LabelDialog key={key} concepts={concepts} editing={l} open setOpen={close} onDone={done} />
      ) : null;
    }
    case "truong": {
      const f = layer.fields.find((x) => x.code === editing.id);
      return f ? (
        <FieldDialog
          key={key}
          editing={{ code: f.code, name: f.name, kind: f.kind as FieldKind, options: f.options }}
          open
          setOpen={close}
          onDone={done}
        />
      ) : null;
    }
    case "tu-dien": {
      const a = layer.aliases.find((x) => x.id === editing.id);
      return a ? (
        <AliasDialog
          key={key}
          fields={spellingFields(layer)}
          editing={a}
          open
          setOpen={close}
          onDone={done}
        />
      ) : null;
    }
    case "mau": {
      const t = layer.templates.find((x) => x.id === editing.id);
      return t ? <RenameDialog key={key} editing={t} open setOpen={close} onDone={done} /> : null;
    }
    case "can-cho":
      return null;
  }
}
