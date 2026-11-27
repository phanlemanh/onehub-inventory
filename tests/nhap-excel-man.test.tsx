// @vitest-environment jsdom
// Row 11 (nhap-excel): the Nạp tệp screen in the browser test environment — a CSV is read in the page, the preview
// counts are the server's, the five steps run, apply writes the open call then the batch, undo goes through its door,
// the buttons show only for roles the permission table allows, and a dropped connection says nothing was written.
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { Role } from "@/generated/ontology";
import { label } from "@/modules/company-config";
import { SessionRoles } from "@/modules/identity/ui";
import { ImportWizard } from "@/modules/imports/ui";
import { IMPORT_COPY as C, MARK_WORDS, PROBLEM_WORDS, STEP_WORDS } from "@/modules/imports/ui/copy";

beforeAll(() => {
  // The wait of step 1 is a DataRegion, which measures itself and asks for the screen width.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
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
  vi.unstubAllGlobals();
});

const MARKED = {
  columns: [
    {
      index: 0,
      header: "Mã căn",
      target: { standard: "unitCode" },
      mark: "fixed",
      why: "header-dictionary",
      learnLabel: null,
    },
  ],
  cells: [[{ mark: "keep", value: "unt_1", why: "catalog" }]],
  rows: [{ fate: "create", unit: { unitKey: "unt_1" } }],
  counts: { keep: 7, fixed: 1, ask: 0, block: 0 },
  createCount: 1,
  keptCount: 0,
  canApply: true,
  questions: [],
};

function server(fail?: "offline" | "recent", undo: Array<Response | "kept"> = []) {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      // The recent imports list reads at mount; only what the screen sends is counted.
      if (!init?.method || init.method === "GET")
        return fail === "recent"
          ? Response.json({ error: "server-error" }, { status: 500 })
          : Response.json([]);
      calls.push(url);
      if (fail === "offline") throw new TypeError("network");
      if (url.endsWith("/preview")) return Response.json(MARKED);
      if (url === "/api/v1/imports") return Response.json({ id: "run-1" }, { status: 201 });
      if (url.endsWith("/batches"))
        return Response.json({
          created: 1,
          done: true,
          learned: [
            { concept: "ImportTemplate", name: "a.csv" },
            { concept: "CompanyLabel", name: "«Block»" },
            { concept: "CompanyLabel", name: "«DT»" },
          ],
        });
      if (url.endsWith("/undo")) {
        // Queued answers first (a failure, or a kept listing), then the plain success.
        const next = undo.shift();
        if (next === "kept")
          return Response.json({
            removed: [],
            kept: ["l1"],
            keptCodes: ["S1 01-0905"],
            retired: 1,
          });
        if (next) return next;
        return Response.json({ removed: ["l1"], kept: [], keptCodes: [], retired: 1 });
      }
      return Response.json({}, { status: 404 });
    }),
  );
  return calls;
}

const mount = (role: Role = "ListAgent") =>
  render(
    <SessionRoles roles={[role]}>
      <ImportWizard />
    </SessionRoles>,
  );

async function choose(name: string, text: string) {
  const input = screen.getByLabelText(C.drop) as HTMLInputElement;
  await act(async () => {
    fireEvent.change(input, { target: { files: [new File([text], name)] } });
  });
}

describe("man-nap-tep", () => {
  it("a batch that fails part way: the screen says how many rows are written, and Thử lại sends that batch again on the same import (S4-r2 t1)", async () => {
    const sent: string[] = [];
    let opens = 0;
    let failOnce = true;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        if (!init?.method || init.method === "GET") return Response.json([]);
        if (url.endsWith("/preview")) return Response.json(MARKED);
        if (url === "/api/v1/imports")
          return Response.json({ id: `run-${(opens += 1)}` }, { status: 201 });
        if (url.endsWith("/batches")) {
          const { batchNo } = JSON.parse(String(init.body)) as { batchNo: number };
          sent.push(`${url.split("/")[4]}:${batchNo}`);
          if (batchNo === 1 && failOnce) {
            failOnce = false;
            return Response.json({ error: "server-error" }, { status: 500 });
          }
          return Response.json({ created: batchNo === 0 ? 200 : 50, done: batchNo === 1 });
        }
        return Response.json({}, { status: 404 });
      }),
    );
    mount();
    await choose(
      "lon.csv",
      `Mã căn\n${Array.from({ length: 250 }, (_, i) => `A-${i}`).join("\n")}\n`,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: new RegExp(`^${C.next}`) })).toBeTruthy(),
    );
    for (let i = 0; i < 3; i += 1)
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${C.next}`) }));
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.apply(1, 0) })));
    // The first batch is written; the second failed: the screen says 200 of 250, not «nothing written».
    await waitFor(() => expect(screen.getByText(C.batchStopped(200, 250, false))).toBeTruthy());
    expect(screen.queryByText(C.failed)).toBeNull();
    const alert = document.querySelector('[data-state="ghi-do-dang"]') as HTMLElement;
    await act(async () => fireEvent.click(within(alert).getByRole("button", { name: C.retry })));
    await waitFor(() => expect(screen.getByText(C.done(250))).toBeTruthy());
    // One import opened; Thử lại sent batch 1 again on it, never batch 0 nor a new import.
    expect([opens, sent]).toEqual([1, ["run-1:0", "run-1:1", "run-1:1"]]);
  });

  it("an answer lost after the server wrote a batch: Thử lại reaches Xong with the right count, and a double press runs one loop (S4-r3 t8, t9)", async () => {
    // The server's side: a batch written once answers its own count again when sent again (store writeBatch).
    const written = new Set<number>();
    const lost = new Set<number>();
    const sent: number[] = [];
    let opens = 0;
    const counts = (rows: number) => (b: number) => Math.min(200, rows - b * 200);
    const stub = (rows: number, loseOnce: number[]) => {
      loseOnce.forEach((b) => lost.add(b));
      vi.stubGlobal(
        "fetch",
        vi.fn(async (url: string, init?: RequestInit) => {
          if (!init?.method || init.method === "GET") return Response.json([]);
          if (url.endsWith("/preview")) return Response.json(MARKED);
          if (url === "/api/v1/imports")
            return Response.json({ id: `run-${(opens += 1)}` }, { status: 201 });
          const { batchNo, last } = JSON.parse(String(init.body)) as {
            batchNo: number;
            last: boolean;
          };
          sent.push(batchNo);
          written.add(batchNo);
          if (lost.delete(batchNo)) throw new TypeError("network");
          return Response.json({
            created: counts(rows)(batchNo),
            done: last,
            ...(last ? { learned: [{ concept: "ImportTemplate", name: "lon.csv" }] } : {}),
          });
        }),
      );
    };
    const toApply = async (rows: number) => {
      mount();
      await choose(
        "lon.csv",
        `Mã căn\n${Array.from({ length: rows }, (_, i) => `A-${i}`).join("\n")}\n`,
      );
      await waitFor(() =>
        expect(screen.getByRole("button", { name: new RegExp(`^${C.next}`) })).toBeTruthy(),
      );
      for (let i = 0; i < 3; i += 1)
        fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${C.next}`) }));
      await act(async () => fireEvent.click(screen.getByRole("button", { name: C.apply(1, 0) })));
    };
    const retry = () =>
      within(document.querySelector('[data-state="ghi-do-dang"]') as HTMLElement).getByRole(
        "button",
        {
          name: C.retry,
        },
      );

    // The last batch's answer is lost: the screen says what it knows, Thử lại then reaches Xong with all 250 rows.
    stub(250, [1]);
    await toApply(250);
    await waitFor(() => expect(screen.getByText(C.batchStopped(200, 250, true))).toBeTruthy());
    // A double press: the second click while the first runs starts nothing.
    await act(async () => {
      fireEvent.click(retry());
      fireEvent.click(retry());
    });
    await waitFor(() => expect(screen.getByText(C.done(250))).toBeTruthy());
    expect(
      screen.getByText(C.learnedItem({ concept: "ImportTemplate", name: "lon.csv" })),
    ).toBeTruthy();
    expect([opens, sent]).toEqual([1, [0, 1, 1]]);
    cleanup();

    // A middle batch's answer is lost: its retry counts its 200 rows, so Xong says 450, not 250.
    written.clear();
    sent.length = 0;
    opens = 0;
    stub(450, [1]);
    await toApply(450);
    await waitFor(() => expect(screen.getByText(C.batchStopped(200, 450, true))).toBeTruthy());
    await act(async () => fireEvent.click(retry()));
    await waitFor(() => expect(screen.getByText(C.done(450))).toBeTruthy());
    expect([opens, sent]).toEqual([1, [0, 1, 1, 2]]);
  });

  it("reads the file in the page, shows the server's counts, applies in two calls and undoes", async () => {
    const calls = server();
    mount();
    await choose("a.csv", "Mã căn\nS1.01-0905\n");
    await waitFor(() => expect(calls).toContain("/api/v1/imports/preview"));
    for (let i = 0; i < 3; i += 1)
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${C.next}`) }));
    expect(screen.getAllByText(STEP_WORDS[3]).length).toBeGreaterThan(0);
    expect(screen.getByText(MARK_WORDS.keep)).toBeTruthy();
    expect(document.querySelector('[data-mark="keep"]')?.textContent).toBe("7");
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.apply(1, 0) })));
    await waitFor(() => expect(screen.getByText(C.done(1))).toBeTruthy());
    expect(
      [...document.querySelectorAll('[data-state="vua-hoc"] li')].map((l) => l.textContent),
    ).toEqual([
      `${label("ImportTemplate")}: a.csv`,
      `${label("CompanyLabel")}: «Block»`,
      `${label("CompanyLabel")}: «DT»`,
    ]);
    expect(calls).toEqual([
      "/api/v1/imports/preview",
      "/api/v1/imports",
      "/api/v1/imports/run-1/batches",
    ]);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.undo })));
    await waitFor(() => expect(screen.getByText(C.undone)).toBeTruthy());
    expect(calls.at(-1)).toBe("/api/v1/imports/run-1/undo");
  });

  async function toDone(calls: string[]) {
    await choose("a.csv", "Mã căn\nS1.01-0905\n");
    await waitFor(() => expect(calls).toContain("/api/v1/imports/preview"));
    for (let i = 0; i < 3; i += 1)
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${C.next}`) }));
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.apply(1, 0) })));
    await waitFor(() => expect(screen.getByText(C.done(1))).toBeTruthy());
  }

  it("an undo that fails says nothing was removed, and «Thử lại» runs the undo again", async () => {
    const calls = server(undefined, [Response.json({ error: "server-error" }, { status: 500 })]);
    mount();
    await toDone(calls);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.undo })));
    await waitFor(() => expect(screen.getByText(C.undoFailed)).toBeTruthy());
    const before = calls.length;
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.retry })));
    await waitFor(() => expect(screen.getByText(C.undone)).toBeTruthy());
    expect(calls.slice(before)).toEqual(["/api/v1/imports/run-1/undo"]);
  });

  it("an undo that keeps an edited listing names its unit and says why", async () => {
    const calls = server(undefined, ["kept"]);
    mount();
    await toDone(calls);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.undo })));
    await waitFor(() => expect(screen.getByText(C.undoneKept(["S1 01-0905"]))).toBeTruthy());
  });

  it("recent imports that cannot be read say so, and the file is still read", async () => {
    const calls = server("recent");
    mount();
    await waitFor(() => expect(screen.getByText(C.recentFailed)).toBeTruthy());
    await choose("a.csv", "Mã căn\nS1.01-0905\n");
    await waitFor(() => expect(calls).toContain("/api/v1/imports/preview"));
  });

  it("a row skipped on the preview goes to the server as skipRows, and comes back", async () => {
    const calls = server();
    mount();
    await choose("a.csv", "Mã căn\nS1.01-0905\n");
    await waitFor(() => expect(calls).toContain("/api/v1/imports/preview"));
    for (let i = 0; i < 3; i += 1)
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${C.next}`) }));
    const lastPreview = () =>
      JSON.parse(
        String(
          (fetch as unknown as { mock: { calls: [string, RequestInit?][] } }).mock.calls
            .filter(([u]) => u.endsWith("/preview"))
            .at(-1)![1]!.body,
        ),
      ) as { choices: { skipRows?: number[] } };
    await act(async () => fireEvent.click(screen.getByRole("button", { name: `${C.skipRow} 1` })));
    expect(lastPreview().choices.skipRows).toEqual([0]);
    expect(screen.getByRole("button", { name: `${C.skipRow} 1` }).textContent).toBe(C.keepRow);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: `${C.skipRow} 1` })));
    expect(lastPreview().choices.skipRows).toEqual([]);
  });

  it("a wrong file says why and calls nothing", async () => {
    const calls = server();
    mount();
    await choose("a.pdf", "x");
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain(PROBLEM_WORDS["wrong-type"]),
    );
    expect(screen.getByRole("button", { name: C.chooseAgain })).toBeTruthy();
    expect(calls).toEqual([]);
  });

  it("a dropped connection says nothing was written", async () => {
    server("offline");
    mount();
    await choose("a.csv", "Mã căn\nS1.01-0905\n");
    await waitFor(() => expect(screen.getByText(C.offline)).toBeTruthy());
  });

  it("a role without continueImport sees no apply button", async () => {
    server();
    mount("BuyerAgent");
    await choose("a.csv", "Mã căn\nS1.01-0905\n");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: new RegExp(`^${C.next}`) })).toBeTruthy(),
    );
    for (let i = 0; i < 3; i += 1)
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${C.next}`) }));
    expect(screen.queryByRole("button", { name: C.apply(1, 0) })).toBeNull();
  });
});
