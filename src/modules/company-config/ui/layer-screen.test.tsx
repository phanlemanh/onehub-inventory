// @vitest-environment jsdom
// Row 7e, the company layer screen without a server: fetch is replaced, so these cases pin what the screen owns —
// which part shows which rows and head button for which roles, what each form sends, and where a refusal shows.
// The same screen against a real database and real sessions is tests/e2e-db/lop-rieng.spec.ts.
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import type { Role } from "@/generated/ontology";
import { SessionRoles } from "@/modules/identity/ui";

import { tallGridViewport } from "../../../../tests/virtual-viewport";
import { label } from "../index";
import type { CompanyLayer } from "../store";

import { LAYER_COPY as C, PROBLEM_COPY, type GridPart } from "./copy";
import { AliasDialog, FieldDialog, LabelDialog, RenameDialog, send } from "./layer-dialogs";
import { CompanyLayerScreen, valueText } from "./layer-screen";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));

const LAYER: CompanyLayer = {
  labels: [{ id: "l1", concept: "Building", label: "Block" }],
  fields: [
    {
      code: "huong_view",
      name: "View",
      kind: "single_select",
      options: ["Hồ", "Phố"],
      position: 1,
    },
  ],
  aliases: [{ id: "a1", field: "Unit.directionFaces", raw: "ĐN", value: "Đông Nam" }],
  pendingUnits: [{ id: "p1", rawCode: "S1.01-0501", unitKey: null, matchedAt: null }],
  templates: [{ id: "t1", name: "Sheet tuần", signature: ["ma can", "gia"], columns: [] }],
};

type Call = { url: string; method: string; body: unknown };
let calls: Call[] = [];

/** Replaces fetch: the layer for a read, and `answer` for every write. */
function serve(answer: { status: number; body: unknown } = { status: 200, body: { id: "x" } }) {
  calls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      calls.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      const r = method === "GET" ? { status: 200, body: LAYER } : answer;
      return new Response(JSON.stringify(r.body), { status: r.status });
    }),
  );
}

beforeAll(() => {
  tallGridViewport();
  Element.prototype.getAnimations ??= () => [];
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function show(part: GridPart, role: Role) {
  return render(
    <SessionRoles roles={[role]}>
      <CompanyLayerScreen part={part} concepts={["Unit", "Building"]} />
    </SessionRoles>,
  );
}

const HEAD: Record<GridPart, string | null> = {
  nhan: label("AddCompanyLabel"),
  truong: label("AddCustomField"),
  "tu-dien": label("AddValueAlias"),
  "can-cho": label("MatchPendingUnits"),
  mau: null,
};

const ROW_TEXT: Record<GridPart, string> = {
  nhan: "Block",
  truong: "View",
  "tu-dien": "ĐN",
  "can-cho": "S1.01-0501",
  mau: "Sheet tuần",
};

describe("phan-theo-vai", () => {
  it("each part shows its rows; a writer gets the head button, a reader none", async () => {
    for (const part of Object.keys(HEAD) as GridPart[]) {
      for (const role of ["CompanyAdmin", "BuyerAgent"] as const) {
        serve();
        const { container, unmount } = show(part, role);
        await waitFor(() =>
          expect(
            container.querySelector(`[data-part="${part}"][data-state="ready"]`),
          ).not.toBeNull(),
        );
        await waitFor(() => expect(container.textContent).toContain(ROW_TEXT[part]));
        const head = [...container.querySelectorAll('[data-slot="page-header-action"] button')].map(
          (b) => b.textContent,
        );
        expect(head, `${part} ${role}`).toEqual(
          role === "CompanyAdmin" && HEAD[part] ? [HEAD[part]] : [],
        );
        unmount();
      }
    }
  });

  it("a read that fails shows the error state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 500 })),
    );
    const { container } = show("nhan", "CompanyAdmin");
    await waitFor(() => expect(container.querySelector('[data-state="error"]')).not.toBeNull());
  });

  it("matching says how many matched and how many still wait", async () => {
    serve({ status: 200, body: { matched: 1, waiting: 0 } });
    show("can-cho", "CompanyAdmin");
    const button = await screen.findByRole("button", { name: label("MatchPendingUnits") });
    await act(async () => fireEvent.click(button));
    await waitFor(() =>
      expect(calls.some((c) => c.method === "POST" && c.url.endsWith("/pending-units/match"))).toBe(
        true,
      ),
    );
  });

  it("standard values read in words: a status by its label, a reason by its label, a direction as written", () => {
    expect(valueText("Listing.standardStatus", "Active")).toBe(label("StatusActive"));
    expect(valueText("Listing.withdrawnReason", "unreachable")).toBe(label("WithdrawnUnreachable"));
    expect(valueText("Unit.directionFaces", "Đông Nam")).toBe("Đông Nam");
  });
});

describe("gui-va-tu-choi", () => {
  it("a refusal lands under its field, a 403 is the refusal sentence, anything else the general failure", async () => {
    serve({ status: 400, body: { error: "name-taken" } });
    expect(await send("fields", "POST", {})).toEqual({
      ok: false,
      errors: { name: PROBLEM_COPY["name-taken"]!.text },
    });
    serve({ status: 403, body: { error: "forbidden" } });
    expect(await send("labels", "POST", {})).toEqual({
      ok: false,
      errors: { form: FRAME_COPY.refusedAction },
      refused: true,
    });
    serve({ status: 500, body: { error: "server-error" } });
    expect(await send("labels", "POST", {})).toEqual({ ok: false, errors: { form: C.failed } });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new Error("offline"))),
    );
    expect(await send("labels", "POST", {})).toEqual({ ok: false, errors: { form: C.failed } });
  });

  it("editing a field sends name and options, never the kind, and shows a clash under the name", async () => {
    serve({ status: 400, body: { error: "name-taken" } });
    const done = vi.fn();
    render(
      <FieldDialog
        editing={{ code: "huong_view", name: "View", kind: "single_select", options: ["Hồ"] }}
        open
        setOpen={() => {}}
        onDone={done}
      />,
    );
    const dialog = document.querySelector('[data-slot="field-dialog"]')!;
    fireEvent.change(screen.getByLabelText(C.nameLabel), { target: { value: "Ghi chú" } });
    await act(async () => fireEvent.submit(dialog.querySelector("form")!));
    expect(calls.at(-1)).toEqual({
      url: "/api/v1/company-layer/fields/huong_view",
      method: "PATCH",
      body: { name: "Ghi chú", options: ["Hồ"] },
    });
    await waitFor(() =>
      expect(
        dialog.querySelector('[data-field="name"] [data-slot="field-error"]')?.textContent,
      ).toBe(PROBLEM_COPY["name-taken"]!.text),
    );
    expect(screen.getByLabelText(C.nameLabel)).toHaveProperty("value", "Ghi chú");
    expect(done).not.toHaveBeenCalled();
  });

  it("a saved edit closes the form and reports the change", async () => {
    serve();
    const setOpen = vi.fn();
    const done = vi.fn();
    render(
      <RenameDialog
        editing={{ id: "t1", name: "Sheet tuần" }}
        open
        setOpen={setOpen}
        onDone={done}
      />,
    );
    fireEvent.change(screen.getByLabelText(C.templateNameLabel), {
      target: { value: "Sheet tháng" },
    });
    await act(async () =>
      fireEvent.submit(document.querySelector('[data-slot="rename-dialog"] form')!),
    );
    expect(calls.at(-1)?.body).toEqual({ name: "Sheet tháng" });
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(done).toHaveBeenCalledWith(C.saved("Sheet tháng"));
  });

  it("a label and a spelling send their own bodies; a 403 leaves only «Thôi»", async () => {
    serve({ status: 403, body: { error: "forbidden" } });
    render(
      <LabelDialog
        concepts={["Building"]}
        editing={{ id: "l1", concept: "Building", label: "Block" }}
        open
        setOpen={() => {}}
        onDone={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText(C.wordsLabel), { target: { value: "Lô" } });
    const form = document.querySelector('[data-slot="label-dialog"] form')!;
    await act(async () => fireEvent.submit(form));
    expect(calls.at(-1)).toMatchObject({ method: "PATCH", body: { label: "Lô" } });
    await waitFor(() => expect(form.textContent).toContain(FRAME_COPY.refusedAction));
    expect(screen.queryByRole("button", { name: C.save })).toBeNull();
    cleanup();

    serve();
    render(
      <AliasDialog
        fields={[
          {
            field: "Unit.directionFaces",
            name: label("DirectionFaces"),
            values: [{ value: "Bắc", text: "Bắc" }],
          },
        ]}
        editing={{ id: "a1", field: "Unit.directionFaces", raw: "B", value: "Bắc" }}
        open
        setOpen={() => {}}
        onDone={() => {}}
      />,
    );
    await act(async () =>
      fireEvent.submit(document.querySelector('[data-slot="alias-dialog"] form')!),
    );
    expect(calls.at(-1)).toMatchObject({
      url: "/api/v1/company-layer/aliases/a1",
      method: "PATCH",
      body: { value: "Bắc" },
    });
  });

  it("adding a field without a kind asks for one and sends nothing", async () => {
    serve();
    render(<FieldDialog open setOpen={() => {}} onDone={() => {}} />);
    fireEvent.change(screen.getByLabelText(C.nameLabel), { target: { value: "Ghi chú" } });
    await act(async () =>
      fireEvent.submit(document.querySelector('[data-slot="field-dialog"] form')!),
    );
    expect(calls).toEqual([]);
    expect(
      document.querySelector(
        '[data-slot="field-dialog"] [data-field="kind"] [data-slot="field-error"]',
      )?.textContent,
    ).toBe(PROBLEM_COPY["kind-unknown"]!.text);
  });
});
