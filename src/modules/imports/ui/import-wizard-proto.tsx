"use client";
// Clickable prototype of the «Nạp tệp» screen for the scope gate of row 11 (nhap-excel). Development only. Two layouts
// of the same blocks and the same sample data, so the owner compares like with like: A puts the five steps across the
// top as ReUI solution-crm-6 does; B puts them down a left column as ReUI onboarding-2 does. The stepper here is a
// stand-in for @reui/stepper, which the build installs.
import { useState } from "react";

import { Badge } from "@/components/reui/badge";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import {
  type Mark,
  PROTO_COLUMNS,
  PROTO_COPY,
  PROTO_COUNTS,
  PROTO_FILE,
  PROTO_LEARNED,
  PROTO_PREVIEW_HEADERS,
  PROTO_QUESTIONS,
  PROTO_RECENT,
  PROTO_ROWS,
} from "./proto-copy";

const MARK_VARIANT: Record<
  Mark,
  "success-light" | "info-light" | "warning-light" | "destructive-light"
> = {
  keep: "success-light",
  fixed: "info-light",
  ask: "warning-light",
  block: "destructive-light",
};

function MarkBadge({ mark }: { mark: Mark }) {
  return <Badge variant={MARK_VARIANT[mark]}>{PROTO_COPY.marks[mark]}</Badge>;
}

function StepDot({ n, state }: { n: number; state: "done" | "now" | "later" }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums",
        state === "now" && "border-primary bg-primary text-primary-foreground",
        state === "done" && "border-primary text-primary",
        state === "later" && "text-muted-foreground",
      )}
    >
      {n}
    </span>
  );
}

function StepNav({
  step,
  onStep,
  vertical,
}: {
  step: number;
  onStep: (n: number) => void;
  vertical: boolean;
}) {
  return (
    <nav aria-label={PROTO_COPY.title}>
      <ol className={cn("flex gap-2", vertical ? "flex-col" : "items-center")}>
        {PROTO_COPY.steps.map((name, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "now" : "later";
          return (
            <li key={name} className={cn("flex items-center gap-2", !vertical && "flex-1")}>
              <Button
                variant="ghost"
                onClick={() => onStep(n)}
                aria-current={n === step ? "step" : undefined}
                size="sm"
              >
                <StepDot n={n} state={state} />
                <span className={cn(n === step ? "font-medium" : "text-muted-foreground")}>
                  {name}
                </span>
                {n === 2 || n === 3 ? (
                  <Badge variant="warning-light" size="sm">
                    {n === 2 ? 4 : 5}
                  </Badge>
                ) : null}
              </Button>
              {!vertical && n < PROTO_COPY.steps.length ? (
                <span className="bg-border h-px flex-1" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ChooseFile() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed px-6 py-10 text-center">
        <span className="text-sm font-medium">{PROTO_COPY.drop}</span>
        <span className="text-muted-foreground text-sm">{PROTO_COPY.dropLimits}</span>
      </div>
      <div className="flex items-center justify-between rounded-xl border px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{PROTO_FILE.name}</span>
          <span className="text-muted-foreground text-sm">
            {PROTO_FILE.sheet} · {PROTO_FILE.rows} dòng · {PROTO_FILE.size}
          </span>
          <span className="text-muted-foreground text-xs">{PROTO_COPY.otherSheets}</span>
        </div>
        <Badge variant="success-light">{PROTO_COPY.fileReady}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">{PROTO_COPY.recent}</span>
        {PROTO_RECENT.map((r) => (
          <div key={r.file} className="flex items-center justify-between text-sm">
            <span>
              {r.when} · {r.file} · {r.added} căn
            </span>
            <Button variant="ghost" size="sm">
              {PROTO_COPY.undo}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapColumns() {
  return (
    <div className="flex flex-col gap-3">
      <div role="list" className="overflow-x-auto rounded-xl border text-sm">
        <div className="text-muted-foreground grid grid-cols-4 border-b">
          <span className="px-3 py-2 font-medium">{PROTO_COPY.colHeader}</span>
          <span className="px-3 py-2 font-medium">{PROTO_COPY.colTarget}</span>
          <span className="px-3 py-2 font-medium">{PROTO_COPY.colMark}</span>
          <span className="px-3 py-2 font-medium">{PROTO_COPY.colWhy}</span>
        </div>
        {PROTO_COLUMNS.map((c) => (
          <div
            role="listitem"
            key={c.header}
            className="grid grid-cols-4 items-center border-b last:border-0"
          >
            <span className="px-3 py-2 font-medium">{c.header}</span>
            <span className="px-3 py-2">
              <span className="bg-background inline-flex h-8 min-w-44 items-center rounded-lg border px-2.5">
                {c.target}
              </span>
            </span>
            <span className="px-3 py-2">
              <MarkBadge mark={c.mark} />
            </span>
            <span className="text-muted-foreground px-3 py-2">{c.why}</span>
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox defaultChecked />
        {PROTO_COPY.learnLabel}
      </label>
    </div>
  );
}

function Questions() {
  return (
    <div className="flex flex-col gap-3">
      {PROTO_QUESTIONS.map((q) => (
        <fieldset key={q.raw} className="flex flex-col gap-2 rounded-xl border px-4 py-3">
          <legend className="sr-only">
            {q.column} {q.raw}
          </legend>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span>
              <span className="font-medium">«{q.raw}»</span> ở cột {q.column} · {q.count} ô
            </span>
            <MarkBadge mark="ask" />
          </div>
          <div className="flex flex-wrap gap-2">
            {q.options.map((o) => (
              <Button key={o} variant={o === q.answer ? "default" : "outline"} size="sm">
                {o}
              </Button>
            ))}
          </div>
          <label className="text-muted-foreground flex items-center gap-2 text-xs">
            <Checkbox defaultChecked />
            {PROTO_COPY.remember}
          </label>
        </fieldset>
      ))}
    </div>
  );
}

function Preview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PROTO_COUNTS) as Mark[]).map((m) => (
          <span key={m} className="flex items-center gap-1.5 text-sm">
            <MarkBadge mark={m} />
            <span className="tabular-nums">{PROTO_COUNTS[m].toLocaleString("vi-VN")} ô</span>
          </span>
        ))}
      </div>
      <div role="list" className="overflow-x-auto rounded-xl border text-sm">
        <div className="text-muted-foreground flex w-max min-w-full border-b">
          {PROTO_PREVIEW_HEADERS.map((h) => (
            <span key={h} className="w-40 shrink-0 truncate px-3 py-2 font-medium">
              {h}
            </span>
          ))}
        </div>
        {PROTO_ROWS.map((r, i) => (
          <div role="listitem" key={i} className="flex w-max min-w-full border-b last:border-0">
            {r.cells.map((c, j) => (
              <span
                key={j}
                className={cn(
                  "w-40 shrink-0 truncate px-3 py-2",
                  c.mark === "ask" && "bg-warning/10",
                  c.mark === "block" && "bg-destructive/10",
                  c.mark === "fixed" && "bg-info/5",
                )}
                title={PROTO_COPY.marks[c.mark]}
              >
                {c.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Done() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="text-base font-medium">{PROTO_COPY.doneTitle}</span>
      <span className="font-medium">{PROTO_COPY.learned}</span>
      <ul className="text-muted-foreground list-disc pl-5">
        {PROTO_LEARNED.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <span className="text-muted-foreground">{PROTO_COPY.kept}</span>
    </div>
  );
}

const BODIES = [ChooseFile, MapColumns, Questions, Preview, Done];

/** The prototype, in layout «a» (steps across the top) or «b» (steps down a left column). */
export function ImportWizardProto({ layout, start = 1 }: { layout: "a" | "b"; start?: number }) {
  const [step, setStep] = useState(Math.min(Math.max(start, 1), 5));
  const Body = BODIES[step - 1] ?? ChooseFile;
  const vertical = layout === "b";
  const footer = (
    <FrameFooter className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground text-sm">{PROTO_COPY.stepHints[step - 1]}</span>
      <div className="flex gap-2">
        {step > 1 && step < 5 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            {PROTO_COPY.back}
          </Button>
        ) : null}
        {step < 4 ? <Button onClick={() => setStep(step + 1)}>{PROTO_COPY.next}</Button> : null}
        {step === 4 ? (
          <>
            <Badge variant="destructive-light">{PROTO_COPY.applyBlocked}</Badge>
            <Button disabled>{PROTO_COPY.apply}</Button>
          </>
        ) : null}
        {step === 5 ? (
          <>
            <Button variant="outline">{PROTO_COPY.undo}</Button>
            <Button>{PROTO_COPY.openInventory}</Button>
          </>
        ) : null}
      </div>
    </FrameFooter>
  );
  const header = (
    <FrameHeader>
      <FrameTitle>{PROTO_COPY.steps[step - 1]}</FrameTitle>
      <FrameDescription>
        {PROTO_FILE.name} · {PROTO_FILE.rows} dòng
      </FrameDescription>
    </FrameHeader>
  );
  if (vertical) {
    return (
      <div className="flex w-full gap-6">
        <aside className="w-56 shrink-0 pt-2">
          <StepNav step={step} onStep={setStep} vertical />
        </aside>
        <Frame stacked className="min-w-0 flex-1">
          {header}
          <FramePanel>
            <Body />
          </FramePanel>
          {footer}
        </Frame>
      </div>
    );
  }
  return (
    <Frame stacked className="w-full">
      {header}
      <FramePanel className="overflow-x-auto">
        <StepNav step={step} onStep={setStep} vertical={false} />
      </FramePanel>
      <FramePanel>
        <Body />
      </FramePanel>
      {footer}
    </Frame>
  );
}
