# Kế hoạch: lên đời công cụ design-assembly bằng lệnh upgrade

> Hồ sơ: `_acceptance/upgrade-design-assembly-tool/`. Spec: `docs/superpowers/specs/2026-11-16-upgrade-design-assembly-tool-design.md`.

**Mục tiêu:** kho chạy công cụ design-assembly của plugin bản 0.1.0, có dấu phiên bản, và hồ sơ chấm đúng kết quả ấy.

**Cách làm:** thay đổi đã làm xong trước hồ sơ, bằng lệnh `upgrade` của plugin. Kế hoạch chỉ còn đóng bước viết mã; lượt
chấm (S4) chạy mọi phép đo trong `evals.yaml`.

## Các việc

| Việc                                                 | Tệp                                                                                                    | Lệnh kiểm từng việc                                                                                                                 | Phục vụ                | Độc lập |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------- |
| 1. Lên đời bằng `upgrade` (đã làm, commit `158cf51`) | sáu tệp dưới `tools/design-assembly/`, `design/component-registry.json`, `design/tool-stamp.json`      | `make check` thoát 0 với dòng 17 quyết định và dòng sổ linh kiện khớp mã (đã chạy: 1961 bài đạt)                                    | E1, E2, E3, E4, E5, E9 | false   |
| 2. Ba phép đo kèm cặp hai chiều (đã viết)            | `_acceptance/upgrade-design-assembly-tool/rang/*`, `_acceptance/config.yaml` (bốn lệnh khai)           | `node --test _acceptance/upgrade-design-assembly-tool/rang/measures-two-way.mjs`: 4 bài đạt, mười hai ca phá đỏ với thông điệp ghim | E2, E3, E4, E6, E7, E8 | false   |
| 3. Đóng bước viết mã                                 | `_acceptance/upgrade-design-assembly-tool/contract.md` (`status: implemented`), `wiki/log.md` một dòng | `make check` thoát 0                                                                                                                | —                      | false   |

Không việc nào chạy song song: cả ba nối tiếp trên cùng nhánh, hai việc đầu đã xong.
