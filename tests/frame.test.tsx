// @vitest-environment jsdom
// decision:notification-channel
// decision:mobile-navigation
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { SidebarProvider } from "../src/components/ui/sidebar";
import { FRAME_COPY, LOGIN_PATH } from "../src/components/templates/frame-copy";
import { NavMenu, visibleNav, type NavItem } from "../src/components/templates/nav-menu";
import { channelFor, notifyResult } from "../src/components/templates/notify";
import { PageHeader } from "../src/components/templates/page-header";
import { PageState, loginHref } from "../src/components/templates/page-state";
import {
  clearScreenBanner,
  getScreenBanner,
  saveWithBanner,
} from "../src/components/templates/screen-banner";

const toastMock = vi.hoisted(() => vi.fn());
vi.mock("sonner", () => ({ toast: toastMock }));
vi.mock("next/navigation", () => ({ usePathname: () => "/inventory" }));

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  cleanup();
  clearScreenBanner();
  toastMock.mockReset();
});

describe("page header", () => {
  /** A page header holds one h1 and at most one primary action next to it. */
  function assertOnePrimary(header: HTMLElement): void {
    if (header.querySelectorAll("h1").length !== 1)
      throw new Error("page header needs exactly one h1");
    const primaries = header.querySelectorAll(
      '[data-slot="page-header-action"] [data-slot="button"]',
    );
    if (primaries.length > 1) throw new Error("more than one primary action");
  }

  it("PageHeader puts the primary action beside the heading", () => {
    render(<PageHeader title="Bảng" action={<button data-slot="button">Thêm căn</button>} />);
    const header = screen.getByRole("banner");
    expect(header.querySelector("h1")?.textContent).toBe("Bảng");
    expect(
      header.querySelectorAll('[data-slot="page-header-action"] [data-slot="button"]'),
    ).toHaveLength(1);
    expect(() => assertOnePrimary(header)).not.toThrow();
  });

  it("PageHeader without an action renders no action slot", () => {
    render(<PageHeader title="Bảng" />);
    expect(document.querySelector('[data-slot="page-header-action"]')).toBeNull();
  });

  it("the header check fails on two primary actions", () => {
    render(
      <PageHeader
        title="Bảng"
        action={
          <>
            <button data-slot="button">Một</button>
            <button data-slot="button">Hai</button>
          </>
        }
      />,
    );
    expect(() => assertOnePrimary(screen.getByRole("banner"))).toThrow(
      "more than one primary action",
    );
  });
});

describe("navigation by role", () => {
  const ITEMS: NavItem[] = [
    { href: "/", title: "Mục chung một" },
    { href: "/inventory", title: "Mục chung hai" },
    { href: "/admin", title: "Mục quản trị", roles: ["CompanyAdmin"] },
    { href: "/team", title: "Mục nhóm", roles: ["TeamLead", "CompanyAdmin"] },
  ];
  const ROLES = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"] as const;
  /** Written before the code: which entries each role sees. 4 roles × 4 entries = 16 cells. */
  const MATRIX_CELLS = 16;
  const SEES: Record<(typeof ROLES)[number], boolean[]> = {
    ListAgent: [true, true, false, false],
    BuyerAgent: [true, true, false, false],
    TeamLead: [true, true, false, true],
    CompanyAdmin: [true, true, true, true],
  };

  function renderedTitles(role?: (typeof ROLES)[number]): string[] {
    const { container, unmount } = render(
      <SidebarProvider>
        <NavMenu items={ITEMS} roles={role ? [role] : undefined} />
      </SidebarProvider>,
    );
    const titles = [...container.querySelectorAll("a")].map((a) => a.textContent ?? "");
    unmount();
    return titles;
  }

  function assertSees(role: (typeof ROLES)[number], titles: string[]): void {
    ITEMS.forEach((item, i) => {
      if (titles.includes(item.title) !== SEES[role][i]) {
        throw new Error(`role filter leaked: ${item.title}`);
      }
    });
    const order = ITEMS.filter((_, i) => SEES[role][i]).map((item) => item.title);
    if (JSON.stringify(titles) !== JSON.stringify(order))
      throw new Error("navigation order changed");
  }

  it("has the matrix that was written down", () => {
    expect(ROLES.flatMap((role) => SEES[role]).length).toBe(MATRIX_CELLS);
  });

  it("shows each role only its entries, in the declared order, on the rendered sidebar", () => {
    for (const role of ROLES) {
      expect(() => assertSees(role, renderedTitles(role)), role).not.toThrow();
    }
  });

  it("shows only unrestricted entries without a role", () => {
    expect(renderedTitles()).toEqual(["Mục chung một", "Mục chung hai"]);
    expect(visibleNav(ITEMS).map((item) => item.href)).toEqual(["/", "/inventory"]);
  });

  it("marks the current screen and only it", () => {
    const { container } = render(
      <SidebarProvider>
        <NavMenu items={ITEMS} />
      </SidebarProvider>,
    );
    const current = container.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]?.getAttribute("href")).toBe("/inventory");
  });

  it("the role check fails on a sidebar built for another role", () => {
    expect(() => assertSees("ListAgent", renderedTitles("CompanyAdmin"))).toThrow(
      "role filter leaked: Mục quản trị",
    );
  });
});

describe("page states", () => {
  it("builds the sign-in address that returns to the same place", () => {
    expect(loginHref("/inventory?q=a b")).toBe(`${LOGIN_PATH}?next=%2Finventory%3Fq%3Da%20b`);
  });

  it("session expiry offers sign-in with the return address", () => {
    render(<PageState kind="session-expired" returnTo="/sent" />);
    const link = screen.getByRole("link", { name: FRAME_COPY.signInAgain });
    expect(link.getAttribute("href")).toBe("/login?next=%2Fsent");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      FRAME_COPY.sessionExpired.title,
    );
  });

  it("the forbidden state says why, offers the way home and shows nothing else", () => {
    const { container } = render(<PageState kind="forbidden" homeHref="/" />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(FRAME_COPY.forbidden.title);
    expect(screen.getByRole("link", { name: FRAME_COPY.goHome }).getAttribute("href")).toBe("/");
    expect(container.querySelector('[data-part="why"]')?.textContent).toBe(
      FRAME_COPY.forbidden.why,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("the error state offers retry and calls it", () => {
    const retry = vi.fn();
    render(<PageState kind="error" onRetry={retry} />);
    screen.getByRole("button", { name: FRAME_COPY.retry }).click();
    expect(retry).toHaveBeenCalledOnce();
  });
});

describe("notification channels", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
  });

  it("sends each kind of event to its channel", () => {
    const events = ["field", "result", "screen"] as const;
    expect(events.map(channelFor)).toEqual(["inline", "toast", "banner"]);
  });

  it("puts undo on a reversible result only", () => {
    const undo = vi.fn();
    notifyResult({ message: "Đã lưu", undo });
    expect(toastMock).toHaveBeenLastCalledWith("Đã lưu", {
      action: { label: FRAME_COPY.undo, onClick: undo },
    });
    notifyResult({ message: "Đã gửi" });
    expect(toastMock).toHaveBeenLastCalledWith("Đã gửi");
  });

  it("shows the offline-save banner with retry when a save fails offline", async () => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
    const ok = await saveWithBanner(() => Promise.reject(new Error("network")));
    expect(ok).toBe(false);
    expect(getScreenBanner()?.title).toBe(FRAME_COPY.saveFailedOffline.title);
    expect(typeof getScreenBanner()?.retry).toBe("function");
  });

  it("leaves other save failures to the caller and sets no banner when online", async () => {
    await expect(saveWithBanner(() => Promise.reject(new Error("server")))).rejects.toThrow(
      "server",
    );
    expect(getScreenBanner()).toBeNull();
  });

  it("clears the banner after a successful save", async () => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
    await saveWithBanner(() => Promise.reject(new Error("network")));
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
    expect(await saveWithBanner(() => Promise.resolve())).toBe(true);
    expect(getScreenBanner()).toBeNull();
  });
});
