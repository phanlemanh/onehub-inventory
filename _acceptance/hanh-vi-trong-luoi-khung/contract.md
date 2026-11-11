---
schema_version: 1
feature: Hồ sơ cạnh bảng, lọc rỗng, chờ tải, lỗi, lưu và hoàn tác chỉ có một cách dựng, màn chỉ khai mình cần gì
slug: hanh-vi-trong-luoi-khung
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: []
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-11T04:50:10Z
design_doc: _acceptance/hanh-vi-trong-luoi-khung/design.md
---

# Acceptance Contract: hanh-vi-trong-luoi-khung

## Context

Ở Quỹ hàng, trạng thái và hành vi là chỗ Bảng hàng lệch Liên hệ (quyết định 0019). Hàng này dồn hồ sơ cạnh bảng, lọc rỗng, chờ tải, lỗi, lưu và hoàn tác vào Lưới và khung, để một màn chỉ khai mình cần gì. Hàng cũng sửa năm mục người dùng thấy mà chủ kho đặt làm điều kiện khi ký hàng 1b. Dựng trên 1b (Lưới) và 1a (khung, kênh thông báo, băng trên màn).

Source input: hàng 1e của `docs/plan/lo-trinh.json` (mã F9 của `docs/plan/pham-vi-mvp-dot-1.md`), ô cơ hội `_acceptance/hanh-vi-trong-luoi-khung/opportunity.md` do chủ kho quyết «build» ngày 10/11/2026.

## Criteria

- AC-1: Given một Lưới mà màn đã khai việc mở hồ sơ, When nhân viên bấm hay nhấn Enter trên nút mở ở ô đầu của một dòng, Then hồ sơ của dòng ấy mở cạnh bảng, tiêu điểm vào hồ sơ và địa chỉ trang có `ho-so=<id>`; mở thẳng địa chỉ ấy thì hồ sơ mở sẵn; Esc hay nút «Đóng» đóng hồ sơ, bỏ `ho-so` khỏi địa chỉ và trả tiêu điểm về nút mở của dòng đã mở; ở khổ dưới 640px hồ sơ phủ toàn màn.
- AC-2: Given hồ sơ đang mở, When bấm «Sau» hay «Trước», Then hồ sơ chuyển sang dòng kề theo đúng thứ tự Lưới đang hiện (kể cả khi đang tìm lọc), địa chỉ đổi theo, khung hồ sơ giữ nguyên vị trí và bề rộng; ở dòng cuối «Sau» tắt, ở dòng đầu «Trước» tắt; cùng một khung nhận được cả hồ sơ căn lẫn hồ sơ người mà màn không dựng khung riêng.
- AC-3: Given màn khai một vùng sửa được, When Lưới dựng, Then mỗi ô mang cách sửa theo kiểu: `money`, `count`, `text`, `select`, `boolean`, `date` sửa trên ô, mọi kiểu khác sửa trong hồ sơ cạnh bảng; vùng không khai sửa được thì không ô nào mang cách sửa; màn không chọn được cách sửa cho từng cột.
- AC-4: Given vùng đang tải, When thời gian chờ trôi, Then dưới 1 giây không chỉ báo, từ 1 giây có dòng khung chờ đúng số cột, từ 10 giây thêm câu tiến độ và nút «Huỷ» khi màn đưa việc huỷ (bấm thì gọi đúng việc ấy, màn không đưa thì không có nút); suốt lúc tải đầu vùng chỉ có tên vùng, không số dòng, không ô tìm.
- AC-5: Given vùng tải lỗi hay tải được một phần, When vùng hiện, Then: lỗi thì câu ba phần, đầu vùng chỉ có tên vùng (không số dòng, không ô tìm); «Thử lại» chỉ hiện khi màn đã nối việc tải lại và bấm thì gọi đúng việc ấy, màn chưa nối thì không có nút và câu lỗi bảo tải lại trang; tải được một phần mà chưa có dòng nào thì vùng nói dữ liệu có nhưng chưa tải được, không nói chưa ai nhập.
- AC-6: Given nút làm việc của vùng (như «Thêm dòng») được màn khai kèm quyền, When người xem không đủ quyền làm việc ấy hoặc không đủ quyền xem vùng, Then nút không hiện; người đủ quyền thì thấy nút; vùng không đủ quyền xem vẫn không hiện dòng hay số dòng nào.
- AC-7: Given một ô chữ, When bề rộng ô đổi (cửa sổ hẹp lại hay rộng ra) mà chữ không đổi, Then ô đo lại: chữ trở nên bị cắt thì có dấu ba chấm, nhận tiêu điểm bàn phím và đọc đủ được; chữ trở nên vừa thì thôi nhận tiêu điểm.
- AC-8: Given màn khai một thay đổi qua cửa lưu chung (động từ, đảo được hay không, có ra ngoài sàn không, việc làm, việc hoàn tác), When nhân viên làm thay đổi, Then: đảo được và trong sàn thì làm ngay và báo bằng toast có «Hoàn tác», bấm thì gọi việc hoàn tác; không đảo được hoặc ra ngoài sàn thì trước hết mở hộp xác nhận nói rõ việc sẽ xảy ra, nút xác nhận mang đúng động từ, «Thôi» không làm gì; lưu hỏng vì mất mạng thì băng trên màn nói chưa lưu được, phần đang nhập còn nguyên; lỗi của một trường báo tại trường, không bằng toast.
- AC-9: Given một tệp màn (dưới `src/app/` hay `src/modules/*/ui/`), When tệp ấy tự dựng lại các hành vi này bằng cách nhập thẳng khung hồ sơ, hộp thoại, khung chờ, khối trạng thái, vòng xoay hay toast, Then bài kiểm của kho đỏ, nêu tên tệp và thành phần dùng chung phải dùng thay; và sáu quyết định tầng hành vi (`edit-in-cell`, `undo-or-confirm`, `feedback-by-delay`, `state-matrix`, `notification-channel`, `read-only-cell`) đều có ít nhất một bài kiểm tự nêu tên quyết định và đỏ được khi phá đúng chỗ nó đo.
- AC-10: Given bản mẫu hành vi ở bốn khổ 360, 414, 1024, 1440, When mở ở giao diện sáng và tối với hồ sơ đóng, hồ sơ mở, hộp xác nhận mở, vùng lỗi và vùng chờ tải, Then trang không cuộn ngang và không có vi phạm axe mức nghiêm trọng.

## Coverage

Thước đối chiếu: mã F9 của `docs/plan/pham-vi-mvp-dot-1.md`; các dòng «Phản hồi theo độ trễ», «Lưu», «Sửa dữ liệu», «Mở hồ sơ cạnh bảng», «Kênh thông báo», «Ô không sửa được» của `design/behaviors.md`; các dòng «Chờ tải», «Tìm không ra», «Lỗi», «Một phần hỏng», «Chữ dài», «Không đủ quyền», «Mất mạng khi lưu» của `design/states.md`; năm mục chủ kho đòi khi ký 1b (Ngoài-4/13/17, Ngoài-8, Ngoài-16, Ngoài-12 của hồ sơ 1b, và ghi chú đo lại chữ cắt).

- Trục hành vi F9: hồ sơ cạnh bảng (AC-1, AC-2) | lọc rỗng (giữ của 1b, đầu vùng ở AC-5) | chờ tải (AC-4) | lỗi (AC-5) | lưu và hoàn tác (AC-8) | màn chỉ khai mình cần gì (AC-3, AC-6, AC-9).
- Trục sáu quyết định: `edit-in-cell` (AC-3) | `undo-or-confirm` (AC-8) | `feedback-by-delay` (AC-4) | `state-matrix` (AC-4, AC-5, AC-6) | `notification-channel` (AC-8) | `read-only-cell` (giữ bài kiểm của 1b; AC-9 đòi quyết định có bài kiểm).
- Trục mục điều kiện của chủ kho: (a) đầu vùng khi lỗi → AC-4, AC-5 | (b) một phần hỏng không dòng → AC-5 | (c) «Thử lại» không nối → AC-5 | (d) nút khi không đủ quyền → AC-6 | (e) đo lại chữ cắt → AC-7.
- Trục loại hồ sơ: căn | người (AC-2).
- Trục cửa lưu: đảo được × trong sàn | đảo được × ra ngoài sàn | không đảo được (AC-8).
- Trục khổ và giao diện: 360 | 414 | 1024 | 1440 × sáng | tối (AC-10).
- Ô «Xung đột khi lưu» của `design/states.md` không có AC: cần đường lưu thật lên máy chủ; xem Out of scope.

## Đường đo

- Thước: sáu quyết định tầng hành vi có bài kiểm đỏ được · số từ: thẻ `decision:<id>` trong các tệp kiểm và cột `check` của `design/decisions.yaml` (đọc bằng `tools/design_check.py`), ca phá thử ghim thông điệp trong `tests/behavior.test.tsx` · bảo đảm bởi: AC-9
- Thước: một màn tự dựng lại hành vi thì kiểm tra đỏ · số từ: `tests/behavior-guard.test.ts` với ca tệp màn giả · bảo đảm bởi: AC-9
- Thước: hồ sơ cạnh bảng nhận cả căn lẫn người, đi qua lại không đổi khung · số từ: `tests/behavior.test.tsx` và `tests/e2e/behavior.spec.ts` · bảo đảm bởi: AC-1, AC-2

## Vai × Màn

Vòng này dựng thành phần dùng chung (hồ sơ cạnh bảng, cửa lưu, trạng thái vùng) và chỉ chạm bản mẫu dành cho người phát triển, chưa chạm màn nào của nhân viên sàn; bảng Vai × Màn thuộc hàng đầu tiên đặt các thành phần này lên một màn (hàng 2, Bảng hàng).

## Out of scope

- Không nội dung thật của hồ sơ căn (B2, hàng 3) hay hồ sơ người: bản mẫu dùng nội dung giả để chứng minh một khung nhận cả hai.
- Không bộ sửa trên ô thật (B4): hàng này khoá luật chọn sửa trên ô hay trong hồ sơ và lối vào hồ sơ.
- Không câu xác nhận cụ thể cho từng hành động nguy hiểm (B6): hàng này dựng hộp xác nhận chung với động từ do màn đưa.
- Không trạng thái «Xung đột khi lưu»: cần đường lưu thật lên máy chủ (N5); đi cùng hàng nối dữ liệu.
- Không chốt chia trang hay cuộn ảo, không lọc theo cột (đã để cho hàng 2 ở hồ sơ 1b).
- Không luật ESLint mới: rào «màn tự dựng lại» là bài kiểm của kho, vì luật ESLint và cấu hình nằm ngoài vùng của hàng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Câu chữ mới ở `src/components/candidate/grid-copy.ts` (vùng, hồ sơ) và `src/components/templates/frame-copy.ts` (xác nhận).
- Giám sát đã cho phép thêm dòng `check` vào sáu quyết định tầng hành vi và một mục mới `record-panel` trong `design/decisions.yaml` (yêu cầu K-4): chỉ thêm dòng, mục mới nêu trong mô tả PR.
- Hồ sơ cạnh bảng do Lưới giữ: màn khai cách dựng nội dung một dòng, Lưới đưa thứ tự dòng đang hiện (sau tìm lọc) cho khung.
- Ngoài-1 (máy định tuyến 2026-11-11, đề xuất S4 known-limits): Bài kiểm vẫn báo đỏ khi một màn tự dựng hộp thoại từ thư viện chung, nhưng chưa chứng minh được là nó nêu đúng tên tệp và thành phần phải dùng thay. Nếu sau này có người sửa nhầm, thông báo cho lập trình viên có thể kém rõ hoặc sai, người dùng cuối không thấy gì. — `tests/behavior-guard.test.ts`
- Ngoài-2 (máy định tuyến 2026-11-11, đề xuất S4 known-limits): Rào chắn không đọc một cách viết nhập cũ hiếm gặp, nên một màn dùng đúng cách viết đó có thể tự dựng lại hành vi mà không bị bắt. Người dùng cuối không bị ảnh hưởng trực tiếp, chỉ là rào chắn có một kẽ hở nhỏ. — `tests/behavior-guard.test.ts`
- Ngoài-3 (máy định tuyến 2026-11-11, đề xuất S4 known-limits): Một màn nhân viên có thể tự gắn thêm khung hiển thị thông báo của riêng mình mà bài kiểm của kho không báo đỏ, nên có nguy cơ thông báo hiện lệch nhau giữa các màn. Hiện chưa có màn thật nào làm vậy. — `tests/behavior-guard.test.ts`
- Ngoài-5 (máy định tuyến 2026-11-11, đề xuất S4 known-limits): Người dùng cuối không thấy gì khác; chỉ là người làm màn sau này dễ nhầm hai thứ cùng tên khi nối báo lỗi ở trường. — `src/components/candidate/use-change.tsx`
- Ngoài-6 (máy định tuyến 2026-11-11, đề xuất S4 known-limits): Khi đang mất mạng mà giá trị nhập bị kiểm tra là sai, người dùng thấy băng báo chưa lưu vì mất mạng thay vì câu báo ngay tại ô sai, và bấm thử lại sẽ lặp lại lỗi đó. — `src/components/candidate/use-change.tsx`
- Ngoài-11 (máy định tuyến 2026-11-11, đề xuất S4 known-limits): Sau khi đóng hồ sơ, bấm Quay lại của trình duyệt có thể mở lại hồ sơ, và đi qua nhiều dòng thì phải bấm Quay lại nhiều lần mới thoát. — `src/components/candidate/record-panel.tsx`
- Ngoài-13 (máy định tuyến 2026-11-11, đề xuất S4 known-limits): Bài kiểm ô khóa có thể vẫn xanh dù ô khóa thật mất lý do hiển thị, nên lỗi này có thể lọt qua mà không ai biết. — `tests/behavior.test.tsx`

- Known limits — chọn ở Cổng Bằng chứng 2026-11-11:
  - Ngoài-1: Bài kiểm vẫn báo đỏ khi một màn tự dựng hộp thoại từ thư viện chung, nhưng chưa chứng minh được là nó nêu đúng tên tệp và thành phần phải dùng thay. Nếu sau này có người sửa nhầm, thông báo cho lập trình viên có thể kém rõ hoặc sai, người dùng cuối không thấy gì.
  - Ngoài-2: Rào chắn không đọc một cách viết nhập cũ hiếm gặp, nên một màn dùng đúng cách viết đó có thể tự dựng lại hành vi mà không bị bắt. Người dùng cuối không bị ảnh hưởng trực tiếp, chỉ là rào chắn có một kẽ hở nhỏ.
  - Ngoài-3: Một màn nhân viên có thể tự gắn thêm khung hiển thị thông báo của riêng mình mà bài kiểm của kho không báo đỏ, nên có nguy cơ thông báo hiện lệch nhau giữa các màn. Hiện chưa có màn thật nào làm vậy.
  - Ngoài-5: Người dùng cuối không thấy gì khác; chỉ là người làm màn sau này dễ nhầm hai thứ cùng tên khi nối báo lỗi ở trường.
  - Ngoài-6: Khi đang mất mạng mà giá trị nhập bị kiểm tra là sai, người dùng thấy băng báo chưa lưu vì mất mạng thay vì câu báo ngay tại ô sai, và bấm thử lại sẽ lặp lại lỗi đó.
  - Ngoài-11: Sau khi đóng hồ sơ, bấm Quay lại của trình duyệt có thể mở lại hồ sơ, và đi qua nhiều dòng thì phải bấm Quay lại nhiều lần mới thoát.
  - Ngoài-13: Bài kiểm ô khóa có thể vẫn xanh dù ô khóa thật mất lý do hiển thị, nên lỗi này có thể lọt qua mà không ai biết.
