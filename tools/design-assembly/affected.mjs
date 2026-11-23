// Which screens a change reaches: from each screen's page, through every file it imports, to the
// files the change touched (test impact analysis). What it cannot trace asks for the whole suite,
// never for less: the stylesheet, a file the tool data names global, the part of the ledger every
// screen shares, a file of no screen, a screen whose page it cannot find. It only says; it never
// changes how a repository runs its tests, and it never writes.
//
// Usage: node tools/design-assembly/affected.mjs [--base REF | --files FILE...] [--json] [--target DIR]
//   --base   what the change is measured from; by default where the branch left the main one
//   --files  the changed files, given instead of read from git: repeated, or split by commas
// Ends with 0 with an answer, and with 2 on a wrong call or a repository it cannot read.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import process, { argv, cwd, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { adapterOf } from "./adapters/index.mjs";
import { importClosure, readSources, SOURCE_FOLDER } from "./governance.mjs";
import { REGISTRY } from "./patterns.mjs";
import { ledgerText } from "./screen-fragments.mjs";
import {
  builtScreens,
  FRAGMENTS_SHARED,
  fragmentsFolder,
  readScreenLedger,
  SCREEN_LEDGER,
} from "./screen-ledger.mjs";
import { globPattern, screenFiles, SIZES_FILE } from "./screens.mjs";

const THEME = "design/theme.json";
const CODE = /\.(?:[cm]?[jt]sx?)$/;
const USAGE = "Usage: affected.mjs [--base REF | --files FILE...] [--json] [--target DIR]\n";

class Refusal extends Error {}

const read = (root, file) => {
  const full = path.join(root, file);
  return existsSync(full) ? readFileSync(full, "utf8") : null;
};

// The tool data, or nothing when the repository has none. Data that does not read is refused: a
// map of the change read from nothing would say less than the repository asked for.
function themeOf(root) {
  const text = read(root, THEME);
  if (text === null) return {};
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Refusal(`${THEME} is not JSON (${String(error.message).split("\n")[0]})`);
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Refusal(`${THEME} holds no object`);
  }
  return data;
}

// The prefixes the build reads as a folder: `@/` for the source folder, and every `prefix/*` the
// repository's TypeScript settings map to one folder. Settings that do not read add none.
export function aliasesOf(root) {
  const found = [["@/", `${SOURCE_FOLDER}/`]];
  const text = read(root, "tsconfig.json");
  if (text === null) return found;
  let options;
  try {
    // Settings may hold comments and a comma after the last entry, which JSON does not.
    const plain = text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "")
      .replace(/,(\s*[}\]])/g, "$1");
    options = JSON.parse(plain).compilerOptions ?? {};
  } catch {
    return found;
  }
  const from = options.baseUrl ?? ".";
  for (const [key, targets] of Object.entries(options.paths ?? {})) {
    const target = Array.isArray(targets) ? targets[0] : null;
    if (!key.endsWith("/*") || typeof target !== "string" || !target.endsWith("/*")) continue;
    const prefix = key.slice(0, -1);
    const folder = path.posix.normalize(path.posix.join(from, target.slice(0, -1)));
    if (!found.some(([known]) => known === prefix)) {
      found.push([prefix, folder.endsWith("/") ? folder : `${folder}/`]);
    }
  }
  return found;
}

// What the tool data says of the change map: the files that reach every screen, and the files
// that reach none. Globs, as the repository writes them.
function mapOf(theme) {
  const own = theme.affected ?? {};
  const globs = (value) =>
    Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  return { global: globs(own.global), none: globs(own.none) };
}

// The path of the ledger of screens and of the code that lists them, as the tool data names them.
function pathsOf(theme) {
  const checks = Object.values(theme.checks ?? {}).flat();
  const ledger =
    checks.map((check) => check?.ledgers?.screens).find((file) => typeof file === "string") ??
    checks.find((check) => check?.kind === "screen-ledger")?.file ??
    SCREEN_LEDGER;
  const registry =
    checks.map((check) => check?.registry).find((file) => typeof file === "string") ?? REGISTRY;
  return { ledger, registry };
}

// The widths every page is checked at, as numbers.
function widthsOf(root) {
  try {
    const widths = JSON.parse(read(root, SIZES_FILE) ?? "{}").widths;
    return Array.isArray(widths) ? widths.filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

// Each built screen with the files it is drawn from: its page, found in the code that lists the
// screens or, where the folders are the screens, by the routes adapter; then everything they import.
export function screensOf(root, theme = themeOf(root)) {
  const { ledger, registry } = pathsOf(theme);
  const text = ledgerText(root, ledger);
  if (text === null) return { ledger, screens: null };
  const data = readScreenLedger(text);
  const sources = readSources(root, SOURCE_FOLDER);
  const listed = Object.fromEntries(
    screenFiles(read(root, registry), sources, text).map((screen) => [screen.path, screen.file]),
  );
  const routes = adapterOf("routes");
  const byFolders = routes.detect(root);
  const widths = widthsOf(root);
  // What the server runs for any screen: a file it reaches may change any screen while it runs.
  const aliases = aliasesOf(root);
  // A file of the disk an import names, as the data or the stylesheet a module reads; never one
  // above the repository.
  const exists = (file) =>
    !file.startsWith("..") &&
    existsSync(path.join(root, file)) &&
    statSync(path.join(root, file)).isFile();
  const served = byFolders
    ? routes
        .entries(sources)
        .map((entry) => ({ entry, ...importClosure([entry], sources, aliases, exists) }))
    : [];
  const own = Object.fromEntries((data.screens ?? []).map((screen) => [screen.id, screen]));
  const screens = builtScreens(data).map((screen) => {
    const pages = [
      ...(listed[screen.path] ? [listed[screen.path]] : []),
      ...(byFolders ? routes.pageFiles(screen.path, sources) : []),
    ];
    const sizes = Array.isArray(own[screen.id]?.sizes)
      ? own[screen.id].sizes.map(Number).filter(Number.isFinite)
      : widths;
    return {
      id: screen.id,
      route: screen.path,
      sizes,
      pages,
      ...importClosure(pages, sources, aliases, exists),
    };
  });
  // The frame of the application: what its page starts from, as the build adapter reads it, and
  // everything that imports. Null when no entry is found.
  const started = (adapterOf("build").entries?.(root) ?? []).filter((file) => file in sources);
  const frame =
    started.length > 0
      ? { entries: started, ...importClosure(started, sources, aliases, exists) }
      : null;
  return { ledger, screens, served, routed: byFolders, frame };
}

// What a change reaches, as data: whether everything must run and why, each screen it reaches with
// the changed files that reach it, and the changed files that could not be traced.
export function affectedBy(root, changed) {
  const theme = themeOf(root);
  const { global, none } = mapOf(theme);
  const matches = (globs, file) => globs.some((glob) => globPattern(glob).test(file));
  const { ledger, screens, served } = screensOf(root, theme);
  const folder = fragmentsFolder(ledger);
  const why = [];
  const unmapped = [];
  const reached = new Map();
  const reach = (screen, file) => reached.set(screen, [...(reached.get(screen) ?? []), file]);
  if (screens === null) {
    const counted = changed.filter((file) => !matches(none, file) || matches(global, file));
    if (counted.length > 0)
      why.push({ file: null, reason: "this repository has no ledger of screens" });
    return { all: why.length > 0, why, screens: [], unmapped };
  }
  // Why a code file cannot be ruled out of some screen: a screen whose page cannot be found, or
  // one that imports, or is served by code that imports, what cannot be followed.
  const cannot = (item) =>
    `imports what this tool cannot follow: ${item.opaque[0].file} imports \`${item.opaque[0].name}\``;
  const blind = [
    ...screens
      .filter((screen) => screen.pages.length === 0)
      .map(
        (screen) =>
          `no file draws the screen ${screen.id} (${screen.route}) that this tool can find`,
      ),
    ...screens
      .filter((screen) => screen.opaque.length > 0)
      .map((screen) => `the screen ${screen.id} (${screen.route}) ${cannot(screen)}`),
    ...served
      .filter((item) => item.opaque.length > 0)
      .map((item) => `${item.entry}, which the server runs for any screen, ${cannot(item)}`),
  ];
  for (const file of changed) {
    if (theme.stylesheet && file === theme.stylesheet) {
      why.push({ file, reason: "the stylesheet" });
      continue;
    }
    if (matches(global, file)) {
      why.push({ file, reason: "a file the tool data names global" });
      continue;
    }
    if (file === ledger) {
      why.push({ file, reason: "the ledger of screens, which lists every screen" });
      continue;
    }
    if (file === `${folder}/${FRAGMENTS_SHARED}`) {
      why.push({ file, reason: "the part of the ledger of screens every screen shares" });
      continue;
    }
    const own = screens.find((screen) => file === `${folder}/${screen.id}.yaml`);
    if (own) {
      reach(own, file);
      continue;
    }
    const drawn = screens.filter((screen) => screen.files.has(file));
    for (const screen of drawn) reach(screen, file);
    const run = served.find((item) => item.files.has(file));
    if (run) {
      why.push({
        file,
        reason: `also reached from ${run.entry}, which the server runs for any screen`,
      });
      continue;
    }
    if (CODE.test(file) && blind.length > 0) {
      why.push({ file, reason: blind[0] });
      continue;
    }
    // A file a screen imports is that screen's whatever the tool data says; one of no screen is
    // let go when the tool data says it reaches none.
    if (drawn.length === 0 && matches(none, file)) continue;
    if (drawn.length === 0) {
      unmapped.push(file);
      why.push({ file, reason: "not a file of any screen" });
    }
  }
  return {
    all: why.length > 0,
    why,
    screens: screens
      .filter((screen) => reached.has(screen))
      .map((screen) => ({
        id: screen.id,
        route: screen.route,
        sizes: screen.sizes,
        why: reached.get(screen),
      })),
    unmapped,
  };
}

// A pattern that picks the tests whose names hold one of the routes, as a word of its own.
function grepOf(screens) {
  if (screens.length === 0) return null;
  const routes = [...new Set(screens.map((screen) => screen.route))]
    .sort((a, b) => b.length - a.length)
    .map((route) => route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return `(?:^|\\s)(?:${routes.join("|")})(?=\\s|$)`;
}

// The changed files git gives: what differs from where the branch left the main one, or from
// `base`, with what is not committed and what git does not know yet.
function changedFiles(root, base) {
  const git = (...args) =>
    spawnSync("git", ["-C", root, ...args], { encoding: "utf8", maxBuffer: 1 << 30 });
  // A list git could not give whole is refused, never read as fewer changes.
  const listed = (...args) => {
    const run = git(...args);
    if (run.error || run.status !== 0) {
      const said = String(run.error?.message ?? run.stderr ?? "")
        .trim()
        .split("\n")[0];
      throw new Refusal(`git could not list the changes (${said || "no reason given"})`);
    }
    return run.stdout.split("\0").filter(Boolean);
  };
  const inside = git("rev-parse", "--is-inside-work-tree");
  if (inside.error || inside.status !== 0) {
    throw new Refusal("this folder is not a git repository: name the files with --files");
  }
  let from = base;
  if (from === undefined) {
    const main = ["origin/HEAD", "main", "master"].find(
      (name) => git("rev-parse", "--verify", "--quiet", name).status === 0,
    );
    if (!main) throw new Refusal("no main branch to measure from: give --base or --files");
    from = git("merge-base", "HEAD", main).stdout.trim();
    if (!from) throw new Refusal(`this branch shares no history with ${main}: give --base`);
  } else if (
    from.startsWith("-") ||
    git("rev-parse", "--verify", "--quiet", "--end-of-options", `${from}^{commit}`).status !== 0
  ) {
    throw new Refusal(`${from} is not a commit git knows`);
  }
  // Git names a change from the top of the repository, which the target may be a folder of: a
  // file inside is named from the target, one outside by where it is from the top.
  const prefix = git("rev-parse", "--show-prefix").stdout.trim();
  const fromTarget = (name) => (name.startsWith(prefix) ? name.slice(prefix.length) : `:/${name}`);
  const files = [
    ...listed("diff", "--name-only", "--no-renames", "-z", from, "--").map(fromTarget),
    ...listed("ls-files", "--others", "--exclude-standard", "-z"),
  ];
  return { base: from, files: [...new Set(files)] };
}

// The call, read against this command's flags and the ones every command takes.
function readCall(args) {
  if (args.includes("--help") || args.includes("-h")) return { help: true };
  const found = { files: [] };
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === "--json" || flag === "--help" || flag === "-h") {
      found[flag] = true;
      continue;
    }
    if (!["--target", "--base", "--files"].includes(flag)) {
      return { problem: `${flag} is not a flag of this command` };
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith("--")) return { problem: `${flag} needs a value` };
    index += 1;
    if (flag === "--files") found.files.push(...value.split(",").filter(Boolean));
    else found[flag] = value;
  }
  if (found["--base"] !== undefined && found.files.length > 0) {
    return { problem: "give --base or --files, not both" };
  }
  const target = path.resolve(found["--target"] ?? cwd());
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    return { problem: `${target} is not a folder` };
  }
  const named = args.includes("--files");
  return { ...found, target, named };
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// What a person reads: one line per screen, or why the whole suite runs.
function textOf(result) {
  const head = `affected: ${plural(result.changed.length, "file")} changed`;
  if (result.all) {
    const [first, ...rest] = result.why;
    const said = first.file === null ? first.reason : `${first.file} is ${first.reason}`;
    const more = rest.length > 0 ? ` (and ${rest.length} more)` : "";
    return `affected: run everything: ${said}${more}\n`;
  }
  if (result.screens.length === 0) return `${head}, no screen\n`;
  const lines = [`${head}, ${plural(result.screens.length, "screen")}`];
  for (const screen of result.screens) {
    const at = screen.sizes.length > 0 ? ` at ${screen.sizes.join(", ")} px` : "";
    lines.push(`  ${screen.route} (${screen.id})${at}: ${screen.why.join(", ")}`);
  }
  lines.push(`  tests whose name holds one of these routes: ${result.grep}`);
  return `${lines.join("\n")}\n`;
}

function main(args) {
  const call = readCall(args);
  if (call.problem) {
    stderr.write(`design-assembly: ${call.problem}\n${USAGE}`);
    return 2;
  }
  if (call.help) {
    stdout.write(USAGE);
    return 0;
  }
  const { base, files } = call.named
    ? { base: null, files: call.files }
    : changedFiles(call.target, call["--base"]);
  const found = affectedBy(call.target, files);
  const result = {
    base,
    changed: files,
    ...found,
    grep: found.all ? null : grepOf(found.screens),
  };
  stdout.write(call["--json"] ? `${JSON.stringify(result, null, 2)}\n` : textOf(result));
  return 0;
}

// Runs only when this file is the script. Anything it cannot read ends with 2, never with a trace.
if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    process.exitCode = main(argv.slice(2));
  } catch (error) {
    stderr.write(
      `design-assembly: ${error instanceof Refusal ? error.message : `this repository cannot be read: ${String(error.message).split("\n")[0]}`}\n`,
    );
    process.exitCode = 2;
  }
}
