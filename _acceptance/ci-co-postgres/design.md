# Thiết kế — 1s · CI có Postgres

Hồ sơ: `_acceptance/ci-co-postgres/` · hàng 1s của `docs/plan/lo-trinh.json` · hạng T3 · dãy C.

## Kết luận

CI có thêm một job «cơ sở dữ liệu» chạy song song với các job hiện có. Job dựng một Postgres 16 mới của riêng lượt
(dịch vụ của GitHub Actions), rồi chạy đúng một lệnh của kho: `make ci-db`. Lệnh ấy chạy, theo thứ tự, mọi bộ kiểm cần
cơ sở dữ liệu mà hôm nay chỉ chạy ở máy dãy, dưới vai đăng nhập `quy_hang_login` của hàng 7c, rồi đếm để chắc không bài
nào của màn cần đăng nhập rơi giữa lượt không phiên và lượt có phiên.

Tệp workflow là của chủ kho. Hàng này soạn sẵn bản vá (`ci-yml.patch` trong hồ sơ) và hỏi chủ kho ở Cổng Phạm vi ai dán.
Trước khi trình Cổng Bằng chứng, máy dãy dựng lại máy chủ CI (bản sao nông của đúng commit, cài từ lockfile, Postgres mới
cùng ảnh, mật khẩu, cổng như bản vá) và chạy lệnh ấy — đó là bằng chứng chính khi CI thật chưa có job.

## Lệnh `make ci-db` (tệp `db/scripts/ci-db.sh`)

Đầu vào duy nhất là cổng Postgres (`DB_PORT`, mặc định 5432 như dịch vụ CI); mật khẩu `local-only` như `make db-up`.
Lệnh tự đặt `PSQL` (vai chủ, cho dữ liệu mẫu và migration), `PSQL_LOGIN` (vai `quy_hang_login`), `PGPASSWORD`.

Sáu bước, mỗi bước in một dòng `ci-db: <bước> đạt|HỎNG (mã <n>, <s> giây)`:

1. `chuan-bi` — đợi Postgres nhận kết nối; áp migration vào một cơ sở nháp để vai `quy_hang_login` có trên cụm; đặt
   mật khẩu cho vai (chỉ trên cụm dùng một lần của lượt); xoá cơ sở nháp.
2. `cach-ly` — `db/scripts/cach-ly.sh` (35 ca, phần phiên nối bằng `quy_hang_login`).
3. `bai-db` — `vitest -c vitest.db.config.ts` (mọi tệp `tests/db/**`, không lọc).
4. `co-phien` — `playwright -c playwright.db.config.ts` (mọi tệp `tests/e2e-db/**`, gồm `goc-nhin.spec.ts` của 2c và
   `bo-nut-members.spec.ts` của 9e, bốn khổ), ghi thêm báo cáo JSON.
5. `khong-phien` — lượt không phiên của bộ kiểm chung (`tests/e2e/screens/screens.spec.ts` với cấu hình chính), ghi
   báo cáo JSON. Lượt này cũng chạy trong job e2e cũ; chạy lại ở đây để phép đếm đọc hai báo cáo cùng commit, cùng máy.
6. `dem` — phép đếm giao–nhận (dưới).

Bước đỏ không dừng các bước sau (trừ `chuan-bi` đỏ thì dừng — không có vai thì các bước sau đỏ giả; `dem` cần cả 4 và
5 có báo cáo). Dòng cuối: `ci-db: 6/6 bước đạt` (mã 0) hoặc `ci-db: <k>/6 bước đạt — HỎNG: <bước…>` (mã 1). Đối số
tuỳ chọn chọn bước (`make ci-db BUOC="co-phien khong-phien dem"`) để chấm phá chạy ngắn hơn.

## Phép đếm giao–nhận (Ngoài-4 của 1r) — `tests/e2e-db/dem-giao-nhan.ts`

Đọc hai báo cáo JSON của Playwright. Bài «giao» là bài ở lượt không phiên bị bỏ qua với đúng lý do
`can dang nhap — do o luot co phien`. Với mỗi bài giao (khổ K, đường tên `man <màn> › <bài>`), lượt có phiên phải có bài
cùng đường tên ở dự án `co-phien-K` và bài ấy đạt. Bản chậm (`cham › …`, chỉ ở khổ chậm của lượt không phiên) nhận bằng bài
thường cùng khổ — lượt có phiên không có bản chậm. Thêm một chiều: không bài nào thuộc màn đã giao được báo đạt ở lượt không
phiên (đạt ở đó nghĩa là đo trên trang đăng nhập). In:

```
giao: <N> · nhan: <N> · roi: 0 · do nham: 0
```

Rơi hay đo nhầm thì in từng bài `roi: <khổ> <đường tên>` / `do nham trang dang nhap: <khổ> <đường tên>` và thoát 1.
`giao: 0` cũng đỏ (`giao: 0 — luot khong phien khong giao bai nao`): không bài nào giao thì phép đếm không chứng gì.

## Dọn thư mục dựng tạm (Ngoài-1, Ngoài-3 của 1r)

Mỗi lượt ghi tệp `.chu` (số tiến trình chính) vào thư mục lượt của nó. Cả hai cấu hình Playwright có `globalSetup` dọn:
(a) lúc bắt đầu, xoá thư mục dưới `node_modules/.cache/onehub-e2e[-db]/` mà tiến trình ghi trong `.chu` không còn — sống
hay chết đọc từ `.chu`, không từ tên thư mục, nên tên đặt bằng `E2E_RUN` hay số tiến trình bị dùng lại không làm xoá nhầm
lượt đang sống; (b) đăng ký xoá thư mục của chính lượt khi tiến trình chính thoát — sau khi máy chủ dev đã tắt (Playwright
gỡ máy chủ dev sau `globalTeardown`, nên xoá ở teardown là xoá dưới chân máy chủ đang chạy). Thư mục không có `.chu` (đời
trước hàng này) không bị chạm tự động; lần đầu chạy, `ci-thu` và lượt dọn tay xoá chúng ở máy dãy.

Vai nối của máy chủ dev được đo bằng quan hệ: bài mới `tests/e2e-db/vai-noi.spec.ts` xin mã đăng nhập trên màn đăng nhập thật (không cần phiên — máy chủ nối sai vai thì không đăng nhập được ai, bài vẫn phải chạy), rồi đọc
`pg_stat_activity` của cơ sở nháp bằng vai chủ; tập vai của các kết nối (trừ kết nối của chính bài) phải đúng bằng
{`quy_hang_login`}. Bước `dem` còn đọc báo cáo JSON để in số bài đạt của từng tệp ghim — một tệp toàn bài bị bỏ qua là đỏ.

## Bản sao nông

Hai khối của `tests/db/cach-ly.db.test.ts` đọc bộ chạy cách ly cũ bằng `git show d85d815:…` và `git show 83d1764:…`.
Chép hai bản ấy vào `tests/fixtures/cach-ly-d85d815.sh`, `tests/fixtures/cach-ly-83d1764.sh` và đọc từ tệp, như hàng 7c
đã làm cho `.env.example` (commit f323279). Bài kiểm chép-đúng so mã blob git của bản chép (`git hash-object`, không cần
lịch sử) với mã blob ghim lúc chép. Bài quét không gọi lịch sử phủ mọi tệp kiểm CI chạy, không riêng `make ci-db`.

## Bản vá workflow (`_acceptance/ci-co-postgres/ci-yml.patch`)

Thêm một job `e2e-db` vào `.github/workflows/ci.yml`, không sửa dòng nào có sẵn: `timeout-minutes` = trần chủ kho chốt;
`services.postgres` ảnh `postgres:16`, `POSTGRES_PASSWORD: local-only`, cổng `5432:5432`, kiểm sống bằng `pg_isready`;
bước: checkout (nông, mặc định), setup-node theo `.nvmrc`, `npm ci`, `npx playwright install --with-deps chromium`,
`make ci-db`. Lượt dựng lại ở máy (`db/scripts/ci-thu.sh`) đọc ảnh, mật khẩu, cổng và lệnh từ CHÍNH bản vá, nên bản vá
được chứng chứ không phải chép tay hai nơi.

## Lượt dựng lại máy chủ CI — `db/scripts/ci-thu.sh`

1. `git clone --depth 1` commit HEAD vào thư mục tạm; `npm ci`; trình duyệt Playwright dùng bộ đệm của máy.
2. Một container Postgres mới (ảnh và mật khẩu từ bản vá) ở cổng trống; chạy `make ci-db DB_PORT=<cổng>` trong bản sao,
   đo giờ; kiểm thư mục dựng tạm của bản sao không còn thư mục lượt nào.
3. Bản phá «bỏ phiên thử»: trong cùng bản sao, `phien.setup.ts` thôi đăng nhập (ghi trạng thái trình duyệt rỗng); chạy
   `make ci-db BUOC="co-phien khong-phien dem"` → phải thoát khác 0, bước `co-phien` HỎNG và phép đếm in `roi:`.
4. Trong cùng bản sao nông chạy `make check` (lệnh của job kiểm cũ) — bài nào đọc lịch sử git là đỏ ở đây.
   Bản phá «máy chủ dev nối bằng vai chủ»: bản sao `playwright.db.config.ts` đặt `DATABASE_URL` bằng `postgres`; chạy riêng
   `vai-noi.spec.ts` → đỏ `may chu dev noi bang vai khac quy_hang_login: postgres`.
   Bản phá «phần phiên nối bằng vai chủ»: bản sao `ci-db.sh` đặt `PSQL_LOGIN` với `-U postgres`; chạy
   `BUOC="chuan-bi cach-ly"` → bước `cach-ly` HỎNG với `HỎNG dang-nhap-khong-ve-vai-chu`.
5. Gỡ container và thư mục tạm. Dòng cuối: `ci-thu: xanh <phút> phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do`;
   lượt xanh phải dưới 2/3 trần (máy chủ GitHub chậm hơn máy dãy).

## Luật sản phẩm chạm

SP-1 (cách ly) — chỉ siết: bộ kiểm cách ly lên CI, nối bằng vai không sở hữu bảng. SP-3, SP-4 không chạm.

## Ngoài phạm vi

- Không sửa `.github/workflows/` (trừ khi chủ kho cho dán bản vá ở Cổng Phạm vi).
- Không gỡ các khoá lệnh theo dãy trong `_acceptance/config.yaml` của hàng khác.
- Không thêm bản chậm cho lượt có phiên.
- Không đặt job mới thành kiểm bắt buộc của nhánh chính (cài đặt kho GitHub là của chủ kho).
