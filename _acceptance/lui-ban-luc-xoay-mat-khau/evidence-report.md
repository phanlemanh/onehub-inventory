---
schema_version: 2
feature_slug: lui-ban-luc-xoay-mat-khau
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0bd8f5835b8cde086c2b9ad6cef071ad7c656e64
human_signoff:
---

# Evidence Report: lui-ban-luc-xoay-mat-khau

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-2 | judgment | FAIL |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-5 | judgment | FAIL |
| E7 | AC-6 | script | PASS |

## Evidence

- eval: E2
  run_id: minted-lui-ban-luc-xoay-mat-khau-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T08:32:28Z
  output: |
    bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E2
    __EXIT=0

- eval: E4
  run_id: minted-lui-ban-luc-xoay-mat-khau-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T08:32:28Z
  output: |
    bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E4
    __EXIT=0

- eval: E5
  run_id: minted-lui-ban-luc-xoay-mat-khau-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh
  verified_at: 2026-11-22T08:32:28Z
  output: |
    bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E5
    __EXIT=0

- eval: E7
  run_id: minted-lui-ban-luc-xoay-mat-khau-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-22T08:32:28Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance
    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lui-ban-luc-xoay-mat-khau-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-22T08:32:28Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-lui-ban-luc-xoay-mat-khau-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-22T08:32:28Z

### Judgment (hội đồng đề xuất — human_override để trống)

- eval: E1
  panel: proposal PASS
  votes:
    - domain-correctness: PASS — Mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» khớp mã ở cả sáu điểm. STEPS cho `bien` chạy trước `vai-dang-nhap`, rồi mới tới `dung`. `setLoginRolePassword` thực hiện `alter role`. `deploymentLines` in «tạo» bằng `toISOString` (UTC). `kiemNhanh` đòi `ok===true` và `vai==="dat"`. Các dòng lùi bản trong bảng khớp chuỗi mã in ở `rollBack` và `luiBan`. `mk/deploy.mk` có `dat-khoa … XOAY`, và `deploy.yml` có workflow tên Deploy. Có hai chỗ nói hơi rộng. Dòng `lùi bản ĐỎ — không đọc được danh sách bản` cũng có thể in sau một dòng DỪNG, khi tên miền vẫn ở bản mới. Dòng «đã về bản … kiểm nhanh đỏ» được nói như thể bản trước luôn dựng trước lượt xoay. Cả hai đều không sai điều mã làm, nên không tính là lỗi sai sự thật.
    - operational-feasibility: PASS — Mục khớp mã ở cả sáu ý. `STEPS` chạy `bien` trước `vai-dang-nhap` rồi `dung`, nên mỗi bản chốt mật khẩu lúc dựng. `deploymentLines` in giờ tạo ISO UTC, `kiemNhanh` đòi `vai === "dat"`, `mk/deploy.mk` có `XOAY=1`, và workflow tên «Deploy» chạy `make deploy`. Không thấy câu nào nói sai điều mã làm.
    - spec-alignment: PASS — Mục khớp mã ở cả sáu câu hỏi. Thứ tự STEPS là bien, vai-dang-nhap, dung nên luật theo bản dựng đúng. make rollback không kèm BAN in `tạo <giờ UTC>`, kiemNhanh đòi ok và vai "dat". mk/deploy.mk có XOAY và deploy.yml có workflow Deploy. Hàng Instant Rollback nói về tính năng Vercel, nằm ngoài mã nên không kiểm được bằng input.
  human_override:  # chi nguoi ghi

- eval: E3
  panel: proposal FAIL
  votes:
    - domain-correctness: FAIL — Năm trong sáu ý khớp mã: dòng «đã lùi về bản trước» (chỉ in sau kiemNhanh đạt, đòi vai «dat»), ba dòng DỪNG, dòng «tên miền đã về bản … nhưng kiểm nhanh đỏ» (nói mất kết nối), các bước đỏ sau vai-dang-nhap, và dòng rollback «bản nào cũng vậy». Ý (3) sai ở một hàng. Hàng `kiem-nhanh-ten-mien ĐỎ, rồi lùi bản ĐỎ — không đọc được danh sách bản của Vercel` ghi «Không chắc tên miền đang ở bản nào», và coi dòng danh sách là dòng đứng ngay sau `kiem-nhanh-ten-mien ĐỎ`. Trong rollBack của len-ban.mjs, `stop(line)` luôn in `line` trước, rồi mới in dòng danh sách nếu `productionDeployments` trả null. Dòng ấy do đó có thể đi sau `lùi bản DỪNG …`, lúc tên miền chắc chắn ở bản mới và không mất kết nối. Khi đó hai hàng của bảng mâu thuẫn nhau.
      required_evidence: Hàng `lùi bản ĐỎ — không đọc được danh sách bản của Vercel` trong bảng của docs/van-hanh/xoay-khoa.md (khoảng dòng 151) được sửa; hàng đó phải nói dòng này là dòng nối thêm sau một dòng `lùi bản DỪNG` hay `lùi bản ĐỎ`, và tách hai ca (sau DỪNG: tên miền vẫn ở bản mới, không mất kết nối; sau ĐỎ: không chắc tên miền ở đâu). Hoặc một ca kiểm của repo (tests/so-tay-lui-ban.test.ts) cho lenBan chạy với `vercel list` lỗi sau một dòng DỪNG, rồi cho thấy bảng không gán «không chắc» cho ca ấy.
    - operational-feasibility: FAIL — Ý (1), (2), (4), (5) và (6) khớp mã. Ý (3) sai ở một clause của hàng «không chắc». Hàng đó gộp `lùi bản ĐỎ — không đọc được danh sách bản của Vercel` vào «Không chắc tên miền đang ở bản nào», đứng ngay sau `kiem-nhanh-ten-mien ĐỎ`. Trong `rollBack` của len-ban.mjs, dòng này không bao giờ đứng một mình: `stop(line)` luôn in `line` trước, rồi mới in dòng danh sách khi `productionDeployments` trả null. Nó có thể đi sau ba dòng `lùi bản DỪNG` (tên miền chắc chắn ở bản mới) hay sau `tên miền đã về bản … nhưng kiểm nhanh đỏ` (chắc chắn ở bản trước), nên hàng này mâu thuẫn với hàng DỪNG và hàng «đã về bản».
      required_evidence: Hàng `lùi bản ĐỎ — không đọc được danh sách bản của Vercel` trong bảng «Dòng của lệnh lúc vừa xoay» (xoay-khoa.md, hàng 151) phải bỏ mô tả «không chắc tên miền ở đâu» đối với dòng này, nói rằng dòng này luôn in sau một dòng `lùi bản …` khác và trạng thái tên miền theo dòng đứng trước (DỪNG: ở bản mới; «đã về bản … nhưng kiểm nhanh đỏ»: ở bản trước; `vercel rollback lỗi` hay `chưa về bản`: không chắc), hoặc tách thành hàng riêng, rút từ rollBack ở tools/deploy/len-ban.mjs dòng 392-435. Chỉ cần một trong hai: một ca kiểm trong tests/so-tay-lui-ban.test.ts chứng minh dòng danh sách luôn theo sau dòng đầu của `stop` và bảng phản ánh đúng thứ tự đó, hoặc mã đổi để `stop` in dòng danh sách thành dòng đứng riêng không kèm khẳng định về vị trí tên miền.
    - spec-alignment: FAIL — Ý (1), (2), (4), (5), (6) khớp mã. Riêng ý (3) có lỗi ở hàng «`lùi bản ĐỎ — không đọc được danh sách bản của Vercel`». Trong `rollBack`, `stop()` luôn in dòng lý do của nó trước, rồi mới in dòng danh sách này nếu `productionDeployments` trả null. Nên dòng này chỉ đứng sau một dòng lùi bản khác, không bao giờ đứng ngay sau `kiem-nhanh-ten-mien ĐỎ`. Khi nó đứng sau một dòng `lùi bản DỪNG` thì tên miền chắc chắn ở bản mới; khi đứng sau «đã về bản … nhưng kiểm nhanh đỏ» thì chắc chắn ở bản trước. Bảng vẫn ghi «Không chắc tên miền đang ở bản nào» cho cả ba dòng của hàng ấy, và ghi thứ tự «rồi» sai với mã.
      required_evidence: Sửa hàng «`lùi bản ĐỎ — không đọc được danh sách bản của Vercel`» trong /Users/manhphan/dev/onehub-inventory-cham-dk/.claude/worktrees/interesting-jemison-9e40ea/docs/van-hanh/xoay-khoa.md: nói đây là dòng phụ in sau dòng lùi bản đứng trước nó, và bản đang giữ tên miền do dòng đứng trước quyết định; chỉ khi đứng sau «vercel rollback lỗi» hay «tên miền chưa về bản» mới là không chắc (căn cứ: hàm `stop` của `rollBack` trong tools/deploy/len-ban.mjs, dòng 393-403). Hoặc một chỗ trong xoay-khoa.md hay contract.md nói rõ hàng này cố ý gộp dòng phụ vào nhóm «không chắc» và người vận hành đọc dòng đứng trước trước; có chỗ đó thì ý (3) đổi thành PASS.
  human_override:  # chi nguoi ghi

- eval: E6
  panel: proposal FAIL
  votes:
    - domain-correctness: FAIL — Ý (3) và (4) đạt: hai dòng «Đạt khi» của bước 2 và bước 5 khớp đúng thứ tự STEPS trong len-ban.mjs, mọi hàng bien và vai-dang-nhap đều dặn không bấm dựng lại trên Vercel, và không câu nào bảo in hay gửi giá trị khoá. Ý (1) và (2) còn hai chỗ vụng. Ở hai hàng vai-dang-nhap của bảng «Đỏ thì làm gì» trong dua-ban-len.md, câu trỏ bị kẹp giữa câu rồi còn một vế mồ côi: «…trừ khi một lượt trước đã xoay: đọc mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của [xoay-khoa.md](xoay-khoa.md); bước `bien` đã ghi mật khẩu mới vào biến của Vercel.» Ở lui-ban.md, mục «Khi nào dùng» có gạch đầu dòng «Không dùng khi lệnh đưa bản lên đã tự báo `đã lùi về bản trước`: việc ấy đã xong; chỉ cần kiểm như bước 5.» Gạch ấy ngụ ý mọi thứ đã yên mà tự nó không có câu trỏ.
      required_evidence: Ở dua-ban-len.md, hai hàng `vai-dang-nhap` của bảng «Đỏ thì làm gì»: tách câu trỏ thành một vế riêng, đặt cuối câu, không kẹp vế `bước bien đã ghi mật khẩu mới…` sau dấu chấm phẩy. Ở lui-ban.md, gạch đầu dòng thứ ba của «Khi nào dùng» (`Không dùng khi … đã lùi về bản trước`): thêm một vế trỏ tới mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của xoay-khoa.md, hoặc một ý kiến của chủ kho rằng gạch này được miễn vì gạch kế tiếp đã có câu trỏ.
    - operational-feasibility: UNCERTAIN — Mục (3) đạt: các dòng «Đạt khi» của bước 2 và bước 5 khớp đúng thứ tự STEPS trong len-ban.mjs, và mọi hàng `bien` và `vai-dang-nhap` đều dặn không bấm dựng lại trên Vercel. Mục (1), (2) và (4) còn hai chỗ mơ hồ nên chưa phán được. Chỗ thứ nhất là các câu trỏ trong lui-ban.md: bullet «Khi nào dùng» tóm lại nội dung mục thay vì chỉ nói khi nào đọc, và nhiều hàng «Đỏ thì làm gì» của lui-ban.md khuyên «gấp thì dùng dòng cuối» mà không trỏ. Chỗ thứ hai là câu «dán» khoá vào `make dat-khoa` ở README và xoay-khoa: hợp đồng chưa nói chúng có thuộc vế «không câu nào bảo dán giá trị khoá» hay không.
      required_evidence: Bullet «Khi nào dùng» của lui-ban.md (dòng 14-15) nói «nó nói bản nào còn lùi về được, và khi nào không lùi mà chạy lại make deploy»; cần phán quyết của chủ kho hoặc dòng định nghĩa «vế ngắn» trong design_doc docs/superpowers/specs/2026-11-22-lui-ban-luc-xoay-mat-khau-design.md cho biết câu này có chấp nhận được không (nếu spec cấm tóm lại nội dung thì đổi sang FAIL). Các hàng «Đỏ thì làm gì» của lui-ban.md (dòng 101, 105, 106, 107) nói «gấp thì dùng dòng cuối» hoặc «chạy lại bước 4» mà không có câu trỏ, và bước 3 «Đỏ thì» (dòng 60-62) hướng dẫn chọn bản theo giờ tạo cũng không trỏ; cần tests/so-tay-lui-ban.test.ts hoặc spec nói rõ hàng nào được miễn câu trỏ (nếu không được miễn thì đổi sang FAIL). Cần một dòng trong design_doc hoặc phán quyết của chủ kho cho biết vế «không câu nào bảo in, dán hay gửi giá trị khoá» của AC-5 có loại trừ việc dán vào lời nhắc ẩn của `make dat-khoa` (README việc 8, xoay-khoa bước 2) và việc ghi giá trị vào tệp biến ngoài kho (lui-ban «Cần có trước») hay không (nếu loại trừ thì mục (4) đạt, nếu không thì mục (4) FAIL).
    - spec-alignment: FAIL — Câu (1), (3) và (4) đạt. Các vế trỏ ngắn, thứ tự bước ở bước 2 và bước 5 khớp STEPS, mọi hàng bien và vai-dang-nhap có dặn «đừng bấm dựng lại», và không có câu nào bảo in giá trị khoá. Câu (2) hỏng: đoạn mở đầu dua-ban-len.md (dòng 3-4) nói «trước khi gắn tên miền, một bước đỏ không đổi gì ở bản đang phục vụ người dùng» mà không trỏ tới mục. Câu đó sai ngay sau xoay, vì `cach-ly`, `dung` hay `kiem-nhanh` đỏ sau `vai-dang-nhap đạt` thì bản đang chạy đã mất kết nối. Ngoài ra bốn hàng bảng của lui-ban.md (dòng 101, 105, 106, 107) khuyên «gấp thì dùng dòng cuối», tức Instant Rollback, mà không trỏ.
      required_evidence: Sửa đoạn mở đầu của /Users/manhphan/dev/onehub-inventory-cham-dk/.claude/worktrees/interesting-jemison-9e40ea/docs/van-hanh/dua-ban-len.md (dòng 3-4) để câu «một bước đỏ không đổi gì ở bản đang phục vụ người dùng» mang vế trỏ tới mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập», hoặc bỏ ngụ ý yên. Ở docs/van-hanh/lui-ban.md, các hàng «Đỏ thì làm gì» có «gấp thì dùng dòng cuối» (dòng 101, 105, 106, 107) phải mang vế trỏ tới mục ấy, hoặc đổi thành chỉ nhắc hàng «Lệnh không chạy được ở máy nào».
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do:
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E2: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E4: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh E5: bo qua baseline: tep _acceptance/lui-ban-luc-xoay-mat-khau/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 6ce94d9ff8e064a0c13c2dc49ca4198c195b0116 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lượt sửa 1 đã thêm các ca kiểm (lý do kiểm nhanh, phủ 23 chỗ, sổ lùi bản theo bước).
Round 2: E3 và E6 bị hội đồng chấm FAIL — hàng «lùi bản ĐỎ — không đọc được danh sách bản của Vercel» ở xoay-khoa.md gán «không chắc» cho cả ca dòng này đi sau một dòng DỪNG; đoạn mở đầu dua-ban-len.md và các hàng «gấp thì dùng dòng cuối» của lui-ban.md thiếu câu trỏ. Các eval máy E2, E4, E5, E7 xanh. Returned to implementation.
