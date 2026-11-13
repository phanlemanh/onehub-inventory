// @vitest-environment jsdom
// Row 3e (_acceptance/hoi-dau-chu-bao-sai): «Hỏi đầu chủ» at the foot of a listing's record and «Báo sai thông tin» on
// its properties. Each check has a break case on the same fixture with a pinned message.
//   E2 the ask message names this unit and links to its record; the share sheet is called once, inside the click.
//   E3 the ask button's copy and failure paths.  E4 a unit nobody keeps.  E5 who sees the ask button (4 roles × 3 keepers).
//   E6 the report dialog's properties, shown values and right-value rule.  E7 the report's lines and outcomes.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { ActionPermissionProvider } from "../src/components/candidate/action-permission";
import type { GridRow } from "../src/components/candidate/data-region";
import { LABELS } from "../src/generated/labels";
import type { Role } from "../src/generated/ontology";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { actionVisibility } from "../src/modules/identity/permissions";
import {
  SAMPLE_COMPANY,
  askListAgentMessage,
  buildSampleListings,
  recordLink,
  sampleKeeperOf,
  unitErrorReport,
} from "../src/modules/listings";
import {
  ASK_COPY,
  INVENTORY_FIELDS,
  inventoryRows,
  listingRecord,
  listingView,
  reportFieldsOf,
  type AskWords,
  type InventoryField,
} from "../src/modules/listings/ui";

const notifyResult = vi.hoisted(() => vi.fn());
vi.mock("../src/components/templates/notify", async (orig) => ({
  ...(await orig<object>()),
  notifyResult,
}));

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

beforeEach(() => notifyResult.mockReset());
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, "share");
  Reflect.deleteProperty(navigator, "clipboard");
});

// ---- fixtures, read from the real sample data and label table ----------------------------------------------------

const label = (code: keyof typeof LABELS) => LABELS[code].pref;
const WORDS: AskWords = {
  ask: label("AskListAgent"),
  report: label("ReportUnitError"),
  unit: label("Unit"),
  listAgent: label("ListAgent"),
};
const HEADERS = Object.fromEntries(
  INVENTORY_FIELDS.map((field) => [field, `H ${field}`]),
) as Record<InventoryField, string>;
const ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];

function sampleRows(): GridRow[] {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  return inventoryRows({ listings, listingUnits, units });
}
const ROWS = sampleRows();
const rowKept = (kind: "other" | "viewer" | "none"): GridRow => {
  const row = ROWS.find((r) => {
    const k = sampleKeeperOf(r.id);
    return kind === "none" ? k === null : k?.kind === kind;
  });
  if (!row) throw new Error(`no sample row kept by ${kind}`);
  return row;
};
const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

function asRoles(roles: readonly Role[], ui: ReactElement) {
  return render(
    <ActionPermissionProvider
      permitted={(action, mine) => actionVisibility(roles, action, mine) === "show"}
    >
      {ui}
    </ActionPermissionProvider>,
  );
}
/** The record of a row as the inventory grid renders it: body and footer. */
function openRecord(row: GridRow, roles: readonly Role[] = ["BuyerAgent"]) {
  const view = listingRecord(HEADERS, WORDS).render(row);
  return asRoles(
    roles,
    <div>
      {view.body}
      {view.footer}
    </div>,
  );
}
const askButton = () => document.querySelector<HTMLButtonElement>('[data-slot="ask-list-agent"]');

/** A share sheet that records each call and the order it ran in. */
function fakeShare(behaviour: "ok" | "abort" | "absent", clipboard: "ok" | "throws" | "absent") {
  const calls: { text?: string; url?: string }[] = [];
  const copied: string[] = [];
  if (behaviour !== "absent") {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: (data: { text?: string; url?: string }) => {
        calls.push(data);
        return behaviour === "ok"
          ? Promise.resolve()
          : Promise.reject(Object.assign(new Error("x"), { name: "AbortError" }));
      },
    });
  }
  if (clipboard !== "absent") {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (t: string) =>
          clipboard === "ok"
            ? (copied.push(t), Promise.resolve())
            : Promise.reject(new Error("no")),
      },
    });
  }
  return { calls, copied };
}

// ---- E2 · the ask message and the share sheet ----------------------------------------------------------------------

/** The message names the row's own unit and building, and links to the row's own record. */
function assertAskOf(row: GridRow, message: { text: string; url: string }, origin: string) {
  const where = [str(row["Listing.unitNumber"]), str(row["Listing.buildingName"])]
    .filter(Boolean)
    .join(" · ");
  if (message.text !== `Hỏi về ${WORDS.unit.toLocaleLowerCase("vi")} ${where}`)
    throw new Error(`question names the wrong unit: ${message.text}`);
  if (message.url !== new URL(`/inventory?ho-so=${encodeURIComponent(row.id)}`, origin).toString())
    throw new Error(`question links to the wrong record: ${message.url}`);
}

describe("E2 · asking the listing agent", () => {
  const origin = "https://onehub.test";
  const kept = ROWS.filter((r) => sampleKeeperOf(r.id)?.kind === "other");

  it("names every kept unit and links to its record", () => {
    expect(kept.length).toBeGreaterThan(10);
    for (const row of kept) {
      const message = askListAgentMessage(
        {
          id: row.id,
          unitNumber: str(row["Listing.unitNumber"]),
          buildingName: str(row["Listing.buildingName"]),
        },
        WORDS.unit,
        origin,
      );
      assertAskOf(row, message, origin);
      expect(message.url).toBe(recordLink(row.id, origin));
    }
  });

  it("break: a message built from another row says «question names the wrong unit»", () => {
    const [a, b] = kept;
    const wrong = askListAgentMessage(
      {
        id: a!.id,
        unitNumber: str(b!["Listing.unitNumber"]) + "x",
        buildingName: str(a!["Listing.buildingName"]),
      },
      WORDS.unit,
      origin,
    );
    expect(() => assertAskOf(a!, wrong, origin)).toThrow(/question names the wrong unit/);
  });

  it("opens the share sheet once, inside the click, with that message", () => {
    const row = rowKept("other");
    const { calls } = fakeShare("ok", "ok");
    openRecord(row);
    fireEvent.click(askButton()!);
    // Synchronously after the click: the share sheet was already called, before any await.
    expect(calls).toHaveLength(1);
    assertAskOf(row, { text: calls[0]!.text!, url: calls[0]!.url! }, window.location.origin);
  });

  it("break: a share called after an await says «share called outside the click»", async () => {
    const { calls } = fakeShare("ok", "ok");
    const late = async () => {
      await Promise.resolve();
      await navigator.share({ text: "x" });
    };
    void late();
    expect(() => expect(calls, "share called outside the click").toHaveLength(1)).toThrow(
      /share called outside the click/,
    );
  });

  it("says nothing when the person cancels the share sheet", async () => {
    fakeShare("abort", "ok");
    openRecord(rowKept("other"));
    fireEvent.click(askButton()!);
    await new Promise((r) => setTimeout(r, 0));
    expect(notifyResult).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

// ---- E3 · copy and failure on the ask button -----------------------------------------------------------------------

describe("E3 · when the device has no share sheet", () => {
  it("copies the question and its link, and says «Đã chép tin hỏi»", async () => {
    const row = rowKept("other");
    const { copied } = fakeShare("absent", "ok");
    openRecord(row);
    fireEvent.click(askButton()!);
    await waitFor(() => expect(notifyResult).toHaveBeenCalledWith({ message: ASK_COPY.copied }));
    expect(copied).toEqual([
      `${copied[0]!.split("\n")[0]}\n${recordLink(row.id, window.location.origin)}`,
    ]);
  });

  it("neither share nor copy: shows the failure and the whole message to copy by hand", async () => {
    const row = rowKept("other");
    fakeShare("absent", "throws");
    openRecord(row);
    fireEvent.click(askButton()!);
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(ASK_COPY.failed);
    const box = screen.getByLabelText(ASK_COPY.messageLabel) as HTMLTextAreaElement;
    expect(box.readOnly).toBe(true);
    expect(box.value).toContain(recordLink(row.id, window.location.origin));
    expect(notifyResult).not.toHaveBeenCalled();
  });

  it("break: without the hand-copy box the check says «manual copy text missing»", async () => {
    fakeShare("absent", "throws");
    openRecord(rowKept("other"));
    fireEvent.click(askButton()!);
    await screen.findByRole("alert");
    screen.getByLabelText(ASK_COPY.messageLabel).remove();
    expect(() =>
      expect(
        screen.queryByLabelText(ASK_COPY.messageLabel),
        "manual copy text missing",
      ).not.toBeNull(),
    ).toThrow(/manual copy text missing/);
  });
});

// ---- E4 · a unit nobody keeps -------------------------------------------------------------------------------------

describe("E4 · a unit nobody keeps", () => {
  it("shows the button off, saying why, and asks nobody", () => {
    const { calls, copied } = fakeShare("ok", "ok");
    openRecord(rowKept("none"));
    const button = askButton()!;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe(ASK_COPY.unheld(WORDS.unit, WORDS.listAgent));
    fireEvent.click(button);
    expect(calls).toEqual([]);
    expect(copied).toEqual([]);
  });

  it("control: a unit someone else keeps has the button on", () => {
    openRecord(rowKept("other"));
    expect(askButton()!.disabled).toBe(false);
  });

  it("break: a button left on for an unkept unit says «unheld unit asks nobody»", () => {
    openRecord(rowKept("other"));
    expect(() => expect(askButton()!.disabled, "unheld unit asks nobody").toBe(true)).toThrow(
      /unheld unit asks nobody/,
    );
  });
});

// ---- E5 · who sees the ask button --------------------------------------------------------------------------------

describe("E5 · the ask button follows the permission table and the keeper", () => {
  const KINDS = ["other", "viewer", "none"] as const;
  const expected = (role: Role, kind: (typeof KINDS)[number]) =>
    actionVisibility([role], "viewListings", false) === "show" && kind !== "viewer";

  const cells = ROLES.flatMap((role) => KINDS.map((kind) => ({ role, kind })));
  it("covers twelve cells", () => expect(cells).toHaveLength(12));
  for (const { role, kind } of cells) {
    it(`${role} × ${kind}`, () => {
      openRecord(rowKept(kind), [role]);
      expect(askButton() !== null).toBe(expected(role, kind));
    });
  }

  it("the company admin never sees it", () => {
    for (const kind of KINDS) {
      cleanup();
      openRecord(rowKept(kind), ["CompanyAdmin"]);
      expect(askButton()).toBeNull();
    }
  });

  it("outside the permission provider nothing shows", () => {
    const view = listingRecord(HEADERS, WORDS).render(rowKept("other"));
    render(<div>{view.footer}</div>);
    expect(askButton()).toBeNull();
  });

  it("break: dropping the keeper rule says «holder asked themselves»", () => {
    openRecord(rowKept("viewer"));
    const shown = askButton() !== null;
    expect(() => expect(!shown, "holder asked themselves").toBe(false)).toThrow(
      /holder asked themselves/,
    );
  });
});

// ---- E6 · the report dialog --------------------------------------------------------------------------------------

const CATALOG = [
  "Listing.unitNumber",
  "Listing.buildingName",
  "Listing.subdivisionName",
  "Unit.livingArea",
  "Unit.bedroomsTotal",
] as const;

async function openReport(row: GridRow, roles: readonly Role[] = ["BuyerAgent"]) {
  openRecord(row, roles);
  fireEvent.click(screen.getByRole("button", { name: WORDS.report }));
  return screen.findByRole("dialog");
}
const submit = () => fireEvent.click(screen.getByRole("button", { name: ASK_COPY.report.submit }));
const typeRight = (value: string) =>
  fireEvent.change(screen.getByLabelText(ASK_COPY.report.right), { target: { value } });

describe("E6 · the report dialog", () => {
  it("lists the five catalog properties in order, with what the record shows", () => {
    for (const row of ROWS.slice(0, 12)) {
      const view = listingView(row, HEADERS);
      const fields = reportFieldsOf(view);
      expect(fields.map((f) => f.name)).toEqual(CATALOG.map((f) => HEADERS[f]));
      for (const f of fields) {
        const column = view.fields.find((c) => c.column.header === f.name)!;
        const raw = column.value;
        if (raw === null || raw === undefined || raw === "") expect(f.shown).toBe("—");
        else expect(f.shown.length).toBeGreaterThan(0);
      }
    }
  });

  it("break: a company field offered as a catalog field says «listing field offered as catalog field»", () => {
    const names = [...CATALOG.map((f) => HEADERS[f]), HEADERS["Listing.listPrice"]];
    expect(() =>
      expect(names, "listing field offered as catalog field").toEqual(
        CATALOG.map((f) => HEADERS[f]),
      ),
    ).toThrow(/listing field offered as catalog field/);
  });

  it("opens with the dialog title and the first property's shown value", async () => {
    const row = rowKept("other");
    const dialog = await openReport(row);
    expect(dialog.textContent).toContain(
      `${WORDS.report} ${WORDS.unit.toLocaleLowerCase("vi")} ${str(row["Listing.unitNumber"])}`,
    );
    const first = reportFieldsOf(listingView(row, HEADERS))[0]!;
    expect(dialog.querySelector('[data-slot="report-shown"]')!.textContent).toBe(
      ASK_COPY.report.shown(first.shown),
    );
  });

  const MATRIX: { right: string; sends: boolean }[] = [
    { right: "", sends: false },
    { right: "   ", sends: false },
    { right: "a", sends: true },
    { right: "x".repeat(200), sends: true },
  ];
  for (const cell of MATRIX) {
    it(`right value «${cell.right.slice(0, 5)}» (${cell.right.length}) ${cell.sends ? "sends" : "is refused at the field"}`, async () => {
      const { calls } = fakeShare("ok", "ok");
      await openReport(rowKept("other"));
      typeRight(cell.right);
      submit();
      expect(calls).toHaveLength(cell.sends ? 1 : 0);
      const missing = screen.queryByText(ASK_COPY.report.missing);
      expect(missing !== null).toBe(!cell.sends);
      if (!cell.sends)
        expect(screen.getByLabelText(ASK_COPY.report.right).getAttribute("aria-invalid")).toBe(
          "true",
        );
    });
  }

  it("caps the two fields at 200 and 500 characters", async () => {
    await openReport(rowKept("other"));
    expect(screen.getByLabelText(ASK_COPY.report.right).getAttribute("maxlength")).toBe("200");
    expect(screen.getByLabelText(ASK_COPY.report.basis).getAttribute("maxlength")).toBe("500");
  });

  it("a role without catalog reading has no report button", () => {
    // No role lacks readCatalog in today's table; a viewer outside the frame stands in for it.
    const view = listingRecord(HEADERS, WORDS).render(rowKept("other"));
    render(<div>{view.body}</div>);
    expect(screen.queryByRole("button", { name: WORDS.report })).toBeNull();
  });
});

// ---- E7 · the report's lines and outcomes ------------------------------------------------------------------------

describe("E7 · the report", () => {
  const BASE = {
    reportLabel: WORDS.report,
    unitLabel: WORDS.unit,
    unitNumber: "1101",
    building: "S1.01",
    subdivision: "[Dự án mẫu]",
    buildingLabel: "B",
    subdivisionLabel: "S",
    field: "F",
    shown: "54,2 m²",
    right: "  72 m² ",
    basis: "",
  };
  const linesOf = (text: string) => text.split("\n");

  it("has one fact per line, in order; «Ghi chú» only with a basis", () => {
    expect(linesOf(unitErrorReport(BASE))).toEqual([
      `${WORDS.report} ${WORDS.unit.toLocaleLowerCase("vi")} 1101`,
      "B: S1.01",
      "S: [Dự án mẫu]",
      "Thuộc tính: F",
      "Đang hiện: 54,2 m²",
      "Đúng là: 72 m²",
    ]);
    expect(linesOf(unitErrorReport({ ...BASE, basis: " Sổ hồng " })).at(-1)).toBe(
      "Ghi chú: Sổ hồng",
    );
  });

  it("break: a report without the shown value says «report missing current value»", () => {
    const broken = linesOf(unitErrorReport(BASE)).filter((l) => !l.startsWith("Đang hiện"));
    expect(() =>
      expect(
        broken.some((l) => l.startsWith("Đang hiện")),
        "report missing current value",
      ).toBe(true),
    ).toThrow(/report missing current value/);
  });

  it("sends the report through the share sheet, once, inside the click", async () => {
    const row = rowKept("other");
    const { calls } = fakeShare("ok", "ok");
    await openReport(row);
    typeRight("72 m²");
    submit();
    expect(calls).toHaveLength(1);
    expect(calls[0]!.text!.split("\n")[0]).toBe(
      `${WORDS.report} ${WORDS.unit.toLocaleLowerCase("vi")} ${str(row["Listing.unitNumber"])}`,
    );
    expect(calls[0]!.text).toContain("Đúng là: 72 m²");
    expect(await screen.findByText(ASK_COPY.report.opened)).toBeTruthy();
  });

  it("break: a report shared after an await says «report share called outside the click»", async () => {
    const { calls } = fakeShare("ok", "ok");
    void (async () => {
      await Promise.resolve();
      await navigator.share({ text: "x" });
    })();
    expect(() => expect(calls, "report share called outside the click").toHaveLength(1)).toThrow(
      /report share called outside the click/,
    );
  });

  const OUTCOMES: {
    share: "ok" | "abort" | "absent";
    clip: "ok" | "throws" | "absent";
    said: string | null;
  }[] = [
    { share: "ok", clip: "ok", said: ASK_COPY.report.opened },
    { share: "absent", clip: "ok", said: ASK_COPY.report.copied },
    { share: "absent", clip: "throws", said: ASK_COPY.report.failed },
    { share: "abort", clip: "ok", said: null },
  ];
  for (const o of OUTCOMES) {
    it(`share ${o.share}, clipboard ${o.clip} → ${o.said ?? "nothing"}`, async () => {
      fakeShare(o.share, o.clip);
      await openReport(rowKept("other"));
      typeRight("72");
      submit();
      await new Promise((r) => setTimeout(r, 0));
      const status = document.querySelector('[data-slot="report-result"]');
      expect(status?.textContent ?? null).toBe(o.said);
      const box = screen.queryByLabelText(ASK_COPY.messageLabel) as HTMLTextAreaElement | null;
      expect(box !== null).toBe(o.clip === "throws");
      if (box) expect(box.value).toContain("Đúng là: 72");
    });
  }

  it("closing clears the fields and the result", async () => {
    fakeShare("ok", "ok");
    await openReport(rowKept("other"));
    typeRight("72");
    submit();
    await screen.findByText(ASK_COPY.report.opened);
    fireEvent.click(screen.getByRole("button", { name: /Thôi/ }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: WORDS.report }));
    await screen.findByRole("dialog");
    expect((screen.getByLabelText(ASK_COPY.report.right) as HTMLInputElement).value).toBe("");
    expect(document.querySelector('[data-slot="report-result"]')).toBeNull();
  });
});
