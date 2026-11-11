#!/usr/bin/env python3
"""Role × screen coverage check (roadmap row 1d, decision 0017). Standard library only.

  python3 tools/coverage_matrix/check.py [--root DIR]            # fails on any problem
  python3 tools/coverage_matrix/check.py [--root DIR] --report   # the pilot's numbers, never fails
  python3 tools/coverage_matrix/check.py [--root DIR] --report --json

The check fails when a page under src/app is not in design/screens.yaml, when the register or the
role list is wrong, or when a contract that needs the Vai × Màn block lacks it or leaves a cell out.
It only checks that every cell is filled; whether a cell is right is for the human at the scope gate.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from contracts import (
    BEFORE_BLOCK,
    COMPLETE,
    INCOMPLETE,
    NO_SCREENS,
    NOT_TOUCHED,
    Record,
    check_contracts,
)
from registry import load_registry

# Quỹ hàng baseline from decision 0017: contracts touching the UI that name both role and screen.
BASELINE = "33/98"


def percent(part: int, total: int) -> str:
    return f"{(part * 100 + total // 2) // total}%" if total else "—"


def summary(records: list[Record]) -> dict[str, object]:
    by_kind = {k: [r.slug for r in records if r.kind == k] for k in (COMPLETE, INCOMPLETE, BEFORE_BLOCK, NO_SCREENS, NOT_TOUCHED)}
    complete = [r for r in records if r.kind == COMPLETE]
    cells = sum(r.cells for r in complete)
    unrelated = sum(r.unrelated for r in complete)
    touched = sum(len(by_kind[k]) for k in (COMPLETE, INCOMPLETE, BEFORE_BLOCK, NO_SCREENS))
    return {
        "vong_cham_man": touched,
        "du_o": by_kind[COMPLETE],
        "thieu_o": by_kind[INCOMPLETE],
        "truoc_khoi": by_kind[BEFORE_BLOCK],
        "khong_khai_man": by_kind[NO_SCREENS],
        "khong_cham": by_kind[NOT_TOUCHED],
        "o_khong_lien_quan": unrelated,
        "tong_o": cells,
        "moc_quy_hang": BASELINE,
    }


def print_report(s: dict[str, object]) -> None:
    def n(key: str) -> int:
        return len(s[key])  # type: ignore[arg-type]

    print("Vai × Màn — số đo của đợt thử (quyết định 0017)")
    print(f"vòng chạm màn: {s['vong_cham_man']}")
    print(f"đủ ô: {n('du_o')}")
    print(f"thiếu ô: {n('thieu_o')}")
    print(f"trước khối: {n('truoc_khoi')}")
    print(f"không khai màn: {n('khong_khai_man')}")
    unrelated, cells = s["o_khong_lien_quan"], s["tong_o"]
    print(f"ô không liên quan: {unrelated}/{cells} ({percent(unrelated, cells)})")  # type: ignore[arg-type]
    print(f"mốc Quỹ hàng: {BASELINE}")
    for key, title in (("thieu_o", "thiếu ô"), ("truoc_khoi", "trước khối"), ("khong_khai_man", "không khai màn")):
        if s[key]:
            print(f"  {title}: {', '.join(s[key])}")  # type: ignore[arg-type]


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=str(Path(__file__).resolve().parents[2]))
    ap.add_argument("--report", action="store_true", help="print the pilot's numbers; never fails on contracts")
    ap.add_argument("--json", action="store_true", help="with --report, print JSON")
    args = ap.parse_args(argv)
    root = Path(args.root).resolve()

    reg = load_registry(root)
    records = check_contracts(root, reg)

    if args.report:
        s = summary(records)
        if args.json:
            print(json.dumps(s, ensure_ascii=False, indent=2))
        else:
            print_report(s)
        return 0

    errors = reg.errors + [e for r in records for e in r.errors]
    if errors:
        for e in errors:
            print(e)
        print(f"coverage-matrix: {len(errors)} problem(s)")
        return 1
    touched = sum(1 for r in records if r.kind != NOT_TOUCHED)
    print(
        f"coverage-matrix: ok ({len(reg.role_names)} roles, {len(reg.screens)} screens, "
        f"{len(reg.pages)} pages, {touched} contracts touching screens)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
