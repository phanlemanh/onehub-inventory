// @vitest-environment jsdom
// Row 9b (kiem-vai-theo-man), AC-11 as changed after the scope gate (sua-sau-cong-pham-vi.md, E16): the permission
// button records each decision, both ways, only in builds made with the browser suite's flag, and adds nothing to the
// page — the DOM with and without the permission button is the same.
//   khong-them-gi-vao-trang — a shown button renders exactly the DOM of the bare button.
//   ghi-hai-chieu           — with the flag, the record holds the shown action and the hidden one, each with its scope.
//   tat-co-khong-ghi        — without the flag, nothing is recorded.
//   ban-that-khong-ghi      — the record sits behind the build-time flag (pha: an unguarded call is caught).
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PermittedAction, SessionRoles, type ButtonDecision } from "../src/modules/identity/ui";

const FLAG = "NEXT_PUBLIC_E2E_BUTTON_RECORD";
const SOURCE = join(import.meta.dirname, "../src/modules/identity/ui/permitted-action.tsx");
type W = { __onehubButtons?: ButtonDecision[] };

beforeEach(() => {
  delete (window as unknown as W).__onehubButtons;
});
afterEach(() => {
  cleanup();
  delete process.env[FLAG];
});

describe("khong-them-gi-vao-trang", () => {
  it("a shown button renders exactly the bare button's DOM", () => {
    process.env[FLAG] = "1";
    const bare = render(<button type="button">Mời người</button>).container.innerHTML;
    cleanup();
    const gated = render(
      <SessionRoles roles={["CompanyAdmin"]}>
        <PermittedAction action="inviteMember">
          <button type="button">Mời người</button>
        </PermittedAction>
      </SessionRoles>,
    ).container.innerHTML;
    expect(gated).toBe(bare);
  });
});

describe("ghi-hai-chieu", () => {
  it("records the shown action and the hidden one, each with its scope", () => {
    process.env[FLAG] = "1";
    render(
      <SessionRoles roles={["ListAgent"]}>
        <PermittedAction action="saveView">
          <button type="button">Lưu</button>
        </PermittedAction>
        <PermittedAction action="inviteMember">
          <button type="button">Mời</button>
        </PermittedAction>
      </SessionRoles>,
    );
    const got = (window as unknown as W).__onehubButtons ?? [];
    expect(got).toContainEqual({ action: "saveView", mine: true, shown: true, scope: "own" });
    expect(got).toContainEqual({ action: "inviteMember", mine: true, shown: false, scope: null });
  });
});

describe("tat-co-khong-ghi", () => {
  it("records nothing without the flag", () => {
    render(
      <SessionRoles roles={["CompanyAdmin"]}>
        <PermittedAction action="inviteMember">
          <button type="button">Mời</button>
        </PermittedAction>
      </SessionRoles>,
    );
    expect((window as unknown as W).__onehubButtons).toBeUndefined();
  });
});

/** The problem with the guard of the record in a permission-button source, or null when it is guarded. */
export function guardProblem(source: string): string | null {
  const calls = source
    .split("\n")
    .filter((l) => /\brecordButton\(/.test(l) && !/^\s*function\b/.test(l));
  if (calls.length === 0) return "permitted-action.tsx: khong goi recordButton";
  for (const line of calls)
    if (!line.includes(`process.env.${FLAG} === "1"`))
      return "permitted-action.tsx: recordButton chay khong qua co dung";
  return null;
}

describe("ban-that-khong-ghi", () => {
  it("every call of the record sits behind the build-time flag", () => {
    expect(guardProblem(readFileSync(SOURCE, "utf8"))).toBeNull();
  });

  it("pha: an unguarded call is caught with the pinned message", () => {
    const broken = readFileSync(SOURCE, "utf8").replace(
      `if (process.env.${FLAG} === "1") recordButton(`,
      "recordButton(",
    );
    expect(broken).not.toBe(readFileSync(SOURCE, "utf8"));
    expect(guardProblem(broken)).toBe("permitted-action.tsx: recordButton chay khong qua co dung");
  });
});
