### S4 round 1 — wf_e18dce07-5a5 (16 agent, 51,965 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 8 | 9,176 | 16 | 334,547 | 128 |
| review:bugs | claude-opus-5-5 | 12 | 8,625 | 24 | 588,620 | 134 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,373 | 6 | 77,741 | 160 |
| review:conventions | claude-opus-5-5 | 9 | 4,731 | 18 | 404,523 | 96 |
| synthesize:report | claude-sonnet-5-5 | 2 | 4,326 | 4 | 35,416 | 26 |
| machine:make check | claude-haiku-5-5 | 4 | 4,094 | 8 | 100,704 | 136 |
| machine:DATABASE_URL= make e2e | claude-haiku-5-5 | 2 | 3,202 | 4 | 3,416 | 607 |
| machine:node --test _acceptance/tat-plugin-cho-c | claude-haiku-5-5 | 3 | 2,493 | 6 | 67,272 | 18 |
| machine:node _acceptance/tat-plugin-cho-cu/rang/ | claude-haiku-5-5 | 3 | 2,126 | 6 | 67,241 | 20 |
| machine:node _acceptance/tat-plugin-cho-cu/rang/ | claude-haiku-5-5 | 3 | 2,022 | 6 | 67,245 | 16 |
| triage | claude-sonnet-5-5 | 2 | 1,465 | 4 | 27,968 | 13 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,074 | 4 | 29,446 | 10 |
| machine:node _acceptance/nang-kit-3-0/rang/setti | claude-haiku-5-5 | 2 | 658 | 4 | 29,486 | 8 |
| machine:node _acceptance/tat-plugin-cho-cu/rang/ | claude-haiku-5-5 | 2 | 654 | 4 | 29,496 | 8 |
| machine:node _acceptance/tat-plugin-cho-cu/rang/ | claude-haiku-5-5 | 2 | 530 | 4 | 29,490 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 416 | 4 | 24,841 | 7 |


wall: 800s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 22,532 | 1,327,690 | 137 | 15:07:44 | 15:10:01 |
| baseline | 1 | 6,373 | 77,741 | 160 | 15:07:44 | 15:10:24 |
| machine | 9 | 16,853 | 423,796 | 754 | 15:07:44 | 15:20:18 |
| triage | 1 | 1,465 | 27,968 | 13 | 15:20:18 | 15:20:31 |
| capture | 1 | 416 | 24,841 | 7 | 15:20:31 | 15:20:38 |
| synthesize | 1 | 4,326 | 35,416 | 26 | 15:20:38 | 15:21:05 |

- **claude-opus-5-5**: 3 agent · 29 calls · out 22,532 · in 58 · cache_read 1,327,690 · cache_create 200,654
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 12,580 · in 18 · cache_read 165,966 · cache_create 166,397
- **claude-haiku-5-5**: 9 agent · 23 calls · out 16,853 · in 46 · cache_read 423,796 · cache_create 321,231

