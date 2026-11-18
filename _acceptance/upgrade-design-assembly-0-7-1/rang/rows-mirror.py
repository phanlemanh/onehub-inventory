"""AC-6: the two rows of this upgrade are the plugin's rows, field for field, and their checks are the
plugin's but for `blueprint`, which this repository has no file for; outside them neither file changed
since where the branch left main.

Usage: python3 rows-mirror.py [--root <repository>] [--plugin-repo <the design-assembly repository>]
Reads design/decisions.yaml and design/theme.json at --root, the same two files at BASE through
`git show` in --root, and at the plugin's pinned commit in --plugin-repo. Needs PyYAML.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = "8925e8fffc776534c5388ced3fea36ac2a1345f6"
PLUGIN_COMMIT = "ba3af6b090bb4a0922ff16f708220e9ff0bc57e6"
ROWS = ("decision-sheet", "owner-calls")
LEDGER = "design/decisions.yaml"
THEME = "design/theme.json"
LOCAL_ONLY = "blueprint"


def option(name, fallback):
    args = sys.argv[1:]
    return args[args.index(name) + 1] if name in args else fallback


def show(repo, commit, file):
    run = subprocess.run(["git", "-C", str(repo), "show", f"{commit}:{file}"], capture_output=True, text=True)
    if run.returncode != 0:
        raise RuntimeError(run.stderr.strip().split("\n")[0])
    return run.stdout


def rows_by_id(ledger):
    return {row["id"]: row for row in ledger.get("decisions", [])}


def without_rows(ledger):
    return {**ledger, "decisions": [row for row in ledger.get("decisions", []) if row["id"] not in ROWS]}


def without_checks(theme):
    checks = {key: value for key, value in theme.get("checks", {}).items() if key not in ROWS}
    return {**theme, "checks": checks}


def main():
    root = Path(option("--root", ROOT)).resolve()
    plugin = Path(option("--plugin-repo", os.environ.get("DESIGN_ASSEMBLY_REPO", Path.home() / "design-assembly")))
    at = PLUGIN_COMMIT[:7]
    try:
        theirs_ledger = yaml.safe_load(show(plugin, PLUGIN_COMMIT, LEDGER))
        theirs_theme = json.loads(show(plugin, PLUGIN_COMMIT, THEME))
    except (RuntimeError, OSError) as error:
        print(f"rows: cannot read {LEDGER} at {at} in {plugin} ({error})")
        return 1
    ours_ledger = yaml.safe_load((root / LEDGER).read_text(encoding="utf8"))
    ours_theme = json.loads((root / THEME).read_text(encoding="utf8"))
    base_ledger = yaml.safe_load(show(root, BASE, LEDGER))
    base_theme = json.loads(show(root, BASE, THEME))

    found = []
    ours, theirs = rows_by_id(ours_ledger), rows_by_id(theirs_ledger)
    for row in ROWS:
        if row not in ours:
            found.append(f"no row {row}")
            continue
        if row not in theirs:
            found.append(f"the plugin has no row {row} at {at}")
            continue
        fields = sorted(set(ours[row]) | set(theirs[row]))
        differ = [field for field in fields if ours[row].get(field) != theirs[row].get(field)]
        if differ:
            found.append(f"row {row} differs from the plugin's in {', '.join(differ)}")
    for row in ROWS:
        mine = ours_theme.get("checks", {}).get(row)
        plugin_check = theirs_theme.get("checks", {}).get(row)
        if mine is None:
            found.append(f"no check {row} in {THEME}")
            continue
        expected = [{key: value for key, value in entry.items() if key != LOCAL_ONLY} for entry in plugin_check or []]
        if mine != expected:
            found.append(f"check {row} differs from the plugin's (but for {LOCAL_ONLY}): {json.dumps(mine)}")
    if without_rows(ours_ledger) != without_rows(base_ledger):
        found.append(f"{LEDGER} changed beyond the two rows since {BASE[:8]}")
    if without_checks(ours_theme) != without_checks(base_theme):
        found.append(f"{THEME} changed beyond the two checks since {BASE[:8]}")

    for line in found:
        print(f"rows: {line}")
    if not found:
        print(
            f"rows: {ROWS[0]} and {ROWS[1]} are the plugin's rows at {at} field for field; their checks are the plugin's"
            f" but for {LOCAL_ONLY}, which this repository has no file for; nothing else changed in the two files"
            f" since {BASE[:8]}"
        )
    return 1 if found else 0


if __name__ == "__main__":
    sys.exit(main())
