// On each screen that uses an item of an outside source, the floating parts it opens: their names,
// the item's own text and the repository's accessibility check. Written by design-assembly.
import {
  floatingCheck,
  floatingScreens,
  test,
} from "../../tools/design-assembly/adapters/playwright-floating-parts.mjs";
for (const item of floatingScreens()) test(item.title, ({ page }) => floatingCheck(page, item));
