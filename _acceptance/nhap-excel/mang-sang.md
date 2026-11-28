# Hàng 11 — khối mang sang: gốc trong git và khối dựng lại

Script: `_acceptance/nhap-excel/rang/dung-lai-mang-sang.mjs` (G-2811-101). Mỗi khối mang sang chép nguyên từ báo cáo của vòng nguồn,
chỉ thêm `carried_from_round`. «Khớp» đọc lại tệp vừa ghi: khối bỏ dòng mang sang thì giống từng ký tự khối gốc trong git.

| Phép | Vòng nguồn | Commit nguồn | run_id | exit_code | verifier | verified_at | Khớp |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E10 | 9 | `0f8e4c54` | minted-nhap-excel-E10-r9 | 0 | `config:executors.script.cach_ly_d` | 2026-11-28T06:10:25Z | có |
| E11 | 8 | `ffb7216f` | minted-nhap-excel-E11-r8 | 0 | `config:executors.test.nhap_excel_unit` | 2026-11-28T05:23:19Z | có |
| E19 | 6 | `849b0cb9` | minted-nhap-excel-E19-r6 | 0 | `config:executors.ui-check` | 2026-11-27T23:38:25Z | có |
| E23 | 1 | `1feca45a` | minted-nhap-excel-E23-r1 | 0 | `config:executors.design.khuon` | 2026-11-27T11:09:53Z | có |

Khối trước khi dựng lại (do lượt tổng hợp của vòng 12 viết), dòng đầu của phần đầu ra:

- E10: `carry-forward tu round 9 — delta khong cham paths cua eval`
- E11: `carry-forward tu round 8 — delta khong cham paths cua eval`
- E19: `carry-forward tu round 6 — delta khong cham paths cua eval`
- E23: `carry-forward tu round 1 — delta khong cham paths cua eval`
