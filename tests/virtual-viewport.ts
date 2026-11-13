// jsdom lays nothing out, so a virtual grid body sees a viewport 0 px tall and mounts no row. Give the grid's scroll
// viewport a tall box (rows stay 0 px), so the virtual body mounts every row and DOM checks see the whole run.
// Real browsers measure for themselves: the browser suite (tests/e2e) checks the virtual body as users see it.
export const VIEWPORT_TEST_HEIGHT = 100_000;

export function tallGridViewport(): void {
  const original = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    if (this instanceof HTMLElement && this.dataset["slot"] === "scroll-area-viewport") {
      // Every field is set here: a box from a floating element's measuring may carry no toJSON to spread.
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        width: 1200,
        height: VIEWPORT_TEST_HEIGHT,
        right: 1200,
        bottom: VIEWPORT_TEST_HEIGHT,
        toJSON: () => ({}),
      } as DOMRect;
    }
    return original.call(this);
  };
  for (const prop of ["clientHeight", "offsetHeight"] as const) {
    Object.defineProperty(HTMLElement.prototype, prop, {
      configurable: true,
      get(this: HTMLElement) {
        return this.dataset["slot"] === "scroll-area-viewport" ? VIEWPORT_TEST_HEIGHT : 0;
      },
    });
  }
}
