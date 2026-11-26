import { describe, expect, it } from "vitest";

import { chooseInstall, installEntries } from "../tools/kit-root.mjs";
import { tempDir } from "./support/temp-dir";

const dir = (name: string) => tempDir(name);

describe("chooseInstall", () => {
  const project = dir("project-");
  const user = dir("user-");
  const entries = [
    { scope: "user", installPath: user },
    { scope: "project", projectPath: "/repo", installPath: project },
  ];

  it("prefers the install for this checkout", () => {
    expect(chooseInstall(entries, ["/repo"])).toBe(project);
  });

  it("falls back to the user-scope install", () => {
    expect(chooseInstall(entries, ["/other"])).toBe(user);
  });

  it("returns nothing when the install is gone", () => {
    expect(chooseInstall([{ scope: "user", installPath: "/missing" }], ["/repo"])).toBe("");
  });
});

describe("installEntries", () => {
  const entry = { scope: "user", installPath: "/kit" };

  it("reads the acceptance-gate install of the delivery-loop marketplace", () => {
    expect(installEntries({ plugins: { "acceptance-gate@delivery-loop": [entry] } })).toEqual([
      entry,
    ]);
  });

  it("ignores an install left from the old acceptance-gate-kit marketplace", () => {
    expect(installEntries({ plugins: { "acceptance-gate@acceptance-gate-kit": [entry] } })).toEqual(
      [],
    );
  });

  it("returns nothing for a registry without plugins", () => {
    expect(installEntries({})).toEqual([]);
  });
});
