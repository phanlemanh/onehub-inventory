// The browser adapter for Playwright: the browser the repository tests its pages with, and the
// package whose presence says its browser checks include accessibility.
const ACCESSIBILITY = "@axe-core/playwright";
// The ways a repository may configure its accessibility check, each taking plain values.
const SETTINGS = ["withTags", "withRules", "disableRules", "include", "exclude", "options"];

// The arguments of one call, as plain values: strings, numbers, lists and records written as such.
function plainValues(text) {
  const json = text
    .replace(/'([^'\\]*)'/g, (_, inner) => JSON.stringify(inner))
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
    .replace(/,(\s*[\]}])/g, "$1")
    .replace(/,\s*$/, "");
  return JSON.parse(`[${json}]`);
}

// The calls of one chain between the builder and its run, such as
// `.withTags([...]).disableRules([...])`, or why they cannot be read.
function chainCalls(chain) {
  const calls = [];
  let index = 0;
  while (index < chain.length) {
    const head = /^\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/.exec(chain.slice(index));
    if (!head) {
      if (chain.slice(index).trim() === "") break;
      return { problem: `\`${chain.slice(index).trim().slice(0, 40)}\` is not a call` };
    }
    let depth = 1;
    let at = index + head[0].length;
    let quote = null;
    for (; at < chain.length && depth > 0; at += 1) {
      const mark = chain[at];
      if (quote) {
        if (mark === quote && chain[at - 1] !== "\\") quote = null;
      } else if (mark === '"' || mark === "'" || mark === "`") quote = mark;
      else if ("([{".includes(mark)) depth += 1;
      else if (")]}".includes(mark)) depth -= 1;
    }
    const method = head[1];
    const args = chain.slice(index + head[0].length, at - 1);
    if (!SETTINGS.includes(method))
      return { problem: `.${method}() is no setting this tool knows` };
    try {
      calls.push({ method, args: plainValues(args) });
    } catch {
      return { problem: `.${method}(${args.trim().slice(0, 40)}) is not written as plain values` };
    }
    index = at;
  }
  return { calls };
}

export const adapter = {
  id: "playwright",
  kind: "browser",
  names: ["playwright", "@playwright/test", ACCESSIBILITY, "chromium"],
  accessibilityPackage: ACCESSIBILITY,
  // The package of the test browser a repository lists when it tests its pages in one.
  testPackage: "@playwright/test",
  // The repository's own accessibility check, read from one of its browser tests: null where the
  // file does not run it; else each way the file runs it, as the calls between the builder and its
  // run, or why that cannot be read.
  accessibility: {
    configured(text) {
      const source = String(text ?? "");
      const name =
        /import\s+([A-Za-z_$][\w$]*)\s+from\s+["']@axe-core\/playwright["']/.exec(source)?.[1] ??
        /import\s*\{[^}]*\bAxeBuilder(?:\s+as\s+([A-Za-z_$][\w$]*))?[^}]*\}\s*from\s*["']@axe-core\/playwright["']/
          .exec(source)
          ?.slice(1)
          .find(Boolean) ??
        (/import\s*\{[^}]*\bAxeBuilder\b[^}]*\}\s*from\s*["']@axe-core\/playwright["']/.test(source)
          ? "AxeBuilder"
          : null);
      if (name === null) return null;
      const runs = [
        ...source.matchAll(
          new RegExp(
            `new\\s+${name}\\s*\\(\\s*\\{[^}]*\\}\\s*\\)([\\s\\S]*?)\\.\\s*analyze\\s*\\(\\s*\\)`,
            "g",
          ),
        ),
      ];
      if (runs.length === 0)
        return { problem: `it imports ${name} and runs it in no way this tool reads` };
      const chains = [];
      for (const found of runs) {
        const read = chainCalls(found[1]);
        if (read.problem) return { problem: read.problem };
        if (!chains.some((calls) => JSON.stringify(calls) === JSON.stringify(read.calls))) {
          chains.push(read.calls);
        }
      }
      return { chains };
    },
    // Runs each way of the check on the page as it is now: one line per violation, its rule, what it
    // asks and the first element it found. `require` resolves from the repository.
    async run(page, checks, require) {
      const loaded = require(ACCESSIBILITY);
      const Builder = loaded.default ?? loaded.AxeBuilder ?? loaded;
      const found = [];
      for (const { calls } of checks) {
        let builder = new Builder({ page });
        for (const { method, args } of calls) builder = builder[method](...args);
        const { violations } = await builder.analyze();
        found.push(
          ...violations.map((item) => `${item.id}: ${item.help} (${item.nodes[0]?.html ?? ""})`),
        );
      }
      return [...new Set(found)];
    },
  },
  // One role's way in, as the browser test by role enters it: a file of the repository that gives,
  // for each role of its domain model, a function that is given the page and makes the browser that
  // role and no other, or does nothing where the application has no sign-in. The repository writes
  // it and keeps it; this plugin never writes sign-in code.
  door: {
    file: "tests/e2e/roles.ts",
    name: "DOORS",
    shape: "export const DOORS: Record<string, (page: Page) => Promise<void>>, one entry per role",
  },
  // A browser from the repository's own packages: `require` resolves from the repository.
  launch: (require) => require("@playwright/test").chromium.launch(),
  // Whether the repository has it, without starting it.
  installed: (require) => {
    try {
      require.resolve("@playwright/test");
      return true;
    } catch {
      return false;
    }
  },
};
