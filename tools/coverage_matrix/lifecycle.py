#!/usr/bin/env python3
"""Lifecycle check: every thing a screen shows has add, view, edit and remove (roadmap row 1t). Standard library only.

  python3 tools/coverage_matrix/lifecycle.py [--root DIR] --check    # fails with one pinned line per problem
  python3 tools/coverage_matrix/lifecycle.py [--root DIR] --report   # entity × cell × role, never fails
  python3 tools/coverage_matrix/lifecycle.py [--root DIR] --json     # the table as JSON, for tests

Every staff or public screen of design/screens.yaml, built or planned, and the App Shell frame (`khung`) declare
`hien`: the entities of ontology/entities/ the screen shows. The tool does not only trust that list: it reads what the
screen shows from two sources it can read — "<Entity>.<field>" strings in the files the screen's page uses (followed
through imports as the button table of row 9b does) and the entity of every action in the screen's row of that button
table (declared buttons, buttons found in the code, the entry action) — and fails when one of them is not in `hien`.
A screen that shows an entity only in hand-written words, with no field string and no action, is not seen.

Every entity some screen shows has a `vong_doi` block in its ontology file with the four cells `them`, `xem`, `sua`,
`go`, and optional `rieng: {<name>: <cell>}`. A cell is one of: `{co: <action>}` (an action of ontology/actions.yaml of
the cell's kind; for them, sua, go and rieng a button the button table knows on a screen that shows the entity; a planned
action carries `hang`), `{hang: <row>, ly_do: <reason>}` (a row of docs/plan/lo-trinh.json will do it), or
`{khong: <reason>, duyet: <record>#<ledger line>}` (the line is a gate line with `decided_by` in
_acceptance/<record>/decisions.jsonl). An add or remove cell may also read `{co: <action>, qua_luu: true, ly_do: <reason>}`
(row 19, G N-1511-3): the thing is added or removed inside one save of the whole table, so the action is the `update`
of the same entity's `sua` cell, it still needs a button the button table knows, and the report lists these cells in a
group of their own. Every role that opens a screen showing X holds the action of X's `xem` cell, or
the cell lists the role under `chan` with a `hang` or `khong` cell; `chan` anywhere else fails, as it would have no
effect. The tool reads files only: no git, no other process.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import buttons  # noqa: E402
from registry import load_registry  # noqa: E402
from repo_ontology import load_yaml_file  # noqa: E402

SCREENS_FILE = "design/screens.yaml"
ACTIONS_FILE = "ontology/actions.yaml"
ENTITIES_DIR = "ontology/entities"
ROADMAP_FILE = "docs/plan/lo-trinh.json"
LEDGER = "_acceptance/{slug}/decisions.jsonl"
CELLS = ("them", "xem", "sua", "go")
KIND = {"them": "create", "xem": "query", "sua": "update", "go": "delete"}
KEYS = {"co", "hang", "ly_do", "khong", "duyet", "chan", "qua_luu"}
# Cells that may be done inside one save of the whole table (`qua_luu`), and the edit cell whose action they reuse.
WHOLE_SAVE_CELLS = ("them", "go")
FRAME = buttons.FRAME_ID


def text(value: Any) -> str:
    return "" if value is None else str(value).strip()


def entity_names(root: Path) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for f in sorted((root / ENTITIES_DIR).glob("*.yaml")):
        if not f.name.startswith("_"):
            out[f.stem] = load_yaml_file(f) or {}
    return out


def roadmap_rows(root: Path) -> set[str]:
    path = root / ROADMAP_FILE
    if not path.is_file():
        return set()
    doc = json.loads(path.read_text(encoding="utf-8"))
    return {text(r.get("ma")) for r in doc.get("hang") or [] if isinstance(r, dict)}


def ledger_line(root: Path, ref: str) -> tuple[str, dict[str, Any] | None]:
    """The ledger line a `duyet` names, or why it cannot be read. Broken lines of a ledger are skipped."""
    slug, _, line_id = ref.partition("#")
    path = root / LEDGER.format(slug=slug)
    if not slug or not line_id or "/" in slug or not path.is_file():
        return "khong co trong so", None
    for raw in path.read_text(encoding="utf-8").splitlines():
        try:
            item = json.loads(raw)
        except ValueError:
            continue
        if isinstance(item, dict) and item.get("id") == line_id:
            return "", item
    return "khong co trong so", None


class Check:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.errors: list[str] = []
        self.reg = load_registry(root)
        self.actions = {str(a["name"]): a for a in load_yaml_file(root / ACTIONS_FILE)["actions"]}
        self.entities = entity_names(root)
        self.rows = roadmap_rows(root)
        self.table = buttons.build(root)
        doc = load_yaml_file(root / SCREENS_FILE) or {}
        frame = doc.get(FRAME) if isinstance(doc.get(FRAME), dict) else {}
        self.decl: dict[str, dict[str, Any]] = {FRAME: frame}
        for s in doc.get("screens") or []:
            if isinstance(s, dict) and s.get("audience") in ("staff", "public"):
                self.decl[str(s.get("id"))] = s
        self.rows_9b = {s["id"]: s for s in self.table["screens"]}

    # What each screen shows, read from the code and from the button table.
    def seen(self, sid: str) -> dict[str, str]:
        decl = self.decl[sid]
        app = self.root / "src/app/(app)"
        if sid == FRAME:
            start = [app / "layout.tsx"] if (app / "layout.tsx").is_file() else []
        else:
            page = self.reg.pages.get(str(decl.get("route") or ""))
            start = [self.root / page] if page else []
        found: dict[str, str] = {}
        if start:
            names = "|".join(re.escape(n) for n in sorted(self.entities, key=len, reverse=True))
            field = re.compile(r"[\"'`](" + names + r")\.[a-z]\w*[\"'`]")
            for f in buttons.used_files(self.root, start):
                for name in field.findall(f.read_text(encoding="utf-8")):
                    found.setdefault(name, "truong")
        row = self.rows_9b.get(sid) or {}
        for a in row.get("actions") or []:
            ent = text(self.actions.get(a, {}).get("entity"))
            if ent:
                found.setdefault(ent, f"nut {a}")
        gate = decl.get("vao")
        if gate in self.actions:
            found.setdefault(text(self.actions[gate].get("entity")), f"vao {gate}")
        return found

    def openers(self, sid: str) -> list[str]:
        gate = self.decl[sid].get("vao")
        if sid == FRAME or gate is None:
            return list(self.reg.role_names)
        scope = (self.actions.get(gate) or {}).get("scope") or {}
        return [r for r in self.reg.role_names if r in scope]

    def buttons_for(self, entity: str, shows: dict[str, list[str]]) -> set[str]:
        out: set[str] = set()
        for sid in shows.get(entity, []):
            out |= set((self.rows_9b.get(sid) or {}).get("actions") or [])
        return out

    def cell(
        self,
        where: str,
        value: Any,
        kind: str | None,
        buttons_here: set[str] | None,
        chan_ok: bool = False,
        edit_action: str | None = None,
    ) -> None:
        err = self.errors.append
        if not isinstance(value, dict) or not (set(value) <= KEYS):
            err(f"{where}: o phai la co, hang hoac khong")
            return
        has = {k for k in ("co", "hang", "khong") if k in value}
        if not has or ("khong" in has and len(has) > 1):
            err(f"{where}: o phai la co, hang hoac khong")
            return
        if "chan" in value and not (chan_ok and "co" in has):
            # A role list only has an effect on a view cell that names an action; anywhere else it would be ignored.
            err(f"{where}: chan chi co hieu luc o o xem co thao tac")
        if "qua_luu" in value:
            # Added or removed inside one save of the whole table: only on an add or remove cell, as the edit action.
            if edit_action is None:
                err(f"{where}: qua_luu chi dung o them va go")
                return
            if value.get("qua_luu") is not True or "co" not in has or len(has) > 1:
                err(f"{where}: qua_luu can dang {{co, qua_luu: true, ly_do}}")
                return
            if not text(value.get("ly_do")):
                err(f"{where}: qua_luu thieu ly_do")
            name = text(value.get("co"))
            if name != edit_action:
                err(f"{where}: qua_luu can {name} la thao tac o sua ({edit_action or 'trong'})")
            kind = "update"
        row = text(value.get("hang"))
        if "hang" in has and row not in self.rows:
            err(f"{where}: hang {row} khong co trong lo trinh")
        if "co" in has:
            name = text(value.get("co"))
            action = self.actions.get(name)
            if action is None:
                err(f"{where}: thao tac {name} khong co trong bang quyen")
                return
            if kind and action.get("kind") != kind:
                err(f"{where}: {name} la {action.get('kind')}, o nay can {kind}")
            if buttons_here is not None and name not in buttons_here:
                err(f"{where}: {name} khong la nut o man nao hien {where.split('.')[0]}")
            planned = action.get("status") != "live"
            if planned and "hang" not in has:
                err(f"{where}: {name} con du kien, thieu hang")
            if not planned and "hang" in has:
                err(f"{where}: {name} dang chay, bo hang")
        elif "hang" in has and not text(value.get("ly_do")):
            err(f"{where}: hang {row} thieu ly_do")
        if "khong" in has:
            if not text(value.get("khong")):
                err(f"{where}: khong thieu ly do")
            ref = text(value.get("duyet"))
            if not ref:
                err(f"{where}: khong thieu duyet")
            else:
                why, line = ledger_line(self.root, ref)
                if line is None:
                    err(f"{where}: duyet {ref} {why}")
                elif not text(line.get("decided_by")):
                    err(f"{where}: duyet {ref} khong co decided_by")
                elif not text(line.get("stage")).startswith("gate"):
                    err(f"{where}: duyet {ref} khong phai dong cong")

    def run(self) -> dict[str, Any]:
        err = self.errors.append
        shows: dict[str, list[str]] = {}
        screens: dict[str, Any] = {}
        for sid, decl in self.decl.items():
            seen = self.seen(sid)
            listed = decl.get("hien")
            if "hien" not in decl or not isinstance(listed, list):
                err(f"{sid}: thieu khoa hien")
                listed = []
            listed = [text(x) for x in listed]
            for name in listed:
                if name not in self.entities:
                    err(f"{sid}: hien {name} khong phai thuc the")
                else:
                    shows.setdefault(name, []).append(sid)
            for name, source in seen.items():
                if name not in listed:
                    err(f"{sid}: hien {name} ma chua khai ({source})")
            screens[sid] = {"hien": listed, "suy": seen, "mo": self.openers(sid)}
        entities: dict[str, Any] = {}
        for name in sorted(shows):
            life = self.entities[name].get("vong_doi")
            if not isinstance(life, dict):
                err(f"{name}: thieu vong_doi")
                continue
            here = self.buttons_for(name, shows)
            for c in CELLS:
                if c not in life:
                    err(f"{name}: thieu o {c}")
                else:
                    self.cell(
                        f"{name}.{c}",
                        life[c],
                        KIND[c],
                        None if c == "xem" else here,
                        chan_ok=c == "xem",
                        edit_action=edit_of(life) if c in WHOLE_SAVE_CELLS else None,
                    )
            extra = life.get("rieng") or {}
            if not isinstance(extra, dict):
                err(f"{name}.rieng: o phai la co, hang hoac khong")
                extra = {}
            for r, value in extra.items():
                self.cell(f"{name}.{r}", value, None, here)
            self.view_by_role(name, life.get("xem"), shows[name])
            entities[name] = {"man": shows[name], "vong_doi": life}
        return {"screens": screens, "entities": entities, "errors": self.errors}

    def view_by_role(self, name: str, view: Any, where: list[str]) -> None:
        if not isinstance(view, dict) or "co" not in view or text(view.get("co")) not in self.actions:
            return
        scope = self.actions[text(view["co"])].get("scope") or {}
        blocked = view.get("chan") or {}
        if not isinstance(blocked, dict):
            self.errors.append(f"{name}.xem.chan: o phai la co, hang hoac khong")
            blocked = {}
        for role, value in blocked.items():
            if not isinstance(value, dict) or "co" in value:
                self.errors.append(f"{name}.xem.chan.{role}: o phai la co, hang hoac khong")
            else:
                self.cell(f"{name}.xem.chan.{role}", value, None, None)
        for sid in where:
            for role in self.openers(sid):
                if role not in scope and role not in blocked:
                    self.errors.append(f"{name}.xem: {role} mo duoc {sid} ma khong xem duoc")


def edit_of(life: dict[str, Any]) -> str:
    """The action of an entity's edit cell, the one a whole-table save cell must reuse; empty when there is none."""
    edit = life.get("sua")
    return text(edit.get("co")) if isinstance(edit, dict) else ""


def whole_save(value: Any) -> bool:
    return isinstance(value, dict) and value.get("qua_luu") is True


def roles_of(check: Check, action: str) -> list[str]:
    scope = (check.actions.get(action) or {}).get("scope") or {}
    labels = check.reg.role_labels
    return [
        f"{labels.get(r, r)} {buttons.SCOPE_WORDS.get(scope[r], scope[r]) if r in scope else 'chặn'}"
        for r in check.reg.role_names
    ]


def describe(check: Check, value: Any) -> str:
    if not isinstance(value, dict):
        return "?"
    if "co" in value:
        name = text(value["co"])
        tail = f" · hàng {text(value['hang'])}" if "hang" in value else ""
        head = "qua lưu cả bảng · " if whole_save(value) else ""
        return f"{head}{name}{tail} — " + ", ".join(roles_of(check, name))
    if "khong" in value:
        return f"không — {text(value.get('khong'))} (duyệt {text(value.get('duyet'))})"
    return f"hàng {text(value.get('hang'))} — {text(value.get('ly_do'))}"


def report(check: Check, table: dict[str, Any]) -> str:
    lines = ["# Vòng đời thao tác — thực thể × ô × vai", ""]
    for name, item in table["entities"].items():
        lines.append(f"## {name} — màn: {', '.join(item['man'])}")
        life = item["vong_doi"]
        for c in CELLS:
            lines.append(f"- {c}: {describe(check, life.get(c))}")
            if c == "xem" and isinstance(life.get(c), dict):
                for role, value in (life[c].get("chan") or {}).items():
                    lines.append(f"  - chặn {check.reg.role_labels.get(role, role)}: {describe(check, value)}")
        for r, value in (life.get("rieng") or {}).items():
            lines.append(f"- {r}: {describe(check, value)}")
        lines.append("")
    grouped = [
        f"- {name}.{c}: {text(item['vong_doi'][c].get('co'))} — {text(item['vong_doi'][c].get('ly_do'))}"
        for name, item in table["entities"].items()
        for c in WHOLE_SAVE_CELLS
        if whole_save(item["vong_doi"].get(c))
    ]
    if grouped:
        lines += ["## Qua lưu cả bảng", *grouped, ""]
    if table["errors"]:
        lines.append(f"Còn {len(table['errors'])} lỗi — chạy --check để xem.")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=str(Path(__file__).resolve().parents[2]))
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--report", action="store_true")
    mode.add_argument("--json", action="store_true")
    args = ap.parse_args(argv)
    check = Check(Path(args.root).resolve())
    table = check.run()
    if args.json:
        print(json.dumps(table, ensure_ascii=False, indent=2))
        return 0
    if args.report:
        print(report(check, table))
        return 0
    for e in table["errors"]:
        print(e)
    if table["errors"]:
        print(f"vong-doi: {len(table['errors'])} loi")
        return 1
    print(f"vong-doi: du o ({len(table['screens'])} man, {len(table['entities'])} thuc the)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
