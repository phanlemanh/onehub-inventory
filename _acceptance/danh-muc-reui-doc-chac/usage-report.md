### S4 round 1 — wf_acf3caa9-895 (16 agent, 35,841 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:invariants | claude-opus-5-5 | 11 | 5,321 | 22 | 304,763 | 88 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,211 | 4 | 23,867 | 31 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,015 | 6 | 38,635 | 78 |
| review:measurement | claude-opus-5-5 | 3 | 3,150 | 6 | 42,213 | 32 |
| review:bugs | claude-opus-5-5 | 5 | 3,098 | 10 | 97,326 | 33 |
| machine:make e2e | claude-haiku-5-5 | 2 | 2,838 | 4 | 14,838 | 63 |
| machine:npx vitest run tools/reui_catalog --cove | claude-haiku-5-5 | 2 | 2,571 | 4 | 14,881 | 27 |
| triage | claude-sonnet-5-5 | 2 | 2,094 | 4 | 13,587 | 19 |
| machine:make check | claude-haiku-5-5 | 2 | 1,766 | 4 | 11,534 | 12 |
| machine:make test | claude-haiku-5-5 | 2 | 1,390 | 4 | 14,834 | 24 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 993 | 4 | 14,781 | 10 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 883 | 4 | 11,163 | 9 |
| machine:npm run build | claude-haiku-5-5 | 2 | 860 | 4 | 14,838 | 11 |
| machine:node --require ./tools/reui_catalog/no-n | claude-haiku-5-5 | 2 | 735 | 4 | 14,969 | 5 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 567 | 4 | 14,779 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 349 | 4 | 10,347 | 7 |


wall: 145s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 4,015 | 38,635 | 78 | 04:09:48 | 04:11:06 |
| review | 3 | 11,569 | 444,302 | 88 | 04:09:48 | 04:11:15 |
| machine | 6 | 10,160 | 85,894 | 86 | 04:09:48 | 04:11:14 |
| judge | 3 | 2,443 | 40,723 | 12 | 04:09:48 | 04:09:59 |
| triage | 1 | 2,094 | 13,587 | 19 | 04:11:15 | 04:11:34 |
| capture | 1 | 349 | 10,347 | 7 | 04:11:34 | 04:11:41 |
| synthesize | 1 | 5,211 | 23,867 | 31 | 04:11:42 | 04:12:13 |

- **claude-opus-5-5**: 3 agent · 19 calls · out 11,569 · in 38 · cache_read 444,302 · cache_create 122,108
- **claude-sonnet-5-5**: 7 agent · 15 calls · out 14,112 · in 30 · cache_read 127,159 · cache_create 139,154
- **claude-haiku-5-5**: 6 agent · 12 calls · out 10,160 · in 24 · cache_read 85,894 · cache_create 79,818
### S4 round 2 — wf_c371be6e-492 (12 agent, 23,046 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:invariants | claude-opus-5-5 | 16 | 7,237 | 32 | 512,647 | 131 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,243 | 4 | 25,991 | 32 |
| machine:make check | claude-haiku-5-5 | 2 | 1,508 | 4 | 14,846 | 30 |
| machine:make e2e | claude-haiku-5-5 | 2 | 1,455 | 4 | 14,850 | 55 |
| triage | claude-sonnet-5-5 | 2 | 1,421 | 4 | 12,901 | 12 |
| review:bugs | claude-opus-5-5 | 5 | 1,382 | 10 | 102,114 | 31 |
| review:measurement | claude-opus-5-5 | 4 | 1,173 | 8 | 52,137 | 13 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 940 | 4 | 11,175 | 9 |
| machine:npm run build | claude-haiku-5-5 | 2 | 927 | 4 | 14,850 | 7 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 867 | 4 | 14,791 | 10 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 562 | 4 | 14,793 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 331 | 4 | 10,359 | 5 |


wall: 182s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 3 | 3,890 | 44,546 | 93 | 04:15:32 | 04:17:05 |
| review | 3 | 9,792 | 666,898 | 131 | 04:15:32 | 04:17:43 |
| judge | 3 | 2,369 | 40,759 | 11 | 04:15:32 | 04:15:43 |
| triage | 1 | 1,421 | 12,901 | 12 | 04:17:43 | 04:17:55 |
| capture | 1 | 331 | 10,359 | 5 | 04:17:56 | 04:18:01 |
| synthesize | 1 | 5,243 | 25,991 | 32 | 04:18:02 | 04:18:34 |

- **claude-opus-5-5**: 3 agent · 25 calls · out 9,792 · in 50 · cache_read 666,898 · cache_create 92,945
- **claude-sonnet-5-5**: 6 agent · 12 calls · out 9,364 · in 24 · cache_read 90,010 · cache_create 117,683
- **claude-haiku-5-5**: 3 agent · 6 calls · out 3,890 · in 12 · cache_read 44,546 · cache_create 38,488
