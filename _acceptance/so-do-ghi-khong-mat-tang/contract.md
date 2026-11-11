---
schema_version: 1
feature: "Lệnh ghi số đo của một vòng không bao giờ lặng lẽ bỏ tầng đã khai: bản số đo cũ đọc không được thì lệnh dừng và nói rõ, không ghi đè"
slug: so-do-ghi-khong-mat-tang
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: _acceptance/so-do-ghi-khong-mat-tang/design.md
---

# Acceptance Contract: so-do-ghi-khong-mat-tang

## Context

Lệnh `ghi` của bản số đo mỗi vòng (hàng 1h) nuốt lỗi khi bản số đo cũ hỏng, coi như chưa khai tầng nào, rồi ghi đè: tầng
người đã khai mất không lời. Vòng này làm lệnh dừng và nói rõ thay vì ghi đè. Hạng T3 vì lệnh nằm trong `tools/`. Không chạm
ba luật sản phẩm (SP-1, SP-3, SP-4): lệnh là công cụ đo nội bộ.

Source input: hàng `1l` của `docs/plan/lo-trinh.json`, ô `_acceptance/so-do-ghi-khong-mat-tang/opportunity.md` (chủ kho quyết
build ngày 11/11/2026), mục Ngoài-3 và Ngoài-14 của `_acceptance/so-do-moi-vong/review-findings.md`.

## Criteria

- AC-1: Given một hồ sơ có sổ chạy với lượt 1 `REJECT` và chỗ của `so-do-vong.json` là thứ không đọc được như tệp (một thư
  mục), When chạy `ghi --slug <slug>`, có hoặc không có `--phan r1=bo-cuc`, Then lệnh thoát 1, thông điệp gọi tên
  `so-do-vong.json` và «khong doc duoc», không in dấu vết lỗi Python, và chỗ ấy không đổi.
- AC-2: Given bản số đo cũ không phải JSON (chuỗi rác, tệp rỗng, byte không phải UTF-8), When chạy `ghi`, có hoặc không có
  `--phan`, Then lệnh thoát 1, thông điệp gọi tên tệp và «khong phai JSON», và tệp giữ nguyên từng byte.
- AC-3: Given bản số đo cũ là JSON sai hình dạng — gốc không phải đối tượng, gốc thiếu `luot`, `luot` không phải mảng, một
  mục không phải đối tượng, mục thiếu `vong`, `vong` không phải số nguyên, mục thiếu `tang`, `tang` không phải mảng chuỗi,
  `tang` có tên ngoài 11 tầng — When chạy `ghi`, có hoặc không có `--phan`, Then với cả chín dạng lệnh thoát 1, thông điệp gọi
  tên tệp và đúng chỗ sai của dạng ấy (không nêu chỗ của dạng khác), và tệp giữ nguyên từng byte.
- AC-4: Given lệnh vừa dừng vì bản cũ hỏng, ở bất kỳ nhóm hỏng nào, When đọc thông điệp, Then nó nói «khong ghi de» và hai đường gỡ: khôi phục bản cũ
  từ git, hoặc xoá tệp để dựng lại từ sổ chạy rồi khai lại bằng `--phan`; và khi xoá tệp rồi chạy lại `ghi`, lệnh thoát 0 và
  ghi bản mới, ở cả ba nhóm hỏng.
- AC-5: Given bản số đo cũ vắng, hợp lệ có tầng đã khai (do chính `ghi` sinh), hoặc hợp lệ với `luot` rỗng, When chạy `ghi`
  có hoặc không có `--phan r1=bo-cuc`, Then cả sáu ô thoát 0 như trước vòng này: không `--phan` thì r1 giữ tầng cũ (hoặc nằm
  trong `chua_phan` khi không có tầng cũ), có `--phan` thì r1 mang `bo-cuc`; và mọi bài kiểm có sẵn của lệnh vẫn xanh.

## Coverage

Quét trục tại chỗ, không gọi bộ quét (bài toán hai trục, nhỏ — sổ quyết định dòng 3, 5):

- Trục 1 — trạng thái bản cũ: vắng · hợp lệ có tầng · hợp lệ `luot` rỗng · không đọc được · không phải JSON (rác · rỗng · byte
  lạ) · sai hình dạng (9 dạng, gồm 3 dạng thiếu khoá).
- Trục 2 — có hay không `--phan`.
- Thước: mỗi ô của trục 1 × trục 2 có một khẳng định trong bài kiểm; ô «dừng» khẳng định thêm băm tệp không đổi.

AC-1, AC-2, AC-3 phủ ba nhóm hỏng; AC-4 phủ đường gỡ; AC-5 phủ ô lành (đối chứng dương trên cùng mẫu).

## Out of scope

- Lệnh `gop` bỏ qua bản số đo hỏng: giới hạn đã biết của hàng 1h (Ngoài-32), chủ kho đã chọn.
- Cờ ghi đè bản hỏng: máy khuyên không thêm; chủ kho quyết ở Cổng Phạm vi (Hỏi-1, sổ quyết định dòng 11).
- Tự sửa hay tự khôi phục bản hỏng: lệnh chỉ dừng và chỉ đường.
- Lệnh `kiem` đã báo «ban so do hong»: không đổi.

## Notes

- Ca quyền đọc bị cấm (chmod 000) chỉ được chứng khi bài chạy dưới tài khoản thường; dưới root bài ấy bỏ qua có tên.

- Bài kiểm mới chạy tiến trình Python nhiều lần trên thư mục tạm; mỗi bài có thời hạn riêng 60 giây như các bài dùng kho git
  tạm của lệnh này, để không đỏ giả khi máy bận.
