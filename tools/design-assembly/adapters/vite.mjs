// The build adapter for Vite: the repository's own development server, taken from its packages,
// serving extra modules beside the repository's and changing a module as it is served, never on
// disk.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { faceRule, importLine, stylesheetLoads } from "./css-fonts.mjs";

export const adapter = {
  id: "vite",
  kind: "build",
  names: ["vite", "@vitejs"],
  // Its server runs inside this process: it serves a module of the plugin's own, loads one of the
  // repository's, and changes one as it is served.
  serves: { modules: true, load: true, transform: true },
  detect,
  // A module imported by an address only known while the page runs.
  importExpression: (address) => `import(/* @vite-ignore */ ${address})`,
  entries,
  serve,
  // What loads a typeface on this stack: an @font-face rule of the stylesheet, or a font package
  // the stylesheet imports.
  fontLoads: stylesheetLoads,
  fontsSay:
    "no @font-face rule of the stylesheet declares it, and no package the stylesheet imports does",
  // The rules that load a font kept as files of the repository, one per file, as this stack
  // takes them in a stylesheet.
  fontFaces: (font, stylesheet) =>
    font.pin.files.map((entry) =>
      faceRule({
        family: font.family,
        url: fileAddress(entry.file, stylesheet),
        weight: entry.weight,
        style: entry.style,
      }),
    ),
  // The folder whose files this build serves from the root of the site: where an address that
  // starts at the root leads.
  publicFolder: "public",
  // What a person writes to load a font this stack has no rule of its own for.
  fontHint: (font, stylesheet) =>
    font.pin?.package ? importLine(font.pin.package, stylesheet) : null,
};

// The folder whose files this build serves from the root of the site, as they are.
const PUBLIC_FOLDER = "public/";

// The address of a file of the repository in a stylesheet: from the root of the site when the
// build serves it from its public folder, else by the path from the stylesheet's own folder, which
// the build follows and takes the file from.
function fileAddress(file, stylesheet) {
  const normal = path.posix.normalize(String(file));
  if (normal.startsWith(PUBLIC_FOLDER)) return `/${normal.slice(PUBLIC_FOLDER.length)}`;
  const relative = path.posix.relative(path.posix.dirname(stylesheet), normal);
  return relative.startsWith(".") ? relative : `./${relative}`;
}

// How surely the repository builds with Vite: 2 when it keeps Vite's settings file or its own
// development command runs Vite, 1 when its packages only name it, 0 when they do not. A file of
// Vite's test runner says nothing: an application built another way may test with it.
function detect(root) {
  let data;
  try {
    data = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  } catch {
    return 0;
  }
  if (!(data.dependencies?.vite ?? data.devDependencies?.vite)) return 0;
  const settings = ["js", "mjs", "cjs", "ts", "mts", "cts"].some((ext) =>
    existsSync(path.join(root, `vite.config.${ext}`)),
  );
  return settings || /^vite\b/.test(String(data.scripts?.dev ?? "")) ? 2 : 1;
}

// The page with its comments taken out, read left to right as a browser reads them: a comment opens
// at `<!--` and closes at the first `-->` after it, or at once on `<!-->` or `<!--->`; one never
// closed runs to the end of the page. What is left is only read, never shown.
function withoutComments(page) {
  let kept = "";
  let at = 0;
  for (;;) {
    const open = page.indexOf("<!--", at);
    if (open < 0) return kept + page.slice(at);
    kept += page.slice(at, open);
    const body = open + 4;
    if (page.startsWith(">", body)) at = body + 1;
    else if (page.startsWith("->", body)) at = body + 2;
    else {
      const close = page.indexOf("-->", body);
      if (close < 0) return kept;
      at = close + 3;
    }
  }
}

// The files the application starts from: each module its page loads, as index.html names it, by
// path from the repository root. None when there is no such page, or it loads none of the
// repository's own.
function entries(root) {
  const file = path.join(root, "index.html");
  if (!existsSync(file)) return [];
  // A script inside a comment is not loaded.
  const page = withoutComments(readFileSync(file, "utf8"));
  const found = [];
  for (const [, attributes] of page.matchAll(/<script\b([^>]*)>/gi)) {
    if (!/\btype\s*=\s*["']module["']/i.test(attributes)) continue;
    // `src` itself, not an attribute that ends with it; the query or anchor of the address is no part
    // of the file.
    const src = /(?:^|\s)src\s*=\s*["']([^"']+)["']/i.exec(attributes)?.[1]?.replace(/[?#].*$/, "");
    if (!src || /^[a-z][a-z0-9+.-]*:|^\/\//i.test(src)) continue;
    const own = path.posix.normalize(src.replace(/^\//, ""));
    if (!own.startsWith("..") && !found.includes(own)) found.push(own);
  }
  return found;
}

// Opens the server: `require` resolves from the repository. Returns the origin, a way to load one of
// its modules as its build would, and a way to close.
async function serve(require, target, { modules = {}, transform = null } = {}) {
  const root = path.dirname(require.resolve("vite/package.json"));
  const entry = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).exports?.["."];
  const file =
    typeof entry === "string" ? entry : (entry?.import?.default ?? entry?.import ?? entry?.default);
  const { createServer } = await import(pathToFileURL(path.join(root, file)).href);
  const server = await createServer({
    root: target,
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 5290, strictPort: false },
    plugins: [
      {
        name: "design-assembly-stage",
        enforce: "pre",
        transform: (code, id) => (transform ? transform(code, id) : null),
        resolveId: (id) => (id in modules ? id : null),
        load: (id) => (id in modules ? modules[id] : null),
      },
    ],
  });
  await server.listen();
  return {
    origin: server.resolvedUrls.local[0].replace(/\/$/, ""),
    load: (module) => server.ssrLoadModule(module),
    close: () => server.close(),
  };
}
