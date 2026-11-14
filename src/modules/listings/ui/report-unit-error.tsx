"use client";

import { FlagIcon } from "lucide-react";
import { useState } from "react";

import { useActionPermission } from "@/components/candidate/action-permission";
import { FormDialog } from "@/components/candidate/form-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { openShare, type ShareOutcome } from "@/lib/share";

import {
  REPORT_BASIS_MAX,
  REPORT_RIGHT_MAX,
  reportReady,
  reportTitle,
  unitErrorReport,
} from "../messages";
import { ASK_COPY, type AskWords } from "./ask-copy";

/** One catalog property the person may report wrong: its label and the value the record shows. */
export type ReportField = { name: string; shown: string };

const RESULT: Record<ShareOutcome, string | null> = {
  "chia-se": ASK_COPY.report.opened,
  "da-chep": ASK_COPY.report.copied,
  huy: null,
  loi: ASK_COPY.report.failed,
};

/**
 * label(ReportUnitError) on a listing's properties (row 3e): pick the wrong catalog property, see what the record shows,
 * type the right value and a basis, then the report goes out through the device's share sheet, or is copied. Nothing
 * is written to the listing. Shows when the permission table lets the viewer read the unit catalog.
 */
export function ReportUnitError({
  unit,
  fields,
  words,
}: {
  unit: {
    unitNumber: string;
    building: string;
    subdivision: string;
    buildingLabel: string;
    subdivisionLabel: string;
  };
  fields: readonly ReportField[];
  words: AskWords;
}) {
  const permitted = useActionPermission();
  const [open, setOpen] = useState(false);
  const [field, setField] = useState(fields[0]?.name ?? "");
  const [right, setRight] = useState("");
  const [basis, setBasis] = useState("");
  const [missing, setMissing] = useState(false);
  const [result, setResult] = useState<ShareOutcome | null>(null);
  if (!permitted("readCatalog", false)) return null;

  const shown = fields.find((f) => f.name === field)?.shown ?? "";
  const report = unitErrorReport({
    reportLabel: words.report,
    unitLabel: words.unit,
    ...unit,
    field,
    shown,
    right,
    basis,
  });
  const change = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setRight("");
      setBasis("");
      setMissing(false);
      setResult(null);
    }
  };
  // The share sheet is opened inside the click, before any await: a device refuses a share that lost the gesture.
  const send = () => {
    if (!reportReady(right)) {
      setMissing(true);
      return;
    }
    void openShare({ text: report }, navigator).then(setResult);
  };
  const said = result === null ? null : RESULT[result];

  return (
    <FormDialog
      trigger={{
        render: (
          <Button
            variant="ghost"
            size="sm"
            data-action="readCatalog"
            data-slot="report-unit-error-open"
          />
        ),
        label: (
          <>
            <FlagIcon aria-hidden="true" />
            {words.report}
          </>
        ),
      }}
      title={reportTitle(words.report, words.unit, unit.unitNumber)}
      description={ASK_COPY.report.description}
      submitLabel={ASK_COPY.report.submit}
      busyLabel={ASK_COPY.report.submit}
      busy={false}
      open={open}
      onOpenChange={change}
      onSubmit={send}
      slot="report-unit-error"
    >
      <Field>
        <FieldLabel>{ASK_COPY.report.field}</FieldLabel>
        <Select
          value={field}
          onValueChange={(value) => setField(String(value))}
          items={fields.map((f) => ({ value: f.name, label: f.name }))}
        >
          <SelectTrigger aria-label={ASK_COPY.report.field}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fields.map((f) => (
              <SelectItem key={f.name} value={f.name}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p data-slot="report-shown" className="text-xs text-muted-foreground">
          {ASK_COPY.report.shown(shown)}
        </p>
      </Field>
      <Field data-invalid={missing || undefined}>
        <FieldLabel htmlFor="report-unit-error-right">{ASK_COPY.report.right}</FieldLabel>
        <Input
          id="report-unit-error-right"
          value={right}
          maxLength={REPORT_RIGHT_MAX}
          aria-invalid={missing || undefined}
          aria-describedby={missing ? "report-unit-error-missing" : undefined}
          onChange={(e) => {
            setRight(e.target.value);
            setMissing(false);
          }}
        />
        {missing ? (
          <p id="report-unit-error-missing" className="text-xs text-destructive">
            {ASK_COPY.report.missing}
          </p>
        ) : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="report-unit-error-basis">{ASK_COPY.report.basis}</FieldLabel>
        <Textarea
          id="report-unit-error-basis"
          value={basis}
          maxLength={REPORT_BASIS_MAX}
          placeholder={ASK_COPY.report.basisPlaceholder}
          onChange={(e) => setBasis(e.target.value)}
        />
      </Field>
      {said === null ? null : (
        <p role="status" data-slot="report-result" className="text-sm">
          {said}
        </p>
      )}
      {result === "loi" ? (
        <Textarea readOnly aria-label={ASK_COPY.messageLabel} value={report} rows={7} />
      ) : null}
    </FormDialog>
  );
}
