#!/usr/bin/env python3
"""Role × screen × button table, generated from the permission table (roadmap rows 9e, 9b). Standard library only.

  python3 tools/coverage_matrix/buttons.py [--root DIR]           # writes design/vai-man-nut.md
  python3 tools/coverage_matrix/buttons.py [--root DIR] --check   # fails with «lệch bảng quyền: <màn>» on drift
  python3 tools/coverage_matrix/buttons.py [--root DIR] --json    # the table as JSON, for tests

Every screen of design/screens.yaml gets a section, and the App Shell frame one more (`khung`, row 9b). For a screen
with a page the tool reads the actions named in the screen's own files and in what they import — through a module's
`ui` door to the file defining the imported name, intermediate components under src/components/, relative files of the
app — as a `PermittedAction action="…"`, an action of a row or record menu (`action: "…"`), or a gate
`allowedScope(…, "…")`. It merges them with the buttons the register declares (`nut`): a declared action the code does
not have yet shows as «dự kiến». `--check` also fails when a built staff screen's code names an action its `nut` does
not declare («<màn>: ma co <x> chua khai») or `nut` names an action the permission table does not have. Files of the
frame (`layout.tsx`, `nav.ts`) and the folders of other screens are not the screen's; nav.ts holds entry rules, not
buttons. tests/bo-nut-vai-man.test.ts runs `--check` in `make test`, so drift turns `make check` red.
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
SCREENS_FILE = "design/screens.yaml"
FRAME_FILES = {"layout.tsx", "nav.ts"}
FRAME_ID = "khung"
FRAME_ROUTE = "(App Shell)"
SOURCE = re.compile(r"\.(tsx|ts)$")
NAMED = [
    re.compile(r'\baction="(\w+)"'),
    re.compile(r'\baction:\s*"(\w+)"'),
    re.compile(r'allowedScope\([^,()]+,\s*"(\w+)"'),
]
SCOPE_WORDS = {"company": "toàn sàn", "own": "của tôi"}
RANK = {"own": 1, "company": 2}
# Row 9b: besides the screen's own folder, the tool follows what the screen imports — names through a module's `ui` door
# to the file that defines them, intermediate components under src/components/, relative files of the app — so the
# buttons a module draws count for the screens that really use them, never for every screen that shares the module.
IMPORT = re.compile(r'(?:import|export)\s+(type\s+)?(?:([\w*{}\s,]+?)\s+from\s+)?["\']([^"\']+)["\']', re.S)
DEFINES = r"export\s+(?:default\s+)?(?:async\s+)?(?:function|const|let|class)\s+{name}\b"
VENDOR = ("src/components/ui/", "src/components/reui/", "src/generated/")


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


def resolve(root: Path, here: Path, spec: str) -> Path | None:
    """The file an import specifier names, or None when it leaves the followed part of src/."""
    if spec.startswith("@/"):
        base = root / "src" / spec[2:]
    elif spec.startswith("."):
        base = (here.parent / spec).resolve()
    else:
        return None
    for cand in (base, *(base.with_name(base.name + ext) for ext in (".ts", ".tsx")), base / "index.ts", base / "index.tsx"):
        if cand.is_file():
            try:
                rel = cand.resolve().relative_to(root.resolve()).as_posix()
            except ValueError:
                return None
            if rel.endswith((".test.ts", ".test.tsx")) or rel.startswith(VENDOR) or cand.name == "nav.ts":
                return None
            followed = rel.startswith("src/components/") or rel.startswith("src/app/") or (
                rel.startswith("src/modules/") and "/ui/" in rel
            )
            return cand.resolve() if followed else None
    return None


def imported_names(clause: str | None) -> set[str] | None:
    """The names an import or re-export takes, or None for a whole file (default, namespace, side effect, star)."""
    if not clause or "{" not in clause:
        return None
    inner = clause[clause.index("{") + 1 : clause.rindex("}")]
    names: set[str] = set()
    for part in inner.split(","):
        part = part.strip()
        if not part:
            continue
        part = re.sub(r"^type\s+", "", part)
        names.add(part.split(" as ")[0].strip())
    return names


def used_files(root: Path, start: list[Path]) -> list[Path]:
    """Every file the screen uses: its own files, then what they import, file by file."""
    seen: dict[Path, bool] = {}
    order: list[Path] = []
    todo: list[tuple[Path, set[str] | None]] = [(f.resolve(), None) for f in start]

    def include(f: Path) -> None:
        if f not in seen:
            seen[f] = True
            order.append(f)
            text = f.read_text(encoding="utf-8")
            for m in IMPORT.finditer(text):
                if m.group(1):
                    continue
                target = resolve(root, f, m.group(3))
                if target:
                    todo.append((target, imported_names(m.group(2))))

    visited: set[tuple[Path, frozenset[str] | None]] = set()
    while todo:
        f, names = todo.pop()
        key = (f, frozenset(names) if names is not None else None)
        if key in visited:
            continue
        visited.add(key)
        if names is None:
            include(f)
            continue
        text = f.read_text(encoding="utf-8")
        here = {n for n in names if re.search(DEFINES.format(name=re.escape(n)), text)}
        if here:
            include(f)
        rest = names - here
        if not rest:
            continue
        for m in IMPORT.finditer(text):
            if not m.group(0).startswith("export") or m.group(1):
                continue
            target = resolve(root, f, m.group(3))
            if not target:
                continue
            given = imported_names(m.group(2))
            if given is None:
                todo.append((target, set(rest)))
            elif given & rest:
                todo.append((target, given & rest))
    return order


def named_actions(files: list[Path], known: set[str]) -> list[str]:
    found: list[str] = []
    for f in files:
        text = f.read_text(encoding="utf-8")
        for pattern in NAMED:
            for name in pattern.findall(text):
                if name in known and name not in found:
                    found.append(name)
    return found


def names(value: Any) -> list[str]:
    return [str(v) for v in value] if isinstance(value, list) else []


def build(root: Path) -> dict[str, Any]:
    reg = load_registry(root)
    actions = {str(a["name"]): a for a in load_yaml_file(root / ACTIONS_FILE)["actions"]}
    doc = load_yaml_file(root / SCREENS_FILE) or {}
    frame = doc.get(FRAME_ID) if isinstance(doc.get(FRAME_ID), dict) else {}
    errors: list[str] = []
    entries: list[tuple[str, Any, dict[str, Any], list[Path] | None]] = []
    app = root / "src/app/(app)"
    # The frame's buttons start at its layout; nav.ts holds the entry rules of the screens (their `vao`), not buttons.
    frame_start = [app / "layout.tsx"] if (app / "layout.tsx").is_file() else []
    entries.append((FRAME_ID, FRAME_ROUTE, frame, frame_start if frame_start else None))
    for sid, screen in reg.screens.items():
        page = reg.pages.get(str(screen.get("route") or ""))
        entries.append((sid, screen.get("route"), screen, screen_files(root / page) if page else None))
    screens: list[dict[str, Any]] = []
    for sid, route, decl, start in entries:
        found = named_actions(used_files(root, start), set(actions)) if start else []
        declared = names(decl.get("nut"))
        gate = decl.get("vao")
        if sid != FRAME_ID and decl.get("audience") in ("staff", "public"):
            # The entry rule and buttons of every staff or public screen, built or planned (row 9b, AC-1).
            for key in ("vao", "nut", "nut_chung"):
                if key not in decl:
                    errors.append(f"{sid}: thieu khoa {key}")
            if gate is not None and gate not in actions:
                errors.append(f"{sid}: vao {gate} khong co trong bang quyen")
            elif gate is not None and decl.get("status") == "built" and actions[gate].get("status") != "live":
                errors.append(f"{sid}: man built tro thao tac planned {gate}")
            for n in names(decl.get("mo_san")):
                if n not in declared:
                    errors.append(f"{sid}: mo_san {n} khong co trong nut")
        for n in declared:
            if n not in actions:
                errors.append(f"{sid}: nut {n} khong co trong bang quyen")
        checked = sid == FRAME_ID or (decl.get("status") == "built" and decl.get("audience") in ("staff", "public"))
        if checked and start:
            for n in found:
                if n not in declared and n != gate:
                    errors.append(f"{sid}: ma co {n} chua khai")
        listed = found + [n for n in declared if n in actions and n not in found]
        planned = [n for n in declared if n in actions and n not in found]
        cells: dict[str, list[dict[str, str]]] = {}
        for role in reg.role_names:
            cells[role] = [
                {"action": n, "scope": str(actions[n]["scope"][role])}
                for n in listed
                if role in (actions[n].get("scope") or {})
            ]
        screens.append(
            {
                "id": sid,
                "route": route,
                "audience": decl.get("audience", "staff"),
                "status": decl.get("status", "built"),
                "vao": gate,
                "actions": listed,
                "planned": planned,
                "mo_san": names(decl.get("mo_san")),
                "common": names(decl.get("nut_chung")),
                "cells": cells,
            }
        )
    return {"roles": reg.role_names, "labels": reg.role_labels, "screens": screens, "errors": errors}


def aligned(rows: list[list[str]]) -> list[str]:
    """A markdown table with padded columns, as the repository's formatter writes it (the file stays as generated)."""
    widths = [max(len(unicodedata.normalize("NFC", r[i])) for r in rows) for i in range(len(rows[0]))]
    line = lambda r: "| " + " | ".join(c.ljust(w) for c, w in zip(r, widths)) + " |"  # noqa: E731
    return [line(rows[0]), "| " + " | ".join("-" * w for w in widths) + " |", *map(line, rows[1:])]


def render(table: dict[str, Any]) -> str:
    lines = [
        "# Vai × Màn tới cấp nút",
        "",
        "<!-- Tệp sinh bởi tools/coverage_matrix/buttons.py từ ontology/actions.yaml, design/screens.yaml và các nút tìm thấy",
        "     trong mã của từng màn. Không sửa tay: đổi bảng quyền, sổ màn hay nút của màn rồi chạy lại lệnh; make check đỏ",
        "     khi tệp lệch. -->",
        "",
        "Mỗi màn của sổ màn có một mục, cộng mục `khung` cho App Shell. Cột «Nút theo quyền» liệt các thao tác vai ấy làm",
        "được trên màn, kèm phạm vi; «dự kiến» là nút sổ màn đã khai mà mã chưa có. «chặn» là vai không có ô nào.",
        "",
    ]
    roles = table["roles"]
    labels = table["labels"]
    for s in table["screens"]:
        lines += [f"## {s['id']} — `{s['route']}`", ""]
        rows = [["Vai", "Nút theo quyền", "Nút không theo quyền"]]
        common = ", ".join(s.get("common") or []) or "—"
        planned = set(s.get("planned") or [])
        for role in roles:
            items = s["cells"][role]
            cell = ", ".join(
                f"`{i['action']}` ({SCOPE_WORDS.get(i['scope'], i['scope'])}{', dự kiến' if i['action'] in planned else ''})"
                for i in items
            )
            rows.append([labels.get(role, role), cell or "chặn", common])
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
        for e in table["errors"]:
            print(e)
        have = path.read_text(encoding="utf-8") if path.is_file() else ""
        if have == want and not table["errors"]:
            print(f"vai-man-nut: khớp bảng quyền ({len(table['screens'])} màn)")
            return 0
        a, b = blocks(have), blocks(want)
        drift = sorted({k for k in a.keys() | b.keys() if a.get(k) != b.get(k)})
        if not drift and have != want:
            drift = ["(đầu tệp)"]
        for k in drift:
            print(f"lệch bảng quyền: {k}")
        print(f"vai-man-nut: {OUT} lệch — chạy python3 tools/coverage_matrix/buttons.py")
        return 1
    path.write_text(want, encoding="utf-8")
    print(f"wrote {OUT} ({len(table['screens'])} màn)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
