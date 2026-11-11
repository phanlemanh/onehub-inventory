### S4 round 1 — wf_aa8b5e29-947 (10 agent, 19,069 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 8 | 3,438 | 16 | 204,579 | 134 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 2,792 | 6 | 36,419 | 91 |
| synthesize:report | claude-sonnet-5-5 | 2 | 2,775 | 4 | 18,253 | 20 |
| review:conventions | claude-opus-5-5 | 7 | 2,709 | 14 | 154,050 | 32 |
| review:measurement | claude-opus-5-5 | 4 | 1,993 | 8 | 59,966 | 23 |
| machine:make check | claude-haiku-5-5 | 2 | 1,769 | 4 | 12,226 | 13 |
| machine:make test | claude-haiku-5-5 | 2 | 1,353 | 4 | 15,526 | 27 |
| machine:make e2e | claude-haiku-5-5 | 2 | 1,068 | 4 | 15,530 | 119 |
| machine:npm run build | claude-haiku-5-5 | 2 | 822 | 4 | 15,530 | 13 |
| capture:provenance | claude-sonnet-5-5 | 2 | 350 | 4 | 11,036 | 5 |


wall: 172s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 8,140 | 418,595 | 135 | 04:55:17 | 04:57:32 |
| baseline | 1 | 2,792 | 36,419 | 91 | 04:55:17 | 04:56:48 |
| machine | 4 | 5,012 | 58,812 | 146 | 04:55:17 | 04:57:43 |
| capture | 1 | 350 | 11,036 | 6 | 04:57:43 | 04:57:48 |
| synthesize | 1 | 2,775 | 18,253 | 20 | 04:57:49 | 04:58:09 |

- **claude-opus-5-5**: 3 agent · 19 calls · out 8,140 · in 38 · cache_read 418,595 · cache_create 97,469
- **claude-sonnet-5-5**: 3 agent · 7 calls · out 5,917 · in 14 · cache_read 65,708 · cache_create 65,085
- **claude-haiku-5-5**: 4 agent · 8 calls · out 5,012 · in 16 · cache_read 58,812 · cache_create 57,084
### S4 round 2 — wf_005b216a-efb (10 agent, 19,569 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 3,550 | 4 | 21,714 | 24 |
| review:bugs | claude-opus-5-5 | 7 | 3,488 | 14 | 153,295 | 39 |
| review:conventions | claude-opus-5-5 | 6 | 3,241 | 12 | 134,247 | 34 |
| machine:make e2e | claude-haiku-5-5 | 2 | 2,884 | 4 | 14,821 | 75 |
| review:measurement | claude-opus-5-5 | 3 | 1,718 | 6 | 36,505 | 19 |
| triage | claude-sonnet-5-5 | 2 | 1,306 | 4 | 12,942 | 13 |
| machine:make test | claude-haiku-5-5 | 2 | 1,201 | 4 | 14,817 | 22 |
| machine:make check | claude-haiku-5-5 | 2 | 978 | 4 | 14,817 | 29 |
| machine:npm run build | claude-haiku-5-5 | 2 | 872 | 4 | 14,821 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 331 | 4 | 13,484 | 7 |


wall: 156s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 8,447 | 324,047 | 39 | 05:00:16 | 05:00:55 |
| machine | 4 | 5,935 | 59,276 | 112 | 05:00:16 | 05:02:08 |
| triage | 1 | 1,306 | 12,942 | 13 | 05:02:08 | 05:02:21 |
| capture | 1 | 331 | 13,484 | 7 | 05:02:21 | 05:02:28 |
| synthesize | 1 | 3,550 | 21,714 | 24 | 05:02:29 | 05:02:53 |

- **claude-sonnet-5-5**: 3 agent · 6 calls · out 5,187 · in 12 · cache_read 48,140 · cache_create 54,960
- **claude-opus-5-5**: 3 agent · 16 calls · out 8,447 · in 32 · cache_read 324,047 · cache_create 90,142
- **claude-haiku-5-5**: 4 agent · 8 calls · out 5,935 · in 16 · cache_read 59,276 · cache_create 50,827
