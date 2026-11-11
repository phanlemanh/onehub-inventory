#!/usr/bin/env python3
"""Print the screen register and the role list as JSON, read by the row 1d reader (roadmap row 1f).

  python3 tools/e2e_templates/register.py [--root DIR]

The browser suite in tests/e2e/screens reads this instead of parsing YAML itself, so a wrong register
fails there with the same words `make check` prints. Exit 0 always; problems go in "errors".
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "coverage_matrix"))
sys.path.insert(0, str(HERE.parent))
from registry import LABELS_FILE, load_registry  # noqa: E402
from repo_ontology import YamlError, load_yaml_file  # noqa: E402


def title_text(root: Path, key: Any) -> str | None:
    """Display name of a label key (its `pref`), or None when the screen has no title."""
    if key is None:
        return None
    try:
        doc = load_yaml_file(root / LABELS_FILE) or {}
    except YamlError:
        return None
    concept = (doc.get("concepts") or {}).get(key)
    return str(concept["pref"]) if isinstance(concept, dict) and concept.get("pref") else None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=str(HERE.parent.parent))
    root = Path(parser.parse_args().root).resolve()
    reg = load_registry(root)
    out = {
        "errors": reg.errors,
        "roles": [{"name": n, "label": reg.role_labels.get(n)} for n in reg.role_names],
        "screens": [
            {
                "id": sid,
                "route": item["route"],
                "title": item["title"],
                "title_text": title_text(root, item["title"]),
                "family": item["family"],
                "audience": item["audience"],
                "status": item["status"],
            }
            for sid, item in reg.screens.items()
        ],
    }
    json.dump(out, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
