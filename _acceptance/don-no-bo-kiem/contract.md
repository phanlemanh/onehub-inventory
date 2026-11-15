---
schema_version: 1
feature: "Bộ kiểm của kho hết bốn nợ làm hàng khác đỏ oan: cổng mạng bị cấm, cảnh báo dựng trang lệch, việc Release đỏ sau mỗi lần gộp, và hai trang quyết định trùng số"
slug: don-no-bo-kiem
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [config, ci]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-15T11:07:32Z
design_doc: docs/superpowers/specs/2026-11-15-don-no-bo-kiem-design.md
---

# Acceptance Contract: don-no-bo-kiem

## Context

Hàng 1u của lộ trình (`docs/plan/lo-trinh.json`), chủ kho cho ở Cổng Đáng 2026-11-15 («Cho cả gói, build»). Bốn nợ hạ tầng
của bộ kiểm đã làm hàng khác đỏ oan. Gốc của từng nợ đã tìm trên nhánh chính c53b35d, ghi ở design doc mục «Gốc đã tìm».
Giám sát G cấp số 0042 cho trang đánh lại số và cho gộp hai cổng cấm của bộ kiểm có cơ sở dữ liệu vào hàng này
(tin V-1511-6).

Source input: `_acceptance/don-no-bo-kiem/opportunity.md`; design doc ở `design_doc`.

## Criteria

- AC-1: Given hàm chọn cổng chung của hai cấu hình bộ trình duyệt, When quét mọi giá trị băm của khoảng 3500–3899 (400
  giá trị) và 4000–4899 (900 giá trị), Then mọi cổng trả về nằm trong khoảng của nó và không thuộc danh sách cổng Chrome
  từ chối; danh sách có 3659, 4045 và 4190, ghi nguồn Chromium. Given cùng phép quét trên hàm không lọc, Then bài đỏ và
  thông điệp gọi tên cổng cấm bị chọn.
- AC-2: Given hai cấu hình `playwright.config.ts` và `playwright.db.config.ts`, When nạp từng cấu hình có và không có
  biến `E2E_PORT` / `E2E_DB_PORT`, Then có biến thì cổng của máy dev và địa chỉ gốc của trang đều bằng biến; không có biến
  thì cả hai bằng kết quả hàm chung ở AC-1 với cùng băm; và cả kho chỉ tệp hàm chung chứa phép tính khoảng cổng.
- AC-3: Given công thức vùng `cho-tai` của bộ bài theo sổ màn, When chạy ca phá «khung cho khong bao gio hien», Then ca
  phá vẫn bị bắt với đúng thông điệp ghim cũ «cho-tai: khung cho khong hien», trong lúc ca phá chạy không có cảnh báo
  «Hydration failed» nào, và sổ đăng ký ca phá của công thức không đổi (không ca phá nào mất).
- AC-4: Given bộ trình duyệt đầy đủ trên HEAD, When chạy `make e2e`, Then lệnh thoát 0, dòng ra có
  «gac-hydration: 0 canh bao» (phép gác đã chạy) và không có cảnh báo «Hydration failed» nào.
- AC-5: Given phép gác hydrat hoá gắn vào cả hai cấu hình bộ trình duyệt, When một bài cố tình làm HTML máy chủ lệch với
  trình duyệt (bài phá chỉ chạy khi `GAC_HYDRATION_PHA=1`), Then lượt chạy thoát khác 0 với thông điệp ghim
  «gac-hydration: <n> canh bao, bai: <tên>» gọi đúng tên bài phá dù chạy cùng bài khác nhiều luồng; khi không bật bài
  phá, lượt xanh và in «gac-hydration: 0 canh bao»; và cấu hình có cơ sở dữ liệu cũng mang bộ báo cáo gác.
- AC-6: Given thư mục `wiki/decisions/`, When liệt số trang, Then không số nào dùng cho hai trang; trang của hàng 1q mang
  số 0042 (tên tệp và tiêu đề), có dòng trong `wiki/index.md`, và mọi liên kết tới nó trỏ đường mới (`make ontology`
  xanh, không còn đường dẫn `0034-cong-bat-khoi-khong-ke`).
- AC-7: Given `tools/wiki_lint.py`, When một bản sao kho có hai trang quyết định cùng số, Then lệnh thoát khác 0 với thông
  điệp ghim «decision number <NNNN> used by» gọi tên hai tệp. Given bản sao có hai trang quyết định KHÁC số (kể cả hai
  số liền nhau, và cùng tên đuôi nhưng khác số), Then lệnh KHÔNG đỏ; kho thật thì xanh.
- AC-8 (judgment): Given bản đề xuất `_acceptance/don-no-bo-kiem/release-de-xuat.md`, When chủ kho đọc nó, Then nó nêu
  nguyên nhân việc Release đỏ bằng dòng lỗi nguyên văn, tên khoá bí mật cần đặt, quyền tối thiểu của khoá, chỗ đặt, lối
  khác và giá của lối khác — đủ để chủ kho tự làm mà không phải đọc log. Phần máy đọc được của nó được kiểm ở mỗi lượt
  ghim lại: tệp có tên khoá `RELEASE_PLEASE_TOKEN`, đúng ba quyền đọc-ghi (Contents, Pull requests, Issues) và không quyền
  nào trên tệp workflow, và dòng lỗi trùng nguyên văn dòng đã ghim ở design doc.
- AC-9: Given nhánh của hàng so với nhánh chính, When kê tệp đổi, Then không tệp nào dưới `.github/workflows/`,
  `governance/` hay `PRODUCT-INVARIANTS.md`, không tệp nào của PR #66 (`tools/e2e_templates/suite.ts`,
  `tests/e2e-db/lop-rieng.spec.ts`, `tools/proof_gate/legacy.py`, `db/scripts/ci-thu.sh`, `vitest.config.*`), và
  `make check` thoát 0.

## Coverage

Phủ theo bốn nợ đã ghi ở ô của hàng (`opportunity.md`, câu «Kết quả nào là SỐNG») và bên đọc của từng thứ bị đổi; không
quét không gian tiêu chí (dòng sổ `descope` «bỏ coverage-scan»):

Bên đọc dò toàn kho bằng tìm chữ (design doc mục «Bên đọc đã dò»):

| Nợ / thứ bị đổi | Bên đọc | Tiêu chí |
| --- | --- | --- |
| Cổng cấm: hàm chọn cổng, bài quét cả khoảng | bài đơn vị | AC-1 |
| Cổng cấm: hai cấu hình dùng hàm, biến đè vẫn thắng | `playwright.config.ts`, `playwright.db.config.ts` (hai chỗ duy nhất có công thức cũ) | AC-2 |
| Hydration: gốc ở ca phá | `recipes.ts`, sổ đăng ký `e2e-templates.test.ts`, hồ sơ đã ký `bo-bai-kiem-tu-so-man` (giữ lời) | AC-3 |
| Hydration: nhánh chính hết cảnh báo | `make e2e` | AC-4 |
| Hydration: bài đỏ khi cảnh báo quay lại | hai cấu hình bộ trình duyệt | AC-5 |
| 0034: đánh lại số, liên kết, mục lục | `wiki/log.md`, `wiki/index.md` (chỗ duy nhất trỏ đường cũ / thiếu dòng) | AC-6 |
| 0034: phép chặn trùng số | `make ontology` | AC-7 |
| Release: đề xuất cho chủ kho | chủ kho | AC-8 |
| Ranh giới: tệp của chủ kho, tệp của PR #66, `make check` | — | AC-9 |

## Out of scope

- Việc của anh ngoài kho (không chặn hàng): đặt khoá `RELEASE_PLEASE_TOKEN` — ba quyền đọc-ghi, chỉ kho này; hướng dẫn ở
  `_acceptance/don-no-bo-kiem/release-de-xuat.md`.
- Sửa `.github/workflows/`, đặt khoá bí mật, đổi cài đặt kho GitHub — việc của chủ kho.
- Cảnh báo «commit could not be parsed» của release-please (không gây đỏ).
- Lỗi trình duyệt cố ý khác (ví dụ «pha thu» của ca phá `khong-loi-trinh-duyet`).
- Đổi mã sản phẩm, màn hay khối `region-state.tsx`.

## Notes

- Hạng: hàng lộ trình ghi T2; `tools/**` nằm trong đường T3 của `_acceptance/config.yaml`. Máy giữ T2 theo hàng và nêu ở
  Cổng Phạm vi.
- Phép gác ở cấu hình có cơ sở dữ liệu được đo bằng việc có mặt trong danh sách bộ báo cáo, không bằng một lượt bài phá:
  lượt ấy cần Postgres của dãy. Bộ báo cáo là cùng một tệp, đã thấy đỏ ở cấu hình kia.
- Ngoài-1 (máy định tuyến 2026-11-15, đề xuất S4 known-limits): Phép kiểm tra tự động có một kẽ hở: một chỗ trong bộ bài kiểm vẫn đổi trang mà phép kiểm tra không thấy. Hiện chỗ đó chạy an toàn, người dùng sản phẩm không bị ảnh hưởng. — `tools/e2e_templates/recipes.ts`
- Ngoài-2 (máy định tuyến 2026-11-15, đề xuất S4 known-limits): Một bài phá thử trong bộ kiểm có thể thỉnh thoảng báo đỏ sai vì nút chưa bị gỡ kịp. Chỉ ảnh hưởng người chạy bộ kiểm, không ảnh hưởng người dùng sản phẩm. — `tools/e2e_templates/recipes.ts`
- Ngoài-3 (máy định tuyến 2026-11-15, đề xuất S4 known-limits): Hai bài phá thử có thể bắt đầu sửa trang quá sớm và gây lại cảnh báo dựng trang lệch, làm bộ kiểm đỏ oan. Người dùng sản phẩm không bị ảnh hưởng. — `tools/e2e_templates/recipes.ts`
- Ngoài-5 (máy định tuyến 2026-11-15, đề xuất S4 known-limits): Quy tắc nhận biết trang đã tải xong nằm ở hai chỗ trong bộ kiểm tự động. Người dùng sản phẩm không bị ảnh hưởng; chỉ khi thư viện giao diện đổi cách làm thì một chỗ có thể được sửa còn chỗ kia bị quên, khiến bài kiểm đỏ oan. — `tests/e2e/da-gan.ts`
- Ngoài-6 (máy định tuyến 2026-11-15, đề xuất S4 known-limits): Thay đổi này cần chủ kho duyệt trước khi gộp, tác tử không tự gộp được. Người dùng cuối không bị ảnh hưởng gì. — `tools/wiki_lint.py`
- Ngoài-8 (máy định tuyến 2026-11-15, đề xuất S4 known-limits): Phép gác cảnh báo dựng trang lệch mới được thử đỏ cho một loại cảnh báo, loại thứ hai chưa được thử. Nếu loại này xảy ra, giao diện có thể lệch mà bộ kiểm vẫn xanh. — `tests/e2e/gac-hydration.ts`
