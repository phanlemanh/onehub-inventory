---
schema_version: 1
feature: Hook commit-msg của kho (tools/commit_msg.py) nhận đúng các tiêu đề commit kit nghiệm thu v3.0.0 tự viết — Gate 2 signoff, Veto, repin, wip(ban-giao) — để job conventional-commits không đỏ trên PR qua Cổng 2
slug: commit-msg-kit-subjects
owner:
risk_tier: T3
surfaces: [config, ci]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: commit-msg-kit-subjects

## Context

Từ khi PR 93 gộp (`499ee2cf`, repo-setup 0.10.1), job `conventional-commits` của `.github/workflows/pr-title.yml` chấm
mọi commit của một PR bằng các hook commit-msg của chính kho, lấy từ nhánh chính. Hook duy nhất thật sự chấm là
`tools/commit_msg.py`, và nó chỉ nhận Conventional Commits, tin của Git và hai tiền tố kit (`tri-thuc: `,
`design-floor S3: `). Kit nghiệm thu v3.0.0 còn tự viết bốn khuôn khác: `Gate 2 signoff: <slug> — <name>`,
`Veto: <slug> — <tên>`, `repin(<slug>): …` (lệnh signoff) và `wip(ban-giao): …` (plugin dispatch). Trên `main`, 12 commit
loại này bị hook từ chối, nên mọi PR đi qua Cổng 2 của kit sẽ đỏ ở job ấy. Hồ sơ `upgrade-repo-setup-0-10-1` đã đo điều
này, và chủ kho chấp nhận ở Hỏi-2 của hồ sơ ấy, sửa ở PR riêng: đây là PR đó. `tools/**` thuộc `risk_tiers.t3_paths`
nên hồ sơ là T3. Mức tự chủ `high`: chủ kho gộp.

Source input: lời chủ kho «Sửa tools/commit_msg.py trong PR riêng đi» (2026-11-20). Câu trả lời Hỏi-2 của
`upgrade-repo-setup-0-10-1` (`d-20261120T032232Z-3`). Các khuôn tiêu đề đọc từ bản cài của kit v3.0.0. Phản biện context
sạch ở `gap-probe.md`.

## Hỏi (chỉ chủ kho trả lời, ở Gate 1)

- **Hỏi-1: `wip` nhận đến đâu?** Kit chỉ viết `wip(ban-giao): …`. Trên `main` còn một commit
  `wip(dan-tu-excel): paste path from the clickable preview` (2026-11-15) do một phiên tự đặt tên, không phải khuôn của
  kit. Máy khuyên **chỉ nhận `wip(ban-giao): `**: luật chỉ mở đúng chỗ kit cần, việc dở khác vẫn viết theo Conventional
  Commits (`chore: …`). Lối khác: nhận mọi `wip(<phạm vi>): `. Khi ấy commit trên vẫn qua, còn AC-2, AC-3 và ma trận đổi
  theo (bỏ ca `wip(dan-tu-excel)` khỏi danh sách bị từ chối).

## Criteria

- AC-1: Given bản cài kit delivery-loop v3.0.0 (tìm qua `tools/kit-root.mjs`) và bảy khuôn trong `rang/matrix.mjs`,
  When đo `kit-subjects`, Then:
  - mỗi khuôn có nguyên văn trong tệp của kit mà ma trận ghi;
  - trên mọi plugin của bản cài, script commit với tin tự viết là đúng bốn script của ma trận cộng `kiem-ban-cai.mjs`
    (chỉ commit trong kho tạm nó tự dựng). Phép quét bắt mọi dạng: `-m`, `-qm`, `-am`, `-F`, `--message`, nháy đơn,
    nháy kép, template, `commitWip`;
  - mọi tệp `.md` của kit dặn commit đúng ba khuôn của lệnh signoff, cộng mục `index.md` (tên tệp, không phải tiêu đề);
  - `tools/commit_msg.py` thoát 0 trên tin dựng từ mỗi khuôn, cả khi đứng một mình lẫn khi có thân tin.
- AC-2: Given 32 tin trong `NEAR_MISSES` của ma trận, When đo `near-miss`, Then `tools/commit_msg.py` thoát 1 trên cả 32
  tin. Các tin gồm:
  - hai tin dò của job (một dấu chấm, 300 dấu chấm), tin rỗng, `update stuff`;
  - rỗng sau tiền tố, thiếu dấu cách sau dấu hai chấm, NBSP sau dấu hai chấm, dấu cách ở đầu;
  - sai hoa thường, `Gate 1`, thiếu ` — <tên>`, slug không theo khuôn `[a-z0-9-]+`;
  - `wip` không phạm vi hoặc phạm vi khác `ban-giao`;
  - ba tin nhiều dòng: tiêu đề kit ở dòng sau, hoặc dòng đầu sau một dòng chú thích `#`.
- AC-3: Given mọi commit không phải merge của `499ee2cf` (1393 commit; nền cố định trong ma trận), When so luật của cây
  với `tools/commit_msg.py` của `499ee2cf` (`history`), Then cây nhận thêm đúng 12 commit (7 `Gate 2 signoff`,
  5 `repin`). Cây không từ chối commit nào mà nền nhận. Cây còn từ chối đúng một commit: `wip(dan-tu-excel): …`.
- AC-4: Given khối dò và chấm của job `conventional-commits` (từ `own_error=` tới `# Merge commits (two parents)`), trích
  nguyên văn từ `pr-title.yml` và in sha256, chạy trong một checkout sạch của HEAD với pre-commit qua `uvx` (in phiên bản),
  When đo `commits-judged`, Then 8 hook chạy ở stage commit-msg; trên tin một dấu chấm chỉ `commit-message` trượt; phép
  dò vẫn tìm thấy hook từ chối; bảy tin kit được trả 0; `update stuff` và `wip(dan-tu-excel): …` được trả 1.
- AC-5: Given cây sau thay đổi, When chạy `make check`, Then thoát 0 với dòng `make check passed: …`,
  `Test Files  148 passed (148)` và `Tests  2476 passed | 2 skipped (2478)`. Nền đo trên `499ee2cf` là
  `Tests  2466 passed | 2 skipped (2468)`; mười bài thêm là các ca của AC-8, và số bài bỏ qua giữ 2.
- AC-6: Given diff của PR so với nền, When đo `change-set`, Then:
  - PR đổi `tools/commit_msg.py`, `tests/commit-msg.test.ts`, một tệp dưới `wiki/log/`, hồ sơ này và tệp của vòng chấm;
  - PR không chạm `.pre-commit-config.yaml`, `.github/**` hay `governance/**`;
  - mọi commit không phải merge của PR qua `tools/commit_msg.py` của nền, vì job chấm PR này bằng luật của nền. Commit
    chữ ký của PR này vì vậy viết theo Conventional Commits, không theo khuôn `Gate 2 signoff: …` của kit.
- AC-7: Given `rang/two-way.mjs`, When chạy `node --test`, Then 18 bài đạt. Năm phép đo xanh trên cây. Mười ba bản phá,
  mỗi bản đỏ đúng điều nó canh:
  - `tools/commit_msg.py` của nền;
  - kit thôi viết một khuôn;
  - kit thêm một script commit bằng `-qm`;
  - một lệnh `.md` của kit dặn commit một tiêu đề khác;
  - tiền tố nhận chữ rỗng;
  - luật đọc mọi dòng thay vì dòng đầu;
  - `repin` nhận mọi phạm vi;
  - `wip` nhận mọi phạm vi;
  - mất một tiền tố cũ;
  - luật nhận mọi tin (khối của job);
  - một tệp ngoài thay đổi, hoặc `.pre-commit-config.yaml`;
  - một commit của PR chỉ luật mới nhận;
  - tệp bài kiểm bỏ một ca cũ.
- AC-8: Given `tests/commit-msg.test.ts` của cây và của nền, When đo `test-cases`, Then mọi ca của nền còn nguyên, cùng
  danh sách và cùng thứ tự. Cây thêm đúng 4 ca nhận (`TEST_NEW_OK`) và 6 ca từ chối (`TEST_NEW_BAD`, có một ca nhiều
  dòng), không thêm ca nào khác.

## Coverage

Quét theo trục, mỗi giá trị một tiêu chí:

- Nguồn tiêu đề: lệnh signoff của acceptance-gate (Gate 2 signoff, Veto, repin) → AC-1; script của acceptance-gate
  (tri-thuc, design-floor S3) → AC-1, AC-3; dispatch (wip ban-giao) → AC-1; người viết → AC-3 (lịch sử), AC-8 (ca cũ).
  [thước: tệp của bản cài kit v3.0.0, quét mọi plugin]
- Dạng tin: đúng khuôn → AC-1; có thân tin → AC-1; gần đúng, khoảng trắng lạ, slug lạ → AC-2; nhiều dòng → AC-2; rỗng,
  tin dò → AC-2.
- Nơi chấm: hook cục bộ (`git commit`) → AC-1, AC-2, AC-5; job CI sau khi gộp → AC-4; job CI trên chính PR này (luật
  nền) → AC-6.
- Hồi quy: mọi commit đã có → AC-3; ca kiểm cũ → AC-8; cả bộ kiểm → AC-5.
- Thước của chính hồ sơ: hai chiều → AC-7; phạm vi tệp → AC-6.

## Out of scope

- `.pre-commit-config.yaml` và job `conventional-commits` giữ nguyên: chỉ luật của hook đổi.
- Không viết lại lịch sử: 12 commit trên `main` giữ nguyên tiêu đề, và job chỉ chấm commit của PR.
- Không đổi khuôn tiêu đề của kit: đó là việc của kho delivery-loop.
- Không nhận `wip(<phạm vi khác>)` (theo ngả máy khuyên ở Hỏi-1). Không nhận chữ hoa thường khác của các khuôn, và không
  nhận slug ngoài `[a-z0-9-]+`.
- Lệnh commit mà kit chỉ dặn tác tử tự đặt tin (ví dụ «commit design doc + contract + evals» của feature-loop) không
  thuộc phạm vi, vì tin ấy đã theo Conventional Commits. Commit trong kho tạm của `kiem-ban-cai.mjs` cũng vậy: kho ấy
  không phải kho này.
- PR đang mở mà đã đỏ ở job không tự xanh khi PR này gộp: job chỉ chạy lại khi PR ấy có sự kiện mới (push, sửa tiêu đề,
  mở lại).

## Notes

- Luật dự kiến, một dòng trong `tools/commit_msg.py`:
  `KIT = r"(tri-thuc: |design-floor S3: |Gate 2 signoff: [a-z0-9-]+ — \S|Veto: [a-z0-9-]+ — \S|repin\([a-z0-9-]+\): \S|wip\(ban-giao\): \S)"`.
  Bốn khuôn mới bám đúng khuôn của kit: slug kebab, ` — ` rồi tên, và ít nhất một ký tự sau tiền tố. Hai khuôn cũ giữ
  nguyên chữ, để không đổi gì với commit đã có. Luật vẫn chỉ đọc dòng đầu không phải chú thích.
- Job chạy từ nhánh chính. Sau khi gộp, lượt đầu chạy luật mới là sự kiện kế tiếp của một PR có tiêu đề kit. AC-4 đo
  khối chấm ấy trên cây của PR này, trong checkout sạch, với pre-commit của `uvx`. Trên runner job gọi
  `pipx run pre-commit`, có thể là phiên bản khác: chưa đo trên runner.
- `two-way.mjs` phá luật bằng các chuỗi của dòng dự kiến ở trên. Dòng thật khác chữ thì bài phá báo «the break did not
  apply», chứ không lặng lẽ xanh.
- Các tiêu đề mẫu dùng `vi-du-ho-so` và `[Tên]`, không dùng tên người thật.
- `Gate 2 signoff:` không mang loại Conventional Commits; `Veto:` và `repin(…):` đọc như loại lạ. `release-please`
  (`.github/workflows/release.yml`) bỏ qua commit không mang loại nó biết: Release trên `499ee2cf` vẫn xanh với 12 commit
  như thế đã có. Điều này đọc từ lần chạy ấy, hồ sơ không đo riêng.
