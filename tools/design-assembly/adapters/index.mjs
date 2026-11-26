// The adapters: everything this plugin knows about one library or build tool, kept out of its core.
// The core works with the ledgers; an adapter knows where a kind of repository keeps a thing and
// how to reach it. A test fails when a name an adapter declares appears in the core.
import { adapter as eslint } from "./eslint.mjs";
import { adapter as nextjs } from "./nextjs.mjs";
import { adapter as nextjsBuild } from "./nextjs-build.mjs";
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
  lint: "runs the repository's own lint on a text, to see which of its rules reject it",
  routes: "knows which files draw the screen at a route, where the folders of the source say it",
};

// The first build is the one a repository whose packages name none is drawn with.
export const ADAPTERS = [vite, playwright, tailwind, shadcn, react, eslint, nextjs, nextjsBuild];

// The adapter of a kind.
export const adapterOf = (kind) => ADAPTERS.find((adapter) => adapter.kind === kind);

// The build a repository is drawn with and loads its fonts by: the one it shows most surely it
// builds with, by its settings file or its own development command, then by its packages; on a
// tie, the first in the list; and the first build when it names none.
export function buildOf(root) {
  let found = null;
  let best = 0;
  for (const adapter of ADAPTERS.filter((item) => item.kind === "build")) {
    const sure = Number(adapter.detect(root)) || 0;
    if (sure > best) [found, best] = [adapter, sure];
  }
  return found ?? adapterOf("build");
}

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
