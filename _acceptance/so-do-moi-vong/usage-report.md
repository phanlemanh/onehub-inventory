### S4 round 1 — wf_7ecde66e-ddd (15 agent, 75,169 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 29 | 17,675 | 60 | 1,686,889 | 199 |
| review:measurement | claude-opus-5-5 | 5 | 10,575 | 10 | 108,175 | 106 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,092 | 4 | 28,071 | 49 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 2 | 7,561 | 4 | 15,184 | 56 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 3 | 6,174 | 6 | 85,281 | 47 |
| review:invariants | claude-opus-5-5 | 12 | 5,488 | 24 | 349,888 | 69 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 2 | 5,383 | 4 | 11,566 | 41 |
| triage | claude-sonnet-5-5 | 2 | 3,674 | 4 | 16,251 | 27 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 2,745 | 6 | 34,820 | 31 |
| machine:make e2e | claude-haiku-5-5 | 2 | 1,892 | 4 | 14,816 | 13 |
| machine:make check | claude-haiku-5-5 | 2 | 1,834 | 4 | 14,812 | 11 |
| machine:make test | claude-haiku-5-5 | 2 | 1,036 | 4 | 14,812 | 11 |
| machine:npm run build | claude-haiku-5-5 | 2 | 917 | 4 | 14,816 | 10 |
| refute:round_metrics.py | claude-sonnet-5-5 | 3 | 794 | 6 | 26,004 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 329 | 4 | 10,323 | 5 |


wall: 292s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,745 | 34,820 | 31 | 23:41:44 | 23:42:14 |
| review | 3 | 33,738 | 2,144,952 | 200 | 23:41:44 | 23:45:04 |
| judge | 3 | 19,118 | 112,031 | 58 | 23:41:44 | 23:42:41 |
| machine | 4 | 5,679 | 59,256 | 34 | 23:41:44 | 23:42:18 |
| triage | 1 | 3,674 | 16,251 | 27 | 23:45:04 | 23:45:31 |
| refute | 1 | 794 | 26,004 | 10 | 23:45:31 | 23:45:41 |
| capture | 1 | 329 | 10,323 | 5 | 23:45:41 | 23:45:46 |
| synthesize | 1 | 9,092 | 28,071 | 49 | 23:45:47 | 23:46:36 |

- **claude-opus-5-5**: 3 agent · 46 calls · out 33,738 · in 94 · cache_read 2,144,952 · cache_create 185,347
- **claude-sonnet-5-5**: 8 agent · 19 calls · out 35,752 · in 38 · cache_read 227,500 · cache_create 323,741
- **claude-haiku-5-5**: 4 agent · 8 calls · out 5,679 · in 16 · cache_read 59,256 · cache_create 49,391
### S4 round 2 — wf_54a08cac-a72 (14 agent, 61,082 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:invariants | claude-opus-5-5 | 21 | 11,254 | 42 | 767,956 | 124 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 2 | 10,889 | 4 | 14,834 | 75 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 2 | 7,969 | 4 | 14,832 | 55 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,583 | 4 | 23,770 | 43 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 2 | 6,116 | 4 | 11,216 | 45 |
| review:bugs | claude-opus-5-5 | 17 | 5,604 | 36 | 603,843 | 73 |
| review:measurement | claude-opus-5-5 | 5 | 3,609 | 10 | 104,864 | 37 |
| triage | claude-sonnet-5-5 | 2 | 2,553 | 4 | 14,038 | 21 |
| machine:make check | claude-haiku-5-5 | 2 | 1,276 | 4 | 11,162 | 19 |
| refute:round_metrics.py | claude-sonnet-5-5 | 4 | 1,226 | 8 | 42,227 | 21 |
| machine:make e2e | claude-haiku-5-5 | 2 | 944 | 4 | 14,466 | 9 |
| machine:make test | claude-haiku-5-5 | 2 | 942 | 4 | 14,462 | 11 |
| machine:npm run build | claude-haiku-5-5 | 2 | 784 | 4 | 14,466 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 333 | 4 | 9,973 | 5 |


wall: 216s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 4 | 3,946 | 54,556 | 36 | 23:53:45 | 23:54:22 |
| review | 3 | 20,467 | 1,476,663 | 124 | 23:53:45 | 23:55:49 |
| judge | 3 | 24,974 | 40,882 | 77 | 23:53:45 | 23:55:02 |
| triage | 1 | 2,553 | 14,038 | 21 | 23:55:50 | 23:56:10 |
| refute | 1 | 1,226 | 42,227 | 21 | 23:56:10 | 23:56:31 |
| capture | 1 | 333 | 9,973 | 5 | 23:56:32 | 23:56:37 |
| synthesize | 1 | 7,583 | 23,770 | 43 | 23:56:38 | 23:57:21 |

- **claude-opus-5-5**: 3 agent · 43 calls · out 20,467 · in 88 · cache_read 1,476,663 · cache_create 157,517
- **claude-sonnet-5-5**: 7 agent · 16 calls · out 36,669 · in 32 · cache_read 130,890 · cache_create 290,879
- **claude-haiku-5-5**: 4 agent · 8 calls · out 3,946 · in 16 · cache_read 54,556 · cache_create 50,965
### S4 round 3 — wf_fdc3fc0c-fcf (12 agent, 36,105 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:invariants | claude-opus-5-5 | 19 | 11,300 | 38 | 837,374 | 127 |
| review:measurement | claude-opus-5-5 | 8 | 6,061 | 16 | 199,462 | 65 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,616 | 4 | 24,076 | 35 |
| review:bugs | claude-opus-5-5 | 8 | 3,366 | 16 | 216,501 | 35 |
| triage | claude-sonnet-5-5 | 2 | 2,516 | 4 | 14,366 | 19 |
| machine:make e2e | claude-haiku-5-5 | 2 | 1,890 | 4 | 14,474 | 12 |
| machine:make check | claude-haiku-5-5 | 2 | 1,573 | 4 | 11,170 | 14 |
| refute:round_metrics.py | claude-sonnet-5-5 | 4 | 1,076 | 8 | 39,145 | 13 |
| machine:make test | claude-haiku-5-5 | 2 | 1,053 | 4 | 14,470 | 12 |
| machine:npm run build | claude-haiku-5-5 | 2 | 790 | 4 | 14,474 | 7 |
| refute:round_metrics.py | claude-sonnet-5-5 | 3 | 522 | 6 | 27,759 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 342 | 4 | 9,981 | 6 |


wall: 201s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 20,727 | 1,253,337 | 127 | 00:01:02 | 00:03:09 |
| machine | 4 | 5,306 | 54,588 | 33 | 00:01:02 | 00:01:35 |
| triage | 1 | 2,516 | 14,366 | 19 | 00:03:09 | 00:03:28 |
| refute | 2 | 1,598 | 66,904 | 13 | 00:03:28 | 00:03:41 |
| capture | 1 | 342 | 9,981 | 6 | 00:03:42 | 00:03:48 |
| synthesize | 1 | 5,616 | 24,076 | 35 | 00:03:49 | 00:04:23 |

- **claude-opus-5-5**: 3 agent · 35 calls · out 20,727 · in 70 · cache_read 1,253,337 · cache_create 149,332
- **claude-sonnet-5-5**: 5 agent · 13 calls · out 10,072 · in 26 · cache_read 115,327 · cache_create 96,805
- **claude-haiku-5-5**: 4 agent · 8 calls · out 5,306 · in 16 · cache_read 54,588 · cache_create 51,157
