---
schema_version: 1
feature: Ba luật lint giao diện của kho chặn được mọi mẫu thử mà công cụ thiết kế dùng để xác nhận luật giữ quyết định — khoảng cách tự viết giá trị, tên lớp ghép bằng dấu cộng, và ngoại lệ lint không lý do cho mọi luật kể cả tắt cả tệp
slug: sua-ba-luat-lint-giao-dien
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-26
design_doc: docs/superpowers/specs/2026-11-26-sua-ba-luat-lint-giao-dien-design.md
---

# Acceptance Contract: sua-ba-luat-lint-giao-dien

## Context

Ngày 26/11 cuộc kiểm tra hệ thiết kế (design-assembly 0.69.0) chạy lại lint của kho trên các mẫu cố ý phạm luật và thấy ba
luật mà sổ quyết định khai là giữ lại để lọt mẫu: `spacing` (luật `onehub-ui/no-off-scale-spacing` không bắt `p-[13px]`),
`whole-class-names` (`onehub-ui/no-partial-class` không bắt `"text-" + tone`) và `lint-exceptions`
(`onehub-ui/require-disable-reason` chỉ xét luật `onehub-ui/*`, và báo cáo của nó trên chính dòng `/* eslint-disable */`
bị ESLint nuốt). Chú thích trong bài kiểm cũ nói một công cụ riêng bắt ca ấy sau ESLint; công cụ đó không có trong kho.
Hồ sơ `design-assembly-adopt-checks` từng hoãn việc sửa ba luật này. Vòng này sửa ba luật, nối bộ hậu xử lý
`onehub-ui/reasons` vào cấu hình lint, ghi lý do cho hai ngoại lệ cũ ở `data-region.tsx`, và để công cụ thiết kế ghi ba
quyết định sang «giữ». Mã đã viết xong trên nhánh `fix/eslint-ui-rule-gaps` (PR #123) trước khi mở hồ sơ; hồ sơ mở vì
cổng trước-gộp đòi hồ sơ cho đường T3 `tools/**`.

Source input: prompt (chủ kho 26/11: «Sửa ở đây», rồi «Chạy nghiệm thu cho PR #123»).

## Criteria

- AC-1: Given cấu hình lint của kho ở HEAD, When lint tám đoạn mã màn viết giá trị trong ngoặc vuông — ba lớp khoảng
  cách (`p-[13px]`, `gap-[7px]`, `md:-mt-[3px]`) và năm lớp kích thước (`w-[200px]`, `h-[37px]`, `size-[18px]`,
  `min-w-[10rem]`, `lg:max-h-[50vh]`), có và không có tiền tố màn hình —, Then luật `onehub-ui/no-off-scale-spacing` báo
  lỗi ở cả tám; và đoạn đối chứng chỉ dùng bước của thang (`p-3 gap-2`) không bị luật ấy báo.
- AC-2: Given cấu hình lint của kho ở HEAD, When lint chín đoạn mã màn ghép tên lớp bằng dấu cộng không có khoảng trắng
  — chuỗi bên trái trên `div` và trên `Button`, chuỗi bên phải trên `className` và trong `cn(...)`, trong nhánh của `? :`,
  của `&&` và của `||`, và trong `clsx(...)`, `cva(...)` —, Then luật `onehub-ui/no-partial-class` báo lỗi ở cả chín; và
  hai đoạn đối chứng ghép quanh khoảng trắng (`"p-4 " + x`, `x + " p-4"`) không bị báo.
- AC-3: Given cấu hình lint của kho ở HEAD, When lint năm ngoại lệ `eslint-disable-next-line` không lý do cho luật ngoài
  `onehub-ui` (`shadcn/no-arbitrary-values`, `no-restricted-imports`, `shadcn/no-restyle`, `shadcn/no-inline-styles`,
  `react-hooks/exhaustive-deps`), Then luật `onehub-ui/require-disable-reason` báo lỗi ở cả năm; và cùng ngoại lệ có
  ` -- <lý do>` không bị báo.
- AC-4: Given cấu hình lint của kho ở HEAD (inline config bật như lint thật), When lint bốn ngoại lệ không lý do mà tự tắt
  lint trên chính dòng của nó (`/* eslint-disable */`, `// eslint-disable-line` trần, `// eslint-disable-line no-console`,
  `/* eslint-disable onehub-ui/require-disable-reason */`), Then mỗi đoạn có đúng MỘT báo lỗi của
  `onehub-ui/require-disable-reason`; và hai đoạn có lý do (`/* eslint-disable -- … */`,
  `// eslint-disable-line no-console -- …`) không bị báo. Bộ hậu xử lý không đổi gì khác: ngoại lệ có lý do cho
  `shadcn/no-inline-styles` vẫn tắt được báo lỗi của luật ấy (đã chứng luật ấy báo khi không có ngoại lệ), và lint có sửa
  tự động trên tệp màn vẫn sửa (gỡ một ngoại lệ thừa).
- AC-5: Given cây ở HEAD, When chạy công cụ thiết kế của kho (`tools/design-assembly/check.mjs --rate`), công cụ tự chạy
  lại mẫu thử của nó qua lint của cây, Then ba quyết định `spacing`, `whole-class-names`, `lint-exceptions` hiện là
  «held … re-run here» bởi đúng luật của mình, và lệnh thoát 0.
- AC-6: Given nhánh ở HEAD, When chạy `make check` và `npm run build`, Then cả hai thoát 0 — gồm lint cả kho không lỗi
  (hai ngoại lệ ở `src/components/candidate/data-region.tsx` đã có lý do) và bước `design-assembly` báo các quyết định
  giữ được; và có một trang `wiki/decisions/` ghi quy ước «mọi ngoại lệ lint có lý do», trỏ dòng sổ
  `d-20261126T061152Z-5`.
- AC-7: Given mỗi phép đo E1–E5 và E10 của hồ sơ, When chạy nó trên bản lành rồi trên bản phá (bản phá đặt lại đúng tệp
  luật, tệp plugin hay tệp cấu hình của điểm gộp với `main`; hai bản phá bộ hậu xử lý — gỡ nhãn của mọi luật, tắt sửa tự
  động; với E5 là một worktree của HEAD mang luật của điểm gộp; với E10 là thư mục quyết định trống), Then bản lành xanh
  và mỗi bản phá đỏ với thông điệp ghim trong `evals.yaml`; mọi phép đo in gốc cây nó đo.

## Coverage

Không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan». Không gian là ma trận dưới, liệt kê trọn từ ba dòng
mà công cụ thiết kế báo «lọt».

| Trục                                                                                 | Tiêu chí              |
| ------------------------------------------------------------------------------------ | --------------------- |
| Quyết định: khoảng cách · tên lớp viết liền · ngoại lệ có lý do                      | AC-1 · AC-2 · AC-3, AC-4 |
| Mẫu thử của công cụ, đúng như nó in «lọt» ngày 26/11: `p-[13px]`, `gap-[7px]` · `<div className={"text-" + tone} />`, `<Button className={"text-" + tone}>` · `// eslint-disable-next-line shadcn/no-arbitrary-values`, `no-restricted-imports`, `shadcn/no-restyle`, `shadcn/no-inline-styles`, `/* eslint-disable */` | AC-1 · AC-2 · AC-3, AC-4 |
| Họ lớp: khoảng cách · kích thước; có · không tiền tố màn hình                          | AC-1                  |
| Dạng ghép: chuỗi trái · chuỗi phải · `? :` · `&&` · `\|\|`; chỗ đọc: `className` · `cn` · `clsx` · `cva` | AC-2 |
| Tác dụng phụ của bộ hậu xử lý: luật khác vẫn tắt được · sửa tự động vẫn chạy          | AC-4                  |
| Chiều: phải chặn · không chặn quá tay (đối chứng)                                    | AC-1–AC-4             |
| Chỗ ghi nhận: kết luận của công cụ thiết kế khi chạy lại · trang quyết định trong wiki | AC-5 · AC-6           |
| Không vỡ gì: lint cả kho, bản dựng, bộ kiểm của kho                                  | AC-6                  |
| Phép đo có biết đỏ không                                                             | AC-7                  |

## Out of scope

- Đổi luật lint khác của `onehub-ui` hay của `shadcn`; gỡ các cảnh báo lint sẵn có.
- Áp luật lý do cho tệp ngoài mã màn (`tools/`, `tests/`, `*.mjs`) hay cho thư mục của nhà cung cấp (`src/components/ui`,
  `src/components/reui`) — luật giữ đúng phạm vi tệp màn như trước.
- Hai câu hỏi về công cụ ngoài đang chờ ở `design/waiting/`, dòng nguồn phông chữ Inter, và việc xuất hệ thiết kế ra
  Claude Design.

## Notes

- Known limits (khai trước): (1) AC-1–AC-4 đo bằng các đoạn mã mẫu lint như một tệp màn, không phải quét mọi cách viết có
  thể; công cụ thiết kế chạy lại bộ mẫu của nó ở mỗi lần `make check`. (2) Luật tên lớp chỉ đọc thuộc tính `className` và
  lời gọi `cn`/`clsx`/`cva`; một tên lớp ghép rồi gán qua biến trung gian không bị bắt. (3) Bộ hậu xử lý gỡ nhãn «đã tắt»
  chỉ cho báo cáo của luật lý do, nên không ngoại lệ nào tự miễn được việc ghi lý do.
