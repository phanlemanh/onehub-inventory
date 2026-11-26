"""AC-5: each fragment folder, joined, holds exactly the data of the one-file ledger it replaced, as that
file was where the branch left main. Entries are matched by their key (screen id, block need); the
folder's _shared.yaml holds the ledger's other keys, plus `keys` for the intake ledger.

Usage: python3 fragments-equal.py [--root REPO] [--old-screens FILE] [--old-intake FILE]
(the two overrides stand in for `git show BASE:<old path>`, for the break copies)
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
MATRIX = json.loads(
    subprocess.run(
        ["node", "-e", "import('./matrix.mjs').then(m=>console.log(JSON.stringify({BASE:m.BASE,FRAGMENTS:m.FRAGMENTS})))"],
        cwd=HERE, capture_output=True, text=True, check=True,
    ).stdout
)
# What the intake ledger's `keys` must say: the contract's names for the keys it spells its own way.
INTAKE_KEYS = {"blocks": "khoi"}

ap = argparse.ArgumentParser()
ap.add_argument("--root", default=str(ROOT))
ap.add_argument("--old-screens")
ap.add_argument("--old-intake")
args = ap.parse_args()
root = Path(args.root).resolve()


def old_doc(ledger, override):
    if override:
        return yaml.safe_load(Path(override).read_text())
    spec = f"{MATRIX['BASE']}:{MATRIX['FRAGMENTS'][ledger]['old']}"
    out = subprocess.run(["git", "-C", str(root), "show", spec], capture_output=True, text=True)
    if out.returncode != 0:
        sys.exit(f"fragments: cannot read {spec} ({out.stderr.strip()})")
    return yaml.safe_load(out.stdout)


found = []
summary = []
for ledger, spec in MATRIX["FRAGMENTS"].items():
    folder = root / spec["folder"]
    old = old_doc(ledger, getattr(args, f"old_{ledger}"))
    shared = yaml.safe_load((folder / "_shared.yaml").read_text()) or {}
    entries = [yaml.safe_load(f.read_text()) for f in sorted(folder.glob("*.yaml")) if f.name != "_shared.yaml"]
    old_entries = old.get(spec["list"]) or []
    key = spec["id"]
    new_by = {e.get(key): e for e in entries}
    old_by = {e.get(key): e for e in old_entries}
    lost = sorted(set(old_by) - set(new_by))
    extra = sorted(set(new_by) - set(old_by))
    if lost:
        found.append(f"{ledger}: entries lost: {' '.join(map(str, lost))}")
    if extra:
        found.append(f"{ledger}: entries not in the old ledger: {' '.join(map(str, extra))}")
    for k in sorted(set(old_by) & set(new_by)):
        if old_by[k] != new_by[k]:
            fields = sorted(f for f in set(old_by[k]) | set(new_by[k]) if old_by[k].get(f) != new_by[k].get(f))
            found.append(f"{ledger}: {k} differs ({' '.join(fields)})")
    for f in sorted(e.get(key) for e in entries):
        name = f"{f}.yaml"
        if not (folder / name).is_file():
            found.append(f"{ledger}: entry {f} is not in a file named {name}")
    other_old = {k: v for k, v in old.items() if k != spec["list"]}
    other_new = dict(shared)
    if ledger == "intake":
        if other_new.pop("keys", {}).get("blocks") != INTAKE_KEYS["blocks"]:
            found.append("intake: keys does not name khoi as the ledger's blocks")
    if other_old != other_new:
        diff = sorted(k for k in set(other_old) | set(other_new) if other_old.get(k) != other_new.get(k))
        found.append(f"{ledger}: _shared.yaml differs from the old ledger's other keys ({' '.join(diff)})")
    if len(entries) != spec["entries"]:
        found.append(f"{ledger}: {len(entries)} entries, not {spec['entries']}")
    summary.append(f"{len(entries)} {ledger} entries")

for line in found:
    print(f"fragments: {line}")
if not found:
    print(f"fragments: {' and '.join(summary)} hold exactly the data of the old ledgers at {MATRIX['BASE'][:8]}")
sys.exit(1 if found else 0)
