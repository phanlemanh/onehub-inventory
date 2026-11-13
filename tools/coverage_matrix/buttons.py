#!/usr/bin/env python3
"""Role × screen × button table, generated from the permission table (roadmap row 9e, AC-9). Standard library only.

  python3 tools/coverage_matrix/buttons.py [--root DIR]           # writes design/vai-man-nut.md
  python3 tools/coverage_matrix/buttons.py [--root DIR] --check   # fails with «lệch bảng quyền: <màn>» on drift
  python3 tools/coverage_matrix/buttons.py [--root DIR] --json    # the table as JSON, for tests

For each screen of design/screens.yaml that has a page, the tool reads the actions the screen's own files name — a
`PermittedAction action="…"`, an action of a row or record menu (`action: "…"`), a gate `allowedScope(…, "…")` — and
looks each one up in ontology/actions.yaml: a role's cell lists the actions the role may run, with their scope. Files of
the frame (`layout.tsx`, `nav.ts`) and the folders of other screens are not the screen's. tests/bo-nut-vai-man.test.ts
runs `--check` in `make test`, so a cell of the permission table changed without regenerating turns `make check` red.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from registry import PAGE_FILE, load_registry  # noqa: E402
from repo_ontology import load_yaml_file  # noqa: E402

OUT = "design/vai-man-nut.md"
ACTIONS_FILE = "ontology/actions.yaml"
FRAME_FILES = {"layout.tsx", "nav.ts"}
SOURCE = re.compile(r"\.(tsx|ts)$")
NAMED = [
    re.compile(r'\baction="(\w+)"'),
    re.compile(r'\baction:\s*"(\w+)"'),
    re.compile(r'allowedScope\([^,()]+,\s*"(\w+)"'),
]
SCOPE_WORDS = {"company": "toàn sàn", "own": "của tôi"}
RANK = {"own": 1, "company": 2}


def screen_files(page: Path) -> list[Path]:
    """The page's folder and its sub-folders, without the folders of other pages and without the frame's files."""
    folder = page.parent
    out: list[Path] = []

    def walk(d: Path, top: bool) -> None:
        if not top and any(PAGE_FILE.match(p.name) for p in d.iterdir() if p.is_file()):
            return
        for p in sorted(d.iterdir()):
            if p.is_dir():
                walk(p, False)
            elif SOURCE.search(p.name) and not p.name.endswith((".test.ts", ".test.tsx")) and p.name not in FRAME_FILES:
                out.append(p)

    walk(folder, True)
    return out


def named_actions(files: list[Path], known: set[str]) -> list[str]:
    found: list[str] = []
    for f in files:
        text = f.read_text(encoding="utf-8")
        for pattern in NAMED:
            for name in pattern.findall(text):
                if name in known and name not in found:
                    found.append(name)
    return found


def build(root: Path) -> dict[str, Any]:
    reg = load_registry(root)
    actions = {str(a["name"]): a for a in load_yaml_file(root / ACTIONS_FILE)["actions"]}
    screens: list[dict[str, Any]] = []
    for sid, screen in reg.screens.items():
        page = reg.pages.get(str(screen.get("route") or ""))
        if not page:
            continue
        names = named_actions(screen_files(root / page), set(actions))
        if not names:
            continue
        cells: dict[str, list[dict[str, str]]] = {}
        for role in reg.role_names:
            cells[role] = [
                {"action": n, "scope": str(actions[n]["scope"][role])}
                for n in names
                if role in (actions[n].get("scope") or {})
            ]
        screens.append({"id": sid, "route": screen.get("route"), "actions": names, "cells": cells})
    return {"roles": reg.role_names, "labels": reg.role_labels, "screens": screens}


def aligned(rows: list[list[str]]) -> list[str]:
    """A markdown table with padded columns, as the repository's formatter writes it (the file stays as generated)."""
    widths = [max(len(unicodedata.normalize("NFC", r[i])) for r in rows) for i in range(len(rows[0]))]
    line = lambda r: "| " + " | ".join(c.ljust(w) for c, w in zip(r, widths)) + " |"  # noqa: E731
    return [line(rows[0]), "| " + " | ".join("-" * w for w in widths) + " |", *map(line, rows[1:])]


def render(table: dict[str, Any]) -> str:
    lines = [
        "# Vai × Màn tới cấp nút",
        "",
        "<!-- Tệp sinh bởi tools/coverage_matrix/buttons.py từ ontology/actions.yaml và các nút khai trên từng màn. Không sửa",
        "     tay: đổi bảng quyền hay nút của màn rồi chạy lại lệnh; make check đỏ khi tệp lệch. -->",
        "",
        "Mỗi ô liệt các thao tác vai ấy làm được trên màn, kèm phạm vi. «chặn» là vai không có ô nào trên màn.",
        "",
    ]
    roles = table["roles"]
    labels = table["labels"]
    for s in table["screens"]:
        lines += [f"## {s['id']} — `{s['route']}`", ""]
        rows = [["Vai", "Nút và việc hiện"]]
        for role in roles:
            items = s["cells"][role]
            cell = ", ".join(f"`{i['action']}` ({SCOPE_WORDS.get(i['scope'], i['scope'])})" for i in items)
            rows.append([labels.get(role, role), cell or "chặn"])
        lines += aligned(rows)
        lines.append("")
    return "\n".join(lines)


def blocks(text: str) -> dict[str, str]:
    """The text of each screen's section, by screen id."""
    out: dict[str, str] = {}
    current: str | None = None
    for line in text.split("\n"):
        m = re.match(r"^## (\S+)", line)
        if m:
            current = m.group(1)
            out[current] = ""
        elif current is not None:
            out[current] += line + "\n"
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=str(Path(__file__).resolve().parents[2]))
    ap.add_argument("--check", action="store_true", help="compare design/vai-man-nut.md with the table; never writes")
    ap.add_argument("--json", action="store_true", help="print the table as JSON; never writes")
    args = ap.parse_args(argv)
    root = Path(args.root).resolve()
    table = build(root)
    if args.json:
        print(json.dumps(table, ensure_ascii=False, indent=2))
        return 0
    want = render(table)
    path = root / OUT
    if args.check:
        have = path.read_text(encoding="utf-8") if path.is_file() else ""
        if have == want:
            print(f"vai-man-nut: khớp bảng quyền ({len(table['screens'])} màn)")
            return 0
        a, b = blocks(have), blocks(want)
        drift = sorted({k for k in a.keys() | b.keys() if a.get(k) != b.get(k)}) or ["(đầu tệp)"]
        for k in drift:
            print(f"lệch bảng quyền: {k}")
        print(f"vai-man-nut: {OUT} lệch — chạy python3 tools/coverage_matrix/buttons.py")
        return 1
    path.write_text(want, encoding="utf-8")
    print(f"wrote {OUT} ({len(table['screens'])} màn)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
