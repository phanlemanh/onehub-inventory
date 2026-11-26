// The build adapter for Next.js: the repository's own development server, taken from its packages
// and run as the repository runs it, on a free port of this machine only. Unlike a server that
// runs inside this process, it cannot serve a module of the plugin's own beside the repository's,
// load one of the repository's modules for the plugin, or change a module as it is served: it
// says so in `serves`, and the scripts that need those say what they could not draw.
import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";
import { setTimeout as wait } from "node:timers/promises";

import { importLine, stylesheetLoads } from "./css-fonts.mjs";

// How long the server may take to say it is ready, and to stop once asked.
const READY_MS = 120_000;
const STOP_MS = 5_000;
const READY = /\bReady in\b/;

export const adapter = {
  // Named for its library, as every adapter is; the routes adapter of the same library is `nextjs`.
  id: "next.js",
  kind: "build",
  names: ["next.js", "nextjs"],
  serves: { modules: false, load: false, transform: false },
  detect,
  serve,
  fontLoads,
  fontsSay:
    "no @font-face rule of the stylesheet declares it, no package the stylesheet imports does, and no font loader in a layout file sets it",
  // This adapter writes no code that loads a font: a person writes it, and this says what.
  fontHint: (font, stylesheet) =>
    font.variable
      ? `call the build's font loader in a layout file so that it sets ${font.variable}`
      : font.pin?.package
        ? importLine(font.pin.package, stylesheet)
        : `write an @font-face rule for each file of the font in ${stylesheet}, or call the build's font loader in a layout file`,
};

// The folders a layout file of the app router sits in, and the modules of the build's font loader.
const APP_FOLDERS = ["src/app", "app"];
const LAYOUT = /^layout\.[jt]sx?$/;
const LOADER = /from\s+["']next\/font\/(google|local)["']/;

function layoutFiles(root, folder) {
  const full = path.join(root, folder);
  if (!existsSync(full) || !statSync(full).isDirectory()) return [];
  return readdirSync(full)
    .sort()
    .flatMap((name) => {
      if (name === "node_modules" || name.startsWith(".")) return [];
      const file = path.posix.join(folder, name);
      if (statSync(path.join(root, file)).isDirectory()) return layoutFiles(root, file);
      return LAYOUT.test(name) ? [file] : [];
    });
}

// The modules of the build's font loader a layout file imports, by the name each is called with:
// the default import of a module, and each name imported from it.
function loaderNames(source) {
  const names = new Map();
  const imports =
    /import\s+(?:([\w$]+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s+["']next\/font\/(google|local)["']/g;
  for (const [, whole, listed, kind] of source.matchAll(imports)) {
    if (whole) names.set(whole, kind);
    for (const item of (listed ?? "").split(",")) {
      const name = item
        .trim()
        .split(/\s+as\s+/)
        .pop();
      if (name) names.set(name, kind);
    }
  }
  return names;
}

// The call a place of the source sits in: the name called, and the text between its brackets.
// Null when the place is in no call.
function callAround(source, index) {
  let depth = 0;
  let open = -1;
  for (let at = index; at >= 0; at -= 1) {
    if (source[at] === ")") depth += 1;
    else if (source[at] === "(") {
      if (depth === 0) {
        open = at;
        break;
      }
      depth -= 1;
    }
  }
  if (open === -1) return null;
  depth = 0;
  let close = source.length;
  for (let at = open; at < source.length; at += 1) {
    if (source[at] === "(") depth += 1;
    else if (source[at] === ")") {
      depth -= 1;
      if (depth === 0) {
        close = at;
        break;
      }
    }
  }
  const name = /([\w$]+)\s*$/.exec(source.slice(0, open))?.[1] ?? null;
  return { name, text: source.slice(open + 1, close) };
}

// The font files a call of the loader names that are files of the repository: each path the call
// writes with a font's ending, followed from the layout file's own folder. Only what is there
// counts; a call that names none takes its font from somewhere this reader cannot see.
function namedFiles(root, file, call) {
  const found = [];
  for (const match of call.matchAll(/["']([^"']+\.(?:woff2|woff|ttf|otf))["']/gi)) {
    const named = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
    if (named.startsWith("..")) continue;
    const full = path.join(root, named);
    if (!existsSync(full) || !statSync(full).isFile() || found.includes(named)) continue;
    // A link inside the repository that leads out of it names no file of it.
    const led = path.relative(realpathSync(root), realpathSync(full));
    if (!led.startsWith("..") && !path.isAbsolute(led)) found.push(named);
  }
  return found;
}

// What loads a typeface on this stack: what the stylesheet loads itself, and the build's font
// loader called in a layout file. The loader writes its family under a name it makes up, so a
// stylesheet reaches a font of the loader only through the CSS variable the call sets, with
// `variable`: that variable is what it loads, never the family by its name. A call with no
// variable is applied by a class or a style in code, which no stylesheet names. Each such load
// says which module of the loader was called, and the font files of the repository the call names.
function fontLoads(root, css, stylesheet) {
  const loads = stylesheetLoads(root, css, stylesheet);
  for (const file of APP_FOLDERS.flatMap((folder) => layoutFiles(root, folder))) {
    const source = readFileSync(path.join(root, file), "utf8");
    if (!LOADER.test(source)) continue;
    const by = `the font loader in ${file}`;
    const names = loaderNames(source);
    for (const match of source.matchAll(/\bvariable\s*:\s*["'](--[\w-]+)["']/g)) {
      const call = callAround(source, match.index);
      loads.push({
        variable: match[1],
        by,
        via: "loader",
        file,
        loader: names.get(call?.name) ?? null,
        files: call ? namedFiles(root, file, call.text) : [],
      });
    }
  }
  return loads;
}

// How surely the repository builds with Next.js: 2 when it keeps Next.js's settings file or its
// own development command runs it, 1 when its packages only name it, 0 when they do not.
function detect(root) {
  let data;
  try {
    data = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  } catch {
    return 0;
  }
  if (!(data.dependencies?.next ?? data.devDependencies?.next)) return 0;
  const settings = ["js", "mjs", "cjs", "ts", "mts"].some((ext) =>
    existsSync(path.join(root, `next.config.${ext}`)),
  );
  return settings || /^next\b/.test(String(data.scripts?.dev ?? "")) ? 2 : 1;
}

// A port nothing listens on now, on this machine only.
function freePort() {
  return new Promise((done, fail) => {
    const probe = createServer();
    probe.once("error", fail);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => done(port));
    });
  });
}

const lastLine = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1) ?? "it said nothing";

// Opens the server: `require` resolves from the repository, and a build that is not installed
// throws as resolving does. Returns the origin and a way to close; it loads no module for the
// plugin. The server and the workers it starts are one group, stopped together on every way out:
// once closed, when it stops before it is ready, and when this process ends without closing it.
// A group of processes is a thing of macOS and Linux; on Windows the server is not stopped.
async function serve(require, target) {
  const bin = require.resolve("next/dist/bin/next");
  const port = await freePort();
  const child = spawn(
    process.execPath,
    [bin, "dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: target,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    },
  );
  let said = "";
  let failed = null;
  child.stdout.on("data", (chunk) => (said += chunk));
  child.stderr.on("data", (chunk) => (said += chunk));
  child.once("error", (error) => (failed = error));
  const exited = new Promise((done) => child.once("close", done));
  const gone = () => child.exitCode !== null || child.signalCode !== null;
  const stop = (signal) => {
    try {
      process.kill(-child.pid, signal);
    } catch {
      // The group is gone already.
    }
  };
  // This process may end without closing: the group goes with it.
  const onExit = () => stop("SIGKILL");
  process.once("exit", onExit);
  let closed = false;
  const close = async () => {
    if (closed) return;
    closed = true;
    process.off("exit", onExit);
    if (child.pid === undefined) return;
    if (!gone()) {
      stop("SIGTERM");
      await Promise.race([exited, wait(STOP_MS)]);
    }
    // A worker may outlive its leader: the last word to the group is always the strongest.
    stop("SIGKILL");
  };
  const started = Date.now();
  while (!READY.test(said)) {
    if (failed) {
      await close();
      throw new Error(`the development server could not start: ${failed.message}`);
    }
    if (gone()) {
      await close();
      throw new Error(`the development server stopped before it was ready: ${lastLine(said)}`);
    }
    if (Date.now() - started > READY_MS) {
      await close();
      throw new Error(`the development server was not ready within ${READY_MS / 1000} seconds`);
    }
    await wait(200);
  }
  return { origin: `http://127.0.0.1:${port}`, load: null, close };
}
