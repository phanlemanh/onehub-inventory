### S4 round 1 — wf_fbe89a22-b7b (12 agent, 36,663 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 11 | 6,126 | 22 | 397,996 | 135 |
| review:bugs | claude-opus-5-5 | 10 | 6,075 | 22 | 267,484 | 157 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,289 | 4 | 22,921 | 30 |
| machine:make e2e | claude-haiku-5-5 | 5 | 3,658 | 10 | 52,612 | 635 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,377 | 6 | 37,988 | 110 |
| review:measurement | claude-opus-5-5 | 3 | 3,247 | 6 | 43,870 | 46 |
| triage | claude-sonnet-5-5 | 2 | 2,599 | 4 | 15,173 | 19 |
| machine:npx vitest run tests/vong-doi-thao-tac.t | claude-haiku-5-5 | 2 | 2,560 | 4 | 15,876 | 52 |
| machine:make check | claude-haiku-5-5 | 2 | 1,600 | 4 | 12,515 | 57 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,102 | 4 | 15,852 | 15 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 701 | 6 | 28,054 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 329 | 4 | 11,360 | 3 |


wall: 767s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 15,448 | 709,350 | 159 | 06:10:14 | 06:12:53 |
| machine | 4 | 8,920 | 96,855 | 707 | 06:10:14 | 06:22:02 |
| baseline | 1 | 3,377 | 37,988 | 110 | 06:10:14 | 06:12:04 |
| triage | 1 | 2,599 | 15,173 | 19 | 06:22:02 | 06:22:21 |
| refute | 1 | 701 | 28,054 | 6 | 06:22:21 | 06:22:27 |
| capture | 1 | 329 | 11,360 | 3 | 06:22:27 | 06:22:31 |
| synthesize | 1 | 5,289 | 22,921 | 31 | 06:22:31 | 06:23:01 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 15,448 · in 50 · cache_read 709,350 · cache_create 119,058
- **claude-sonnet-5-5**: 5 agent · 12 calls · out 12,295 · in 24 · cache_read 115,496 · cache_create 109,827
- **claude-haiku-5-5**: 4 agent · 11 calls · out 8,920 · in 22 · cache_read 96,855 · cache_create 71,567
