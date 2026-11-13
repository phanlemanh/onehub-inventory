"use client";

import { ChevronLeftIcon, ChevronRightIcon, LinkIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FormDialog } from "@/components/candidate/form-dialog";
import { GRID_COPY } from "@/components/candidate/grid-copy";
import type { GridRow } from "@/components/candidate/data-region";
import { Frame, FramePanel } from "@/components/reui/frame";
import { notifyResult } from "@/components/templates/notify";
import { Button, buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  InventoryGrid,
  ListingRecordBody,
  listingView,
  type InventoryField,
} from "@/modules/listings/ui";

import { ENTRY_COPY, PROTO_COPY, SCENES, type Scene } from "./copy";

export interface Words {
  unit: string;
  building: string;
  inventory: string;
  listing: string;
  subdivision: string;
  emptyWhy: string;
}

const BASE = "/proto/loi-vao-ho-so";
const TITLE_CLASS = "min-w-0 flex-1 text-lg font-semibold break-words max-sm:basis-full";
const sceneHref = (scene: Scene, bare: boolean) => `${BASE}?canh=${scene}${bare ? "&bang=an" : ""}`;

/** The link of one listing: the inventory address row 3 already opens (/inventory?ho-so=<id>). */
export function recordHref(row: GridRow): string {
  return `/inventory?ho-so=${encodeURIComponent(row.id)}`;
}

/** Scene «ngan»: the record beside the grid as row 3 shows it, with «Chép đường dẫn» first among the head's buttons. */
function PanelScene({ row, headers }: { row: GridRow; headers: Record<InventoryField, string> }) {
  const view = listingView(row, headers);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(recordHref(row), window.location.origin).toString(),
      );
      notifyResult({ message: ENTRY_COPY.copied });
    } catch {
      notifyResult({ message: ENTRY_COPY.copyFailed });
    }
  };
  return (
    <div className="flex flex-col items-end gap-2">
      <p className="self-start text-sm text-muted-foreground">{PROTO_COPY.recordNote}</p>
      <Frame data-slot="record-panel" className="w-full max-w-lg text-sm shadow-lg">
        <FramePanel className="flex flex-col p-0">
          <div
            data-slot="record-panel-header"
            className="flex flex-wrap items-start gap-2 border-b p-4"
          >
            <h2 className={TITLE_CLASS}>{`${view.unitNumber} · ${row["Listing.buildingName"]}`}</h2>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              {/* On the phone the head holds four buttons only if this one shows its icon alone. */}
              <Button
                variant="outline"
                size="sm"
                aria-label={ENTRY_COPY.copyLink}
                onClick={() => void copy()}
              >
                <LinkIcon aria-hidden="true" />
                <span className="max-sm:sr-only">{ENTRY_COPY.copyLink}</span>
              </Button>
              <Button variant="outline" size="sm" disabled>
                <ChevronLeftIcon aria-hidden="true" />
                {GRID_COPY.record.previous}
              </Button>
              <Button variant="outline" size="sm">
                {GRID_COPY.record.next}
                <ChevronRightIcon aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm">
                <XIcon aria-hidden="true" />
                {GRID_COPY.record.close}
              </Button>
            </div>
          </div>
          <div className="p-4">
            <ListingRecordBody view={view} priceLabel={headers["Listing.listPrice"]} />
          </div>
        </FramePanel>
      </Frame>
    </div>
  );
}

/** Scenes «mot», «nhieu», «khong», «cu»: the real inventory grid opened with a column filter, as the ⌘K box leaves it. */
function GridScene({
  rows,
  headers,
  words,
  filter,
  note,
}: {
  rows: readonly GridRow[];
  headers: Record<InventoryField, string>;
  words: Words;
  filter: { field: InventoryField; value: string } | null;
  note: string | null;
}) {
  useEffect(() => {
    if (note) notifyResult({ message: note });
  }, [note]);
  return (
    <InventoryGrid
      title={words.listing}
      headers={headers}
      rows={rows}
      state="ready"
      emptyWhy={words.emptyWhy}
      reloadLabel="Tải lại"
      filters={filter ? { [filter.field]: filter.value } : undefined}
    />
  );
}

/** One suggestion of the ⌘K box: what kind it is, what it shows, and the column it filters. */
interface Suggestion {
  kind: string;
  text: string;
  field: InventoryField;
  value: string;
  id?: string;
}

const fold = (t: string) => t.trim().toLocaleLowerCase("vi");

/** Suggestions for the typed text from the inventory rows: units, then buildings, then subdivisions. */
function suggest(rows: readonly GridRow[], typed: string, words: Words): Suggestion[] {
  const q = fold(typed);
  if (!q) return [];
  const out: Suggestion[] = [];
  const seen = new Set<string>();
  const push = (s: Suggestion) => {
    const key = `${s.field}|${s.text}`;
    if (seen.has(key) || out.length >= 8) return;
    seen.add(key);
    out.push(s);
  };
  for (const r of rows) {
    const code = String(r["Listing.unitNumber"]);
    if (fold(code).startsWith(q))
      push({
        kind: words.unit,
        text: `${code} · ${r["Listing.buildingName"]}`,
        field: "Listing.unitNumber",
        value: code,
        id: r.id,
      });
  }
  for (const r of rows) {
    const b = String(r["Listing.buildingName"]);
    if (fold(b).includes(q))
      push({ kind: words.building, text: b, field: "Listing.buildingName", value: b });
  }
  for (const r of rows) {
    const d = String(r["Listing.subdivisionName"]);
    if (fold(d).includes(q))
      push({ kind: words.subdivision, text: d, field: "Listing.subdivisionName", value: d });
  }
  return out;
}

/** Scene «go-ma»: the top bar's ⌘K box with suggestions; choosing one opens the inventory filtered at its column. */
function JumpScene({
  rows,
  words,
  bare,
}: {
  rows: readonly GridRow[];
  words: Words;
  bare: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Opened after mount so the screenshot of this scene shows the box (a dialog open on the server render stays shut).
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const [text, setText] = useState(String(rows[0]?.["Listing.unitNumber"] ?? "").slice(0, 2));
  const list = suggest(rows, text, words);
  const go = (s: Suggestion | null) => {
    const typed = text.trim();
    if (!s && !typed) return;
    setOpen(false);
    const code = s?.field === "Listing.unitNumber" || !s ? (s?.value ?? typed) : null;
    const units = code
      ? rows.filter((r) => fold(String(r["Listing.unitNumber"])) === fold(code))
      : [];
    const scene: Scene = !code
      ? "mot"
      : units.length === 1
        ? "mot"
        : units.length > 1
          ? "nhieu"
          : "khong";
    const q = new URLSearchParams({ canh: scene });
    if (s && !code) q.set("cot", `${s.field}=${s.value}`);
    if (units.length === 1) q.set("ho-so", units[0]!.id);
    if (bare) q.set("bang", "an");
    router.push(`${BASE}?${q}`);
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{PROTO_COPY.topBarNote}</p>
      <div
        data-slot="app-shell-top-bar"
        className="flex h-12 items-center justify-end gap-2 rounded-md border bg-background px-2"
      >
        <div className="w-56">
          <FormDialog
            trigger={{
              render: <Button variant="outline" size="sm" className="w-full" />,
              label: (
                <>
                  <SearchIcon aria-hidden="true" />
                  <span className="flex-1 text-left font-normal text-muted-foreground">
                    {ENTRY_COPY.jumpHint(words.unit)}
                  </span>
                  <kbd className="rounded border px-1 text-xs text-muted-foreground">⌘K</kbd>
                </>
              ),
            }}
            title={ENTRY_COPY.jump(words.unit)}
            description={ENTRY_COPY.jumpWhy(words.unit, words.inventory)}
            submitLabel={ENTRY_COPY.jumpGo}
            busyLabel={ENTRY_COPY.jumpGo}
            busy={false}
            open={open}
            onOpenChange={setOpen}
            onSubmit={() => go(list[0] ?? null)}
            slot="unit-jump"
          >
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                autoFocus
                aria-label={ENTRY_COPY.jump(words.unit)}
                placeholder="VD 0905"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </InputGroup>
            <ul data-slot="jump-suggestions" className="flex max-h-64 flex-col overflow-y-auto">
              {text.trim() && list.length === 0 ? (
                <li className="px-2 py-1.5 text-sm text-muted-foreground">
                  {ENTRY_COPY.noSuggestion(words.unit, words.inventory)}
                </li>
              ) : null}
              {list.map((s) => (
                <li key={`${s.field}|${s.text}`}>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => go(s)}>
                    <span className="w-14 text-left text-xs text-muted-foreground">{s.kind}</span>
                    <span className="flex-1 text-left">{s.text}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </FormDialog>
        </div>
      </div>
    </div>
  );
}

export function EntryShowcase({
  scene,
  bare,
  rows,
  twin,
  headers,
  words,
  column,
}: {
  scene: Scene;
  bare: boolean;
  rows: readonly GridRow[];
  /** The rows with one more listing of the first code in another building, for the «many buildings» scene. */
  twin: readonly GridRow[];
  headers: Record<InventoryField, string>;
  words: Words;
  /** A column filter chosen in the ⌘K box (building or subdivision), as «field=value». */
  column?: { field: InventoryField; value: string } | null;
}) {
  const row = rows[0]!;
  const code = String(row["Listing.unitNumber"]);
  return (
    <div className="flex flex-col gap-6">
      {bare ? null : (
        <section
          aria-labelledby="proto-controls"
          className="flex flex-col gap-2 rounded-md border border-dashed p-3 text-sm"
        >
          <h2 id="proto-controls" className="font-medium">
            {PROTO_COPY.controls.heading}
          </h2>
          <p className="text-muted-foreground">{PROTO_COPY.controls.note}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span>{PROTO_COPY.controls.scene}:</span>
            {SCENES.map((s) => (
              <Link
                key={s}
                href={sceneHref(s, false)}
                aria-current={s === scene ? "page" : undefined}
                className={buttonVariants({
                  variant: s === scene ? "default" : "outline",
                  size: "sm",
                })}
              >
                {PROTO_COPY.scenes[s]}
              </Link>
            ))}
          </div>
        </section>
      )}
      {scene === "ngan" ? <PanelScene row={row} headers={headers} /> : null}
      {scene === "go-ma" ? <JumpScene rows={twin} words={words} bare={bare} /> : null}
      {scene === "mot" ? (
        <GridScene
          rows={rows}
          headers={headers}
          words={words}
          filter={column ?? { field: "Listing.unitNumber", value: code }}
          note={null}
        />
      ) : null}
      {scene === "nhieu" ? (
        <GridScene
          rows={twin}
          headers={headers}
          words={words}
          filter={{ field: "Listing.unitNumber", value: code }}
          note={null}
        />
      ) : null}
      {scene === "khong" ? (
        <GridScene
          rows={rows}
          headers={headers}
          words={words}
          filter={{ field: "Listing.unitNumber", value: "Z-99.99" }}
          note={null}
        />
      ) : null}
      {scene === "cu" ? (
        <GridScene
          rows={rows}
          headers={headers}
          words={words}
          filter={null}
          note={ENTRY_COPY.staleLink(words.unit, words.inventory)}
        />
      ) : null}
    </div>
  );
}
