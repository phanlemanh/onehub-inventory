#!/usr/bin/env python3
"""Measures of the dua-deploy-yml-len-main record.

Usage (from the repository root):
  python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py E1|E2|E3|E4|E7 [--base <ref>] [--head <ref>]
  python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py --tu-kiem

Each measure is a pure function over texts (or a path list), so --tu-kiem runs it on the sound
object (must pass) and on a broken copy (must fail with its pinned message).
Needs PyYAML (no YAML parser ships in node_modules). The repository root is derived from this file's location, never hard-coded.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[3]
DEPLOY = ROOT / ".github/workflows/deploy.yml"
RELEASE = ROOT / ".github/workflows/release.yml"
RUNBOOK = ROOT / "docs/van-hanh/README.md"
# Commit that signed dat-khoa-mot-lenh (Gate 2, 2026-11-22): the runbook block as it was signed.
SIGNED_AT = "182ca5b3"
REPO = "phanlemanh/onehub-inventory"
OWNER_LOGIN = "phanlemanh"
ALLOWED_OUTSIDE_RECORD = {".github/workflows/deploy.yml"}
# Files the machine writes because a new acceptance record exists (drawn, never hand-edited).
DRAWN = {"PRODUCT-MAP.md", "LO-TRINH.html"}


class Red(Exception):
    pass


def runbook_block(runbook: str) -> str:
    lines = runbook.split("\n")
    start = next((i for i, l in enumerate(lines) if "**Phần hai — tệp `deploy.yml`.**" in l), None)
    if start is None:
        raise Red("sổ tay không có mục «Phần hai — tệp deploy.yml»")
    fence = next((i for i in range(start, len(lines)) if lines[i].strip() == "```yaml"), None)
    if fence is None:
        raise Red("sổ tay không có khối ```yaml dưới «Phần hai»")
    indent = len(lines[fence]) - len(lines[fence].lstrip())
    body = []
    for l in lines[fence + 1:]:
        if l.strip() == "```" and len(l) - len(l.lstrip()) == indent:
            return "\n".join(body)
        body.append(l[indent:] if l[:indent].strip() == "" else l)
    raise Red("khối ```yaml của sổ tay không đóng")


def norm(text: str) -> list:
    out = [l.rstrip() for l in text.split("\n")]
    while out and out[-1] == "":
        out.pop()
    return out


def e1(deploy: str, runbook: str) -> str:
    a, b = norm(deploy), norm(runbook_block(runbook))
    for n, (x, y) in enumerate(zip(a, b), 1):
        if x != y:
            raise Red(f"deploy.yml lệch khối sổ tay ở dòng {n}")
    if len(a) != len(b):
        raise Red(f"deploy.yml lệch khối sổ tay ở dòng {min(len(a), len(b)) + 1}")
    return f"E1 ok: deploy.yml bằng khối sổ tay việc 9 ({len(a)} dòng)"


def e1_pin(runbook_now: str, runbook_signed: str) -> str:
    if norm(runbook_block(runbook_now)) != norm(runbook_block(runbook_signed)):
        raise Red(f"khối sổ tay đã đổi sau khi ký ({SIGNED_AT})")
    return f"E1 ok: khối sổ tay ở HEAD bằng khối lúc ký dat-khoa-mot-lenh ({SIGNED_AT})"


def e2(deploy: str, release: str) -> str:
    d = yaml.safe_load(deploy)
    on = d.get("on", d.get(True))  # PyYAML reads the bare key `on` as True
    if not isinstance(on, dict) or set(on) != {"workflow_call", "workflow_dispatch"}:
        raise Red("deploy.yml: cò kích hoạt phải đúng workflow_call và workflow_dispatch")
    if d.get("permissions") != {"contents": "read"}:
        raise Red("deploy.yml: quyền phải đúng contents: read")
    jobs = d.get("jobs") or {}
    if set(jobs) != {"staging", "production"}:
        raise Red("deploy.yml: việc phải đúng staging và production")
    st, pr = jobs["staging"], jobs["production"]
    if st.get("if") != "vars.DEPLOY_ENABLED == 'true'":
        raise Red("deploy.yml: staging không chặn bằng vars.DEPLOY_ENABLED == 'true'")
    if st.get("environment") != "staging":
        raise Red("deploy.yml: staging không chạy trong môi trường staging")
    if pr.get("needs") != "staging":
        raise Red("deploy.yml: production không chờ staging")
    if pr.get("environment") != "production":
        raise Red("deploy.yml: production không chạy trong môi trường production")
    for name, job in (("staging", st), ("production", pr)):
        runs = [s.get("run") for s in job.get("steps", []) if "run" in s]
        if not runs or runs[-1] != f"make deploy ENV={name}":
            raise Red(f"deploy.yml: bước cuối của {name} không phải make deploy ENV={name}")
    r = yaml.safe_load(release)
    callers = [j for j in (r.get("jobs") or {}).values() if j.get("uses") == "./.github/workflows/deploy.yml"]
    if len(callers) != 1:
        raise Red(f"release.yml gọi deploy.yml {len(callers)} lần")
    return "E2 ok: hai việc staging → production, chặn bằng DEPLOY_ENABLED, release.yml gọi một lần"


def table_rows(runbook: str) -> dict:
    sec = runbook.split("## Bảng biến", 1)
    if len(sec) != 2:
        raise Red("sổ tay không có mục «Bảng biến»")
    rows, tail = {}, sec[1]
    for l in tail.split("\n"):
        m = re.match(r"\|\s*`([A-Z0-9_]+)`\s*\|([^|]*)\|", l)
        if m:
            rows[m.group(1)] = m.group(2)
    return rows, tail


def e3(deploy: str, runbook: str) -> str:
    rows, tail = table_rows(runbook)
    jobs = yaml.safe_load(deploy).get("jobs") or {}
    total = set()
    for job_name, job in jobs.items():
        names = sorted(set(re.findall(r"\b(secrets|vars)\.([A-Z0-9_]+)", json.dumps(job))))
        for kind, name in names:
            total.add(name)
            if name not in rows:
                if kind == "vars" and f"`{name}`" in tail:
                    continue  # repository variable named under the table (DEPLOY_ENABLED)
                raise Red(f"{name} không có trong bảng biến")
            cell = rows[name]
            if kind == "secrets" and "khoá" not in cell:
                raise Red(f"{name} không phải khoá của môi trường")
            if not any(k in cell for k in ("cả hai môi trường", "mỗi môi trường", f"môi trường `{job_name}`")):
                if kind == "secrets":
                    raise Red(f"{name} không phải khoá của môi trường")
                raise Red(f"{name} không đặt ở môi trường {job_name}")
    return f"E3 ok: {len(total)} tên đều có trong bảng biến, mỗi tên đặt ở đúng môi trường của việc đọc nó"


def e4(paths: list) -> str:
    for p in paths:
        if p.startswith("_acceptance/") or p in ALLOWED_OUTSIDE_RECORD or p in DRAWN:
            continue
        raise Red(f"PR chạm tệp ngoài phạm vi: {p}")
    if ".github/workflows/deploy.yml" not in paths:
        raise Red("PR không chạm .github/workflows/deploy.yml")
    return f"E4 ok: ngoài hồ sơ chỉ đổi deploy.yml ({len(paths)} tệp)"


def e7(env: dict) -> str:
    rules = env.get("protection_rules") or []
    reviewers = [r.get("reviewer", {}).get("login") for rule in rules if rule.get("type") == "required_reviewers"
                 for r in rule.get("reviewers", [])]
    if OWNER_LOGIN not in reviewers:
        raise Red("production không có người duyệt bắt buộc")
    return f"E7 ok: môi trường production có người duyệt bắt buộc ({', '.join(reviewers)})"


def production_env() -> dict:
    out = subprocess.run(["gh", "api", f"repos/{REPO}/environments/production"], capture_output=True, text=True)
    if out.returncode != 0:
        raise Red("không đọc được môi trường production: " + (out.stderr.strip() or out.stdout.strip()))
    return json.loads(out.stdout)


def changed(base: str, head: str = "HEAD") -> list:
    # E4 measures the PR's own span. Once the PR is on main (squashed), base...HEAD on any other branch holds that
    # branch's files, and on main it is empty — so evals.yaml pins the span: --base <parent> --head <squash commit>
    # (VP10, ruling G-2811-45).
    out = subprocess.run(["git", "-C", str(ROOT), "diff", "--name-only", f"{base}...{head}"],
                         capture_output=True, text=True, check=True).stdout
    return [l for l in out.split("\n") if l]


def signed_runbook() -> str:
    return subprocess.run(["git", "-C", str(ROOT), "show", f"{SIGNED_AT}:docs/van-hanh/README.md"],
                          capture_output=True, text=True, check=True).stdout


def tu_kiem() -> None:
    dep, rel, rb = DEPLOY.read_text(), RELEASE.read_text(), RUNBOOK.read_text()
    signed = signed_runbook()
    env_ok = {"protection_rules": [{"type": "required_reviewers", "reviewers": [{"reviewer": {"login": OWNER_LOGIN}}]},
                                   {"type": "branch_policy"}]}
    cases = [
        ("E1 xanh", lambda: e1(dep, rb), None),
        ("E1 đỏ · sửa một dòng", lambda: e1(dep.replace("timeout-minutes: 30", "timeout-minutes: 31", 1), rb),
         "deploy.yml lệch khối sổ tay ở dòng"),
        ("E1 đỏ · thêm dòng cuối", lambda: e1(dep + "# extra\n", rb), "deploy.yml lệch khối sổ tay ở dòng"),
        ("E1 xanh · khối lúc ký", lambda: e1_pin(rb, signed), None),
        ("E1 đỏ · khối đổi sau khi ký", lambda: e1_pin(rb.replace("timeout-minutes: 30", "timeout-minutes: 99", 1), signed),
         "khối sổ tay đã đổi sau khi ký"),
        ("E1 xanh · khoảng trắng cuối dòng", lambda: e1(dep.replace("\n", "  \n"), rb), None),
        ("E2 xanh", lambda: e2(dep, rel), None),
        ("E2 đỏ · bỏ chặn DEPLOY_ENABLED", lambda: e2(dep.replace("    if: vars.DEPLOY_ENABLED == 'true'\n", ""), rel),
         "staging không chặn bằng vars.DEPLOY_ENABLED"),
        ("E2 đỏ · production không chờ", lambda: e2(dep.replace("    needs: staging\n", ""), rel),
         "production không chờ staging"),
        ("E2 đỏ · production sai môi trường",
         lambda: e2(dep.replace("environment: production", "environment: staging"), rel),
         "production không chạy trong môi trường production"),
        ("E2 đỏ · thêm việc thứ ba", lambda: e2(dep + "  extra:\n    runs-on: ubuntu-latest\n    steps: []\n", rel),
         "việc phải đúng staging và production"),
        ("E2 đỏ · quyền nới", lambda: e2(dep.replace("  contents: read\n", "  contents: write\n", 1), rel),
         "quyền phải đúng contents: read"),
        ("E2 đỏ · bỏ cò workflow_dispatch", lambda: e2(dep.replace("  workflow_dispatch:\n", "", 1), rel),
         "cò kích hoạt phải đúng workflow_call và workflow_dispatch"),
        ("E2 đỏ · staging sai môi trường", lambda: e2(dep.replace("environment: staging", "environment: production", 1), rel),
         "staging không chạy trong môi trường staging"),
        ("E2 đỏ · bước cuối sai ENV", lambda: e2(dep.replace("make deploy ENV=production", "make deploy ENV=staging"), rel),
         "bước cuối của production không phải make deploy ENV=production"),
        ("E2 đỏ · release.yml gọi hai lần",
         lambda: e2(dep, rel + "\n  deploy2:\n    uses: ./.github/workflows/deploy.yml\n"),
         "release.yml gọi deploy.yml 2 lần"),
        ("E2 đỏ · release.yml không gọi", lambda: e2(dep, rel.replace("uses: ./.github/workflows/deploy.yml", "uses: ./x.yml")),
         "release.yml gọi deploy.yml 0 lần"),
        ("E3 xanh", lambda: e3(dep, rb), None),
        ("E3 đỏ · tên lạ", lambda: e3(dep.replace("secrets.AUTH_SECRET", "secrets.LOGIN_DATABASE_URL", 1), rb),
         "LOGIN_DATABASE_URL không có trong bảng biến"),
        ("E3 đỏ · khoá không của môi trường",
         lambda: e3(dep, rb.replace("| GitHub, khoá của cả hai môi trường (`make dat-khoa`); máy chủ kho                           |",
                                    "| GitHub, khoá của kho; máy chủ kho |", 1)),
         "VERCEL_TOKEN không phải khoá của môi trường"),
        ("E3 đỏ · biến của production đọc ở staging",
         lambda: e3(dep.replace("          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}\n\n",
                                "          STAGING_APP_URL: ${{ vars.STAGING_APP_URL }}\n          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}\n\n", 1), rb),
         "STAGING_APP_URL không đặt ở môi trường staging"),
        ("E7 xanh", lambda: e7(env_ok), None),
        ("E7 đỏ · không người duyệt", lambda: e7({"protection_rules": [{"type": "branch_policy"}]}),
         "production không có người duyệt bắt buộc"),
        ("E7 đỏ · người duyệt khác", lambda: e7({"protection_rules": [{"type": "required_reviewers", "reviewers": [{"reviewer": {"login": "someone"}}]}]}),
         "production không có người duyệt bắt buộc"),
        ("E4 xanh", lambda: e4([".github/workflows/deploy.yml", "_acceptance/x/contract.md", "PRODUCT-MAP.md"]), None),
        ("E4 đỏ · chạm mã", lambda: e4([".github/workflows/deploy.yml", "src/app/page.tsx"]),
         "PR chạm tệp ngoài phạm vi: src/app/page.tsx"),
        ("E4 đỏ · không chạm deploy.yml", lambda: e4(["_acceptance/x/contract.md"]), "PR không chạm .github/workflows/deploy.yml"),
    ]
    bad = 0
    for name, fn, want in cases:
        try:
            msg = fn()
            ok = want is None
            got = msg
        except Red as e:
            got = str(e)
            ok = want is not None and want in got
        print(f"{'pass' if ok else 'FAIL'} · {name} · {got}")
        bad += 0 if ok else 1
    print(f"tu-kiem: {len(cases) - bad}/{len(cases)} ca đúng")
    sys.exit(1 if bad else 0)


def main() -> None:
    args = sys.argv[1:]
    if args == ["--tu-kiem"]:
        tu_kiem()
    base = "origin/main"
    if "--base" in args:
        base = args[args.index("--base") + 1]
    head = "HEAD"
    if "--head" in args:
        head = args[args.index("--head") + 1]
    mode = args[0] if args else ""
    try:
        if mode == "E1":
            print(e1(DEPLOY.read_text(), RUNBOOK.read_text()))
            print(e1_pin(RUNBOOK.read_text(), signed_runbook()))
        elif mode == "E2":
            print(e2(DEPLOY.read_text(), RELEASE.read_text()))
        elif mode == "E3":
            print(e3(DEPLOY.read_text(), RUNBOOK.read_text()))
        elif mode == "E7":
            print(e7(production_env()))
        elif mode == "E4":
            print(e4(changed(base, head)))
        else:
            print(__doc__)
            sys.exit(2)
    except Red as e:
        print(f"{mode} đỏ: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
