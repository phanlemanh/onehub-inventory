// AC-2, where the pinned tree comes from: the release ledger of the plugin's own repository, read at
// the commit the matrix names, says version 0.1.0 hands a repository the tool tree the matrix pins.
// Without the plugin's repository the measure says it could not read it and fails: a value nobody
// read is not a value checked.
// Usage: node release-ledger.mjs --plugin-repo <design-assembly checkout> [--ledger F]
//   --ledger: the release ledger as a file, instead of asking git for it at the pinned commit
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { stdout } from "node:process";

import { option } from "./linked-copy.mjs";
import { PLUGIN_SOURCE, RELEASE } from "./matrix.mjs";

const given = option("--ledger");
const repo = option("--plugin-repo");
let text = null;
if (given) {
  text = readFileSync(given, "utf8");
} else if (repo && existsSync(path.join(repo, ".git"))) {
  try {
    text = execFileSync(
      "git",
      ["-C", repo, "show", `${PLUGIN_SOURCE.commit}:${PLUGIN_SOURCE.ledger}`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch {
    text = null;
  }
}
if (text === null) {
  stdout.write(
    `release ledger: cannot read ${PLUGIN_SOURCE.ledger} at ${PLUGIN_SOURCE.commit.slice(0, 7)} in ${repo ?? "(no --plugin-repo)"}\n`,
  );
  process.exit(1);
}
const release = JSON.parse(text).releases.find((entry) => entry.version === RELEASE.version);
if (!release) {
  stdout.write(`release ledger: no version ${RELEASE.version} at ${PLUGIN_SOURCE.commit.slice(0, 7)}\n`);
  process.exitCode = 1;
} else if (release.tool !== RELEASE.tool) {
  stdout.write(
    `release ledger: version ${RELEASE.version} names tool tree ${release.tool.slice(0, 12)}, not ${RELEASE.tool.slice(0, 12)}\n`,
  );
  process.exitCode = 1;
} else {
  stdout.write(
    `release ledger: version ${RELEASE.version} at ${PLUGIN_SOURCE.commit.slice(0, 7)} names tool tree ${RELEASE.tool.slice(0, 12)}, the one pinned here\n`,
  );
}
