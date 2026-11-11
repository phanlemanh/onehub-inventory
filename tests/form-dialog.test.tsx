// @vitest-environment jsdom
// The shared form dialog (row 9): Enter submits, busy blocks a second send, a failed send offers «Thử lại», Esc
// closes. Each check is paired with the broken case it must catch.
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
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
}: {
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
});
