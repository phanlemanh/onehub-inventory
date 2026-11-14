"""Proof for a block made before the block ledger (row 2e, AC-10; Ngoài-3 of row 2c). Standard library only.

A pair of the ledger's `khoi_co_truoc:` list is exempt only when git shows it: the named commit exists, it adds the
block's file, its author day is the day written, and that day comes before the day the ledger itself was added.
A tree without git is read against the repo this tool lives in. A shallow copy (the CI checkout) first fetches the
missing history from its remote (owner ruling 2026-11-13, Hỏi-2 option b); when that fails the pair is red with the
reason. The root commit of a shallow copy is never read as
"adds every file", and its day is never taken as the day of the ledger.
"""

from __future__ import annotations

import subprocess
from dataclasses import dataclass, field
from pathlib import Path

LEDGER_PATH = "design/so-khoi.yaml"
TOOL_REPO = Path(__file__).resolve().parents[2]


def _git(root: Path, *args: str) -> tuple[int, str, str]:
    try:
        p = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True, check=False)
    except OSError as exc:  # git missing
        return 127, "", str(exc)
    return p.returncode, p.stdout.strip(), p.stderr.strip()


def _first_line(text: str) -> str:
    return next((ln.strip() for ln in text.splitlines() if ln.strip()), "không rõ lý do")


@dataclass
class History:
    """What git can tell about the repo at `root`, read once per run."""

    root: Path
    ok: bool = True
    why: str = ""
    prefix: str = ""
    shallow_tips: set[str] = field(default_factory=set)
    fetch_error: str = ""
    law_day: str | None = None
    law_why: str = ""

    @classmethod
    def read(cls, root: Path) -> "History":
        h = cls(root=root)
        rc, out, err = _git(root, "rev-parse", "--show-prefix")
        if rc != 0:
            # A plain copy of the tree (no .git): read the history of the repo this tool belongs to, never skip.
            h.root = TOOL_REPO
            rc, out, err2 = _git(h.root, "rev-parse", "--show-prefix")
            if rc != 0:
                h.ok, h.why = False, f"không đọc được git ở thư mục gốc ({_first_line(err)}) hay ở kho của công cụ ({_first_line(err2)})"
                return h
        h.prefix = out
        h._unshallow()
        h._read_law()
        return h

    def _shallow(self) -> bool:
        _, out, _ = _git(self.root, "rev-parse", "--is-shallow-repository")
        return out == "true"

    def _unshallow(self) -> None:
        if not self._shallow():
            return
        _, remotes, _ = _git(self.root, "remote")
        remote = "origin" if "origin" in remotes.split() else (remotes.split() or [""])[0]
        if not remote:
            self.fetch_error = "bản sao thiếu lịch sử và không có kho gốc để lấy"
        else:
            rc, _, err = _git(self.root, "fetch", "--quiet", "--no-tags", "--unshallow", remote)
            if rc != 0:
                self.fetch_error = f"bản sao thiếu lịch sử, lấy từ kho gốc '{remote}' không được ({_first_line(err)})"
        if self._shallow():
            _, gitdir, _ = _git(self.root, "rev-parse", "--git-path", "shallow")
            path = Path(gitdir) if Path(gitdir).is_absolute() else self.root / gitdir
            if path.is_file():
                self.shallow_tips = {ln.strip() for ln in path.read_text().splitlines() if ln.strip()}
            self.fetch_error = self.fetch_error or "bản sao vẫn thiếu lịch sử sau khi lấy"

    def _read_law(self) -> None:
        rc, out, err = _git(self.root, "log", "--diff-filter=A", "--format=%H %as", "--", self.prefix + LEDGER_PATH)
        lines = [ln.split() for ln in out.splitlines() if ln.strip()]
        if rc != 0 or not lines:
            self.law_why = f"không tìm thấy commit thêm {LEDGER_PATH}" + (f" ({_first_line(err)})" if err else "")
            return
        sha, day = lines[-1][0], lines[-1][1]
        if sha in self.shallow_tips:
            self.law_why = f"commit đầu của bản sao ({sha[:7]}) không phải commit thêm {LEDGER_PATH}; {self.fetch_error}"
            return
        self.law_day = day

    def check_pair(self, name: str, commit: str, day: str, tep: str) -> list[tuple[str, str]]:
        """Findings (code, text) for one exempt pair; empty when git proves it."""
        out: list[tuple[str, str]] = []
        if not self.ok:
            return [("so-mien-khong-lay-duoc-commit", f"khối {name}: {self.why}")]
        rc, sha, _ = _git(self.root, "rev-parse", "--verify", "--quiet", f"{commit}^{{commit}}")
        if rc != 0:
            if self.fetch_error:
                out.append(("so-mien-khong-lay-duoc-commit", f"khối {name}: commit {commit} không có trong bản sao — {self.fetch_error}"))
            else:
                out.append(("so-mien-commit-khong-co", f"khối {name}: commit {commit} không có trong lịch sử"))
            if self.law_day is None:
                out.append(("so-mien-khong-ro-ngay-luat", f"khối {name}: {self.law_why}"))
            return out
        if sha in self.shallow_tips:
            out.append(("so-mien-khong-co-cha", f"khối {name}: không lấy được cha của commit {commit} — {self.fetch_error}"))
        else:
            _, changed, _ = _git(
                self.root, "diff-tree", "--no-commit-id", "-r", "--name-status", "--root", "-m", "--first-parent", sha
            )
            added = {ln.split("\t", 1)[1] for ln in changed.splitlines() if ln.startswith("A\t")}
            if self.prefix + tep not in added:
                out.append(("so-mien-commit-khong-tao-tep", f"khối {name}: commit {commit} không thêm tệp '{tep}'"))
        _, real_day, _ = _git(self.root, "log", "-1", "--format=%as", sha)
        if real_day != day:
            out.append(("so-mien-ngay-lech", f"khối {name}: khai ngày {day}, commit {commit} ngày {real_day}"))
        if self.law_day is None:
            out.append(("so-mien-khong-ro-ngay-luat", f"khối {name}: {self.law_why}"))
        elif not real_day < self.law_day:
            out.append(("so-mien-sau-luat", f"khối {name}: commit {commit} ngày {real_day}, không trước ngày sổ khối ra đời {self.law_day}"))
        return out
