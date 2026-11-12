"""Readers for the screen proof gate (roadmap rows 1c and 1n, decisions 0019 and 0023). Standard library only.

Reads the screen register, the family files of the template map (`design/patterns/<family>.md`), the state matrix,
the component registry, the ReUI catalog, the block ledger (`design/so-khoi.yaml`), the transition list and the list
of wrapping templates (`tools/proof_gate/`), contracts and their proof files (`_acceptance/<slug>/chung-minh-man.md`).
The rules live in check.py.
"""

from __future__ import annotations

import json
import re
import struct
import sys
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from repo_ontology import YamlError, load_yaml_file, split_front_matter

SCREENS_FILE = "design/screens.yaml"
STATES_FILE = "design/states.md"
REGISTRY_FILE = "design/component-registry.json"
CATALOG_FILE = "design/reui-catalog.json"
DECISIONS_FILE = "design/decisions.yaml"
PATTERNS_DIR = "design/patterns"
PROOF_FILE = "chung-minh-man.md"
RESERVED_PATTERN_FILES = {"README.md", "lech-lot.md"}
LEDGER_FILE = "design/so-khoi.yaml"  # decision 0023: one line per thing taken into the store
TRANSITION_FILE = "tools/proof_gate/chuyen-tiep.yaml"  # rounds past the scope gate when row 1n merged: 1c rules
WRAPPERS_FILE = "tools/proof_gate/khuon-boc.yaml"  # templates that wrap screens (App Shell), kept by people
CONTEXT_PAGES_DIR = "docs/tri-thuc/wiki/chu-de"  # context book of Quy hang, one page per screen
VENDOR_DIRS = ("src/components/ui/", "src/components/reui/")  # supplier components: kept as delivered

OPEN = ("draft", "approved", "implemented", "verified")
CLOSED = ("signed-off", "machine-cleared", "da-cham-boi-thuc-te")

# The three paths of a screen (design.md §2).
NEW_FAMILY = "ho_moi"
NEW_REFERENCE = "man_mau_moi"
FOLLOWS = "theo_mau"

PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def nfc(text: str) -> str:
    return unicodedata.normalize("NFC", text).strip()


def fold(text: str) -> str:
    """Comparison key: NFC, case-folded, inner spaces collapsed."""
    return re.sub(r"\s+", " ", nfc(text).casefold())


def slug_of(text: str) -> str:
    """'Lưới' → 'luoi': strip diacritics, đ → d, lowercase, spaces to dashes."""
    text = nfc(text).replace("đ", "d").replace("Đ", "D")
    text = "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


# ---------------------------------------------------------------- markdown


def sections(text: str, level: int) -> dict[str, list[str]]:
    """Heading text (NFC) → body lines, for headings of exactly `level`, up to the next heading of that level or higher."""
    out: dict[str, list[str]] = {}
    current: str | None = None
    marker = re.compile(r"^(#{1,6}) +(.*?)\s*$")
    for line in text.splitlines():
        m = marker.match(line)
        if m and len(m.group(1)) <= level:
            current = nfc(m.group(2)) if len(m.group(1)) == level else None
            if current is not None:
                out.setdefault(current, [])
            continue
        if current is not None:
            out[current].append(line)
    return out


def _cells(line: str) -> list[str]:
    inner = line.strip()
    inner = inner[1:] if inner.startswith("|") else inner
    inner = inner[:-1] if inner.endswith("|") else inner
    return [nfc(c) for c in inner.split("|")]


def table(lines: list[str]) -> tuple[list[str], list[dict[str, str]]] | None:
    """The first markdown table in `lines`: folded header names and rows keyed by them. None when no table."""
    rows = [ln for ln in lines if ln.strip().startswith("|")]
    if len(rows) < 2:
        return None
    header = [fold(c) for c in _cells(rows[0])]
    body = []
    for ln in rows[1:]:
        cells = _cells(ln)
        if all(re.fullmatch(r":?-{3,}:?", c) for c in cells if c):
            continue
        body.append({h: (cells[i] if i < len(cells) else "") for i, h in enumerate(header)})
    return header, body


def bare(cell: str) -> str:
    """A cell without markdown code ticks or emphasis."""
    return nfc(cell.replace("`", "").replace("**", ""))


# ---------------------------------------------------------------- repo data


@dataclass
class Family:
    key: str  # key in design/screens.yaml `families`
    name: str  # display name
    path: str | None = None  # family file, relative to root
    philosophy: str = ""
    reference: str | None = None  # screen id, or None for «chưa có»
    reference_declared: bool = False
    widths: list[int] = field(default_factory=list)
    aspects: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


@dataclass
class Repo:
    root: Path
    screens: dict[str, dict[str, Any]] = field(default_factory=dict)
    families: dict[str, Family] = field(default_factory=dict)
    states: list[str] = field(default_factory=list)
    registry_names: set[str] = field(default_factory=set)
    catalog_names: set[str] = field(default_factory=set)
    decision_ids: set[str] = field(default_factory=set)
    registry_files: dict[str, str] = field(default_factory=dict)
    ledger_present: bool = False
    ledger: list[dict[str, Any]] = field(default_factory=list)
    transition: dict[str, str] = field(default_factory=dict)  # slug -> reason
    wrappers: set[str] = field(default_factory=set)
    errors: list[str] = field(default_factory=list)

    def is_vendor(self, name: str) -> bool:
        return self.registry_files.get(name, "").startswith(VENDOR_DIRS)

    def family_of(self, screen_id: str) -> Family | None:
        screen = self.screens.get(screen_id) or {}
        key = screen.get("family")
        return self.families.get(str(key)) if key is not None else None


def _parse_family_file(fam: Family, root: Path, rel: str) -> None:
    fam.path = rel
    text = (root / rel).read_text(encoding="utf-8")
    _, body = split_front_matter(text)
    parts = sections(body, 2)
    need = ("Triết lý", "Màn mẫu", "Khổ so", "Mặt so")
    for name in need:
        if name not in parts:
            fam.errors.append(f"thiếu mục '## {name}'")
    fam.philosophy = " ".join(ln.strip() for ln in parts.get("Triết lý", []) if ln.strip())
    if "Triết lý" in parts and not fam.philosophy:
        fam.errors.append("mục Triết lý rỗng")
    for ln in parts.get("Màn mẫu", []):
        m = re.match(r"^\s*Màn\s*:\s*(.+?)\s*$", nfc(ln))
        if m:
            fam.reference_declared = True
            value = bare(m.group(1))
            fam.reference = None if fold(value) == "chưa có" else value
            break
    if "Màn mẫu" in parts and not fam.reference_declared:
        fam.errors.append("mục Màn mẫu thiếu dòng 'Màn: <id màn>' hay 'Màn: chưa có'")
    widths_text = " ".join(parts.get("Khổ so", []))
    fam.widths = [int(w) for w in re.findall(r"\b\d{3,4}\b", widths_text)]
    if "Khổ so" in parts and not fam.widths:
        fam.errors.append("mục Khổ so không có khổ nào")
    fam.aspects = [nfc(m.group(1)) for ln in parts.get("Mặt so", []) if (m := re.match(r"^\s*[-*]\s+(.+?)\s*$", ln))]
    if "Mặt so" in parts and not fam.aspects:
        fam.errors.append("mục Mặt so không có mặt nào")


def _names_from_catalog(data: Any) -> set[str]:
    names: set[str] = set()
    for group in data.get("groups", []) if isinstance(data, dict) else []:
        for item in group.get("items", []) if isinstance(group, dict) else []:
            if isinstance(item, dict) and item.get("name"):
                names.add(str(item["name"]))
    return names


def load_repo(root: Path) -> Repo:
    repo = Repo(root=root)
    try:
        doc = load_yaml_file(root / SCREENS_FILE)
    except YamlError as exc:
        repo.errors.append(f"{SCREENS_FILE}: không đọc được ({exc})")
        doc = None
    doc = doc if isinstance(doc, dict) else {}
    fam_names = doc.get("families") if isinstance(doc.get("families"), dict) else {}
    for key, name in fam_names.items():
        repo.families[str(key)] = Family(key=str(key), name=str(name))
    for item in doc.get("screens") or []:
        if isinstance(item, dict) and item.get("id"):
            repo.screens[str(item["id"])] = item

    pdir = root / PATTERNS_DIR
    files = sorted(p for p in pdir.glob("*.md") if p.name not in RESERVED_PATTERN_FILES) if pdir.is_dir() else []
    by_slug = {p.stem: p for p in files}
    for fam in repo.families.values():
        match = by_slug.get(fam.key) or by_slug.get(slug_of(fam.name))
        if match is not None:
            _parse_family_file(fam, root, match.relative_to(root).as_posix())

    states_path = root / STATES_FILE
    if states_path.is_file():
        parsed = table(states_path.read_text(encoding="utf-8").splitlines())
        if parsed:
            header, rows = parsed
            repo.states = [bare(r[header[0]]) for r in rows if bare(r[header[0]])]
    for rel, target in ((REGISTRY_FILE, "registry"), (CATALOG_FILE, "catalog")):
        path = root / rel
        if not path.is_file():
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except ValueError as exc:
            repo.errors.append(f"{rel}: không đọc được ({exc})")
            continue
        if target == "registry":
            for comp in data.get("components", []):
                if isinstance(comp, dict) and comp.get("name"):
                    repo.registry_names.add(str(comp["name"]))
                    repo.registry_files[str(comp["name"])] = str(comp.get("file") or "")
        else:
            repo.catalog_names = _names_from_catalog(data)
    dec_path = root / DECISIONS_FILE
    if dec_path.is_file():
        repo.decision_ids = set(re.findall(r"^\s*-\s*id:\s*([A-Za-z0-9_.-]+)", dec_path.read_text(encoding="utf-8"), re.M))
    _load_lists(repo, root)
    return repo


def _load_lists(repo: Repo, root: Path) -> None:
    """The block ledger, the transition list and the wrapper list. A missing ledger means decision 0023 is not on."""
    path = root / LEDGER_FILE
    if path.is_file():
        repo.ledger_present = True
        try:
            doc = load_yaml_file(path)
        except YamlError as exc:
            repo.errors.append(f"{LEDGER_FILE}: không đọc được ({exc})")
            doc = None
        items = doc.get("khoi") if isinstance(doc, dict) else None
        if not isinstance(items, list):
            repo.errors.append(f"{LEDGER_FILE}: thiếu danh sách 'khoi:'")
            items = []
        repo.ledger = [i if isinstance(i, dict) else {} for i in items]
    for rel, key, field_name in ((TRANSITION_FILE, "ho_so", "slug"), (WRAPPERS_FILE, "khuon", "id")):
        path = root / rel
        if not path.is_file():
            continue
        try:
            doc = load_yaml_file(path)
        except YamlError as exc:
            repo.errors.append(f"{rel}: không đọc được ({exc})")
            continue
        for item in (doc.get(key) if isinstance(doc, dict) else None) or []:
            if not isinstance(item, dict) or not item.get(field_name):
                repo.errors.append(f"{rel}: một dòng thiếu '{field_name}'")
                continue
            reason = str(item.get("ly_do") or "").strip()
            if not reason:
                repo.errors.append(f"{rel}: '{item[field_name]}' thiếu lý do")
            if key == "ho_so":
                repo.transition[str(item[field_name])] = reason
            else:
                repo.wrappers.add(str(item[field_name]))


# ---------------------------------------------------------------- contracts and proofs


@dataclass
class ScreenProof:
    screen: str
    parts: dict[str, list[str]]  # level-3 heading → lines


@dataclass
class Contract:
    slug: str
    dir: Path
    status: str
    screens: list[str]
    proof_exists: bool = False
    proofs: dict[str, ScreenProof] = field(default_factory=dict)
    approved_at: str = ""
    wrapper: str | None = None  # `khuon_boc` of the contract: the template this round proves
    templates: dict[str, ScreenProof] = field(default_factory=dict)  # `## Khuôn <id>` sections


def load_contracts(root: Path) -> list[Contract]:
    out: list[Contract] = []
    base = root / "_acceptance"
    if not base.is_dir():
        return out
    for path in sorted(base.glob("*/contract.md")):
        try:
            fm, _ = split_front_matter(path.read_text(encoding="utf-8"))
        except YamlError:
            continue
        if not isinstance(fm, dict):
            continue
        screens = fm.get("screens")
        screens = [str(s) for s in screens] if isinstance(screens, list) else []
        c = Contract(slug=path.parent.name, dir=path.parent, status=str(fm.get("status") or ""), screens=screens)
        c.approved_at = str(fm.get("approved_at") or "")[:10]
        c.wrapper = str(fm["khuon_boc"]) if fm.get("khuon_boc") else None
        proof = path.parent / PROOF_FILE
        if proof.is_file():
            c.proof_exists = True
            text = proof.read_text(encoding="utf-8")
            c.proofs = parse_proof(text)
            c.templates = parse_proof(text, "Khuôn")
        out.append(c)
    return out


def parse_proof(text: str, kind: str = "Màn") -> dict[str, ScreenProof]:
    """Level-2 sections `## Màn <id>` (or `## Khuôn <id>` for a wrapping template) → their level-3 parts."""
    out: dict[str, ScreenProof] = {}
    for heading, lines in sections(text, 2).items():
        m = re.match(rf"^{kind}\s+`?([A-Za-z0-9_.-]+)`?\s*$", heading)
        if m:
            out[m.group(1)] = ScreenProof(screen=m.group(1), parts=sections("\n".join(lines), 3))
    return out


def png_width(path: Path) -> int | None:
    """Width from the IHDR chunk, or None when the file is not a PNG."""
    try:
        head = path.read_bytes()[:24]
    except OSError:
        return None
    if len(head) < 24 or not head.startswith(PNG_SIGNATURE) or head[12:16] != b"IHDR":
        return None
    return struct.unpack(">I", head[16:20])[0]
