# Nâng kit nghiệm thu lên delivery-loop v3.1.1 — design

Ngày: 2026-11-24 · Hồ sơ: `_acceptance/nang-kit-3-1-1/` · Nhánh `claude/nang-kit-3-1-1-b57b69`, cắt từ `origin/main` `d47869ac`

## Vì sao

Thẻ `v3.1.1` của `phanlemanh/delivery-loop` (commit `1193bc22`, bản phát hành 23/11/2026) là bản vá của `v3.1.0`: lệnh gộp
theo lời của gói `dispatch` đọc chữ ký bằng vị từ của lõi, nên báo cáo mang chữ ký giữ chỗ (`pending`, `TBD`…) thôi qua vế
chữ ký. Kho này là kho nhận của mốc 3.1.x và đang ghim `v3.1.0` ở hai chỗ. Mốc 3.1.1 chỉ tính là «được kho nhận» khi một
commit trên nhánh chính của kho này kéo kit ở `v3.1.1`. Chủ kho quyết 24/11: Inventory nhận 3.1.1 trước khi kit mở thêm vòng.

## Thay đổi

Hai dòng, mỗi dòng một tệp:

1. `.claude/settings.json`, `extraKnownMarketplaces.delivery-loop.source.ref`: `v3.1.0` → `v3.1.1`. Tệp thuộc
   `risk_tiers.t3_paths`, nên vòng là T3.
2. `.github/workflows/ci.yml`, `KIT_TAG` của việc `gate`: `v3.1.0` → `v3.1.1`. Tệp của người (AGENTS.md; `Edit` bị chặn ở
   `.github/workflows/**`). Máy giữ bản vá một dòng ở `_acceptance/nang-kit-3-1-1/ci-kit-tag.patch` và chỉ áp bằng
   `git apply` khi chủ kho cho ở Cổng Phạm vi (Hỏi-1) — khuôn chủ kho đã nhận ở `nang-kit-3-0` (Hỏi-1, 18/11).

Không đổi gì khác: lớp chép CI không có ở kho này (việc `gate` kéo kit theo thẻ vào thư mục tạm), không khoá cấu hình mới,
không đổi khuôn hồ sơ.

## Bản vá đổi gì, và có chạm kho này không

`git diff --stat v3.1.0 v3.1.1 -- plugins/` đổi đúng chín tệp:

| Tệp                                                                                                                 | Kho này có chạy nó không                                               |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `plugin.json` của năm gói (`acceptance-gate`, `dispatch`, `feature-loop`, `knowledge`, `roadmap`) — chỉ đổi số      | Claude Code đọc khi cài; không mã nào của kho đọc                      |
| `acceptance-gate/commands/signoff.md` — dòng lệnh ký mang đuôi `--loi`                                              | Phiên đọc khi chủ kho ký; không chạy ở CI                              |
| `dispatch/scripts/dieu-phoi.mjs`, `dispatch/scripts/gop.mjs` — lối `gop … --theo-loi` đọc chữ ký bằng vị từ của lõi | Chỉ chạy khi kho bật `feature_loop.gop_theo_loi_ky`; kho này không bật |
| `feature-loop/skills/feature-loop/SKILL.md` — khối `GOP-THEO-LOI-KY` mang đuôi `--loi`                              | Phiên đọc; khối chỉ dùng khi kho bật khoá trên                         |

`plugins/acceptance-gate/scripts/` và `plugins/acceptance-gate/lib/` không đổi một byte giữa hai thẻ, nên cổng trước-gộp mà
việc `gate` của CI chạy và bốn lệnh executor của `_acceptance/config.yaml` (đều dưới gốc lõi) cho cùng kết quả ở hai bản.
Vòng vẫn đo cả hai cách: phép so cây (AC-5) và phép chạy cổng hai bản trên mọi hồ sơ như `nang-kit-3-1` (AC-6), vì chỉ so
cây thì bỏ sót trường hợp cổng đọc một tệp đổi nằm ngoài `scripts/` và `lib/` (phản biện context sạch, P0-1).

## Phép đo

Mọi phép đo kéo kit theo thẻ vào `os.tmpdir()` ngoài kho, đối chiếu commit với ma trận viết trước (`rang/matrix.mjs`), và
không dựa vào bản cài trên máy. Phép đo dựng lại từ khuôn `_acceptance/nang-kit-3-1/rang/` (cùng tác giả, đã qua hai lượt
chấm), đổi ma trận sang `v3.1.0 → v3.1.1`:

- `settings.mjs` — một dòng đổi, sáu plugin bật đúng bằng chợ ở thẻ.
- `tag.mjs` — thẻ bóc tới `1193bc22`; năm gói `3.1.1`, `diagram-design` `3.0.0`.
- `ci-line.mjs` (mới) — `ci.yml` khác nhánh gốc đúng dòng `KIT_TAG` của việc `gate`, và `ci-kit-tag.patch` là đúng diff ấy.
- `kiem-ban-cai.mjs` (mới) — chạy `kiem-ban-cai.mjs --ref v3.1.1` của chính thẻ trên một bản kéo kit có thẻ, đòi
  `TỔNG KẾT: ĐẠT 8/8`.
- `kit-diff.mjs` (mới) — chín tệp đổi đúng như bảng trên; `acceptance-gate/scripts` và `acceptance-gate/lib` giống hệt;
  bốn lệnh executor của kho chạy tệp dưới `scripts/` hay `lib/` của lõi; kho không bật `feature_loop.gop_theo_loi_ky`.
- `gate-control.mjs` — cổng trước-gộp `--recheck-all` trên merge-base bằng kit `v3.1.0` và `v3.1.1`: cùng tập hồ sơ thông,
  0 dòng chặn; trên HEAD hai kit in cùng các dòng phán.
- `gate-branch.mjs` — cổng trước-gộp của kit theo `KIT_TAG` trên HEAD: chạy hơn 0 luật, trước chữ ký ít nhất một dòng chặn
  và mọi dòng chặn gọi tên hồ sơ này; sau chữ ký 0 dòng.
- `two-way.mjs` — mỗi phép đo xanh trên vật lành, đỏ với thông điệp ghim trên bản sao bị phá.

## Máy đang cài gì (không phải việc của vòng)

`kiem-ban-cai --may --ref v3.1.1` trên máy này, 24/11: chợ `delivery-loop` ở sổ máy (`known_marketplaces.json`) còn trỏ
`v3.0.0`, năm gói trong bộ nhớ đệm là `3.0.0`. Giới hạn (1) của `nang-kit-3-1` — «phiên nạp 3.1 sau gộp chưa đo» — đã thành
thật: phiên trên máy này vẫn chạy 3.0.0 dù kho ghim `v3.1.0` từ 22/11. Cài lại ở mức máy là của chủ kho (Hỏi-2); máy chỉ in
lệnh. Vòng này chạy bằng feature-loop 3.0.0 của bộ nhớ đệm.

## Rủi ro

- CI đổi `KIT_TAG` trong cùng PR: việc `gate` của chính PR này đã kéo `v3.1.1`. Vì `scripts/` và `lib/` của lõi không đổi,
  kết quả như `v3.1.0`.
- Thẻ là đối tượng có thể bị gắn lại; phép đo ghim commit `1193bc22`, thẻ trỏ chỗ khác là đỏ.
