# ReUI catalog

The ReUI catalog, pinned in this repo, for the "ReUI" rung of the reuse ladder (in-repo → ReUI → hand-written). You can
look it up offline. It lists every Pro block, every ReUI primitive and every free example, by name, title and
description. It holds no source code and no licence key.

The pin date is printed by every lookup. The pin lives in `pin.json` (file, size and SHA-256 of each snapshot file).

## Look something up

Run from the repo root. No network, no account.

```bash
node tools/reui_catalog/tra.mjs kanban
node tools/reui_catalog/tra.mjs data grid audit log --loai block
node tools/reui_catalog/tra.mjs date range filter --so 5
node tools/reui_catalog/tra.mjs kanban --json
```

- Words are matched in English, against the name, title, group and description. Matching is by word, not by meaning:
  try the words ReUI itself would use.
- `--loai` keeps one kind: `component` (the 27 ReUI primitives), `block` (Pro blocks) or `example` (free `c-*`
  examples).
- `--so <n>` changes how many results are printed (default 10). `--json` prints the same results as JSON.
- Each result line reads `<install name> · <kind> · <group> · <title> · <page>`. Install with
  `npx shadcn@latest add <install name>`; blocks need the repo's licence key at install time.

## When nothing matches

The command exits 1 and prints, under the line `ReUI catalog pinned <date>`:

```text
không có mục nào khớp «<words>» trong danh mục ReUI ghim ngày <date>
```

When you fall to the hand-written rung, copy that line verbatim into your evidence, with the words you searched. It
is the proof that you looked: anyone can run the same command on the same pin and get the same line. Give the
closest candidate too: run the lookup with fewer words and name the best result and why it does not fit.

## Check the catalog

```bash
node tools/reui_catalog/build.mjs --check
```

It checks the snapshot against the pin, regenerates the catalog and compares it byte for byte, checks that every
item is found first by its name and within the first 10 results by its group and title, and checks for code or
licence text. `make check` runs the same checks through `tools/reui_catalog/catalog.test.mjs`.

To regenerate the catalog from the pinned snapshot (offline):

```bash
node tools/reui_catalog/build.mjs
```

## Re-pin

Re-pin when ReUI has shipped items you need and the lookup does not list them yet. Re-pinning is a deliberate change
reviewed in a PR. It is the only command that needs the network:

```bash
node tools/reui_catalog/build.mjs --refresh
```

It downloads `https://reui.io/llms-full.txt` and `https://reui.io/llms.txt`, refuses a source that contains code or
licence text, stops if a section's declared count differs from what it read, then rewrites the snapshot, `pin.json`
and `design/reui-catalog.json`. It prints each `added: <name>` and `removed: <name>`. Without the network, re-pin
from files you downloaded yourself:

```bash
node tools/reui_catalog/build.mjs --refresh --from <folder with llms-full.txt and llms.txt>
```
