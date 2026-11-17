// @vitest-environment jsdom
// Row 11 (nhap-excel): the Nạp tệp screen in the browser test environment — a CSV is read in the page, the preview
// counts are the server's, the five steps run, apply writes the open call then the batch, undo goes through its door,
// the buttons show only for roles the permission table allows, and a dropped connection says nothing was written.
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Role } from "@/generated/ontology";
import { SessionRoles } from "@/modules/identity/ui";
import { ImportWizard } from "@/modules/imports/ui";
import { IMPORT_COPY as C, MARK_WORDS, PROBLEM_WORDS, STEP_WORDS } from "@/modules/imports/ui/copy";

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

function server(fail?: "offline") {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      // The recent imports list reads at mount; only what the screen sends is counted.
      if (!init?.method || init.method === "GET") return Response.json([]);
      calls.push(url);
      if (fail === "offline") throw new TypeError("network");
      if (url.endsWith("/preview")) return Response.json(MARKED);
      if (url === "/api/v1/imports") return Response.json({ id: "run-1" }, { status: 201 });
      if (url.endsWith("/batches"))
        return Response.json({ created: 1, done: true, learned: ["template"] });
      if (url.endsWith("/undo")) return Response.json({ removed: ["l1"], kept: [], retired: 1 });
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
    ).toEqual(["template"]);
    expect(calls).toEqual([
      "/api/v1/imports/preview",
      "/api/v1/imports",
      "/api/v1/imports/run-1/batches",
    ]);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: C.undo })));
    await waitFor(() => expect(screen.getByText(C.undone)).toBeTruthy());
    expect(calls.at(-1)).toBe("/api/v1/imports/run-1/undo");
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
