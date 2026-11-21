## Trong hợp đồng

- **Hình dạng 4 (assertion âm tính một mình): E7 kiểm make check xanh mà không có đối chứng dương cho từng tệp cấy, ba trong năm tệp không bao giờ bị đọc**
  file: `_acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs:81`
  severity: high
  AC: AC-7
  source: measurement
  detail: AC-7 hứa rằng ở mỗi thư mục ngoài git có một bộ tệp mà mỗi bước của make check sẽ đỏ nếu đọc phải. Nhánh make check (dòng 81-103) chỉ đòi hai điều: exit 0, và không dòng nào nêu tag. Nó không chứng trước rằng mỗi tệp trong PLANT (dòng 23-29) làm bước của nó đỏ khi bước ấy đọc tới. chay-that.mjs có làm việc này (dòng 45-55), kiem-tron thì không. Ở cây này, ba tệp cấy không thể làm đỏ gì vì không bước nào đọc tới chỗ đặt chúng:
  - `src/planted.ts`: tsc chỉ đọc `src` và `tests` ở gốc (tsconfig.json `include`), nên `.claude/worktrees/<tag>/src/planted.ts` và `.acceptance-runs/<tag>/src/planted.ts` không vào typecheck dù có bỏ qua hay không.
  - `wiki/entities/planted.md`: tools/wiki_lint.py chỉ quét `root/wiki` (dòng 179 và 208).
  - `tests/planted.test.ts`: chỉ phần này có chiều đỏ, qua `--liet-ke --pha` trong two-way.mjs dòng 104-111, và chiều đỏ ấy hỏi `vitest list` chứ không chạy make check.
  Vì vậy dòng xanh "make check exit 0 with 5 planted files in each of 2 out-of-git folders; none named" đúng theo cách dựng ở các bước typecheck và ontology/wiki. Nó không chứng được rằng cấu hình bỏ qua có tác dụng. Thêm vào đó, two-way.mjs không có ca nào chạy kiem-tron ở chế độ make check (ca E7 xanh dòng 97-102 cũng chỉ dùng `--liet-ke`), nên khẳng định "mỗi bước" không có ca đỏ nào ghim thông điệp, ngoài bước Vitest.
  rationale: AC-7 đòi một bộ tệp mà mỗi bước của make check sẽ đỏ nếu đọc phải; finding chỉ ra ba tệp cấy không bước nào đọc tới nên điều kiện Given của AC-7 không được chứng và phép đo xanh không chứng được gì.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
