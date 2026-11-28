#!/usr/bin/env bash
# Every test of tools/deploy/ (record dat-khoa-cau-hoi-hien, AC-6), with the new test file named in the run.
# Exit 0 only when vitest passes and the report names dat-khoa-ask.test.ts with its one test passed.
set -u
cd "$(dirname "$0")/../../.."
out=$(npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose 2>&1); rc=$?
printf '%s\n' "$out"
[ $rc -eq 0 ] || exit $rc
printf '%s' "$out" | grep -q "dat-khoa-ask.test.ts > make dat-khoa — câu hỏi khoá còn hiện trên màn > in câu hỏi trên dòng riêng" \
  || { echo "bai-deploy: báo cáo không có ca của dat-khoa-ask.test.ts"; exit 1; }
echo "bai-deploy: tools/deploy xanh, có ca dat-khoa-ask"
