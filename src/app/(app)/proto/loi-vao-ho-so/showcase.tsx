"use client";

import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  Maximize2Icon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { GRID_COPY } from "@/components/candidate/grid-copy";
import { Frame, FramePanel } from "@/components/reui/frame";
import { PageHeader } from "@/components/templates/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { GridRow } from "@/components/candidate/data-region";
import { ListingRecordBody, listingView, type InventoryField } from "@/modules/listings/ui";

import { ENTRY_COPY, PROTO_COPY, SCENES, type Scene } from "./copy";

export interface Words {
  unit: string;
  building: string;
  inventory: string;
}

const BASE = "/proto/loi-vao-ho-so";
const TITLE_CLASS = "min-w-0 flex-1 text-lg font-semibold break-words";
const sceneHref = (scene: Scene, bare: boolean) => `${BASE}?canh=${scene}${bare ? "&bang=an" : ""}`;

/** The unit page address the row proposes: /inventory/units/<code>?toa=<building>&ho-so=<listing id>. */
export function unitHref(row: GridRow): string {
  const code = encodeURIComponent(String(row["Listing.unitNumber"]));
  const q = new URLSearchParams({ toa: String(row["Listing.buildingName"]), "ho-so": row.id });
  return `/inventory/units/${code}?${q}`;
}

function OpenFull({ onOpen }: { onOpen: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={ENTRY_COPY.openFull}
            data-muc="mo-toan-man"
            onClick={onOpen}
          />
        }
      >
        <Maximize2Icon aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>{ENTRY_COPY.openFull}</TooltipContent>
    </Tooltip>
  );
}

/** Scene «ngan»: the record beside the grid as row 3 shows it, with «Mở toàn màn» first among the head's buttons. */
function PanelScene({
  row,
  headers,
  bare,
}: {
  row: GridRow;
  headers: Record<InventoryField, string>;
  bare: boolean;
}) {
  const router = useRouter();
  const view = listingView(row, headers);
  return (
    <div className="flex justify-end">
      <Frame data-slot="record-panel" className="w-full max-w-lg text-sm shadow-lg">
        <FramePanel className="flex flex-col p-0">
          <div data-slot="record-panel-header" className="flex items-start gap-2 border-b p-4">
            <h2 className={TITLE_CLASS}>{`${view.unitNumber} · ${row["Listing.buildingName"]}`}</h2>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <OpenFull onOpen={() => router.push(sceneHref("trang", bare))} />
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

/** Scene «trang»: the unit's own page — the same record body, a way back, and «Chép đường dẫn». */
function PageScene({
  row,
  headers,
  words,
}: {
  row: GridRow;
  headers: Record<InventoryField, string>;
  words: Words;
}) {
  const view = listingView(row, headers);
  const href = unitHref(row);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(href, window.location.origin).toString());
      toast(ENTRY_COPY.copied);
    } catch {
      toast(ENTRY_COPY.copyFailed);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/inventory"
        className={buttonVariants({ variant: "ghost", size: "sm", className: "self-start" })}
      >
        <ArrowLeftIcon aria-hidden="true" />
        {words.inventory}
      </Link>
      <PageHeader
        title={`${view.unitNumber} · ${row["Listing.buildingName"]}`}
        action={
          <Button variant="outline" onClick={() => void copy()}>
            <LinkIcon aria-hidden="true" />
            {ENTRY_COPY.copyLink}
          </Button>
        }
      />
      <p className="text-sm text-muted-foreground">
        <code className="break-all">{href}</code> — {PROTO_COPY.sharedNote}
      </p>
      <Frame className="max-w-3xl text-sm">
        <FramePanel className="p-4">
          <ListingRecordBody view={view} priceLabel={headers["Listing.listPrice"]} />
        </FramePanel>
      </Frame>
    </div>
  );
}

function StatePage({
  title,
  why,
  children,
}: {
  title: string;
  why: ReactNode;
  children: ReactNode;
}) {
  return (
    <Empty data-slot="page-state">
      <EmptyHeader>
        <h1 className="text-lg font-semibold">{title}</h1>
        <EmptyDescription>{why}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  );
}

/** Scene «nhieu»: one code in two buildings — one button per building, each opening that building's unit. */
function ManyScene({ row, words, other }: { row: GridRow; words: Words; other: string }) {
  const code = String(row["Listing.unitNumber"]);
  const buildings = [String(row["Listing.buildingName"]), other];
  return (
    <StatePage
      title={ENTRY_COPY.many(words.unit, words.building)}
      why={ENTRY_COPY.manyWhy(code, buildings.length, words.building)}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {buildings.map((b) => (
          <Link
            key={b}
            href={`${BASE}?canh=trang`}
            className={buttonVariants({ variant: "outline" })}
          >
            {b}
          </Link>
        ))}
      </div>
    </StatePage>
  );
}

/** Scene «khong»: an unknown code — say so plainly and lead back to the inventory. */
function UnknownScene({ words }: { words: Words }) {
  return (
    <StatePage
      title={ENTRY_COPY.notFound(words.unit, words.inventory)}
      why={ENTRY_COPY.notFoundWhy("Z-99.99", words.inventory)}
    >
      <Link href="/inventory" className={buttonVariants()}>
        {ENTRY_COPY.backTo(words.inventory)}
      </Link>
    </StatePage>
  );
}

/** Scene «go-ma»: the top bar's «Gõ mã căn» (⌘K or «/») opens a small dialog; Enter opens the unit's record. */
function JumpScene({ words, bare }: { words: Words; bare: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Opened after mount so the screenshot of this scene shows the dialog (a dialog open on the server render stays shut).
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const go = () => {
    const code = text.trim();
    if (!code) return setError(ENTRY_COPY.jumpEmpty(words.unit));
    setOpen(false);
    router.push(
      sceneHref(
        code.toLowerCase() === "z-99.99" ? "khong" : code === "0905" ? "nhieu" : "trang",
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
          <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(true)}>
            <SearchIcon aria-hidden="true" />
            <span className="flex-1 text-left font-normal text-muted-foreground">
              {ENTRY_COPY.jumpHint(words.unit)}
            </span>
            <kbd className="rounded border px-1 text-xs text-muted-foreground">⌘K</kbd>
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ENTRY_COPY.jump(words.unit)}</DialogTitle>
            <DialogDescription>{ENTRY_COPY.jumpWhy(words.unit, words.inventory)}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go();
            }}
            className="flex flex-col gap-2"
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
                  setError(null);
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton type="submit" variant="default">
                  {ENTRY_COPY.jumpGo}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function EntryShowcase({
  scene,
  bare,
  row,
  otherBuilding,
  headers,
  words,
}: {
  scene: Scene;
  bare: boolean;
  row: GridRow;
  otherBuilding: string;
  headers: Record<InventoryField, string>;
  words: Words;
}) {
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
      {scene === "ngan" ? <PanelScene row={row} headers={headers} bare={bare} /> : null}
      {scene === "trang" ? <PageScene row={row} headers={headers} words={words} /> : null}
      {scene === "nhieu" ? <ManyScene row={row} words={words} other={otherBuilding} /> : null}
      {scene === "khong" ? <UnknownScene words={words} /> : null}
      {scene === "go-ma" ? <JumpScene words={words} bare={bare} /> : null}
    </div>
  );
}
