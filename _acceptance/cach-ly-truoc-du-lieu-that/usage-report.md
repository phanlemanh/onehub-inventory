### S4 round 1 — wf_d1f8aac5-3d9 (15 agent, 41,171 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 9 | 9,216 | 18 | 309,164 | 102 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,596 | 4 | 23,659 | 32 |
| review:measurement | claude-opus-5-5 | 5 | 4,805 | 10 | 111,384 | 53 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,051 | 6 | 39,226 | 63 |
| review:invariants | claude-opus-5-5 | 8 | 3,463 | 16 | 234,381 | 43 |
| machine:make e2e | claude-haiku-5-5 | 2 | 3,287 | 4 | 3,300 | 455 |
| machine:DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 2,512 | 4 | 15,236 | 74 |
| triage | claude-sonnet-5-5 | 2 | 2,001 | 4 | 13,777 | 17 |
| machine:make check | claude-haiku-5-5 | 2 | 1,575 | 4 | 15,103 | 35 |
| machine:npx vitest run src/modules/identity/one- | claude-haiku-5-5 | 2 | 1,004 | 4 | 15,155 | 6 |
| machine:npm run build | claude-haiku-5-5 | 2 | 994 | 4 | 15,107 | 11 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 846 | 4 | 11,476 | 8 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 834 | 4 | 15,092 | 9 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 643 | 4 | 15,094 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 344 | 4 | 10,616 | 5 |


wall: 555s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 17,484 | 654,929 | 103 | 02:34:42 | 02:36:25 |
| baseline | 1 | 4,051 | 39,226 | 63 | 02:34:42 | 02:35:45 |
| machine | 5 | 9,372 | 63,901 | 501 | 02:34:42 | 02:43:03 |
| judge | 3 | 2,323 | 41,662 | 11 | 02:34:42 | 02:34:53 |
| triage | 1 | 2,001 | 13,777 | 17 | 02:43:03 | 02:43:20 |
| capture | 1 | 344 | 10,616 | 5 | 02:43:20 | 02:43:25 |
| synthesize | 1 | 5,596 | 23,659 | 32 | 02:43:25 | 02:43:57 |

- **claude-opus-5-5**: 3 agent · 22 calls · out 17,484 · in 44 · cache_read 654,929 · cache_create 156,776
- **claude-sonnet-5-5**: 7 agent · 15 calls · out 14,315 · in 30 · cache_read 128,940 · cache_create 164,648
- **claude-haiku-5-5**: 5 agent · 10 calls · out 9,372 · in 20 · cache_read 63,901 · cache_create 77,864
