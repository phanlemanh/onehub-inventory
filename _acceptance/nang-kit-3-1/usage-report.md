### S4 round 1 — wf_7de12f64-746 (21 agent, 75,365 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 20 | 13,359 | 40 | 1,164,683 | 306 |
| review:invariants | claude-opus-5-5 | 20 | 12,133 | 40 | 1,077,939 | 328 |
| review:measurement | claude-opus-5-5 | 8 | 9,577 | 16 | 271,454 | 111 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,856 | 6 | 50,702 | 221 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,009 | 4 | 25,283 | 39 |
| machine:make check | claude-haiku-5-5 | 4 | 3,906 | 8 | 51,640 | 180 |
| machine:node --test _acceptance/nang-kit-3-1/ran | claude-haiku-5-5 | 4 | 3,404 | 8 | 54,995 | 189 |
| machine:DATABASE_URL= make e2e | claude-haiku-5-5 | 2 | 3,153 | 4 | 3,381 | 604 |
| machine:node _acceptance/nang-kit-3-1/rang/gate- | claude-haiku-5-5 | 4 | 3,065 | 8 | 55,340 | 128 |
| triage | claude-sonnet-5-5 | 2 | 3,037 | 4 | 15,846 | 22 |
| machine:node _acceptance/nang-kit-3-1/rang/gate- | claude-haiku-5-5 | 3 | 2,099 | 6 | 35,723 | 26 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,163 | 4 | 15,497 | 19 |
| refute:dot.mjs | claude-sonnet-5-5 | 3 | 1,098 | 6 | 30,503 | 10 |
| refute:dot.mjs | claude-sonnet-5-5 | 5 | 908 | 10 | 64,365 | 43 |
| machine:node _acceptance/nang-kit-3-1/rang/doc-c | claude-haiku-5-5 | 2 | 619 | 4 | 15,542 | 6 |
| machine:node _acceptance/nang-kit-3-1/rang/tro-l | claude-haiku-5-5 | 2 | 589 | 4 | 15,542 | 6 |
| machine:node _acceptance/nang-kit-3-1/rang/tag.m | claude-haiku-5-5 | 2 | 580 | 4 | 15,539 | 6 |
| machine:node _acceptance/nang-kit-3-1/rang/produ | claude-haiku-5-5 | 2 | 530 | 4 | 15,538 | 6 |
| machine:node _acceptance/nang-kit-3-1/rang/setti | claude-haiku-5-5 | 2 | 498 | 4 | 15,537 | 6 |
| machine:node _acceptance/nang-kit-3-1/rang/dot.m | claude-haiku-5-5 | 2 | 483 | 4 | 15,539 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 299 | 4 | 10,886 | 4 |


wall: 910s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 35,069 | 2,514,076 | 328 | 13:41:23 | 13:46:51 |
| baseline | 1 | 7,856 | 50,702 | 221 | 13:41:23 | 13:45:04 |
| machine | 12 | 20,089 | 309,813 | 802 | 13:41:23 | 13:54:45 |
| triage | 1 | 3,037 | 15,846 | 22 | 13:54:45 | 13:55:07 |
| refute | 2 | 2,006 | 94,868 | 43 | 13:55:07 | 13:55:50 |
| capture | 1 | 299 | 10,886 | 4 | 13:55:50 | 13:55:54 |
| synthesize | 1 | 7,009 | 25,283 | 39 | 13:55:54 | 13:56:33 |

- **claude-opus-5-5**: 3 agent · 48 calls · out 35,069 · in 96 · cache_read 2,514,076 · cache_create 229,817
- **claude-sonnet-5-5**: 6 agent · 17 calls · out 20,207 · in 34 · cache_read 197,585 · cache_create 139,508
- **claude-haiku-5-5**: 12 agent · 31 calls · out 20,089 · in 62 · cache_read 309,813 · cache_create 191,743

