"use client";
// The import screen (row 11, nhap-excel): five steps across the top as ReUI solution-crm-6 lays them out (owner's
// answer to Hỏi-3). The file is read in the browser; every count shown is the count the server answered.
import { useCallback, useEffect, useRef, useState } from "react";

import { DataRegion } from "@/components/candidate/data-region";
import type { TypedColumn } from "@/components/candidate/column-kind";
import { Badge } from "@/components/reui/badge";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { label } from "@/modules/company-config";
import { allowedScope } from "@/modules/identity";
import { PermittedAction, useSessionRoles } from "@/modules/identity/ui";

import type { LearnedItem } from "../learned";
import { isOwnerHeader, NO_CHOICES, type Choices, type Mark } from "../mark";
import { readTable } from "../read-file";
import type { MarkedTable } from "../table";
import { STANDARD_TARGETS, TARGET_CONCEPT, type Target } from "../targets";
import { IMPORT_COPY as C, MARK_WORDS, PROBLEM_WORDS, STEP_WORDS, WHY_WORDS } from "./copy";

const MARK_VARIANT: Record<
  Mark,
  "success-light" | "primary-light" | "warning-light" | "destructive-light"
> = {
  keep: "success-light",
  // Not info: that tone is the Pending status alone (VP11, AC-1), so a mark never reads as a status.
  fixed: "primary-light",
  ask: "warning-light",
  block: "destructive-light",
};
const BATCH = 200;
type Table = {
  headers: string[];
  rows: string[][];
  sheet: string | null;
  otherSheets: string[];
  fileName: string;
};
type Banner = "offline" | "changed" | "failed" | null;

const targetWord = (t: Target | null) =>
  !t
    ? "—"
    : "skip" in t
      ? C.skipColumn
      : "standard" in t
        ? label(TARGET_CONCEPT[t.standard])
        : "custom" in t
          ? t.custom
          : t.newField.name;

const JSON_HEADERS = { "content-type": "application/json" };
async function answer<T>(request: Promise<Response>): Promise<{ status: number; body: T | null }> {
  try {
    const r = await request;
    return { status: r.status, body: (await r.json().catch(() => null)) as T | null };
  } catch {
    return { status: 0, body: null };
  }
}

/** The columns of the column step, so the wait is laid out like what comes next (design/states.md, Chờ tải). */
const WAIT_COLUMNS: readonly TypedColumn[] = [C.columnHead, C.targetHead, C.markHead].map(
  (header, i) => ({
    field: `custom.cho-${i}` as const,
    header,
    kind: "text",
    align: "left",
    widthCh: 16,
  }),
);

/** The one panel every step tab controls: the body shows the active step. */
const STEP_PANEL = "nhap-tep-buoc";

export function ImportWizard() {
  const [step, setStep] = useState(1);
  const [table, setTable] = useState<Table | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [marked, setMarked] = useState<MarkedTable | null>(null);
  const [choices, setChoices] = useState<Choices>(NO_CHOICES);
  const [banner, setBanner] = useState<Banner>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    created: number;
    learned: LearnedItem[];
  } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  // A team lead imports for one list agent of the company, chosen here (Hỏi-7); a list agent imports for itself.
  const forOthers = allowedScope(useSessionRoles(), "importListings") === "company";
  const [agents, setAgents] = useState<readonly { userId: string; name: string }[]>([]);
  const [agent, setAgent] = useState<string | null>(null);
  useEffect(() => {
    if (!forOthers) return;
    void answer<{ userId: string; name: string }[]>(fetch("/api/v1/imports/list-agents")).then(
      (r) => setAgents(r.body ?? []),
    );
  }, [forOthers]);

  // `keep` is the banner that stays once the preview is read again: after a conflict the person must still see why
  // the counts moved.
  const refresh = useCallback(async (t: Table, c: Choices, keep: Banner = null) => {
    setBusy(true);
    const r = await answer<MarkedTable>(
      fetch("/api/v1/imports/preview", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({
          headers: t.headers,
          rows: t.rows,
          choices: c,
        }),
      }),
    );
    setBusy(false);
    if (r.status === 0) return setBanner("offline");
    if (r.status !== 200 || !r.body) return setBanner("failed");
    setBanner(keep);
    setMarked(r.body);
  }, []);

  const choose = (next: Choices) => {
    setChoices(next);
    if (table) void refresh(table, next);
  };

  async function onFile(file: File) {
    setProblem(null);
    setBusy(true);
    const t = await readTable(file, file.name);
    setBusy(false);
    if (!t.ok) return setProblem(PROBLEM_WORDS[t.problem]);
    const tab = {
      headers: t.headers,
      rows: t.rows,
      sheet: t.sheet,
      otherSheets: t.otherSheets,
      fileName: file.name,
    };
    setTable(tab);
    setChoices(NO_CHOICES);
    await refresh(tab, NO_CHOICES);
  }

  /** Open the import (importListings); the batches are written by ApplyBatches under continueImport. */
  async function openImport(): Promise<string | null> {
    if (!table || !marked) return null;
    const expected = { ...marked.counts, createCount: marked.createCount };
    const open = await answer<{ id: string }>(
      fetch("/api/v1/imports", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({
          headers: table.headers,
          rows: table.rows,
          choices,
          fileName: table.fileName,
          sheetName: table.sheet,
          expected,
          ...(forOthers && agent ? { listAgentUserId: agent } : {}),
        }),
      }),
    );
    if (open.status === 0) return (setBanner("offline"), null);
    if (open.status === 409)
      return (setBanner("changed"), void refresh(table, choices, "changed"), null);
    if (open.status !== 201 || !open.body) return (setBanner("failed"), null);
    return open.body.id;
  }

  const asks = marked?.questions.length ?? 0;
  const skipped = choices.skipRows ?? [];
  const blocks = marked?.counts.block ?? 0;
  return (
    <>
      <p className="text-muted-foreground md:hidden" data-state="dien-thoai">
        {C.phone}
      </p>
      <div className="hidden md:block">
        <Frame stacked className="w-full">
          <FrameHeader>
            <FrameTitle>{STEP_WORDS[step - 1]}</FrameTitle>
            {table ? (
              <FrameDescription>{`${table.fileName} · ${C.rows(table.rows.length)}`}</FrameDescription>
            ) : null}
          </FrameHeader>
          <FramePanel className="overflow-x-auto">
            {/* The stepper's root is the tablist: it holds only the step bar, so the tabs are its own children.
                  StepperNav renders a <nav> landmark that would stand between the tablist and its tabs, so the
                  row here is a plain element with the same orientation hook. */}
            <Stepper
              value={step}
              onValueChange={(s) => table && s < 5 && setStep(s)}
              className="w-full"
            >
              <div
                data-slot="stepper-nav"
                data-orientation="horizontal"
                className="group/stepper-nav inline-flex min-w-full flex-row"
              >
                {STEP_WORDS.map((w, i) => (
                  <StepperItem key={w} step={i + 1} className="relative flex-1">
                    <StepperTrigger aria-controls={STEP_PANEL}>
                      <StepperIndicator>{i + 1}</StepperIndicator>
                      <StepperTitle>{w}</StepperTitle>
                    </StepperTrigger>
                    {i < STEP_WORDS.length - 1 ? <StepperSeparator /> : null}
                  </StepperItem>
                ))}
              </div>
            </Stepper>
          </FramePanel>
          {banner ? (
            <FramePanel
              role="status"
              data-state={`banner-${banner}`}
              className="flex items-center justify-between gap-3"
            >
              <span>{C[banner]}</span>
              {table ? (
                <Button variant="outline" size="sm" onClick={() => void refresh(table, choices)}>
                  {C.retry}
                </Button>
              ) : null}
            </FramePanel>
          ) : null}
          <FramePanel id={STEP_PANEL} role="tabpanel" aria-labelledby={`stepper-tab-${step}`}>
            {step === 1 ? (
              <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed px-6 py-10 text-center">
                  <span className="text-sm font-medium">{busy ? C.reading : C.drop}</span>
                  <span className="text-muted-foreground text-sm">{C.limits}</span>
                  <Input
                    ref={fileInput}
                    type="file"
                    accept=".xlsx,.csv"
                    aria-label={C.drop}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      // Clear the choice so picking the same file again (fixed in Excel meanwhile) reads it again.
                      e.target.value = "";
                      if (f) void onFile(f);
                    }}
                  />
                </label>
                {/* Over a second of reading or of the server's answer: rows laid out like the column table. */}
                {busy ? (
                  <DataRegion
                    title={C.columnHead}
                    columns={WAIT_COLUMNS}
                    rows={[]}
                    status="loading"
                  />
                ) : null}
                {problem ? (
                  <div role="alert" data-state="tep-loi" className="flex items-center gap-3">
                    <p>{problem}</p>
                    <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
                      {C.chooseAgain}
                    </Button>
                  </div>
                ) : null}
                <RecentImports />
                {table?.otherSheets.length ? (
                  <p className="text-muted-foreground text-sm">{`${C.otherSheets} ${table.otherSheets.join(", ")}`}</p>
                ) : null}
              </div>
            ) : null}
            {step === 2 && marked ? (
              // Width 0, at least the full row: the rows scroll inside the list instead of widening the page.
              <div role="list" className="w-0 min-w-full overflow-x-auto rounded-xl border text-sm">
                {marked.columns.map((c) => (
                  <div
                    role="listitem"
                    key={c.index}
                    className="flex min-w-max items-center gap-3 border-b px-3 py-2 last:border-0"
                  >
                    <span className="w-40 shrink-0 font-medium">{c.header || "—"}</span>
                    <Select
                      value={c.target ? JSON.stringify(c.target) : null}
                      onValueChange={(v) =>
                        v &&
                        choose({
                          ...choices,
                          columns: {
                            ...choices.columns,
                            [c.index]: { target: JSON.parse(String(v)) as Target },
                          },
                        })
                      }
                      items={[
                        ...(isOwnerHeader(c.header)
                          ? []
                          : [
                              ...STANDARD_TARGETS.map((t) => ({
                                value: JSON.stringify({ standard: t }),
                                label: label(TARGET_CONCEPT[t]),
                              })),
                              {
                                value: JSON.stringify({
                                  newField: {
                                    name: c.header.slice(0, 40),
                                    kind: "text",
                                    options: [],
                                  },
                                }),
                                label: `${label("CustomField")}: ${c.header}`,
                              },
                            ]),
                        { value: JSON.stringify({ skip: true }), label: C.skipColumn },
                      ]}
                    >
                      <SelectTrigger aria-label={`${C.targetHead}: ${c.header}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {/* An owner's name or phone column can only be dropped (Hỏi-12). */}
                        {isOwnerHeader(c.header) ? null : (
                          <>
                            {STANDARD_TARGETS.map((t) => (
                              <SelectItem key={t} value={JSON.stringify({ standard: t })}>
                                {label(TARGET_CONCEPT[t])}
                              </SelectItem>
                            ))}
                            <SelectItem
                              value={JSON.stringify({
                                newField: {
                                  name: c.header.slice(0, 40),
                                  kind: "text",
                                  options: [],
                                },
                              })}
                            >
                              {`${label("CustomField")}: ${c.header}`}
                            </SelectItem>
                          </>
                        )}
                        <SelectItem value={JSON.stringify({ skip: true })}>
                          {C.skipColumn}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant={MARK_VARIANT[c.mark]}>{MARK_WORDS[c.mark]}</Badge>
                    <span className="text-muted-foreground">{WHY_WORDS[c.why] ?? c.why}</span>
                    {c.learnLabel !== null ? (
                      <label className="flex items-center gap-2">
                        <Checkbox
                          // The person's own choice shows at once; the preview it starts confirms it.
                          checked={choices.columns[c.index]?.learnLabel ?? c.learnLabel}
                          onCheckedChange={(v) =>
                            c.target &&
                            choose({
                              ...choices,
                              columns: {
                                ...choices.columns,
                                [c.index]: { target: c.target, learnLabel: v === true },
                              },
                            })
                          }
                        />
                        {C.learnLabel(c.header)}
                      </label>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {step === 3 && marked ? (
              <div className="flex flex-col gap-3">
                {marked.questions.filter((q) => q.kind !== "column").length === 0 ? (
                  <p>{C.noQuestion}</p>
                ) : null}
                {marked.questions.map((q) =>
                  q.kind === "value" ? (
                    <fieldset
                      key={q.key}
                      className="flex min-w-0 flex-col gap-2 rounded-xl border px-4 py-3"
                    >
                      <legend className="px-1 text-sm wrap-break-word">
                        {C.inColumn(q.raw, marked.columns[q.column]!.header, q.cells)}
                      </legend>
                      <Input
                        aria-label={q.raw}
                        defaultValue={choices.values[q.key]?.value ?? ""}
                        onBlur={(e) =>
                          choose({
                            ...choices,
                            values: {
                              ...choices.values,
                              [q.key]: { value: e.target.value.trim() || null, remember: true },
                            },
                          })
                        }
                      />
                    </fieldset>
                  ) : q.kind === "unit-many" ? (
                    <fieldset
                      key={q.code}
                      className="flex min-w-0 flex-wrap gap-2 rounded-xl border px-4 py-3"
                    >
                      <legend className="px-1 text-sm wrap-break-word">
                        {C.inColumn(q.code, label("Unit"), q.cells)}
                      </legend>
                      {q.unitKeys.map((k) => (
                        <Button
                          key={k}
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            choose({
                              ...choices,
                              units: {
                                ...choices.units,
                                [q.code.toLowerCase()]: { unitKey: k, remember: true },
                              },
                            })
                          }
                        >
                          {k}
                        </Button>
                      ))}
                    </fieldset>
                  ) : q.kind === "unit-missing" ? (
                    <p
                      key="missing"
                      className="rounded-xl border px-4 py-3 text-sm wrap-break-word"
                    >{`${C.pendingDefault}: ${q.codes.slice(0, 5).join(", ")}${q.codes.length > 5 ? "…" : ""} · ${C.cells(q.cells)}`}</p>
                  ) : null,
                )}
              </div>
            ) : null}
            {step === 4 && marked ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-3" data-state="dem-dau">
                  {(Object.keys(MARK_WORDS) as Mark[]).map((m) => (
                    <span key={m} className="flex items-center gap-1.5 text-sm">
                      <Badge variant={MARK_VARIANT[m]}>{MARK_WORDS[m]}</Badge>
                      <span data-mark={m}>{marked.counts[m]}</span>
                    </span>
                  ))}
                </div>
                {/* Width 0, at least the full row: the rows scroll inside the list instead of widening the page. */}
                <div
                  role="list"
                  className="w-0 min-w-full overflow-x-auto rounded-xl border text-sm"
                >
                  <div className="text-muted-foreground flex w-max min-w-full border-b">
                    <span className="w-28 shrink-0 px-3 py-2" />
                    {marked.columns.map((c) => (
                      <span key={c.index} className="w-40 shrink-0 truncate px-3 py-2">
                        {c.header}
                      </span>
                    ))}
                  </div>
                  {table!.rows.slice(0, 50).map((r, i) => (
                    <div
                      role="listitem"
                      key={i}
                      data-skipped={skipped.includes(i) || undefined}
                      className="flex w-max min-w-full border-b last:border-0 data-[skipped]:opacity-50"
                    >
                      <span className="w-28 shrink-0 px-2 py-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-pressed={skipped.includes(i)}
                          aria-label={`${C.skipRow} ${i + 1}`}
                          onClick={() =>
                            choose({
                              ...choices,
                              skipRows: skipped.includes(i)
                                ? skipped.filter((r) => r !== i)
                                : [...skipped, i],
                            })
                          }
                        >
                          {skipped.includes(i) ? C.keepRow : C.skipRow}
                        </Button>
                      </span>
                      {marked.columns.map((c) => {
                        const cell = marked.cells[i]?.[c.index];
                        return (
                          <span
                            key={c.index}
                            title={cell ? MARK_WORDS[cell.mark] : ""}
                            className={`w-40 shrink-0 truncate px-3 py-2 ${cell?.mark === "ask" ? "bg-warning/10" : cell?.mark === "block" ? "bg-destructive/10" : ""}`}
                          >
                            {r[c.index]}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {step === 5 && result ? (
              <div className="flex flex-col gap-2" data-state="xong">
                <p className="font-medium">{C.done(result.created)}</p>
                {marked && marked.keptCount > 0 ? (
                  <p className="text-muted-foreground text-sm" data-state="giu-chu-goc">
                    {C.keptCells(marked.keptCount)}
                  </p>
                ) : null}
                {result.learned.length ? (
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="text-muted-foreground">{C.learned}</p>
                    <ul className="list-disc pl-5" data-state="vua-hoc">
                      {result.learned.map((item, i) => (
                        <li key={`${item.concept}-${i}`}>{C.learnedItem(item)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </FramePanel>
          <FrameFooter className="flex items-center justify-end gap-2">
            {step > 1 && step < 5 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                {C.back}
              </Button>
            ) : null}
            {step < 4 ? (
              <Button disabled={!marked || busy} onClick={() => setStep(step + 1)}>
                {C.next}
                {step === 2 || step === 3 ? ` (${asks})` : ""}
              </Button>
            ) : null}
            {step === 4 && marked ? (
              <>
                {blocks > 0 ? (
                  <Button variant="outline" onClick={() => setStep(2)}>
                    {C.blocked(blocks)}
                  </Button>
                ) : null}
                {forOthers ? (
                  <div className="min-w-56">
                    <Select
                      value={agent}
                      onValueChange={(v) => setAgent(v ? String(v) : null)}
                      items={agents.map((a) => ({ value: a.userId, label: a.name }))}
                    >
                      <SelectTrigger aria-label={C.pickAgent} data-slot="chon-dau-chu">
                        <SelectValue placeholder={C.pickAgent} />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((a) => (
                          <SelectItem key={a.userId} value={a.userId}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
                <PermittedAction action="continueImport">
                  <ApplyBatches
                    disabled={!marked.canApply || busy || !table || (forOthers && !agent)}
                    words={C.apply(marked.createCount, marked.keptCount)}
                    table={table!}
                    choices={choices}
                    newFieldColumns={marked.columns
                      .filter((c) => c.target && "newField" in c.target)
                      .map((c) => c.index)}
                    open={openImport}
                    onBusy={setBusy}
                    onBanner={setBanner}
                    onDone={(r) => (setResult(r), setStep(5))}
                  />
                </PermittedAction>
              </>
            ) : null}
            {step === 5 ? (
              result ? (
                <PermittedAction action="undoImport">
                  <UndoImport
                    id={result.id}
                    onDone={(keptCodes) => (
                      setResult(null),
                      setTable(null),
                      setMarked(null),
                      setStep(1),
                      setProblem(keptCodes.length ? C.undoneKept(keptCodes) : C.undone)
                    )}
                  />
                </PermittedAction>
              ) : null
            ) : null}
          </FrameFooter>
        </Frame>
      </div>
    </>
  );
}

/** Writes the batches of an open import, 200 rows each; a batch that fails stops with the rows written so far kept. */
function ApplyBatches(props: {
  disabled: boolean;
  words: string;
  table: Table;
  choices: Choices;
  newFieldColumns: number[];
  open: () => Promise<string | null>;
  onBusy: (b: boolean) => void;
  onBanner: (b: Banner) => void;
  onDone: (r: { id: string; created: number; learned: LearnedItem[] }) => void;
}) {
  // The import opened and how far it got: a batch that fails keeps both, so «Thử lại» sends that very batch again on
  // the same import instead of opening a new one (AC-7; S4-r2 t1). The server writes a batch whole or not at all.
  const [progress, setProgress] = useState<{
    id: string;
    next: number;
    created: number;
    learned: LearnedItem[];
  } | null>(null);
  const [failed, setFailed] = useState<"offline" | "server" | null>(null);
  // One write loop at a time: a second press while one runs does nothing (S4-r3 t9).
  const running = useRef(false);
  const [writing, setWriting] = useState(false);
  async function run() {
    if (running.current) return;
    running.current = true;
    setWriting(true);
    try {
      await write();
    } finally {
      running.current = false;
      setWriting(false);
    }
  }
  async function write() {
    props.onBusy(true);
    let at = progress;
    if (!at) {
      const id = await props.open();
      if (!id) return props.onBusy(false);
      at = { id, next: 0, created: 0, learned: [] };
    }
    const { table, choices } = props;
    for (let b = at.next; b * BATCH < table.rows.length; b += 1) {
      const last = (b + 1) * BATCH >= table.rows.length;
      const allNewFieldCells: Record<string, string> = {};
      if (last)
        table.rows.forEach((r, i) =>
          props.newFieldColumns.forEach((j) => (allNewFieldCells[`${i}:${j}`] = r[j] ?? "")),
        );
      const id: string = at.id;
      const res: { status: number; body: { created: number; learned?: LearnedItem[] } | null } =
        await answer<{ created: number; learned?: LearnedItem[] }>(
          fetch(`/api/v1/imports/${id}/batches`, {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({
              headers: table.headers,
              rows: table.rows.slice(b * BATCH, (b + 1) * BATCH),
              choices,
              batchNo: b,
              rowOffset: b * BATCH,
              last,
              ...(last ? { allNewFieldCells } : {}),
            }),
          }),
        );
      if (res.status !== 200 || !res.body) {
        setProgress({ ...at, next: b });
        setFailed(res.status === 0 ? "offline" : "server");
        return props.onBusy(false);
      }
      at = {
        ...at,
        next: b + 1,
        created: at.created + res.body.created,
        learned: res.body.learned ?? at.learned,
      };
    }
    setProgress(null);
    setFailed(null);
    props.onBusy(false);
    props.onBanner(null);
    props.onDone({ id: at.id, created: at.created, learned: at.learned });
  }
  if (failed && progress)
    return (
      <div role="alert" data-state="ghi-do-dang" className="flex items-center gap-3">
        <p>
          {C.batchStopped(
            Math.min(progress.next * BATCH, props.table.rows.length),
            props.table.rows.length,
            failed === "offline",
          )}
        </p>
        <Button variant="outline" disabled={writing} onClick={() => void run()}>
          {C.retry}
        </Button>
      </div>
    );
  return (
    <Button disabled={props.disabled || writing} onClick={() => void run()}>
      {props.words}
    </Button>
  );
}

/** Undo a whole import. */
function UndoImport(props: { id: string; onDone: (keptCodes: string[]) => void }) {
  // The undo is one transaction: when it fails nothing was removed, and the screen says so with «Thử lại» right here.
  const [failed, setFailed] = useState<"offline" | "server" | null>(null);
  async function run() {
    const r = await answer<{ keptCodes?: string[] }>(
      fetch(`/api/v1/imports/${props.id}/undo`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: "{}",
      }),
    );
    if (r.status === 200) return (setFailed(null), props.onDone(r.body?.keptCodes ?? []));
    setFailed(r.status === 0 ? "offline" : "server");
  }
  return failed ? (
    <div role="alert" data-state="hoan-tac-loi" className="flex items-center gap-3">
      <p>{failed === "offline" ? C.undoOffline : C.undoFailed}</p>
      <Button variant="outline" size="sm" onClick={() => void run()}>
        {C.retry}
      </Button>
    </div>
  ) : (
    <Button variant="outline" onClick={() => void run()}>
      {C.undo}
    </Button>
  );
}

/** The company's last imports (viewImports); nothing is shown while there is none or the list cannot be read. */
function RecentImports() {
  const [rows, setRows] = useState<
    { id: string; fileName: string; status: string; createdCount: number; createdAt: string }[]
  >([]);
  // The list is one part of the screen: when it cannot be read, it says so and the file can still be chosen.
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    void answer<typeof rows>(fetch("/api/v1/imports")).then((r) => {
      if (!live) return;
      setFailed(r.status !== 200 || !r.body);
      if (r.status === 200 && r.body) setRows(r.body);
    });
    return () => {
      live = false;
    };
  }, [tick]);
  if (failed)
    return (
      <div role="status" data-state="gan-day-loi" className="flex items-center gap-3 text-sm">
        <p>{C.recentFailed}</p>
        <Button variant="outline" size="sm" onClick={() => setTick((t) => t + 1)}>
          {C.retry}
        </Button>
      </div>
    );
  if (rows.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 text-sm" data-state="gan-day">
      <p className="font-medium">{C.recent}</p>
      <ul className="flex flex-col gap-1">
        {rows.map((r) => (
          <li key={r.id} className="text-muted-foreground flex gap-3">
            <span className="text-foreground">{r.fileName}</span>
            <span>{C.rows(r.createdCount)}</span>
            <span>{r.status === "undone" ? C.undoneShort : r.createdAt.slice(0, 10)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
