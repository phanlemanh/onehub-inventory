# Kế hoạch: khai-vai-va-man

Thiết kế: `_acceptance/khai-vai-va-man/design.md` · Hợp đồng: `_acceptance/khai-vai-va-man/contract.md`

Thực thi tuần tự trong một phiên: các việc dùng chung một máy kiểm và một tệp bài kiểm, nên không chia song song.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Khai bốn vai, sinh lại kiểu | `ontology/roles.yaml`, `src/generated/ontology.ts` (máy sinh, commit riêng) | `make gen && make ontology` | E1, E11 | không |
| 2 | Khai sổ màn | `design/screens.yaml` | đọc lại bằng bộ đọc YAML của kho, có PyYAML và không | E2, E4, E11 | không |
| 3 | Máy kiểm sổ vai và sổ màn | `tools/coverage_matrix/check.py`, `tools/coverage_matrix/registry.py` | bài kiểm tệp 5 phần vai và màn, có ca phá | E1, E2, E3, E4 | không |
| 4 | Máy kiểm khối Vai × Màn trong hợp đồng | `tools/coverage_matrix/contracts.py` | bài kiểm tệp 5 phần hợp đồng, bảng 8 ca phá | E5, E6, E7 | không |
| 5 | Bài kiểm | `tests/coverage-matrix.test.ts` | `npx vitest run tests/coverage-matrix.test.ts` | E1–E9 | không |
| 6 | Lệnh số đo | `tools/coverage_matrix/check.py --report`, `--json` | ca đếm khớp bảng viết trước | E7, E8 | không |
| 7 | Nối vào make check | `mk/coverage.mk` (đích `coverage-matrix`, `coverage-report`, biến `COVERAGE_ROOT`) | `make -n check`, `make coverage-matrix` | E9, E10 | không |
| 8 | Ghi wiki và chạy toàn bộ | `wiki/log.md` (một dòng) | `make check` | E10 | không |

## Thứ tự và lý do

1 → 2 trước vì máy kiểm đọc hai tệp ấy. 3 và 4 viết cùng bài kiểm (5) theo lối viết ca đỏ trước: mỗi ca phá có thông điệp ghim, kèm đối chứng dương trên cùng bản sao. 6 dựa trên phần phân loại hồ sơ của 4. 7 sau cùng để `make check` chỉ bật khi máy kiểm đã xanh trên kho.

## Bản sao kho trong bài kiểm

Bài kiểm dựng bản sao tối thiểu trong thư mục tạm: chép `ontology/labels.yaml`, `ontology/roles.yaml`, `design/screens.yaml` thật và các `page.tsx` thật (giữ đường dẫn), rồi phá một chỗ. Hồ sơ mẫu viết trong bài kiểm. Đường dẫn kho suy từ vị trí tệp bài kiểm, không ghi cứng.

## Rủi ro

- Bộ đọc YAML dự phòng của kho có thể không đọc được một dạng viết; sổ chỉ dùng danh sách khối và ánh xạ đơn giản, bài kiểm chạy bộ đọc dự phòng trên hai sổ thật.
- Vòng giao diện đang chạy ở dãy khác sẽ cần khối khi gộp nhánh chính sau hàng này; giám sát được báo lúc trình cổng.
