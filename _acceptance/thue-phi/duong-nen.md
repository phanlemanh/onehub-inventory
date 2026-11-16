---
slug: thue-phi
at: 2026-11-14T13:06:14.454Z
sha: 6d9ce6fbe29fa8ccd2970a8e31ddfa59e4b2d968
nen: do
cong_cu: xanh
suite: do
luoi: xanh
engine: xanh
---

## Dòng đỏ

- nen suite: DO SAN executors.script.check ma 2

## Dòng vàng

- không có

## Ghi chú của dãy N

- Đỏ duy nhất của `make check` là `tests/coverage-matrix.test.ts` đọc chính hợp đồng của vòng (`_acceptance/thue-phi/contract.md`):
  dòng Vai × Màn ghi sai mã màn (đã sửa) và màn `tuy-chinh-san` chưa có ở `design/screens.yaml` của nhánh chính — màn ấy
  vào cùng hàng 7e (PR #53). Đây là vật của vòng, không phải nền; hết đỏ khi nhánh gộp `origin/main` sau 7e (S3).
