// The adapters: everything this plugin knows about one library or build tool, kept out of its core.
// The core works with the ledgers; an adapter knows where a kind of repository keeps a thing and
// how to reach it. A test fails when a name an adapter declares appears in the core.
import { adapter as playwright } from "./playwright.mjs";
import { adapter as react } from "./react.mjs";
import { adapter as shadcn } from "./shadcn.mjs";
import { adapter as tailwind } from "./tailwind.mjs";
import { adapter as vite } from "./vite.mjs";

// What each kind of adapter does.
export const ADAPTER_KINDS = {
  build: "opens a screen of the repository in a browser",
  browser: "drives the browser the repository tests its pages with",
  values: "reads and writes the design values",
  components:
    "knows which folder is the component library's, and how a component declares its variants",
  source: "reads screens and components to check words, states and controls",
};

export const ADAPTERS = [vite, playwright, tailwind, shadcn, react];

// Every name an adapter declares that appears in a text: a library or build tool named where only
// an adapter may name it. A name is matched whole, in any case, so `reactive` is not `react`.
export function libraryNamesIn(text) {
  const found = new Set();
  for (const adapter of ADAPTERS) {
    for (const name of adapter.names) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\/@-]/g, "\\$&");
      if (new RegExp(`(?<![\\w@/-])${escaped}(?![\\w-])`, "i").test(text)) found.add(name);
    }
  }
  return [...found].sort();
}
