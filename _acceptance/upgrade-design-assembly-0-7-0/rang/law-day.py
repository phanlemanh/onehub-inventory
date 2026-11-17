"""AC-8, second part: the proof gate reads the day of the block-ledger law from the oldest commit that
added any path the ledger has had, the commit adding design/so-khoi.yaml, not the rename of step 8.4.

Usage: python3 law-day.py [--root REPO] [--legacy FILE]   (--legacy loads another legacy.py: a break)
"""
import argparse
import importlib.util
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
ap = argparse.ArgumentParser()
ap.add_argument("--root", default=str(ROOT))
ap.add_argument("--legacy")
args = ap.parse_args()
root = Path(args.root).resolve()

source = Path(args.legacy) if args.legacy else root / "tools/proof_gate/legacy.py"
spec = importlib.util.spec_from_file_location("legacy_under_test", source)
legacy = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = legacy
spec.loader.exec_module(legacy)

first = subprocess.run(
    ["git", "-C", str(root), "log", "--diff-filter=A", "--format=%h %as", "--", "design/so-khoi.yaml"],
    capture_output=True, text=True, check=True,
).stdout.split()
sha, want = first[-2], first[-1]
history = legacy.History.read(root)
if history.law_day != want:
    print(f"law day: the gate reads {history.law_day or history.law_why}, not {want} (the commit {sha} adding design/so-khoi.yaml)")
    sys.exit(1)
print(f"law day: {want}, from the commit {sha} adding design/so-khoi.yaml, the oldest path of the block ledger")
