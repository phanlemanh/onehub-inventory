// @vitest-environment jsdom
// decision:action-buttons
// Row 9e (bo-nut-theo-quyen), AC-4 and AC-5: the «…» of a record and its removing confirmation.
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, expectTypeOf, it, vi } from "vitest";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import type { NavItem } from "@/components/templates/nav-items";
import type { ActionSpec } from "@/generated/ontology";

import { tallGridViewport } from "../../../tests/virtual-viewport";

import {
  ActionPermissionProvider,
  type ActionPermission,
  type PermissionAction,
} from "./action-permission";
import { typedColumn } from "./column-kind";
import { DataRegion, type GridRow } from "./data-region";
import { RecordActions, RowActions, type RecordAction } from "./row-actions";

afterEach(() => cleanup());

const everything: ActionPermission = () => true;
const ownOnly: ActionPermission = (_action, mine) => mine;

function actions(apply = vi.fn(async () => {})): RecordAction[] {
  return [
    {
      action: "removeListing",
      label: "Bỏ dòng",
      remove: { verb: "Bỏ dòng S1.01-1201", what: "Dòng rời danh sách.", done: "Đã xoá.", apply },
    },
    { action: "updateListing", label: "Đổi giá", onSelect: () => {} },
    { action: "mergeContacts", label: "Gộp", onSelect: () => {} },
  ];
}

function show(permitted: ActionPermission, list: RecordAction[], mine = true) {
  return render(
    <ActionPermissionProvider permitted={permitted}>
      <RowActions actions={list} mine={mine} title="S1.01-1201" />
    </ActionPermissionProvider>,
  );
}

async function openMenu() {
  const trigger = screen.getByRole("button", { name: /S1\.01-1201/ });
  await act(async () => {
    fireEvent.click(trigger);
  });
  await screen.findAllByRole("menuitem");
}

/** The menu's order: ordinary items, one separator, then removing items in red. Returns every break of the rule. */
function orderBreaks(menu: HTMLElement): string[] {
  const parts = [...menu.querySelectorAll('[role="menuitem"], [role="separator"]')];
  const kinds = parts.map((el) =>
    el.getAttribute("role") === "separator"
      ? "line"
      : el.getAttribute("data-variant") === "destructive"
        ? "remove"
        : "plain",
  );
  const firstRemove = kinds.indexOf("remove");
  const failures: string[] = [];
  if (firstRemove >= 0 && kinds.slice(firstRemove).some((k) => k === "plain"))
    failures.push("thu-tu-trong-menu");
  const hasPlain = kinds.includes("plain");
  if (hasPlain && firstRemove >= 0 && kinds[firstRemove - 1] !== "line")
    failures.push("thu-tu-trong-menu: no line before removing items");
  return failures;
}

/** The store's cancel button of a confirmation (AC-5 calls it «Huỷ»; the store's word is FRAME_COPY.confirm.cancel). */
const CANCEL = FRAME_COPY.confirm.cancel;

/** Focus at the cancel button when the confirmation opens. */
function focusBreak(): string[] {
  const cancel = screen.getByRole("button", { name: CANCEL });
  return document.activeElement === cancel ? [] : ["hop-go-focus-huy"];
}

describe("thu-tu-trong-menu", () => {
  it("ordinary actions first, then a line, then removing ones in red", async () => {
    show(everything, actions());
    await openMenu();
    const menu = screen.getByRole("menu");
    expect(orderBreaks(menu)).toEqual([]);
    const items = screen.getAllByRole("menuitem").map((el) => el.textContent);
    expect(items).toEqual(["Đổi giá", "Gộp", "Bỏ dòng"]);
    expect(screen.getByRole("menuitem", { name: "Bỏ dòng" }).getAttribute("data-variant")).toBe(
      "destructive",
    );
  });

  it("break: a menu with the removing action at the top names the rule", () => {
    const menu = document.createElement("div");
    menu.innerHTML =
      '<div role="menuitem" data-variant="destructive">Bỏ dòng</div><div role="separator"></div><div role="menuitem">Đổi giá</div>';
    expect(orderBreaks(menu)).toContain("thu-tu-trong-menu");
  });
});

describe("menu-rong-khong-hien", () => {
  it("nothing permitted: no «…» in the page", () => {
    show(() => false, actions());
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("an empty list: no «…»", () => {
    show(everything, []);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("own scope on someone else's record drops the action; the rest stays", async () => {
    show(ownOnly, actions(), false);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("outside a permission provider nothing is permitted", () => {
    render(<RowActions actions={actions()} mine title="S1.01-1201" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("hop-go", () => {
  async function openRemove(apply = vi.fn(async () => {})) {
    show(everything, actions(apply));
    await openMenu();
    await act(async () => {
      fireEvent.click(screen.getByRole("menuitem", { name: "Bỏ dòng" }));
    });
    await screen.findByRole("dialog");
    return apply;
  }

  it("hop-go-focus-huy: focus starts at «Huỷ» and Esc cancels", async () => {
    const apply = await openRemove();
    await waitFor(() => expect(focusBreak()).toEqual([]));
    await act(async () => {
      fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(apply).not.toHaveBeenCalled();
  });

  it("break: focus on the confirm button names the case", async () => {
    await openRemove();
    screen.getByRole("button", { name: "Bỏ dòng S1.01-1201" }).focus();
    expect(focusBreak()).toEqual(["hop-go-focus-huy"]);
  });

  it("hop-go-dong-tu-danh-tu: the confirm button carries the verb and noun of the action", async () => {
    const apply = await openRemove();
    const confirm = screen.getByRole("button", { name: "Bỏ dòng S1.01-1201" });
    expect(screen.getByRole("dialog").textContent).toContain("Dòng rời danh sách.");
    await act(async () => {
      fireEvent.click(confirm);
    });
    await waitFor(() => expect(apply).toHaveBeenCalledTimes(1));
  });

  it("huy-khong-gui: «Huỷ» sends nothing", async () => {
    const apply = await openRemove();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: CANCEL }));
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(apply).not.toHaveBeenCalled();
  });
});

// AC-3 (S4 round 1, finding t1): an action named in a row or record menu, or in an App Shell entry, must be a row of
// the permission table, or `make typecheck` fails. If the type loosens back to a plain string, the @ts-expect-error
// lines below are no longer errors and the type check fails on them instead: the pair turns red either way.
describe("thao-tac-ngoai-bang: menus and sidebar entries name rows of the permission table", () => {
  it("the action type is exactly the table's names", () => {
    expectTypeOf<PermissionAction>().toEqualTypeOf<ActionSpec["name"]>();
    expectTypeOf<RecordAction["action"]>().toEqualTypeOf<ActionSpec["name"]>();
    expectTypeOf<NonNullable<NavItem["action"]>>().toEqualTypeOf<ActionSpec["name"]>();
  });

  it("break: a name outside the table does not type-check", () => {
    const known: RecordAction = { action: "removeListing", label: "x", onSelect: () => {} };
    // @ts-expect-error -- "deleteEverything" is not a row of ontology/actions.yaml
    const unknown: RecordAction = { action: "deleteEverything", label: "x", onSelect: () => {} };
    // @ts-expect-error -- an App Shell entry cannot name an action outside the table either
    const entry: NavItem = { href: "/x", title: "x", action: "deleteEverything" };
    expect([known, unknown, entry]).toHaveLength(3);
  });
});

describe("record-actions", () => {
  it("the main button shows only when permitted, beside the «…» of the rest", () => {
    render(
      <ActionPermissionProvider permitted={(action) => action !== "updateListing"}>
        <RecordActions
          main={{ action: "updateListing", label: "Đổi giá", onSelect: () => {} }}
          actions={actions()}
          mine
          title="S1.01-1201"
        />
      </ActionPermissionProvider>,
    );
    expect(screen.queryByRole("button", { name: "Đổi giá" })).toBeNull();
    expect(screen.getByRole("button", { name: /S1\.01-1201/ })).toBeTruthy();
  });
});

describe("khe-thao-tac-dong", () => {
  beforeAll(() => {
    tallGridViewport();
    Element.prototype.getAnimations ??= () => [];
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    window.matchMedia ??= ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  });

  const rows: GridRow[] = [
    { id: "a", "Listing.unitNumber": "S1.01-0101" },
    { id: "b", "Listing.unitNumber": "S1.01-0102" },
  ];

  it("one «…» per row in a column pinned last; a row with nothing permitted has none", () => {
    render(
      <ActionPermissionProvider permitted={ownOnly}>
        <DataRegion
          title="Vùng"
          columns={[typedColumn({ field: "Listing.unitNumber", header: "Mã" })]}
          rows={rows}
          rowActions={(row) => ({ actions: actions(), mine: row.id === "a" })}
        />
      </ActionPermissionProvider>,
    );
    expect(document.querySelector(`th[data-pinned="right"], th[data-pinned="end"]`)).not.toBeNull();
    expect(
      document.querySelector('[data-row-actions-for="a"] [data-slot="row-actions"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-row-actions-for="b"] [data-slot="row-actions"]'),
    ).toBeNull();
  });

  it("without rowActions the grid has no actions column", () => {
    render(
      <DataRegion
        title="Vùng"
        columns={[typedColumn({ field: "Listing.unitNumber", header: "Mã" })]}
        rows={rows}
      />,
    );
    expect(document.querySelector("[data-row-actions-for]")).toBeNull();
  });
});
