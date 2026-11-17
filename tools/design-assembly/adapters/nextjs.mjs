// The routes adapter for Next.js with its app router: a screen is the page of a folder under
// src/app, at the route its folders spell. A folder in brackets, `(group)`, adds nothing to the
// route, nor does a slot, `@slot`; the layout, template, loading and error files of every folder on
// the page's way wrap it, so they are part of the screen as well. Route handlers, the middleware and
// the instrumentation are run by the server for whichever screen calls them: they are its entries.
import { readFileSync } from "node:fs";
import path from "node:path";

const APP = "src/app";
const PAGE = /^page\.[jt]sx?$/;
const AROUND = /^(layout|template|loading|error)\.[jt]sx?$/;
const HANDLER = /^route\.[jt]s$/;
const SERVED = new Set(["src/middleware.ts", "src/middleware.js", "src/instrumentation.ts"]);

export const adapter = {
  id: "nextjs",
  kind: "routes",
  names: ["nextjs", "next.js"],
  detect,
  pageFiles,
  entries,
};

// The files the server runs on its own: every route handler under the app's folder, the
// middleware and the instrumentation.
function entries(sources) {
  return Object.keys(sources).filter(
    (file) =>
      SERVED.has(file) || (file.startsWith(`${APP}/`) && HANDLER.test(path.posix.basename(file))),
  );
}

// Whether the repository builds with Next.js: its packages name it.
function detect(root) {
  try {
    const data = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    return Boolean(data.dependencies?.next ?? data.devDependencies?.next);
  } catch {
    return false;
  }
}

// The route a folder under the app's folder spells.
const routeOf = (folder) =>
  `/${folder
    .split("/")
    .filter((part) => part !== "" && !/^\(.*\)$/.test(part) && !part.startsWith("@"))
    .join("/")}`;

// The files that draw the screen at `route`: its page, and every file that wraps it on its way down
// from the app's folder. Empty when no page of the sources is at that route.
function pageFiles(route, sources) {
  const pages = Object.keys(sources).filter(
    (file) =>
      file.startsWith(`${APP}/`) &&
      PAGE.test(path.posix.basename(file)) &&
      routeOf(path.posix.dirname(file).slice(APP.length + 1)) === route,
  );
  const around = new Set();
  for (const page of pages) {
    let folder = path.posix.dirname(page);
    while (folder.startsWith(APP)) {
      for (const file of Object.keys(sources)) {
        if (path.posix.dirname(file) === folder && AROUND.test(path.posix.basename(file))) {
          around.add(file);
        }
      }
      folder = path.posix.dirname(folder);
    }
  }
  return [...pages, ...around];
}
