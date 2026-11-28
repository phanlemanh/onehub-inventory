// @vitest-environment jsdom
// Row 3h (tin-rao-giu-gia-tri-rieng, E13), region layer: the living area and bedrooms cells open for editing in a cell
// only from 768 px, like every cell of row 4. The case lives in the listings module, not in the shared grid's test
// (src/components/candidate/data-region-cell-edit.test.tsx): a shared component's test may not import a module.
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  ActionPermissionProvider,
  type ActionPermission,
} from "@/components/candidate/action-permission";
import { typedColumn } from "@/components/candidate/column-kind";
import { DataRegion, type GridRow } from "@/components/candidate/data-region";
import { LABELS } from "@/generated/labels";
import { ACTIONS, type Listing, type Role } from "@/generated/ontology";

import { tallGridViewport } from "../../../../tests/virtual-viewport";

import { attributeCellFields } from "./attribute-cells";
import { cellEditLabels } from "./cell-edit-copy";
import type { UnitAttributeWords } from "./unit-attribute-copy";
import { useListingCellEdit } from "./use-listing-cell-edit";

vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { error: vi.fn() }) }));

beforeAll(() => {
  tallGridViewport();
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
afterEach(() => cleanup());

async function press(cell: HTMLElement, key: string) {
  await act(async () => {
    fireEvent.mouseDown(cell);
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
  });
  await act(async () => {
    fireEvent.keyDown(cell, { key });
  });
}

const editorOpen = () => document.querySelector('[data-slot="cell-editor"]') !== null;

/** The permission table for one role: the edit action is open when the role has a scope for it. */
const asRole =
  (role: Role): ActionPermission =>
  (action) =>
    Boolean(ACTIONS.find((a) => a.name === action)?.scope[role]);
describe("o-thuoc-tinh-theo-kho (E13)", () => {
  const AREA = "Unit.livingArea";
  const BEDROOMS = "Unit.bedroomsTotal";
  const words = {
    names: {
      livingArea: "w-area",
      floor: "w-floor",
      bedroomsTotal: "w-bedrooms",
      directionFaces: "w-direction",
      propertySubType: "w-subtype",
    },
    subTypes: {
      Condominium: "a",
      Townhouse: "b",
      "Single Family Residence": "c",
      "Unimproved Land": "d",
    },
    sources: { Typed: "w-typed", File: "w-file", Catalog: "w-catalog" },
    catalog: "w-catalog",
    differs: "w-differs",
    revert: "w-revert",
    edit: "w-edit",
    unit: "w-unit",
  } as UnitAttributeWords;
  const listing = {
    id: "a",
    companyId: "c",
    buildingName: "B",
    standardStatus: "Active",
    version: 1,
    customFields: {},
    originalEntryTimestamp: "2026-11-01T00:00:00Z",
  } as Listing;
  const attrRows: GridRow[] = [
    {
      id: "a",
      "Listing.unitNumber": "1101",
      [AREA]: 68,
      [BEDROOMS]: 2,
      "Listing.standardStatus": "Active",
    },
  ];
  const attrColumns = [
    typedColumn({ field: "Listing.unitNumber", header: "Mã" }),
    typedColumn({ field: AREA, header: "w-area" }),
    typedColumn({ field: BEDROOMS, header: "w-bedrooms" }),
  ];
  const labels = cellEditLabels((c) => (LABELS[c] as { pref: string }).pref);

  function Grid() {
    const { rows: shown, cellEdit: edit } = useListingCellEdit({
      rows: attrRows,
      listings: [listing],
      headers: {} as never,
      labels,
      door: { save: async () => ({ kind: "fault" }) },
      attributes: {
        fields: attributeCellFields(["livingArea", "bedroomsTotal"], words),
        words,
        catalogOf: () => undefined,
      },
    });
    return (
      <ActionPermissionProvider permitted={asRole("ListAgent")}>
        <DataRegion
          title="w-region"
          columns={attrColumns}
          rows={shown}
          cellEdit={edit}
          record={{
            render: (row) => ({ title: String(row["Listing.unitNumber"]), body: null }),
            address: { openId: null, navigate: vi.fn() },
          }}
        />
      </ActionPermissionProvider>
    );
  }
  const media = window.matchMedia;
  afterEach(() => {
    window.matchMedia = media;
  });
  /** A screen of `width` px: the media queries answer as a device of that width does. */
  function atWidth(width: number) {
    window.matchMedia = ((query: string) => {
      const min = /min-width:\s*(\d+)px/.exec(query);
      return {
        matches: min ? width >= Number(min[1]) : true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      };
    }) as unknown as typeof window.matchMedia;
  }
  const attrCell = (field: string) =>
    document.querySelector<HTMLElement>(`td[data-col-id="${field}"]`)!;
  /** Every way the region opens an editor, on one cell; whether any of them opened one. */
  async function anyWayOpens(field: string): Promise<boolean> {
    for (const key of ["Enter", "F2", "7"]) {
      await press(attrCell(field), key);
      if (editorOpen()) return true;
      await act(async () =>
        fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" }),
      );
    }
    await act(async () => fireEvent.doubleClick(attrCell(field)));
    return editorOpen();
  }

  for (const field of [AREA, BEDROOMS])
    it(`o-thuoc-tinh-theo-kho: ${field} does not open at 360 by any way, opens at 768 by Enter`, async () => {
      atWidth(360);
      render(<Grid />);
      expect(attrCell(field), "the column shows").toBeTruthy();
      expect(await anyWayOpens(field), "phone cell opened for edit").toBe(false);
      cleanup();
      atWidth(768);
      render(<Grid />);
      await press(attrCell(field), "Enter");
      expect(editorOpen(), `${field} at 768`).toBe(true);
    });

  it("break: a grid that edits a phone cell says «phone cell opened for edit»", async () => {
    atWidth(768);
    render(<Grid />);
    // What a phone would see if the cell edit did not wait for 768 px: the desktop edit on a 360 screen.
    const opened = await anyWayOpens(AREA);
    expect(() => expect(opened, "phone cell opened for edit").toBe(false)).toThrow(
      /phone cell opened for edit/,
    );
  });
});
