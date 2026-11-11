### S4 round 1 — wf_b05d42b9-94f (11 agent, 26,466 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 4 | 4,394 | 8 | 67,986 | 44 |
| synthesize:report | claude-sonnet-5-5 | 2 | 4,384 | 4 | 21,641 | 26 |
| review:invariants | claude-opus-5-5 | 8 | 4,308 | 18 | 207,786 | 51 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,258 | 6 | 35,571 | 61 |
| triage | claude-sonnet-5-5 | 2 | 2,990 | 4 | 14,475 | 22 |
| review:bugs | claude-opus-5-5 | 5 | 2,730 | 10 | 101,498 | 33 |
| machine:make test | claude-haiku-5-5 | 2 | 1,150 | 4 | 14,491 | 9 |
| machine:make e2e | claude-haiku-5-5 | 2 | 1,060 | 4 | 14,495 | 41 |
| machine:npm run build | claude-haiku-5-5 | 2 | 981 | 4 | 14,495 | 8 |
| machine:make check | claude-haiku-5-5 | 2 | 865 | 4 | 11,191 | 15 |
| capture:provenance | claude-sonnet-5-5 | 2 | 346 | 4 | 10,006 | 6 |


wall: 121s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 11,432 | 377,270 | 51 | 03:43:12 | 03:44:03 |
| baseline | 1 | 3,258 | 35,571 | 61 | 03:43:12 | 03:44:13 |
| machine | 4 | 4,056 | 54,672 | 64 | 03:43:12 | 03:44:16 |
| triage | 1 | 2,990 | 14,475 | 22 | 03:44:16 | 03:44:39 |
| capture | 1 | 346 | 10,006 | 6 | 03:44:39 | 03:44:45 |
| synthesize | 1 | 4,384 | 21,641 | 26 | 03:44:47 | 03:45:12 |

- **claude-opus-5-5**: 3 agent · 17 calls · out 11,432 · in 36 · cache_read 377,270 · cache_create 109,127
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 10,978 · in 18 · cache_read 81,693 · cache_create 87,755
- **claude-haiku-5-5**: 4 agent · 8 calls · out 4,056 · in 16 · cache_read 54,672 · cache_create 52,553
