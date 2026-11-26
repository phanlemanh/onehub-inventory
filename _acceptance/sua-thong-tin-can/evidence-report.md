---
schema_version: 2
feature_slug: sua-thong-tin-can
verdict: REJECT
failed_evals: [E2b]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b0f3a9d8c0d0fcd17addd253ab40a1ce3745438e
human_signoff:
---

# Evidence Report: sua-thong-tin-can

Round 3. Một eval trượt: E2b (ca tải lại trang trên cơ sở dữ liệu thật). Mọi eval và lệnh suite khác đều xanh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | test | FAIL |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6-ui | AC-6 | ui-check | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | test | PASS |
| E13 | AC-11 | test | PASS |
| E13b | AC-11 | test | PASS |
| E13-ui | AC-11 | ui-check | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-thong-tin-can-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E1b
  run_id: minted-sua-thong-tin-can-E1b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E3
  run_id: minted-sua-thong-tin-can-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E4
  run_id: minted-sua-thong-tin-can-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E4b
  run_id: minted-sua-thong-tin-can-E4b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E5
  run_id: minted-sua-thong-tin-can-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E6
  run_id: minted-sua-thong-tin-can-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E6b
  run_id: minted-sua-thong-tin-can-E6b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E7
  run_id: minted-sua-thong-tin-can-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E7b
  run_id: minted-sua-thong-tin-can-E7b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E8
  run_id: minted-sua-thong-tin-can-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E12
  run_id: minted-sua-thong-tin-can-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E9b
  run_id: minted-sua-thong-tin-can-E9b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E13
  run_id: minted-sua-thong-tin-can-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  output: |
    vitest (nhóm sửa thông tin căn, 10 tệp) chạy xanh, không ca nào đỏ.

- eval: E2
  run_id: minted-sua-thong-tin-can-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-26T10:50:41Z
  output: |
    playwright tests/e2e/sua-thong-tin-can.spec.ts xanh.
    gac-hydration: 0 canh bao

- eval: E9
  run_id: minted-sua-thong-tin-can-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-26T10:50:41Z
  output: |
    playwright tests/e2e/sua-thong-tin-can.spec.ts xanh.
    gac-hydration: 0 canh bao

- eval: E13b
  run_id: minted-sua-thong-tin-can-E13b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-26T10:50:41Z
  output: |
    playwright tests/e2e/sua-thong-tin-can.spec.ts xanh.
    gac-hydration: 0 canh bao

- eval: E2b
  run_id: minted-sua-thong-tin-can-E2b-r3
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e_db
  verified_at: 2026-11-26T10:50:41Z
  output: |
    4 ca đỏ, 2 bỏ qua, 6 xanh (2,2 phút). Đỏ ở hai khổ 360 và 414, mỗi khổ hai ca:
    'tai-lai-con' (tests/e2e-db/sua-thong-tin-can.spec.ts:121) và 'quan-tri-khong-nut' (dòng 146).
    Lỗi ở hàm đăng nhập signIn (dòng 105): sau khi nhập mã, trang về "/" nhưng không hiện
    [data-state="choose-company"] cũng không hiện menu tài khoản [data-slot="account-menu"][data-ready]
    trong 20 giây. Ca 'tai-lai-con' là ca mà E2b đòi, nên eval trượt.

- eval: E10
  run_id: minted-sua-thong-tin-can-E10-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-26T10:50:41Z
  output: |
    design-floor-khuon --kiem: không có dòng «lệch:». 21 tệp giao diện ngoài bản đồ.

- eval: E11
  run_id: minted-sua-thong-tin-can-E11-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-26T10:50:41Z
  output: |
    design-floor-s4: không mã màu thô trên tệp giao diện mà vòng chạm.

- eval: E2-ui
  run_id: minted-sua-thong-tin-can-E2-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-26T10:50:41Z
  screenshot: evidence/E2-ho-so-1440.png
  observed: |
    E2-ho-so-1440.png: lưới Hàng với bảng bên của căn "1101 · S1.01", giá 2,71 tỷ, trạng thái Đang bán, "Mức đủ thông tin 4/5" với thanh tiến độ và "Còn thiếu: Tài chính".
    E2-hop-1440.png: hộp giữa màn "Sửa thông tin căn 1101" có bốn trường Pháp lý "Hợp đồng mua bán", Nội thất "Một phần nội thất", Tài chính trống, Hiện trạng "Chủ đang ở"; nút Thôi và Lưu; nền mờ.
    E2-da-luu-1440.png: hộp đã đóng, mục "LẦN CHÀO ĐANG MỞ" hiện Sổ hồng, Một phần nội thất, Đang thế chấp ngân hàng, Chủ đang ở, còn «Sửa»; thông báo "Đã đổi thông tin căn 1101." kèm «Hoàn tác». Số đếm nằm ngoài khung, 5/5 lấy từ chữ của bảng sau khi lưu.
    E2-ho-so-360.png, E2-hop-360.png, E2-da-luu-360.png: cùng luồng ở khổ 360. Hộp vừa chiều ngang, Lưu và Thôi xếp dọc, không bị cắt; sau khi lưu hiện "Mức đủ thông tin 5/5", thanh đầy, "Đủ thông tin" thay "Còn thiếu". Giá trị đổi nằm dưới phần nhìn thấy, đã đối chiếu bằng chữ của bảng.
    Khớp expected: đúng chỗ, đủ bốn trường, giá trị và số đếm đổi ở cả hai khổ.
  network_observed: clean

- eval: E6-ui
  run_id: minted-sua-thong-tin-can-E6-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-26T10:50:41Z
  screenshot: evidence/E6-text-1440.png
  observed: |
    Cả năm khung đều là bảng Hàng 1440px trên công ty thật "[MAU] rieng-1440-...", một ô đang mở có viền xanh dương cùng kiểu.
    E6-text-1440.png: ô Ghi chú dòng 1 là ô nhập chữ, hiện "Chủ cần bán nhanh".
    E6-number-1440.png: ô Chỗ xe dòng 1 là ô nhập trống, căn phải, cùng khung viền xanh.
    E6-date-1440.png: ô Bàn giao dòng 1 là ô ngày với gợi ý "dd/mm/yyyy".
    E6-single_select-1440.png: ô Hướng view dòng 1 mở danh sách chọn gồm Hồ, Phố, Chưa có, cùng viền xanh.
    E6-boolean-1440.png: ô Ban công dòng 1 mở danh sách chọn gồm Có, Không, Chưa có.
    Mỗi kiểu có bộ sửa đúng kiểu, cùng khung viền. Khớp "Năm bộ sửa đúng kiểu, cùng khung".
  network_observed: n-a (driver)

- eval: E13-ui
  run_id: minted-sua-thong-tin-can-E13-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-26T10:50:41Z
  screenshot: evidence/E13-luoi-1440.png
  observed: |
    E13-luoi-1440: lưới Hàng với Căn, Toà, # ghim; cột Dự án, Trạng thái, Giá chào, Về tay, Diện tích, Phòng ngủ hiện, Nội thất bị cắt ở mép phải; 60 dòng.
    E13-luoi-1024: cùng lưới, hẹp hơn, chỉ còn cột ghim cộng Dự án, Trạng thái và một phần Giá chào.
    E13-bon-cot-1440: cuộn phải, #, Căn, Toà đứng yên; Nội thất, Pháp lý, Tài chính, Hiện trạng, Xác nhận lúc hiện đủ cùng nhau với giá trị như 'Đầy đủ nội thất', 'Sổ hồng', 'Không vay', 'Để trống'.
    E13-cot-noi-that-1024, E13-cot-phap-ly-1024, E13-cot-tai-chinh-1024, E13-cot-hien-trang-1024: từng cột hiện đủ ở khổ 1024, cột ghim không dời.
    E13-o-noi-that-1440: ô Nội thất của căn 1101 mở bộ chọn bốn lựa chọn (Đầy đủ nội thất được tô, Một phần nội thất, Không nội thất, Chưa có), khung viền bo tròn đúng bề rộng ô; chân bảng ghi "1 ô đã chọn · Ctrl+C để chép".
    Khớp expected: bốn cột đúng chỗ ở hai khổ, khoá đúng, bộ chọn cùng khung.
  network_observed: clean

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-sua-thong-tin-can-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-26T10:50:41Z

- cmd: npm run build
  run_id: minted-sua-thong-tin-can-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-26T10:50:41Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-sua-thong-tin-can-SUITE-DATABASE_URL_make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-26T10:50:41Z

Lệnh trượt không gắn eval nào: không có. Lệnh duy nhất trượt là lệnh của E2b, đã ghi ở trên.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên code mới lẫn baseline, chứng minh khung chạy chứ không chứng minh tính năng): E10, E11. Cả hai là lưới chặn hồi quy về khuôn thiết kế và mã màu thô; giữ có chủ ý, không viết lại.

Baseline không đo:
- npx vitest run src/modules/listings src/lib/write-failure.test.ts src/components/candidate/use-change.test.tsx tests/sua-thong-tin-can.test.tsx tests/sua-thong-tin-may-chu.test.ts tests/sua-thong-tin-route.test.ts tests/mot-luat-ghi.test.ts tests/bang-hang-khong-du-quyen.test.tsx tests/bang-hang-khong-du-quyen-doi-chung.test.tsx tests/hop-long-nen-mo.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/lib/write-failure.test.ts co o cay dang kiem nhung chua co o merge-base 7e08ffd144b74635ac0dc7bb1225cb4ccef51295 — eval moi, chay tren code cu khong phan biet gi
- npx playwright test tests/e2e/sua-thong-tin-can.spec.ts: bo qua baseline: tep tests/e2e/sua-thong-tin-can.spec.ts co o cay dang kiem nhung chua co o merge-base 7e08ffd144b74635ac0dc7bb1225cb4ccef51295 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-h} DB_PORT=${DB_PORT:-5567} npx playwright test -c playwright.db.config.ts tests/e2e-db/sua-thong-tin-can.spec.ts: bo qua baseline: tep tests/e2e-db/sua-thong-tin-can.spec.ts co o cay dang kiem nhung chua co o merge-base 7e08ffd144b74635ac0dc7bb1225cb4ccef51295 — eval moi, chay tren code cu khong phan biet gi

Về E2b: lỗi nằm ở bước đăng nhập của bộ thử (signIn, dòng 105), chưa tới bước sửa bốn trường hay tải lại. Hai ca đỏ cùng một lỗi ở hai khổ 360 và 414, còn các ca khác của cùng tệp xanh. Chưa xác định được nguyên nhân gốc (đăng nhập thật không tới màn chọn công ty, hay môi trường cơ sở dữ liệu của làn h), nên chưa kết luận được là lỗi tính năng hay lỗi bộ thử. Cần chạy lại sau khi làm rõ.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: E2b failed — đăng nhập trong bộ thử e2e-db không tới được màn chọn công ty hay menu tài khoản ở khổ 360 và 414, nên ca tải lại trang chưa chạy tới bước kiểm. Lịch sử round 1 và 2 không được truyền vào lượt này; xem các round cũ trong hồ sơ trước. Returned to implementation.
