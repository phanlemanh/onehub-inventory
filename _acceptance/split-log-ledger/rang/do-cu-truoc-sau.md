# Phép đo của hồ sơ đã ký đọc sổ log — trước và sau khi tách

Đo ngày 19/11/2026 trên máy, các phép đo có nhắc `wiki/log.md` (tìm bằng `grep -rl 'wiki/log' _acceptance/*/rang _acceptance/*/evals.yaml`).
«Trước» là `c79189dd`; «sau» là `2e47d841` (đã commit, vì các ca hai chiều dựng worktree ở HEAD). Eval phán đoán có
`wiki/log.md` trong `inputs` (thue-phi E8-wiki, bo-o-tim-cua-vung E12, bang-quyen-theo-vai E14, bang-hang-the-dien-thoai
E10) đọc tệp đã vẽ, cùng nội dung, nên không đo ở đây.

| Hồ sơ · eval | Lệnh | Trước | Sau | Vì sao |
| --- | --- | --- | --- | --- |
| don-no-bo-kiem · E6 | `so_quyet_dinh` | 0 | 1 — `ban sao con lien ket cu ma khong do` | Danh sách tệp lấy từ git; bản sao phá chèn vào `wiki/log.md`, nay ngoài git |
| tat-plugin-cho-cu · E4 | `tpc_quet_ten_cu` | 0 | 0 | — |
| tat-plugin-cho-cu · E7 | `tpc_two_way` | 1 — ba ca «E1 red» («E1 not green on HEAD») | 1 — ba ca ấy, thêm ca «E4 red (a)» (`expected red, got green`) | Phép quét đọc tệp git giữ; dòng phá thêm vào `wiki/log.md` không bị thấy |
| upgrade-repo-setup-0-9-0 · E10 | `rs090_ledgers` | 0 | 1 — `ledger log is fragments, not one-file` | AC-9 nói sổ log là one-file ở HEAD |
| upgrade-repo-setup-0-9-0 · E12 | `rs090_two_way` | 1 — ca «rules-kept» | 1 — «rules-kept», thêm «ledgers» (bản lành ở HEAD) và «change-set» | «change-set» đỏ ở mọi nhánh chưa vào `origin/main` (phép đo chỉ so commit khi nhánh đã vào) |

Sau khi sửa (Hỏi-2): `so_quyet_dinh` thoát 0; ca «E4 red» của `tpc_two_way` và ca «ledgers» của `rs090_two_way` đạt;
E10 khai không-chạy, thay bởi AC-3 của hồ sơ này. Ba ca đỏ từ trước giữ nguyên (Out of scope).
