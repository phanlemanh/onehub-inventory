# Changelog

## [0.2.0](https://github.com/phanlemanh/onehub-inventory/compare/onehub-inventory-v0.1.0...onehub-inventory-v0.2.0) (2026-11-14)


### Features

* **api:** /api/v1/company-layer endpoints ([466aa02](https://github.com/phanlemanh/onehub-inventory/commit/466aa02bced6bcc660d1311e68e352c192ce4170))
* **bo-nut-theo-quyen:** action buttons follow the permission table (row 9e) ([f458f6d](https://github.com/phanlemanh/onehub-inventory/commit/f458f6d3dbbb80bfa0c1512fe202559cf45dddef))
* **bo-nut-theo-quyen:** actionVisibility and PermittedAction read the permission table (tasks 2-3) ([5effb8a](https://github.com/phanlemanh/onehub-inventory/commit/5effb8a30d4d561f0ecbb8fd922b93852b988869))
* **bo-nut-theo-quyen:** design ledger section, members e2e on lane V, no retry after a refusal (tasks 5, 8) ([272f6e9](https://github.com/phanlemanh/onehub-inventory/commit/272f6e9754c02028c94d703bba4ec94df2ab66b7))
* **bo-nut-theo-quyen:** role x screen x button table generated from the permission table (task 7) ([a2aceab](https://github.com/phanlemanh/onehub-inventory/commit/a2aceab31679c0cd3f5c525ce907ca870aed0f73))
* **bo-nut-theo-quyen:** row and record actions menu, row-actions column of the shared grid (task 4) ([cd1f000](https://github.com/phanlemanh/onehub-inventory/commit/cd1f000fdef35e98e93277efc3b0181799fd2971))
* **bo-nut-theo-quyen:** seven draft rows in the permission table and button labels (task 1) ([490fa91](https://github.com/phanlemanh/onehub-inventory/commit/490fa91b89cf2677a2f2d289099d3ed9b1170fff))
* **bo-nut-theo-quyen:** sidebar and members screen read the permission table; own sentence for 403 (task 8) ([80a423a](https://github.com/phanlemanh/onehub-inventory/commit/80a423ac25021f92b3ba1a3c81ba471476491e42))
* **bo-nut-theo-quyen:** the prototype becomes the template sample on the real parts and table (task 9) ([1094af3](https://github.com/phanlemanh/onehub-inventory/commit/1094af328c9a76a4d4ba0b50c91c7efc85626333))
* **catalog:** shared unit catalog stored like onehub-invest, with company codes (row 7d) ([10fbc94](https://github.com/phanlemanh/onehub-inventory/commit/10fbc943262f861055893494bce6a88ba0b1b148))
* **ci:** database job on CI with make ci-db (row 1s) ([42a231f](https://github.com/phanlemanh/onehub-inventory/commit/42a231f5743c4fe35da95162e1605250e5913bf9))
* **ci:** make ci-db runs every database suite on one Postgres as quy_hang_login, with the hand-over count and a CI rebuild check ([a864e37](https://github.com/phanlemanh/onehub-inventory/commit/a864e37b083ced886e8a25c7da36743db7d5ce95))
* **company-config:** each company's own layer on the standard core (row 7e) ([56415b0](https://github.com/phanlemanh/onehub-inventory/commit/56415b06a46a80bb3fdadd6ead9c7577d0a215af))
* **company-config:** model the company layer and give the code generator an object type ([56ac4f9](https://github.com/phanlemanh/onehub-inventory/commit/56ac4f9bac3a601bb52b9e1da62916387d1970da))
* **company-config:** review screen with the row 9e button set ([b819a3b](https://github.com/phanlemanh/onehub-inventory/commit/b819a3b3fa00762e13cf67729d345f58b65da3e5))
* **company-config:** rules of the company layer ([34dcef9](https://github.com/phanlemanh/onehub-inventory/commit/34dcef982a54475314c096323fc34b20bf492708))
* **company-config:** store, four-source lookup and match of the company layer ([8876c93](https://github.com/phanlemanh/onehub-inventory/commit/8876c93dbd36f0e9fa49e18fb67a5501995323f1))
* **db:** company layer tables (migration 010) with permission rows and isolation cases ([4d7c086](https://github.com/phanlemanh/onehub-inventory/commit/4d7c0865e67364f90ecfce1ffadaaee0a22fa094))
* **db:** migration 009, saved_view table kept to its saver; isolation suite allows its four own-row policies ([63d01b1](https://github.com/phanlemanh/onehub-inventory/commit/63d01b1f0d44c33a914cc1f95e8fb72153093329))
* **e2e-templates:** optional vao_vung entry for the grid region suite (row 7e, path A) ([9904bcc](https://github.com/phanlemanh/onehub-inventory/commit/9904bcc0d2abe198a0de70daa3b564cab396a059))
* **grid:** drop the region search box (row 2e) ([f905ded](https://github.com/phanlemanh/onehub-inventory/commit/f905dedcdec51073ab7e7074d2a978f107673945))
* **grid:** drop the region search box; filter row always shown; accent-insensitive ⌘K ([c053880](https://github.com/phanlemanh/onehub-inventory/commit/c0538806eca6928f9eb893a2c245fc84d871f86c))
* **ho-so-can:** listing record in a floating panel beside the inventory grid (row 3) ([fc18cb2](https://github.com/phanlemanh/onehub-inventory/commit/fc18cb2e66d3a9c0bebd250b8f3362578b9212ff))
* **ho-so-du-thong-tin:** screen proof, block register line, generated registry ([52cd375](https://github.com/phanlemanh/onehub-inventory/commit/52cd375b44b60cbe1d438113c46bd3eff1e6a122))
* **identity:** app connects as a login role that owns nothing (row 7c) ([5d40a3c](https://github.com/phanlemanh/onehub-inventory/commit/5d40a3cb46fab43df4c1e67e1c3ba0b669a59e1d))
* **identity:** shared action door for other modules' API handlers ([f227ebe](https://github.com/phanlemanh/onehub-inventory/commit/f227ebee3988f80753a2a93dee020c25a1e1181b))
* **identity:** the query door refuses a connection role that can reach the owner (row 7c) ([9469295](https://github.com/phanlemanh/onehub-inventory/commit/9469295559581b59be9e2ea9e8484e0c2d007edb))
* **inventory:** company labels and custom columns ([9c25e61](https://github.com/phanlemanh/onehub-inventory/commit/9c25e61235510a38f1fccd5ecbdb8327ee5f7e2c))
* **kiem-vai-theo-man:** register declares entry rule and buttons; button table covers every screen and the frame ([48b9e73](https://github.com/phanlemanh/onehub-inventory/commit/48b9e73baf831d5ad537eec1d756bfe3d3c93a66))
* **kiem-vai-theo-man:** shared role sign-in door, role × screen browser suite with reconciliation and break runs ([22d5efb](https://github.com/phanlemanh/onehub-inventory/commit/22d5efb58e0ad5c5c3ff6c2da948569be0854b19))
* **labels:** action labels for asking the listing agent and reporting wrong unit details (row 3e) ([34a0d31](https://github.com/phanlemanh/onehub-inventory/commit/34a0d31e34e6304c8700febf40afb662bf503860))
* **listings:** a saved view keeps four things, not the search text (owner ruling 2026-11-13) ([b891889](https://github.com/phanlemanh/onehub-inventory/commit/b891889f9f4b43b9b591d46dd7084ddc26f23b53))
* **listings:** ask the listing agent and report wrong unit details (row 3e) ([66e5a8d](https://github.com/phanlemanh/onehub-inventory/commit/66e5a8df42fe0b0d470c8c92b5f88bc3fcd140d9))
* **listings:** ask the listing agent and report wrong unit details from the record (row 3e) ([3b6f3a6](https://github.com/phanlemanh/onehub-inventory/commit/3b6f3a650b5c095721aac48f7ddad9858c58ed90))
* **listings:** edit price and status in the inventory cell (row 4) ([d7c8f5d](https://github.com/phanlemanh/onehub-inventory/commit/d7c8f5d391a95fe1f7721bc38bb4145024667b37))
* **listings:** edit price and status in the inventory cell (row 4) ([c0238c5](https://github.com/phanlemanh/onehub-inventory/commit/c0238c54cdd4655d3e1fc811b3433f98fe83ff9d))
* **listings:** edit rules and save door for in-cell edit (row 4, pure part) ([e3fccf7](https://github.com/phanlemanh/onehub-inventory/commit/e3fccf725873a6203623176a26e069665aa93e5d))
* **listings:** full unit record — row 3b ([f583d39](https://github.com/phanlemanh/onehub-inventory/commit/f583d39e12585a86c9e20e3e58ff0ff0d5d4c97e))
* **listings:** full unit record — unit block, listing block, completeness bar, confirmation age and listings of the unit ([9ecffaf](https://github.com/phanlemanh/onehub-inventory/commit/9ecffafe05f98d8947022137a16f160d693bb4ad))
* **listings:** offer details, creation time and the one-open-listing rule; sample earlier listings and record rules ([eefd270](https://github.com/phanlemanh/onehub-inventory/commit/eefd2709f845209f6a8d71f94fdc36432586889d))
* **listings:** saved views in the App Shell's second column (row 2c) ([1c83e80](https://github.com/phanlemanh/onehub-inventory/commit/1c83e80b1063af61e4626244180d92f70b88d365))
* **listings:** saved views in the App Shell's second column and on the inventory ([459cca2](https://github.com/phanlemanh/onehub-inventory/commit/459cca22087cf960e98996e66bec0cdf61d4c842))
* **listings:** saved views on the server and /api/v1/saved-views ([de88740](https://github.com/phanlemanh/onehub-inventory/commit/de887406f304c7aff6824e4e4d641eea1f801369))
* **login:** sign-in screen chosen from ReUI auth-15 (row 1p) ([01c11df](https://github.com/phanlemanh/onehub-inventory/commit/01c11df5a667416193ca8746a64e7fa97a7f2ad1))
* **login:** sign-in screen laid out as ReUI block auth-15, new screen family dang-nhap ([0bc6341](https://github.com/phanlemanh/onehub-inventory/commit/0bc6341ea7d89bb5b924012a912ca29c7319e3f3))
* **loi-vao-ho-so:** copy a record link and find a unit from the top bar ([dcf39ff](https://github.com/phanlemanh/onehub-inventory/commit/dcf39ffb28f1957965010d18cf636b9879096332))
* **loi-vao-ho-so:** copy a record's link, open the inventory from a unit code, say when a shared link is stale ([d9ed1dc](https://github.com/phanlemanh/onehub-inventory/commit/d9ed1dc8cfb79af7f53cf69b2f8341da90412f28))
* **loi-vao-ho-so:** the top-bar ⌘K search, the product's one search box ([271d8ed](https://github.com/phanlemanh/onehub-inventory/commit/271d8ed46a6c0e2e4a1f0bca9c7b9160ec344f47))
* **members:** member list and invite dialog chosen from ReUI (row 9c) ([93a72dd](https://github.com/phanlemanh/onehub-inventory/commit/93a72ddedab0e31399631b3d632d9592f9c256b4))
* **members:** member list and invite dialog chosen from ReUI (row 9c) ([8a1713c](https://github.com/phanlemanh/onehub-inventory/commit/8a1713c51e522b82ad2ffc147a6287c609702914))
* **ontology:** add ShareLink, the sent link owned by the sharing module (row 6) ([ecf8a3d](https://github.com/phanlemanh/onehub-inventory/commit/ecf8a3dbef524c06558dc98794bfd52ddb2c196d))
* **ontology:** SavedView and its four permission rows, own scope for the three listing-board roles ([fdd04aa](https://github.com/phanlemanh/onehub-inventory/commit/fdd04aa5a975f0e8400841ba9e10c6a8e622b4dd))
* **proof-gate:** prove each pre-ledger block exemption in git ([978d2d2](https://github.com/phanlemanh/onehub-inventory/commit/978d2d22790faf343155df491b3f4339775141c6))
* **record-panel:** pin state rules — cookie, width bounds, 800 px threshold ([4c57550](https://github.com/phanlemanh/onehub-inventory/commit/4c57550042bc90b08810b790bd4ccc7273921828))
* **record-panel:** pin the record as a column beside the grid ([ad3a543](https://github.com/phanlemanh/onehub-inventory/commit/ad3a543473fc618f69670d3195b40c14bd4e610c))
* **record-panel:** pin the record panel as a column beside the grid (row 3a) ([1226ec5](https://github.com/phanlemanh/onehub-inventory/commit/1226ec5b3370cbe951b662fa6a1f14408cc2544e))
* role × screen browser checks and a full role × screen × button table (row 9b) ([eeecfd7](https://github.com/phanlemanh/onehub-inventory/commit/eeecfd767d632a95ef0950e3dcc1d62e5e0e0747))
* **sharing:** Sent on the shared grid with sample links (row 6) ([ab97dff](https://github.com/phanlemanh/onehub-inventory/commit/ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902))
* **sharing:** Sent shows sample links on the shared grid with a record panel (row 6) ([f4bfce1](https://github.com/phanlemanh/onehub-inventory/commit/f4bfce1191d23e3dcb6586e6a481fa1b1bc6f174))
* **ui:** add the shadcn resizable component (react-resizable-panels) ([5f0c961](https://github.com/phanlemanh/onehub-inventory/commit/5f0c96146d7a1df2016b0988ecf6b8a06925e73f))


### Bug Fixes

* **bo-nut-theo-quyen:** E12 evidence names the screenshot tool the config declares ([84d4475](https://github.com/phanlemanh/onehub-inventory/commit/84d4475e87faa3a0964d482768728d3bedcc7815))
* **bo-nut-theo-quyen:** menus, record actions and sidebar entries name actions by the permission table's type (S4 round 1, AC-3) ([df2561e](https://github.com/phanlemanh/onehub-inventory/commit/df2561e7183a5d5f787ab7c01ead0f43aba75ae9))
* **bo-nut-theo-quyen:** register the prototype route and apply the supervisor's post-gate fixes (make check green) ([80912cb](https://github.com/phanlemanh/onehub-inventory/commit/80912cb2bb5af7acfd00e69c87bc267682fec03a))
* **bo-nut-theo-quyen:** screenshot tests write to the run folder, not the signed record ([04f3c1e](https://github.com/phanlemanh/onehub-inventory/commit/04f3c1ecef5b5069176ec030bbb05f6480c00348))
* **ci-co-postgres:** store run-log lines as JSON objects, not quoted strings ([de58a62](https://github.com/phanlemanh/onehub-inventory/commit/de58a62b7a000fa6ed5e3d81bdfcc6e35c525e92))
* **ci:** round 1 findings of row 1s — history scan as a class, ci-thu break env, ci-that by commit ([46bc6ed](https://github.com/phanlemanh/onehub-inventory/commit/46bc6edc6683dee81c4403c9ee2628d86160c183))
* **ci:** row 1s follows main — stored workflow patch at the 40-minute ceiling, hand-over fixtures from a real run with row 9b's role × screen suite ([ee131f8](https://github.com/phanlemanh/onehub-inventory/commit/ee131f825bc91f0279de0ba2cabb0ae9dbfa9c20))
* **dang-nhap-chon-tu-reui:** round 1 — layout cases measure dark too, proof block table complete ([f41e30c](https://github.com/phanlemanh/onehub-inventory/commit/f41e30c8d5fab55eb3bc3f7d0e23b4510dec08ad))
* **db:** isolation runs on one lane no longer drop each other's scratch databases ([543e4c5](https://github.com/phanlemanh/onehub-inventory/commit/543e4c5f3c1e4f0313337427e08ffe2bd177f6eb))
* **e2e-templates:** join a case's state query to a declared entry, measure the reverse long-text case (row 7e) ([25fc6dc](https://github.com/phanlemanh/onehub-inventory/commit/25fc6dc45267f9fa21b5ba500c0056145ff3855f))
* **grid:** apply column floors before sharing spare room and choosing density ([a2e6014](https://github.com/phanlemanh/onehub-inventory/commit/a2e6014e1e4d846fa71af9b870eeb59be31faee3))
* **grid:** cut columns give room back so eight columns fit on CI's font ([01ca326](https://github.com/phanlemanh/onehub-inventory/commit/01ca3262d873643e343ee72339ccb0dbe33bf3ae))
* **grid:** every column at least 11 ch under the always-shown filter row ([f4c879a](https://github.com/phanlemanh/onehub-inventory/commit/f4c879a5113e1ab56553f13e3f91aa4d0234240f))
* **grid:** the always-frozen first column drops its hidden unpin button; eight columns fit again ([403118b](https://github.com/phanlemanh/onehub-inventory/commit/403118b16b7d29ce8b212a5188f339185fbb4330))
* **grid:** the open cell is cut inside its cell like other text cells (row 6, AC-9) ([23401f3](https://github.com/phanlemanh/onehub-inventory/commit/23401f3f8b29979c08241b80a2e186b83e8363f1))
* **ho-so-can:** the unit code keeps the grid row height and hands copy to the grid ([1c81fff](https://github.com/phanlemanh/onehub-inventory/commit/1c81fffff6c8691d3058f5cbdab118a721934bd3))
* **ho-so-du-thong-tin:** round 1 — measure listing order and price against the sample, keep price and date on one line, bring the record head back into view ([472bab8](https://github.com/phanlemanh/onehub-inventory/commit/472bab8f81c8cc0c372dcdce3924aa7f95fcbb39))
* **kiem-vai-theo-man:** break runs build their copy outside the repository; round 1 record ([e45fa81](https://github.com/phanlemanh/onehub-inventory/commit/e45fa81041db352008f036634e754e0a509e4d36))
* **kiem-vai-theo-man:** no screens declared for a row that builds none; sidebar check as one tagged test ([c313dfb](https://github.com/phanlemanh/onehub-inventory/commit/c313dfbc6cf39747f432693a98ac12a9fe3dee70))
* **loi-vao-ho-so:** name the screenshot source of E9 by its config key ([a69151e](https://github.com/phanlemanh/onehub-inventory/commit/a69151e60caaada5b15cd345021de35bc9d40adf))
* **loi-vao-ho-so:** prototype uses the store's form dialog and notices, served by the shared proto page ([3cbe3fc](https://github.com/phanlemanh/onehub-inventory/commit/3cbe3fc094259ab5494c367e75cf275550fa59f8))
* **loi-vao-ho-so:** the ⌘K box adds no heading while closed and its name matches its words; the shell and record-head checks know the search box and the copy button ([660c1a8](https://github.com/phanlemanh/onehub-inventory/commit/660c1a8b436068bab218679cf3082d4698d23bdc))
* **loi-vao-ho-so:** the stale-link notice shows once ([2679a63](https://github.com/phanlemanh/onehub-inventory/commit/2679a63fe5c2acad382106eb4b43364b327d33ba))
* **lop-rieng-cua-san:** after signature — screen title heads the page, forced region states, empty state reload, own test companies ([613d09d](https://github.com/phanlemanh/onehub-inventory/commit/613d09d375ea8195805d37f2128be2a587a8cbe2))
* **lop-rieng-cua-san:** round 1 — isolation over all five tables, matched unit key pinned, refusal sentences pinned, phone sheet pictures ([26ff867](https://github.com/phanlemanh/onehub-inventory/commit/26ff8676fe336feeb347bd7e20fd76adff550d1c))
* **ngan-chi-tiet-ghim-thanh-cot:** round 1 — sent proof, read-only buttons, focus only for a replaced row ([56dc1e9](https://github.com/phanlemanh/onehub-inventory/commit/56dc1e95215e20741d241372fb5b4cadc3bc1472))
* **ngan-chi-tiet-ghim-thanh-cot:** round 2 — Esc in an edited cell, break cases through the real checks, 480 px grid floor ([142f3fe](https://github.com/phanlemanh/onehub-inventory/commit/142f3fe68c1e1d3a002c3a4a16a61655b404f687))
* **proto:** 2c prototype confirms and names through the store's dialogs ([74d90e4](https://github.com/phanlemanh/onehub-inventory/commit/74d90e4fab76ba63b852d26d373971a52e01bbd3))
* **proto:** keep label words out of the 2c prototype; card overlay and design-pass record ([995e9cb](https://github.com/phanlemanh/onehub-inventory/commit/995e9cbbe6c7d32704dc7c0c141bf4fa45e8d053))
* **proto:** one item style for the whole second column in the 2c prototype ([c074313](https://github.com/phanlemanh/onehub-inventory/commit/c0743139ebac350f72f667b4bb903bb70bbe1670))
* **record-panel:** the grid keeps 480 px of its own region when the record is pinned ([0809449](https://github.com/phanlemanh/onehub-inventory/commit/0809449f031a65aca253e3d992883d0edb5a2c1f))
* **record-panel:** the scrolling record body takes keyboard focus ([ba2c5bc](https://github.com/phanlemanh/onehub-inventory/commit/ba2c5bc03c45ac73aec0dcac6bfd63722a472728))
* **sua-tren-o:** labels of the cell editors come from the page (module boundary); unit tests of the editors ([14b15ec](https://github.com/phanlemanh/onehub-inventory/commit/14b15eca9e526cfbe260b9dd1cf0886a891424b6))
* **sua-tren-o:** round 1 findings — block ledger, close date in Vietnam, rules from edit-rules, tests measure the real write path ([1653bec](https://github.com/phanlemanh/onehub-inventory/commit/1653bec1baad3a99a2ba75904e299ae11ebfe9e8))
* **sua-tren-o:** round 2 findings — editor stays on its cell near the right edge, unknown write faults roll the cell back ([6746646](https://github.com/phanlemanh/onehub-inventory/commit/67466464bde609ccdc372ab6641509a7c8e8c035))
* **thanh-vien-chon-tu-reui:** row 9 lock test skips without main history (S4 round 1) ([476666e](https://github.com/phanlemanh/onehub-inventory/commit/476666e8a81655f7e284fa787a8043074a8c3881))


### Performance Improvements

* **ci:** the database job's signed-out run leaves out the slowed copy the e2e job already runs ([bd6a6c1](https://github.com/phanlemanh/onehub-inventory/commit/bd6a6c153cb2bb1499cf94549f1313f0768d0bc6))


### Reverts

* **proof-gate:** drop the file ceiling of af19856 until the owner rules on test timeouts ([7a73cf3](https://github.com/phanlemanh/onehub-inventory/commit/7a73cf32094196b6ee452f694ac10a3eea921e5b))

## Changelog

All notable changes to this project are documented here.
This file is maintained automatically by release-please from Conventional Commits.

## Unreleased

- The shared grid has no region search box: filter by the always-shown row of boxes under the column headers; column filters and the top bar's ⌘K box ignore Vietnamese marks (row 2e).
- Saved views no longer keep search text: migration 011 drops the stored chữ tìm from old views (owner ruling 2026-11-13, rows 2c and 2e).
