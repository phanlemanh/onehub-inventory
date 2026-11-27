---
schema_version: 1
feature: Đưa tệp tự triển khai Deploy lên main — PR #133 thay tệp khung cũ bằng đúng khối đã ký trong sổ tay vận hành việc 9 (AC-8 của hồ sơ dat-khoa-mot-lenh)
slug: dua-deploy-yml-len-main
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ci]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-28
design_doc: _acceptance/dua-deploy-yml-len-main/design.md
---

# Acceptance Contract: dua-deploy-yml-len-main

## Context

Hồ sơ `dat-khoa-mot-lenh` (đã ký 2026-11-22) chốt nội dung tệp tự triển khai trong sổ tay vận hành, việc 9 phần hai. Chủ
kho đã dán khối ấy vào `.github/workflows/deploy.yml` và mở PR #133. Tệp nằm trong vùng hạng cao, nên bước kiểm cổng của PR
đòi một hồ sơ nghiệm thu đã ký. Vòng này không viết mã và không chạy Deploy: nó chứng tệp đã dán đúng bản đã ký và an toàn.

Source input: prompt. Chủ kho ngày 28/11, «Chạy nghiệm thu», rồi «Mở đi», sau khi chọn chạy vòng nghiệm thu thay vì bỏ qua
cổng bằng quyền quản trị.

## Criteria

- AC-1: Given nhánh của PR #133 ở HEAD, When so `.github/workflows/deploy.yml` với khối ```yaml dưới «Phần hai — tệp
  `deploy.yml`» của `docs/van-hanh/README.md` (bỏ khoảng trắng cuối dòng và dòng trống cuối tệp), Then hai bên bằng nhau
  từng dòng, và khối ấy ở HEAD bằng khối của sổ tay tại commit ký hồ sơ `dat-khoa-mot-lenh` (`182ca5b3`).
- AC-2: Given tệp ấy, When đọc nó như YAML, Then:
  - cò kích hoạt đúng `workflow_call` và `workflow_dispatch`, quyền đúng `contents: read`;
  - có đúng hai việc `staging` và `production`;
  - `staging` chỉ chạy khi `vars.DEPLOY_ENABLED == 'true'` và chạy trong môi trường `staging`;
  - `production` chờ `staging` và chạy trong môi trường `production`;
  - bước cuối của mỗi việc là `make deploy ENV=<việc>`;
  - `.github/workflows/release.yml` gọi tệp này đúng một lần (không gọi hay gọi hai lần đều đỏ).
- AC-3: Given tệp ấy và sổ tay, When gom mọi tên `secrets.*` và `vars.*` tệp đọc, Then:
  - mỗi tên có trong bảng biến của sổ tay (riêng `DEPLOY_ENABLED` được nêu trong đoạn ngay dưới bảng);
  - mỗi tên `secrets.*` là khoá của môi trường theo cột «Đặt ở đâu»;
  - mỗi tên đặt ở đúng môi trường của việc đọc nó («cả hai», «mỗi», hay đích danh môi trường ấy);
  - bài kiểm sổ tay sẵn có của hồ sơ `dat-khoa-mot-lenh` (khối sổ tay truyền đúng tập tên lệnh đưa bản lên đòi) vẫn xanh.
- AC-4: Given PR #133, When liệt kê tệp đổi so với `origin/main`, Then ngoài `_acceptance/` và hai trang máy vẽ từ hồ sơ
  (`PRODUCT-MAP.md`, `LO-TRINH.html`) chỉ có `.github/workflows/deploy.yml`.
- AC-5: Given nhánh ở HEAD, When chạy các lệnh chung của kho (`make check`, `npm run build`, `make e2e`), Then cả ba thoát 0.

- AC-6 (cross-layer): Given môi trường GitHub `production` của kho, When đọc nó qua API của GitHub (chỉ đọc), Then luật
  bảo vệ có người duyệt bắt buộc gồm chủ kho (`phanlemanh`) — nên việc `production` của tệp không chạy khi chưa có người
  duyệt.

## Coverage

| Trục | Phần tử | AC |
| --- | --- | --- |
| Vật | nội dung tệp · cấu trúc hai bước · tên khoá và biến · phạm vi PR · kho còn xanh | AC-1 · AC-2 · AC-3 · AC-4 · AC-5 |
| Đường ra bản thật | bản thử khi chưa bật · bản thật trước bản thử · bản thật không người duyệt | AC-2 · AC-2 · AC-6 |
| Khoá tới tệp được gọi | khoá kho không chuyển xuống · tên lạ không có trong sổ tay · khoá sai môi trường | AC-3 · AC-3 · AC-3 |
| Bản đã ký | tệp khác khối · khối đổi sau khi ký | AC-1 · AC-1 |

Không có `[CE chưa kiểm chứng]`: các trục liệt kê từ chính tệp 64 dòng.

## Out of scope

- Sửa `.github/workflows/` hay sổ tay: tệp là bản chủ kho dán, phải bằng khối đã ký.
- Chạy Deploy, bật `DEPLOY_ENABLED` hay đặt khoá: việc vận hành của chủ kho sau khi gộp.
- Chứng tệp chạy đúng trên GitHub Actions: chỉ lần chạy thật đầu tiên chứng được.
- Sửa tiêu đề commit của chủ kho cho đúng khuôn: gộp kiểu squash giữ nó khỏi main.

## Notes

- Bước kiểm `conventional-commits` (không bắt buộc) đỏ vì tiêu đề commit của chủ kho; gộp kiểu squash với tiêu đề PR đúng
  khuôn thì main không mang commit ấy.
