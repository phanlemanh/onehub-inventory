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
 * options for screenshots: man, vai, mo, and bang=an hides the control board.
 */
export default async function ButtonsProtoPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const initial: Choice = {
    screen: pick(q.man, ["listings", "contacts"] as const, "listings"),
    role: pick<Role>(q.vai, ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"], "ListAgent"),
    open:
      typeof q.mo === "string"
        ? pick(q.mo, ["menu", "remove", "refused"] as const, "menu")
        : undefined,
  };
  return <ButtonShowcase initial={initial} bare={q.bang === "an"} />;
}
