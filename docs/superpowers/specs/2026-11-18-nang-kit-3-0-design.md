# Nâng kit nghiệm thu lên 3.0.0 (kho delivery-loop)

Ngày: 2026-11-18 · Hạng: T3 · Hồ sơ: `_acceptance/nang-kit-3-0/` · Đợt «Chuyển nhà» của kit.

## Ý định và vì sao

Kit nghiệm thu đã dời từ kho `phanlemanh/acceptance-gate-kit` (đóng băng ở 2.39.0) sang kho công khai
`phanlemanh/delivery-loop`; thẻ `v3.0.0` cắt ngày 18/11/2026 trên commit `c16d25db`. Chủ kho chọn `onehub-inventory` là kho
nhận 3.0 đầu tiên vì kho này chạy vòng thật. Mốc 3.0 chỉ «được kho nhận» khi một commit ở nhánh chính kho này cài nó. Vòng
này làm commit ấy: đổi bốn chỗ kho đang trỏ về kit cũ sang kit mới, và không để kho chạy lẫn hai bản kit.

Thành công: CI của kho kéo kit 3.0 theo thẻ và cổng trước-gộp của 3.0 cho nhánh đi qua (sau chữ ký); phán quyết trên hồ sơ
cũ của kho không đổi khi đổi engine; phiên Claude Code trên máy đã cài chợ mới dùng đúng kit 3.0.

Thất bại dù «chạy được»: một máy chưa cài chợ mới lặng lẽ chạy lõi 2.38 trong khi CI chạy 3.0 — hai bản kit chấm cùng một
kho mà không ai thấy.

## Hiện trạng

- `.github/workflows/ci.yml`, việc `gate`: `KIT_TAG: v2.38.1`, kéo từ `phanlemanh/acceptance-gate-kit`, đặt
  `CLAUDE_PLUGIN_ROOT=$RUNNER_TEMP/kit` (bố cục cũ: lõi ở gốc kit).
- `.claude/settings.json`: chợ `acceptance-gate-kit`, sáu khoá `…@acceptance-gate-kit`, ba tên plugin cũ (`road-map`,
  `tri-thuc`, `dieu-phoi`).
- `tools/kit-root.mjs`: đọc khoá `acceptance-gate@acceptance-gate-kit` trong `~/.claude/plugins/installed_plugins.json`.
  Bốn lệnh executor của `_acceptance/config.yaml` (dòng 42, 141, 142, 144) gọi nó khi `CLAUDE_PLUGIN_ROOT` vắng.
- `docs/tri-thuc/TRI-THUC.md`: lệnh `/tri-thuc:ghi`, `/tri-thuc:kiem`, đường khuôn theo bố cục cũ.
- Quét tên cũ còn hai chỗ ngoài bản vá diễn tập: `docs/plan/dot-nen/README.md` (`/dieu-phoi:mo-dot`, «gói `dieu-phoi`») và
  chú thích khoá `dieu_phoi.goi_dot` trong `_acceptance/config.yaml`.

- `tools/commit_msg.py` cho qua tin commit mở đầu `tri-thuc: `: đó là tin kit tự viết khi ghi trang tri thức, và kit 3.0
  vẫn viết đúng tiền tố ấy (`plugins/acceptance-gate/scripts/tri-thuc-ghi.mjs`). Giữ nguyên.

Kit 3.0 không có bí danh tên cũ (CHANGELOG 3.0.0 của kit, mục «Vì sao 3.0.0»), nhưng vẫn đọc các khoá cấu hình
`dieu_phoi.goi_dot` và `tri_thuc` như cũ — không cần đổi tên khoá.

## Mục tiêu, ngoài mục tiêu

Mục tiêu: sáu tệp của bản vá diễn tập + hai chỗ gọi lệnh cũ; ca kiểm mới cho `kit-root`; phép đo của hồ sơ chứng cổng 3.0
và đối chứng engine.

Ngoài mục tiêu: cài/gỡ plugin hay chợ trên máy (bước 2.4, chủ kho làm); mở PR, gộp; sửa kho khác; đổi tên khoá cấu hình;
sửa design doc cũ nhắc tên đợt `dieu-phoi-nen` (tên đợt, không phải tên plugin).

## Ràng buộc

- `.github/workflows/` là đường của người (AGENTS.md; `.claude/settings.json` cấm Edit). Sửa `ci.yml` cần chủ kho duyệt ở
  Cổng Phạm vi (Hỏi-1).
- Chữ ký Cổng Bằng chứng là của người; cổng trước-gộp đòi chữ ký cho đường T3 (`tools/**`, `.claude/settings.json`), nên trước
  khi ký cổng còn đúng một dòng VIOLATION gọi tên chính hồ sơ này.
- Máy này chưa có chợ `delivery-loop`. Lượt chấm S4 đặt `CLAUDE_PLUGIN_ROOT` vào bản kit 3.0 kéo theo thẻ, không dựa vào
  `kit-root`.

## Các cách làm

| Cách | Làm gì | Được | Mất |
|---|---|---|---|
| **A — chọn** | Áp lại bản vá diễn tập lên đầu `origin/main`, dọn thêm hai chỗ gọi lệnh cũ; `kit-root` chỉ đọc khoá mới; chợ ghim `ref` bằng `KIT_TAG` | Một bản kit — cùng thẻ — trên cả máy và CI; bản vá đã đo không làm hồ sơ nào đỏ | Máy chưa cài chợ mới mất kit cho tới khi cài (Hỏi-2) |
| B | Như A nhưng `kit-root` đọc lùi khoá cũ khi không thấy khoá mới | Máy chưa cài vẫn chạy | Máy chạy lõi 2.38 trong khi CI chạy 3.0, không tiếng báo — đúng kiểu thất bại phải tránh |
| C | Chỉ đổi `ci.yml`, để settings và `kit-root` tới khi cài chợ | Không đụng đường T3 | Máy và CI chạy hai bản kit; mốc chưa «được nhận» trọn |

Chọn A. B và C chết vì cùng một lý do: hai bản kit chấm một kho.

## Thiết kế

1. `ci.yml`, việc `gate`: ba dòng của bản vá diễn tập — `KIT_TAG: v3.0.0`, URL `https://github.com/phanlemanh/delivery-loop`,
   `CLAUDE_PLUGIN_ROOT=$RUNNER_TEMP/kit/plugins/acceptance-gate` (GUIDE §5.3 của kit 3.0). Không đổi dòng nào khác.
2. `.claude/settings.json`: chợ `delivery-loop` (repo `phanlemanh/delivery-loop`, `ref: v3.0.0` cùng thẻ với `KIT_TAG` —
   khuyến nghị của Hỏi-3; thêm so với bản vá diễn tập); sáu khoá `acceptance-gate`,
   `feature-loop`, `diagram-design`, `roadmap`, `knowledge`, `dispatch` `@delivery-loop`; giữ `superpowers`, quyền và móc
   không đổi.
3. `tools/kit-root.mjs`: hằng `PLUGIN_KEY = "acceptance-gate@delivery-loop"` và hàm `installEntries(registry)` đọc đúng khoá
   ấy; không đọc lùi. `tools/kit-root.d.mts` khai hai tên mới. `tests/kit-root.test.ts` +3 ca, viết trước (đỏ) rồi vật
   (xanh).
4. `docs/tri-thuc/TRI-THUC.md`: `/knowledge:ingest`, `/knowledge:health`, đường khuôn
   `plugins/acceptance-gate/skills/acceptance/references/tri-thuc-template.md`.
5. `docs/plan/dot-nen/README.md`: `/dispatch:open`, gói `dispatch`. Chú thích khoá `dieu_phoi.goi_dot` trong
   `_acceptance/config.yaml`: `/dispatch:open <name>`.
6. Phép đo của hồ sơ ở `_acceptance/nang-kit-3-0/rang/`, mỗi phép một lệnh `nk30_*` trong `_acceptance/config.yaml`; phép
   nào cần kit thì tự kéo theo thẻ vào thư mục tạm ngoài kho. Một tệp phá-thử hai chiều cho mọi phép đo.
7. `wiki/log.md` một dòng; `wiki/decisions/` một trang cho việc đổi nguồn kit.

## Phần để người dựng tự quyết

Cách tổ chức tệp phép đo, thông điệp ghim cụ thể (giữ các dòng đã khai trong `evals.yaml`), tên thư mục tạm.

## Giới hạn đã khai

- Phiên nạp đủ 6 plugin của chợ mới chưa đo ở kho này (máy chưa cài chợ `delivery-loop`).
- Cổng trước-gộp «0 VIOLATION» chỉ đo được sau chữ ký người; lượt chấm chứng «mọi VIOLATION chỉ gọi tên hồ sơ này», CI của
  PR là chốt sau ký.
