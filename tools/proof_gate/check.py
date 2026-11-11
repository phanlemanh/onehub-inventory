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
from model import (
    CLOSED,
    FOLLOWS,
    NEW_FAMILY,
    NEW_REFERENCE,
    OPEN,
    PROOF_FILE,
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
    for tok in re.findall(r"[^\s`,;()«»·]+", text):
        tok = tok.rstrip(".:")
        wiki = re.fullmatch(r"(?:wiki/decisions/|ADR-)(\d{4})(?:-[\w.-]*)?", tok)
        if wiki:
            refs += 1
            if not list((repo.root / "wiki/decisions").glob(f"{wiki.group(1)}-*.md")):
                return False
        elif tok.startswith("decision:"):
            refs += 1
            if tok.split(":", 1)[1] not in repo.decision_ids:
                return False
        elif "/" in tok:
            refs += 1
            path = re.split(r"#|:(?=\d)", tok)[0]
            if not path or path.startswith("/") or ".." in path or not (repo.root / path).is_file():
                return False
    return refs > 0


def component_names_in(repo: Repo, text: str) -> list[str]:
    known = repo.registry_names | repo.catalog_names
    return [t for t in re.findall(r"[A-Za-z][A-Za-z0-9-]+", text) if t in known]


def image_ref(text: str, widths: list[int]) -> bool:
    return any(int(w) in widths for w in re.findall(r"ảnh\s*(\d{3,4})", fold(text)))


# ---------------------------------------------------------------- rules per table


def check_blocks(repo: Repo, p: ScreenProof, emit, tally: Tally) -> None:
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

    for c in contracts:
        screens = product_screens(repo, c)
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
            if not (full or (path == NEW_FAMILY and c.status in STAGE_DIRECTIONS)):
                continue
            if s not in c.proofs:
                where = f"_acceptance/{c.slug}/{PROOF_FILE}"
                what = "chưa có tệp chứng minh" if not c.proof_exists else f"tệp chứng minh chưa có mục '## Màn {s}'"
                findings.append(Finding(c.slug, s, "thieu-chung-minh", f"{what} ({where}), lối {path}"))
                continue
            judge(repo, c, s, full=full, tally=tally, sink=findings)
    return findings, tally, counts


def judge(repo: Repo, c: Contract, s: str, *, full: bool, tally: Tally, sink: list[Finding]) -> None:
    """Check one screen's proof along its path; `full` is False only for a new family at `approved` (directions only)."""
    p = c.proofs[s]
    path = path_of(repo, s)

    def emit(code: str, text: str) -> None:
        sink.append(Finding(c.slug, s, code, text))

    if path == NEW_FAMILY:
        check_directions(c, p, emit)
        if not full:
            return
    elif path == NEW_REFERENCE:
        matrix_complete(repo, p, emit)
    else:
        fam = repo.family_of(s)
        assert fam is not None
        check_images(repo, c, p, fam.widths, emit)
        n = check_aspects(repo, p, fam.aspects, fam.widths, emit, tally)
        if n:
            emit("lech-vo-co", f"{n} chỗ lệch vô cớ")
    check_blocks(repo, p, emit, tally)


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
            "loi": len(findings),
        }
        if args.json:
            print(json.dumps(data, ensure_ascii=False))
        else:
            print(f"vòng chạm màn đang mở: {data['vong_cham_man']} · trước cổng: {data['truoc_cong']}")
            print(f"theo lối: họ mới {tally.by_path[NEW_FAMILY]} · màn mẫu mới {tally.by_path[NEW_REFERENCE]} · theo mẫu {tally.by_path[FOLLOWS]}")
            print(f"chỗ lệch: có lý do {tally.with_reason} · vô cớ {tally.unjustified} · rơi bậc: {tally.rung_drops}")
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
