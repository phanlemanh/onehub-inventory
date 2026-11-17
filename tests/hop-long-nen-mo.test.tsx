// @vitest-environment jsdom
// Row 3g (G-1711-19): a FormDialog opened from inside another dialog — the full-screen record on a phone — is nested,
// and a nested Base UI dialog draws no backdrop of its own. FormDialog draws it when it sits inside a dialog (InDialog,
// set by the record panel). Positive control: the same nesting without the mark has no backdrop at all, which is the bug
// this fixes; a top-level FormDialog keeps exactly the one backdrop it always had.
import { Dialog } from "@base-ui/react/dialog";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { FormDialog, InDialog } from "../src/components/candidate/form-dialog";

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
});
afterEach(cleanup);

function Inner() {
  return (
    <FormDialog
      title="Sửa"
      description="Đổi"
      submitLabel="Lưu"
      busyLabel="Đang lưu"
      busy={false}
      open
      onOpenChange={() => {}}
      onSubmit={() => {}}
    >
      <input aria-label="x" />
    </FormDialog>
  );
}

/** The inner dialog opened from inside an open outer dialog, with or without the record panel's mark. */
function Nested({ marked }: { marked: boolean }) {
  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Popup>
          <InDialog value={marked}>
            <Inner />
          </InDialog>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const backdrops = () =>
  document.querySelectorAll('[data-slot="dialog-overlay"], [data-slot="form-dialog-backdrop"]')
    .length;

describe("hop-long-co-nen-mo", () => {
  it("hop-long-co-nen-mo: a FormDialog inside a dialog draws its backdrop", () => {
    render(<Nested marked />);
    expect(
      document.querySelector('[data-slot="form-dialog-backdrop"]'),
      "hop-long-co-nen-mo",
    ).not.toBeNull();
  });

  it("doi-chung: without the mark the nested dialog has no backdrop (the bug)", () => {
    render(<Nested marked={false} />);
    expect(backdrops(), "doi-chung: hộp lồng không đánh dấu").toBe(0);
  });

  it("a top-level FormDialog keeps exactly one backdrop", () => {
    render(<Inner />);
    expect(backdrops(), "một lớp nền mờ").toBe(1);
  });
});
