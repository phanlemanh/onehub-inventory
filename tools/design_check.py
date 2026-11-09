#!/usr/bin/env python3
"""Validate design/decisions.yaml and report the determinism ratio (standard library only).

  python3 tools/design_check.py [--root DIR]

Determinism ratio = decisions with an automatic check / all decisions. A `check` is one of
`test:<path>`, `e2e:<path>`, `tool:<path>`, or `eslint:<rule>`, and what it names must exist.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from repo_ontology import load_yaml_file

KINDS = {"standard", "formula", "closed", "judgment"}
CORE_RULES = {"no-restricted-imports"}


def check_exists(root: Path, check: str) -> str | None:
    prefix, _, value = check.partition(":")
    if prefix in ("test", "e2e", "tool"):
        return None if (root / value).exists() else f"{check}: no such file"
    if prefix == "eslint":
        if value in CORE_RULES:
            return None
        rule = value.removeprefix("onehub-ui/")
        found = (root / "tools/eslint-ui/rules" / f"{rule}.mjs").exists()
        return None if found else f"{check}: no such rule"
    return f"{check}: unknown check type"


def evaluate(root: Path) -> tuple[list[str], int, int]:
    data = load_yaml_file(root / "design" / "decisions.yaml") or {}
    decisions = data.get("decisions") or []
    errors: list[str] = []
    seen: set[str] = set()
    automatic = 0
    for item in decisions:
        ident = str(item.get("id"))
        if ident in seen:
            errors.append(f"{ident}: duplicate id")
        seen.add(ident)
        for key in ("layer", "kind", "source"):
            if not item.get(key):
                errors.append(f"{ident}: missing {key}")
        if item.get("kind") not in KINDS:
            errors.append(f"{ident}: unknown kind '{item.get('kind')}'")
        check = item.get("check")
        if check:
            problem = check_exists(root, str(check))
            if problem:
                errors.append(f"{ident}: {problem}")
            else:
                automatic += 1
        if item.get("kind") == "judgment" and check:
            errors.append(f"{ident}: a judgment cannot have an automatic check")
    return errors, automatic, len(decisions)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", default=str(Path(__file__).resolve().parent.parent))
    args = ap.parse_args()
    errors, automatic, total = evaluate(Path(args.root))
    for error in errors:
        print(f"ERROR {error}")
    if errors or not total:
        return 1
    print(f"determinism: {automatic}/{total} = {round(100 * automatic / total)}%")
    return 0


if __name__ == "__main__":
    sys.exit(main())
