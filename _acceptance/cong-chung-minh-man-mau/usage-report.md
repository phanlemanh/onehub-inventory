### S4 round 1 — wf_1a1421f9-d12 (16 agent, 47,162 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 12 | 8,681 | 24 | 372,584 | 99 |
| synthesize:report | claude-sonnet-5-5 | 3 | 7,547 | 6 | 71,245 | 43 |
| review:measurement | claude-opus-5-5 | 7 | 7,398 | 14 | 185,949 | 77 |
| review:conventions | claude-opus-5-5 | 9 | 4,727 | 18 | 257,096 | 55 |
| triage | claude-sonnet-5-5 | 2 | 4,235 | 4 | 20,815 | 33 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,271 | 6 | 36,269 | 54 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 1,827 | 4 | 14,990 | 15 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 1,823 | 4 | 14,988 | 15 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 1,653 | 4 | 11,372 | 14 |
| machine:make check | claude-haiku-5-5 | 2 | 1,536 | 4 | 14,798 | 49 |
| machine:make test | claude-haiku-5-5 | 2 | 1,253 | 4 | 14,798 | 38 |
| machine:make e2e | claude-haiku-5-5 | 2 | 917 | 4 | 14,802 | 83 |
| machine:npm run build | claude-haiku-5-5 | 2 | 845 | 4 | 14,802 | 11 |
| machine:R="${CLAUDE_PLUGIN_ROOT:-$(node tools/ki | claude-haiku-5-5 | 2 | 567 | 4 | 14,895 | 6 |
| refute:check.py | claude-sonnet-5-5 | 2 | 537 | 4 | 10,499 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 345 | 4 | 13,467 | 7 |


wall: 234s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,271 | 36,269 | 54 | 05:03:49 | 05:04:43 |
| review | 3 | 20,806 | 815,629 | 100 | 05:03:49 | 05:05:30 |
| judge | 3 | 5,303 | 41,350 | 17 | 05:03:49 | 05:04:07 |
| machine | 5 | 5,118 | 74,095 | 143 | 05:03:49 | 05:06:13 |
| triage | 1 | 4,235 | 20,815 | 33 | 05:06:13 | 05:06:46 |
| refute | 1 | 537 | 10,499 | 8 | 05:06:46 | 05:06:53 |
| capture | 1 | 345 | 13,467 | 7 | 05:06:53 | 05:07:00 |
| synthesize | 1 | 7,547 | 71,245 | 43 | 05:07:01 | 05:07:44 |

- **claude-opus-5-5**: 3 agent · 28 calls · out 20,806 · in 56 · cache_read 815,629 · cache_create 136,309
- **claude-sonnet-5-5**: 8 agent · 18 calls · out 21,238 · in 36 · cache_read 193,645 · cache_create 162,602
- **claude-haiku-5-5**: 5 agent · 10 calls · out 5,118 · in 20 · cache_read 74,095 · cache_create 62,539
### S4 round 2 — wf_861f3be9-2d1 (15 agent, 31,205 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 6,490 | 6 | 60,808 | 43 |
| review:conventions | claude-opus-5-5 | 10 | 4,796 | 20 | 205,148 | 71 |
| review:bugs | claude-opus-5-5 | 8 | 4,477 | 16 | 139,910 | 49 |
| review:measurement | claude-opus-5-5 | 5 | 3,184 | 10 | 72,620 | 37 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 1,695 | 4 | 14,977 | 13 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 1,585 | 4 | 11,361 | 14 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 1,546 | 4 | 14,979 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,419 | 4 | 14,493 | 13 |
| machine:make test | claude-haiku-5-5 | 2 | 1,374 | 4 | 14,787 | 39 |
| machine:make e2e | claude-haiku-5-5 | 2 | 1,064 | 4 | 14,791 | 56 |
| machine:npm run build | claude-haiku-5-5 | 2 | 925 | 4 | 14,791 | 8 |
| refute:check.py | claude-sonnet-5-5 | 3 | 896 | 6 | 29,410 | 11 |
| machine:make check | claude-haiku-5-5 | 2 | 824 | 4 | 14,787 | 45 |
| refute:check.py | claude-sonnet-5-5 | 2 | 591 | 4 | 10,618 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 339 | 4 | 10,299 | 6 |


wall: 186s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 12,457 | 417,678 | 71 | 05:10:12 | 05:11:23 |
| judge | 3 | 4,826 | 41,317 | 15 | 05:10:12 | 05:10:27 |
| machine | 4 | 4,187 | 59,156 | 110 | 05:10:12 | 05:12:01 |
| triage | 1 | 1,419 | 14,493 | 13 | 05:12:02 | 05:12:15 |
| refute | 2 | 1,487 | 40,028 | 13 | 05:12:15 | 05:12:28 |
| capture | 1 | 339 | 10,299 | 6 | 05:12:28 | 05:12:34 |
| synthesize | 1 | 6,490 | 60,808 | 43 | 05:12:35 | 05:13:17 |

- **claude-sonnet-5-5**: 8 agent · 18 calls · out 14,561 · in 36 · cache_read 166,945 · cache_create 166,863
- **claude-opus-5-5**: 3 agent · 23 calls · out 12,457 · in 46 · cache_read 417,678 · cache_create 73,040
- **claude-haiku-5-5**: 4 agent · 8 calls · out 4,187 · in 16 · cache_read 59,156 · cache_create 50,710
### S4 round 3 — wf_46564d8e-afe (13 agent, 31,658 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 7,087 | 6 | 62,773 | 47 |
| review:bugs | claude-opus-5-5 | 7 | 5,430 | 14 | 128,246 | 56 |
| review:conventions | claude-opus-5-5 | 8 | 3,207 | 16 | 159,678 | 46 |
| machine:make e2e | claude-haiku-5-5 | 2 | 3,011 | 4 | 14,784 | 58 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 1,895 | 4 | 14,970 | 15 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 1,802 | 4 | 14,972 | 14 |
| review:measurement | claude-opus-5-5 | 6 | 1,789 | 12 | 96,639 | 22 |
| triage | claude-sonnet-5-5 | 2 | 1,711 | 4 | 17,415 | 16 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 1,620 | 4 | 14,970 | 13 |
| machine:make check | claude-haiku-5-5 | 2 | 1,479 | 4 | 14,780 | 30 |
| machine:make test | claude-haiku-5-5 | 2 | 1,394 | 4 | 14,780 | 24 |
| machine:npm run build | claude-haiku-5-5 | 2 | 892 | 4 | 14,784 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 341 | 4 | 13,449 | 5 |


wall: 165s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 10,426 | 384,563 | 56 | 05:15:17 | 05:16:13 |
| machine | 4 | 6,776 | 59,128 | 96 | 05:15:17 | 05:16:53 |
| judge | 3 | 5,317 | 44,912 | 16 | 05:15:17 | 05:15:33 |
| triage | 1 | 1,711 | 17,415 | 16 | 05:16:53 | 05:17:09 |
| capture | 1 | 341 | 13,449 | 5 | 05:17:09 | 05:17:14 |
| synthesize | 1 | 7,087 | 62,773 | 47 | 05:17:15 | 05:18:02 |

- **claude-sonnet-5-5**: 6 agent · 13 calls · out 14,456 · in 26 · cache_read 138,549 · cache_create 128,430
- **claude-opus-5-5**: 3 agent · 21 calls · out 10,426 · in 42 · cache_read 384,563 · cache_create 70,126
- **claude-haiku-5-5**: 4 agent · 8 calls · out 6,776 · in 16 · cache_read 59,128 · cache_create 50,644
