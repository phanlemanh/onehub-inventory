# Tắt plugin chợ cũ ở mức kho — design

Hồ sơ: `_acceptance/tat-plugin-cho-cu/` · hạng T3 (`.claude/settings.json` nằm trong `t3_paths`) · 18/11/2026.

## Vấn đề

PR #87 chuyển kho sang kit 3.0 của chợ `delivery-loop`. Máy của chủ kho vẫn bật ba plugin của chợ cũ (kho kit đóng băng ở
2.39.0) ở mức người dùng (`~/.claude/settings.json`). Tệp `.claude/settings.json` của kho không tắt chúng, nên phiên mở ở
kho này nạp cả hai bản. Đo ngày 18/11 trên phiên thật (`claude -p "ok" --output-format stream-json --verbose --max-turns 1`,
sự kiện `system`/`init`, trường `plugins`): acceptance-gate 2.38.1 và 3.0.0, feature-loop 2.38.1 và 3.0.0, diagram-design
2.7.1 và 3.0.0. Lệnh trùng tên rơi vào bản cũ: chính phiên mở vòng này gõ `/feature-loop:feature-loop` và nhận bản 2.38.1.

## Cách làm

Thêm vào `enabledPlugins` của `.claude/settings.json` sáu khoá `false`, mỗi khoá là tên một plugin của chợ cũ cộng `@` và
tên chợ cũ: acceptance-gate, feature-loop, diagram-design, dieu-phoi, road-map, tri-thuc. Sáu là đúng danh sách
`marketplace.json` của chợ cũ. Máy này chỉ bật ba plugin đầu; ba plugin sau phòng cho máy khác.

Đo trước khi tin (18/11, cây chưa commit):

| Cây | Plugin kit nạp | `acceptance-gate:cat-luot` |
| --- | --- | --- |
| `origin/main` chưa sửa | 9 bản: ba plugin mỗi cái hai bản, cộng roadmap, knowledge, dispatch 3.0.0 | có |
| thêm ba khoá `false` | 6 bản, đều `@delivery-loop` 3.0.0 | không |
| thêm sáu khoá `false` | 6 bản, đều `@delivery-loop` 3.0.0, không lỗi nạp | không |

Dòng `false` ở mức kho thắng dòng `true` ở mức người dùng. Không đụng cài đặt mức người dùng của máy.

## Va chạm với hồ sơ đã ký

Thước `nk30_leftover` của hồ sơ `nang-kit-3-0` (AC-8: không còn tên chợ cũ ở tệp sống) quét cả `.claude/settings.json`.
Có khoá tắt thì nó đỏ: đo với ba khoá, thoát 1, «3 lines at HEAD». Thước `nk30_settings` cùng hồ sơ chỉ xét khoá bật nên vẫn
xanh. CI và cổng trước-gộp có `--base` không chạy lại eval của hồ sơ không có tệp trong diff, nên cổng không đỏ; thước chỉ đỏ
khi ai chạy lại hồ sơ ấy (chiến dịch ghim lại).

Máy khuyên (Hỏi-1 ở Cổng Phạm vi): không sửa hồ sơ đã ký trong vòng này. Hồ sơ mới đo đúng quan hệ «mọi dòng `nk30_leftover`
bắt ở HEAD là một khoá tắt trong `.claude/settings.json`, đủ sáu», và để lại hạt giống «sửa thước `nk30_leftover` cho chấp
khoá tắt», cùng lý do vòng trước đã loại `tools/kit-root.mjs` (tệp gọi tên khoá cũ để chối nó). Lối khác: sửa ngay
`SWEEP_EXCLUDE` của hồ sơ cũ, phải ghim lại hồ sơ ấy bằng làn máy (cỡ một giờ).

Phạm vi quét của `nk30_leftover` (đọc `SWEEP_EXCLUDE`, không sửa): hồ sơ ở `_acceptance/**` được chừa; design doc này, plan
của vòng và dòng `wiki/log.md` nằm trong phạm vi quét. Luật viết: ba tệp ấy gọi chợ cũ là «chợ cũ», không viết tên chợ, không
viết tên plugin cũ kèm `@` hay trong dấu backtick.

Lý do chọn sáu khoá có hai trục: cây (merge-base, HEAD) và trạng thái cài của máy. Plugin chợ cũ trùng tên bản mới thì phép
đếm tên bắt; plugin khác tên bản mới (dieu-phoi, road-map, tri-thuc) thì chỉ phép kiểm `source` bắt, nên thước phiên có ca phá
riêng cho nó.

## Phép đo

Phép thử phiên thật là thước chính. Nó phụ thuộc cài đặt của máy, nên là eval chạy tại máy, không chạy trong CI. Để không
xanh giả trên máy không bật plugin chợ cũ, thước tự kiểm tiền đề (mức người dùng có bật ít nhất một plugin chợ cũ, đọc chỉ
đọc) và có đối chứng dương: cùng thước chạy trên cây `merge-base` với `origin/main` phải đỏ với thông điệp ghim. Mỗi lần chạy
gọi model một lượt (`--max-turns 1`, câu «ok»).

## Sau khi gộp

Đo lại phép thử phiên thật một lần trên checkout chính ở `main`, ghi kết quả vào mô tả PR.
