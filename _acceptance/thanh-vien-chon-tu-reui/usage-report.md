### S4 round 1 — wf_749bb17f-011 (18 agent, 53,301 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 7,606 | 4 | 27,776 | 42 |
| review:measurement | claude-opus-5-5 | 5 | 6,402 | 10 | 121,780 | 88 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 5,867 | 6 | 18,408 | 367 |
| machine:make e2e | claude-haiku-5-5 | 7 | 5,449 | 14 | 89,517 | 886 |
| review:bugs | claude-opus-5-5 | 14 | 3,931 | 28 | 449,349 | 105 |
| machine:npx vitest run tools/proof_gate --covera | claude-haiku-5-5 | 2 | 3,484 | 4 | 15,637 | 29 |
| review:conventions | claude-opus-5-5 | 7 | 2,677 | 16 | 168,434 | 59 |
| machine:DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 2,668 | 4 | 15,735 | 259 |
| ui:E12 | claude-sonnet-5-5 | 4 | 2,510 | 8 | 268,550 | 18 |
| ui:E7 | claude-sonnet-5-5 | 3 | 2,226 | 6 | 143,283 | 17 |
| machine:DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 1,965 | 4 | 15,703 | 151 |
| triage | claude-sonnet-5-5 | 2 | 1,962 | 4 | 14,986 | 17 |
| machine:make check | claude-haiku-5-5 | 2 | 1,751 | 4 | 12,292 | 18 |
| machine:npx vitest run tests/framed-list.test.ts | claude-haiku-5-5 | 2 | 1,692 | 4 | 15,698 | 9 |
| refute:thanh-vien-khoa-bai.test.ts | claude-sonnet-5-5 | 3 | 1,060 | 6 | 27,990 | 9 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,030 | 4 | 15,735 | 12 |
| machine:R="${CLAUDE_PLUGIN_ROOT:-$(node tools/ki | claude-haiku-5-5 | 2 | 676 | 4 | 15,689 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 345 | 4 | 11,425 | 4 |


wall: 989s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,867 | 18,408 | 367 | 13:47:20 | 13:53:27 |
| review | 3 | 13,010 | 739,563 | 106 | 13:47:20 | 13:49:07 |
| machine | 8 | 18,715 | 196,006 | 916 | 13:47:20 | 14:02:37 |
| ui | 2 | 4,736 | 411,833 | 36 | 13:47:20 | 13:47:56 |
| triage | 1 | 1,962 | 14,986 | 17 | 14:02:37 | 14:02:54 |
| refute | 1 | 1,060 | 27,990 | 9 | 14:02:54 | 14:03:03 |
| capture | 1 | 345 | 11,425 | 4 | 14:03:03 | 14:03:07 |
| synthesize | 1 | 7,606 | 27,776 | 42 | 14:03:07 | 14:03:50 |

- **claude-sonnet-5-5**: 7 agent · 19 calls · out 21,576 · in 38 · cache_read 512,418 · cache_create 278,107
- **claude-opus-5-5**: 3 agent · 26 calls · out 13,010 · in 54 · cache_read 739,563 · cache_create 120,575
- **claude-haiku-5-5**: 8 agent · 21 calls · out 18,715 · in 42 · cache_read 196,006 · cache_create 126,009
### S4 round 2 — wf_93418862-0e7 (12 agent, 25,964 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 5,981 | 6 | 65,981 | 38 |
| review:measurement | claude-opus-5-5 | 7 | 4,028 | 14 | 126,158 | 57 |
| machine:make e2e | claude-haiku-5-5 | 4 | 3,570 | 8 | 35,332 | 664 |
| machine:DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 2,672 | 4 | 15,744 | 178 |
| machine:DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 1,847 | 4 | 15,712 | 49 |
| review:bugs | claude-opus-5-5 | 4 | 1,696 | 8 | 54,641 | 28 |
| machine:npx vitest run tests/framed-list.test.ts | claude-haiku-5-5 | 2 | 1,694 | 4 | 15,707 | 8 |
| machine:make check | claude-haiku-5-5 | 2 | 1,616 | 4 | 15,601 | 62 |
| machine:npm run build | claude-haiku-5-5 | 2 | 974 | 4 | 15,605 | 9 |
| triage | claude-sonnet-5-5 | 2 | 853 | 4 | 13,529 | 8 |
| review:conventions | claude-opus-5-5 | 3 | 604 | 6 | 32,147 | 11 |
| capture:provenance | claude-sonnet-5-5 | 2 | 429 | 4 | 11,115 | 5 |


wall: 786s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 6 | 12,373 | 113,701 | 735 | 14:06:37 | 14:18:52 |
| review | 3 | 6,328 | 212,946 | 59 | 14:06:37 | 14:07:36 |
| triage | 1 | 853 | 13,529 | 8 | 14:18:52 | 14:19:00 |
| capture | 1 | 429 | 11,115 | 5 | 14:19:00 | 14:19:05 |
| synthesize | 1 | 5,981 | 65,981 | 38 | 14:19:05 | 14:19:43 |

- **claude-sonnet-5-5**: 3 agent · 7 calls · out 7,263 · in 14 · cache_read 90,625 · cache_create 78,719
- **claude-opus-5-5**: 3 agent · 14 calls · out 6,328 · in 28 · cache_read 212,946 · cache_create 61,277
- **claude-haiku-5-5**: 6 agent · 14 calls · out 12,373 · in 28 · cache_read 113,701 · cache_create 93,402
