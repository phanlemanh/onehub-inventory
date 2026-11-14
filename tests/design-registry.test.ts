import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// The register is written by the design-assembly tool, in the shape of its contract: one entry per
// exported component, with the file it is in, its level, where it comes from, its props, and its
// variants written `axis=value`.
type Entry = {
  name: string;
  file: string;
  level: string;
  source: "library" | "own";
  props?: string[];
  variants?: string[];
  defaults?: Record<string, string>;
};

const { components } = JSON.parse(readFileSync("design/component-registry.json", "utf8")) as {
  components: Entry[];
};
const entry = (name: string) => components.find((c) => c.name === name);

describe("component registry", () => {
  it("has one entry per exported component, each naming its file", () => {
    expect(components.filter((c) => c.name === "Sidebar")).toHaveLength(1);
    expect(entry("SidebarMenuButton")?.file).toBe("src/components/ui/sidebar.tsx");
    expect(entry("EmptyTitle")?.file).toBe("src/components/ui/empty.tsx");
  });

  it("gives variants only to the component that uses them", () => {
    expect(entry("EmptyMedia")?.variants).toEqual(["variant=default", "variant=icon"]);
    expect(entry("EmptyTitle")?.variants).toBeUndefined();
    expect(entry("SidebarMenuButton")?.variants).toContain("size=lg");
    expect(entry("SidebarSeparator")?.variants).toBeUndefined();
  });

  it("lists own props and leaves out variants", () => {
    const button = entry("SidebarMenuButton");
    expect(button?.props).toContain("isActive");
    expect(button?.props).not.toContain("variant");
    expect(button?.props).not.toContain("className");
  });

  it("counts both bought libraries as libraries, and the templates folder as templates", () => {
    expect(entry("SidebarMenuButton")?.source).toBe("library");
    expect(components.find((c) => c.file.startsWith("src/components/reui/"))?.source).toBe(
      "library",
    );
    expect(entry("PageHeader")?.level).toBe("template");
    expect(entry("PageHeader")?.source).toBe("own");
  });

  it("is up to date with the code", () => {
    expect(spawnSync("node", ["tools/design-assembly/components.mjs"]).status).toBe(0);
  });
});
