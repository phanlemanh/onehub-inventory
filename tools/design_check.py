#!/usr/bin/env python3
"""Validate design/decisions.yaml and report the determinism ratio (standard library only).

  python3 tools/design_check.py [--root DIR]

Determinism ratio = decisions with an automatic check / all decisions. A `check` is one of
`test:<path>`, `e2e:<path>`, `tool:<path>`, or `eslint:<rule>`. A check counts only when it can fail:
a test names its decision with `decision:<id>`, browser tests are in the kit's suite, a tool is run by
make. tests/design-check.test.ts proves that every lint rule named here is switched on.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from repo_ontology import load_yaml_file

KINDS = {"standard", "formula", "closed", "judgment"}
KEYS = {"id", "layer", "kind", "source", "check", "note"}
CORE_RULES = {
    "no-restricted-imports",
    "shadcn/no-restyle",
    "shadcn/no-arbitrary-values",
    "shadcn/no-inline-styles",
}


def has_tag(path: Path, ident: str) -> bool:
    pattern = rf"decision:{re.escape(ident)}(?![\w-])"
    return re.search(pattern, path.read_text("utf-8")) is not None


def tool_is_run(root: Path, value: str) -> bool:
    if not value.startswith("tools/"):
        return False
    makefiles = [root / "Makefile", *sorted((root / "mk").glob("*.mk"))]
    return any(p.exists() and value in p.read_text("utf-8") for p in makefiles)


def e2e_in_gate(root: Path) -> bool:
    config = root / "_acceptance" / "config.yaml"
    return config.exists() and "- executors.script.e2e" in config.read_text("utf-8")


def check_problem(root: Path, ident: str, check: str) -> str | None:
    prefix, _, value = check.partition(":")
    if prefix in ("test", "e2e", "tool") and not (root / value).exists():
        return f"{check}: no such file"
    if prefix in ("test", "e2e"):
        if not has_tag(root / value, ident):
            return f"{check}: the file does not name decision:{ident}"
        if prefix == "e2e" and not e2e_in_gate(root):
            return f"{check}: browser tests are not in the kit's suite_keys"
        return None
    if prefix == "tool":
        return None if tool_is_run(root, value) else f"{check}: not run by make"
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
        for key in set(item) - KEYS:
            errors.append(f"{ident}: unknown key '{key}'")
        for key in ("layer", "kind", "source"):
            if not item.get(key):
                errors.append(f"{ident}: missing {key}")
        if item.get("kind") not in KINDS:
            errors.append(f"{ident}: unknown kind '{item.get('kind')}'")
        check = item.get("check")
        if check:
            problem = check_problem(root, ident, str(check))
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
