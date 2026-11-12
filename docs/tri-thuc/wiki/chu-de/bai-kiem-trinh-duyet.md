---
loai: chu-de
ma: [N12, F10]
nguon: [raw/2026-11-12-so-boi-canh-quy-hang-2/chi-muc.md]
cap_nhat: 2026-11-12
---
# Bài kiểm trình duyệt, đăng nhập trong bài kiểm và CI

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`. Đường mở đầu
`nhánh chore/nen-lo-trinh-lop-sheet-va-no:` chưa gộp vào `main`, số dòng có thể đổi.

## Vì sao có

- Bất biến phải có bộ kiểm bắt buộc, không giữ bằng lời hứa. `qh:docs/architecture/kien-truc-repo-va-stack.md:15`
- Bài kiểm xanh cả trên mã cũ lẫn mã mới thì không chứng được hành vi mới, trừ khi là bài giữ hồi quy có chủ ý. `qh:_acceptance/man-nhap-excel/evidence-report.md:203-210`

## Ai dùng và làm việc gì

- Bài kiểm trình duyệt chạy theo sổ màn, mọi cặp vai và màn, gồm đường bị từ chối. `docs/plan/pham-vi-mvp-dot-1.md:32`
- Màn cần đăng nhập: bản dev của Quỹ hàng in mã ra nhật ký máy chủ; kho này ghi mã ra một tệp chỉ có ở dev cho bài kiểm trình
  duyệt đọc. `qh:_acceptance/dang-nhap-theo-san/contract.md:72` · `.env.example:18-19`

## Thói quen phải giữ

- Đo trên máy thật khi có thể: bài thử chưa đo được vế mất mạng trên iPhone vì đường hầm mất khi iPhone vừa là máy
  thử vừa là điểm phát. `qh:docs/adr/0006-bai-thu-dong-bo.md:16-19`
- iPhone không báo sự kiện «có mạng» khi người rời Safari để đổi chế độ máy bay; không dựa riêng vào sự kiện trình duyệt.
  `qh:docs/adr/0006-bai-thu-dong-bo.md:42,59`

## Quỹ hàng đã chọn gì

- Bộ kiểm cách ly chạy trên Postgres tạm áp migration từ đầu; triển khai chờ nó xanh. `qh:docs/adr/0009-moi-truong-that.md:106-108`
- Luồng CI dựng lại môi trường như máy chủ GitHub để bắt lỗi: vỏ `bash` trơn, thư mục nhà rỗng, kit lấy theo tag chứ không
  theo nhánh. `qh:_acceptance/va-nut-ci-ag-root/contract.md:26-40`
- Công cụ quét bí mật cài đúng bản của CI, kiểm băm trước khi giải nén, bước cài không mang bí mật.
  `qh:_acceptance/va-nut-ci-gitleaks/contract.md:26-36`
- Bài kiểm của rào phát hành có bản sao bị phá cố ý, và bài phải đỏ đúng vế đã viết trước. `qh:_acceptance/va-nut-ci-ag-root/contract.md:35-40` ·
  `qh:_acceptance/va-nut-ci-gitleaks/contract.md:27-36`

## Lỗi đã gặp

- Lượt bấm đầu của nút CI đỏ vì làn tìm kit trong thư mục plugin của máy, mà máy chủ GitHub không cài kit.
  `qh:_acceptance/va-nut-ci-ag-root/contract.md:18-19`
- Lượt bấm lại đỏ vì luồng không cài công cụ quét bí mật như job kiểm chính. `qh:_acceptance/va-nut-ci-gitleaks/contract.md:18-19`
- Eval của hồ sơ cũ đo thứ tự triển khai đã bị thay; phải khai «không chạy» và trỏ tiêu chí đã ký đo lại nó.
  `qh:_acceptance/va-thuoc-ci-ho-so-moi-truong-that/contract.md:18-28`
- Bài kiểm đường công khai lúc đầu chỉ là lời gọi giả, không đo đường thật trả lỗi máy chủ. `qh:_acceptance/da-gui/gap-probe.md:15`
- Bài kiểm «bảng vai kéo theo» so với chính bảng đã bị co, nên mất vai vẫn xanh. `qh:_acceptance/chu-san-du-vai/review-findings.md:25-26`

## MVP này giữ gì, bỏ gì

- Giữ F10 (bộ bài kiểm trạng thái sinh từ sổ màn, kèm bài phá thử) và N12 (bài kiểm trình duyệt theo sổ màn, mọi cặp vai và
  màn). `docs/plan/pham-vi-mvp-dot-1.md:21,32`
- Hàng 1r: bộ kiểm chung đang bỏ qua màn cần đăng nhập; khi nối dữ liệu thật mọi màn đều cần đăng nhập nên sẽ bỏ qua gần hết.
  Hàng 1o trượt hai lần vì bài kiểm lỡ nhịp trên máy chậm. `nhánh chore/nen-lo-trinh-lop-sheet-va-no:docs/plan/lo-trinh.json:172-176`
- Bốn khổ kiểm 1440, 1024, 414, 360. `docs/design-standard-proposal.md:300`
- Bài kiểm trong trình duyệt của Zalo chạy tự động được không: chưa xác nhận.
