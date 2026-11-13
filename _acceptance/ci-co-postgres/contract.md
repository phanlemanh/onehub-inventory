---
schema_version: 1
feature: CI chạy các bài trình duyệt có đăng nhập trên một Postgres riêng của lượt, để bộ kiểm chung đo được màn cần đăng nhập ngay trên CI
slug: ci-co-postgres
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/ci-co-postgres/design.md
---

# Acceptance Contract: ci-co-postgres

## Context

Hôm nay mọi bài cần cơ sở dữ liệu — bộ kiểm cách ly, bài `tests/db`, bài trình duyệt có đăng nhập (`tests/e2e-db`, gồm
lượt có phiên của bộ kiểm chung, góc nhìn của 2c, bộ nút của 9e) — chỉ chạy ở máy dãy và lượt chấm. CI chỉ chạy lượt không
phiên, nên màn cần đăng nhập không được đo trên CI. Hàng này cho CI một Postgres riêng của lượt và một lệnh duy nhất
`make ci-db` chạy các bài ấy dưới vai `quy_hang_login` (hàng 7c), kèm phép đếm giao–nhận mà chủ kho chọn «mở hợp đồng mới»
ở Ngoài-4 của 1r, dọn thư mục dựng tạm (Ngoài-1, Ngoài-3 của 1r) và bỏ chỗ đọc lịch sử git ở bài chạy trên CI. Tệp
workflow là của chủ kho: hàng soạn sẵn bản vá. Luật chạm: SP-1 (chỉ siết).

Source input: hàng 1s của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/ci-co-postgres/opportunity.md` đã quyết
«build» bởi Manh Phan; dòng `d-20261112T132601Z-26` (Ngoài-4) trong `_acceptance/bo-kiem-chung-khi-dang-nhap/decisions.jsonl`.

## Criteria

- AC-1: Given một Postgres 16 mới chưa có gì (mật khẩu `local-only`, cổng `DB_PORT`), When chạy `make ci-db`, Then lệnh
  chạy đúng sáu bước theo thứ tự `chuan-bi`, `cach-ly`, `bai-db`, `co-phien`, `khong-phien`, `dem`, mỗi bước in đúng một
  dòng `ci-db: <bước> đạt (mã 0, <s> giây)`, bước `bai-db` chạy mọi tệp `tests/db/*.db.test.ts` và bước `co-phien` chạy
  mọi tệp `tests/e2e-db/*.spec.ts` (danh sách ghim viết trước, gồm `goc-nhin.spec.ts` và `bo-nut-members.spec.ts`), lượt
  có phiên in `bo qua can dang nhap: 0`, bước `dem` in mỗi tệp ghim kèm số bài đạt và mỗi tệp có ít nhất một bài đạt
  (đọc từ báo cáo JSON của vitest và Playwright, không từ tên tệp trong nhật ký; một tệp toàn bài bị bỏ qua thì
  `tep khong co bai dat: <tệp>` và bước đỏ), dòng cuối là `ci-db: 6/6 bước đạt` và mã thoát 0.
- AC-2: Given cùng Postgres ấy, When `make ci-db` chạy, Then bộ kiểm cách ly in dòng cuối
  `cach-ly: <n> ca đạt, vai quy_hang_app, nối bằng quy_hang_login` (n = số ca của bộ chạy), phần phiên của nó nối bằng
  `quy_hang_login`, và trong lúc lượt có phiên chạy, tập vai của mọi kết nối mà máy chủ dev mở tới cơ sở nháp của lượt
  (đọc `pg_stat_activity` bằng vai chủ, trừ kết nối của chính bài đọc) khác rỗng và đúng bằng {`quy_hang_login`}; trên bản
  sao mà lệnh nối phần phiên bằng vai chủ `postgres` thay vì `quy_hang_login`, bước `cach-ly` in `ci-db: cach-ly HỎNG` kèm
  dòng `HỎNG dang-nhap-khong-ve-vai-chu`, dòng cuối nêu `HỎNG: cach-ly` và mã thoát khác 0; trên bản sao mà máy chủ dev
  nối bằng `postgres`, bài vai nối đỏ với `may chu dev noi bang vai khac quy_hang_login: postgres`.
- AC-3: Given một bước đỏ giữa chừng, When `make ci-db` chạy, Then các bước sau vẫn chạy (trừ khi `chuan-bi` đỏ thì dừng
  ngay với `ci-db: chuan-bi HỎNG` và dòng cuối `ci-db: 0/6 bước đạt — HỎNG: chuan-bi`), dòng cuối liệt đúng các bước đỏ
  theo thứ tự, mã thoát 1; với `BUOC="co-phien khong-phien dem"` chỉ ba bước ấy chạy và dòng cuối đếm trên ba.
- AC-4 (cross-layer): Given báo cáo JSON thật của lượt không phiên và lượt có phiên cùng commit, When phép đếm giao–nhận
  chạy, Then nó in `giao: <N> · nhan: <N> · roi: 0 · do nham: 0` với N ≥ 1 và thoát 0, trong đó mỗi bài giao (bỏ qua với
  lý do `can dang nhap — do o luot co phien`) có bài cùng đường tên, cùng khổ đã đạt ở lượt có phiên (bản chậm nhận bằng bài
  thường cùng khổ); và trên ba bản phá rút từ chính hai báo cáo ấy — bỏ một bài nhận khỏi lượt có phiên; đổi bài nhận ấy
  thành bị bỏ qua; đổi một bài của màn đã giao ở lượt không phiên thành đạt — nó thoát 1 và in đúng
  `roi: <khổ> <đường tên>` (hai bản đầu) hay `do nham trang dang nhap: <khổ> <đường tên>` (bản ba) cho đúng bài bị phá;
  báo cáo không phiên không giao bài nào thì in `giao: 0 — luot khong phien khong giao bai nao` và thoát 1.
- AC-5: Given bản sao nông (`git clone --depth 1`) của đúng commit, cài từ lockfile, và một container Postgres mới lấy ảnh,
  mật khẩu, cổng từ chính tệp bản vá workflow, When `db/scripts/ci-thu.sh` chạy `make ci-db` trong bản sao, Then lệnh
  thoát 0 với dòng cuối `ci-db: 6/6 bước đạt`, thời gian chạy (phút) được in và không vượt 2/3 trần chủ kho chốt ở Cổng
  Phạm vi (máy chủ GitHub chậm hơn máy dãy); và trong cùng bản sao nông, `make check` (lệnh của job kiểm cũ) cũng thoát 0 —
  không bài nào của bất kỳ job nào gọi tới lịch sử git vắng; khi số phút đo được từ 2/3 trần trở lên (ca thử: bản sao bản vá
  với `timeout-minutes: 3` và thời gian đo 2,5 phút), `ci-thu.sh` thoát khác 0 và in `vuot 2/3 tran: <phút> / <trần>`.
- AC-6: Given cùng bản sao nông ấy với bản phá «bỏ phiên thử» (bước đăng nhập một lần của lượt có phiên ghi trạng thái
  trình duyệt rỗng), When chạy `make ci-db BUOC="co-phien khong-phien dem"`, Then lệnh thoát khác 0, bước `co-phien` in
  `HỎNG`, phép đếm in ít nhất một dòng `roi:`, và `ci-thu.sh` in dòng cuối `ci-thu: xanh <phút> phút · pha bo-phien do · pha vai-chu do`.
- AC-7: Given hai bài của `tests/db/cach-ly.db.test.ts` đọc bộ chạy cách ly ở commit `d85d815` và `83d1764`, When chạy chúng,
  Then chúng đọc `tests/fixtures/cach-ly-d85d815.sh` và `tests/fixtures/cach-ly-83d1764.sh` thay vì lịch sử git; mỗi bản
  chép có mã blob git (`git hash-object`) bằng mã blob ghim trong bài lúc chép (`9838bcec…` của d85d815, `10817856…` của
  83d1764) — bài so không đọc lịch sử khi chạy; và không tệp kiểm nào CI chạy (mọi `tests/**`, `tools/**`, `db/scripts/**`,
  hai tệp cấu hình Playwright) còn gọi `git show`, `git log` hay `git rev-parse` tới một commit khác HEAD (bài quét có ca đỏ
  đặt ở `tests/*.test.ts`).
- AC-8: Given thư mục `node_modules/.cache/onehub-e2e/` và `node_modules/.cache/onehub-e2e-db/` có: thư mục lượt mà tiến
  trình chủ ghi trong tệp `.chu` của nó đã chết; thư mục mà tiến trình chủ còn sống (kể cả khi tên thư mục là số của một
  tiến trình đã chết, và khi tên đặt bằng `E2E_RUN`/`E2E_DB_RUN` không phải số tiến trình); thư mục không có tệp `.chu`;
  When một lượt Playwright của mỗi cấu hình bắt đầu rồi kết thúc, Then chỉ thư mục có chủ đã chết bị xoá lúc bắt đầu, thư
  mục của chính lượt bị xoá khi tiến trình chính thoát (sau khi máy chủ dev đã tắt), mọi thư mục khác còn nguyên; và trong lượt
  dựng lại ở AC-5, sau `make ci-db` không còn thư mục lượt nào dưới hai thư mục ấy của bản sao.
- AC-9: Given tệp bản vá `_acceptance/ci-co-postgres/ci-yml.patch`, When áp nó lên `.github/workflows/ci.yml` ở HEAD bằng
  `git apply --check`, Then áp sạch; bản vá chỉ thêm dòng (không xoá, không sửa dòng có sẵn); nó thêm đúng một job có
  `timeout-minutes` bằng trần đã chốt, dịch vụ `postgres:16` với `POSTGRES_PASSWORD: local-only` và cổng `5432:5432`, và các
  bước checkout, setup-node theo `.nvmrc`, `npm ci`, cài chromium của Playwright, `make ci-db`; và `ci-thu.sh` đọc ảnh, mật
  khẩu, cổng, lệnh chạy từ đúng tệp này (sửa ảnh trong một bản sao của tệp → `ci-thu.sh --chi-doc` in ảnh mới).
- AC-10: Given chủ kho cho thợ dán bản vá ở Cổng Phạm vi (Hỏi-1), When PR của hàng chạy CI, Then job `e2e-db` xanh, nhật ký
  của nó có `bo qua can dang nhap: 0` và `ci-db: 6/6 bước đạt`, thời lượng job không vượt trần, và hồ sơ ghi mã lượt chạy,
  thời lượng job, và tổng thời gian CI của PR so với lượt CI gần nhất của nhánh chính. Chủ kho chọn tự dán sau khi gộp thì
  AC này chuyển thành giới hạn đã biết có tên ở Cổng Bằng chứng (CI thật chưa đo), không đo bằng lượt dựng lại.

## Coverage

Quét không gian (morphological, preset test-matrix) trên năm trục:

| Trục | Giá trị | AC |
|---|---|---|
| Bộ kiểm cần cơ sở dữ liệu | cách ly · tests/db · tests/e2e-db (mọi tệp) · lượt không phiên · phép đếm | AC-1, AC-2, AC-4 |
| Vai nối | `quy_hang_login` (lành) · vai chủ (phá) | AC-2 |
| Môi trường | thư mục làm việc của dãy · bản sao nông + Postgres mới như CI · CI thật (sau khi bản vá vào) | AC-1, AC-5, AC-10 |
| Chiều | xanh · bước đỏ giữa chừng · bỏ phiên thử · bài rơi giữa hai lượt · đo nhầm trang đăng nhập | AC-3, AC-4, AC-6 |
| Tài nguyên máy | thư mục dựng tạm: lượt chết · lượt đang sống · tên lạ · chính lượt | AC-8 |

CI thật đo ở AC-10 khi bản vá vào PR (Hỏi-1). Lượt dựng lại (AC-5) giữ biên 2/3 trần — [GIẢ ĐỊNH] máy chủ GitHub và lượt dựng lại khác nhau ở số lõi và bộ đệm trình duyệt, không khác ở lệnh.

## Đường đo

- Lượt có phiên đo mọi màn cần đăng nhập, in «bỏ qua cần đăng nhập: 0» · số từ: nhật ký bước `co-phien` của `make ci-db` — job `e2e-db` trên PR; lượt dựng lại khi chưa dán · AC bảo đảm: AC-1, AC-5, AC-10
- Một ca phá (bỏ phiên thử) làm ô kiểm đỏ · số từ: dòng cuối `ci-thu.sh` · AC bảo đảm: AC-6
- Thời gian CI tăng không quá trần · số từ: thời lượng job `e2e-db` và tổng CI của PR so với nhánh chính; lượt dựng lại dưới 2/3 trần · AC bảo đảm: AC-5, AC-9, AC-10

## Out of scope

- Sửa `.github/workflows/` — chỉ khi chủ kho cho dán bản vá ở Cổng Phạm vi (Hỏi-1); đặt job mới thành kiểm bắt buộc của
  nhánh chính là cài đặt GitHub của chủ kho.
- Gỡ các khoá lệnh theo dãy (`DB_LANE=h`, `k`, `v`…) của hàng khác trong `_acceptance/config.yaml`.
- Bản chậm cho lượt có phiên; ma trận vai × màn (hàng 9b).
- Đổi bộ kiểm chung `tools/e2e_templates/**` (vùng dãy K, hàng 2e).

## Notes

- Dọn ở máy dãy: các thư mục dựng tạm đã có từ trước hàng này được dọn ở lượt kế của mỗi cấu hình (tiến trình đã chết).
