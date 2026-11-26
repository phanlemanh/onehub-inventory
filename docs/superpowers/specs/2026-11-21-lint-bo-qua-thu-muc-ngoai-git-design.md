# Lint bỏ qua hai thư mục ngoài git — design

Hồ sơ: `_acceptance/lint-bo-qua-thu-muc-ngoai-git/` · hạng T2 (`eslint.config.js` và `.prettierignore` không nằm trong
`t1_skip_globs` hay `t3_paths`) · 21/11/2026.

## Vấn đề

`npm run lint` chạy `eslint . && prettier --check .` từ gốc cây. Hai thư mục không thuộc kho nằm ngay trong cây làm việc:

- `.acceptance-runs/` — thư mục chạy của vòng nghiệm thu và của đợt điều phối. Ở kho chính nó chứa bản chép lõi đợt
  (`dieu-phoi-nen/loi/*.mjs`); ở worktree của dãy nó chứa bản chép kịch bản chấm của kit.
- `.claude/worktrees/` — nơi app đặt worktree của từng dãy và từng phiên.

Đo ngày 21/11 trên `main` (`799ae9dc`):

| Chỗ đo                                               | Kết quả                                                                                              |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Kho chính, `make check`                              | đỏ ở lint, 54 lỗi: 44 từ `.acceptance-runs/dieu-phoi-nen/loi/`, 10 từ một worktree cũ                |
| Worktree sạch, một tệp `.mjs` sai luật ở mỗi thư mục | ESLint báo lỗi ở `.acceptance-runs/`, ở `.claude/worktrees/<w>/` và ở `.claude/worktrees/<w>/.next/` |
| Cùng phép thử, Prettier                              | báo tệp ở `.claude/worktrees/`; không báo `.acceptance-runs/` (đã có trong `.gitignore`)             |

Hệ quả đã ghi trong sổ của năm hồ sơ trước: lượt chấm 1 đỏ vì ESLint quét bản chép kịch bản chấm trong thư mục chạy
(`khung-va-giao-dien`, `danh-muc-reui`, `danh-muc-reui-doc-chac`, `so-do-ghi-khong-mat-tang`, `cong-bat-khoi-khong-ke`).
Mỗi lần, phiên dời bản chép ra ngoài kho rồi chấm lại. Ở kho chính, hook trước commit chạy lint cả kho nên phiên giám
sát không commit được.

`.next/`, `test-results/` trong `globalIgnores` chỉ khớp ở gốc, nên bản dựng của một worktree lồng bên trong vẫn bị quét.

Bộ chạy bài kiểm cũng vậy (phát hiện ở bước phản biện): `vitest.config.ts` thay danh sách loại trừ mặc định bằng danh sách
riêng, nên Vitest gom mọi `*.test.*` dưới gốc. Ở kho chính, `vitest list` gom 476 tệp bài kiểm của các worktree lồng.
Đo với tệp cấy ở cả hai thư mục: `make check` qua lint rồi đỏ ở bước test, nêu bài kiểm cấy của cả hai. Các bước còn lại
không đọc hai thư mục: bộ kiểm kiểu chỉ đọc thư mục kê trong `tsconfig.json`, công cụ ranh giới và trang wiki đi từ `src/`
và `wiki/`.

## Approaches

1. **Thêm hai thư mục vào danh sách bỏ qua của hai công cụ (chọn).** `globalIgnores` của `eslint.config.js` thêm
   `.acceptance-runs/` và `.claude/worktrees/`; `.prettierignore` thêm hai dòng cùng tên. Mẫu neo ở gốc, phủ mọi thứ bên
   dưới, kể cả bản dựng của worktree lồng. Hai dòng mỗi tệp, không thêm phụ thuộc.
2. Đổi lệnh lint sang liệt kê thư mục cần quét (`eslint src tests tools …`). Loại: thư mục mới ở gốc sẽ không được quét
   mà không ai biết, và `package.json` là tệp dùng chung của mọi dãy.
3. Cho ESLint đọc `.gitignore` (`includeIgnoreFile` của `@eslint/compat`). Loại: thêm phụ thuộc mới vào
   `package-lock.json`, và `.claude/worktrees/` chỉ nằm trong `.git/info/exclude` của máy, không nằm trong `.gitignore`,
   nên vẫn bị quét.
4. Sửa ở kit để bản chép không nằm trong cây. Ngoài quyền của kho này; ghi đề xuất cho kit, không chờ nó.

Prettier: thêm vào `.prettierignore` thay vì `.gitignore`, vì `.gitignore` đổi cả cách git nhìn thư mục trên máy khác; ở
đây chỉ cần hai công cụ lint thôi quét.

## Cách làm

- `eslint.config.js`: hai mục mới trong `globalIgnores`.
- `.prettierignore`: hai dòng mới, kèm một dòng chú thích.
- `vitest.config.ts`: hai mục mới trong `test.exclude`.
- Không đổi luật nào, không đổi lệnh nào, không đổi `Makefile`, `package.json`, `tsconfig.json`, `.pre-commit-config.yaml`.

## Đo

Mọi phép đo ở `_acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/`, gọi qua `_acceptance/config.yaml`.

- **Hỏi thẳng hai công cụ** (không đặt tệp nào): API `ESLint#isPathIgnored` và `prettier.getFileInfo` trên một ma trận
  đường viết trước — ba đường phải bị bỏ qua, và một danh sách đường trong cây phải giữ nguyên trạng thái hôm nay
  (không bỏ quá tay).
- **Chạy thật**: đặt một tệp `.mjs` sai luật vào thư mục tạm bên trong hai thư mục ngoài git (ba chỗ, gồm cả `.next/`
  của một worktree giả), chạy `npm run lint`, đòi thoát 0, rồi gỡ thư mục tạm. Hai thư mục này nằm ngoài phần cây mà
  lượt chấm canh, nên phép đo không làm đổi cây.
- **Hai chiều**: mỗi phép đo chạy lại trên bản phá — cấu hình của kho bỏ đi hai mục mới, dựng trong bộ nhớ — và phải đỏ
  với thông điệp ghim.
- **Bộ kiểm trọn**: ở mỗi thư mục ngoài git cấy một bộ tệp mà mỗi bước của `make check` sẽ đỏ nếu đọc phải, chạy
  `make check`, đòi thoát 0 và không nêu tệp cấy. Chiều đỏ: Vitest với bản cấu hình bỏ hai mục mới gom bài kiểm cấy.
- `make check` xanh.

## Rủi ro

- Bỏ quá tay: một mẫu sai có thể làm lint thôi quét thư mục thật. Ma trận đối chứng trong cây canh điều này.
- Ba tệp do repo-setup quản (`.repo-setup.json` ghi băm bản mẫu). Cả ba đã lệch bản mẫu từ trước; lần nâng repo-setup
  sau gộp ba chiều như mọi lần.

## Sau khi gộp

Chạy `make check` một lần ở kho chính trên `main`, nơi có thư mục đợt thật, và ghi kết quả vào mô tả PR.
