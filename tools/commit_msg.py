#!/usr/bin/env python3
"""Commit-message check: Conventional Commits, plus the fixed messages the acceptance kit writes.

  python3 tools/commit_msg.py <message-file>

The kit commits regenerated files and knowledge pages itself with messages it does not let a repo change.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

CONVENTIONAL = r"(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?: \S"
KIT = r"(tri-thuc: |design-floor S3: )"
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
