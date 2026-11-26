#!/usr/bin/env python3
"""Commit-message check: Conventional Commits, plus the fixed messages the acceptance kit writes.

  python3 tools/commit_msg.py <message-file>

The acceptance kit (delivery-loop v3.0.0) writes some commits itself, with subjects a repo cannot change: its
knowledge pages, the design floor of S3, the Gate 2 signature, a veto, a re-pin after the signature, and the
work-in-progress commit of a hand-over. Those subjects pass in their exact form, nothing looser.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

CONVENTIONAL = r"(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?: \S"
KIT = r"(tri-thuc: |design-floor S3: |Gate 2 signoff: [a-z0-9-]+ — \S|Veto: [a-z0-9-]+ — \S|repin\([a-z0-9-]+\): \S|wip\(ban-giao\): \S)"
GIT = r"(Merge |Revert \")"
ALLOWED = re.compile(rf"^({CONVENTIONAL}|{KIT}|{GIT})")


def is_allowed(message: str) -> bool:
    lines = [line for line in message.splitlines() if not line.startswith("#")]
    return bool(lines) and ALLOWED.match(lines[0]) is not None


def main() -> int:
    if is_allowed(Path(sys.argv[1]).read_text("utf-8")):
        return 0
    print("Commit message must follow Conventional Commits, for example `feat: add the listing grid`.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
