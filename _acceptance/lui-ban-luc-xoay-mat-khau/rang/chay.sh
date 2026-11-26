#!/usr/bin/env bash
# lui-ban-luc-xoay-mat-khau: run the cases of tests/so-tay-lui-ban.test.ts that carry one eval id (E2, E4, E5).
set -euo pipefail
cd "$(dirname "$0")/../../.."
id="${1:?eval id, e.g. E2}"
exec npx vitest run tests/so-tay-lui-ban.test.ts --coverage.enabled=false --reporter=verbose -t "^${id} · "
