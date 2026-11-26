---
schema_version: 2
feature_slug: lui-ban-luc-xoay-mat-khau
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 994c345f004fbe5440e26a2b562d153038fd1663
human_signoff: Manh Phan 2026-11-22
---

# Evidence Report: lui-ban-luc-xoay-mat-khau

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-2 | judgment | PASS |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-5 | judgment | PASS |
| E7 | AC-6 | script | PASS |

## Evidence

- eval: E2
  run_id: minted-lui-ban-luc-xoay-mat-khau-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T09:03:54Z
  output: |
    Một lần chạy, một lần đạt. Các ca «E2 · đọc được mã», «E2 · một chỗ», «E2 · đủ dòng» và «E2 · lý do kiểm nhanh» đều đạt, cả chiều xanh lẫn chiều đỏ trên cùng nội dung.

- eval: E4
  run_id: minted-lui-ban-luc-xoay-mat-khau-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T09:03:54Z
  output: |
    Một lần chạy, một lần đạt. Ca «E4 · nội dung thật» và ca «E4 · sổ phải có dòng chặn» đạt, cùng các chiều đỏ của dòng chặn.

- eval: E5
  run_id: minted-lui-ban-luc-xoay-mat-khau-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T09:03:54Z
  output: |
    Một lần chạy, một lần đạt. Ca «E5 · nội dung thật» đạt, kể cả đối chứng dương và chiều đỏ.

- eval: E7
  run_id: minted-lui-ban-luc-xoay-mat-khau-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-22T09:03:54Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

### Phán xét (judge panel — đề xuất, chờ người)

- eval: E1
  judged_by: judge-subagent (fresh context), panel đề xuất PASS
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — Mục khớp mã ở cả sáu điểm. Trong STEPS, `bien` (ghi DATABASE_URL qua `stepVercelVars`) chạy trước `vai-dang-nhap` (`alter role … password`) và `dung`. `deploymentLines` in `bản <id> · <url> · commit … · tạo <ISO UTC>`. `kiemNhanh` đòi `body.vai === "dat"` và `healthOf` chỉ trả ok khi cổng nhận vai. Các dòng của bảng khớp từng chuỗi in trong `rollBack` và `luiBan`, và `make dat-khoa XOAY=1` cùng tab Actions › Deploy đều có thật. Không thấy câu nào nói sai điều mã làm.
    - operational-feasibility: PASS — Mục khớp bốn tệp mã ở cả sáu điểm. Thứ tự bước là bien, vai-dang-nhap, dung (STEPS trong len-ban.mjs). vai-dang-nhap chạy alter role đặt mật khẩu trong cơ sở dữ liệu. make rollback in "bản <id> · <url> · commit … · tạo <ISO UTC>". kiemNhanh đòi vai "dat". Các dòng bảng khớp chữ in và hành vi trong mã.
    - spec-alignment: PASS — Mục khớp mã ở cả sáu điểm. Thứ tự bước có `bien`, rồi `vai-dang-nhap`, rồi `dung`. `deploymentLines` in "tạo <giờ ISO>". `kiemNhanh` đòi `ok` true và `vai` "dat". Hai lệnh `make deploy` và `make rollback` đều gọi `kiemNhanh`. `XOAY=1` có trong mk/deploy.mk, workflow Deploy có trong deploy.yml.
  human_override:  # chi nguoi ghi

- eval: E3
  judged_by: judge-subagent (fresh context), panel đề xuất PASS
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — Đối chiếu cả 8 ý với `rollBack`, `STEPS` của `lenBan`, `lui-ban.mjs`, `kiemNhanh` và `healthOf`, không hàng nào sai với mã. Hàng `đã lùi về bản trước` nói bản trước nối được lúc kiểm. Ba dòng DỪNG nói tên miền ở bản mới, không mất kết nối vì mật khẩu. Hàng `tên miền đã về bản … nhưng kiểm nhanh đỏ` và hàng `make rollback` nói mất kết nối, lý do khớp `ok = (vai==="dat")` trong `healthOf`. Hai hàng ĐỎ còn lại nói không chắc tên miền ở đâu. Dòng phụ được gán theo dòng đứng trước. Bước đỏ sau `vai-dang-nhap` có tách lượt xoay đầu với lượt chạy lại, khớp thứ tự STEPS.
    - operational-feasibility: PASS — Đối chiếu từng hàng của bảng với `rollBack`, vòng bước của `lenBan`, `lui-ban.mjs`, `kiemNhanh` và `healthOf`. Cả 8 ý đều khớp mã. Dòng `đã lùi về bản trước` chỉ in sau khi tên miền về đúng `before.id` và `kiemNhanh` đạt. Ba dòng `lùi bản DỪNG` nói tên miền ở bản mới. Hàng 159 khớp `kiemNhanh` và `health.ts`. Hàng 154 kể đúng các bước đứng sau `vai-dang-nhap`. Hàng 160 «bản nào cũng vậy» khớp `lui-ban.mjs` dòng 69. Hàng 158 gán vị trí theo dòng đứng trước như hàm `stop`.
    - spec-alignment: PASS — Đối chiếu cả tám ý với rollBack, vòng STEPS của lenBan, lui-ban.mjs và kiemNhanh, hàng nào của bảng cũng khớp mã. Lý do «sức khoẻ ok khác true (vai: …)» đúng chuỗi kiem-nhanh.mjs dòng 88. Các bước đỏ sau `vai-dang-nhap` (`cach-ly`, `dung`, `kiem-nhanh`, `gan-ten-mien`) đúng thứ tự STEPS.
  human_override:  # chi nguoi ghi

- eval: E6
  judged_by: judge-subagent (fresh context), panel đề xuất PASS
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — Cả bốn sổ mở bằng cùng một dòng chặn ngay dưới tiêu đề, nêu khi nào áp, nêu tên mục và nói mục thắng mọi câu về lùi bản. Các câu «lùi bản ngay», «chọn bản đã chạy tốt gần nhất», «gấp thì dùng dòng cuối» đều kèm điều kiện «vừa xoay» hoặc đã được mục ghi đè. Các dòng «Đạt khi» của bước 2 và 5 khớp STEPS trong len-ban.mjs. Mọi hàng `bien` và `vai-dang-nhap` đều dặn không bấm dựng lại trên Vercel. Không câu nào bảo in, dán hay gửi giá trị khoá.
    - operational-feasibility: PASS — Cả bốn sổ mở bằng dòng chặn «Đã xoay mật khẩu vai đăng nhập?». Các câu dễ gây lùi nhầm đều kèm dòng «Vừa xoay… đọc mục…» hoặc nằm dưới dòng chặn. Chỗ vụng nhỏ: hàng «gấp thì dùng dòng cuối» và câu «việc ấy đã xong» ở «Khi nào dùng» không tự kèm lời dặn, nhưng dòng chặn và hàng bảng của mục bao được chúng. Hai dòng «Đạt khi» khớp thứ tự STEPS ở cả staging và production. Chỗ nhập khoá duy nhất là `make dat-khoa` hoặc trang GitHub.
    - spec-alignment: PASS — Cả bốn sổ mở bằng cùng một dòng chặn ngay dưới tiêu đề. Các câu dễ gây lùi nhầm đều có câu «vừa xoay» đi kèm, hoặc dòng cuối trỏ về mục. Các «Đạt khi» của bước 2 và bước 5 khớp thứ tự STEPS. Cả năm hàng `bien` và cả hai hàng `vai-dang-nhap` dặn không bấm dựng lại trên Vercel. Các chỗ «dán» đều chỉ vào `make dat-khoa`, `gh secret set` hay trang Secrets của GitHub.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lui-ban-luc-xoay-mat-khau-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-22T09:03:54Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-lui-ban-luc-xoay-mat-khau-SUITE-DATABASE_URL_make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-22T09:03:54Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên bản hiện tại lẫn baseline):
- E7 (`make check`): xanh cả hai phía, là lưới hồi quy chung của cả kho, không khẳng định hành vi mới của tính năng này.

Baseline không đo:
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E2: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E4: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E5: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chi tiết nằm ở lịch sử commit của nhánh, không chép lại ở đây.
Round 2: bị trả lại (kết luận «dừng vá»), chi tiết ở commit «S4 round 2 evidence». Sau đó đổi hình dạng bản làm và duyệt lại Cổng 1.
Round 3: E2, E4, E5, E7 đạt, ba mục phán xét E1, E3, E6 do hội đồng đề xuất đạt; hai lệnh suite đạt.
