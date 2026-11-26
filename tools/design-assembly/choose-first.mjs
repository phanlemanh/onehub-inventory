// The gate holds the choice (spec 0015, criterion 11): choose before making, held on what a branch
// adds against where it left the main branch.
//
//   - A component file of the repository's own that the branch adds, with no row of the intake
//     ledger, outside the folder of a pinned source and every conform record, and not on the list
//     of what came before as the main branch kept it, is red. An entry the branch writes for a
//     file it adds lets nothing through.
//   - A row made by hand that the branch writes says the words find was asked with (`searched`)
//     and the nearest candidate it gave (`nearest`): a name a store of the repository, a pinned
//     catalog or the starter kit holds, or `none` when nothing answered. Missing, or a name none
//     of them holds, is red. The reason stays the owner's to read on the decision sheet.
//   - One need, one solution: a second row for a need is red. The shapes check holds that already.
//
// What the main branch has is not the branch's, so a repository that is green today stays green on
// the files and rows it already has. Outside git nothing is compared, and the check says so.
import path from "node:path";

import { componentsOf } from "./components.mjs";
import { INTAKE_LEDGER, isByHand } from "./intake-ledger.mjs";
import { branchBase } from "./owner-calls.mjs";
import { joinFound } from "./screen-fragments.mjs";
import { FRAGMENTS_SHARED, fragmentsFolder, isFragment } from "./screen-ledger.mjs";
import { KINDS_FOLDER, readKinds, readPages } from "./screens.mjs";
import { readPinnedSources } from "./sources-ledger.mjs";

// The check, as the ledger-shapes row holds it wherever the row is written: by the guide, by
// adopting, and by upgrading a repository that lacks it.
export const CHOOSE_FIRST_CHECK = { kind: "choose-first" };

// The nearest candidate of a row made by hand when find answered nothing to the words searched.
export const NOTHING_ANSWERS = "none";

// The names of the starter kit of this plugin, the one store the gate cannot read on the disk of a
// repository. A test of the plugin holds them to its references/starter.json.
export const STARTER_NAMES = [
  "TypedTable",
  "TableActions",
  "RowActions",
  "HeldLabel",
  "WithRecord",
  "useList",
  "AppFrame",
  "notifyDone",
];

const NOT_IN_GIT =
  "not in a git repository: what a branch adds is not compared with the main branch";
const NO_COMMIT = "no commit yet: the repository starts here, so what it adds is not compared";

const isMap = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const listOf = (value) => (Array.isArray(value) ? value.filter(isMap) : []);
const words = (value) =>
  typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
const fileOf = (value) => (words(value) ? path.posix.normalize(words(value)) : null);

// The intake ledger at the base, in whichever shape it was kept there: one file, or one file per
// block beside a shared part. Null where the base has neither.
function intakeAtBase(git, base, file) {
  const show = (name) => {
    const run = git("show", `${base}:./${name}`);
    return run.status === 0 ? run.stdout : null;
  };
  const folder = fragmentsFolder(file);
  const listed = git("ls-tree", "--name-only", "-z", base, "--", `${folder}/`);
  const names = listed.status === 0 ? listed.stdout.split("\0").filter(Boolean) : [];
  const shared = names.includes(`${folder}/${FRAGMENTS_SHARED}`)
    ? show(`${folder}/${FRAGMENTS_SHARED}`)
    : null;
  if (shared === null) return show(file);
  const fragments = names
    .map((name) => path.posix.basename(name))
    .filter(isFragment)
    .sort()
    .map((name) => ({ name, file: `${folder}/${name}`, text: show(`${folder}/${name}`) ?? "" }));
  return joinFound({ ledger: "intake", shared, fragments });
}

// What the check reads from the repository at `root`: its own components, the names its stores
// hold beside the intake ledger, and what the main branch had where this branch left it: the
// component files and the intake ledger. `base` is null where nothing is compared, with `note`
// saying why, or with `problem` where git is there and cannot say.
export function readChoice(root, check = CHOOSE_FIRST_CHECK) {
  const { read, components } = componentsOf(root);
  const own = components
    .filter((component) => component.source === "own")
    .map(({ name, file }) => ({ name, file }));
  const held = [
    ...new Set(
      [
        ...components.map((component) => component.name),
        ...readKinds(readPages(root, KINDS_FOLDER)).map((kind) => kind.name),
        ...readPinnedSources(root).flatMap((source) =>
          (source.items ?? []).map((item) => item.name),
        ),
      ].filter((name) => words(name) !== ""),
    ),
  ];
  const found = branchBase(root, { main: check.main ?? null });
  const unread = { components: own, held, base: null };
  if (found === null) return { ...unread, note: NOT_IN_GIT };
  if (found.problem) return { ...unread, problem: found.problem };
  if (found.unborn) return { ...unread, note: NO_COMMIT };
  const { git, base } = found;
  const listed = read ? git("ls-tree", "-r", "--name-only", "-z", base, "--", `${read}/`) : null;
  if (listed && listed.status !== 0) {
    return { ...unread, problem: `git could not list ${read} at ${base}` };
  }
  return {
    components: own,
    held,
    base: {
      files: listed ? listed.stdout.split("\0").filter(Boolean) : [],
      intake: intakeAtBase(git, base, check.intake ?? INTAKE_LEDGER),
    },
    ...(found.fetched ? { note: found.fetched } : {}),
  };
}

// The component files this branch adds that nothing records: no row names the file, no conform
// record holds it, and no pinned source declares its folder. The list of what came before lets one
// through only where the main branch's list already had the entry, by the file or by a component
// in it, as for a file the branch moved: an entry the branch writes for a file it adds says
// something came before that did not. Each with the components it holds.
export function unrecordedFiles({ components, baseFiles, ledger, baseLedger, covered, folders }) {
  const there = new Set((baseFiles ?? []).map(fileOf));
  const before = listOf(baseLedger?.before);
  const recorded = new Set(
    [
      ...listOf(ledger?.blocks).map((block) => fileOf(block.file)),
      ...before.map((entry) => fileOf(entry.file)),
      ...(covered ?? []).map(fileOf),
    ].filter(Boolean),
  );
  const named = new Set(before.map((entry) => words(entry.name)).filter(Boolean));
  const byFile = new Map();
  for (const { name, file } of components ?? []) {
    const own = fileOf(file);
    byFile.set(own, [...(byFile.get(own) ?? []), name]);
  }
  return [...byFile]
    .filter(
      ([file, names]) =>
        !there.has(file) &&
        !recorded.has(file) &&
        !names.some((name) => named.has(name)) &&
        !(folders ?? []).some((folder) => file.startsWith(`${folder}/`)),
    )
    .map(([file, names]) => ({ file, names }));
}

// What is wrong with each row made by hand this branch writes: a row whose need had no row at the
// base, or one with another source there. The source is compared as written, so a repository that
// starts saying how it writes made by hand, under `values`, does not make its older rows new. It
// lacks the words searched or the nearest candidate, or its nearest names nothing a store holds.
// A row is never its own nearest candidate.
export function byHandProblems({ ledger, baseLedger, held, components }) {
  const blocks = listOf(ledger?.blocks);
  const sourceAtBase = new Map(
    listOf(baseLedger?.blocks).map((block) => [words(block.need), words(block.source)]),
  );
  const written = (block) => sourceAtBase.get(words(block.need)) !== words(block.source);
  const known = new Set([
    ...held,
    ...STARTER_NAMES,
    ...blocks.flatMap((block) => [words(block.name), words(block.need)]),
    ...listOf(ledger?.before).map((entry) => words(entry.name)),
  ]);
  const spelled = ledger?.spelled ?? {};
  const key = (name) =>
    spelled[name] && spelled[name] !== name ? `${name} (${spelled[name]})` : name;
  const problems = [];
  for (const block of blocks) {
    if (!isByHand(ledger, block) || !written(block)) continue;
    const label = `the block ${words(block.name) || "(unnamed)"} for the need ${words(block.need)}`;
    const missing = ["searched", "nearest"].filter((name) => words(block[name]) === "");
    if (missing.length > 0) {
      problems.push(
        `${label} is made by hand and has no ${missing.map(key).join(" and no ")}: write the words find was asked with and the nearest candidate it gave, or ${NOTHING_ANSWERS} when nothing answered; intake --by-hand writes both`,
      );
      continue;
    }
    const nearest = words(block.nearest);
    const itself = new Set([
      words(block.name),
      words(block.need),
      ...(components ?? [])
        .filter((component) => fileOf(component.file) === fileOf(block.file))
        .map((component) => component.name),
    ]);
    if (nearest !== NOTHING_ANSWERS && (!known.has(nearest) || itself.has(nearest))) {
      problems.push(
        `${label} names ${nearest} as its nearest candidate, which no store of this repository, no pinned catalog and not the starter kit holds beside the block itself: name one they hold, or ${NOTHING_ANSWERS} when find answered nothing to "${words(block.searched)}"`,
      );
    }
  }
  return problems;
}

// The sentence for a component file the branch adds with no row.
export const unrecordedLine = ({ file, names }) =>
  `${file} holds ${names.join(", ")}, a component this branch adds with no row of the intake ledger: look in the stores first with find, then take it in with intake --need KEY, which makes it by hand only with --by-hand --why`;

// Why the check cannot compare, as a problem of the gate.
export const unreadLine = (problem) =>
  `what this branch adds cannot be read, so a component file or a row made by hand it adds would pass unseen: ${problem}`;
