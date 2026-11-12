### S4 round 1 — wf_14c17c4c-84d (14 agent, 30,010 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 6,414 | 4 | 22,877 | 38 |
| review:invariants | claude-opus-5-5 | 9 | 5,211 | 18 | 266,964 | 58 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 2,825 | 6 | 50,683 | 52 |
| review:bugs | claude-opus-5-5 | 7 | 2,317 | 14 | 154,659 | 28 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 1,744 | 8 | 47,187 | 17 |
| triage | claude-sonnet-5-5 | 2 | 1,616 | 4 | 13,330 | 14 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 1,603 | 8 | 47,193 | 15 |
| review:measurement | claude-opus-5-5 | 3 | 1,550 | 8 | 42,711 | 17 |
| machine:make test | claude-haiku-5-5 | 2 | 1,531 | 4 | 23,614 | 44 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,530 | 8 | 47,187 | 15 |
| machine:make check | claude-haiku-5-5 | 2 | 1,329 | 4 | 23,614 | 54 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,044 | 4 | 15,111 | 9 |
| machine:make e2e | claude-haiku-5-5 | 2 | 955 | 4 | 15,111 | 226 |
| capture:provenance | claude-sonnet-5-5 | 2 | 341 | 4 | 10,617 | 5 |


wall: 346s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,825 | 50,683 | 52 | 02:17:04 | 02:17:56 |
| review | 3 | 9,078 | 464,334 | 59 | 02:17:04 | 02:18:03 |
| judge | 3 | 4,877 | 141,567 | 17 | 02:17:04 | 02:17:21 |
| machine | 4 | 4,859 | 77,450 | 289 | 02:17:04 | 02:21:53 |
| triage | 1 | 1,616 | 13,330 | 14 | 02:21:53 | 02:22:07 |
| capture | 1 | 341 | 10,617 | 5 | 02:22:07 | 02:22:12 |
| synthesize | 1 | 6,414 | 22,877 | 38 | 02:22:12 | 02:22:50 |

- **claude-sonnet-5-5**: 7 agent · 18 calls · out 16,073 · in 42 · cache_read 239,074 · cache_create 112,682
- **claude-opus-5-5**: 3 agent · 19 calls · out 9,078 · in 40 · cache_read 464,334 · cache_create 107,041
- **claude-haiku-5-5**: 4 agent · 8 calls · out 4,859 · in 16 · cache_read 77,450 · cache_create 34,702
### S4 round 2 — wf_373aa66e-9e5 (13 agent, 30,826 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:invariants | claude-opus-5-5 | 10 | 6,917 | 20 | 359,520 | 74 |
| synthesize:report | claude-sonnet-5-5 | 3 | 5,794 | 6 | 54,797 | 38 |
| machine:make e2e | claude-haiku-5-5 | 2 | 3,141 | 4 | 15,091 | 218 |
| review:measurement | claude-opus-5-5 | 4 | 2,044 | 10 | 60,989 | 21 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 2,041 | 8 | 39,168 | 17 |
| machine:make test | claude-haiku-5-5 | 2 | 1,854 | 4 | 15,087 | 30 |
| triage | claude-sonnet-5-5 | 2 | 1,785 | 4 | 13,577 | 14 |
| machine:make check | claude-haiku-5-5 | 2 | 1,587 | 4 | 15,087 | 38 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 1,533 | 8 | 39,172 | 14 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,416 | 8 | 35,552 | 13 |
| review:bugs | claude-opus-5-5 | 4 | 1,406 | 8 | 60,419 | 16 |
| machine:npm run build | claude-haiku-5-5 | 2 | 978 | 4 | 15,091 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 330 | 4 | 10,597 | 5 |


wall: 321s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 4 | 7,560 | 60,356 | 264 | 02:26:59 | 02:31:23 |
| review | 3 | 10,367 | 480,928 | 74 | 02:26:59 | 02:28:13 |
| judge | 3 | 4,990 | 113,892 | 19 | 02:26:59 | 02:27:18 |
| triage | 1 | 1,785 | 13,577 | 14 | 02:31:23 | 02:31:37 |
| capture | 1 | 330 | 10,597 | 5 | 02:31:37 | 02:31:42 |
| synthesize | 1 | 5,794 | 54,797 | 38 | 02:31:42 | 02:32:20 |

- **claude-opus-5-5**: 3 agent · 18 calls · out 10,367 · in 38 · cache_read 480,928 · cache_create 109,986
- **claude-sonnet-5-5**: 6 agent · 16 calls · out 12,899 · in 38 · cache_read 192,863 · cache_create 133,970
- **claude-haiku-5-5**: 4 agent · 8 calls · out 7,560 · in 16 · cache_read 60,356 · cache_create 52,651
