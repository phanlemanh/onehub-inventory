// @vitest-environment jsdom
// Row 19 (thue-phi), the fee part without a server: fetch is replaced, so these cases pin what the part owns —
// the rows and their order, the source lines, the example line as the person types, what Lưu sends and when it is
// locked, and the buttons each role sees. The same part on a real database is tests/e2e-db/thue-phi.spec.ts.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { Role } from "@/generated/ontology";
import { SessionRoles } from "@/modules/identity/ui";

import type { FeeScheduleView } from "../fee-store";
import { label } from "../index";

import { FEE_COPY as C, FEE_PROBLEM_COPY as P } from "./fee-copy";
import { FeePart } from "./fee-part";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));

const AT = "2026-11-14T03:00:00.000Z";
const defaults = (rate: number, name: string) => ({ rateBasisPoints: rate, included: true, name });
const VIEW: FeeScheduleView = {
  items: [
    {
      code: "pit",
      kind: "Law",
      name: label("PersonalIncomeTax"),
      rateBasisPoints: 200,
      included: true,
      defaults: defaults(200, label("PersonalIncomeTax")),
      source: { kind: "default" },
    },
    {
      code: "registration",
      kind: "Law",
      name: label("RegistrationFee"),
      rateBasisPoints: 50,
      included: true,
      defaults: defaults(50, label("RegistrationFee")),
      source: { kind: "default" },
    },
    {
      code: "brokerage",
      kind: "Own",
      name: label("BrokerageFee"),
      rateBasisPoints: 150,
      included: true,
      defaults: defaults(100, label("BrokerageFee")),
      source: { kind: "changed", by: "[Tên]", at: AT },
    },
    {
      code: "k1",
      kind: "Own",
      name: "Phí dịch vụ hồ sơ",
      rateBasisPoints: 30,
      included: true,
      defaults: null,
      source: { kind: "added", by: "[Tên]", at: AT },
    },
  ],
};
const DEFAULT_VIEW: FeeScheduleView = {
  items: VIEW.items.slice(0, 3).map((i) => ({
    ...i,
    rateBasisPoints: i.defaults!.rateBasisPoints,
    source: { kind: "default" },
  })),
};

type Call = { method: string; body: unknown };
let calls: Call[] = [];
function serve(view: FeeScheduleView, answer?: { status: number; body: unknown }) {
  calls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      calls.push({ method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      const r =
        method === "GET" ? { status: 200, body: view } : (answer ?? { status: 200, body: view });
      return new Response(JSON.stringify(r.body), { status: r.status });
    }),
  );
}

beforeAll(() => {
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

async function show(role: Role, view: FeeScheduleView = VIEW) {
  serve(view);
  render(
    <SessionRoles roles={[role]}>
      <FeePart screenTitle={label("CompanyLayer")} />
    </SessionRoles>,
  );
  await waitFor(() => expect(document.querySelector('[data-state="ready"]')).not.toBeNull());
}
const rows = () => screen.getAllByRole("listitem");
const rowOf = (code: string) => document.querySelector(`[data-fee="${code}"]`) as HTMLElement;
const example = () => document.querySelector('[data-slot="fee-example"]')?.textContent;
const save = () => document.querySelector('[data-slot="fee-save"]') as HTMLButtonElement | null;
const rate = (code: string) =>
  within(rowOf(code)).queryByRole("textbox") as HTMLInputElement | null;
const toggle = (code: string) => within(rowOf(code)).getByRole("switch");

describe("ba-dong-dung-thu-tu", () => {
  it("law items first, then own items in the order they were added", async () => {
    await show("CompanyAdmin");
    expect(rows().map((r) => r.getAttribute("data-fee"))).toEqual([
      "pit",
      "registration",
      "brokerage",
      "k1",
    ]);
    expect(rows()[0]!.textContent, "ba-dong-dung-thu-tu").toContain(label("PersonalIncomeTax"));
    expect(rows()[1]!.textContent, "ba-dong-dung-thu-tu").toContain(label("RegistrationFee"));
    expect(rows()[2]!.textContent).toContain(label("BrokerageFee"));
  });
});

describe("theo-luat-khong-o-sua", () => {
  it("a law item says it is set by law, shows its rate as text, and has no rate field and no «…»", async () => {
    await show("CompanyAdmin");
    for (const code of ["pit", "registration"]) {
      expect(rowOf(code).textContent).toContain(C.byLaw);
      expect(rate(code), code).toBeNull();
      expect(within(rowOf(code)).queryByRole("button", { name: /Việc khác/ }), code).toBeNull();
    }
    expect(rowOf("pit").textContent).toContain("2%");
    expect(rowOf("registration").textContent).toContain("0,5%");
  });
});

describe("nguon-da-doi", () => {
  it("each row names where its value comes from", async () => {
    await show("CompanyAdmin");
    expect(rowOf("pit").textContent).toContain(C.sourceDefault);
    expect(rowOf("brokerage").textContent).toContain(C.sourceChanged("[Tên]", "14/11/2026"));
    expect(rowOf("k1").textContent).toContain(C.sourceAdded("[Tên]", "14/11/2026"));
  });
});

describe("vi-du-theo-muc-dang-go", () => {
  it("the example line follows what is typed, before saving", async () => {
    await show("CompanyAdmin", DEFAULT_VIEW);
    expect(example()).toBe(C.example("2,895 tỷ"));
    fireEvent.change(rate("brokerage")!, { target: { value: "2" } });
    fireEvent.click(toggle("registration"));
    expect(example()).toBe(C.example("2,88 tỷ"));
    expect(calls.filter((c) => c.method === "PUT")).toHaveLength(0);
  });
});

describe("luu-khoa-khi-sai", () => {
  for (const [name, act, problem, at] of [
    [
      "6",
      () => fireEvent.change(rate("brokerage")!, { target: { value: "6" } }),
      "rate-above-max",
      "brokerage",
    ],
    [
      "1,25",
      () => fireEvent.change(rate("brokerage")!, { target: { value: "1,25" } }),
      "rate-step",
      "brokerage",
    ],
    [
      "tắt cả ba",
      () => ["pit", "registration", "brokerage"].forEach((c) => fireEvent.click(toggle(c))),
      "nothing-included",
      null,
    ],
  ] as const) {
    it(name, async () => {
      await show("CompanyAdmin", DEFAULT_VIEW);
      act();
      expect(save()!.disabled, `luu-khoa-khi-sai: ${name}`).toBe(true);
      const where = at ? rowOf(at) : document.querySelector('[data-slot="fee-frame"]')!;
      expect(where.textContent, `luu-khoa-khi-sai: ${name}`).toContain(P[problem]);
    });
  }
});

describe("doc-so-kieu-viet", () => {
  it("«1,5» is 150 basis points, sent in one PUT", async () => {
    await show("CompanyAdmin", DEFAULT_VIEW);
    fireEvent.change(rate("brokerage")!, { target: { value: "1,5" } });
    expect(save()!.disabled, "doc-so-kieu-viet: 1,5").toBe(false);
    fireEvent.click(save()!);
    await waitFor(() => expect(calls.filter((c) => c.method === "PUT")).toHaveLength(1));
    const put = calls.find((c) => c.method === "PUT")!.body as {
      items: { code?: string; rateBasisPoints: number }[];
    };
    expect(
      put.items.find((i) => i.code === "brokerage")?.rateBasisPoints,
      "doc-so-kieu-viet: 1,5",
    ).toBe(150);
  });
});

describe("tra-ve-mac-dinh", () => {
  it("a changed default item goes back to its default from «…»", async () => {
    await show("CompanyAdmin");
    fireEvent.click(
      within(rowOf("brokerage")).getByRole("button", { name: C.more(label("BrokerageFee")) }),
    );
    fireEvent.click(await screen.findByRole("menuitem", { name: label("ResetFeeItem") }));
    expect(rate("brokerage")!.value).toBe("1");
  });
});

describe("chi-doc-khi-khong-quyen", () => {
  for (const role of ["ListAgent", "BuyerAgent", "TeamLead"] as const) {
    it(role, async () => {
      await show(role);
      expect(screen.queryAllByRole("textbox"), role).toHaveLength(0);
      expect(save(), role).toBeNull();
      expect(document.querySelector('[data-slot="fee-read-only"]')?.textContent, role).toBe(
        C.readOnly,
      );
    });
  }
});

// The button table of the contract («Bộ nút theo vai»), written by hand: four roles × five things.
const ROLES = ["CompanyAdmin", "ListAgent", "BuyerAgent", "TeamLead"] as const;
const THINGS = [
  "Ô số",
  "Công tắc bật được",
  label("ResetFeeItem"),
  "Lưu",
  label("AddFeeItem"),
] as const;
const TABLE: Record<(typeof ROLES)[number], boolean> = {
  CompanyAdmin: true,
  ListAgent: false,
  BuyerAgent: false,
  TeamLead: false,
};

describe("bo-nut-theo-vai", () => {
  it("every role × every button of the table", async () => {
    let cells = 0;
    for (const role of ROLES) {
      await show(role);
      const seen: Record<(typeof THINGS)[number], boolean> = {
        "Ô số": rate("brokerage") !== null,
        "Công tắc bật được": !toggle("brokerage").hasAttribute("data-disabled"),
        [label("ResetFeeItem")]: await (async () => {
          const more = within(rowOf("brokerage")).queryByRole("button", {
            name: C.more(label("BrokerageFee")),
          });
          if (!more) return false;
          fireEvent.click(more);
          const item = await screen
            .findByRole("menuitem", { name: label("ResetFeeItem") })
            .catch(() => null);
          fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
          return item !== null;
        })(),
        Lưu: save() !== null,
        [label("AddFeeItem")]: document.querySelector('[data-slot="fee-add"]') !== null,
      } as Record<(typeof THINGS)[number], boolean>;
      for (const thing of THINGS) {
        expect(seen[thing], `bo-nut-theo-vai: ${role} · ${thing}`).toBe(TABLE[role]);
        cells += 1;
      }
      cleanup();
    }
    console.log(`bo-nut-theo-vai: ${cells} ô`);
    expect(cells).toBe(20);
  });
});

describe("khung-tu-khoi-chung", () => {
  it("the part fills the shared framed list and draws no frame of its own", () => {
    const src = readFileSync(join(__dirname, "fee-part.tsx"), "utf8");
    expect(src).toContain('from "@/components/candidate/framed-list"');
    expect(src).not.toMatch(/from "@\/components\/(reui\/frame|ui\/item|ui\/card)"/);
    for (const banned of ["border", "rounded-", "bg-card", "bg-muted", "divide-y"]) {
      expect(src.includes(banned), `khung-tu-khoi-chung: ${banned}`).toBe(false);
    }
  });
});

describe("them-khoan", () => {
  it("adds an own item with its name and rate, sent in the one PUT", async () => {
    await show("CompanyAdmin");
    fireEvent.click(document.querySelector('[data-slot="fee-add"]')!);
    const name = screen.getByRole("textbox", { name: C.nameField });
    fireEvent.change(name, { target: { value: "Phí hồ sơ" } });
    const added = rows().at(-1)!;
    fireEvent.change(within(added).getAllByRole("textbox")[1]!, { target: { value: "0,3" } });
    expect(example()).toBe(C.example("2,862 tỷ"));
    fireEvent.click(save()!);
    await waitFor(() => expect(calls.filter((c) => c.method === "PUT")).toHaveLength(1));
    const put = calls.find((c) => c.method === "PUT")!.body as {
      items: { code?: string; name?: string; rateBasisPoints: number }[];
    };
    expect(put.items.at(-1)).toEqual({ name: "Phí hồ sơ", rateBasisPoints: 30, included: true });
  });
});
