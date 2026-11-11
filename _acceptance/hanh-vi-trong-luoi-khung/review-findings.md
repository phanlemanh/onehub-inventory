# Review findings: hanh-vi-trong-luoi-khung (round 4)

## Trong hợp đồng

- **Every file, including .ts files, is parsed as TSX, so a type assertion like `<T>x` in a .ts screen file hides the imports after it**
  AC: AC-9
  file: `tests/behavior-guard.test.ts:140`
  severity: medium
  source: bugs
  detail: `importsOf` always calls `ts.createSourceFile(..., ts.ScriptKind.TSX)`, even for `.ts` files. `screenFiles` also scans `.ts` files under src/app and src/modules/*/ui; one exists today: src/app/(app)/nav.ts. In TSX mode, an angle-bracket type assertion (`<string>value`) or a generic arrow (`<T>(x: T) => x`) is read as a JSX opening tag. The parser then swallows the rest of the file, and any `import(...)` or `export ... from` after that point never reaches the AST walk. I reproduced this with the repo's TypeScript and the text `const v = <string>someValue;\nexport function load(){ return import("@/components/candidate/record-panel"); }`. Parsed as TSX, it finds 0 dynamic imports. Parsed as TS, it finds 1. So a forbidden import in a .ts screen file passes the guard with no warning. That breaks the promise in the new docblock and in E9 ('wherever they sit in the file'). Fix: choose the parse mode from the file extension (`fileName.endsWith('.tsx') ? TSX : TS`), or leave out scriptKind so createSourceFile infers it from fileName. Also add a .ts case to the matrix: an assertion first, then a forbidden import.
  rationale: AC-9 đòi bài kiểm của kho đỏ khi một tệp màn (kể cả tệp .ts dưới src/app) nhập thẳng thành phần cấm; finding cho thấy một tệp .ts như vậy lọt qua mà không báo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (không ghim thông điệp): ca phá cửa chung Base UI chỉ kiểm 'có ít nhất một dòng đỏ'**
  Người dùng thấy gì: Bài kiểm vẫn báo đỏ khi một màn tự dựng hộp thoại từ thư viện chung, nhưng chưa chứng minh được là nó nêu đúng tên tệp và thành phần phải dùng thay. Nếu sau này có người sửa nhầm, thông báo cho lập trình viên có thể kém rõ hoặc sai, người dùng cuối không thấy gì.
  Căn cứ: Hậu quả nhẹ vì chỉ ảnh hưởng độ rõ của cảnh báo cho người viết mã, không mất hay lộ dữ liệu; thêm chốt kiểm sau này rẻ và không cần gấp.
  file: `tests/behavior-guard.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét cả lớp, ma trận chưa đủ): 11 dạng câu lệnh được gọi là 'mọi dạng' nhưng thiếu `import x = require(...)`**
  Người dùng thấy gì: Rào chắn không đọc một cách viết nhập cũ hiếm gặp, nên một màn dùng đúng cách viết đó có thể tự dựng lại hành vi mà không bị bắt. Người dùng cuối không bị ảnh hưởng trực tiếp, chỉ là rào chắn có một kẽ hở nhỏ.
  Căn cứ: Hậu quả nhẹ vì cách viết này gần như không dùng trong kho và không làm mất hay lộ dữ liệu; nên ghi lại là giới hạn đã biết, sửa sau cũng không đắt.
  file: `tests/behavior-guard.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4, âm tính một mình: ngoại lệ chỉ cho layout nhập components/ui/sonner không có đối chứng dương, và luật này thực ra không tồn tại (r3 · tệp đã đổi)**
  Người dùng thấy gì: Một màn nhân viên có thể tự gắn thêm khung hiển thị thông báo của riêng mình mà bài kiểm của kho không báo đỏ, nên có nguy cơ thông báo hiện lệch nhau giữa các màn. Hiện chưa có màn thật nào làm vậy.
  Căn cứ: Hậu quả nhẹ và chỉ là lệch cách hiện thông báo, không mất dữ liệu, chưa màn thật nào dính; sửa sau rẻ khi hàng đầu tiên đặt khung lên màn.
  file: `tests/behavior-guard.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Test title still says 11 forbidden sources, but the test now asserts 13 (r2 · tệp đã đổi)**
  Người dùng thấy gì: Báo cáo kiểm thử ghi sai con số trong tên một bài kiểm, nhưng nhân viên sàn không thấy gì và chức năng không bị ảnh hưởng.
  Căn cứ: Chỉ sai chữ trong báo cáo nội bộ, không ảnh hưởng người dùng và không mất dữ liệu; sửa lúc nào cũng rẻ nhưng không đáng mở việc riêng.
  file: `tests/behavior-guard.test.ts`
  severity: low
  Đề xuất: wont-fix

- **New FieldError class in use-change clashes with the existing FieldError component in ui/field (r2)**
  Người dùng thấy gì: Người dùng cuối không thấy gì khác; chỉ là người làm màn sau này dễ nhầm hai thứ cùng tên khi nối báo lỗi ở trường.
  Căn cứ: Không ảnh hưởng người dùng cuối hay dữ liệu; chỉ gây nhầm cho người phát triển và đổi tên sau này còn rẻ vì chưa màn thật nào dùng.
  file: `src/components/candidate/use-change.tsx`
  severity: low
  Đề xuất: known-limits

- **A FieldError thrown while offline becomes the 'not saved, offline' banner and never reaches the field (r2)**
  Người dùng thấy gì: Khi đang mất mạng mà giá trị nhập bị kiểm tra là sai, người dùng thấy băng báo chưa lưu vì mất mạng thay vì câu báo ngay tại ô sai, và bấm thử lại sẽ lặp lại lỗi đó.
  Căn cứ: Dữ liệu đang nhập vẫn còn nguyên và người dùng tự thoát được khi có mạng lại hoặc sửa giá trị; chỉ là thông báo kém chính xác trong một tình huống hiếm.
  file: `src/components/candidate/use-change.tsx`
  severity: low
  Đề xuất: known-limits

- **Lưu sau khi xác nhận mà hỏng vì lỗi khác mất mạng thì lỗi bị nuốt, người dùng không thấy gì (r1)**
  Người dùng thấy gì: Khi xóa hay gửi ra ngoài sàn mà việc lưu hỏng vì lý do khác ngoài mất mạng, hộp xác nhận đóng lại và không báo gì, người dùng tưởng đã xong.
  Căn cứ: Việc im lặng khiến người dùng tin sai về dữ liệu của mình, nhưng hiện chỉ có bản mẫu chưa nối lưu thật, nên nên xử lý cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Hoàn tác đi vòng qua cửa lưu: hoàn tác hỏng khi mất mạng thì im lặng (r1)**
  Người dùng thấy gì: Nếu bấm Hoàn tác lúc mất mạng thì không có thông báo nào, người dùng tưởng đã hoàn tác trong khi dữ liệu vẫn ở trạng thái mới.
  Căn cứ: Người dùng có thể hiểu sai dữ liệu mà không biết, nhưng chỉ xảy ra khi mất mạng đúng lúc hoàn tác và chưa có đường lưu thật; nên làm cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Confirmed change swallows non-offline save errors: the failure looks the same as pressing Huỷ (r1)**
  Người dùng thấy gì: Một thay đổi không đảo được như xóa có thể hỏng mà không có thông báo nào, trông giống hệt khi bấm Thôi.
  Căn cứ: Người dùng không biết việc đã không xảy ra, nhưng hiện chỉ là bản mẫu chưa lưu thật, và tải lại trang là thấy dữ liệu đúng; nên làm khi nối lưu thật.
  file: `src/components/candidate/use-change.tsx`
  severity: high
  Đề xuất: new-contract

- **Undo runs outside the save door: a failed undo is an unhandled rejection with no feedback (r1)**
  Người dùng thấy gì: Khi hoàn tác thất bại, người dùng không thấy báo gì và tưởng thay đổi đã được hoàn tác.
  Căn cứ: Hậu quả là hiểu sai trạng thái dữ liệu nhưng hiếm gặp và chưa có lưu thật; nên xử lý cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Closing the record panel adds a history entry, so Back after closing reopens it, and Back while walking rows moves between rows instead of closing (r1)**
  Người dùng thấy gì: Sau khi đóng hồ sơ, bấm Quay lại của trình duyệt có thể mở lại hồ sơ, và đi qua nhiều dòng thì phải bấm Quay lại nhiều lần mới thoát.
  Căn cứ: Chỉ gây khó chịu nhỏ, không mất dữ liệu, người dùng tự thoát được bằng nút Đóng; sửa cần chạm vào cách điều hướng nên để sau.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: known-limits

- **Prototype 'partial-empty' state: «Thử lại» leads to the 'no rows were ever entered' empty state (r1)**
  Người dùng thấy gì: Trên bản mẫu thử, sau khi bấm Thử lại ở vùng tải một phần, vùng nói chưa có dòng nào dù dữ liệu có.
  Căn cứ: Chỉ ảnh hưởng bản mẫu cho người phát triển, không tới nhân viên sàn, và tải lại trang là hết; không đáng mở việc.
  file: `src/app/(app)/proto/[slug]/behavior-showcase.tsx`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: ca phá 'read-only-cell' dựng HTML bằng tay, còn assertLockedHasReason chưa từng chạy trên ô thật (r1)**
  Người dùng thấy gì: Bài kiểm ô khóa có thể vẫn xanh dù ô khóa thật mất lý do hiển thị, nên lỗi này có thể lọt qua mà không ai biết.
  Căn cứ: Ô khóa thật vẫn có bài kiểm riêng của hàng trước nên rủi ro thấp, và người dùng không bị ảnh hưởng trực tiếp; ghi lại để củng cố sau.
  file: `tests/behavior.test.tsx`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
