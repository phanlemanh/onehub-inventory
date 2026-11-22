// What the repository's lockfile pins a package at. One lockfile is read: package-lock.json, as
// its own documentation states it. Its `packages` maps the place of each installed package, from
// the repository's root, to the `version` found in that package and the `license` it states; a
// lockfile of the oldest shape keeps `dependencies` by name instead, and is read when it has no
// `packages`. Nothing here asks a registry: what is not in the file is not known.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const LOCKFILE = "package-lock.json";

// The version the lockfile pins a package at, and the licence the package states there:
// `lockfile` is null when the repository keeps no lockfile this reads, or one that cannot be read;
// `version` is null when the lockfile does not pin the package.
export function pinnedPackage(root, name) {
  const full = path.join(root, LOCKFILE);
  if (!existsSync(full)) return { lockfile: null };
  let data;
  try {
    data = JSON.parse(readFileSync(full, "utf8"));
  } catch {
    return { lockfile: null };
  }
  const isMap = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const found = isMap(data?.packages)
    ? data.packages[`node_modules/${name}`]
    : isMap(data?.dependencies)
      ? data.dependencies[name]
      : null;
  const version = typeof found?.version === "string" ? found.version : null;
  const license = typeof found?.license === "string" ? found.license : null;
  return { lockfile: LOCKFILE, version, license };
}
