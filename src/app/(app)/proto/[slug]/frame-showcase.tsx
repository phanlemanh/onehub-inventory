"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/reui/badge";
import { notifyResult } from "@/components/templates/notify";
import { saveWithBanner } from "@/components/templates/screen-banner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ListingStandardStatus } from "@/generated/ontology";
import { formatByKind, statusLabel, statusTone } from "@/lib/format";

/** The flag the browser test sets to mend the broken screen before pressing «Thử lại». */
export const MENDED_FLAG = "frame-proto-mended";

const STATUSES: readonly ListingStandardStatus[] = [
  "Incomplete",
  "Active",
  "Pending",
  "Closed",
  "Hold",
  "Withdrawn",
];

const SAMPLES = [
  { name: "Giá từ 1 tỷ", kind: "money", value: 4_850_000_000 },
  { name: "Giá dưới 1 tỷ", kind: "money", value: 320_000_000 },
  { name: "Giá dưới 1 triệu", kind: "money", value: 999_999 },
  { name: "Diện tích", kind: "area", value: 75.5 },
  { name: "Số đếm", kind: "count", value: 2418 },
  { name: "Ngày", kind: "date", value: "2026-11-05" },
  { name: "Ngày giờ", kind: "datetime", value: "2026-11-05T07:30:00Z" },
  { name: "Số điện thoại", kind: "phone", value: "0900000001" },
  { name: "Ô trống", kind: "money", value: null },
] as const;

/** Throws while rendering on the client until the browser test mends it, to show the screen error state. */
export function BrokenOnClient() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reason: render once on the client before breaking
  useEffect(() => setMounted(true), []);
  if (mounted && window.sessionStorage.getItem(MENDED_FLAG) !== "1") {
    throw new Error("prototype screen broken on purpose");
  }
  return null;
}

function SaveDemo() {
  const [note, setNote] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function save() {
    if (note.trim() === "") {
      setFieldError("Bạn nhập ít nhất một ký tự rồi lưu.");
      return;
    }
    setFieldError(null);
    const saved = await saveWithBanner(async () => {
      const response = await fetch("/", { method: "HEAD", cache: "no-store" });
      if (!response.ok) throw new Error(`save failed: ${response.status}`);
    });
    if (saved) notifyResult({ message: "Đã lưu ghi chú thử.", undo: () => setNote("") });
  }

  return (
    <div className="flex flex-col gap-4">
      <Field data-invalid={fieldError ? true : undefined}>
        <FieldLabel htmlFor="frame-proto-note">Ghi chú thử</FieldLabel>
        <Input
          id="frame-proto-note"
          value={note}
          aria-invalid={fieldError ? true : undefined}
          onChange={(event) => setNote(event.target.value)}
        />
        {fieldError ? <FieldError>{fieldError}</FieldError> : null}
      </Field>
      <div>
        <Button onClick={() => void save()}>Lưu thử</Button>
      </div>
    </div>
  );
}

/** The design-pass prototype of the frame: formatters, status colours, the three channels, the page states. */
export function FrameShowcase({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Định dạng</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:max-w-md">
          {SAMPLES.map((sample) => (
            <div key={sample.name} className="contents">
              <dt className="text-muted-foreground">{sample.name}</dt>
              <dd data-kind={sample.kind}>{formatByKind(sample.kind, sample.value)}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Màu trạng thái</h2>
        <div className="flex flex-wrap gap-2" data-slot="status-badges">
          {STATUSES.map((status) => (
            <Badge key={status} variant={statusTone(status)} data-status={status}>
              {statusLabel(status)}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <Badge key={status} variant={statusTone(status)}>
              {statusLabel(status, "lease")}
            </Badge>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Kênh thông báo</h2>
        <SaveDemo />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Trạng thái toàn trang</h2>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <Link className="underline" href={`/proto/${slug}?state=error`}>
              Màn hỏng khi dựng
            </Link>
          </li>
          <li>
            <Link className="underline" href={`/proto/${slug}?state=slow`}>
              Màn tải chậm
            </Link>
          </li>
          <li>
            <Link className="underline" href={`/proto/${slug}?state=session-expired`}>
              Phiên hết hạn
            </Link>
          </li>
          <li>
            <Link className="underline" href="/no-such-page">
              Địa chỉ không có
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
