### S4 round 1 — wf_e0ccb727-0b5 (11 agent, 31,540 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 5,473 | 4 | 23,578 | 34 |
| review:measurement | claude-opus-5-5 | 4 | 4,907 | 8 | 72,722 | 56 |
| review:bugs | claude-opus-5-5 | 10 | 4,026 | 20 | 233,858 | 70 |
| review:conventions | claude-opus-5-5 | 9 | 3,910 | 18 | 201,280 | 64 |
| machine:npx vitest run tools/proof_gate --covera | claude-haiku-5-5 | 2 | 3,437 | 4 | 15,856 | 22 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,010 | 6 | 36,870 | 35 |
| triage | claude-sonnet-5-5 | 2 | 2,509 | 4 | 15,431 | 18 |
| machine:make check | claude-haiku-5-5 | 2 | 1,759 | 4 | 12,511 | 13 |
| machine:make e2e | claude-haiku-5-5 | 2 | 1,112 | 4 | 3,300 | 494 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,049 | 4 | 15,815 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 348 | 4 | 11,325 | 4 |


wall: 572s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 12,843 | 507,860 | 71 | 15:20:37 | 15:21:48 |
| machine | 4 | 7,357 | 47,482 | 515 | 15:20:37 | 15:29:12 |
| baseline | 1 | 3,010 | 36,870 | 35 | 15:20:37 | 15:21:12 |
| triage | 1 | 2,509 | 15,431 | 19 | 15:29:12 | 15:29:31 |
| capture | 1 | 348 | 11,325 | 4 | 15:29:31 | 15:29:34 |
| synthesize | 1 | 5,473 | 23,578 | 34 | 15:29:35 | 15:30:09 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 11,340 · in 18 · cache_read 87,204 · cache_create 92,183
- **claude-opus-5-5**: 3 agent · 23 calls · out 12,843 · in 46 · cache_read 507,860 · cache_create 103,184
- **claude-haiku-5-5**: 4 agent · 8 calls · out 7,357 · in 16 · cache_read 47,482 · cache_create 69,937
