// @vitest-environment jsdom
// Row 9e (bo-nut-theo-quyen), AC-2: the shared action button decides from the permission table.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ACTIONS, type Role } from "../../generated/ontology";
import {
  actionVisibility,
  allowedScope,
  OTHERS_RECORD,
  type ActionName,
  type Visibility,
} from "./permissions";
import { ROLES } from "./roles";
import { PermittedAction, SessionRoles } from "./ui";

afterEach(() => cleanup());

// Written before the code (evals.yaml E2): 4 roles × 22 rows (10 live after row 7d, 5 drafts of the listing board, 7
// drafts of row 9e) × 2 records = 176. Row 2c adds four live saved-view rows (K-22): 4 × 26 × 2 = 208.
const CELLS_WRITTEN_BEFORE = 208;
// The owner's choice O1 at the scope gate: own scope on someone else's record hides the button.
const OTHERS_WRITTEN_BEFORE: Visibility = "hide";

type VisibilityFn = (roles: readonly Role[], action: ActionName, mine: boolean) => Visibility;

/** The rule, read cell by cell from the generated table for one role. */
function expected(role: Role, action: ActionName, mine: boolean): Visibility {
  const cell = ACTIONS.find((a) => a.name === action)?.scope[role];
  if (cell === "company") return "show";
  if (cell === "own") return mine ? "show" : OTHERS_WRITTEN_BEFORE;
  return "hide";
}

function everyCell(fn: VisibilityFn): { count: number; failures: string[] } {
  const failures: string[] = [];
  let count = 0;
  for (const role of ROLES) {
    for (const { name } of ACTIONS) {
      for (const mine of [true, false]) {
        count += 1;
        if (fn([role], name, mine) !== expected(role, name, mine))
          failures.push(`nut-theo-bang-du-o: ${role} × ${name} × ${mine ? "mine" : "others"}`);
      }
    }
  }
  return { count, failures };
}

/** The records of someone else, for every role with an own cell. */
function othersRecords(fn: VisibilityFn): string[] {
  const failures: string[] = [];
  for (const role of ROLES) {
    for (const { name, scope } of ACTIONS) {
      if (scope[role] !== "own") continue;
      if (fn([role], name, false) !== OTHERS_WRITTEN_BEFORE)
        failures.push(`dong-nguoi-khac: ${role} × ${name}`);
      if (fn([role], name, true) !== "show")
        failures.push(`dong-nguoi-khac: ${role} × ${name} × mine`);
    }
  }
  return failures;
}

/** Break of `dong-nguoi-khac`: own scope treated as company scope. */
const ownAsCompany: VisibilityFn = (roles, action) =>
  allowedScope(roles, action) === null ? "hide" : "show";

const COMBOS: Role[][] = Array.from({ length: 15 }, (_, i) =>
  ROLES.filter((_, b) => (i + 1) & (1 << b)),
);

describe("nut-theo-bang-du-o", () => {
  it("every role × every row of the table × own and someone else's record", () => {
    const r = everyCell(actionVisibility);
    console.info(`nut-theo-bang-du-o: ${r.count} cells (4 × ${ACTIONS.length} × 2)`);
    expect(r.failures).toEqual([]);
    expect(r.count).toBe(4 * ACTIONS.length * 2);
    expect(r.count).toBe(CELLS_WRITTEN_BEFORE);
  });

  it("PermittedAction renders its button exactly where the rule shows it", () => {
    let rendered = 0;
    for (const role of ROLES) {
      for (const { name } of ACTIONS) {
        for (const mine of [true, false]) {
          const { unmount } = render(
            <SessionRoles roles={[role]}>
              <PermittedAction action={name} mine={mine}>
                <button type="button">nút</button>
              </PermittedAction>
            </SessionRoles>,
          );
          const shown = screen.queryByRole("button") !== null;
          expect(shown, `${role} × ${name} × ${mine}`).toBe(expected(role, name, mine) === "show");
          if (shown) rendered += 1;
          unmount();
        }
      }
    }
    expect(rendered).toBeGreaterThan(0);
  });

  it("outside the frame there are no roles, so no button", () => {
    render(
      <PermittedAction action="readCompany">
        <button type="button">nút</button>
      </PermittedAction>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("nhieu-vai-cong-quyen", () => {
  it("a person with several roles gets the widest scope of them: 15 sets × every row × 2", () => {
    for (const roles of COMBOS) {
      for (const { name } of ACTIONS) {
        for (const mine of [true, false]) {
          const each = roles.map((r) => expected(r, name, mine));
          const want: Visibility = each.includes("show") ? "show" : "hide";
          expect(actionVisibility(roles, name, mine), `${roles.join("+")} × ${name}`).toBe(want);
        }
      }
    }
  });
});

describe("dong-nguoi-khac", () => {
  it("own scope on someone else's record follows the owner's choice (O1: hidden)", () => {
    expect(OTHERS_RECORD).toBe(OTHERS_WRITTEN_BEFORE);
    expect(othersRecords(actionVisibility)).toEqual([]);
    expect(actionVisibility(["ListAgent"], "removeListing", false)).toBe("hide");
    expect(actionVisibility(["TeamLead"], "removeListing", false)).toBe("show");
    expect(actionVisibility(["ListAgent", "TeamLead"], "removeListing", false)).toBe("show");
  });

  it("break: own scope treated as company scope names the first cell", () => {
    expect(othersRecords(ownAsCompany)).toContain("dong-nguoi-khac: ListAgent × removeListing");
  });
});
