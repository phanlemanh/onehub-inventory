# Việc «Release» đỏ sau mỗi lần gộp — nguyên nhân và đề xuất cho chủ kho

Viết 2026-11-15 (hàng 1u). Máy không sửa `.github/workflows/`, không đặt khoá, không đổi cài đặt kho: cả ba là việc của
chủ kho.

## Chuyện gì xảy ra

Mỗi lần gộp vào nhánh chính, việc «Release» chạy công cụ release-please để mở một PR phát hành (đổi số phiên bản, ghi sổ
thay đổi). 30 lượt gần nhất đều đỏ, cùng một dòng lỗi (lượt 43693569317, commit c53b35d):

```text
release-please failed: GitHub Actions is not permitted to create or approve pull requests.
```

Công cụ đã làm xong phần đầu — nhánh `release-please--branches--main--components--onehub-inventory` được đẩy, phiên bản
đề xuất 0.1.0 → 0.2.0 — rồi bị chặn đúng ở bước mở PR.

## Vì sao

- Tệp `.github/workflows/release.yml` dùng khoá `RELEASE_PLEASE_TOKEN` nếu có, không thì dùng khoá mặc định của Actions.
- Kho chưa có khoá `RELEASE_PLEASE_TOKEN`, nên việc dùng khoá mặc định.
- Cài đặt của kho đang tắt quyền «cho Actions tạo PR» (đọc qua API: `can_approve_pull_request_reviews: false`), nên khoá
  mặc định không được mở PR.

Các dòng «commit could not be parsed» trong log là commit gộp không theo khuôn tên commit; chúng chỉ là cảnh báo, không
làm việc đỏ.

## Đề xuất — chọn một

### Lối khuyên: đặt khoá `RELEASE_PLEASE_TOKEN`

1. Tạo một khoá chỉ cho kho này — một GitHub App của kho, hoặc token hạt mịn (fine-grained personal access token):
   - Repository access: chỉ `phanlemanh/onehub-inventory`.
   - Quyền: **Contents: Read and write** (đẩy nhánh phát hành, tạo bản phát hành) · **Pull requests: Read and write** (mở
     và cập nhật PR phát hành) · **Issues: Read and write** (gắn nhãn `autorelease: pending` / `tagged` lên PR) ·
     Metadata: Read (tự có).
   - Hạn: theo thói quen của chủ kho; khoá hết hạn thì việc lại đỏ với lỗi quyền.
2. Đặt nó ở GitHub → kho → Settings → Secrets and variables → Actions → New repository secret, tên đúng
   `RELEASE_PLEASE_TOKEN`.
3. Không cần sửa tệp workflow: `release.yml` đã đọc khoá này.

Vì sao khuyên lối này: PR do khoá này mở sẽ chạy CI như PR thường. PR mở bằng khoá mặc định thì KHÔNG khởi việc nào khác
(chính lời chú thích ở `release.yml` nói vậy), nên PR phát hành sẽ không có CI và không gộp được qua cổng của kho.

### Lối khác: bật quyền cho Actions mở PR

GitHub → kho → Settings → Actions → General → Workflow permissions → tick «Allow GitHub Actions to create and approve pull
requests» → Save.

Giá: một chạm, nhưng (1) PR phát hành vẫn không tự chạy CI, nên vẫn kẹt ở bước gộp; (2) quyền này mở cho mọi việc của kho,
kể cả việc sau này, không riêng release-please.

## Sau khi đặt

Lần gộp kế tiếp, việc «Release» xanh và một PR phát hành «chore(main): release 0.2.0» xuất hiện. Gộp PR ấy là quyết định
của chủ kho; gộp xong thì việc deploy chạy theo `deploy.yml` (thử tự động, bản thật chờ chủ kho duyệt môi trường).
