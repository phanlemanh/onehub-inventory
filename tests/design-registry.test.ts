import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

type Part = {
  name: string;
  props?: string[];
  variants?: Record<string, string[]>;
  defaults?: Record<string, string>;
};
type Entry = { name: string; file: string; level: string; parts: Part[] };

const { components } = JSON.parse(readFileSync("design/component-registry.json", "utf8")) as {
  components: Entry[];
};
const part = (entry: string, name: string) =>
  components.find((c) => c.name === entry)?.parts.find((p) => p.name === name);

describe("component registry", () => {
  it("has one entry per component family", () => {
    expect(components.filter((c) => c.file.endsWith("/sidebar.tsx"))).toHaveLength(1);
    expect(components.filter((c) => c.file.endsWith("/empty.tsx"))).toHaveLength(1);
  });

  it("gives variants only to the part that uses them", () => {
    expect(part("Empty", "EmptyMedia")?.variants?.["variant"]).toEqual(["default", "icon"]);
    expect(part("Empty", "EmptyTitle")?.variants).toBeUndefined();
    expect(part("Sidebar", "SidebarMenuButton")?.variants?.["size"]).toContain("lg");
    expect(part("Sidebar", "SidebarSeparator")?.variants).toBeUndefined();
  });

  it("lists own props and leaves out variants", () => {
    const button = part("Sidebar", "SidebarMenuButton");
    expect(button?.props).toContain("isActive");
    expect(button?.props).not.toContain("variant");
    expect(button?.props).not.toContain("className");
  });

  it("is up to date with the code", () => {
    expect(spawnSync("node", ["tools/design_registry.mjs", "--check"]).status).toBe(0);
  });
});
