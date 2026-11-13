"use client";

// PROTOTYPE (row 3e design pass) — branch proto/3e-hoi-dau-chu only. Labels are written here for the prototype; the
// build takes them from ontology/labels.yaml.
import { FlagIcon, MessageCircleQuestionIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { openShare } from "@/lib/share";

/** Sample holder (MAU) until row 10: someone else, the viewer, or nobody — from the listing's sample number. */
export type Holder = { kind: "other"; name: string } | { kind: "self" } | { kind: "none" };

export function sampleHolderOf(listingId: string): Holder {
  const n = Number.parseInt(listingId.slice(-12), 16) || 0;
  if (n % 5 === 0) return { kind: "none" };
  if (n % 5 === 1) return { kind: "self" };
  return { kind: "other", name: `[Tên] ${String((n % 7) + 1).padStart(2, "0")}` };
}

const ASK = "Hỏi đầu chủ";
const UNHELD = "Căn chưa có đầu chủ giữ";

export function askMessage(unit: string, building: string, id: string, origin: string) {
  const url = new URL("/inventory", origin);
  url.searchParams.set("ho-so", id);
  return { text: `Hỏi về căn ${unit} · ${building}`, url: url.toString() };
}

/** The bar at the foot of the record: «Hỏi đầu chủ · [Tên]», off when nobody holds the unit, absent for the holder. */
export function AskListAgentBar({
  id,
  unit,
  building,
  inHead = false,
}: {
  id: string;
  unit: string;
  building: string;
  inHead?: boolean;
}) {
  const permitted = useActionPermission();
  const holder = sampleHolderOf(id);
  if (!permitted("viewListings", false) || holder.kind === "self") return null;
  const ask = () => {
    void openShare(askMessage(unit, building, id, window.location.origin), navigator).then(
      (outcome) => {
        if (outcome === "da-chep") toast("Đã chép tin hỏi");
        else if (outcome === "loi") toast.error("Máy này không chép hay chia sẻ được");
      },
    );
  };
  if (inHead)
    return (
      <Button size="sm" disabled={holder.kind === "none"} data-action="viewListings" onClick={ask}>
        {holder.kind === "none" ? null : <MessageCircleQuestionIcon aria-hidden="true" />}
        {holder.kind === "none" ? UNHELD : `${ASK} · ${holder.name}`}
      </Button>
    );
  return (
    <div data-slot="record-footer" className="border-t bg-background p-4">
      <Button
        className="w-full max-md:h-11"
        disabled={holder.kind === "none"}
        data-action="viewListings"
        onClick={ask}
      >
        {holder.kind === "none" ? null : <MessageCircleQuestionIcon aria-hidden="true" />}
        {holder.kind === "none" ? UNHELD : `${ASK} · ${holder.name}`}
      </Button>
    </div>
  );
}

const RESULT = {
  "chia-se": "Đã mở bảng chia sẻ",
  "da-chep": "Đã chép",
  huy: null,
  loi: "Máy này không chép hay chia sẻ được — chép tay nội dung dưới đây",
} as const;

/** «Báo sai thông tin» on the properties section: pick the wrong field, type the right value, share. */
export function ReportUnitError({
  unit,
  building,
  subdivision,
  fields,
}: {
  unit: string;
  building: string;
  subdivision: string;
  fields: readonly { name: string; shown: string }[];
}) {
  const permitted = useActionPermission();
  const [open, setOpen] = useState(false);
  const [field, setField] = useState(fields[0]?.name ?? "");
  const [right, setRight] = useState("");
  const [basis, setBasis] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  if (!permitted("readCatalog", false)) return null;
  const shown = fields.find((f) => f.name === field)?.shown ?? "—";
  const lines = [
    `Báo sai thông tin căn ${unit}`,
    `Toà: ${building}`,
    `Khu: ${subdivision}`,
    `Thuộc tính: ${field}`,
    `Đang hiện: ${shown}`,
    `Đúng là: ${right.trim()}`,
  ];
  if (basis.trim()) lines.push(`Ghi chú: ${basis.trim()}`);
  const text = lines.join("\n");
  const change = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setRight("");
      setBasis("");
      setResult(null);
      setMissing(false);
    }
  };
  const send = () => {
    if (right.trim() === "") {
      setMissing(true);
      return;
    }
    void openShare({ text }, navigator).then((outcome) => setResult(RESULT[outcome]));
  };
  return (
    <FormDialog
      trigger={{
        render: <Button variant="ghost" size="sm" data-action="readCatalog" />,
        label: (
          <>
            <FlagIcon aria-hidden="true" />
            Báo sai thông tin
          </>
        ),
      }}
      title={`Báo sai thông tin căn ${unit}`}
      description="Thuộc tính căn lấy từ danh mục dùng chung, sàn không tự sửa. Tin này để đội vận hành sửa; bạn tự chọn nơi gửi."
      submitLabel="Chép và mở bảng chia sẻ"
      busyLabel="Chép và mở bảng chia sẻ"
      busy={false}
      open={open}
      onOpenChange={change}
      onSubmit={send}
      slot="report-unit-error"
    >
      <Field>
        <FieldLabel>Thuộc tính sai</FieldLabel>
        <Select
          value={field}
          onValueChange={(v) => setField(String(v))}
          items={fields.map((f) => ({ value: f.name, label: f.name }))}
        >
          <SelectTrigger className="w-full">
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
        <p className="text-xs text-muted-foreground">Đang hiện: {shown}</p>
      </Field>
      <Field data-invalid={missing || undefined}>
        <FieldLabel htmlFor="bao-sai-dung">Giá trị đúng</FieldLabel>
        <Input
          id="bao-sai-dung"
          value={right}
          maxLength={200}
          aria-invalid={missing || undefined}
          onChange={(e) => {
            setRight(e.target.value);
            setMissing(false);
          }}
        />
        {missing ? <p className="text-xs text-destructive">Gõ giá trị đúng trước khi gửi.</p> : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="bao-sai-can-cu">Căn cứ</FieldLabel>
        <Textarea
          id="bao-sai-can-cu"
          value={basis}
          maxLength={500}
          placeholder="Sổ hồng, bản vẽ, hợp đồng…"
          onChange={(e) => setBasis(e.target.value)}
        />
      </Field>
      {result ? (
        <p role="status" className="text-sm">
          {result}
        </p>
      ) : null}
      {result === RESULT.loi ? (
        <Textarea readOnly aria-label="Nội dung báo sai" value={text} rows={7} />
      ) : null}
    </FormDialog>
  );
}
