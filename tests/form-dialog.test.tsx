// @vitest-environment jsdom
// The shared form dialog (row 9): Enter submits, busy blocks a second send, a failed send offers «Thử lại», Esc
// closes. Each check is paired with the broken case it must catch.
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormDialog } from "../src/components/candidate/form-dialog";
import { FRAME_COPY } from "../src/components/templates/frame-copy";
import { Button } from "../src/components/ui/button";

afterEach(cleanup);

function Harness({
  busy = false,
  formError,
  onSubmit,
  startOpen = true,
  badge,
}: {
  badge?: ReactNode;
  busy?: boolean;
  formError?: string;
  onSubmit: () => void;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  return (
    <FormDialog
      trigger={{ render: <Button />, label: "Mở" }}
      title="Tiêu đề"
      description="Một câu."
      submitLabel="Gửi"
      busyLabel="Đang gửi"
      busy={busy}
      open={open}
      onOpenChange={setOpen}
      onSubmit={onSubmit}
      formError={formError}
      badge={badge}
    >
      <input aria-label="ô" />
    </FormDialog>
  );
}

describe("FormDialog", () => {
  it("Enter in a field submits once", async () => {
    const submit = vi.fn();
    render(<Harness onSubmit={submit} />);
    const field = await screen.findByLabelText("ô");
    await act(async () => {
      fireEvent.submit(field.closest("form")!);
    });
    expect(submit).toHaveBeenCalledOnce();
  });

  it("does not submit while busy, and says so on the button", async () => {
    const submit = vi.fn();
    render(<Harness busy onSubmit={submit} />);
    const button = await screen.findByRole("button", { name: "Đang gửi" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    await act(async () => {
      fireEvent.submit(button.closest("form")!);
    });
    expect(submit).not.toHaveBeenCalled();
  });

  it("after a failed send shows the sentence and offers retry", async () => {
    render(<Harness formError="Chưa lưu được." onSubmit={() => {}} />);
    expect((await screen.findByRole("alert")).textContent).toBe("Chưa lưu được.");
    expect(screen.getByRole("button", { name: FRAME_COPY.retry })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Gửi" })).toBeNull();
  });

  it("opens from its trigger and closes on «Thôi»", async () => {
    render(<Harness startOpen={false} onSubmit={() => {}} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Mở" }));
    });
    expect(await screen.findByRole("dialog")).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: FRAME_COPY.confirm.cancel }));
    });
    await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  // Row 9c, AC-5: the badge beside the title (ReUI dialog-2) is off by default, so the other dialogs keep their shape.
  /** The header's children as tag names: the title must be a direct child when no badge is passed. */
  function headerShape(): string[] {
    const title = screen.getByText("Tiêu đề");
    const header = title.closest('[data-slot="dialog-header"]') ?? title.parentElement!;
    return [...header.children].map((c) => c.getAttribute("data-slot") ?? c.tagName.toLowerCase());
  }

  /** Throws the pinned message when the header was changed without a badge. */
  function assertPlainHeader(shape: string[]): void {
    if (shape[0] !== "dialog-title")
      throw new Error(`header changed without badge: ${shape.join(",")}`);
  }

  it("khong nhan: without a badge the title is a direct child of the header", async () => {
    render(<Harness onSubmit={() => undefined} />);
    await screen.findByText("Tiêu đề");
    expect(headerShape()).toEqual(["dialog-title", "dialog-description"]);
    expect(() => assertPlainHeader(headerShape())).not.toThrow();
  });

  it("co nhan: with a badge the badge and the title sit side by side in one element", async () => {
    render(<Harness onSubmit={() => undefined} badge={<span data-slot="nhan">[Sàn mẫu]</span>} />);
    const title = await screen.findByText("Tiêu đề");
    const badge = screen.getByText("[Sàn mẫu]");
    expect(badge.parentElement).toBe(title.parentElement);
    expect(title.parentElement!.getAttribute("data-slot")).not.toBe("dialog-header");
  });

  it("pha thu: a header that always wraps the title is caught", () => {
    expect(() => assertPlainHeader(["div", "dialog-description"])).toThrow(
      "header changed without badge: div,dialog-description",
    );
  });
});
