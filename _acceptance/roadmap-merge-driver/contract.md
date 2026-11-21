---
schema_version: 1
feature: Gộp nhánh chính vào nhánh PR không vấp trang máy sinh LO-TRINH.html (một dòng .gitattributes + đoạn dạy dựng máy), thước của hồ sơ ra khỏi phạm vi quét CodeQL, và ghi quyết định nhịp nâng repo-setup
slug: roadmap-merge-driver
owner:
risk_tier: T2
surfaces: [config, ci, docs]
status: implemented
approved_by: Phan Le Manh
approved_at: 2026-11-21
design_doc: docs/superpowers/specs/2026-11-21-roadmap-merge-driver-design.md
---

# Acceptance Contract: roadmap-merge-driver

## Context

Ba việc ở phía kho, lấy từ kế hoạch 12 mục mà chủ kho duyệt ngày 21/11/2026 ở kho `delivery-loop`
(`migration/KE-HOACH-12-MUC-REPO-STANDARDS.md`, commit `f575b7fc`, bước 0.4–0.6). Vòng không sửa plugin của kit và không
nâng bản kit.

- **K1.** `LO-TRINH.html` là trang máy vẽ lại cả tệp, nên hai nhánh cùng vẽ là xung đột. Số của phiên giữ đợt kho
  `delivery-loop` (phát lại 168 lần gộp nhánh chính vào nhánh PR từ 10/11, trên `8e0a91c9`): 134 lần xung đột, 126 lần
  dính tệp này; có dòng `merge=generated-file` thì còn 63. Hồ sơ này không đo lại con số ấy.
- **K6.** Bốn cảnh báo CodeQL đang mở (#9, #12, #15, #16) đều ở `_acceptance/<hồ sơ>/rang/lib.mjs`.
- **K9.** Bốn vòng nâng repo-setup trong bốn ngày, hạng đọc từ hợp đồng: 0.9.0 T3 · 0.10.1 T2 · 0.10.2 T3 · 0.10.3 T3.

`.gitattributes` không thuộc `t1_skip_globs` nên hồ sơ là T2. `.github/workflows/security.yml` cũng T2 ở thang của kit;
ở `governance/autonomy.yaml` nó là mức `high`. Chủ kho gộp.

Source input: câu giao của phiên giữ đợt kho `delivery-loop` (21/11/2026) và kế hoạch 12 mục nêu trên. Thiết kế:
`docs/superpowers/specs/2026-11-21-roadmap-merge-driver-design.md`. Phản biện context sạch: `gap-probe.md`.

## Hỏi (chỉ chủ kho trả lời, ở Gate 1)

Trả lời ngày 2026-11-21: chủ kho duyệt và nhận cả ba khuyến nghị. Hỏi-1: mốc là lần kho nhận một mốc của kit nghiệm thu.
Hỏi-2: K6 đi cùng vòng này, máy chạy `git apply` đúng tệp vá. Hỏi-3: đoạn dạy dựng máy ở `docs/START-HERE.md`.

- **Hỏi-1: «mốc» trong quyết định nhịp nâng là mốc nào?** Chữ của chủ kho: «gom theo mốc, trừ bản vá chữa lỗi kho đang
  vấp». Máy khuyên ghi: **mốc là lần kho này nhận một mốc của kit nghiệm thu (3.1, 3.2…)**; một vòng nâng repo-setup đi
  cùng dịp ấy và lấy bản mới nhất lúc đó. Lối khác: mốc là bản minor của chính repo-setup (0.11.0, 0.12.0…). Chọn lối
  khác thì chỉ câu định nghĩa ở trang 0046 và dòng kỳ vọng của AC-5 đổi.
- **Hỏi-2: K6 có đi cùng vòng và PR này không, và máy áp bằng đường nào?** `AGENTS.md` giao `.github/workflows/` cho
  người, và `.claude/settings.json` cấm công cụ sửa tệp của máy ở thư mục ấy. Máy khuyên: **có; máy chạy `git apply` đúng
  tệp vá `_acceptance/roadmap-merge-driver/security-yml.patch`** (bốn dòng ở mục Notes), không sửa gì khác trong
  `.github/`. Đường này đi qua lệnh cấm nói trên, nên chỉ đi khi chủ kho duyệt câu này. Hồ sơ `ci-co-postgres` đã đi
  đúng đường ấy: chủ kho duyệt bản vá ở cổng này, rồi máy áp. Lối khác: chủ kho tự commit bốn dòng, máy chỉ đo AC-6; hoặc
  tách thành vòng riêng (thêm hai lượt chạy trọn bộ kiểm và một lượt duyệt). Tách vòng thì AC-6 rời hồ sơ và AC-7 đổi
  danh sách tệp.
- **Hỏi-3: đoạn dạy dựng máy đặt ở đâu?** Không câu nào của kho quyết việc này. Máy khuyên: **`docs/START-HERE.md`, tiếng
  Việt**: không thêm tệp nào lệch với mẫu repo-setup, và chú thích trong `.gitattributes` trỏ tới trang này. Lối khác:
  thêm đoạn (tiếng Anh) vào mục Setup của `CONTRIBUTING.md`, nơi kho dạy `make setup`; đổi lại thêm một tệp lệch mẫu ở
  mỗi vòng nâng repo-setup. Chọn lối khác thì AC-4 và AC-7 đổi tên tệp.

## Criteria

- AC-1: Given `.gitattributes` của cây và của nền (`git merge-base HEAD origin/main`), When đo `attr`, Then:
  - dòng `LO-TRINH.html merge=generated-file` đứng ngay sau dòng `PRODUCT-MAP.md merge=generated-file`;
  - `git check-attr merge` trả `generated-file` cho `LO-TRINH.html` và `PRODUCT-MAP.md`, `union` cho `wiki/log.md`,
    `unspecified` cho `README.md` và `package.json`;
  - mọi dòng của tệp nền còn nguyên và cùng thứ tự, trừ dòng chú thích đứng ngay trên khối; cây chỉ thêm dòng.
- AC-2: Given chín ca của `GOP` trong `rang/matrix.mjs`, mỗi ca dựng trên một kho tạm với `.gitattributes` của cây (hoặc
  bản bỏ dòng mới, làm đối chứng). Ở ca «Driver: có», driver được đặt bằng cách chạy chính script `prepare` rút từ
  `package.json` của cây trong kho tạm, rồi `git config --get merge.generated-file.driver` phải trả `true`. When đo
  `merge` (gộp nhánh chính vào nhánh), Then cả chín ca đúng kỳ vọng:

  | Ca | `.gitattributes` | Driver | Tệp, bên nào đổi | Kỳ vọng |
  | --- | --- | --- | --- | --- |
  | 1 | của cây | có | `LO-TRINH.html`, hai bên | gộp sạch, giữ bản của nhánh |
  | 2 | của cây | có | `PRODUCT-MAP.md`, hai bên | gộp sạch, giữ bản của nhánh |
  | 3 | của cây | có | tệp thường, hai bên | xung đột (driver không che xung đột khác) |
  | 4 | của cây | không | `LO-TRINH.html`, hai bên | xung đột (bản kéo chưa dựng máy) |
  | 5 | bỏ dòng mới | có | `LO-TRINH.html`, hai bên | xung đột (đối chứng: như hôm nay) |
  | 6 | bỏ dòng mới | có | `PRODUCT-MAP.md`, hai bên | gộp sạch (đối chứng dương) |
  | 7 | của cây | có | `LO-TRINH.html`, chỉ nhánh chính | gộp sạch, lấy bản của nhánh chính |
  | 8 | của cây | có | `wiki/log.md`, hai bên thêm dòng | gộp sạch, còn dòng của cả hai (`union` còn nguyên) |
  | 9 | nhánh: bỏ dòng mới · nhánh chính: của cây | có | `LO-TRINH.html`, hai bên | xung đột (nhánh mở trước vòng này: Git đọc `.gitattributes` của nhánh) |

- AC-3: Given một bản sao của cây ở HEAD (cây làm việc tạm của Git) và kit tìm qua `tools/kit-root.mjs`, When đo `redraw`,
  Then `product-map.mjs --check` thoát 0 trên bản sao; sau khi `LO-TRINH.html` của bản sao bị thay bằng bản cũ (bản ở nền)
  thì `--check` thoát khác 0 và nêu `LO-TRINH.html`; sau khi chạy `product-map.mjs --root <bản sao>` thì `--check` thoát
  0 và trang giống hệt trang của HEAD.
- AC-4: Given `docs/START-HERE.md`, `package.json`, `.gitattributes` và `_acceptance/config.yaml`, When đo `docs`, Then
  mục «Gộp nhánh chính và tệp máy sinh» của trang có đủ:
  - `make setup` (hoặc `npm install`) đặt driver, và lệnh đặt tay `git config merge.generated-file.driver true`. Lệnh
    này cũng là lệnh trong script `prepare` của `package.json`;
  - lệnh kiểm `git config --get merge.generated-file.driver`, kết quả `true`;
  - việc sau gộp: vẽ lại rồi commit. Lệnh vẽ trong trang là lệnh `executors.script.product_map` của kho bỏ `--check`;
  - hai tên tệp mà `.gitattributes` gắn `merge=generated-file`, không thừa không thiếu;
  - giới hạn: GitHub không chạy driver của máy, trang PR trên web vẫn báo xung đột;
  - giới hạn: nhánh mở trước khi dòng mới lên nhánh chính còn xung đột một lần, ở lần gộp nhánh chính đầu tiên.
  Chú thích trên khối của `.gitattributes` gọi tên cả hai tệp.
- AC-5: Given `wiki/decisions/0046-repo-setup-upgrades-per-milestone.md` và các hợp đồng `upgrade-repo-setup-*` có trong
  cây, When đo `decision`, Then:
  - trang có `type: decision`, đủ bốn mục `Status`, `Context`, `Decision`, `Consequences`; `Status` ghi `Accepted,
    2026-11-21` và chủ kho quyết;
  - mục `Decision` có nguyên văn «gom theo mốc, trừ bản vá chữa lỗi kho đang vấp» và câu định nghĩa mốc theo Hỏi-1;
  - bốn vòng nâng có mặt với hạng: 0.9.0 T3, 0.10.1 T2, 0.10.2 T3, 0.10.3 T3. Hạng trong trang bằng `risk_tier` của
    hợp đồng tương ứng với mọi hợp đồng có trong cây (thước in hợp đồng nào chưa có trong cây);
  - trang nói `risk_tiers` không đổi ở vòng này;
  - có đúng một tệp mới dưới `wiki/log/` nhắc trang 0046.
- AC-6: Given `.github/workflows/security.yml` của cây và của nền, When đo `codeql`, Then:
  - bước `github/codeql-action/init@v4` có khoá `config` với `paths-ignore` gồm đúng một mẫu `_acceptance/**/rang/**`;
  - so với nền, tệp chỉ thêm đúng bốn dòng của bản vá ở mục Notes, không bớt dòng nào;
  - mẫu khớp mọi tệp git theo dõi dưới `_acceptance/<hồ sơ>/rang/` (thước in số tệp), trong đó có bốn tệp của các cảnh báo
    #9, #12, #15, #16, và không khớp tệp nào khác của kho;
  - tiền đề «thước chỉ chạy lúc chấm»: không tệp nào trong danh sách bên gọi `BEN_GOI` của `rang/matrix.mjs`
    (`.github/workflows/**`, `Makefile`, `mk/**`, `package.json`, `.pre-commit-config.yaml`, `src/**`, `tests/**`,
    `tools/**`, `db/**`) nhắc tới một đường dẫn `_acceptance/<hồ sơ>/rang/` (thước in số tệp đã soát).
- AC-7: Given diff của nhánh so với nền, When đo `change-set`, Then:
  - nhánh chỉ đổi: `.gitattributes`, `docs/START-HERE.md`, `wiki/decisions/0046-repo-setup-upgrades-per-milestone.md`,
    một tệp dưới `wiki/log/`, `.github/workflows/security.yml`, thiết kế và kế hoạch của vòng dưới `docs/superpowers/`,
    hồ sơ này (gồm tệp vá `security-yml.patch`), `_acceptance/config.yaml`, và hai tệp máy vẽ `PRODUCT-MAP.md`, `LO-TRINH.html`;
  - `_acceptance/config.yaml` chỉ thêm dòng, mọi dòng thêm là một lệnh `rmd_*`; khối `risk_tiers` giống hệt nền;
  - nhánh không chạm `governance/**`, `.claude/**`, `package.json`, `tools/**`, `mk/**`, `Makefile`, và trong `.github/**`
    chỉ chạm `security.yml`.
- AC-8: Given `rang/two-way.mjs`, When chạy `node --test`, Then mọi bài đạt: bảy phép đo xanh trên cây, và mỗi bản phá đỏ
  đúng điều nó canh, với thông điệp ghim:
  - `.gitattributes` mất dòng mới; dòng mới đứng sai chỗ; một dòng cũ bị bỏ;
  - ca 1 của ma trận khi `.gitattributes` mất dòng mới; ca 5 khi dòng mới vẫn còn; script `prepare` mất lệnh đặt driver;
  - trang đã lệch mà vẫn được coi là khớp;
  - trang tài liệu mất lệnh đặt driver; nêu một lệnh vẽ khác lệnh của kho; thiếu câu giới hạn GitHub; thiếu câu giới hạn
    nhánh mở trước;
  - trang quyết định sai một hạng; mất một mục; mất câu của chủ kho;
  - mẫu `paths-ignore` rộng hơn (`_acceptance/**`); hẹp hơn (một hồ sơ); `security.yml` bớt một dòng cũ; một workflow
    gọi một tệp dưới `rang/`;
  - nhánh chạm một tệp ngoài danh sách; `risk_tiers` đổi; `config.yaml` bớt một dòng.
- AC-9: Given cây sau thay đổi, When chạy `make check`, Then thoát 0 với dòng `make check passed: …`; số tệp kiểm và số
  bài kiểm bằng nền (vòng không thêm bài kiểm của kho), không thêm bài bỏ qua.

## Coverage

Bộ quét không gian tiêu chí không chạy: xem dòng sổ «bỏ coverage-scan». Các trục viết tay:

- Tệp máy sinh: `LO-TRINH.html` → AC-1, AC-2 (ca 1, 4, 5, 7), AC-3; `PRODUCT-MAP.md` → AC-1, AC-2 (ca 2, 6).
- Bản kéo: đã dựng máy bằng script `prepare` thật → AC-2 (ca 1, 2); chưa dựng máy → AC-2 (ca 4), AC-4.
- Tuổi của nhánh: mở sau vòng này → AC-2 (ca 1); mở trước vòng này → AC-2 (ca 9), AC-4.
- Bên đổi tệp: hai bên → AC-2 (ca 1–6, 8, 9); chỉ nhánh chính → AC-2 (ca 7).
- Sau gộp: trang lệch và vẽ lại → AC-3; lời dạy → AC-4.
- Hồi quy thuộc tính cũ: `union`, lockfile, dòng cũ → AC-1, AC-2 (ca 3, 8).
- Phạm vi quét: tệp trong `rang/` → AC-6; tệp ngoài `rang/` vẫn được quét → AC-6; không bên nào ngoài lượt chấm gọi
  thước → AC-6.
- Quyết định: nội dung → AC-5; khuôn trang → AC-5, AC-9 (`make check` có bước kiểm wiki).
- Thước của chính hồ sơ: hai chiều → AC-8; tập tệp → AC-7; cả bộ kiểm → AC-9.

## Out of scope

- Xung đột ở `_acceptance/config.yaml` (30 lần trong số đo): để vòng kit DL1. Vòng này vẫn thêm dòng lệnh đo vào tệp ấy
  như mọi vòng.
- Không đổi `risk_tiers`, không đổi `governance/`. Đề xuất đổi hạng cho tệp do `apply.py` ghi chỉ nêu trong báo cáo cuối.
- Không sửa plugin của kit, không nâng bản kit, không đưa `LO-TRINH.html` ra khỏi git.
- Không đóng tay cảnh báo CodeQL nào; không sửa bốn tệp `lib.mjs` của các hồ sơ đã ký.
- Không chạy `/repo-setup:github`, không đổi cài đặt GitHub.
- Không thêm đoạn vào `CONTRIBUTING.md` hay `README.md` (do repo-setup ghi).

## Notes

- Bản vá của AC-6, đúng bốn dòng thêm vào bước `init` của job `codeql`:

  ```diff
         - uses: github/codeql-action/init@v4
           if: steps.scanning.outputs.on != 'false'
           with:
             languages: javascript-typescript
  +          # The measures of an acceptance record run only when a round is graded; they are not shipped.
  +          config: |
  +            paths-ignore:
  +              - "_acceptance/**/rang/**"
  ```

- Thước gọi lệnh bằng mảng đối số (`execFileSync(lệnh, [đối số])`), không ghép chuỗi lệnh.
- Driver là cấu hình của từng bản kéo (`.git/config`), không nằm trong kho. Mọi cây làm việc của cùng một bản kéo dùng
  chung cấu hình ấy.

Giới hạn đã biết:

- GitHub không chạy driver của máy: trang PR trên web vẫn báo xung đột ở `LO-TRINH.html`. Gộp nhánh chính ở máy rồi đẩy.
- Nhánh mở trước khi dòng mới lên nhánh chính còn xung đột một lần ở lần gộp nhánh chính đầu tiên (ca 9): Git đọc
  `.gitattributes` của nhánh. Từ lần gộp kế thì hết.
- Bốn cảnh báo CodeQL chỉ đóng ở lần quét kế trên `main` sau khi gộp: chưa đo được trước khi gộp. Tài liệu GitHub không
  nói rõ cảnh báo ở tệp vừa bị loại có tự đóng không.
- Con số 134 → 63 lần xung đột là số phát lại của phiên giữ đợt, hồ sơ này không đo lại. Thước sau gộp của kế hoạch: số
  lần xung đột ở tệp này trong 7 ngày kế.
- `.gitattributes` và `security.yml` do repo-setup ghi: vòng nâng repo-setup kế sẽ thấy hai tệp này lệch với mẫu.
