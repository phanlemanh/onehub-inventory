// @vitest-environment jsdom
// The shared framed list of the «danh sách khung» family (row 9c): every slot the family file names renders where it
// belongs, and an empty slot leaves nothing behind. Each check is paired with the broken case it must catch.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { FramedList, ListFace, initialsOf } from "../src/components/candidate/framed-list";

afterEach(cleanup);

/** The parts of one row, in order, by their data-part. */
function partsOf(row: Element): string[] {
  return [...row.querySelectorAll("[data-part]")].map((e) => e.getAttribute("data-part")!);
}

/** Throws the pinned message when a row's parts are not the family's spine. */
function assertSpine(parts: string[], expected: string[]): void {
  if (parts.join() !== expected.join())
    throw new Error(`framed list row out of spine: ${parts.join(",")}`);
}

describe("FramedList (row 9c)", () => {
  it("renders the head, every row slot and the footer", () => {
    render(
      <FramedList
        title="Khung"
        count="2 mục"
        headAction={<button>Đầu khung</button>}
        rows={[
          {
            id: "a",
            data: { "data-x": "a" },
            main: <ListFace name="[Tên] Một" sub="mot@example.test" />,
            secondary: "phụ",
            tags: <span>nhãn</span>,
            control: <button>Chỉnh</button>,
          },
          { id: "b", main: "Hai" },
        ]}
        footer={{ note: "Ghi chú", action: <button>Lưu</button> }}
      />,
    );
    expect(screen.getByText("Khung")).toBeTruthy();
    expect(screen.getByText("2 mục")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Đầu khung" })).toBeTruthy();
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(rows[0]!.getAttribute("data-x")).toBe("a");
    expect(() =>
      assertSpine(partsOf(rows[0]!), ["main", "secondary", "tags", "control"]),
    ).not.toThrow();
    // An empty slot leaves no part behind.
    expect(partsOf(rows[1]!)).toEqual(["main"]);
    expect(screen.getByText("Ghi chú")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Lưu" })).toBeTruthy();
    expect(screen.getByRole("list", { name: "Khung" })).toBeTruthy();
  });

  it("has no footer and no count when none is given", () => {
    const { container } = render(<FramedList title="Khung" rows={[{ id: "a", main: "Một" }]} />);
    expect(container.querySelector("footer")).toBeNull();
    expect(screen.queryByText("2 mục")).toBeNull();
  });

  it("initials skip a bracketed placeholder", () => {
    expect(initialsOf("[Tên] Đầu chủ 3")).toBe("Đ3");
    expect(initialsOf("[Tên] Quản trị")).toBe("QT");
  });

  it("pha thu: a row whose parts are out of order is caught", () => {
    expect(() => assertSpine(["main", "control", "tags"], ["main", "tags", "control"])).toThrow(
      "framed list row out of spine: main,control,tags",
    );
  });
});
