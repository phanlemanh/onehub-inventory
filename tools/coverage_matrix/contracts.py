"""The Vai × Màn block of each acceptance contract (decision 0017).

A contract must carry the block when it is still open and touches the UI (`surfaces` has ui,
web or web-ui), or when it declares `screens` or has the section at all. A closed contract
without the block was signed before the check existed and is counted apart ("trước khối").
"""

from __future__ import annotations

import re
import sys
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from repo_ontology import YamlError, parse_yaml

from registry import SCREENS_FILE, Registry

SECTION = "## Vai × Màn"
UI_SURFACES = {"ui", "web", "web-ui"}
# The statuses of the kit's contract template, split into open and closed.
OPEN = ("draft", "approved", "implemented", "verified")
CLOSED = ("signed-off", "machine-cleared", "da-cham-boi-thuc-te")
ALLOWED = "được"
DENIED = "chặn"
UNRELATED = "không liên quan"

# Kinds of record, as counted by the report.
COMPLETE = "du_o"
INCOMPLETE = "thieu_o"
BEFORE_BLOCK = "truoc_khoi"
NO_SCREENS = "khong_khai_man"
NOT_TOUCHED = "khong_cham"


@dataclass
class Record:
    slug: str
    path: str
    kind: str = NOT_TOUCHED
    errors: list[str] = field(default_factory=list)
    cells: int = 0
    unrelated: int = 0


def surface_tokens(value: Any) -> set[str]:
    """Surfaces as the kit reads them: a list or a comma string, brackets and quotes stripped, lowercased."""
    items = value if isinstance(value, list) else [value]
    text = ",".join("" if v is None else str(v) for v in items)
    return {t.strip().strip("[]\"'").strip().lower() for t in text.split(",")} - {""}


def _nfc(text: str) -> str:
    return unicodedata.normalize("NFC", text).strip()


def _frontmatter(text: str) -> dict[str, Any] | None:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            data = parse_yaml("\n".join(lines[1:i]) + "\n")
            return data if isinstance(data, dict) else None
    return None


def _section(text: str) -> list[str] | None:
    """Lines under the Vai × Màn heading, up to the next heading of the same or higher level."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if _nfc(line) == _nfc(SECTION):
            body = []
            for rest in lines[i + 1 :]:
                if re.match(r"^#{1,2} ", rest):
                    break
                body.append(rest)
            return body
    return None


def _cells(line: str) -> list[str]:
    inner = line.strip()
    inner = inner[1:] if inner.startswith("|") else inner
    inner = inner[:-1] if inner.endswith("|") else inner
    return [_nfc(c).strip("`").strip() for c in inner.split("|")]


def _is_separator(cells: list[str]) -> bool:
    return all(re.fullmatch(r":?-{3,}:?", c) for c in cells)


def check_cell(cell: str) -> str | None:
    """None when the cell is well formed, else the problem."""
    if not cell:
        return "empty cell"
    if cell.startswith(UNRELATED):
        reason = cell[len(UNRELATED) :].lstrip(" \t—–-:")
        return None if reason.strip() else f"'{UNRELATED}' needs a reason"
    if cell.startswith(ALLOWED) or cell.startswith(DENIED):
        return None
    return f"must start with {ALLOWED}, {DENIED} or {UNRELATED}"


def check_contract(path: Path, root: Path, reg: Registry) -> Record:
    rel = path.relative_to(root).as_posix()
    rec = Record(slug=path.parent.name, path=rel)

    def err(msg: str) -> None:
        rec.errors.append(f"{rel}: {msg}")

    text = path.read_text(encoding="utf-8")
    try:
        fm = _frontmatter(text)
    except YamlError as exc:
        fm = None
        err(f"cannot read the frontmatter ({exc})")
    if fm is None:
        if not rec.errors:
            err("cannot read the frontmatter")
        rec.kind = INCOMPLETE
        return rec

    status = fm.get("status")
    touches_ui = bool(surface_tokens(fm.get("surfaces")) & UI_SURFACES)
    has_screens = "screens" in fm
    body = _section(text)

    if status not in OPEN and status not in CLOSED:
        err(f"unknown status '{status}'")
    if not (touches_ui or has_screens or body is not None):
        return rec
    if status in CLOSED and body is None and not has_screens:
        rec.kind = BEFORE_BLOCK
        return rec

    rec.kind = INCOMPLETE
    if not has_screens:
        err("touches the UI but declares no screens")
    screens = fm.get("screens") if has_screens else None
    if has_screens and not isinstance(screens, list):
        err("screens must be a list of screen ids")
        screens = None
    if body is None:
        err(f"missing section '{SECTION}'")
        return rec
    if screens is None:
        return rec

    table = [line for line in body if line.strip().startswith("|")]
    prose = [line for line in body if line.strip() and not line.strip().startswith("|")]
    if not screens:
        if table or not prose:
            err(f"screens is empty, give the reason under '{SECTION}'")
            return rec
        rec.kind = NO_SCREENS if not rec.errors else INCOMPLETE
        return rec

    ids = [str(s) for s in screens]
    for sid in ids:
        if sid not in reg.screens:
            err(f"screen '{sid}' is not in {SCREENS_FILE}")
    if len(table) < 2 or not _is_separator(_cells(table[1])):
        err(f"no Vai × Màn table under '{SECTION}'")
        return rec

    header = _cells(table[0])
    if not header or header[0] != "Màn":
        err("the first column of the Vai × Màn table must be 'Màn'")
        return rec
    columns = header[1:]
    roles = reg.role_columns
    for role in roles:
        if role not in columns:
            err(f"missing role column '{role}'")
    for col in columns:
        if col not in roles:
            err(f"column '{col}' is not a role")

    seen: set[str] = set()
    for line in table[2:]:
        cells = _cells(line)
        sid = cells[0] if cells else ""
        if sid in seen:
            err(f"duplicate row '{sid}'")
            continue
        seen.add(sid)
        if sid not in ids:
            err(f"row '{sid}' is not in screens")
            continue
        for i, col in enumerate(columns, start=1):
            if col not in roles:
                continue
            cell = cells[i] if i < len(cells) else ""
            problem = check_cell(cell)
            rec.cells += 1
            if problem:
                err(f"screen '{sid}', role '{col}': {problem}")
            elif cell.startswith(UNRELATED):
                rec.unrelated += 1
    for sid in ids:
        if sid not in seen:
            err(f"missing row for screen '{sid}'")

    if not rec.errors:
        rec.kind = COMPLETE
    return rec


def check_contracts(root: Path, reg: Registry) -> list[Record]:
    folder = root / "_acceptance"
    if not folder.is_dir():
        return []
    return [check_contract(p, root, reg) for p in sorted(folder.glob("*/contract.md"))]
