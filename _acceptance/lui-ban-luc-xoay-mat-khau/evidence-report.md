---
schema_version: 2
feature_slug: lui-ban-luc-xoay-mat-khau
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f55122181dcbe4054b36201182e29bb3342420c0
human_signoff:
---

# Evidence Report: lui-ban-luc-xoay-mat-khau

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | UNCERTAIN |
| E2 | AC-2 | test | PASS |
| E3 | AC-2 | judgment | UNCERTAIN |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-5 | judgment | UNCERTAIN |
| E7 | AC-6 | script | PASS |

## Evidence

- eval: E2
  run_id: minted-lui-ban-luc-xoay-mat-khau-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T08:09:54Z
  output: |
    bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E2
    1 lần chạy, 1 lần đạt, không phương sai.

- eval: E4
  run_id: minted-lui-ban-luc-xoay-mat-khau-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T08:09:54Z
  output: |
    bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E4
    1 lần chạy, 1 lần đạt, không phương sai.

- eval: E5
  run_id: minted-lui-ban-luc-xoay-mat-khau-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T08:09:54Z
  output: |
    bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E5
    1 lần chạy, 1 lần đạt, không phương sai.

- eval: E7
  run_id: minted-lui-ban-luc-xoay-mat-khau-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-22T08:09:54Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lui-ban-luc-xoay-mat-khau-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-22T08:09:54Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-lui-ban-luc-xoay-mat-khau-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-22T08:09:54Z

### Hội đồng chấm (judgment) — đề xuất, chờ người

Chưa có mục nào được người chốt; mọi `human_override` để trống.

- eval: E1
  judged_by: judge panel (fresh context) — đề xuất panel: PASS
  verdict: UNCERTAIN
  rationale: Ba phiếu, một phiếu bất đồng. Chi tiết từng phiếu ở dưới.
  - domain-correctness: PASS — Mục khớp mã ở cả sáu điểm. Trong STEPS, `bien` ghi DATABASE_URL trước `vai-dang-nhap`, rồi mới tới `dung` dựng bản (tên miền chỉ đổi ở `gan-ten-mien`), nên luật theo bản dựng và việc chỉ bản dựng ở `dung` của lượt xoay hay lượt sau mới nối được đều đúng. `deploymentLines` in đúng `bản <id> · <url> · commit … · tạo <ISO UTC>`. `kiemNhanh` đòi `body.vai === "dat"` cho cả `make deploy` lẫn `make rollback`. `mk/deploy.mk` có `XOAY=1`, và workflow tên `Deploy` chạy `make deploy`. Mọi dòng in trong bảng (`DỪNG ở…`, ba dòng `lùi bản DỪNG`, `vercel rollback lỗi`, `kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt`) có thật trong mã, và không thấy câu nào nói sai điều mã làm.
  - operational-feasibility: FAIL — Bốn ý của AC-1 (luật theo bản dựng, lùi không cứu, chọn bản theo giờ tạo, thước "vai":"dat") và các chỗ trỏ tới Actions › Deploy hay make dat-khoa … XOAY=1 đều khớp mã. Nhưng bảng của mục có một câu nói sai điều mã làm: hàng `kiem-nhanh-ten-mien ĐỎ, rồi lùi bản ĐỎ — không đọc được danh sách bản của Vercel` kết luận «Không chắc tên miền đang ở bản nào». Trong `rollBack` của len-ban.mjs, dòng «không đọc được danh sách» chỉ in bên trong `stop()`, sau một dòng khác (DỪNG hay ĐỎ), nên không bao giờ đứng ngay sau `kiem-nhanh-ten-mien ĐỎ`.
    - bằng chứng còn thiếu: Sửa hàng «kiem-nhanh-ten-mien ĐỎ, rồi lùi bản ĐỎ — không đọc được danh sách bản của Vercel» trong docs/van-hanh/xoay-khoa.md (mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập») cho khớp tools/deploy/len-ban.mjs, hàm rollBack/stop. Dòng «không đọc được danh sách» chỉ in sau một dòng lùi bản khác (DỪNG hoặc ĐỎ), nên chỗ tên miền đứng phải suy ra từ dòng đứng trước nó. Kèm một ca kiểm lấy từ mã, ví dụ tests/so-tay-lui-ban.test.ts, chạy lenBan với productionDeployments giả trả null và chứng minh thứ tự dòng in.
  - spec-alignment: PASS — Mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» khớp mã ở cả sáu điểm. `STEPS` trong len-ban.mjs xếp `bien` (ghi DATABASE_URL) trước `vai-dang-nhap` (đặt mật khẩu vào cơ sở dữ liệu) và trước `dung`. `deploymentLines` in `tạo <ISO UTC>`, `kiemNhanh` đòi `body.vai === "dat"`, `mk/deploy.mk` có `XOAY` cho `make dat-khoa`, và deploy.yml có job Deploy. Các dòng lùi bản trong bảng khớp chuỗi `rollBack` và `luiBan`, và không thấy câu nào kể sai điều mã làm.
  human_override:  # chi nguoi ghi

- eval: E3
  judged_by: judge panel (fresh context) — đề xuất panel: PASS
  verdict: UNCERTAIN
  rationale: Ba phiếu, một phiếu bất đồng. Chi tiết từng phiếu ở dưới.
  - domain-correctness: PASS — Cả sáu ý khớp với mã. Hàng «đã lùi về bản trước» nói bản trước vừa qua kiểm nhanh (đòi vai «dat») nên lúc kiểm nó nối được, đúng với rollBack, nơi chỉ in dòng ấy khi kiemNhanh đạt. Ba dòng DỪNG ghi tên miền vẫn ở bản mới, dựng sau «bien», không mất kết nối vì mật khẩu, và dặn đừng chọn bản trong danh sách. Hàng «đã về bản … nhưng kiểm nhanh đỏ» nói mất kết nối, còn ba hàng ĐỎ kia nói «Không chắc tên miền đang ở bản nào». Bốn bước ở hàng «DỪNG — tên miền không đổi» (cach-ly, dung, kiem-nhanh, gan-ten-mien) là hợp của các bước đứng sau vai-dang-nhap trong STEPS. Hai hàng đầu tách lượt xoay đầu với lượt chạy lại, và hàng «make rollback» có câu «bản nào cũng vậy».
  - operational-feasibility: FAIL — Các hàng theo ý (1) đến (5) đúng với mã, nhưng hai hàng nêu sai lý do đỏ mà mã in ra khi mật khẩu sai. Bảng gọi lý do là «vai nối chưa đạt», trong khi `kiemNhanh` trả «sức khoẻ ok khác true (vai: …)» trước khi tới nhánh kiểm `vai`, vì `healthOf` đặt `ok = (vai === "dat")`.
    - bằng chứng còn thiếu 1: Hàng `lùi bản ĐỎ — tên miền đã về bản <id> nhưng kiểm nhanh đỏ` trong xoay-khoa.md: bỏ «lý do thường là `vai nối chưa đạt`», hoặc ghi đúng chuỗi mã in là `sức khoẻ ok khác true (vai: …)`. Lấy ở docs/van-hanh/xoay-khoa.md, cột «Bản đang giữ tên miền» của hàng đó.
    - bằng chứng còn thiếu 2: Hàng `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: …` trong xoay-khoa.md: cột «Dòng» phải khớp chuỗi mà lui-ban.mjs thực sự in khi sức khoẻ có vai khác dat. Chuỗi đó là `kiem-nhanh-ten-mien ĐỎ — sức khoẻ ok khác true (vai: …)`. Hoặc ghi cột «Dòng» chỉ tới `kiem-nhanh-ten-mien ĐỎ — ` mà không kèm lý do. Lấy ở tools/deploy/kiem-nhanh.mjs dòng 88 và src/modules/identity/health.ts dòng 53.
  - spec-alignment: PASS — Sáu ý đều khớp mã. Dòng «đã lùi về bản trước» chỉ in sau khi tên miền về bản trước và kiemNhanh đạt (đòi vai «dat»), và hàng nói bản ấy «nối được» lúc kiểm. Ba dòng «lùi bản DỪNG» là các nhánh return trước `vercel rollback`, nên tên miền ở lại bản dựng sau `bien`, và hàng nói không mất kết nối vì mật khẩu. Hàng «nhưng kiểm nhanh đỏ» nói mất kết nối, ba hàng ĐỎ còn lại nói không chắc, và các bước kể sau `vai-dang-nhap` trùng STEPS. Hàng đầu tách lượt xoay với lượt chạy lại, hàng `vai-dang-nhap` trỏ về hàng đó, và hàng `make rollback` dặn «bản nào cũng vậy».
  human_override:  # chi nguoi ghi

- eval: E6
  judged_by: judge panel (fresh context) — đề xuất panel: FAIL (ba phiếu cùng một hướng)
  verdict: UNCERTAIN
  rationale: Cả ba phiếu cho rằng ý (3) và (4) đạt nhưng ý (2) chưa đạt; máy không tự chốt, người quyết ở Cổng 2.
  - domain-correctness: FAIL — Ý (3) và (4) đạt: chín dòng «Đạt khi» của bước 2 và bước 5 khớp thứ tự STEPS trong len-ban.mjs, mọi hàng `bien` và `vai-dang-nhap` đều dặn không bấm dựng lại trên Vercel, và không câu nào bảo in hay dán giá trị khoá. Ý (2) không đạt: hai bước của lui-ban.md khuyên lùi về bản cũ mà không có câu trỏ. Bước 1 «Đỏ thì» viết «lùi bản vẫn được nếu lỗi bắt đầu từ bản này». Bước 3 «Đạt khi» bảo «chọn bản đã chạy tốt gần nhất — thường là bản tên miền trỏ tới ngay trước lần đưa bản lên hỏng». Sau khi xoay mật khẩu, bản dựng trước lượt xoay không nối được nữa, nên hai câu này dẫn người vận hành sai. Ngoài ra, các hàng `vai-dang-nhap` của dua-ban-len.md nói «bản đang chạy không bị đụng» và chỉ được đoạn mở đầu «Đỏ thì làm gì» che gián tiếp.
    - bằng chứng còn thiếu 1: docs/van-hanh/lui-ban.md bước 1 «Đỏ thì» (dòng 38-39): câu «lùi bản vẫn được nếu lỗi bắt đầu từ bản này» có thêm vế trỏ «Vừa xoay mật khẩu vai đăng nhập: đọc mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của [xoay-khoa.md](xoay-khoa.md) trước». Hoặc một ca kiểm trong tests/so-tay-lui-ban.test.ts cho thấy đoạn này được cố ý coi là nằm dưới câu trỏ ở đoạn mở đầu và «Khi nào dùng», và chủ kho xác nhận cách đọc đó.
    - bằng chứng còn thiếu 2: docs/van-hanh/lui-ban.md bước 3 «Đạt khi» (dòng 55-58) và «Đỏ thì» (dòng 59-61): câu chọn bản «đã chạy tốt gần nhất» có vế trỏ tới mục của xoay-khoa.md (chỉ chọn bản tạo sau giờ lượt xoay). Hoặc một ca kiểm có ghim tên tệp và đầu đoạn bước 3 của lui-ban.md chứng minh đoạn ấy có câu trỏ.
    - bằng chứng còn thiếu 3: docs/van-hanh/dua-ban-len.md, hai hàng `vai-dang-nhap` (dòng 102-103): câu «bản đang chạy không bị đụng» có vế trỏ, hoặc có xác nhận bằng văn bản của chủ kho rằng đoạn mở đầu «Đỏ thì làm gì» (dòng 87-88) đủ che các hàng bảng.
  - operational-feasibility: FAIL — Các câu trỏ nhìn chung ngắn và đọc trôi. Mục (3) và (4) đạt: hai dòng «Đạt khi» khớp thứ tự STEPS, mọi hàng bien và vai-dang-nhap đều dặn không bấm dựng lại trên Vercel, và không câu nào bảo in hay dán giá trị khoá. Mục (2) vẫn hỏng: bước 1 của lui-ban.md nói «lùi bản vẫn được nếu lỗi bắt đầu từ bản này» khi sức khoẻ còn `"vai":"dat"`, và bước 3 bảo «chọn bản đã chạy tốt gần nhất», cả hai không có câu trỏ. Bước 6 của lui-ban.md nói «Bản thật đang chạy bản cũ hơn bản thử là bình thường», cũng không có câu trỏ. Hai hàng `vai-dang-nhap` trong dua-ban-len.md (dòng 102 và 103) ghi «bản đang chạy không bị đụng» mà không trỏ, dù ở lượt chạy lại sau một lượt đã xoay thì câu ấy sai.
    - bằng chứng còn thiếu 1: docs/van-hanh/lui-ban.md bước 1 «Đỏ thì» (dòng 38-39): thêm một vế trỏ tới mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» ngay cạnh «lùi bản vẫn được». Lý do: sức khoẻ `"vai":"dat"` mà lùi về bản dựng trước lượt xoay thì mất kết nối.
    - bằng chứng còn thiếu 2: docs/van-hanh/lui-ban.md bước 3 «Đạt khi» (dòng 55-58) và bước 6 «Đỏ thì» (dòng 88): thêm câu trỏ cạnh «bản đã chạy tốt gần nhất» và «bản cũ hơn», hoặc cho thấy ca kiểm AC-3 của tests/so-tay-lui-ban.test.ts coi các đoạn này là đã đủ trỏ.
    - bằng chứng còn thiếu 3: docs/van-hanh/dua-ban-len.md hai hàng `vai-dang-nhap` (dòng 102-103): sửa «Mật khẩu chưa đổi nên bản đang chạy không bị đụng» thành câu đúng cho cả lượt chạy lại sau một lượt đã xoay, hoặc thêm câu trỏ vào hàng.
  - spec-alignment: FAIL — Ý (3) và (4) đạt: «Đạt khi» của bước 2 và bước 5 khớp thứ tự STEPS trong len-ban.mjs ở cả hai môi trường. Các hàng bien và vai-dang-nhap vẫn dặn không bấm dựng lại, và không câu nào bảo in hay dán giá trị khoá. Ý (2) hỏng: lui-ban.md bước 1 «Đỏ thì» khuyên «lùi bản vẫn được nếu lỗi bắt đầu từ bản này» mà không trỏ tới mục. Bước 3 «Đỏ thì» của lui-ban.md bảo so giờ tạo trên Vercel để chọn bản đã chạy tốt, cũng không trỏ. Hai hàng `vai-dang-nhap` của dua-ban-len.md nói «Mật khẩu chưa đổi nên bản đang chạy không bị đụng» không kèm điều kiện. Câu ấy sai ở lượt chạy lại sau một lượt đã in `vai-dang-nhap đạt`, theo bảng của xoay-khoa.md.
    - bằng chứng còn thiếu 1: lui-ban.md bước 1 «Đỏ thì» (dòng 38-39): thêm câu trỏ «Vừa xoay mật khẩu vai đăng nhập: đọc mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của xoay-khoa.md trước khi lùi», hoặc chứng minh bằng ca kiểm tests/so-tay-lui-ban.test.ts rằng đoạn ấy đã được ghim và mang câu trỏ.
    - bằng chứng còn thiếu 2: lui-ban.md bước 3 (đoạn «Đạt khi» chọn bản đã chạy tốt gần nhất, và «Đỏ thì» bảo so giờ tạo trên Vercel, dòng 55-61) và các hàng bảng «Đỏ thì làm gì» bảo chọn bản đã chạy tốt (dòng DỪNG chưa nêu bản, DỪNG tên miền đã ở bản): thêm câu trỏ hoặc nêu lý do chúng đã được câu trỏ ở đoạn liền trước che.
    - bằng chứng còn thiếu 3: dua-ban-len.md bảng «Đỏ thì làm gì», hai hàng `vai-dang-nhap` (dòng 102-103): thêm vế «Lượt này vừa xoay mật khẩu vai đăng nhập hay một lượt trước đã xoay: đọc mục … của xoay-khoa.md», hoặc sửa câu «bản đang chạy không bị đụng» cho đúng với lượt chạy lại.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- make check (E7)

### Baseline khong do

- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E2: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E4: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E5: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E2, E4, E5, E7 và hai lệnh suite xanh; ba mục judgment (E1, E3, E6) chờ người, hội đồng có phiếu bất đồng về bảng lùi bản (lý do đỏ «vai nối chưa đạt» không khớp mã) và về các câu trỏ còn thiếu trong lui-ban.md và dua-ban-len.md. Chuyển Cổng 2.
