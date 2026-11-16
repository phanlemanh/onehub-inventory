# Bản đề xuất hai tệp tự động triển khai — hàng 22

Máy không sửa `.github/workflows/` (AGENTS.md). Chủ kho chép bản dưới vào kho bằng commit riêng, SAU khi PR của hàng 22
đã gộp (lệnh `make deploy` phải có trên nhánh chính trước). Bản cuối sẽ được soạn lại ở Cổng Bằng chứng nếu lệnh đổi khi
dựng; đây là bản ở Cổng Phạm vi.

## `release.yml`

Không đổi gì so với tệp đang có: gộp PR phát hành tạo bản phát hành rồi gọi `deploy.yml`. Việc Release đang đỏ vì thiếu
khoá `RELEASE_PLEASE_TOKEN` có hướng dẫn riêng ở `_acceptance/don-no-bo-kiem/release-de-xuat.md` (hàng 1u) — làm theo
tệp ấy, không lặp lại ở đây.

## `deploy.yml` — thay toàn bộ

```yaml
name: Deploy

# Staging goes up on its own after a release; production waits for the owner's approval on the
# "production" environment (Settings > Environments > production > Required reviewers).
# Each environment holds its own secrets with the same names (docs/van-hanh/README.md).
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
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v7
      - uses: ./.github/actions/setup-project
      - run: sudo apt-get update && sudo apt-get install -y postgresql-client-16
      - run: make deploy ENV=staging
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
          LOGIN_DATABASE_URL: ${{ secrets.LOGIN_DATABASE_URL }}
          APP_URL: ${{ vars.APP_URL }}

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v7
      - uses: ./.github/actions/setup-project
      - run: sudo apt-get update && sudo apt-get install -y postgresql-client-16
      - run: make deploy ENV=production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
          APP_URL: ${{ vars.APP_URL }}
          STAGING_APP_URL: ${{ vars.STAGING_APP_URL }}
```

Ghi chú cho chủ kho:

- `APP_URL`, `STAGING_APP_URL` là biến (không bí mật) của môi trường GitHub; còn lại là khoá bí mật.
- Lùi bản bằng tay: `make rollback ENV=production` chạy ở máy chủ kho với cùng bộ biến, hoặc một tệp `rollback.yml` nhỏ —
  bản ấy soạn ở Cổng Bằng chứng nếu chủ kho chọn.
- Bỏ `packages: write`, `id-token: write` của tệp cũ: lệnh mới không đẩy ảnh đóng gói.
