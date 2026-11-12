### S4 round 1 — wf_ca03a7c0-bb6 (18 agent, 50,515 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:invariants | claude-opus-5-5 | 14 | 7,720 | 28 | 623,794 | 101 |
| synthesize:report | claude-sonnet-5-5 | 3 | 7,383 | 6 | 65,413 | 47 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 5,389 | 4 | 17,653 | 32 |
| review:bugs | claude-opus-5-5 | 15 | 4,786 | 34 | 495,700 | 75 |
| review:measurement | claude-opus-5-5 | 6 | 4,629 | 14 | 152,524 | 54 |
| machine:DB_LANE=${DB_LANE:-n} bash db/scripts/ca | claude-haiku-5-5 | 2 | 2,984 | 4 | 15,216 | 136 |
| machine:make e2e | claude-haiku-5-5 | 2 | 2,662 | 4 | 3,300 | 458 |
| triage | claude-sonnet-5-5 | 2 | 2,158 | 4 | 14,162 | 17 |
| machine:DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 2,094 | 4 | 15,301 | 168 |
| machine:DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 2,027 | 4 | 15,258 | 223 |
| machine:npx vitest run src/modules/identity/perm | claude-haiku-5-5 | 2 | 1,754 | 4 | 15,227 | 22 |
| machine:make check | claude-haiku-5-5 | 2 | 1,445 | 4 | 15,158 | 219 |
| judge:E14:operational-feasibility | claude-sonnet-5-5 | 2 | 1,160 | 4 | 15,194 | 13 |
| judge:E14:domain-correctness | claude-sonnet-5-5 | 3 | 1,074 | 6 | 32,767 | 16 |
| judge:E14:spec-alignment | claude-sonnet-5-5 | 2 | 1,062 | 4 | 15,192 | 13 |
| machine:npm run build | claude-haiku-5-5 | 2 | 958 | 4 | 15,162 | 15 |
| machine:DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT: | claude-haiku-5-5 | 2 | 644 | 4 | 15,288 | 136 |
| capture:provenance | claude-sonnet-5-5 | 3 | 586 | 6 | 24,853 | 10 |


wall: 767s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,389 | 17,653 | 32 | 09:23:25 | 09:23:57 |
| review | 3 | 17,135 | 1,272,018 | 102 | 09:23:25 | 09:25:07 |
| machine | 8 | 14,568 | 109,910 | 693 | 09:23:25 | 09:34:58 |
| judge | 3 | 3,296 | 63,153 | 16 | 09:23:25 | 09:23:41 |
| triage | 1 | 2,158 | 14,162 | 17 | 09:34:58 | 09:35:15 |
| capture | 1 | 586 | 24,853 | 10 | 09:35:15 | 09:35:25 |
| synthesize | 1 | 7,383 | 65,413 | 47 | 09:35:25 | 09:36:12 |

- **claude-opus-5-5**: 3 agent · 35 calls · out 17,135 · in 76 · cache_read 1,272,018 · cache_create 165,560
- **claude-sonnet-5-5**: 7 agent · 17 calls · out 18,812 · in 34 · cache_read 185,234 · cache_create 158,699
- **claude-haiku-5-5**: 8 agent · 16 calls · out 14,568 · in 32 · cache_read 109,910 · cache_create 119,669
