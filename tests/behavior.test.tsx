// @vitest-environment jsdom
// decision:edit-in-cell
// decision:undo-or-confirm
// decision:feedback-by-delay
// decision:state-matrix
// decision:notification-channel
// decision:read-only-cell
// decision:record-panel
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useState, type ReactElement } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { editModeFor, typedColumn, type EditMode } from "../src/components/candidate/column-kind";
import {
  DataRegion,
  headerShowsRows,
  type GridRow,
  type RegionRecord,
  type RegionStatus,
} from "../src/components/candidate/data-region";
import { RecordPanel, recordOpenSelector } from "../src/components/candidate/record-panel";
import { LOADING_STEPS_MS, loadingStep } from "../src/components/candidate/region-state";
import { TruncatedText } from "../src/components/candidate/truncated-text";
import { needsConfirmation, useChange, type Change } from "../src/components/candidate/use-change";
import {
  channelFor,
  type NotifyChannel,
  type NotifyEvent,
} from "../src/components/templates/notify";
import { clearScreenBanner, getScreenBanner } from "../src/components/templates/screen-banner";
import type { DisplayKind } from "../src/generated/display";

const toastMock = vi.hoisted(() => vi.fn());
vi.mock("sonner", () => ({ toast: toastMock }));

beforeAll(() => {
  // jsdom has no Web Animations; Base UI's scroll area asks for them on a timer.
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

afterEach(() => {
  cleanup();
  clearScreenBanner();
  toastMock.mockReset();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

// ---- shared fixtures --------------------------------------------------------------------------------------------

const LISTING_COLUMNS = [
  typedColumn({ field: "Listing.unitNumber", header: "Căn" }),
  typedColumn({ field: "Listing.buildingName", header: "Toà" }),
  typedColumn({ field: "Listing.listPrice", header: "Giá" }),
];
const PEOPLE_COLUMNS = [
  typedColumn({ field: "Contact.fullName", header: "Họ tên" }),
  typedColumn({ field: "Contact.phones", header: "Số điện thoại" }),
];

/** Five listings; three of them are in building S1. */
const LISTINGS: GridRow[] = (
  [
    ["a", "S1.01-0201", "S1.01"],
    ["b", "S2.01-0202", "S2.01"],
    ["c", "S1.02-0203", "S1.02"],
    ["d", "S3.01-0204", "S3.01"],
    ["e", "S1.03-0205", "S1.03"],
  ] as const
).map(([id, unit, building], i) => ({
  id,
  "Listing.unitNumber": unit,
  "Listing.buildingName": building,
  "Listing.listPrice": 2_000_000_000 + i,
}));
const PEOPLE: GridRow[] = [
  { id: "p1", "Contact.fullName": "[Tên] 01", "Contact.phones": "0900000001" },
  { id: "p2", "Contact.fullName": "[Tên] 02", "Contact.phones": "0900000002" },
];

/** A screen holding the record address itself, so the test sees every address change. */
function GridWithRecord({
  rows = LISTINGS,
  columns = LISTING_COLUMNS,
  initial = null,
  calls,
}: {
  rows?: GridRow[];
  columns?: typeof LISTING_COLUMNS;
  initial?: string | null;
  calls: (string | null)[];
}) {
  const [openId, setOpenId] = useState<string | null>(initial);
  const record: RegionRecord = {
    render: (row) => ({
      title: String(row["Listing.unitNumber"] ?? row["Contact.fullName"]),
      body: <p>nội dung {row.id}</p>,
    }),
    address: {
      openId,
      navigate: (id) => {
        calls.push(id);
        setOpenId(id);
      },
    },
  };
  return <DataRegion title="Vùng" columns={columns} rows={rows} record={record} />;
}

const panel = () => document.querySelector<HTMLElement>('[data-slot="record-panel"]');

// ---- checks shared by a case and its break --------------------------------------------------------------------

function assertFocusReturned(id: string): void {
  const opener = document.querySelector(recordOpenSelector(id));
  if (!opener || document.activeElement !== opener) throw new Error(`focus not returned: ${id}`);
}

/** «Sau» from `from` must land on the row shown right after it. */
function assertStep(shownIds: readonly string[], from: string, landed: string | null): void {
  const expected = shownIds[shownIds.indexOf(from) + 1] ?? null;
  if (landed !== expected) throw new Error(`step order: ${landed}`);
}

const EDIT_MATRIX: Readonly<Record<DisplayKind, EditMode>> = {
  money: "cell",
  count: "cell",
  text: "cell",
  select: "cell",
  boolean: "cell",
  date: "cell",
  area: "panel",
  datetime: "panel",
  phone: "panel",
  status: "panel",
  person: "panel",
};

function assertEditModes(rule: (kind: DisplayKind) => EditMode): void {
  for (const [kind, mode] of Object.entries(EDIT_MATRIX) as [DisplayKind, EditMode][]) {
    if (rule(kind) !== mode) throw new Error(`edit mode: ${kind}`);
  }
}

function assertNoProgressBefore10s(step: (ms: number) => string): void {
  for (const ms of [0, 999, 1000, 5000, 9999]) {
    if (step(ms) === "progress") throw new Error("progress before 10s");
  }
}

function assertHeader(container: HTMLElement, status: RegionStatus): void {
  const count = container.querySelector('[data-slot="region-count"]') !== null;
  const search = container.querySelector('input[type="search"]') !== null;
  const rows = headerShowsRows(status);
  if (!rows && (count || search)) throw new Error(`header leaks count: ${status}`);
  if (rows && !(count && search)) throw new Error(`header lost count: ${status}`);
}

function assertActionHidden(container: HTMLElement): void {
  if (container.querySelector('[data-slot="region-action"]')) {
    throw new Error("action shown without permission");
  }
}

function assertFieldInline(rule: (event: NotifyEvent) => NotifyChannel): void {
  if (rule("field") !== "inline") throw new Error("field error sent to toast");
}

function assertLockedHasReason(container: HTMLElement): void {
  for (const lock of container.querySelectorAll('[data-slot="cell-lock"]')) {
    const cell = lock.closest('[data-slot="typed-cell"]');
    const reason = cell?.querySelector('[data-slot="cell-lock-reason"]')?.textContent ?? "";
    if (reason.trim() === "") throw new Error("locked cell without reason");
  }
}

/** Runs a change through `run` and says whether it ran before anyone confirmed. */
async function ranBeforeConfirm(run: (change: Change) => Promise<boolean> | void): Promise<void> {
  let ran = false;
  void run({
    verb: "Gỡ căn",
    what: "Căn sẽ bị gỡ.",
    done: "Đã gỡ.",
    reversible: false,
    apply: () => {
      ran = true;
    },
  });
  await Promise.resolve();
  if (ran) throw new Error("irreversible change ran without confirmation");
}

// ---- AC-1: open the record beside the grid ---------------------------------------------------------------------

describe("record panel opens from the grid", () => {
  it("opens the row, names it, keeps the address and gives focus back on Escape", async () => {
    const calls: (string | null)[] = [];
    render(<GridWithRecord calls={calls} />);
    const openers = document.querySelectorAll<HTMLElement>("[data-record-open]");
    expect(openers).toHaveLength(5);
    expect(openers[1]?.textContent).toContain("S2.01-0202");
    openers[1]!.focus();
    fireEvent.click(openers[1]!);
    await waitFor(() => expect(panel()).not.toBeNull());
    expect(calls).toEqual(["b"]);
    expect(screen.getByRole("dialog").textContent).toContain("S2.01-0202");
    await waitFor(() => expect(panel()!.contains(document.activeElement)).toBe(true));
    // Walk to the third row: closing must give focus to the row now shown, not to the one first opened.
    fireEvent.click(screen.getByRole("button", { name: "Sau" }));
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("c"));
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(panel()).toBeNull());
    expect(calls).toEqual(["b", "c", null]);
    await waitFor(() => assertFocusReturned("c"));
  });

  it("opens straight from the address", async () => {
    render(<GridWithRecord calls={[]} initial="d" />);
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("d"));
    expect(screen.getByRole("dialog").textContent).toContain("S3.01-0204");
  });

  it("reads and writes the page address when the screen does not hold it", async () => {
    window.history.replaceState(null, "", "/proto/hanh-vi-trong-luoi-khung?ho-so=b");
    const push = vi.spyOn(window.history, "pushState");
    render(
      <DataRegion
        title="Vùng"
        columns={LISTING_COLUMNS}
        rows={LISTINGS}
        record={{ render: (row) => ({ title: String(row.id), body: null }) }}
      />,
    );
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("b"));
    fireEvent.click(screen.getByRole("button", { name: "Sau" }));
    expect(String(push.mock.calls.at(-1)?.[2])).toContain("ho-so=c");
    fireEvent.click(document.querySelector<HTMLElement>(recordOpenSelector("e"))!, {});
    expect(String(push.mock.calls.at(-1)?.[2])).toContain("ho-so=e");
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(String(push.mock.calls.at(-1)?.[2])).not.toContain("ho-so");
    // Back in the browser reopens the record the address names.
    window.history.replaceState(null, "", "/proto/hanh-vi-trong-luoi-khung?ho-so=d");
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("d"));
    push.mockRestore();
  });

  it("break: the focus check fails when focus is left elsewhere", async () => {
    render(<GridWithRecord calls={[]} />);
    document.body.focus();
    expect(() => assertFocusReturned("c")).toThrow("focus not returned: c");
  });
});

// ---- AC-2: walk rows in the shown order, same frame for listings and people -------------------------------------

describe("record panel walks rows", () => {
  it("steps to the neighbours and disables the ends", () => {
    const calls: (string | null)[] = [];
    const view = (openId: string) =>
      render(
        <RecordPanel
          ids={["a", "b", "c"]}
          openId={openId}
          onNavigate={(id) => calls.push(id)}
          render={(id) => ({ title: id, body: null })}
        />,
      );
    view("b");
    fireEvent.click(screen.getByRole("button", { name: "Sau" }));
    fireEvent.click(screen.getByRole("button", { name: "Trước" }));
    expect(calls).toEqual(["c", "a"]);
    cleanup();
    view("c");
    expect(screen.getByRole("button", { name: "Sau" })).toHaveProperty("disabled", true);
    expect(screen.getByRole("button", { name: "Trước" })).toHaveProperty("disabled", false);
    cleanup();
    view("a");
    expect(screen.getByRole("button", { name: "Trước" })).toHaveProperty("disabled", true);
  });

  it("follows the search: «Sau» goes to the next row left, never to a hidden one", async () => {
    const calls: (string | null)[] = [];
    render(<GridWithRecord calls={calls} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "S1." } });
    const shownIds = [...document.querySelectorAll("[data-record-open]")].map((el) =>
      el.getAttribute("data-record-open"),
    ) as string[];
    expect(shownIds).toEqual(["a", "c", "e"]);
    fireEvent.click(document.querySelector<HTMLElement>(recordOpenSelector("a"))!);
    await waitFor(() => expect(panel()).not.toBeNull());
    fireEvent.click(screen.getByRole("button", { name: "Sau" }));
    assertStep(shownIds, "a", calls.at(-1) ?? null);
    fireEvent.click(screen.getByRole("button", { name: "Sau" }));
    expect(calls).toEqual(["a", "c", "e"]);
    expect(screen.getByRole("button", { name: "Sau" })).toHaveProperty("disabled", true);
  });

  it("break: the step check fails on the unfiltered order", () => {
    expect(() => assertStep(["a", "c", "e"], "a", "b")).toThrow("step order: b");
  });

  it("uses one frame for a listing and a person", async () => {
    const frameOf = async (element: ReactElement) => {
      render(element);
      fireEvent.click(document.querySelector<HTMLElement>("[data-record-open]")!);
      await waitFor(() => expect(panel()).not.toBeNull());
      const frame = { slot: panel()!.getAttribute("data-slot"), className: panel()!.className };
      cleanup();
      return frame;
    };
    const listing = await frameOf(<GridWithRecord calls={[]} />);
    const person = await frameOf(
      <GridWithRecord calls={[]} rows={PEOPLE} columns={PEOPLE_COLUMNS} />,
    );
    expect(listing.slot).toBe("record-panel");
    expect(person).toEqual(listing);
  });
});

// ---- AC-3: where a cell is edited -----------------------------------------------------------------------------

describe("edit mode by kind", () => {
  it("follows the written matrix of 11 kinds", () => {
    expect(Object.keys(EDIT_MATRIX)).toHaveLength(11);
    expect(() => assertEditModes(editModeFor)).not.toThrow();
  });

  it("marks cells only in an editable region", () => {
    const columns = [
      typedColumn({ field: "Listing.listPrice", header: "Giá" }),
      typedColumn({ field: "Unit.livingArea", header: "Diện tích" }),
      typedColumn({ field: "Listing.closeDate", header: "Ngày chốt" }),
    ];
    const rows: GridRow[] = [
      { id: "a", "Listing.listPrice": 1, "Unit.livingArea": 2, "Listing.closeDate": "2026-11-05" },
    ];
    const { container } = render(
      <DataRegion title="Vùng" columns={columns} rows={rows} editable />,
    );
    const modes = [...container.querySelectorAll('tbody [data-slot="typed-cell"]')].map((el) => [
      el.getAttribute("data-kind"),
      el.getAttribute("data-edit"),
    ]);
    expect(modes).toEqual([
      ["money", "cell"],
      ["area", "panel"],
      ["date", "cell"],
    ]);
    cleanup();
    const plain = render(<DataRegion title="Vùng" columns={columns} rows={rows} />);
    expect(plain.container.querySelectorAll("[data-edit]")).toHaveLength(0);
  });

  it("does not let a screen choose the edit mode", () => {
    // @ts-expect-error a screen may not choose where a column is edited
    typedColumn({ field: "Listing.listPrice", header: "Giá", editMode: "panel" });
  });
});

// ---- AC-4: loading by delay ------------------------------------------------------------------------------------

describe("loading by delay", () => {
  it("shows nothing, then skeleton rows, then progress with cancel", () => {
    vi.useFakeTimers();
    const onCancel = vi.fn();
    const { container } = render(
      <DataRegion
        title="Vùng"
        columns={LISTING_COLUMNS}
        rows={LISTINGS}
        status="loading"
        onCancel={onCancel}
      />,
    );
    const skeleton = () => container.querySelector('[data-slot="region-skeleton"]');
    const progress = () => container.querySelector('[data-slot="region-progress"]');
    act(() => vi.advanceTimersByTime(999));
    expect(skeleton()?.getAttribute("data-shown")).toBe("false");
    expect(progress()).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(skeleton()?.getAttribute("data-shown")).toBe("true");
    expect(skeleton()?.getAttribute("data-columns")).toBe("3");
    act(() => vi.advanceTimersByTime(8999));
    expect(progress()).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(progress()?.textContent).toContain("Vẫn đang tải");
    fireEvent.click(screen.getByRole("button", { name: "Huỷ" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("h2")).toHaveLength(1);
    expect(() => assertHeader(container, "loading")).not.toThrow();
  });

  it("offers no cancel when the screen cannot cancel", () => {
    vi.useFakeTimers();
    render(<DataRegion title="Vùng" columns={LISTING_COLUMNS} rows={LISTINGS} status="loading" />);
    act(() => vi.advanceTimersByTime(LOADING_STEPS_MS.progress));
    expect(screen.queryByRole("button", { name: "Huỷ" })).toBeNull();
  });

  it("break: progress before ten seconds fails the delay check", () => {
    expect(() => assertNoProgressBefore10s(loadingStep)).not.toThrow();
    const tooEarly = (ms: number) => (ms >= 1000 ? "progress" : "none");
    expect(() => assertNoProgressBefore10s(tooEarly)).toThrow("progress before 10s");
  });
});

// ---- AC-5: error and partial failure ---------------------------------------------------------------------------

describe("error and partial failure", () => {
  const HEADER_MATRIX: readonly [RegionStatus, boolean][] = [
    ["ready", true],
    ["loading", false],
    ["error", false],
    ["forbidden", false],
    ["partial", true],
  ];

  it("shows the count and search only when the rows are on screen", () => {
    expect(HEADER_MATRIX).toHaveLength(5);
    for (const [status, rows] of HEADER_MATRIX) {
      expect(headerShowsRows(status), status).toBe(rows);
      const { container } = render(
        <DataRegion title="Vùng" columns={LISTING_COLUMNS} rows={LISTINGS} status={status} />,
      );
      expect(() => assertHeader(container, status), status).not.toThrow();
      cleanup();
    }
  });

  it("offers «Thử lại» only when a reload is wired", () => {
    const onRetry = vi.fn();
    render(
      <DataRegion
        title="Vùng"
        columns={LISTING_COLUMNS}
        rows={LISTINGS}
        status="error"
        onRetry={onRetry}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    cleanup();
    const { container } = render(
      <DataRegion title="Vùng" columns={LISTING_COLUMNS} rows={LISTINGS} status="error" />,
    );
    expect(screen.queryByRole("button", { name: "Thử lại" })).toBeNull();
    expect(container.textContent).toContain("tải lại trang");
  });

  it("says the data exists when a partial load brought no row", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={LISTING_COLUMNS} rows={[]} status="partial" />,
    );
    expect(container.querySelector('[data-kind="partial-empty"]')).not.toBeNull();
    expect(container.querySelector('[data-kind="empty"]')).toBeNull();
    expect(container.textContent).not.toContain("chưa ai thêm");
    expect(screen.queryByRole("button", { name: "Thử lại" })).toBeNull();
  });

  it("break: a header that keeps the count during an error fails the check", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={LISTING_COLUMNS} rows={LISTINGS} status="ready" />,
    );
    expect(() => assertHeader(container, "error")).toThrow("header leaks count: error");
  });
});

// ---- AC-6: the region's button follows permission -------------------------------------------------------------

describe("action follows permission", () => {
  const ACTION_MATRIX: readonly [boolean, RegionStatus, boolean][] = [
    [true, "ready", true],
    [false, "ready", false],
    [true, "forbidden", false],
    [false, "forbidden", false],
  ];

  it("shows «Thêm dòng» only to a viewer allowed to use it on a region they may see", () => {
    expect(ACTION_MATRIX).toHaveLength(4);
    for (const [allowed, status, shown] of ACTION_MATRIX) {
      const { container } = render(
        <DataRegion
          title="Vùng"
          columns={LISTING_COLUMNS}
          rows={LISTINGS}
          status={status}
          action={{ node: <button>Thêm dòng</button>, allowed }}
        />,
      );
      const label = `${allowed} ${status}`;
      expect(screen.queryByRole("button", { name: "Thêm dòng" }) !== null, label).toBe(shown);
      if (!shown) expect(() => assertActionHidden(container), label).not.toThrow();
      if (status === "forbidden") {
        expect(container.querySelectorAll("tbody tr"), label).toHaveLength(0);
        expect(container.querySelector('[data-slot="region-count"]'), label).toBeNull();
      }
      cleanup();
    }
  });

  it("does not take a bare button", () => {
    render(
      <DataRegion
        title="Vùng"
        columns={LISTING_COLUMNS}
        rows={LISTINGS}
        // @ts-expect-error a region button must say whether the viewer may use it
        action={<button>Thêm dòng</button>}
      />,
    );
  });

  it("break: a button shown without permission fails the check", () => {
    const { container } = render(
      <DataRegion
        title="Vùng"
        columns={LISTING_COLUMNS}
        rows={LISTINGS}
        action={{ node: <button>Thêm dòng</button>, allowed: true }}
      />,
    );
    expect(() => assertActionHidden(container)).toThrow("action shown without permission");
  });
});

// ---- AC-7: cut text is measured again on resize ---------------------------------------------------------------

describe("cut text follows the width", () => {
  type Observed = { callback: ResizeObserverCallback; disconnected: boolean; targets: Element[] };

  /** Renders `Text`, then narrows and widens it, and says whether it followed. */
  function followsWidth(Text: (props: { text: string }) => ReactElement): {
    narrow: boolean;
    wide: boolean;
    disconnected: boolean;
  } {
    const observed: Observed[] = [];
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      entry: Observed;
      constructor(callback: ResizeObserverCallback) {
        this.entry = { callback, disconnected: false, targets: [] };
        observed.push(this.entry);
      }
      observe(target: Element) {
        this.entry.targets.push(target);
      }
      unobserve() {}
      disconnect() {
        this.entry.disconnected = true;
      }
    } as unknown as typeof ResizeObserver;
    try {
      const { container, unmount } = render(<Text text="Ocean Park 1, dãy căn hộ ven hồ" />);
      const el = container.querySelector<HTMLElement>('[data-slot="truncated-text"]')!;
      let client = 300;
      Object.defineProperty(el, "scrollWidth", { configurable: true, get: () => 200 });
      Object.defineProperty(el, "clientWidth", { configurable: true, get: () => client });
      const fire = () =>
        act(() => {
          for (const o of observed) {
            if (!o.disconnected && o.targets.includes(el)) o.callback([], {} as ResizeObserver);
          }
        });
      client = 100;
      fire();
      const narrow = el.getAttribute("data-cut") === "true" && el.tabIndex === 0;
      client = 300;
      fire();
      const wide = !el.hasAttribute("data-cut") && !el.hasAttribute("tabindex");
      unmount();
      return { narrow, wide, disconnected: observed.some((o) => o.disconnected) };
    } finally {
      globalThis.ResizeObserver = original;
    }
  }

  function assertRemeasured(Text: (props: { text: string }) => ReactElement): void {
    const result = followsWidth(Text);
    if (!result.narrow || !result.wide) throw new Error("not remeasured on resize");
  }

  it("cuts when the cell narrows, uncuts when it widens, and lets go on unmount", () => {
    expect(followsWidth(TruncatedText)).toEqual({ narrow: true, wide: true, disconnected: true });
    expect(() => assertRemeasured(TruncatedText)).not.toThrow();
  });

  it("break: text measured only once fails the check", () => {
    function MeasuredOnce({ text }: { text: string }) {
      return (
        <span data-slot="truncated-text" title={text}>
          {text}
        </span>
      );
    }
    expect(() => assertRemeasured(MeasuredOnce)).toThrow("not remeasured on resize");
  });
});

// ---- AC-8: the save door --------------------------------------------------------------------------------------

describe("save and undo", () => {
  let runChange: (change: Change) => Promise<boolean> = async () => false;
  const keepRun = (run: typeof runChange) => {
    runChange = run;
  };

  function Screen() {
    const { run, dialog } = useChange();
    useEffect(() => keepRun(run), [run]);
    const [note, setNote] = useState("");
    return (
      <>
        <input aria-label="Ghi chú" value={note} onChange={(e) => setNote(e.target.value)} />
        {dialog}
      </>
    );
  }

  const SAVE_MATRIX: readonly [boolean, boolean, boolean][] = [
    // reversible, leaves company, confirmed first
    [true, false, false],
    [true, true, true],
    [false, false, true],
  ];

  function changeOf(reversible: boolean, leavesCompany: boolean, log: string[]): Change {
    const base = {
      verb: "Gỡ căn",
      what: "Căn S1.01-0201 sẽ bị gỡ khỏi bảng.",
      done: "Đã gỡ căn.",
      leavesCompany,
      apply: () => {
        log.push("apply");
      },
    };
    return reversible
      ? { ...base, reversible: true, undo: () => void log.push("undo") }
      : { ...base, reversible: false };
  }

  it("runs a reversible change at once and offers «Hoàn tác»", async () => {
    render(<Screen />);
    const log: string[] = [];
    await act(async () => {
      await runChange(changeOf(true, false, log));
    });
    expect(log).toEqual(["apply"]);
    expect(screen.queryByRole("dialog")).toBeNull();
    const [message, options] = toastMock.mock.calls[0] as [
      string,
      { action: { label: string; onClick: () => void } },
    ];
    expect(message).toBe("Đã gỡ căn.");
    expect(options.action.label).toBe("Hoàn tác");
    options.action.onClick();
    expect(log).toEqual(["apply", "undo"]);
  });

  it("confirms first whenever the matrix says so, with the verb on the button", async () => {
    expect(SAVE_MATRIX).toHaveLength(3);
    for (const [reversible, leaves, confirmed] of SAVE_MATRIX) {
      expect(needsConfirmation({ reversible, leavesCompany: leaves })).toBe(confirmed);
      if (!confirmed) continue;
      render(<Screen />);
      const log: string[] = [];
      let done: Promise<boolean> = Promise.resolve(false);
      act(() => {
        done = runChange(changeOf(reversible, leaves, log));
      });
      const dialog = await screen.findByRole("dialog");
      expect(log).toEqual([]);
      expect(dialog.textContent).toContain("Căn S1.01-0201 sẽ bị gỡ khỏi bảng.");
      fireEvent.click(screen.getByRole("button", { name: "Thôi" }));
      await expect(done).resolves.toBe(false);
      expect(log).toEqual([]);
      act(() => {
        done = runChange(changeOf(reversible, leaves, log));
      });
      await screen.findByRole("dialog");
      fireEvent.click(screen.getByRole("button", { name: "Gỡ căn" }));
      await expect(done).resolves.toBe(true);
      expect(log).toEqual(["apply"]);
      const options = toastMock.mock.calls.at(-1)?.[1] as { action?: unknown } | undefined;
      expect(options?.action).toBeUndefined();
      cleanup();
      toastMock.mockReset();
    }
  });

  it("keeps what was typed and shows the banner when the device is offline", async () => {
    render(<Screen />);
    fireEvent.change(screen.getByRole("textbox", { name: "Ghi chú" }), {
      target: { value: "gọi lại chiều nay" },
    });
    const online = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    let saved = true;
    await act(async () => {
      saved = await runChange({
        verb: "Lưu",
        what: "",
        done: "Đã lưu.",
        reversible: true,
        apply: () => {
          throw new Error("network");
        },
        undo: () => {},
      });
    });
    online.mockRestore();
    expect(saved).toBe(false);
    expect(getScreenBanner()?.kind).toBe("save-failed");
    expect(screen.getByRole("textbox", { name: "Ghi chú" })).toHaveProperty(
      "value",
      "gọi lại chiều nay",
    );
    expect(toastMock).not.toHaveBeenCalled();
  });

  it("leaves a field error at the field: no toast", async () => {
    render(<Screen />);
    expect(() => assertFieldInline(channelFor)).not.toThrow();
    const failing = runChange({
      verb: "Lưu",
      what: "",
      done: "Đã lưu.",
      reversible: true,
      apply: () => {
        throw new Error("Giá phải lớn hơn 0");
      },
      undo: () => {},
    });
    await expect(failing).rejects.toThrow("Giá phải lớn hơn 0");
    expect(toastMock).not.toHaveBeenCalled();
  });

  it("break: running an irreversible change at once fails the check", async () => {
    render(<Screen />);
    await expect(ranBeforeConfirm(runChange)).resolves.toBeUndefined();
    const immediate = (change: Change) => void change.apply();
    await expect(ranBeforeConfirm(immediate)).rejects.toThrow(
      "irreversible change ran without confirmation",
    );
  });
});

// ---- AC-9: each of the six behaviour decisions has a break that turns red -------------------------------------

describe("the six behaviour decisions can fail", () => {
  const BREAKS: readonly { id: string; message: string; run: () => unknown }[] = [
    {
      id: "edit-in-cell",
      message: "edit mode: date",
      run: () => assertEditModes((kind) => (kind === "date" ? "panel" : editModeFor(kind))),
    },
    {
      id: "undo-or-confirm",
      message: "irreversible change ran without confirmation",
      run: () => ranBeforeConfirm((change) => void change.apply()),
    },
    {
      id: "feedback-by-delay",
      message: "progress before 10s",
      run: () => assertNoProgressBefore10s((ms) => (ms >= 1000 ? "progress" : "none")),
    },
    {
      id: "state-matrix",
      message: "header leaks count: error",
      run: () => {
        const { container } = render(
          <DataRegion title="Vùng" columns={LISTING_COLUMNS} rows={LISTINGS} />,
        );
        assertHeader(container, "error");
      },
    },
    {
      id: "notification-channel",
      message: "field error sent to toast",
      run: () => assertFieldInline((event) => (event === "field" ? "toast" : channelFor(event))),
    },
    {
      id: "read-only-cell",
      message: "locked cell without reason",
      run: () => {
        const root = document.createElement("div");
        root.innerHTML =
          '<span data-slot="typed-cell"><svg data-slot="cell-lock"></svg><span data-slot="cell-lock-reason"></span></span>';
        assertLockedHasReason(root);
      },
    },
  ];

  it("lists exactly the six decisions of the patterns layer", () => {
    expect(BREAKS.map((b) => b.id)).toEqual([
      "edit-in-cell",
      "undo-or-confirm",
      "feedback-by-delay",
      "state-matrix",
      "notification-channel",
      "read-only-cell",
    ]);
  });

  for (const item of BREAKS) {
    it(`break turns red: ${item.id}`, async () => {
      await expect(Promise.resolve().then(item.run)).rejects.toThrow(item.message);
    });
  }
});
