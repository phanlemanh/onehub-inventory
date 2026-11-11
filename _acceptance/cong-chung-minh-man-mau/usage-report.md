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
