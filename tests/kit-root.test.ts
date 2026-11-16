import { describe, expect, it } from "vitest";

import { chooseInstall } from "../tools/kit-root.mjs";
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
