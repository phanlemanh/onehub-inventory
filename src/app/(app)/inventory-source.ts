import "server-only";

// The one source of the inventory (row 10, Hỏi-6 B): with a database, the signed-in company's listings read through the
// listings module's door; without one, on a development machine only, the sample company in memory. Real data and the
// sample company — with its ?vai= stand-in for a role — never stand side by side. Wrapped in React's cache, so the App
// Shell (top-bar search, geography tree) and the inventory page share one read per render.
import { cache } from "react";

import { databaseConfigured } from "@/modules/identity/server";
import type { InventoryData } from "@/modules/listings";
import { myInventory } from "@/modules/listings/server";

import { sampleInventoryData } from "./inventory-sample-rows";

export type InventorySource =
  | { kind: "ready"; data: InventoryData; live: boolean }
  | { kind: "signed-out" }
  | { kind: "forbidden" }
  | { kind: "unreadable" };

/** Where the inventory comes from: the database when one is configured; the sample only off production. */
export function sourceKind(env: {
  database: boolean;
  production: boolean;
}): "database" | "sample" | "none" {
  if (env.database) return "database";
  return env.production ? "none" : "sample";
}

/** The inventory of this render. */
export const inventorySource = cache(async (): Promise<InventorySource> => {
  const kind = sourceKind({
    database: databaseConfigured(),
    production: process.env.NODE_ENV === "production",
  });
  if (kind === "sample") return { kind: "ready", data: sampleInventoryData(), live: false };
  if (kind === "none") return { kind: "unreadable" };
  const read = await myInventory();
  return read.kind === "ready" ? { kind: "ready", data: read.data, live: true } : read;
});
