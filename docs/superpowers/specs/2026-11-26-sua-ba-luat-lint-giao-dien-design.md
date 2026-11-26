# Ba luật lint giao diện chặn được mẫu thử của công cụ thiết kế

Ngày 2026-11-26. Hồ sơ nghiệm thu: `_acceptance/sua-ba-luat-lint-giao-dien/`. PR #123, nhánh `fix/eslint-ui-rule-gaps`,
cắt từ `main` ở `50314af6`.

## Vì sao

- Cuộc kiểm tra hệ thiết kế (design-assembly 0.69.0) chạy lại lint của kho trên các mẫu cố ý phạm luật. Ba quyết định mà
  sổ `design/decisions.yaml` khai là giữ bằng luật lint lại để lọt mẫu, nên công cụ chỉ tính chúng là «khai»:
  - `spacing`: `p-[13px]`, `gap-[7px]` lọt `onehub-ui/no-off-scale-spacing` (luật chỉ xét bước số, không xét ngoặc vuông);
  - `whole-class-names`: `className={"text-" + tone}` lọt `onehub-ui/no-partial-class` (luật chỉ xét chuỗi mẫu `${}`);
  - `lint-exceptions`: ngoại lệ không lý do cho luật ngoài `onehub-ui`, và `/* eslint-disable */`, lọt
    `onehub-ui/require-disable-reason`.
- Chú thích trong bài kiểm cũ nói ca `/* eslint-disable */` do một công cụ chạy sau ESLint bắt. Công cụ ấy không có trong kho:
  trước vòng này không gì chặn nó.
- Hồ sơ `design-assembly-adopt-checks` (23/11) từng hoãn việc sửa ba luật. Chủ kho bảo sửa ngày 26/11.

## Thay đổi

- `tools/eslint-ui/rules/no-off-scale-spacing.mjs`: thêm thông điệp `arbitrary` cho mọi giá trị trong ngoặc vuông ở các lớp
  khoảng cách và kích thước (cùng danh sách lớp với luật cũ).
- `tools/eslint-ui/rules/no-partial-class.mjs`: đọc chuỗi ghép bằng `+` (một chuỗi dính liền một giá trị không qua khoảng
  trắng), và đọc từng nhánh của `? :` và `&&`/`||`.
- `tools/eslint-ui/rules/require-disable-reason.mjs`: mọi ngoại lệ, cho bất kỳ luật nào, phải có ` -- <lý do>`.
- `tools/eslint-ui/index.mjs` + `eslint.config.js`: bộ hậu xử lý `onehub-ui/reasons` cho tệp màn. ESLint vẫn đưa báo cáo bị
  tắt sang bước hậu xử lý, chỉ gắn nhãn `suppressions`; bộ này gỡ nhãn ấy riêng cho báo cáo của luật lý do. Văn bản đi qua
  nguyên vẹn, sửa tự động vẫn chạy.
- `src/components/candidate/data-region.tsx`: hai ngoại lệ `react-hooks/exhaustive-deps` có lý do.
- `design/theme.json`, `.claude/rules/design-assembly.md`: công cụ thiết kế (adopt) ghi ba quyết định sang «giữ», và sửa
  trang quy tắc đang ghi phông chữ là `undefined`.
- Bài kiểm: thêm ca cho cả ba luật, và ca chạy với inline config bật như lint thật.
- `wiki/decisions/0049-*.md` (viết sau Cổng Phạm vi, theo câu trả lời của chủ kho ở Hỏi-1) và một dòng `make log`: quy ước
  «mọi ngoại lệ lint có lý do», để phiên sau tra được vì sao luật chặn.

## Lựa chọn

- Áp luật lý do cho mọi luật, không chỉ `onehub-ui`: dòng sổ là câu hỏi cho chủ kho (Hỏi), vì đó là đổi quy ước.
- Bắt `/* eslint-disable */` bằng bộ hậu xử lý trong ESLint, không bằng công cụ chạy riêng: dòng sổ là câu hỏi cho chủ kho.
  Công cụ thiết kế chỉ tính luật mà dòng sổ nêu tên, nên một công cụ chạy riêng không đưa quyết định sang «giữ».
- Không đặc tả UX, không design-pass, không quét không gian tiêu chí: các dòng `descope` trong sổ.

## Đặc tả UX

Bỏ: dòng sổ `descope` «bỏ đặc-tả-UX». Vòng này không đổi màn nào; tệp màn duy nhất chạm là hai chú thích.
