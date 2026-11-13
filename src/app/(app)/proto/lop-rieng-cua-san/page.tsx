import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { sampleInventoryRows } from "../../inventory-sample-rows";

import { PARTS, PROTO_7E, type Part } from "./copy";
import { LayerShowcase, type Shape } from "./showcase";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: PROTO_7E.screen };

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/**
 * Development-only clickable prototype of row 7e (lop-rieng-cua-san) for its scope gate. The shape comes from
 * ?dang= or, so the App Shell's second-column links keep it, from a cookie: a = one grid per part chosen in the second
 * column; b = one page of compact groups after ReUI settings-4; bang-hang = the inventory with the company's words.
 * ?phan= is the part the second column opens; ?mo=them opens the add form of a custom field.
 */
export default async function LayerProtoPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const shapes = ["a", "b", "bang-hang"] as const;
  const stored = (await cookies()).get(PROTO_7E.shapeCookie)?.value;
  const shape: Shape = pick(q.dang, shapes, pick(stored, shapes, "a"));
  const part: Part = pick(q.phan, PARTS, shape === "b" ? "nhan" : "truong");
  return (
    <LayerShowcase
      shape={shape}
      part={part}
      rows={sampleInventoryRows()}
      formOpen={q.mo === "them"}
    />
  );
}
