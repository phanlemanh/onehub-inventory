### S4 round 1 — wf_4a5b6656-8ee (27 agent, 85,828 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,209 | 6 | 58,408 | 238 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,592 | 4 | 30,318 | 58 |
| review:measurement | claude-opus-5-5 | 7 | 8,914 | 14 | 228,953 | 92 |
| review:bugs | claude-opus-5-5 | 14 | 8,390 | 28 | 807,085 | 123 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 5 | 4,138 | 10 | 72,282 | 220 |
| machine:make check | claude-haiku-5-5 | 4 | 3,944 | 8 | 49,169 | 180 |
| review:invariants | claude-opus-5-5 | 11 | 3,808 | 22 | 255,750 | 55 |
| triage | claude-sonnet-5-5 | 2 | 3,157 | 4 | 14,982 | 23 |
| machine:DATABASE_URL= make e2e | claude-haiku-5-5 | 4 | 2,867 | 8 | 34,586 | 685 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 2,116 | 6 | 34,464 | 75 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 2,100 | 6 | 34,476 | 10 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 2,075 | 6 | 34,451 | 14 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 2,067 | 6 | 34,512 | 12 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 2,049 | 6 | 34,439 | 69 |
| judge:E16:domain-correctness | claude-sonnet-5-5 | 2 | 1,993 | 4 | 11,770 | 15 |
| judge:E16:spec-alignment | claude-sonnet-5-5 | 2 | 1,992 | 4 | 15,386 | 15 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 1,966 | 6 | 34,442 | 28 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 1,946 | 6 | 34,451 | 20 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 1,936 | 6 | 34,511 | 14 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 1,870 | 6 | 34,421 | 17 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 3 | 1,784 | 6 | 34,445 | 25 |
| judge:E16:operational-feasibility | claude-sonnet-5-5 | 2 | 1,694 | 4 | 15,388 | 13 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,087 | 4 | 15,427 | 11 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 2 | 748 | 4 | 15,472 | 6 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 2 | 574 | 4 | 15,470 | 6 |
| machine:node _acceptance/upgrade-design-assembly | claude-haiku-5-5 | 2 | 510 | 4 | 15,468 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 302 | 4 | 10,815 | 4 |


wall: 961s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,209 | 58,408 | 238 | 02:35:34 | 02:39:33 |
| machine | 17 | 33,777 | 562,486 | 876 | 02:35:34 | 02:50:10 |
| judge | 3 | 5,679 | 42,544 | 18 | 02:35:50 | 02:36:08 |
| review | 3 | 21,112 | 1,291,788 | 129 | 02:35:56 | 02:38:04 |
| triage | 1 | 3,157 | 14,982 | 23 | 02:50:10 | 02:50:33 |
| capture | 1 | 302 | 10,815 | 4 | 02:50:33 | 02:50:37 |
| synthesize | 1 | 10,592 | 30,318 | 58 | 02:50:38 | 02:51:36 |

- **claude-sonnet-5-5**: 7 agent · 15 calls · out 30,939 · in 30 · cache_read 157,067 · cache_create 163,707
- **claude-opus-5-5**: 3 agent · 32 calls · out 21,112 · in 64 · cache_read 1,291,788 · cache_create 190,659
- **claude-haiku-5-5**: 17 agent · 51 calls · out 33,777 · in 102 · cache_read 562,486 · cache_create 264,958

