import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Role } from "@/generated/ontology";

import { PROTO_COPY } from "./copy";
import { ButtonShowcase, type Choice } from "./showcase";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: PROTO_COPY.title };

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/**
 * Development-only clickable prototype of row 9e (bo-nut-theo-quyen) for its scope gate. Query parameters fix the
 * options for screenshots: man, vai, tb, dong, chu, khac, hop, mo, and bang=an hides the control board.
 */
export default async function ButtonsProtoPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const initial: Choice = {
    screen: pick(q.man, ["listings", "contacts"] as const, "listings"),
    role: pick<Role>(q.vai, ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"], "ListAgent"),
    toolbar: pick(q.tb, ["A", "B", "C"] as const, "C"),
    row: pick(q.dong, ["R1", "R2", "R3"] as const, "R1"),
    words: pick(q.chu, ["H1", "H2"] as const, "H1"),
    others: pick(q.khac, ["O1", "O2"] as const, "O1"),
    confirm: pick(q.hop, ["X1", "X2", "X3"] as const, "X1"),
    open:
      typeof q.mo === "string"
        ? pick(q.mo, ["menu", "remove", "record", "refused"] as const, "menu")
        : undefined,
  };
  return <ButtonShowcase initial={initial} bare={q.bang === "an"} />;
}
