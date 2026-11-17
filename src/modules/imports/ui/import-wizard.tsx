"use client";
// The «Nạp tệp» screen (row 11, nhap-excel): five steps across the top as ReUI solution-crm-6 lays them out (owner's
// answer to Hỏi-3). The file is read in the browser; every count shown is the count the server answered.
import { useCallback, useState } from "react";

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
  StepperNav,
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

import { NO_CHOICES, type Choices, type Mark } from "../mark";
import { readTable } from "../read-file";
import type { MarkedTable } from "../table";
import { STANDARD_TARGETS, TARGET_CONCEPT, type Target } from "../targets";
import { IMPORT_COPY as C, MARK_WORDS, PROBLEM_WORDS, STEP_WORDS, WHY_WORDS } from "./copy";

const MARK_VARIANT: Record<
  Mark,
  "success-light" | "info-light" | "warning-light" | "destructive-light"
> = {
  keep: "success-light",
  fixed: "info-light",
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

async function post<T>(url: string, body: unknown): Promise<{ status: number; body: T | null }> {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return { status: r.status, body: (await r.json().catch(() => null)) as T | null };
  } catch {
    return { status: 0, body: null };
  }
}

export function ImportWizard() {
  const [step, setStep] = useState(1);
  const [table, setTable] = useState<Table | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [marked, setMarked] = useState<MarkedTable | null>(null);
  const [choices, setChoices] = useState<Choices>(NO_CHOICES);
  const [banner, setBanner] = useState<Banner>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ id: string; created: number; learned: string[] } | null>(
    null,
  );

  const refresh = useCallback(async (t: Table, c: Choices) => {
    setBusy(true);
    const r = await post<MarkedTable>("/api/v1/imports/preview", {
      headers: t.headers,
      rows: t.rows,
      choices: c,
    });
    setBusy(false);
    if (r.status === 0) return setBanner("offline");
    if (r.status !== 200 || !r.body) return setBanner("failed");
    setBanner(null);
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

  async function apply() {
    if (!table || !marked) return;
    setBusy(true);
    const expected = { ...marked.counts, createCount: marked.createCount };
    const open = await post<{ id: string; error?: string }>("/api/v1/imports", {
      headers: table.headers,
      rows: table.rows,
      choices,
      fileName: table.fileName,
      sheetName: table.sheet,
      expected,
    });
    if (open.status === 0) return (setBusy(false), setBanner("offline"));
    if (open.status === 409)
      return (setBusy(false), setBanner("changed"), void refresh(table, choices));
    if (open.status !== 201 || !open.body) return (setBusy(false), setBanner("failed"));
    const id = open.body.id;
    const newFieldCols = marked.columns
      .filter((c) => c.target && "newField" in c.target)
      .map((c) => c.index);
    let created = 0;
    let learned: string[] = [];
    for (let b = 0; b * BATCH < table.rows.length; b += 1) {
      const rows = table.rows.slice(b * BATCH, (b + 1) * BATCH);
      const last = (b + 1) * BATCH >= table.rows.length;
      const allNewFieldCells: Record<string, string> = {};
      if (last)
        table.rows.forEach((r, i) =>
          newFieldCols.forEach((j) => (allNewFieldCells[`${i}:${j}`] = r[j] ?? "")),
        );
      const res = await post<{ created: number; learned?: string[] }>(
        `/api/v1/imports/${id}/batches`,
        {
          headers: table.headers,
          rows,
          choices,
          batchNo: b,
          rowOffset: b * BATCH,
          last,
          ...(last ? { allNewFieldCells } : {}),
        },
      );
      if (res.status !== 200 || !res.body)
        return (setBusy(false), setBanner(res.status === 0 ? "offline" : "failed"));
      created += res.body.created;
      if (res.body.learned) learned = res.body.learned;
    }
    setBusy(false);
    setBanner(null);
    setResult({ id, created, learned });
    setStep(5);
  }

  async function undo() {
    if (!result) return;
    const r = await post<{ removed: string[] }>(`/api/v1/imports/${result.id}/undo`, {});
    setBanner(r.status === 200 ? null : r.status === 0 ? "offline" : "failed");
    if (r.status === 200)
      (setResult(null), setTable(null), setMarked(null), setStep(1), setProblem(C.undone));
  }

  const asks = marked?.questions.length ?? 0;
  const blocks = marked?.counts.block ?? 0;
  return (
    <>
      <p className="text-muted-foreground md:hidden" data-state="dien-thoai">
        {C.phone}
      </p>
      <div className="hidden md:block">
        <Stepper
          value={step}
          onValueChange={(s) => table && s < 5 && setStep(s)}
          className="w-full"
        >
          <Frame stacked className="w-full">
            <FrameHeader>
              <FrameTitle>{STEP_WORDS[step - 1]}</FrameTitle>
              {table ? (
                <FrameDescription>{`${table.fileName} · ${C.rows(table.rows.length)}`}</FrameDescription>
              ) : null}
            </FrameHeader>
            <FramePanel className="overflow-x-auto">
              <StepperNav className="min-w-full">
                {STEP_WORDS.map((w, i) => (
                  <StepperItem key={w} step={i + 1} className="relative flex-1">
                    <StepperTrigger>
                      <StepperIndicator>{i + 1}</StepperIndicator>
                      <StepperTitle>{w}</StepperTitle>
                    </StepperTrigger>
                    {i < STEP_WORDS.length - 1 ? <StepperSeparator /> : null}
                  </StepperItem>
                ))}
              </StepperNav>
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
            <FramePanel>
              {step === 1 ? (
                <div className="flex flex-col gap-3">
                  <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed px-6 py-10 text-center">
                    <span className="text-sm font-medium">{busy ? C.reading : C.drop}</span>
                    <span className="text-muted-foreground text-sm">{C.limits}</span>
                    <Input
                      type="file"
                      accept=".xlsx,.csv"
                      aria-label={C.drop}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void onFile(f);
                      }}
                    />
                  </label>
                  {problem ? (
                    <p role="alert" data-state="tep-loi">
                      {problem}
                    </p>
                  ) : null}
                  {table?.otherSheets.length ? (
                    <p className="text-muted-foreground text-sm">{`${C.otherSheets} ${table.otherSheets.join(", ")}`}</p>
                  ) : null}
                </div>
              ) : null}
              {step === 2 && marked ? (
                <div role="list" className="overflow-x-auto rounded-xl border text-sm">
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
                          ...STANDARD_TARGETS.map((t) => ({
                            value: JSON.stringify({ standard: t }),
                            label: label(TARGET_CONCEPT[t]),
                          })),
                          {
                            value: JSON.stringify({
                              newField: { name: c.header.slice(0, 40), kind: "text", options: [] },
                            }),
                            label: `${C.newField}: ${c.header}`,
                          },
                          { value: JSON.stringify({ skip: true }), label: C.skipColumn },
                        ]}
                      >
                        <SelectTrigger aria-label={`${C.targetHead}: ${c.header}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STANDARD_TARGETS.map((t) => (
                            <SelectItem key={t} value={JSON.stringify({ standard: t })}>
                              {label(TARGET_CONCEPT[t])}
                            </SelectItem>
                          ))}
                          <SelectItem
                            value={JSON.stringify({
                              newField: { name: c.header.slice(0, 40), kind: "text", options: [] },
                            })}
                          >
                            {`${C.newField}: ${c.header}`}
                          </SelectItem>
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
                            checked={c.learnLabel}
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
                        className="flex flex-col gap-2 rounded-xl border px-4 py-3"
                      >
                        <legend className="px-1 text-sm">
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
                        className="flex flex-wrap gap-2 rounded-xl border px-4 py-3"
                      >
                        <legend className="px-1 text-sm">
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
                        className="rounded-xl border px-4 py-3 text-sm"
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
                  <div role="list" className="overflow-x-auto rounded-xl border text-sm">
                    <div className="text-muted-foreground flex w-max min-w-full border-b">
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
                        className="flex w-max min-w-full border-b last:border-0"
                      >
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
                  {result.learned.length ? (
                    <p className="text-muted-foreground text-sm">{`${C.learned}: ${result.learned.length}`}</p>
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
                  <Button disabled={!marked.canApply || busy} onClick={() => void apply()}>
                    {C.apply(marked.createCount, marked.keptCount)}
                  </Button>
                </>
              ) : null}
              {step === 5 ? (
                <Button variant="outline" onClick={() => void undo()}>
                  {C.undo}
                </Button>
              ) : null}
            </FrameFooter>
          </Frame>
        </Stepper>
      </div>
    </>
  );
}
