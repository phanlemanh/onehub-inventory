#!/usr/bin/env python3
"""Per-round rework measurement for UI rounds (standard library only).

  python3 tools/round_metrics/round_metrics.py ghi --slug <slug> [--phan r<N>=<layer>[,<layer>]]...
  python3 tools/round_metrics/round_metrics.py kiem
  python3 tools/round_metrics/round_metrics.py kiem-moc
  python3 tools/round_metrics/round_metrics.py gop [--json]

Every command takes --root <dir>; the default is the repository that holds this file.
Design: docs/plan/do-he-design/thiet-ke.md. Acceptance record: _acceptance/so-do-moi-vong/.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))
from design_check import check_problem  # noqa: E402
from repo_ontology import load_yaml_file  # noqa: E402

# The eleven rework reasons of the Quy hang audit table, in its order (decision 0019).
TANG = (
    "bai-kiem-ha-tang",
    "trang-thai-hanh-vi",
    "du-lieu-api",
    "nghiep-vu",
    "thanh-phan",
    "bo-cuc",
    "hop-dong-yeu-cau",
    "link",
    "chu-dinh-dang",
    "mau-token",
    "truy-cap",
)
# Layers that are not a product change, left out of the second percentage, as in the audit table.
NGOAI_SAN_PHAM = ("bai-kiem-ha-tang", "hop-dong-yeu-cau")
TRANG_THAI_DOI = ("verified", "machine-cleared", "signed-off", "da-cham-boi-thuc-te")
# Statuses a record reaches only after the Evidence Gate.
QUA_CONG = ("machine-cleared", "signed-off", "da-cham-boi-thuc-te")
MAT_GIAO_DIEN = ("ui", "web", "web-ui")
TEP_SO_DO = "so-do-vong.json"
LENH = "python3 tools/round_metrics/round_metrics.py"
KHUNG_1A = "_acceptance/khung-va-giao-dien/contract.md"
THU_MUC_MOC = "docs/plan/do-he-design"
CAU_GIAO_DA_GUI = "## Câu giao đã gửi (nguyên văn, đường dẫn máy đã lược)"


class LoiDauVao(Exception):
    pass


# --- reading -------------------------------------------------------------------------------------


def doc_so_chay(path: Path) -> list[dict]:
    """Lines of a kit run log; lines that are not JSON objects are skipped."""
    if not path.exists():
        return []
    out = []
    for line in path.read_text("utf-8").splitlines():
        try:
            row = json.loads(line)
        except ValueError:
            continue
        if isinstance(row, dict):
            out.append(row)
    return out


def ket_qua_luot(rows: list[dict]) -> dict[int, str]:
    """Round number -> verdict of the LAST round-tally line of that round."""
    luot: dict[int, str] = {}
    for row in rows:
        if row.get("kind") != "round-tally":
            continue
        try:
            so = int(row["round"])
        except (KeyError, TypeError, ValueError):
            continue
        luot[so] = str(row.get("verdict", ""))
    return dict(sorted(luot.items()))


def dong_cuoi(rows: list[dict], kind: str) -> dict | None:
    found = [r for r in rows if r.get("kind") == kind]
    return found[-1] if found else None


def frontmatter(path: Path) -> dict[str, str]:
    return frontmatter_text(path.read_text("utf-8")) if path.exists() else {}


def frontmatter_text(text: str) -> dict[str, str]:
    """Top-level keys of a contract frontmatter, without trailing `# comments` or surrounding quotes."""
    m = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.S)
    if not m:
        return {}
    out = {}
    for line in m.group(1).splitlines():
        key, sep, value = line.partition(":")
        if sep and not line.startswith((" ", "\t")):
            out[key.strip()] = value.split("#", 1)[0].strip().strip("'\"")
    return out


def la_giao_dien(ho_so: Path, fm: dict[str, str]) -> bool:
    surfaces = [s.strip().strip("'\"") for s in fm.get("surfaces", "").strip("[]").split(",")]
    return any(s in MAT_GIAO_DIEN for s in surfaces) or (ho_so / "design-pass.md").exists()


# --- ghi -----------------------------------------------------------------------------------------


def doc_phan(values: list[str]) -> dict[int, list[str]]:
    phan: dict[int, list[str]] = {}
    for value in values:
        luot, sep, tangs = value.partition("=")
        m = re.fullmatch(r"r(\d+)", luot.strip())
        if not sep or not m:
            raise LoiDauVao(f"--phan phai co dang r<N>=<tang>[,<tang>]: {value}")
        ds = [t.strip() for t in tangs.split(",") if t.strip()]
        for t in ds:
            if t not in TANG:
                raise LoiDauVao(f"tang khong co: {t}; tang hop le: {', '.join(TANG)}")
        if not ds:
            raise LoiDauVao(f"--phan thieu tang: {value}; tang hop le: {', '.join(TANG)}")
        phan[int(m.group(1))] = ds
    return phan


def ghi(root: Path, slug: str, phan: dict[int, list[str]]) -> dict:
    ho_so = root / "_acceptance" / slug
    if not ho_so.is_dir():
        raise LoiDauVao(f"khong co ho so: _acceptance/{slug}")
    rows = doc_so_chay(ho_so / "run-log.jsonl")
    luot = ket_qua_luot(rows)
    for so in phan:
        if so not in luot:
            raise LoiDauVao(f"r{so}: so chay khong co luot nay")
        if luot[so] != "REJECT":
            raise LoiDauVao(f"r{so}: luot nay la {luot[so]}, chi khai tang cho luot REJECT")

    cu: dict[int, list[str]] = {}
    tep = ho_so / TEP_SO_DO
    if tep.exists():
        try:
            for item in json.loads(tep.read_text("utf-8")).get("luot", []):
                if item.get("tang"):
                    cu[int(item["vong"])] = list(item["tang"])
        except (ValueError, KeyError, TypeError, AttributeError):
            cu = {}

    ds_luot, lam_lai, chua_phan = [], [], []
    for so, verdict in luot.items():
        tangs: list[str] = []
        if verdict == "REJECT":
            tangs = phan.get(so) or cu.get(so) or []
            if not tangs:
                chua_phan.append(f"r{so}")
        elif verdict == "BLOCKED":
            tangs = ["bai-kiem-ha-tang"]
        ds_luot.append({"vong": so, "verdict": verdict, "tang": tangs})
        lam_lai += [{"nguon": f"r{so}", "tang": t} for t in tangs]
    for row in rows:
        if row.get("kind") == "repin-do":
            lam_lai.append({"nguon": f"repin-do:{row.get('lan_id', '')}", "tang": "bai-kiem-ha-tang"})

    theo_tang = {t: sum(1 for x in lam_lai if x["tang"] == t) for t in TANG}
    tv, gm = dong_cuoi(rows, "thuoc-vat"), dong_cuoi(rows, "gio-may")
    return {
        "schema": 1,
        "slug": slug,
        "ghi_luc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "vong_cham": len(luot),
        "luot": ds_luot,
        "lam_lai": lam_lai,
        "theo_tang": theo_tang,
        "chua_phan": chua_phan,
        "thuoc_vat": {k: tv.get(k) for k in ("vat", "thuoc", "nhat")} if tv else None,
        "gio_may": {k: gm.get(k) for k in ("gio_may", "gio_cho", "phan_tram_tuan")} if gm else None,
    }


# --- kiem ----------------------------------------------------------------------------------------


def kiem(root: Path) -> tuple[list[str], int]:
    loi: list[str] = []
    so_vong = 0
    for contract in sorted((root / "_acceptance").glob("*/contract.md")):
        ho_so = contract.parent
        slug = ho_so.name
        fm = frontmatter(contract)
        if fm.get("status") not in TRANG_THAI_DOI or not la_giao_dien(ho_so, fm):
            continue
        so_vong += 1
        chay = f" — chay: {LENH} ghi --slug {slug}"
        tep = ho_so / TEP_SO_DO
        if not tep.exists():
            loi.append(f"{slug}: vong giao dien {fm['status']} thieu ban so do{chay}")
            continue
        try:
            ban = json.loads(tep.read_text("utf-8"))
            sai = set(ban["theo_tang"]) != set(TANG)
            chua_phan, vong = list(ban["chua_phan"]), int(ban["vong_cham"])
        except (ValueError, KeyError, TypeError):
            loi.append(f"{slug}: ban so do hong{chay}")
            continue
        if sai:
            loi.append(f"{slug}: ban so do khong du 11 tang{chay}")
        if chua_phan:
            loi.append(f"{slug}: chua phan tang: {', '.join(chua_phan)}{chay} --phan <luot>=<tang>")
        trong_so = len(ket_qua_luot(doc_so_chay(ho_so / "run-log.jsonl")))
        if vong != trong_so:
            loi.append(f"{slug}: ban so do cu: {vong} luot, so chay co {trong_so}{chay}")
    return loi, so_vong


# --- kiem-moc ------------------------------------------------------------------------------------


def git(root: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True)


def moc_moi_nhat(root: Path) -> Path | None:
    found = sorted(p for p in (root / THU_MUC_MOC).glob("moc-*") if p.is_dir())
    return found[-1] if found else None


def cau_giao(text: str, heading: str) -> str:
    """Blockquote lines under a heading, joined, with whitespace collapsed."""
    lines, inside = [], False
    for line in text.splitlines():
        if line.startswith("## "):
            inside = line.strip() == heading
            continue
        if inside and line.startswith(">"):
            lines.append(line[1:])
    return " ".join(" ".join(lines).split())


def kiem_moc(root: Path) -> tuple[list[str], list[str]]:
    thu_muc = moc_moi_nhat(root)
    if thu_muc is None:
        return [f"khong co moc trong {THU_MUC_MOC}/moc-*"], []
    try:
        moc = json.loads((thu_muc / "moc.json").read_text("utf-8"))
    except (OSError, ValueError):
        return [f"moc.json hong hoac khong co: {thu_muc.relative_to(root)}/moc.json"], []
    loi, ghi_chu = [], []
    agents = moc.get("agent") or []
    if len(agents) != 3:
        loi.append(f"can dung 3 agent, moc co {len(agents)}")
    teps = [str(a.get("tep", "")) for a in agents]
    if len(set(teps)) != len(teps):
        loi.append("tep phuong an trung")
    de_bai_path = root / str(moc.get("de_bai", ""))
    de_bai = cau_giao(de_bai_path.read_text("utf-8"), "## Câu giao (chép nguyên văn cho cả ba agent)") if de_bai_path.is_file() else ""
    # The sent brief is kept with the machine path elided back to the brief's own placeholder,
    # so it must equal the fixed brief exactly, placeholder included.
    mong = de_bai
    for a in agents:
        tep = root / str(a.get("tep", ""))
        text = tep.read_text("utf-8") if tep.is_file() else ""
        if not text.strip():
            loi.append(f"tep phuong an rong: agent {a.get('so')}")
            continue
        if not mong or cau_giao(text, CAU_GIAO_DA_GUI) != mong:
            loi.append(f"cau giao khac de bai: agent {a.get('so')}")
    bang = root / str(moc.get("bang_so", ""))
    if not bang.is_file() or not bang.read_text("utf-8").strip():
        loi.append("thieu bang so")

    commit = str(moc.get("commit", ""))
    if git(root, "cat-file", "-e", f"{commit}^{{commit}}").returncode != 0:
        if git(root, "rev-parse", "--is-shallow-repository").stdout.strip() == "true":
            ghi_chu.append("kho nong: bo qua kiem lich su git")
        else:
            loi.append(f"commit khong co: {commit}")
        return loi, ghi_chu
    khung = git(root, "show", f"{commit}:{KHUNG_1A}")
    if khung.returncode == 0 and frontmatter_text(khung.stdout).get("status") in QUA_CONG:
        loi.append("do sau khi 1a gop")
    if git(root, "cat-file", "-e", f"{commit}:{THU_MUC_MOC}/{thu_muc.name}").returncode == 0:
        loi.append("ban kho co san phuong an")
    return loi, ghi_chu


# --- gop -----------------------------------------------------------------------------------------


def pt(so: int, tong: int) -> float | None:
    return round(100 * so / tong, 1) if tong else None


def gop(root: Path) -> dict:
    bans = []
    for tep in sorted((root / "_acceptance").glob(f"*/{TEP_SO_DO}")):
        try:
            bans.append(json.loads(tep.read_text("utf-8")))
        except ValueError:
            continue
    dem = {t: sum(int(b.get("theo_tang", {}).get(t, 0)) for b in bans) for t in TANG}
    tong = sum(dem.values())
    tong_sp = sum(v for t, v in dem.items() if t not in NGOAI_SAN_PHAM)
    quy_hang = (load_json(root / THU_MUC_MOC / "moc-quy-hang.json") or {}).get("theo_tang", {})
    tong_qh = sum(quy_hang.values())
    lam_lai = [
        {
            "tang": t,
            "so": dem[t],
            "pt_tat_ca": pt(dem[t], tong),
            "pt_doi_san_pham": None if t in NGOAI_SAN_PHAM else pt(dem[t], tong_sp),
            "pt_quy_hang": pt(int(quy_hang.get(t, 0)), tong_qh),
        }
        for t in TANG
    ]

    decisions = (load_yaml_file(root / "design" / "decisions.yaml") or {}).get("decisions") or []
    theo_lop: dict[str, list[int]] = {}
    for item in decisions:
        lop = str(item.get("layer") or "?")
        cell = theo_lop.setdefault(lop, [0, 0])
        cell[1] += 1
        check = item.get("check")
        if check and check_problem(root, str(item.get("id")), str(check)) is None:
            cell[0] += 1
    quyet_dinh = [{"tang": lop, "co_kiem": c[0], "tong": c[1]} for lop, c in theo_lop.items()]

    moc = None
    thu_muc = moc_moi_nhat(root)
    data = load_json(thu_muc / "moc.json") if thu_muc else None
    if data:
        bb = (data.get("ket_qua") or {}).get("bat_buoc") or {}
        moc = {
            "thu_muc": f"{THU_MUC_MOC}/{thu_muc.name}",
            "commit": data.get("commit"),
            "giong": bb.get("giong"),
            "giong_mang_loi": bb.get("giong_mang_loi"),
            "lech": bb.get("lech"),
            "tu_doan": [
                {"so": a.get("so"), "he": a.get("tu_doan_he"), "san_pham": a.get("tu_doan_san_pham")}
                for a in data.get("agent") or []
            ],
        }
    luot = [int(b.get("vong_cham", 0)) for b in bans]
    return {
        "vong": len(bans),
        "luot_cham_tb": round(sum(luot) / len(luot), 1) if luot else None,
        "tong": tong,
        "lam_lai": lam_lai,
        "quyet_dinh": quyet_dinh,
        "quyet_dinh_tong": {"co_kiem": sum(q["co_kiem"] for q in quyet_dinh), "tong": sum(q["tong"] for q in quyet_dinh)},
        "moc": moc,
    }


def load_json(path: Path) -> dict | None:
    try:
        data = json.loads(path.read_text("utf-8"))
    except (OSError, ValueError):
        return None
    return data if isinstance(data, dict) else None


def so(v: float | None) -> str:
    return "—" if v is None else f"{v}%"


def in_gop(r: dict) -> str:
    out = ["## Lam lai theo tang"]
    if not r["vong"]:
        out.append("chua co vong nao")
    else:
        out.append(f"{r['vong']} vong · {r['tong']} don vi · luot cham trung binh {r['luot_cham_tb']}")
    out.append("| tang | so | % tat ca | % doi san pham | % Quy hang |")
    out.append("|---|---|---|---|---|")
    for x in r["lam_lai"]:
        out.append(f"| {x['tang']} | {x['so']} | {so(x['pt_tat_ca'])} | {so(x['pt_doi_san_pham'])} | {so(x['pt_quy_hang'])} |")
    out += ["", "## Quyet dinh co kiem theo tang", "| tang | co kiem | tong |", "|---|---|---|"]
    out += [f"| {q['tang']} | {q['co_kiem']} | {q['tong']} |" for q in r["quyet_dinh"]]
    qt = r["quyet_dinh_tong"]
    out.append(f"| cong | {qt['co_kiem']} | {qt['tong']} |")
    out += ["", "## Moc ba agent"]
    m = r["moc"]
    if not m:
        out.append("chua co moc")
    else:
        out.append(f"{m['thu_muc']} (commit {str(m['commit'])[:7]}): giong {m['giong']} · giong mang loi {m['giong_mang_loi']} · lech {m['lech']}")
        out += [f"agent {a['so']}: tu doan he {a['he']} · san pham {a['san_pham']}" for a in m["tu_doan"]]
    return "\n".join(out)


# --- cli -----------------------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("lenh", choices=["ghi", "kiem", "kiem-moc", "gop"])
    ap.add_argument("--root", default=str(TOOLS.parent))
    ap.add_argument("--slug")
    ap.add_argument("--phan", action="append", default=[])
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    root = Path(a.root).resolve()

    if a.lenh == "ghi":
        if not a.slug:
            print("ghi can --slug", file=sys.stderr)
            return 1
        try:
            ban = ghi(root, a.slug, doc_phan(a.phan))
        except LoiDauVao as e:
            print(f"ghi: {e}", file=sys.stderr)
            return 1
        tep = root / "_acceptance" / a.slug / TEP_SO_DO
        tep.write_text(json.dumps(ban, ensure_ascii=False, indent=2) + "\n", "utf-8")
        print(f"ghi: {tep.relative_to(root)} · {ban['vong_cham']} luot · {len(ban['lam_lai'])} don vi lam lai")
        if ban["chua_phan"]:
            print(f"chua phan tang: {', '.join(ban['chua_phan'])}")
        return 0
    if a.lenh == "kiem":
        loi, so_vong = kiem(root)
        for line in loi:
            print(line)
        if not loi:
            print(f"kiem: {so_vong} vong giao dien, du ban so do")
        return 1 if loi else 0
    if a.lenh == "kiem-moc":
        loi, ghi_chu = kiem_moc(root)
        for line in ghi_chu + loi:
            print(line)
        if not loi:
            print("kiem-moc: moc hop le")
        return 1 if loi else 0
    r = gop(root)
    print(json.dumps(r, ensure_ascii=False, indent=2) if a.json else in_gop(r))
    return 0


if __name__ == "__main__":
    sys.exit(main())
