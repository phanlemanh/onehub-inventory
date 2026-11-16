# Dọn nợ của bộ kiểm (hàng 1u) — thiết kế

Ngày: 2026-11-15 · Hạng: T2 (hàng lộ trình) · Không có màn · Hồ sơ: `_acceptance/don-no-bo-kiem/`

## Mục tiêu

Bốn nợ hạ tầng của bộ kiểm đã làm hàng khác đỏ oan. Hàng này gỡ từng nợ ở gốc và để lại một phép kiểm chặn nợ quay lại.
Không đổi mã sản phẩm, không nới hay xoá bài kiểm nào.

## Gốc đã tìm (main c53b35d, chỉ đọc)

1. **Cổng mạng bị cấm.** `playwright.config.ts:20` chọn cổng `3500 + băm % 400`; khoảng 3500–3899 chứa 3659, cổng
   Chrome từ chối («Bad port: 3659 is reserved for apple-sasl», gặp ở CI của 2d). `playwright.db.config.ts:25` chọn
   `4000 + băm % 900`; khoảng 4000–4899 chứa hai cổng cấm nữa: 4045 và 4190. Cùng một lỗi, ba cổng.
2. **«Hydration failed».** CI main c53b35d in 39 cảnh báo, tất cả ở khung chờ `region-skeleton` của
   `src/components/candidate/region-state.tsx:66`. Mã sản phẩm không lệch: trạng thái đầu của khung là «none» ở cả máy chủ
   lẫn trình duyệt. Gốc là ca phá «khung cho khong bao gio hien» của công thức `cho-tai`
   (`tools/e2e_templates/recipes.ts:634-643`): nó gắn MutationObserver từ initScript và xoá khung khỏi HTML máy chủ trước
   khi React gắn vào, React thấy cây lệch và dựng lại. Không thuộc màn của hàng đang mở (2d, 19, 5, 10).
3. **Việc «Release» đỏ.** 30/30 lượt gần nhất đều đỏ, cùng một dòng:
   `release-please failed: GitHub Actions is not permitted to create or approve pull requests.`. Kho không có khoá
   `RELEASE_PLEASE_TOKEN`, việc rơi về khoá mặc định của Actions, và cài đặt kho đang tắt quyền mở PR cho Actions
   (`can_approve_pull_request_reviews: false`). Nhánh phát hành vẫn được đẩy; chỉ bước mở PR bị chặn. Các dòng «commit
   could not be parsed» là commit gộp, chỉ là cảnh báo. Không cần sửa `.github/workflows/`.
4. **Hai trang 0034.** `0034-component-register-written-by-design-assembly.md` vào nhánh chính trước (PR #58, 2715cf4)
   và có trong `wiki/index.md`. `0034-cong-bat-khoi-khong-ke.md` (hàng 1q, PR #61, 0861fdc) vào sau và chưa có trong
   mục lục. Liên kết theo đường dẫn tới trang sau chỉ có `wiki/log.md:13`; hồ sơ 1q không trỏ số 0034. Không phép kiểm
   nào bắt trùng số.

## Cách làm

### Nợ 1 — chọn cổng bỏ cổng cấm

- Tệp mới `tests/e2e/cong-chay.ts`: danh sách cổng Chrome từ chối (chép từ `kRestrictedPorts` của Chromium,
  `net/base/port_util.cc`, ghi nguồn) và hàm `chonCong(digest, goc, khoang)` trả cổng đầu tiên không cấm, đi tiếp vòng
  tròn trong khoảng. Hai cấu hình Playwright gọi hàm này; `E2E_PORT` / `E2E_DB_PORT` vẫn thắng như cũ.
- Bài kiểm đơn vị `tests/cong-chay.test.ts` quét MỌI giá trị băm cho cả hai khoảng (400 và 900 giá trị): mỗi cổng nằm
  trong khoảng và không cấm; và kiểm danh sách có 3659, 4045, 4190. Ca phá: cùng phép quét trên hàm không lọc → đỏ, thông
  điệp gọi tên cổng cấm.

### Nợ 2 — ca phá không làm lệch lúc gắn, và phép gác

- Ca phá «khung cho khong bao gio hien» thôi xoá nút khỏi cây đang gắn. Nó giả «trang máy chủ không có khung chờ» và
  KHÔNG cho React gắn: `page.route` sửa HTML của tài liệu (đổi `data-slot="region-skeleton"` thành một tên khác) và chặn
  các tệp mã `/_next/static/**`. Không có mã trình duyệt thì không có bước gắn, nên không có cảnh báo lệch; phép kiểm
  `cho-tai` vẫn bắt ca phá ở bước đầu với ĐÚNG thông điệp ghim cũ «cho-tai: khung cho khong hien». Ca phá, thông điệp và
  dòng đăng ký ở `tools/e2e_templates/e2e-templates.test.ts` giữ nguyên; không bài nào bị nới hay mất ca phá.
- Hai lối đã loại: (a) ẩn khung bằng bảng kiểu — không lệch, nhưng ca phá đổi sang thông điệp «sau 1 giay» và thông điệp
  «khung cho khong hien» mất ca phá riêng (làm yếu bộ bài); (b) giữ ca phá cũ và cho phép gác một danh sách ca phá được
  miễn — cảnh báo vẫn in ra ở nhánh chính, trái điều kiện xong của hàng.
- Phép gác: bộ báo cáo `tests/e2e/gac-hydration.ts` gắn vào cả hai cấu hình Playwright. Nó đọc dòng lỗi trình duyệt mà
  máy dev chuyển ra (`[browser] … Hydration failed`) và cảnh báo hydrat hoá của React ở dòng ra của từng bài; có dòng nào
  thì cả lượt ĐỎ, thông điệp «gac-hydration: <n> canh bao, bai: <tên bài đang chạy>»; không có thì in
  «gac-hydration: 0 canh bao» ở cuối mỗi lượt (đối chứng dương: phép gác có chạy). Mẫu chữ phép gác bắt viết trước ở đầu
  `evals.yaml`. Ca phá: một bài phá riêng (`tests/e2e/gac-hydration-pha.spec.ts`, chỉ chạy khi có biến `GAC_HYDRATION_PHA=1`)
  cố tình đổi HTML trước khi gắn → lượt đỏ với đúng thông điệp ấy, chạy cùng vài bài khác nhiều luồng để chứng tên bài
  trong thông điệp đúng là bài phá. Cấu hình có cơ sở dữ liệu: phép đo nạp cấu hình và thấy bộ báo cáo gác có trong danh
  sách (chạy bài phá ở đó cần Postgres của dãy — ghi ở Notes).

### Bên đọc đã dò (toàn kho, trừ hồ sơ này)

- Công thức cổng cũ (`% 400`, `% 900`): chỉ `playwright.config.ts:20`, `playwright.db.config.ts:25`.
- Thông điệp «khung cho khong hien»: `tools/e2e_templates/recipes.ts:612,636`, `tools/e2e_templates/e2e-templates.test.ts:504`
  (giữ nguyên), `_acceptance/bo-bai-kiem-tu-so-man/evals.yaml:57` (hồ sơ đã ký, không sửa; ca phá vẫn đúng lời nó).
- Đường dẫn `0034-cong-bat-khoi-khong-ke`: chỉ `wiki/log.md` (dòng 15 sau khi gộp nhánh lộ trình).

### Nợ 3 — Release: đề xuất cho chủ kho

`_acceptance/don-no-bo-kiem/release-de-xuat.md`: nguyên nhân (dòng log), hai lối và lối khuyên:

- **Khuyên — tạo khoá `RELEASE_PLEASE_TOKEN`**: GitHub App của kho hoặc token hạt mịn chỉ cho kho này, quyền
  Contents: read and write, Pull requests: read and write, Issues: read and write (gắn nhãn phát hành lên PR);
  Metadata: read tự có. Không quyền nào trên tệp workflow. Đặt ở Settings → Secrets and
  variables → Actions. Lợi: PR phát hành chạy được CI (sự kiện từ khoá mặc định không khởi việc khác — chính lời chú
  thích của `release.yml`). Việc là của chủ kho vì chạm tài khoản.
- Lối khác — bật «Allow GitHub Actions to create and approve pull requests» (Settings → Actions → General). Một chạm,
  nhưng PR phát hành sẽ không tự chạy CI, và mở thêm quyền cho mọi việc của kho.
  Máy không sửa `.github/workflows/`, không đặt khoá, không đổi cài đặt kho.

### Nợ 4 — đánh lại số và chặn trùng

- `git mv wiki/decisions/0034-cong-bat-khoi-khong-ke.md wiki/decisions/0042-cong-bat-khoi-khong-ke.md` (số G cấp);
  tiêu đề trang `# 0042 …`; thêm dòng mục lục `wiki/index.md`; sửa liên kết của dòng 1q trong `wiki/log.md` (sổ dùng
  chung — yêu cầu `cham-tep` V-9 đã duyệt).
- `tools/wiki_lint.py`: hai trang trong thư mục quyết định cùng tiền tố số `NNNN-` → lỗi «decision number NNNN used by
  …». Bài kiểm `tests/wiki-lint-so-trung.test.ts` chạy lệnh trên bản sao: kho thật xanh; bản sao thêm một trang trùng số
  → đỏ với đúng thông điệp.

## Tệp hạng cao sẽ đổi (nêu đích danh)

- `tools/e2e_templates/recipes.ts` — chỉ thân hàm `before` của ca phá «khung cho khong bao gio hien».
- `tools/wiki_lint.py` — thêm phép chặn trùng số trang quyết định.
- `playwright.config.ts`, `playwright.db.config.ts` — chọn cổng qua hàm chung, gắn bộ báo cáo gác.
- `_acceptance/config.yaml` — chỉ thêm dòng lệnh đo của hồ sơ.
  Không chạm tệp của PR #66 (`tools/e2e_templates/suite.ts`, `tests/e2e-db/lop-rieng.spec.ts`, `tools/proof_gate/legacy.py`,
  `db/scripts/ci-thu.sh`, cấu hình vitest).

## Ngoài phạm vi

- Sửa `.github/workflows/`, đặt khoá bí mật, đổi cài đặt kho (của chủ kho).
- Cảnh báo «commit could not be parsed» của release-please (chỉ là cảnh báo, không gây đỏ).
- Cảnh báo trình duyệt khác «Hydration failed» (lỗi «pha thu» cố ý của ca phá `khong-loi-trinh-duyet`).
- Đổi mã `region-state.tsx` hay màn nào.

## Rủi ro

- Bộ báo cáo gác dựa vào việc máy dev chuyển lỗi trình duyệt ra dòng ra (`browserDebugInfoInTerminal`, mặc định `warn`
  ở Next 16). Ca phá của phép gác chứng nó thật sự thấy cảnh báo; nếu bản Next sau tắt việc chuyển, ca phá đỏ trước.
- Hạng: hàng ghi T2, nhưng `tools/**` nằm trong đường T3 của `_acceptance/config.yaml`. Máy giữ T2 theo hàng lộ trình và
  nêu ra ở Cổng Phạm vi.

## Sửa sau lượt chấm 2 — cửa chung cho mọi bài sửa trang (phán quyết G, V-1511-16)

Hai lượt chấm đầu đỏ cùng một lớp: bài kiểm đổi kiểu, gỡ lớp hay chụp ảnh trước khi React gắn xong trang, React báo
lệch, phép gác làm lượt đỏ. Vá từng chỗ không hội tụ, nên:

- Dấu «trang đã gắn xong»: `data-hydrated` trên thẻ gốc, do `src/app/hydration-mark.tsx` đặt sau khi gốc ứng dụng gắn
  (cùng tên dấu với vùng lưới ở VP4).
- Cửa chung `tests/e2e/sua-trang.ts`: `pageReady` (cùng họ với `regionReady` của VP4) chờ dấu, chờ hết phần trang đang tải
  dở, và — khi có — chờ chính phần tử bị đụng được React nhận; có trần, hết trần thì đỏ và nói thiếu điều nào. Mọi lối sửa
  trang đi qua `suaTrang`, `suaCacPhanTu`, `themKieu`, `chupAnh`. `waitReady` của bộ bài theo sổ màn dùng `pageReady`.
- Chuyển 71 trên 86 chỗ; 11 chỗ ở bốn tệp của PR #66 và #70 nằm trong danh sách chờ có tên, chuyển sau khi hai PR ấy gộp
  (1u chỉ gộp khi danh sách rỗng).
- Phép kiểm tĩnh `tests/sua-trang.test.ts` (chạy trong `make check`) đỏ khi một bài sửa trang không qua cửa, khi một mã
  chèn trước lúc tải đổi trang mà không chờ dấu, và khi danh sách chờ còn tên tệp đã hết việc.
- 4 chỗ chụp ảnh ở bốn tệp bị khoá lời bởi hàng đã ký (bài đăng nhập của hàng 8, bài thành viên của hàng 9) giữ nguyên,
  ghi ở danh sách «khoá lời» có tên bài khoá; mở khoá là việc của chủ kho.
