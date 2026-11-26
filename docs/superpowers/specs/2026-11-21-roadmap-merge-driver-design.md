# Gộp nhánh chính không vấp `LO-TRINH.html`, phạm vi quét CodeQL, nhịp nâng repo-setup

Ngày 2026-11-21. Hồ sơ `_acceptance/roadmap-merge-driver`. Hạng T2.

## Ý định

Ba việc nhỏ ở phía kho, lấy từ kế hoạch 12 mục (K1, K6, K9) mà chủ kho duyệt ngày 21/11 ở kho `delivery-loop`
(`migration/KE-HOACH-12-MUC-REPO-STANDARDS.md`, commit `f575b7fc`). Nguyên tắc của kế hoạch: việc kho tự lo được thì kho
làm, không đổi kit. Vòng này không sửa plugin của kit và không nâng bản kit.

- **K1.** `LO-TRINH.html` là trang máy vẽ lại cả tệp. Hai nhánh cùng vẽ thì Git báo xung đột ở mỗi lần gộp nhánh chính
  vào nhánh PR. Phiên giữ đợt của kho `delivery-loop` phát lại 168 lần gộp như vậy từ 10/11 trên `origin/main`
  `8e0a91c9`: 134 lần có xung đột, 126 lần dính `LO-TRINH.html`; thêm một dòng `merge=generated-file` thì còn 63 lần.
  Đối chứng: `PRODUCT-MAP.md` từ 90 về 0 khi có dòng ấy.
- **K6.** Bốn cảnh báo CodeQL đang mở (#9, #12, #15, #16, luật `js/shell-command-injection-from-environment`) đều nằm ở
  `_acceptance/<hồ sơ>/rang/lib.mjs`. Thước của hồ sơ chỉ chạy lúc chấm, không giao cho người dùng.
- **K9.** Bốn vòng nâng repo-setup trong bốn ngày (18–21/11), ba vòng hạng T3. Chủ kho quyết nhịp: gom theo mốc, trừ bản
  vá chữa lỗi kho đang vấp.

## Hiện trạng

- `.gitattributes` đã có `PRODUCT-MAP.md merge=generated-file`. Chưa có dòng cho `LO-TRINH.html`.
- Driver `generated-file` là lệnh `true`: Git giữ bản của nhánh đang đứng. Script `prepare` của `package.json` đặt nó
  (`git config merge.generated-file.driver true`), nên `make setup` hay `npm install` là đủ. Bản kéo chưa chạy bước đó
  thì chưa có driver.
- Thử trên kho tạm (Git 2.50.1):

  | `.gitattributes` có dòng | Bản kéo có driver | Gộp khi hai bên cùng đổi `LO-TRINH.html` |
  | ------------------------ | ----------------- | ---------------------------------------- |
  | có                       | có                | sạch, giữ bản của nhánh                  |
  | có                       | không             | xung đột (Git rơi về gộp văn bản)        |
  | không                    | có                | xung đột, như hôm nay                    |

- Nhánh mở trước khi dòng mới lên nhánh chính: lần gộp nhánh chính đầu tiên vẫn xung đột, vì Git đọc `.gitattributes`
  của nhánh (chưa có dòng). Từ lần gộp kế thì hết. Thử trên kho tạm: nhánh chưa có dòng, nhánh chính có dòng, có driver
  → xung đột; chiều ngược lại (nhánh của chính vòng này) → gộp sạch.
- Sau lần gộp mà driver giữ bản của nhánh, trang thiếu phần nhánh chính vừa mang về. `product-map.mjs --check` (việc
  `gate` của CI) đỏ cho tới khi vẽ lại bằng `product-map.mjs --root .` rồi commit.
- GitHub không chạy driver của máy: trang PR trên web vẫn báo xung đột ở tệp này.
- CodeQL chạy trong `.github/workflows/security.yml`, bước `github/codeql-action/init@v4`, chưa có cấu hình đường dẫn.
  Tệp này thuộc `.github/**` (mức `high`), `AGENTS.md` giao cho người, `.claude/settings.json` cấm máy sửa.
- `.gitattributes`, `security.yml`, `CONTRIBUTING.md`, `README.md` đều do repo-setup ghi (`.repo-setup.json`).

## Phương án

**K1**

| Phương án                                     | Được                                     | Mất                                                              | Chọn     |
| --------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------- | -------- |
| Một dòng `LO-TRINH.html merge=generated-file` | rẻ, driver đã có ở máy chạy `make setup` | phải vẽ lại sau gộp; web vẫn báo xung đột                        | **chọn** |
| Đưa `LO-TRINH.html` ra khỏi git               | hết xung đột tận gốc                     | kit 3.0.0 đòi trang có mặt ở `--check`; là việc của vòng kit DL1 | không    |
| `merge=union`                                 | không cần driver                         | ghép dòng hai bên làm hỏng trang HTML                            | không    |

**Chỗ đặt đoạn dạy dựng máy (Hỏi-3).** Không câu nào của kho quyết việc này.

| Phương án                                  | Được                               | Mất                                              | Chọn           |
| ------------------------------------------ | ---------------------------------- | ------------------------------------------------ | -------------- |
| `docs/START-HERE.md`, tiếng Việt           | không thêm tệp lệch mẫu repo-setup | người vừa kéo kho ít đọc trang này hơn           | **máy khuyên** |
| Mục Setup của `CONTRIBUTING.md`, tiếng Anh | đúng chỗ kho dạy `make setup`      | thêm một tệp lệch mẫu ở mỗi vòng nâng repo-setup | lối khác       |

Ở cả hai lối, chú thích trong `.gitattributes` trỏ tới chỗ đặt.

**K6**

| Phương án                                              | Được                | Mất                                                          | Chọn     |
| ------------------------------------------------------ | ------------------- | ------------------------------------------------------------ | -------- |
| `paths-ignore` ngay trong bước `init` (khoá `config`)  | một tệp, bốn dòng   | `security.yml` lệch với mẫu repo-setup                       | **chọn** |
| Tệp `.github/codeql/codeql-config.yml` + `config-file` | cấu hình tách riêng | hai tệp, vẫn phải sửa workflow                               | không    |
| Sửa bốn `lib.mjs` cho hết cảnh báo                     | giữ lưới quét       | sửa thước của hồ sơ đã ký; vòng mới vẫn có thể thêm cảnh báo | không    |

Bản vá, đúng bốn dòng thêm:

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

Tài liệu GitHub: khoá `config` nhận một chuỗi YAML theo khuôn tệp cấu hình; `paths-ignore` có hiệu lực với
JavaScript/TypeScript; `**` được đứng giữa hai dấu gạch chéo hoặc ở cuối. Không đóng tay cảnh báo nào.

**K9.** Một trang `wiki/decisions/0046` theo khuôn `decision` của `ontology/page-types.yaml`, kèm một mục nhật ký wiki.
Không đổi `risk_tiers`.

## Ba câu chỉ chủ kho trả lời (Cổng Phạm vi)

- **Hỏi-1.** «Mốc» trong quyết định nhịp nâng là mốc nào? Máy khuyên: lần kho này nhận một mốc của kit nghiệm thu (3.1,
  3.2…), nâng repo-setup lên bản mới nhất cùng dịp. Lối khác: bản minor của chính repo-setup.
- **Hỏi-2.** K6 có đi cùng vòng và PR này không, và máy áp bằng đường nào? Máy khuyên: có; máy chạy `git apply` đúng tệp
  vá `_acceptance/roadmap-merge-driver/security-yml.patch`. Đường này đi qua lệnh cấm công cụ sửa tệp của
  `.claude/settings.json`, nên chỉ đi khi chủ kho duyệt; hồ sơ `ci-co-postgres` đã đi đúng đường ấy. Lối khác: chủ kho tự
  commit bốn dòng, hoặc tách vòng riêng.
- **Hỏi-3.** Đoạn dạy dựng máy đặt ở đâu? Máy khuyên: `docs/START-HERE.md`. Lối khác: mục Setup của `CONTRIBUTING.md`.

## Đo thế nào

Mỗi việc một thước riêng trong `_acceptance/roadmap-merge-driver/rang/`, mỗi thước có cặp hai chiều:

- thuộc tính của `.gitattributes` (dòng mới, dòng cũ còn nguyên);
- chín ca gộp trên kho tạm (tệp × driver × `.gitattributes` × tuổi của nhánh); driver do chính script `prepare` đặt;
- trang lệch thì `--check` đỏ, vẽ lại thì xanh, trên một bản sao của cây;
- đoạn tài liệu nêu đúng lệnh mà `package.json` và cấu hình của kho đang dùng;
- trang quyết định đúng khuôn, bốn hạng khớp hợp đồng của từng vòng nâng;
- `paths-ignore` phủ mọi tệp dưới `_acceptance/<hồ sơ>/rang/` và không tệp nào ngoài đó; không workflow, lệnh `make`,
  script hay mã nào của kho gọi một tệp dưới `rang/`;
- tập tệp của PR.

Thước gọi lệnh bằng mảng đối số, không ghép chuỗi lệnh.

## Không làm

- Không sửa `_acceptance/config.yaml` ngoài các dòng lệnh đo của vòng (phần xung đột 30 lần ở tệp này để vòng kit DL1).
- Không đổi `risk_tiers`, không đổi `governance/`, không chạy `/repo-setup:github`, không đổi cài đặt GitHub.
- Không đo lại con số 134 → 63: đó là số của phiên giữ đợt.
