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
