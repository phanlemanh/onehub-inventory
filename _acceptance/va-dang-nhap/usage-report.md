### S4 round 1 — wf_e50beaa1-239 (15 agent, 54,216 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 7,494 | 4 | 28,120 | 46 |
| review:invariants | claude-opus-5-5 | 15 | 7,084 | 30 | 425,703 | 150 |
| machine:DB_LANE=r DB_PORT=5565 npx playwright te | claude-haiku-5-5 | 11 | 6,692 | 22 | 163,538 | 1247 |
| ui:E15 | claude-sonnet-5-5 | 14 | 6,025 | 28 | 998,123 | 935 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,774 | 6 | 40,766 | 245 |
| review:measurement | claude-opus-5-5 | 7 | 4,475 | 14 | 178,120 | 50 |
| machine:make e2e | claude-haiku-5-5 | 2 | 3,058 | 4 | 14,821 | 93 |
| machine:DB_LANE=r DB_PORT=5565 bash db/scripts/c | claude-haiku-5-5 | 2 | 2,859 | 4 | 14,845 | 25 |
| review:bugs | claude-opus-5-5 | 9 | 2,625 | 18 | 181,867 | 34 |
| triage | claude-sonnet-5-5 | 2 | 2,521 | 4 | 14,336 | 21 |
| machine:DB_LANE=r DB_PORT=5565 npx vitest run -c | claude-haiku-5-5 | 2 | 1,978 | 4 | 14,854 | 17 |
| machine:make test | claude-haiku-5-5 | 2 | 1,720 | 4 | 14,788 | 34 |
| machine:make check | claude-haiku-5-5 | 2 | 1,661 | 4 | 11,488 | 18 |
| machine:npm run build | claude-haiku-5-5 | 2 | 919 | 4 | 14,792 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 331 | 4 | 10,560 | 8 |


wall: 1324s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 4,774 | 40,766 | 245 | 09:34:54 | 09:38:59 |
| review | 3 | 14,184 | 785,690 | 150 | 09:34:54 | 09:37:24 |
| machine | 7 | 18,887 | 249,126 | 1248 | 09:34:54 | 09:55:42 |
| ui | 1 | 6,025 | 998,123 | 935 | 09:34:54 | 09:50:29 |
| triage | 1 | 2,521 | 14,336 | 21 | 09:55:42 | 09:56:03 |
| capture | 1 | 331 | 10,560 | 8 | 09:56:03 | 09:56:11 |
| synthesize | 1 | 7,494 | 28,120 | 46 | 09:56:12 | 09:56:58 |

- **claude-sonnet-5-5**: 5 agent · 23 calls · out 21,145 · in 46 · cache_read 1,091,905 · cache_create 270,175
- **claude-opus-5-5**: 3 agent · 31 calls · out 14,184 · in 62 · cache_read 785,690 · cache_create 111,629
- **claude-haiku-5-5**: 7 agent · 23 calls · out 18,887 · in 46 · cache_read 249,126 · cache_create 111,425
