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

/** Scenes «nhieu», «khong», «cu»: the real inventory grid, filtered by the typed code, with the row's one sentence. */
function GridScene({
  rows,
  headers,
  words,
  code,
  note,
}: {
  rows: readonly GridRow[];
  headers: Record<InventoryField, string>;
  words: Words;
  code: string | null;
  note: string | null;
}) {
  useEffect(() => {
    if (note) notifyResult({ message: note });
  }, [note]);
  const many = code ? rows.filter((r) => String(r["Listing.unitNumber"]) === code) : [];
  return (
    <div className="flex flex-col gap-3">
      {many.length > 1 ? (
        <p data-slot="jump-many" className="text-sm">
          {ENTRY_COPY.many(code!, many.length, words.building, words.unit)}
        </p>
      ) : null}
      <InventoryGrid
        title={words.listing}
        headers={headers}
        rows={rows}
        state="ready"
        emptyWhy={words.emptyWhy}
        reloadLabel="Tải lại"
        filters={code ? { "Listing.unitNumber": code } : undefined}
      />
    </div>
  );
}

/** Scene «go-ma»: the top bar's «Gõ mã căn» (⌘K or «/») opens the store's form dialog; Enter opens the inventory with the unit's record. */
function JumpScene({ words, bare }: { words: Words; bare: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Opened after mount so the screenshot of this scene shows the dialog (a dialog open on the server render stays shut).
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const go = () => {
    const code = text.trim();
    if (!code) return setError(ENTRY_COPY.jumpEmpty(words.unit));
    setOpen(false);
    router.push(
      sceneHref(
        code.toLowerCase() === "z-99.99" ? "khong" : code === "0905" ? "nhieu" : "ngan",
        bare,
      ),
    );
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
            onSubmit={go}
            formError={error}
            slot="unit-jump"
          >
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                autoFocus
                aria-label={ENTRY_COPY.jump(words.unit)}
                aria-invalid={error ? true : undefined}
                placeholder="VD 0905"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError(undefined);
                }}
              />
            </InputGroup>
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
}: {
  scene: Scene;
  bare: boolean;
  rows: readonly GridRow[];
  /** The rows with one more listing of the first code in another building, for the «many buildings» scene. */
  twin: readonly GridRow[];
  headers: Record<InventoryField, string>;
  words: Words;
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
      {scene === "go-ma" ? <JumpScene words={words} bare={bare} /> : null}
      {scene === "nhieu" ? (
        <GridScene rows={twin} headers={headers} words={words} code={code} note={null} />
      ) : null}
      {scene === "khong" ? (
        <GridScene rows={rows} headers={headers} words={words} code="Z-99.99" note={null} />
      ) : null}
      {scene === "cu" ? (
        <GridScene
          rows={rows}
          headers={headers}
          words={words}
          code={null}
          note={ENTRY_COPY.staleLink(words.unit, words.inventory)}
        />
      ) : null}
    </div>
  );
}
