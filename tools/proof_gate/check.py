#!/usr/bin/env python3
"""Screen proof gate (roadmap row 1c, decision 0019). Standard library only.

  python3 tools/proof_gate/check.py [--root DIR]                 # fails (exit 1) on any problem
  python3 tools/proof_gate/check.py [--root DIR] --report [--json] # numbers for the kit, never fails

A round that builds a product screen proves it before it is presented. The machine, not the round, decides the path
of each screen from design/screens.yaml and the family files in design/patterns/:

  new family      the screen has no family, or its family has no file  → «Hướng» table: 2–3 real directions
  new reference   the family file says «Màn: chưa có», or names this screen → «Ma trận trạng thái» table, every state
  follows         the family file names another screen                  → «Ảnh cạnh màn mẫu» + «Mặt so» tables

Every path also carries the «Khối» table: the ladder Trong kho → ReUI → Vẽ tay, with grounds when a block leaves
«trong kho». Open contracts are checked: the «Hướng» table from `approved`, the whole proof from `implemented`.

Decision 0023 (row 1n) is on while design/so-khoi.yaml exists, for every open contract not named in
tools/proof_gate/chuyen-tiep.yaml. It adds, from `approved`: «Từ Quỹ hàng», «Họ», and ReUI candidates with images for
the whole screen (new family, new reference) or the wrapping template; from `implemented`: candidates for every block
taken into the store, «Vùng» and «Cách» for every ReUI block, its line in the block ledger, and «trong kho» looked up
in the ledger instead of the generated registry. A contract with `khuon_boc: <id>` (an id of
tools/proof_gate/khuon-boc.yaml) proves the template in `## Khuôn <id>`, not the screens it wraps.
Row 1q, while both design/so-khoi.yaml and tools/proof_gate/thanh-phan-co-truoc.yaml exist: every file of the generated component register outside the supplier
folders must be declared somewhere — a ledger line (its `tep`, or its `ten` naming a component of the file), the list
of files made before row 1q (tools/proof_gate/thanh-phan-co-truoc.yaml, frozen), or the «Khối» table of an open
contract naming a component of the file. No git: the frozen list stands for "already on the main branch".
Each problem is one line `<where> · <screen> · <code>: <sentence>`. Template: tools/proof_gate/khuon-chung-minh.md.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from legacy import History
from model import (
    BEFORE_1Q_FILE,
    CLOSED,
    CONTEXT_PAGES_DIR,
    LEDGER_FILE,
    FOLLOWS,
    NEW_FAMILY,
    NEW_REFERENCE,
    OPEN,
    PROOF_FILE,
    REGISTRY_FILE,
    Contract,
    Repo,
    ScreenProof,
    bare,
    fold,
    load_contracts,
    load_repo,
    png_width,
    table,
)

# Section names of a screen in the proof file (level-3 headings).
IMAGES = "Ảnh cạnh màn mẫu"
ASPECTS = "Mặt so"
BLOCKS = "Khối"
DIRECTIONS = "Hướng"
MATRIX = "Ma trận trạng thái"

SAME = "giống"
DIFF_REASON = "khác — có lý do"
DIFF_NONE = "khác — vô cớ"
PASSED = "đạt"
NOT_APPLICABLE = "không áp"
RUNGS = ("trong-kho", "reui", "ve-tay")
INTAKE_RUNGS = ("reui", "ve-tay")

# Decision 0023 sections (level-3 headings) and words.
FROM_QH = "Từ Quỹ hàng"
FAMILY = "Họ"
CANDIDATES = "Ứng viên ReUI"
REGIONS = "Vùng"
SCREEN_GROUP = "màn"
REGION_ACTIONS = ("lấy", "bỏ", "thêm")
HOW_PICK = "chọn khối"
HOW_COMPOSE = "ghép từ thành phần"
NO_FAMILY = "rỗng"
PATH_WORDS = {"họ mới": NEW_FAMILY, "màn mẫu mới": NEW_REFERENCE, "theo mẫu": FOLLOWS}
HAND_MADE = "tao-tay"
LEDGER_KEYS = ("ten", "tep", "nguon", "nhu_cau", "mo_ta", "ho_so", "duyet")
CHOSEN = {"x", "✓", "chọn", "có"}

STAGE_DIRECTIONS = ("approved", "implemented", "verified")
STAGE_FULL = ("implemented", "verified")


def dash_fold(text: str) -> str:
    """Folded, with every dash variant written as an em dash with spaces."""
    return re.sub(r"\s*[—–-]+\s*", " — ", fold(text))


@dataclass
class Finding:
    where: str
    screen: str
    code: str
    text: str

    def line(self) -> str:
        return f"{self.where} · {self.screen} · {self.code}: {self.text}"


@dataclass
class Tally:
    by_path: dict[str, int] = field(default_factory=lambda: {NEW_FAMILY: 0, NEW_REFERENCE: 0, FOLLOWS: 0})
    with_reason: int = 0
    unjustified: int = 0
    rung_drops: int = 0
    transition: int = 0
    ledger_lines: int = 0
    undeclared: int = 0


def path_of(repo: Repo, screen: str) -> str:
    fam = repo.family_of(screen)
    if fam is None or fam.path is None:
        return NEW_FAMILY
    if fam.reference is None or fam.reference == screen:
        return NEW_REFERENCE
    return FOLLOWS


def product_screens(repo: Repo, c: Contract) -> list[str]:
    return [s for s in c.screens if (repo.screens.get(s) or {}).get("audience") != "dev"]


# ---------------------------------------------------------------- grounds


def grounds_exist(repo: Repo, text: str) -> bool:
    """True when the text names at least one reference and every reference it names resolves.

    A reference is a file path in the repo (a folder does not count), a ledger decision `decision:<id>`, or a numbered
    wiki decision (`wiki/decisions/NNNN`, `ADR-NNNN`). One missing reference fails the whole cell: a real path next to
    a missing test file is not grounds for the missing one.
    """
    refs = 0
    wiki = re.compile(r"(?:wiki/decisions/|ADR-)(\d{4})(?:-[\w.-]*?)?(?:\.md)?(?=$|[^\w.-])")
    for m in wiki.finditer(text):
        refs += 1
        if not list((repo.root / "wiki/decisions").glob(f"{m.group(1)}-*.md")):
            return False
    for tok in re.findall(r"[^\s`,;()«»·\[\]]+", wiki.sub(" ", text)):
        tok = tok.rstrip(".:")
        if tok.startswith("decision:"):
            refs += 1
            if tok.split(":", 1)[1] not in repo.decision_ids:
                return False
        elif is_path_ref(repo, tok):
            refs += 1
            path = re.split(r"#|:(?=\d)", tok)[0]
            if path.startswith("/") or ".." in path or not (repo.root / path).is_file():
                return False
    return refs > 0


def is_path_ref(repo: Repo, tok: str) -> bool:
    """A token is a file reference when it starts in a top-level folder of the repo or ends in a file extension.

    Prose such as «đọc/ghi», «N/A» or «ListSide/BuyerSide», and web links, are not file references.
    """
    if "/" not in tok or "://" in tok:
        return False
    first = tok.lstrip("./").split("/", 1)[0]
    has_ext = re.search(r"\.[A-Za-z0-9]{1,5}(?:#.*|:\d+)?$", tok) is not None
    return has_ext or (bool(first) and (repo.root / first).is_dir())


def component_names_in(repo: Repo, text: str) -> list[str]:
    known = repo.registry_names | repo.catalog_names
    return [t for t in re.findall(r"[A-Za-z][A-Za-z0-9-]+", text) if t in known]


def image_ref(text: str, widths: list[int]) -> bool:
    return any(int(w) in widths for w in re.findall(r"ảnh\s*(\d{3,4})", fold(text)))


# ---------------------------------------------------------------- rules per table


def check_blocks(repo: Repo, p: ScreenProof, emit, tally: Tally, slug: str | None = None) -> None:
    """The «Khối» table. `slug` is set when decision 0023 applies: «trong kho» is then a supplier component or a block
    ledger line taken in by another round."""
    parsed = table(p.parts.get(BLOCKS, []))
    if not parsed or not parsed[1]:
        emit("thieu-bang-khoi", "chưa kê khối nào đã dùng để dựng màn (bảng Khối)")
        return
    _, rows = parsed
    known = repo.registry_names | repo.catalog_names
    for r in rows:
        name = bare(r.get("khối", ""))
        rung = fold(bare(r.get("bậc", "")))
        if rung not in RUNGS:
            emit("bac-la", f"khối '{name}' ghi bậc '{rung}', phải là một trong {', '.join(RUNGS)}")
            continue
        if rung == "trong-kho" and slug is not None:
            check_in_store(repo, name, slug, emit)
            continue
        if rung == "trong-kho":
            if name not in repo.registry_names:
                emit("khoi-khong-co", f"khối '{name}' ghi trong kho nhưng không có trong design/component-registry.json")
            continue
        tally.rung_drops += 1
        if rung == "reui" and name not in repo.catalog_names:
            emit("khoi-khong-co", f"khối '{name}' ghi ReUI nhưng không có trong design/reui-catalog.json")
        searched = bare(r.get("đã tra", ""))
        nearest = bare(r.get("ứng viên gần nhất", ""))
        why = bare(r.get("vì sao không dùng", ""))
        missing = [n for n, v in (("đã tra", searched), ("ứng viên gần nhất", nearest), ("vì sao không dùng", why)) if not v]
        if missing:
            emit("roi-bac-thieu-can-cu", f"khối '{name}' rơi khỏi trong kho mà thiếu {', '.join(missing)}")
        elif not any(n in known for n in re.split(r"[,\s]+", nearest)):
            emit("roi-bac-thieu-can-cu", f"khối '{name}': ứng viên gần nhất '{nearest}' không có trong kho hay danh mục ReUI")


def check_in_store(repo: Repo, name: str, slug: str, emit) -> None:
    """Decision 0023: «trong kho» only through the scale and the owner's eyes; what this round made is not in it."""
    if repo.is_vendor(name):
        return
    lines = [e for e in repo.ledger if str(e.get("ten") or "") == name]
    if lines:
        if all(str(e.get("ho_so") or "") == slug for e in lines):
            emit("trong-kho-tu-vong", f"khối '{name}' do chính hồ sơ này nhập kho ({LEDGER_FILE}) — ghi reui hay ve-tay, không ghi trong-kho")
        return
    if name in repo.registry_names:
        emit("trong-kho-chua-nhap", f"khối '{name}' có trong sổ thành phần nhưng chưa có dòng nhập kho trong {LEDGER_FILE}")
    else:
        emit("khoi-khong-co", f"khối '{name}' ghi trong kho nhưng không có trong {LEDGER_FILE} hay thành phần nhà cung cấp")


def check_images(repo: Repo, c: Contract, p: ScreenProof, widths: list[int], emit) -> None:
    parsed = table(p.parts.get(IMAGES, []))
    rows = parsed[1] if parsed else []
    by_width: dict[int, dict[str, str]] = {}
    for r in rows:
        m = re.search(r"\d{3,4}", r.get("khổ", ""))
        if m:
            by_width[int(m.group(0))] = r
    for w in widths:
        if w not in by_width:
            emit("thieu-anh-kho", f"thiếu cặp ảnh màn này cạnh màn mẫu ở khổ {w}")
            continue
        r = by_width[w]
        if not bare(r.get("dữ liệu", "")):
            emit("thieu-du-lieu", f"khổ {w}: chưa ghi nhãn dữ liệu chung của hai ảnh")
        blobs = []
        for col in ("màn này", "màn mẫu"):
            rel = bare(r.get(col, ""))
            path = (c.dir / rel) if rel else None
            if path is None or not path.is_file():
                emit("anh-khong-co", f"khổ {w}: ảnh {col} '{rel}' không có trong hồ sơ")
                continue
            width = png_width(path)
            if width is None:
                emit("anh-khong-phai-png", f"khổ {w}: ảnh {col} '{rel}' không phải PNG")
                continue
            if width != w:
                emit("anh-lech-kho", f"khổ {w}: ảnh {col} '{rel}' rộng {width}")
            blobs.append(hashlib.sha256(path.read_bytes()).hexdigest())
        if len(blobs) == 2 and blobs[0] == blobs[1]:
            emit("anh-trung", f"khổ {w}: ảnh màn này và ảnh màn mẫu là cùng một tệp")


def check_aspects(repo: Repo, p: ScreenProof, aspects: list[str], widths: list[int], emit, tally: Tally) -> int:
    parsed = table(p.parts.get(ASPECTS, []))
    rows = parsed[1] if parsed else []
    seen = {fold(bare(r.get("mặt", ""))) for r in rows}
    for a in aspects:
        if fold(a) not in seen:
            emit("thieu-mat", f"bảng mặt so thiếu mặt '{a}'")
    unjustified = 0
    for r in rows:
        aspect = bare(r.get("mặt", ""))
        verdict = dash_fold(bare(r.get("kết quả", "")))
        grounds = r.get("căn cứ", "")
        tag = f"{bare(r.get('mã', ''))} " if bare(r.get("mã", "")) else ""
        if verdict == SAME:
            if image_ref(grounds, widths):
                continue
            names = component_names_in(repo, grounds)
            if names:
                emit("ten-thanh-phan", f"{tag}mặt '{aspect}' ghi giống chỉ vì cùng thành phần ({', '.join(names)}) — chấm theo tên thành phần, không theo ảnh")
            else:
                emit("giong-khong-anh", f"{tag}mặt '{aspect}' ghi giống mà không chỉ chỗ thấy trên ảnh (ghi 'ảnh <khổ>')")
        elif verdict == DIFF_REASON:
            tally.with_reason += 1
            if not grounds_exist(repo, grounds):
                emit("ly-do-khong-can-cu", f"{tag}mặt '{aspect}': lý do không trỏ tệp có thật hay mã quyết định có thật")
        elif verdict == DIFF_NONE:
            tally.unjustified += 1
            unjustified += 1
            emit("lech-vo-co", f"{tag}mặt '{aspect}': chỗ lệch vô cớ còn đó")
        else:
            emit("ket-qua-la", f"{tag}mặt '{aspect}': kết quả '{bare(r.get('kết quả', ''))}' phải là {SAME}, {DIFF_REASON} hay {DIFF_NONE}")
    return unjustified


def matrix_complete(repo: Repo, p: ScreenProof, emit=None) -> bool:
    parsed = table(p.parts.get(MATRIX, []))
    rows = parsed[1] if parsed else []
    by_state = {fold(bare(r.get("trạng thái", ""))): r for r in rows}
    ok = True

    def say(code: str, text: str) -> None:
        nonlocal ok
        ok = False
        if emit:
            emit(code, text)

    for state in repo.states:
        r = by_state.get(fold(state))
        if r is None:
            say("thieu-trang-thai", f"ma trận thiếu trạng thái '{state}'")
            continue
        verdict = fold(bare(r.get("kết quả", "")))
        grounds = r.get("căn cứ", "")
        if verdict == PASSED:
            if not grounds_exist(repo, grounds):
                say("bai-kiem-khong-co", f"trạng thái '{state}' ghi đạt mà bài kiểm '{bare(grounds)}' không có")
        elif verdict == NOT_APPLICABLE:
            if not bare(grounds):
                say("khong-ap-thieu-ly-do", f"trạng thái '{state}' ghi không áp mà không nêu lý do")
        else:
            say("ket-qua-la", f"trạng thái '{state}': kết quả phải là {PASSED} hay {NOT_APPLICABLE}")
    return ok


def check_directions(c: Contract, p: ScreenProof, emit) -> None:
    parsed = table(p.parts.get(DIRECTIONS, []))
    rows = parsed[1] if parsed else []
    if len(rows) < 2:
        emit("thieu-huong", f"họ mới cần hai đến ba hướng thật sự khác nhau, mới có {len(rows)}")
    if len(rows) > 3:
        emit("qua-nhieu-huong", f"họ mới trình hai đến ba hướng, đang có {len(rows)}")
    digests: dict[str, str] = {}
    chosen = 0
    for r in rows:
        name = bare(r.get("hướng", "")) or "?"
        missing = [k for k in ("ảnh", "động cơ", "đánh đổi") if not bare(r.get(k, ""))]
        if missing:
            emit("huong-thieu-truong", f"hướng '{name}' thiếu {', '.join(missing)}")
        if fold(bare(r.get("chọn", ""))) in CHOSEN:
            chosen += 1
        rel = bare(r.get("ảnh", ""))
        if not rel:
            continue
        path = c.dir / rel
        if not path.is_file():
            emit("anh-khong-co", f"hướng '{name}': ảnh '{rel}' không có trong hồ sơ")
            continue
        if png_width(path) is None:
            emit("anh-khong-phai-png", f"hướng '{name}': ảnh '{rel}' không phải PNG")
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest in digests:
            emit("huong-trung", f"hướng '{name}' và hướng '{digests[digest]}' cùng một ảnh")
        digests[digest] = name
    if rows and chosen != 1:
        emit("chon-khac-mot", f"đúng một hướng phải được chọn, đang có {chosen}")


# ---------------------------------------------------------------- decision 0023


def block_rows(p: ScreenProof) -> list[dict[str, str]]:
    parsed = table(p.parts.get(BLOCKS, []))
    return parsed[1] if parsed else []


def check_from_qh(repo: Repo, p: ScreenProof, emit) -> None:
    parsed = table(p.parts.get(FROM_QH, []))
    rows = parsed[1] if parsed else []
    if not rows:
        emit("thieu-tu-quy-hang", f"chưa có mục '### {FROM_QH}' (trang sổ bối cảnh, khối Quỹ hàng đã chọn, giữ, bỏ, vì sao)")
        return
    r = rows[0]
    for col in ("khối quỹ hàng đã chọn", "giữ", "bỏ", "vì sao"):
        if not bare(r.get(col, "")):
            emit("tu-quy-hang-thieu-truong", f"mục Từ Quỹ hàng thiếu cột '{col}'")
    page = bare(r.get("trang", ""))
    m = re.match(r"^chưa có trang\s*(?:[—–-]+\s*(.*))?$", fold(page))
    if m:
        if not (m.group(1) or "").strip():
            emit("trang-boi-canh-khong-co", "ghi 'chưa có trang' mà không nêu lý do")
        return
    ok = page.startswith(CONTEXT_PAGES_DIR + "/") and ".." not in page and (repo.root / page).is_file()
    if not ok:
        emit("trang-boi-canh-khong-co", f"trang '{page}' không có dưới {CONTEXT_PAGES_DIR}/ (hay ghi 'chưa có trang — <lý do>')")


def check_family(repo: Repo, screen: str, p: ScreenProof, emit) -> None:
    parsed = table(p.parts.get(FAMILY, []))
    rows = parsed[1] if parsed else []
    if not rows:
        emit("thieu-ho", f"chưa có mục '### {FAMILY}' (họ đề xuất, lối suy ra, vì sao)")
        return
    r = rows[0]
    proposed = bare(r.get("họ đề xuất", ""))
    actual = (repo.screens.get(screen) or {}).get("family")
    if fold(proposed) == NO_FAMILY:
        if actual is not None:
            emit("ho-lech-so-man", f"ghi họ rỗng mà design/screens.yaml ghi '{actual}'")
        if not bare(r.get("vì sao", "")):
            emit("ho-rong-thieu-ly-do", "để họ rỗng mà không nêu vì sao màn không thuộc họ đã có")
    elif actual is None or proposed != str(actual):
        emit("ho-lech-so-man", f"họ đề xuất '{proposed}' khác cột family '{actual}' của design/screens.yaml")
    said = PATH_WORDS.get(fold(bare(r.get("lối", ""))))
    if said != path_of(repo, screen):
        emit("loi-lech", f"lối ghi '{bare(r.get('lối', ''))}' khác lối máy suy ({path_of(repo, screen)})")


def candidate_groups(p: ScreenProof) -> dict[str, list[dict[str, str]]]:
    parsed = table(p.parts.get(CANDIDATES, []))
    groups: dict[str, list[dict[str, str]]] = {}
    for r in parsed[1] if parsed else []:
        groups.setdefault(fold(bare(r.get("cho", ""))), []).append(r)
    return groups


def check_group(repo: Repo, c: Contract, key: str, rows: list[dict[str, str]], emit) -> int:
    """One candidate group: 2–3 real ReUI names, one PNG each, no image twice, at most one chosen. Returns chosen count."""
    if len(rows) < 2:
        emit("ung-vien-it", f"nhóm ứng viên '{key}' có {len(rows)} ứng viên, cần hai đến ba")
    if len(rows) > 3:
        emit("ung-vien-nhieu", f"nhóm ứng viên '{key}' có {len(rows)} ứng viên, cần hai đến ba")
    digests: dict[str, str] = {}
    chosen = 0
    for r in rows:
        name = bare(r.get("ứng viên", ""))
        if name not in repo.catalog_names:
            emit("ung-vien-khong-co", f"nhóm '{key}': ứng viên '{name}' không có trong design/reui-catalog.json")
        if fold(bare(r.get("chọn", ""))) in CHOSEN:
            chosen += 1
        rel = bare(r.get("ảnh", ""))
        path = c.dir / rel if rel else None
        if path is None or ".." in rel or not path.is_file():
            emit("anh-khong-co", f"nhóm '{key}': ảnh của '{name}' '{rel}' không có trong hồ sơ")
            continue
        if png_width(path) is None:
            emit("anh-khong-phai-png", f"nhóm '{key}': ảnh của '{name}' '{rel}' không phải PNG")
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest in digests:
            emit("ung-vien-trung-anh", f"nhóm '{key}': '{name}' và '{digests[digest]}' cùng một ảnh")
        digests[digest] = name
    if chosen > 1:
        emit("chon-qua-mot", f"nhóm ứng viên '{key}' có {chosen} dấu chọn, nhiều nhất một")
    return chosen


def require_group(repo: Repo, c: Contract, groups, key: str, emit) -> tuple[bool, int, list[dict[str, str]]]:
    rows = groups.get(fold(key))
    if not rows:
        emit("thieu-ung-vien", f"thiếu nhóm ứng viên ReUI kèm ảnh cho '{key}' (bảng '### {CANDIDATES}', cột Cho = {key})")
        return False, 0, []
    return True, check_group(repo, c, key, rows, emit), rows


def check_intake(repo: Repo, c: Contract, p: ScreenProof, emit) -> None:
    """From `implemented`: every block taken in (reui, ve-tay) has candidates and a ledger line; ReUI blocks have regions."""
    groups = candidate_groups(p)
    regions = table(p.parts.get(REGIONS, []))
    region_rows = regions[1] if regions else []
    for r in block_rows(p):
        name = bare(r.get("khối", ""))
        rung = fold(bare(r.get("bậc", "")))
        if rung not in INTAKE_RUNGS:
            continue
        ok, chosen, rows = require_group(repo, c, groups, name, emit)
        if ok and rung == "reui":
            picked = [bare(x.get("ứng viên", "")) for x in rows if fold(bare(x.get("chọn", ""))) in CHOSEN]
            if name not in picked:
                emit("reui-khong-duoc-chon", f"khối '{name}' ghi reui nhưng không phải ứng viên được chọn của nhóm nó")
        if ok and rung == "ve-tay" and chosen:
            emit("ve-tay-ma-chon", f"khối '{name}' ghi ve-tay mà nhóm ứng viên có một ứng viên được chọn")
        if rung == "reui":
            check_regions(name, r, region_rows, emit)
        want = (lambda e: str(e.get("nguon") or "") == name) if rung == "reui" else (lambda e: str(e.get("ten") or "") == name)
        if not any(str(e.get("ho_so") or "") == c.slug and want(e) for e in repo.ledger):
            emit("nhap-kho-thieu-so", f"khối '{name}' nhập kho mà {LEDGER_FILE} chưa có dòng ho_so: {c.slug}")


def check_regions(name: str, block: dict[str, str], region_rows: list[dict[str, str]], emit) -> None:
    rows = [r for r in region_rows if fold(bare(r.get("khối", ""))) == fold(name)]
    if not rows:
        emit("thieu-vung", f"khối ReUI '{name}' chưa có dòng nào ở '### {REGIONS}' (vùng lấy, bỏ, thêm và lý do)")
    count = {a: 0 for a in REGION_ACTIONS}
    for r in rows:
        action = fold(bare(r.get("xử lý", "")))
        region = bare(r.get("vùng", "")) or "?"
        if action not in REGION_ACTIONS:
            emit("vung-xu-ly-la", f"khối '{name}', vùng '{region}': xử lý '{action}' phải là lấy, bỏ hay thêm")
        else:
            count[action] += 1
        if not bare(r.get("lý do", "")):
            emit("vung-thieu-ly-do", f"khối '{name}', vùng '{region}' thiếu lý do")
    how = fold(bare(block.get("cách", "")))
    if not how:
        emit("thieu-cach", f"khối ReUI '{name}' chưa ghi cột Cách ({HOW_PICK} hay {HOW_COMPOSE})")
    elif how not in (HOW_PICK, HOW_COMPOSE):
        emit("cach-la", f"khối '{name}' ghi Cách '{how}', phải là {HOW_PICK} hay {HOW_COMPOSE}")
    original = count["lấy"] + count["bỏ"]
    if how == HOW_PICK and original and count["bỏ"] * 2 > original:
        emit("cat-qua-nua", f"khối '{name}' bỏ {count['bỏ']}/{original} vùng mà ghi '{HOW_PICK}' — gọi đúng tên là '{HOW_COMPOSE}'")


def check_ledger(repo: Repo, by_slug: dict[str, Contract]) -> list[Finding]:
    out: list[Finding] = []
    history: History | None = None  # read only when a pair asks for it

    def emit(entry: str, code: str, text: str) -> None:
        out.append(Finding(LEDGER_FILE, entry, code, text))

    seen_name: dict[str, int] = {}
    seen_need: dict[str, str] = {}
    for i, e in enumerate(repo.ledger, 1):
        name = str(e.get("ten") or f"dòng {i}")
        missing = [k for k in LEDGER_KEYS if not str(e.get(k) or "").strip()]
        if missing:
            emit(name, "so-thieu-truong", f"dòng sổ thiếu {', '.join(missing)}")
        if name in seen_name:
            emit(name, "so-trung-ten", f"tên '{name}' đã có ở dòng {seen_name[name]}")
        seen_name.setdefault(name, i)
        need = str(e.get("nhu_cau") or "").strip()
        if need and need in seen_need:
            emit(name, "so-trung-nhu-cau", f"'{name}' và '{seen_need[need]}' cùng nhu cầu '{need}' — một nhu cầu một lời giải, mở rộng thứ đã có")
        if need:
            seen_need.setdefault(need, name)
        source = str(e.get("nguon") or "")
        if source and source != HAND_MADE and source not in repo.catalog_names:
            emit(name, "so-nguon-la", f"nguồn '{source}' không phải {HAND_MADE} hay tên trong design/reui-catalog.json")
        tep = str(e.get("tep") or "")
        if tep and (tep.startswith("/") or ".." in tep or not (repo.root / tep).is_file()):
            emit(name, "so-tep-khong-co", f"tệp '{tep}' không có")
        day = str(e.get("duyet") or "")
        if day and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", day):
            emit(name, "so-ngay-la", f"ngày duyệt '{day}' phải viết YYYY-MM-DD")
            day = ""
        slug = str(e.get("ho_so") or "")
        if not slug:
            continue
        owner = by_slug.get(slug)
        if owner is None:
            emit(name, "so-ho-so-khong-co", f"hồ sơ '{slug}' không có trong _acceptance/")
            continue
        if day and owner.approved_at != day:
            emit(name, "so-ngay-lech", f"ngày duyệt {day} khác ngày hồ sơ '{slug}' qua Cổng Phạm vi ({owner.approved_at or 'chưa duyệt'})")
        rows = [r for part in list(owner.proofs.values()) + list(owner.templates.values()) for r in block_rows(part)]
        want_name, want_rung = (source, "reui") if source != HAND_MADE else (name, "ve-tay")
        legacy = repo.legacy_blocks.get((name, slug))
        if legacy is not None and owner.status not in OPEN:
            # Made before the ledger by a closed round, named pair by pair (so-khoi.yaml, khoi_co_truoc); git must
            # prove the commit, its file and its day (row 2e, AC-10).
            if history is None:
                history = History.read(repo.root)
            for code, text in history.check_pair(name, legacy["commit"], legacy["ngay"], tep):
                emit(name, code, text)
            continue
        if not any(bare(r.get("khối", "")) == want_name and fold(bare(r.get("bậc", ""))) == want_rung for r in rows):
            emit(name, "so-khong-chung-tu", f"bảng Khối của hồ sơ '{slug}' không có dòng '{want_name}' bậc {want_rung}")
    return out


def judge_0023_screen(repo: Repo, c: Contract, s: str, emit, full: bool) -> None:
    p = c.proofs[s]
    check_from_qh(repo, p, emit)
    check_family(repo, s, p, emit)
    if path_of(repo, s) in (NEW_FAMILY, NEW_REFERENCE):
        require_group(repo, c, candidate_groups(p), SCREEN_GROUP, emit)
    if full:
        check_intake(repo, c, p, emit)


def judge_template(repo: Repo, c: Contract, tid: str, *, new: bool, full: bool, tally: Tally, sink: list[Finding]) -> None:
    """A wrapping template (`khuon_boc`): its own `## Khuôn <id>` section, never the screens it wraps."""

    def emit(code: str, text: str) -> None:
        sink.append(Finding(c.slug, f"khuôn {tid}", code, text))

    if not (full or (new and c.status in STAGE_DIRECTIONS)):
        return
    p = c.templates.get(tid)
    if p is None:
        what = "chưa có tệp chứng minh" if not c.proof_exists else f"tệp chứng minh chưa có mục '## Khuôn {tid}'"
        emit("thieu-chung-minh-khuon", f"{what} (_acceptance/{c.slug}/{PROOF_FILE})")
        return
    if new:
        check_from_qh(repo, p, emit)
        existing = any(str(e.get("ten") or "") == tid and str(e.get("ho_so") or "") != c.slug for e in repo.ledger)
        if not existing:
            require_group(repo, c, candidate_groups(p), tid, emit)
    if full:
        check_blocks(repo, p, emit, tally, c.slug if new else None)
        if new:
            check_intake(repo, c, p, emit)


# ---------------------------------------------------------------- row 1q

UNDECLARED = "khoi-khong-ke"


def check_undeclared(repo: Repo, contracts: list[Contract]) -> list[Finding]:
    """Row 1q: an own file of the register that no ledger line, no line of the list made before row 1q and no «Khối»
    table of an open contract declares. The unit is the file, so both shapes of the register read the same."""
    declared_names: set[str] = {str(e.get("ten") or "") for e in repo.ledger}
    declared_files: set[str] = {str(e.get("tep") or "") for e in repo.ledger} | repo.before_1q
    for c in contracts:
        if c.status not in OPEN:
            continue
        for part in list(c.proofs.values()) + list(c.templates.values()):
            declared_names.update(bare(r.get("khối", "")) for r in block_rows(part))
    out: list[Finding] = []
    for path, names in sorted(repo.own_files().items()):
        if path in declared_files or any(n in declared_names for n in names):
            continue
        out.append(
            Finding(
                REGISTRY_FILE,
                path,
                UNDECLARED,
                f"tệp {path} ({', '.join(names)}) mới trong sổ thành phần mà chưa kê ở sổ khối, danh sách có trước hay "
                f"bảng Khối của hồ sơ đang mở nào — kê nó vào bảng Khối của hồ sơ đang dựng ({BEFORE_1Q_FILE} không lớn thêm)",
            )
        )
    return out


# ---------------------------------------------------------------- whole repo


def run(root: Path) -> tuple[list[Finding], Tally, dict[str, int]]:
    repo = load_repo(root)
    contracts = load_contracts(root)
    findings: list[Finding] = [Finding("design", "-", "doc-loi", e) for e in repo.errors]
    tally = Tally()
    counts = {"truoc_cong": 0, "vong_cham_man": 0}

    for fam in repo.families.values():
        if fam.path is None:
            continue
        for e in fam.errors:
            findings.append(Finding(fam.path, "-", "ho-thieu-muc", e))
        if fam.reference is not None:
            proven = any(
                fam.reference in c.proofs and matrix_complete(repo, c.proofs[fam.reference]) for c in contracts
            )
            if not proven:
                findings.append(
                    Finding(fam.path, fam.reference, "man-mau-chua-dat", "màn mẫu đã khai mà chưa tệp chứng minh nào chứng đủ ma trận trạng thái")
                )

    by_slug = {c.slug: c for c in contracts}
    tally.ledger_lines = len(repo.ledger)
    if repo.ledger_present:
        findings.extend(check_ledger(repo, by_slug))
    if repo.ledger_present and repo.before_1q_present:
        undeclared = check_undeclared(repo, contracts)
        tally.undeclared = len(undeclared)
        findings.extend(undeclared)

    for c in contracts:
        new = repo.ledger_present and c.slug not in repo.transition
        wrapped = False
        if c.wrapper is not None and c.status in OPEN:
            if c.wrapper in repo.wrappers:
                wrapped = True
                judge_template(repo, c, c.wrapper, new=new, full=c.status in STAGE_FULL, tally=tally, sink=findings)
            else:
                findings.append(
                    Finding(c.slug, f"khuôn {c.wrapper}", "khuon-boc-la", f"khuon_boc '{c.wrapper}' không có trong tools/proof_gate/khuon-boc.yaml — các màn vẫn phải chứng minh từng màn")
                )
        if c.status in OPEN and c.slug in repo.transition:
            tally.transition += 1
        screens = [] if wrapped else product_screens(repo, c)
        if not screens:
            continue
        for s in screens:
            if s in c.proofs:
                tally.by_path[path_of(repo, s)] += 1
        if c.status in CLOSED:
            # Signed rounds are not judged again; their proofs still count in the numbers for the kit.
            counts["truoc_cong"] += 1
            for s in screens:
                if s in c.proofs:
                    judge(repo, c, s, full=True, tally=tally, sink=[])
            continue
        if c.status not in OPEN:
            continue
        counts["vong_cham_man"] += 1
        for s in screens:
            path = path_of(repo, s)
            full = c.status in STAGE_FULL
            if not (full or ((path == NEW_FAMILY or new) and c.status in STAGE_DIRECTIONS)):
                continue
            if s not in c.proofs:
                where = f"_acceptance/{c.slug}/{PROOF_FILE}"
                what = "chưa có tệp chứng minh" if not c.proof_exists else f"tệp chứng minh chưa có mục '## Màn {s}'"
                findings.append(Finding(c.slug, s, "thieu-chung-minh", f"{what} ({where}), lối {path}"))
                continue
            judge(repo, c, s, full=full, tally=tally, sink=findings, new=new)
    return findings, tally, counts


def judge(repo: Repo, c: Contract, s: str, *, full: bool, tally: Tally, sink: list[Finding], new: bool = False) -> None:
    """Check one screen's proof along its path. `full` is False at `approved`: directions of a new family, and with
    decision 0023 the sections owed at the scope gate."""
    p = c.proofs[s]
    path = path_of(repo, s)

    def emit(code: str, text: str) -> None:
        sink.append(Finding(c.slug, s, code, text))

    if new:
        judge_0023_screen(repo, c, s, emit, full)
    if not full:
        if path == NEW_FAMILY:
            check_directions(c, p, emit)
        return
    if path == NEW_FAMILY:
        check_directions(c, p, emit)
    elif path == NEW_REFERENCE:
        matrix_complete(repo, p, emit)
    else:
        fam = repo.family_of(s)
        assert fam is not None
        check_images(repo, c, p, fam.widths, emit)
        n = check_aspects(repo, p, fam.aspects, fam.widths, emit, tally)
        if n:
            emit("lech-vo-co", f"{n} chỗ lệch vô cớ")
    check_blocks(repo, p, emit, tally, c.slug if new else None)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", default=".")
    ap.add_argument("--report", action="store_true")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args(argv)
    root = Path(args.root).resolve()
    findings, tally, counts = run(root)
    if args.report:
        data = {
            "vong_cham_man": counts["vong_cham_man"],
            "truoc_cong": counts["truoc_cong"],
            "theo_loi": tally.by_path,
            "lech": {"co_ly_do": tally.with_reason, "vo_co": tally.unjustified},
            "roi_bac": tally.rung_drops,
            "nhap_kho": tally.ledger_lines,
            "chuyen_tiep": tally.transition,
            "khoi_khong_ke": tally.undeclared,
            "loi": len(findings),
        }
        if args.json:
            print(json.dumps(data, ensure_ascii=False))
        else:
            print(f"vòng chạm màn đang mở: {data['vong_cham_man']} · trước cổng: {data['truoc_cong']}")
            print(f"theo lối: họ mới {tally.by_path[NEW_FAMILY]} · màn mẫu mới {tally.by_path[NEW_REFERENCE]} · theo mẫu {tally.by_path[FOLLOWS]}")
            print(f"chỗ lệch: có lý do {tally.with_reason} · vô cớ {tally.unjustified} · rơi bậc: {tally.rung_drops}")
            print(f"sổ khối: {tally.ledger_lines} dòng nhập kho · hồ sơ chuyển tiếp còn mở: {tally.transition}")
            print(f"tệp tự làm chưa kê: {tally.undeclared}")
        return 0
    for f in findings:
        print(f.line())
    if findings:
        print(f"proof-gate: {len(findings)} lỗi — mẫu tệp chứng minh: tools/proof_gate/khuon-chung-minh.md", file=sys.stderr)
        return 1
    print("proof-gate: mọi màn đang mở đã chứng minh đúng lối")
    return 0


if __name__ == "__main__":
    sys.exit(main())
