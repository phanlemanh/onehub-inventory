# Kế hoạch: lên đời công cụ design-assembly lên bản 0.7.0

> Hồ sơ: `_acceptance/upgrade-design-assembly-0-7-0/`. Spec: `docs/superpowers/specs/2026-11-17-upgrade-design-assembly-0-7-0-design.md`.

**Mục tiêu:** kho chạy công cụ design-assembly bản 0.7.0. Sổ linh kiện, sổ màn và sổ khối thôi gây xung đột ở pull
request. Hồ sơ chấm đúng kết quả ấy.

**Cách làm:** thay đổi đã làm xong trước hồ sơ (commit `ec2c4597`). Kế hoạch còn ba việc: cài thư viện theo Hỏi-1, đóng
bước viết mã, rồi để lượt chấm (S4) chạy mọi phép đo trong `evals.yaml`.

## Các việc

| Việc | Tệp | Lệnh kiểm từng việc | Phục vụ | Độc lập |
| --- | --- | --- | --- | --- |
| 1. Lên đời 0.1.0 → 0.7.0 và năm bước sổ (đã làm, commit `ec2c4597`) | 81 tệp, 13 nhóm (`FILE_GROUPS` ở `rang/matrix.mjs`) | `make check` thoát 0: 2460 bài, 17 quyết định giữ bằng 25 lệnh kiểm (đã chạy ở đường nền) | E1–E14 | false |
| 2. Mười ba phép đo kèm cặp hai chiều (đã viết, commit `e4b1fbc5`) | `_acceptance/upgrade-design-assembly-0-7-0/rang/*`, `_acceptance/config.yaml` (13 lệnh khai) | `node --test …/rang/measures-two-way.mjs` (10 bài đạt); `node --test …/rang/shallow-two-way.mjs` (1 bài đạt) | E2–E22 | false |
| 3. Cài thư viện theo lockfile (Hỏi-1, chủ kho cho phép) | `node_modules/` của worktree này, không vào git | `node -p "require('next/package.json').version"` in `16.4.6` | E1 và bộ suite (`build`, `e2e`) | false |
| 4. Đóng bước viết mã | `contract.md` (`status: implemented`), `wiki/log.md` một dòng | `make check` thoát 0; `change-list.mjs` xanh | — | false |

Không việc nào chạy song song: bốn việc nối tiếp trên cùng nhánh, hai việc đầu đã xong.

## Bảng cho người duyệt

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
| --- | --- | --- |
| Hai pull request cùng thêm màn hay khối không còn xung đột | `design/screens/`, `design/intake/` | AC-5 (không mất dữ liệu), AC-6 (gộp sạch) |
| Đổi mã không còn kéo theo diff dài của tệp máy sinh | `.gitignore`, `mk/derived.mk` | AC-2 (bản tải sạch), AC-4 (ngoài git) |
| Kho chạy đúng bản công cụ plugin phát hành | `tools/design-assembly/`, `mk/design-assembly.mk` | AC-3 (đúng bản 0.7.0) |
| Luật «chọn trước, tạo sau» không tắt lặng | `tools/proof_gate/` | AC-8 (cổng đọc thư mục mảnh) |
| Biết một thay đổi chạm màn nào | `design/theme.json` | AC-7 (đo trên 30 lần gộp) |
| Lượt chấm chạy đủ build và e2e | `node_modules/` (không vào git) | bộ suite của lượt chấm |
| Hồ sơ đóng bước viết mã, nhật ký wiki có một dòng | `contract.md`, `wiki/log.md` | AC-10 (tệp của hồ sơ) |

## Sau kế hoạch

- Lượt chấm S4 bằng workflow `acceptance-verify.js` của kit, args do `s4-args.mjs` sinh.
- Gặp lỗi trong `tools/design-assembly/`: vòng dừng và trình chủ kho (dòng sổ thay `d-20261117T041622Z-4`).
