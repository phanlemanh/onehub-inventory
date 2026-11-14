"use client";

import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FramedList, ListFace, type FramedListRow } from "@/components/candidate/framed-list";
import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { PageSkeleton } from "@/components/templates/page-skeleton";
import { PageState } from "@/components/templates/page-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatDate, formatMoneyPrecise } from "@/lib/format";
import { PermittedAction, usePermitted } from "@/modules/identity/ui";

import {
  OWN_ITEM_LIMIT,
  checkFeeDraft,
  formatRatePercent,
  netToSeller,
  parseRatePercent,
  type FeeItemDraft,
  type FeeItemKind,
  type FeeProblem,
} from "../fee-schedule";
import type { FeeItemSource, FeeItemView, FeeScheduleView } from "../fee-store";
import { label } from "../index";

import { FEE_COPY as C, FEE_PROBLEM_COPY as P } from "./fee-copy";

/** Where the part reads and saves the schedule. */
export const FEE_API = "/api/v1/company/fee-schedule";
const EXAMPLE_PRICE = 3_000_000_000;

/** One row of the draft the person is changing; `key` stays the same while its name or code does not exist yet. */
interface DraftItem {
  key: string;
  code?: string;
  kind: FeeItemKind;
  name: string;
  /** The rate as typed, Vietnamese style («1,5»). */
  rate: string;
  included: boolean;
  /** Whether the person may change the name (an own item added now, or one they chose to rename). */
  naming: boolean;
  source: FeeItemSource | null;
  defaults: FeeItemView["defaults"];
}

const fromView = (items: readonly FeeItemView[]): DraftItem[] =>
  items.map((i) => ({
    key: i.code,
    code: i.code,
    kind: i.kind,
    name: i.name,
    rate: formatRatePercent(i.rateBasisPoints),
    included: i.included,
    naming: false,
    source: i.source,
    defaults: i.defaults,
  }));

/** The draft as the API takes it; a rate that is not a number stays NaN so the check names it. */
function toBody(draft: readonly DraftItem[]): FeeItemDraft[] {
  return draft.map((d) => {
    const parsed = parseRatePercent(d.rate);
    const out: FeeItemDraft = { rateBasisPoints: parsed ?? Number.NaN, included: d.included };
    if (d.code !== undefined) out.code = d.code;
    const renamed =
      d.kind === "Own" && (d.source === null || d.source.kind === "added" || d.naming);
    if (renamed) out.name = d.name;
    return out;
  });
}

function sourceLine(d: DraftItem): string {
  const s = d.source;
  const text =
    s === null
      ? C.sourceDraft
      : s.kind === "default"
        ? C.sourceDefault
        : s.kind === "changed"
          ? C.sourceChanged(s.by, formatDate(s.at))
          : C.sourceAdded(s.by, formatDate(s.at));
  return d.kind === "Law" ? `${C.byLaw} · ${text}` : text;
}

type Load = { kind: "loading" } | { kind: "error" } | { kind: "ready"; view: FeeScheduleView };

/**
 * The fee part of the company layer screen (row 19): the company's fee items on the shared framed list of the
 * «danh sách khung» family, like the members screen. CompanyAdmin (setFeeSchedule) switches items on or off, changes
 * an own item's rate, adds, renames, removes and resets own items, and saves the whole schedule once; every other role
 * reads it. The footer works out the net to seller of a 3 tỷ listing as the person types, before saving.
 */
export function FeePart({ screenTitle }: { screenTitle: string }) {
  const [load, setLoad] = useState<Load>({ kind: "loading" });
  const [tick, setTick] = useState(0);
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [sent, setSent] = useState<FeeProblem[]>([]);
  const [added, setAdded] = useState(0);
  const permitted = usePermitted();
  const can = permitted("setFeeSchedule");

  useEffect(() => {
    let alive = true;
    fetch(FEE_API, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as FeeScheduleView;
      })
      .then(
        (view) => {
          if (!alive) return;
          setLoad({ kind: "ready", view });
          setDraft(fromView(view.items));
          setSent([]);
        },
        () => alive && setLoad({ kind: "error" }),
      );
    return () => {
      alive = false;
    };
  }, [tick]);

  const body = useMemo(() => toBody(draft), [draft]);
  const problems = useMemo(() => {
    const known = new Set(
      draft.filter((d) => d.kind === "Own" && d.code !== undefined).map((d) => d.code!),
    );
    const names = new Map(draft.map((d) => [d.code ?? d.key, d.name]));
    return checkFeeDraft(body, known, (code) => names.get(code) ?? "");
  }, [body, draft]);
  const shown = sent.length > 0 ? sent : problems;
  const atIndex = (i: number) => shown.find((p) => p.index === i);
  const general = shown.filter((p) => p.index === undefined);
  const dirty =
    load.kind === "ready" &&
    JSON.stringify(body) !== JSON.stringify(toBody(fromView(load.view.items)));
  const ownCount = draft.filter((d) => d.kind === "Own").length;
  const net = netToSeller(
    EXAMPLE_PRICE,
    "Included",
    body.map((b) => ({
      rateBasisPoints: Number.isFinite(b.rateBasisPoints) ? b.rateBasisPoints : 0,
      included: b.included,
    })),
  );

  const change = (key: string, patch: Partial<DraftItem>) => {
    setSent([]);
    setDraft((list) => list.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  };
  const addItem = () => {
    if (ownCount >= OWN_ITEM_LIMIT) {
      notifyResult({ message: C.limitReached });
      return;
    }
    setSent([]);
    setAdded((n) => n + 1);
    setDraft((list) => [
      ...list,
      {
        key: `moi-${added + 1}`,
        kind: "Own",
        name: "",
        rate: "0",
        included: true,
        naming: true,
        source: null,
        defaults: null,
      },
    ]);
  };

  const header = (
    <PageHeader
      title={screenTitle}
      action={
        <PermittedAction action="setFeeSchedule">
          <Button onClick={addItem} disabled={load.kind !== "ready"} data-slot="fee-add">
            {label("AddFeeItem")}
          </Button>
        </PermittedAction>
      }
    />
  );

  if (load.kind === "loading")
    return (
      <div className="flex flex-col gap-6" data-part="thue-phi" data-state="loading">
        {header}
        <PageSkeleton />
      </div>
    );
  if (load.kind === "error")
    return (
      <div className="flex flex-col gap-6" data-part="thue-phi" data-state="error">
        {header}
        <PageState
          kind="error"
          onRetry={() => {
            setLoad({ kind: "loading" });
            setTick((t) => t + 1);
          }}
        />
      </div>
    );

  const rows: FramedListRow[] = draft.map((d, i) => {
    const problem = atIndex(i);
    const name = d.name || C.newName;
    const resettable =
      d.defaults !== null &&
      d.source !== null &&
      d.source.kind !== "default" &&
      (parseRatePercent(d.rate) !== d.defaults.rateBasisPoints ||
        d.included !== d.defaults.included ||
        d.name !== d.defaults.name);
    const menu =
      can && d.kind === "Own" ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label={C.more(name)} data-slot="fee-more" />
            }
          >
            <MoreHorizontal aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => change(d.key, { naming: true })}>
              {label("RenameFeeItem")}
            </DropdownMenuItem>
            {resettable ? (
              <DropdownMenuItem
                onClick={() =>
                  change(d.key, {
                    rate: formatRatePercent(d.defaults!.rateBasisPoints),
                    included: d.defaults!.included,
                    name: d.defaults!.name,
                    naming: false,
                  })
                }
              >
                {label("ResetFeeItem")}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setSent([]);
                setDraft((list) => list.filter((x) => x.key !== d.key));
              }}
            >
              {label("RemoveFeeItem")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null;
    const rate =
      can && d.kind === "Own" ? (
        <span className="flex items-center gap-1">
          <span className="w-20">
            <Input
              inputMode="decimal"
              value={d.rate}
              aria-label={C.rateField(name)}
              aria-invalid={problem?.problem.startsWith("rate") ? true : undefined}
              onChange={(e) => change(d.key, { rate: e.target.value })}
              data-slot="fee-rate"
            />
          </span>
          <span className="text-sm text-muted-foreground">%</span>
        </span>
      ) : (
        <span className="text-sm tabular-nums" data-slot="fee-rate-text">
          {formatRatePercent(parseRatePercent(d.rate) ?? 0)}%
        </span>
      );
    return {
      id: d.key,
      data: { "data-fee": d.code ?? d.key },
      main:
        can && d.kind === "Own" && d.naming ? (
          <span className="flex min-w-0 flex-col gap-1">
            <Input
              value={d.name}
              aria-label={C.nameField}
              aria-invalid={problem?.problem.startsWith("name") ? true : undefined}
              onChange={(e) => change(d.key, { name: e.target.value })}
              data-slot="fee-name"
            />
            <span className="truncate text-xs text-muted-foreground">{sourceLine(d)}</span>
          </span>
        ) : (
          <ListFace name={name} sub={sourceLine(d)} avatar={false} />
        ),
      control: (
        <>
          {rate}
          <Switch
            checked={d.included}
            disabled={!can}
            aria-label={C.includeSwitch(name)}
            onCheckedChange={(on) => change(d.key, { included: on })}
            data-slot="fee-include"
          />
          {/* Every row keeps the same width at its end, with or without a menu. */}
          <span className="flex size-8 items-center justify-center">{menu}</span>
        </>
      ),
      ...(problem ? { note: P[problem.problem] } : {}),
    };
  });

  const includedCount = draft.filter((d) => d.included).length;
  return (
    <div className="flex flex-col gap-6" data-part="thue-phi" data-state="ready">
      {header}
      <p className="text-sm text-muted-foreground">{C.why}</p>
      <FramedList
        slot="fee-frame"
        title={label("FeeSchedule")}
        count={C.count(draft.length, includedCount)}
        rows={rows}
        controlWidth="fit"
        footer={{
          note: (
            <span className="flex flex-col gap-1">
              <span data-slot="fee-example">{C.example(formatMoneyPrecise(net))}</span>
              {general.map((p) => (
                <span key={p.problem} role="status" className="text-destructive">
                  {P[p.problem]}
                </span>
              ))}
              {can ? null : <span data-slot="fee-read-only">{C.readOnly}</span>}
            </span>
          ),
          action: (
            <PermittedAction action="setFeeSchedule">
              <SaveFeeButton
                items={body}
                disabled={!dirty || problems.length > 0}
                onProblems={setSent}
                onSaved={(view) => {
                  setLoad({ kind: "ready", view });
                  setDraft(fromView(view.items));
                }}
              />
            </PermittedAction>
          ),
        }}
      />
    </div>
  );
}

/** Lưu: sends the whole schedule in one PUT; a wrong schedule comes back as the items to name. */
function SaveFeeButton({
  items,
  disabled,
  onProblems,
  onSaved,
}: {
  items: readonly FeeItemDraft[];
  disabled: boolean;
  onProblems: (problems: FeeProblem[]) => void;
  onSaved: (view: FeeScheduleView) => void;
}) {
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/company/fee-schedule", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (res.status === 400) {
        const json = (await res.json()) as { problems?: FeeProblem[] };
        onProblems(json.problems ?? []);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      onSaved((await res.json()) as FeeScheduleView);
      notifyResult({ message: C.saved });
    } catch {
      notifyResult({ message: C.failed });
    } finally {
      setSaving(false);
    }
  };
  return (
    <Button onClick={save} disabled={disabled || saving} data-slot="fee-save">
      {saving ? C.saving : C.save}
    </Button>
  );
}
