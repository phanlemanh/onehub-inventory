### S4 round 1 — wf_3ec688e9-465 (18 agent, 67,106 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 20 | 12,093 | 40 | 1,430,163 | 195 |
| review:measurement | claude-opus-5-5 | 8 | 8,253 | 16 | 429,482 | 111 |
| review:conventions | claude-opus-5-5 | 17 | 7,917 | 34 | 1,118,502 | 126 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,537 | 6 | 81,630 | 157 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,782 | 4 | 38,867 | 34 |
| machine:make check | claude-haiku-5-5 | 3 | 3,199 | 6 | 64,395 | 112 |
| machine:node _acceptance/split-log-ledger/rang/d | claude-haiku-5-5 | 3 | 2,346 | 6 | 67,851 | 20 |
| machine:node --test _acceptance/split-log-ledger | claude-haiku-5-5 | 3 | 2,304 | 6 | 67,809 | 108 |
| machine:node _acceptance/split-log-ledger/rang/d | claude-haiku-5-5 | 3 | 2,247 | 6 | 68,397 | 13 |
| machine:node _acceptance/split-log-ledger/rang/k | claude-haiku-5-5 | 3 | 2,188 | 6 | 67,845 | 13 |
| machine:node _acceptance/split-log-ledger/rang/s | claude-haiku-5-5 | 3 | 2,181 | 6 | 67,796 | 13 |
| machine:node _acceptance/split-log-ledger/rang/v | claude-haiku-5-5 | 3 | 2,172 | 6 | 67,837 | 13 |
| machine:node _acceptance/split-log-ledger/rang/c | claude-haiku-5-5 | 3 | 2,090 | 6 | 67,818 | 12 |
| machine:node _acceptance/split-log-ledger/rang/b | claude-haiku-5-5 | 3 | 2,011 | 6 | 68,756 | 12 |
| triage | claude-sonnet-5-5 | 2 | 1,806 | 4 | 28,915 | 15 |
| machine:DATABASE_URL= make e2e | claude-haiku-5-5 | 2 | 1,512 | 4 | 3,300 | 571 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,021 | 4 | 29,687 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 447 | 4 | 25,127 | 8 |


wall: 751s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 28,263 | 2,978,147 | 197 | 05:44:44 | 05:48:01 |
| baseline | 1 | 7,537 | 81,630 | 157 | 05:44:44 | 05:47:21 |
| machine | 11 | 23,271 | 641,491 | 693 | 05:44:44 | 05:56:17 |
| triage | 1 | 1,806 | 28,915 | 15 | 05:56:17 | 05:56:33 |
| capture | 1 | 447 | 25,127 | 8 | 05:56:33 | 05:56:40 |
| synthesize | 1 | 5,782 | 38,867 | 34 | 05:56:41 | 05:57:15 |

- **claude-opus-5-5**: 3 agent · 45 calls · out 28,263 · in 90 · cache_read 2,978,147 · cache_create 270,253
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 15,572 · in 18 · cache_read 174,539 · cache_create 177,843
- **claude-haiku-5-5**: 11 agent · 31 calls · out 23,271 · in 62 · cache_read 641,491 · cache_create 404,540
### S4 round 2 — wf_75df04e5-1e7 (17 agent, 54,256 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 16 | 9,084 | 32 | 1,064,878 | 137 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,983 | 6 | 79,723 | 146 |
| review:bugs | claude-opus-5-5 | 16 | 5,365 | 32 | 965,442 | 139 |
| review:measurement | claude-opus-5-5 | 11 | 4,899 | 22 | 585,104 | 78 |
| synthesize:report | claude-sonnet-5-5 | 2 | 4,620 | 4 | 35,769 | 29 |
| machine:make check | claude-haiku-5-5 | 3 | 3,195 | 6 | 64,124 | 108 |
| machine:node --test _acceptance/split-log-ledger | claude-haiku-5-5 | 3 | 2,346 | 6 | 67,485 | 60 |
| machine:node _acceptance/split-log-ledger/rang/v | claude-haiku-5-5 | 3 | 2,276 | 6 | 67,566 | 13 |
| machine:node _acceptance/split-log-ledger/rang/b | claude-haiku-5-5 | 3 | 2,251 | 6 | 67,898 | 13 |
| machine:node _acceptance/split-log-ledger/rang/s | claude-haiku-5-5 | 3 | 2,250 | 6 | 68,007 | 13 |
| machine:node _acceptance/split-log-ledger/rang/d | claude-haiku-5-5 | 3 | 2,217 | 6 | 67,910 | 13 |
| machine:node _acceptance/split-log-ledger/rang/c | claude-haiku-5-5 | 3 | 2,131 | 6 | 67,477 | 13 |
| machine:node _acceptance/split-log-ledger/rang/k | claude-haiku-5-5 | 3 | 2,119 | 6 | 67,500 | 12 |
| machine:DATABASE_URL= make e2e | claude-haiku-5-5 | 2 | 1,832 | 4 | 3,300 | 566 |
| machine:npm run build | claude-haiku-5-5 | 2 | 1,206 | 4 | 29,452 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,032 | 4 | 27,633 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 450 | 4 | 24,973 | 8 |


wall: 734s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 19,348 | 2,615,424 | 142 | 07:51:08 | 07:53:29 |
| baseline | 1 | 6,983 | 79,723 | 146 | 07:51:08 | 07:53:34 |
| machine | 10 | 21,823 | 570,719 | 686 | 07:51:08 | 08:02:34 |
| triage | 1 | 1,032 | 27,633 | 10 | 08:02:34 | 08:02:44 |
| capture | 1 | 450 | 24,973 | 8 | 08:02:44 | 08:02:52 |
| synthesize | 1 | 4,620 | 35,769 | 29 | 08:02:53 | 08:03:22 |

- **claude-opus-5-5**: 3 agent · 43 calls · out 19,348 · in 86 · cache_read 2,615,424 · cache_create 258,454
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 13,085 · in 18 · cache_read 168,098 · cache_create 173,074
- **claude-haiku-5-5**: 10 agent · 28 calls · out 21,823 · in 56 · cache_read 570,719 · cache_create 368,994

