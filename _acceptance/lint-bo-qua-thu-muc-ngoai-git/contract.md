---
schema_version: 1
feature: Lint và bộ chạy bài kiểm của kho bỏ qua hai thư mục ngoài git (.acceptance-runs/ và .claude/worktrees/) để bộ kiểm và hook trước commit không đỏ vì tệp không thuộc kho
slug: lint-bo-qua-thu-muc-ngoai-git
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [config]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-21T13:20:56Z
design_doc: docs/superpowers/specs/2026-11-21-lint-bo-qua-thu-muc-ngoai-git-design.md
---

# Acceptance Contract: lint-bo-qua-thu-muc-ngoai-git

## Context

`npm run lint` quét cả cây từ gốc, gồm hai thư mục không thuộc kho: `.acceptance-runs/` (thư mục chạy của vòng nghiệm thu
và của đợt điều phối) và `.claude/worktrees/` (worktree của dãy và của phiên). Ngày 21/11 `make check` ở kho chính đỏ 54
lỗi, toàn bộ từ hai thư mục ấy; sổ của năm hồ sơ trước ghi lượt chấm 1 đỏ vì cùng nguyên nhân. Bộ chạy bài kiểm (Vitest)
cũng gom tệp ở đó: ở kho chính nó gom 476 tệp bài kiểm của các worktree lồng bên trong (đo 21/11, `vitest list`). Vòng này
thêm hai thư mục vào danh sách bỏ qua của ESLint, Prettier và Vitest, không đổi luật nào. Nhánh cắt từ `origin/main` ở
`799ae9dc`.

Source input: prompt (chủ kho duyệt 21/11 «Làm cả ba», mục «bộ kiểm ở kho chính trên máy đang đỏ»).

## Criteria

- AC-1: Given cấu hình ESLint của kho ở HEAD, When hỏi `ESLint#isPathIgnored` ba đường `.acceptance-runs/x/a.mjs`,
  `.claude/worktrees/w/src/app/page.tsx` và `.claude/worktrees/w/.next/chunk.js`, Then cả ba trả lời «bỏ qua».
- AC-2: Given `.gitignore` và `.prettierignore` của kho ở HEAD, When hỏi `prettier.getFileInfo` cùng ba đường ấy, Then cả
  ba trả lời «bỏ qua»; và khi chỉ đọc `.prettierignore`, hai đường đầu (một đường mỗi thư mục) vẫn «bỏ qua».
- AC-3: Given ma trận đối chứng viết trước trong `evals.yaml` (đường trong cây: mã sản phẩm, bài kiểm, công cụ, hook và
  skill của agent, phép đo của hồ sơ nghiệm thu), When hỏi ESLint và Prettier từng đường ở HEAD, Then trạng thái «bỏ qua»
  của từng đường đúng bằng giá trị ghi trong ma trận — là giá trị đo ở `799ae9dc` trước khi sửa.
- AC-4: Given một tệp `.mjs` sai cả luật ESLint lẫn định dạng Prettier (đã chứng khi không gì bỏ qua nó) đặt ở ba chỗ tạm `.acceptance-runs/<tạm>/`, `.claude/worktrees/<tạm>/` và
  `.claude/worktrees/<tạm>/.next/`, When chạy `npm run lint` từ gốc cây, Then lệnh thoát 0 và không dòng nào của đầu ra
  nêu ba tệp ấy; ba chỗ tạm được gỡ sau khi đo, kể cả khi phép đo đỏ.
- AC-5: Given nhánh ở HEAD, When chạy `make check`, Then thoát 0.
- AC-6: Given mỗi phép đo `lnt_*` của hồ sơ, When chạy nó trên vật lành rồi trên bản phá (cấu hình của kho bỏ đi hai mục
  mới), Then vật lành xanh và bản phá đỏ với thông điệp ghim trong `evals.yaml`; mọi phép đo in gốc cây nó đo, và gốc ấy là
  cây đang chấm.
- AC-7: Given ở mỗi thư mục ngoài git một bộ tệp mà mỗi bước của `make check` sẽ đỏ nếu đọc phải (bài kiểm hỏng, lỗi kiểu,
  trang wiki sai khuôn, màn phạm luật giao diện, tệp `.mjs` sai luật), When chạy `make check` từ gốc cây, Then thoát 0 và
  không dòng nào nêu các tệp ấy; thư mục tạm được gỡ sau khi đo, kể cả khi đỏ.

## Coverage

Không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan». Không gian là ma trận dưới, liệt kê trọn.

| Trục                                                                            | Tiêu chí   |
| ------------------------------------------------------------------------------- | ---------- |
| Công cụ: ESLint · Prettier · Vitest · các bước còn lại của `make check`          | AC-1, AC-2 · AC-7 · AC-7 |
| Thư mục ngoài git: `.acceptance-runs/` · `.claude/worktrees/` · bản dựng lồng trong worktree | AC-1, AC-2, AC-4 |
| Chiều: phải bỏ qua · không được bỏ quá tay                                      | AC-1, AC-2 · AC-3 |
| Cách đo: hỏi công cụ · chạy lệnh thật của kho                                   | AC-1–AC-3 · AC-4, AC-5, AC-7 |
| Phép đo có biết đỏ không                                                        | AC-6       |

## Out of scope

- Sửa chỗ kit đặt bản chép kịch bản chấm và lõi đợt (gói feature-loop, dispatch): ghi đề xuất cho kit, không làm ở đây.
- Thêm `.claude/worktrees/` vào `.gitignore`; đổi `Makefile`, `package.json`, `tsconfig.json`, `.pre-commit-config.yaml`,
  `.github/workflows/` (bộ kiểm kiểu chỉ đọc các thư mục kê trong `tsconfig.json`, đo bằng AC-7).
- Gỡ các cảnh báo lint sẵn có trên `main`; đổi hay thêm luật lint.
- Dọn thư mục đợt hay worktree đang có trên máy.

## Notes

- Known limits (khai trước): (1) phép đo chạy trong worktree của nhánh, nơi không có thư mục đợt thật; ca kho chính được
  dựng lại bằng tệp sai luật đặt tạm. Sau khi gộp: chạy `make check` một lần ở kho chính trên `main` và ghi kết quả vào mô
  tả PR. (2) Mẫu bỏ qua neo ở gốc cây; một thư mục cùng tên nằm sâu hơn trong cây (không có hôm nay) vẫn bị quét.
- `eslint.config.js`, `.prettierignore` và `vitest.config.ts` do repo-setup quản; cả ba đã lệch bản mẫu từ trước vòng này.
