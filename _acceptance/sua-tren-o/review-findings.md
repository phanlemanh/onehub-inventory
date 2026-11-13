## Trong hợp đồng

- **Evidence: make check is red (proof gate)** — `_acceptance/sua-tren-o/chung-minh-man.md`, severity: high, source: invariants. AC: AC-10.
  Detail: `make check` fails with 7 failing tests (tests/proof-matrix-self.test.ts, tools/proof_gate/proof-gate.test.ts, proof-gate-0023.test.ts). The cause is `tools/proof_gate/check.py`, which reports 3 errors for sua-tren-o/inventory: (1) the '### Ứng viên ReUI' table in chung-minh-man.md has no ReUI candidate group with a screenshot for 'data-grid-editing-6'; (2, 3) the blocks 'data-grid-editing-6' and 'data-grid-editing-2' are brought into the repo, but design/so-khoi.yaml has no `ho_so: sua-tren-o` line for them. Commit 8d22faa marks the contract 'implemented' while CI is red. AGENTS.md requires make check to be green before a task is called done. Fix: add the candidate group and screenshot for editing-6 to chung-minh-man.md, and add both ledger lines to design/so-khoi.yaml.

- **The default close date is the UTC date, so it shows yesterday early in the morning in Vietnam** — `src/modules/listings/ui/listing-cell-edit.tsx:276`, severity: low, source: bugs. AC: AC-5.
  Detail: `useState(() => new Date().toISOString().slice(0, 10))` takes the date in UTC. From 00:00 to 06:59 local time (UTC+7), the move-to-Closed dialog fills in yesterday's date. The comment says it should be today. A user who accepts the prefilled value saves the wrong closeDate. Build the date from local parts, or use the company's time zone.

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): câu báo hoàn tác hỏng chỉ dội lại chuỗi mà chính bài kiểm tự cấp** — `src/components/candidate/use-change.test.tsx:93`, severity: high, source: measurement. AC: AC-7.
  Detail: Hàm `change()` ở dòng 40 tự cấp `undoFailed: () => "Chưa hoàn tác được vì mất kết nối mạng. căn 1101 vẫn là 2,8 tỷ."`. Sau đó dòng 93 kiểm `expect(message).toContain("căn 1101 vẫn là 2,8 tỷ")`. Phép kiểm này chỉ đọc lại chuỗi bài kiểm vừa viết. Nơi thật sinh câu báo là `COPY.undoFailed(labels, unit, shown(edit.field, edit.value), why)` trong src/modules/listings/ui/use-listing-cell-edit.tsx:145. Không bài nào chạy qua chỗ đó với một lần hoàn tác hỏng: listing-cell-edit.test.tsx chỉ thử hoàn tác thành công. Vì vậy lời hứa của E7 («thông báo nêu căn và giá trị đang mang») chưa được đo. Quan hệ giữa căn và giá trị trong câu báo với giá trị ô đang hiện cũng không được đo. Nếu câu thật nêu sai căn hoặc sai giá thì bài vẫn xanh.

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): «khuôn 403 của đường ghi thật» là một vật có `status` do bài kiểm tự ném** — `src/modules/listings/save-door.test.ts:187`, severity: medium, source: measurement. AC: AC-7.
  Detail: Ca `khuon-loi-that` ném `new Response(null, { status: 403 })` và `new Response(null, { status: 409 })`. Dòng 77 và 137 của src/components/candidate/use-change.test.tsx ném `{ status: 403 }`. Cả hai được dựng đúng khuôn mà hàm đọc `writeFailure` mong (một vật có `.status`). Tiêu đề bài và E7 trong evals.yaml đều gọi đây là «đúng khuôn lỗi của đường ghi thật». Nhưng `fetch` không ném khi gặp 403 mà trả về một Response. Trong kho cũng chưa có chỗ ghi nào ném vật có `status`. Các chỗ gọi `fetch` hiện có đều ném `new Error(String(res.status))`, và `writeFailure` đọc khuôn đó thành `null`. Khuôn lỗi không được rút ra từ chính chỗ ghi, nên bài xanh mà không chứng minh được đường ghi thật sẽ ra «refused» hay «conflict».

- **Hình dạng 3 (kiểm «chuỗi có mặt» trong khi lời hứa là quan hệ): «cổng lưu ghi đúng một lần với {listPrice: 2800000000}» lại được đo bằng số thông báo «Đã đổi»** — `tests/e2e/sua-tren-o.spec.ts:98`, severity: medium, source: measurement. AC: AC-2.
  Detail: Lời hứa của E2 là cổng lưu nhận đúng một lần ghi với `{listPrice: 2800000000}`. Chiều đỏ được nêu là «cổng lưu gọi hai lần → sua-gia-mot-lan-ghi: 2 lần ghi». Nhưng dòng 98 chỉ kiểm `toasts(page).filter({ hasText: "Đã đổi" })` có đúng 1 thông báo. `runDoorChange` chỉ hiện một thông báo cho mỗi lần sửa, kể cả khi `write` gọi cổng lưu hai lần hoặc gửi sai giá trị. Vì vậy cả số lần ghi lẫn giá trị ghi đều không được đo, và lỗi «gọi hai lần» của chiều đỏ không làm bài đỏ. Dòng 109 (E3) và dòng 152 (E5-e2e) cũng vậy: lời hứa «cổng lưu 0 lần» chỉ được đo bằng việc không có thông báo nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Authorization: status cell gated by updateListing, bypassing activateListing**
  Người dùng thấy gì: Đầu khách hoặc đầu chủ không giữ căn có thể đổi trạng thái căn sang Đang bán, điều mà bảng quyền chi tiết hơn không cho phép. Các nút khác trên màn vẫn theo quyền như cũ.
  Căn cứ: Ảnh hưởng đến quyền thật nên đáng xử lý, nhưng hợp đồng đã chọn rõ quyền này và dữ liệu hiện chỉ ghi vào cổng mẫu, nên nên mở việc riêng cùng hàng ghi thật.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: high
  Đề xuất: new-contract

- **Domain: new business rules in code but not in ontology/**
  Người dùng thấy gì: Các luật mới như bảng chuyển trạng thái, khoá giá khi đã bán và hỏi lại khi giá lệch quá 20% chạy đúng trên màn, nhưng chưa có trong bản mô tả nghiệp vụ nên người đọc tài liệu sẽ không thấy chúng.
  Căn cứ: Không ảnh hưởng người dùng cuối hay dữ liệu, chỉ là thiếu tài liệu và sửa lúc nào cũng được, nên ghi lại là hạn chế đã biết.
  file: `src/modules/listings/edit-rules.ts`
  severity: medium
  Đề xuất: known-limits

- **Product language: concept words hard-coded in src/**
  Người dùng thấy gì: Một số câu báo viết sẵn chữ «căn» và «chủ nhà», nên với căn cho thuê câu có thể gọi bên cho thuê là «chủ nhà» thay vì đúng từ của sàn.
  Căn cứ: Chỉ là lệch từ ngữ nhẹ trong vài câu thông báo, không mất dữ liệu và sửa dễ sau.
  file: `src/modules/listings/ui/cell-edit-copy.ts`
  severity: low
  Đề xuất: known-limits

- **Authorization: ?vai= stands in for the session role in a product route**
  Người dùng thấy gì: Trên bản chạy thử không phải bản chính thức, ai cũng chọn được vai bằng đường dẫn và mở khung sửa, nhưng chỉ tác động lên dữ liệu mẫu trong bộ nhớ.
  Căn cứ: Hậu quả nhẹ vì chỉ chạm dữ liệu mẫu và bản chính thức đã tắt; sẽ tự hết khi có đăng nhập thật ở hàng ghi thật.
  file: `src/app/(app)/inventory/page.tsx`
  severity: low
  Đề xuất: known-limits

- **Tier: high-tier change (ontology)**
  Người dùng thấy gì: Thay đổi chạm bảng nhãn nên cần chủ kho duyệt khi mở PR; việc này là thủ tục, không làm màn hỏng.
  Căn cứ: Chỉ là thủ tục duyệt đã được hợp đồng nêu và chủ kho đã duyệt nhãn, không có hậu quả cho người dùng.
  file: `ontology/labels.yaml`
  severity: low
  Đề xuất: wont-fix

- **Undo (and a failed save) puts back price, status and confirmed date together, not just the field that was edited**
  Người dùng thấy gì: Nếu đổi giá rồi đổi trạng thái, sau đó bấm Hoàn tác ở thông báo giá, màn có thể hiện lại trạng thái cũ trong khi căn đã ở trạng thái mới, và lần đổi trạng thái kế tiếp có thể báo nhầm là không đủ quyền.
  Căn cứ: Màn lệch với dữ liệu thật, gây nhầm cho người dùng, nhưng cần đúng chuỗi thao tác hiếm và tải lại trang là hết, nên nên sửa trong việc riêng.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: new-contract

- **«Hoàn tác» on a price edit always fails when the listing had no price**
  Người dùng thấy gì: Khi nhập giá cho căn chưa có giá, thông báo vẫn mời Hoàn tác nhưng bấm vào sẽ luôn báo lỗi như bị từ chối quyền.
  Căn cứ: Chỉ gặp với căn chưa có giá và giá mới vẫn lưu đúng; người dùng tự sửa lại được nên chấp nhận ghi vào hạn chế đã biết.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
