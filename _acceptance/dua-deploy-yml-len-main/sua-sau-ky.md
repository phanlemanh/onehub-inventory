# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này. Giám sát G-2811-43 cho ghim lại hồ sơ trên nhánh VP10 lát 1
(`feat/khung-luoi-va-ngan-chi-tiet`), theo luật đợt «đổi mã hay bài của hồ sơ đã ký thì ghi ở đây và ghim lại cùng lượt».

## VP10 lát 1, 2026-11-28

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| Mốc chấm (`verified_commit` 2aaa5641) mất vì PR #133 gộp bằng squash: commit đã chấm không nằm trong lịch sử main, nên `gate` của main báo «the pin is a phantom». Ghim lại trên nhánh VP10, nội dung tệp không đổi; `.github/workflows/deploy.yml` không sửa | Không | G-2811-43 |
| `rang/kiem.py` nhận `--head`; lệnh E4 trong `evals.yaml` ghim mốc cố định `--base 1f4e7d36 --head c55415fe` (cha và commit squash của PR #133 trên main). Lý do: thước E4 đo `base...HEAD`, tức cả nhánh đang đứng thay vì đoạn của PR — trên nhánh VP10 nó đỏ «PR chạm tệp ngoài phạm vi: DESIGN.md», trên main sau squash đoạn đo rỗng. Chiều đỏ giữ: đoạn có tệp khác đỏ đúng câu cũ, đoạn rỗng đỏ «PR không chạm deploy.yml»; tự kiểm 27/27. Commit `2efc5370`; `deploy.yml` không sửa | Không | G-2811-45 |
