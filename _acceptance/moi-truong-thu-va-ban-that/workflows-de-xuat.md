# Bản đề xuất tệp tự động triển khai — hàng 22

Máy không sửa `.github/workflows/` (AGENTS.md). Chủ kho chép bản dưới vào `.github/workflows/deploy.yml` bằng một commit
riêng, SAU khi PR của hàng 22 đã gộp: lệnh `make deploy` phải có trên nhánh chính trước. Bản này soạn theo lệnh đã dựng
(`mk/deploy.mk`, `tools/deploy/`); việc ngoài kho đi kèm ở `docs/van-hanh/README.md`, mục «Việc ngoài kho» (việc 10, 11).

## `release.yml`

Không đổi gì: gộp PR phát hành tạo bản phát hành rồi gọi `deploy.yml`. Việc Release đang đỏ vì thiếu khoá
`RELEASE_PLEASE_TOKEN` có hướng dẫn riêng ở `_acceptance/don-no-bo-kiem/release-de-xuat.md` (hàng 1u) — làm theo tệp ấy,
không lặp lại ở đây.

## `deploy.yml` — thay toàn bộ

```yaml
name: Deploy

# Staging goes up on its own after a release; production waits for the owner's approval on the
# "production" environment (Settings > Environments > production > Required reviewers).
# Runbook and variable table: docs/van-hanh/README.md. Each environment holds its own secrets.
on:
  workflow_call:
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy
  cancel-in-progress: false

jobs:
  staging:
    if: vars.DEPLOY_ENABLED == 'true'
    runs-on: ubuntu-latest
    environment: staging
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v7
      - uses: ./.github/actions/setup-project
      - run: sudo apt-get update && sudo apt-get install -y postgresql-client
      - run: npm install --global vercel@65.9.0
      - run: make deploy ENV=staging
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
          LOGIN_DATABASE_URL: ${{ secrets.LOGIN_DATABASE_URL }}
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
          APP_URL: ${{ vars.APP_URL }}

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v7
      - uses: ./.github/actions/setup-project
      - run: sudo apt-get update && sudo apt-get install -y postgresql-client
      - run: npm install --global vercel@65.9.0
      - run: make deploy ENV=production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
          APP_URL: ${{ vars.APP_URL }}
          STAGING_APP_URL: ${{ vars.STAGING_APP_URL }}
```

## Biến theo việc

Lệnh đọc biến từ môi trường của việc, chỉ kiểm có mặt, không in giá trị. Hai môi trường dùng cùng tên biến, khác giá trị.

| Biến                              | Loại trên GitHub | `staging`                | `production`              | Lệnh cần vì                                                        |
| --------------------------------- | ---------------- | ------------------------ | ------------------------- | ------------------------------------------------------------------ |
| `VERCEL_TOKEN`                    | khoá             | bắt buộc                 | bắt buộc                  | gọi Vercel: dựng, gắn tên miền, lùi                                |
| `VERCEL_ORG_ID`                   | khoá             | bắt buộc                 | bắt buộc                  | nhóm Vercel                                                        |
| `VERCEL_PROJECT_ID`               | khoá             | bắt buộc, dự án bản thử  | bắt buộc, dự án bản thật  | mỗi môi trường một dự án (Hỏi-6)                                   |
| `MIGRATE_DATABASE_URL`            | khoá             | bắt buộc, cơ sở bản thử  | bắt buộc, cơ sở bản thật  | áp migration; bộ kiểm cách ly đọc danh mục                         |
| `LOGIN_DATABASE_URL`              | khoá             | bắt buộc                 | không dùng                | bộ kiểm cách ly chỉ chạy ở bản thử                                 |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | khoá             | tuỳ chọn                 | tuỳ chọn                  | chỉ khi dự án bật bảo vệ bản mới; khoá rỗng thì lệnh bỏ qua        |
| `APP_URL`                         | biến             | bắt buộc, địa chỉ bản thử | bắt buộc, `https://inventory.onehub.center` | kiểm nhanh tên miền                              |
| `STAGING_APP_URL`                 | biến             | không dùng               | bắt buộc, địa chỉ bản thử | bản thật đòi bản thử đã chạy đúng commit (`ban-thu-truoc`)         |
| `DEPLOY_ENABLED`                  | biến của kho     | `true` để bật            | —                         | việc `staging` (và vì thế `production`) chỉ chạy khi bật          |

Bản thật không nhận `LOGIN_DATABASE_URL`: lệnh không cần, và một khoá ít hơn ở môi trường bản thật là một chỗ ít hơn để lộ.

## Khác tệp đang có và vì sao

- Bỏ `packages: write`, `id-token: write`, `GITHUB_TOKEN`, `IMAGE_TAG`, `DEPLOY_CMD`: lệnh mới không đẩy ảnh đóng gói,
  không dùng lệnh triển khai tự đặt.
- Bỏ bước `make smoke` riêng: `make deploy` đã kiểm nhanh hai lần (địa chỉ riêng của bản mới, rồi tên miền) và tự lùi khi
  lần sau đỏ.
- Thêm `postgresql-client` (lệnh áp migration và bộ kiểm cách ly dùng `psql`) và `vercel` ghim đúng bản đã thử
  (65.9.0). Đổi bản `vercel` là một thay đổi riêng, thử ở bản thử trước.
- `timeout-minutes: 30`: một lượt dựng Next.js cộng hai lần kiểm; quá thì việc dừng, tên miền không đổi nếu chưa tới bước
  gắn tên miền.

## Ghi chú cho chủ kho

- Môi trường `production`: Required reviewers chỉ chủ kho (Hỏi-2); Deployment branches and tags cho phép nhánh `main` và
  thẻ phát hành, để Run workflow đưa lại đúng thẻ đang chạy (sau khi xoay khoá hay khôi phục) mà không kéo theo commit chưa
  phát hành.
- Lùi bản không có tệp tự động riêng: `make rollback ENV=<staging|production>` chạy ở máy chủ kho
  (`docs/van-hanh/lui-ban.md`), hoặc Instant Rollback trên trang Vercel khi gấp.
- Lần chạy đầu ở mỗi môi trường dừng ở bước cần vai đăng nhập (vai chưa có mật khẩu): `docs/van-hanh/dua-ban-len.md`,
  mục «Lần đầu ở một môi trường».
