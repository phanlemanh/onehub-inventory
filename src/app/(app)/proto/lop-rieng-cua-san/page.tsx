import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sampleInventoryRows } from "../../inventory-sample-rows";

import { LayerShowcase, type Scene } from "./showcase";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: "Bản mẫu 7e" };

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/**
 * Development-only clickable prototype of row 7e (lop-rieng-cua-san) for its scope gate: the inventory with the
 * company's own labels and fields, and three shapes of the review screen. canh = bang-hang | a | b | c; phan = one of
 * the five parts; state = empty | error | forbidden | loading; vai = doc for a read-only role.
 */
export default async function LayerProtoPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const scene: Scene = {
    canh: pick(q.canh, ["bang-hang", "a", "b", "c"] as const, "bang-hang"),
    phan: pick(q.phan, ["nhan", "truong", "tu-dien", "can-cho", "mau"] as const, "truong"),
    state: pick(q.state, ["ready", "empty", "error", "forbidden", "loading"] as const, "ready"),
    readOnly: q.vai === "doc",
  };
  return <LayerShowcase scene={scene} rows={sampleInventoryRows()} />;
}
