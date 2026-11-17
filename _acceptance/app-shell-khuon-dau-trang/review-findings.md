## Trong hợp đồng

- **E4 (AC-4) expects the account.spec 'khung-chua-dang-nhap' result, but its command never runs account.spec**
  AC: AC-4
  file: `_acceptance/app-shell-khuon-dau-trang/evals.yaml:31`
  severity: medium
  source: bugs
  detail: E4's `expected` says: "account.spec 'khung-chua-dang-nhap' opens the menu at all four sizes and sees the menuitem 'Đăng nhập' pointing to /login?next=%2F". Its command is `config:executors.script.app_shell_verve_e2e`, and `_acceptance/config.yaml` defines that as `npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts`. That list leaves out tests/e2e/account.spec.ts. This diff rewrote that test (signing in now goes through the account menu at the foot of the rail, tagged @cho, and its hash in tests/dang-nhap-giu-loi.test.ts was updated). E4 can therefore end with exit 0 and be marked passed without running the test whose result it claims. The run-log has no line for account.spec. The change to tests/e2e/ho-so-can.spec.ts (it now looks for the account at `[data-slot=app-shell-account]`) is also outside every app_shell_verve_* command. Only the full-suite e2e eval might reach either file. Fix: add tests/e2e/account.spec.ts, and ideally tests/e2e/ho-so-can.spec.ts, to `app_shell_verve_e2e`, or drop the account.spec claim from E4's `expected`.
  rationale: E4 is the check for AC-4 (account menu for signed-out and signed-in people at all four sizes), and it can pass without running the test that proves the signed-out menu, so AC-4 is not actually verified.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (assertion âm tính một mình): ⌘B 'không mở dải' không có đối chứng dương**
  Người dùng thấy gì: Phím tắt đóng mở thanh bên trên máy tính được kiểm bằng một phép thử chỉ xác nhận dải không mở. Nếu phím tắt hỏng hẳn thì phép thử vẫn báo đạt, nên một lỗi về sau có thể lọt qua mà không ai biết.
  Căn cứ: Người dùng hiện không bị ảnh hưởng gì, chỉ là lưới an toàn mỏng hơn cho các lần sửa sau; không mất dữ liệu và bổ sung phép thử sau cũng rẻ.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): bài unit đọc chuỗi lớp Tailwind thay cho cách hiển thị và hình học**
  Người dùng thấy gì: Hai phép thử nhỏ kiểm tên kiểu dáng thay vì kiểm nút và viền có thật sự hiện đúng chỗ. Phần hiển thị thật đã được các phép thử trình duyệt đo riêng, nên người dùng không bị ảnh hưởng.
  Căn cứ: Hậu quả với người dùng gần như bằng không vì phần hiển thị thật đã có phép đo khác; sửa thêm tốn công mà không bắt thêm lỗi nào.
  file: `tests/app-shell.test.tsx`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
