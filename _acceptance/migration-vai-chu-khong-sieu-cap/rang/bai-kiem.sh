#!/usr/bin/env bash
# Bài kiểm sẵn có của PR #135 (tests/db/chu-khong-sieu-cap.db.test.ts) trên cụm riêng Postgres 16 của chính nó
# (tests/db/rieng-cum.ts), như CI chạy. Hồ sơ migration-vai-chu-khong-sieu-cap, AC-8.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../../.."
exec npx vitest run -c vitest.db.config.ts tests/db/chu-khong-sieu-cap.db.test.ts --reporter=verbose
