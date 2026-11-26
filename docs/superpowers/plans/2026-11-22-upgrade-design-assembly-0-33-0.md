# Kế hoạch: lên đời design-assembly lên 0.36.1 và viết phép đo của hồ sơ

Hồ sơ: `_acceptance/upgrade-design-assembly-0-33-0/`. Design doc:
`docs/superpowers/specs/2026-11-22-upgrade-design-assembly-0-33-0-design.md`. Nhánh `chore/upgrade-design-assembly-0.33.0`,
PR #107.

Bảy việc nối tiếp. Việc 1 phải xong trước việc 2, vì ma trận ghim mã commit chạy lại. Không việc nào độc lập với việc
trước nó, nên không chạy song song.

| Người dùng thấy gì khác                                      | Đụng đâu                                                                    | Phục vụ tiêu chí          |
| ------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------- |
| Bộ kiểm thiết kế của kho lên bản 0.36.1, cảnh báo CodeQL hết | `tools/design-assembly/`, `mk/design-assembly.mk`, `design/tool-stamp.json` | AC-3 (đúng bản phát hành) |
| Sổ wiki ghi lần lên đời thứ hai                              | `wiki/log/`                                                                 | AC-6 (danh sách tệp)      |
| Hồ sơ giữ các con số của 0.36.1 ở một chỗ                    | `rang/matrix.mjs`, `rang/lib.mjs`                                           | mọi tiêu chí              |
| Có phép đo cho cổng xanh cùng số và cây đúng bản             | `rang/gate-lines.mjs`, `rang/tool-tree.mjs`                                 | AC-2, AC-3                |
| Có phép đo cho «không quyết định nào đổi trạng thái»         | `rang/decision-states.mjs`                                                  | AC-4                      |
| Có phép đo trên bản sao nông và danh sách tệp                | `rang/shallow-alone.mjs`, `rang/change-list.mjs`                            | AC-5, AC-6                |
| Mỗi phép đo đã thấy đỏ một lần trên bản phá                  | `rang/two-way.mjs`, `rang/shallow-two-way.mjs`                              | AC-2 tới AC-6             |
| Lượt chấm chạy được dù đợt điều phối đang nghỉ               | bản chép ngoài kho                                                          | Hỏi-1 (chấm ngoài kho)    |

## Việc 1 — chạy lại `upgrade` với 0.36.1

- Bản xem trước đã chạy sau Cổng Phạm vi: 7 tệp công cụ (sửa `adapters/vite.mjs`, `check.mjs`, `contract.mjs`,
  `derived.mjs`, `ledger.mjs`; thêm `host-make.mjs`, `screen-facts.mjs`), `mk/design-assembly.mk`,
  `design/tool-stamp.json`; không mục sổ nào khác đi; không quyết định nào đổi trạng thái; cổng xanh.
- Chạy `node ~/.claude/plugins/cache/design-assembly/design-assembly/0.36.1/scripts/upgrade.mjs --target .` (không
  `--dry-run`). Kiểm `git status`: đúng 9 tệp ấy, không gì khác. Khác thì dừng, trình chủ kho.
- `make log m="..."` thêm một dòng nhật ký wiki.
- Commit `chore: upgrade design-assembly from 0.33.0 to 0.36.1, machinery only`.
- Verify: `make check` thoát 0, dòng 19/27, 294 linh kiện, 47/67, số bài như AC-1.
- Phục vụ: E1, E4, E10.

## Việc 2 — ma trận và thư viện đo

- `rang/matrix.mjs`: chỗ rời nhánh `6ce94d9f`, commit lên đời `26ab13af` và 28 tệp; commit chạy lại và 10 tệp; bản
  0.36.1, cây `f53b6453…`, 44 tệp; bước cổng `15c4208b…`; 19/27, 47/67, 19 held, 28 claimed, 67 quyết định, 294 linh kiện,
  số bài; thư mục plugin trong bộ nhớ đệm; danh sách tệp nhánh được đổi.
- `rang/lib.mjs`: chép từ hồ sơ 0.7.1, `ROOT` suy từ vị trí tệp, tên thư mục tạm theo hồ sơ này.
- Một dòng sổ `fix` ghim mã commit chạy lại và lời hai hàng trên bản sao nông.
- Verify: `node -e "import('./_acceptance/upgrade-design-assembly-0-33-0/rang/matrix.mjs')"` thoát 0.

## Việc 3 — phép đo nhanh và cặp hai chiều

- `gate-lines.mjs` (E2), `tool-tree.mjs` (E4, đọc thư mục bản của plugin), `decision-states.mjs` (E6, bản chép chia đối
  tượng, công cụ 0.7.1 lấy từ `6ce94d9f`), `change-list.mjs` (E10, có bộ lọc dòng cho hai tệp bản đồ).
- `two-way.mjs --only <tên>`: mỗi bài xanh trên vật lành rồi đỏ trên từng bản phá với đúng thông điệp ghim ở `expected`
  của E3, E5, E7, E11. Thiếu cặp thì việc chưa xong.
- Verify: chạy từng lệnh của E2–E7, E10, E11 ở bản chép, đều thoát 0.

## Việc 4 — phép đo bản sao nông và cặp hai chiều

- `shallow-alone.mjs` (E8): bản sao sâu 1 commit, `origin` là kho trung gian có `main` ở chỗ rời nhánh; mỗi ca một
  thư mục tạm riêng.
- `shallow-two-way.mjs` (E9): ca `origin` không có `main`, ca `main` cũ hơn (`6ce94d9f`).
- Verify: hai lệnh thoát 0; không bản sao nào sót trong thư mục tạm.

## Việc 5 — đẩy nhánh, chờ CI

- Đẩy nhánh (gồm commit gộp `main`, Cổng Phạm vi, việc 1 tới 4). Job CodeQL phải xanh trên commit 0.36.1; còn
  đỏ thì dừng, trình chủ kho và báo phiên design-assembly.
- Verify: `gh pr checks 107`.

## Việc 6 — dựng bản chép ngoài kho (Hỏi-1)

- `git clone` nhánh từ kho này ra `~/dev/onehub-inventory-cham-107`, `origin` trỏ GitHub như kho chính (để
  `origin/main` có thật), `make setup`.
- Đổi thư mục phiên sang bản chép (có hiệu lực ở lượt sau). Chạy đường nền (`duong-nen.mjs`) ở đó.
- Việc 1 tới 4 làm ở kho chính (móc chỉ chặn đường nền và lượt chấm); bản chép lấy nhánh sau khi đẩy ở việc 5. Commit
  của lượt chấm làm ở bản chép, đẩy lên cùng nhánh; kho chính kéo về khi xong.
- Verify: HEAD của bản chép bằng HEAD của kho chính.

## Việc 7 — chuyển hồ sơ sang `implemented`, vào lượt chấm

- Đặt `status: implemented`, commit. Lượt chấm chạy từ bản chép.

## Rủi ro đã thấy

- Bước cổng 0.36.1 thay dòng `.PHONY` và thêm khối điều kiện cho danh sách bước dựng chung. `Makefile` của kho không
  khai `DERIVED_TARGETS`, nên bước cổng đi đường cũ; `make check` của việc 1 chứng điều đó.
- `upgrade` không xoá tệp mà mẫu mới bỏ (giới hạn `upgrade-has-no-remove` của plugin). AC-3 so cả cây nên tệp thừa làm đỏ.
