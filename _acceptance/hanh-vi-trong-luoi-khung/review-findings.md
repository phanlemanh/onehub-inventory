## Trong hợp đồng

- **Mẫu nhận diện import mới bỏ sót import chỉ để chạy khi theo sau là một import khác (lùi so với bản trước)**
  AC: AC-9
  file: `tests/behavior-guard.test.ts:129`
  severity: medium
  source: conventions
  detail: Phần `(?:import|export)\s+(?:type\s+)?([\s\S]*?)\s+from\s*` được thử trước, và `[\s\S]*?` lười có thể vượt qua dấu chấm phẩy và xuống dòng. Vì vậy với `import "@/components/candidate/region-state";\nimport { DataRegion } from "@/components/candidate/data-region";` mẫu khớp một lần duy nhất: phần mệnh đề là `"@/components/candidate/region-state";\nimport { DataRegion }`, còn đường nhập là data-region. Nguồn bị cấm region-state không bao giờ được so (đã chạy thử bằng node). Mẫu cũ `(?:from\s+|import\s*\(\s*|import\s+)["']` bắt được trường hợp này, nên đây là một bước lùi so với bản trước. Ca phá thử chỉ viết import chỉ để chạy đứng một mình trong tệp nên không lộ ra, trong khi E9 khẳng định 'nhập chỉ để chạy ... đều đỏ'. Lỗi tương tự với `export default function ...` mà phía sau còn `from "..."`: mệnh đề nuốt cả thân hàm, nên có thể vừa sót vừa bắt nhầm khi kiểm tên Dialog/AlertDialog trên cửa chung @base-ui/react. Cần chặn mệnh đề không vượt qua `;` hoặc dấu nháy (ví dụ `[^;"']*?`), và thêm ca phá có import chỉ để chạy đứng trước một import hợp lệ.
  rationale: AC-9 đòi bài kiểm đỏ khi tệp màn nhập thẳng thành phần dùng chung; import chỉ để chạy đứng trước import khác lọt qua nên AC-9 thất bại.

- **The new import pattern skips side-effect and dynamic imports when a later import uses `from`, so the guard misses forbidden imports**
  AC: AC-9
  file: `tests/behavior-guard.test.ts:127`
  severity: high
  source: bugs
  detail: This round the IMPORT pattern gained a lazy branch, `(?:import|export)\s+(?:type\s+)?([\s\S]*?)\s+from\s*`. The regex tries that branch first. Its lazy `[\s\S]*?` keeps stretching across lines until it reaches the next `from "..."` anywhere later in the file. It then takes that later path as the spec, and everything in between is swallowed. I ran the pattern in node. `import "@/components/ui/sheet";\nimport { A } from "./a";` returns only ['./a'], so the side-effect import of sheet is never seen. `import { A } from "./a"; export default function P(){ return import("@/components/ui/dialog"); }\nexport { B } from "./b";` returns ['./a', './b'], so the dynamic import of dialog is never seen. The old pattern had no clause group and caught both. The break cases for side-effect and dynamic imports still pass because each one writes a file with a single statement. The real scan of src/app and src/modules/*/ui is therefore weaker than evals E9 claims ('nhập chỉ để chạy, nhập động ... đều đỏ'). Suggested fix: stop the clause from crossing statements, for example `[^;"']*?` or `[\w\s{},*$]*?`. Then add a break case with several statements in one file.
  rationale: Cùng gốc: bộ kiểm không đỏ khi màn nhập thẳng khung/hộp thoại bằng import chỉ để chạy hoặc import động, trái AC-9.

- **Namespace import of the Base UI barrel (`import * as X from "@base-ui/react"`) gets past the guard**
  AC: AC-9
  file: `tests/behavior-guard.test.ts:142`
  severity: medium
  source: bugs
  detail: For the `@base-ui/react` barrel, the guard decides by searching the import clause for the words `Dialog` or `AlertDialog`. With `import * as Base from "@base-ui/react"` the clause is `* as Base`, so nothing matches and `targets` is empty. I checked this in node: the clause comes out as '* as Base'. A screen can then use `<Base.Dialog.Root>` or `<Base.AlertDialog...>` and the guard never fires. That contradicts this round's evals E9 entry, which says importing Dialog from Base UI's shared entry point turns the guard red. A namespace or default import of the barrel should be treated as forbidden, or at least the file should be scanned for `.Dialog`/`.AlertDialog` member access.
  rationale: AC-9 nêu rõ nhập thẳng hộp thoại phải làm bài kiểm đỏ; nhập kiểu namespace từ cửa chung của Base UI vẫn là nhập hộp thoại mà không bị bắt.

- **Hình dạng 5, quét LỚP nhưng chỉ có điểm-case: các ca nhập chỉ để chạy và nhập động đều đứng một mình, nên lỗ hổng của biểu thức nhận dạng không bị bắt**
  AC: AC-9
  file: `tests/behavior-guard.test.ts:128`
  severity: high
  source: measurement
  detail: Ở E9, eval tuyên rằng tái xuất, nhập chỉ để chạy và nhập động đều làm bộ kiểm đỏ. Nhưng mỗi cách viết chỉ có một ca, và mỗi ca ghi tệp chỉ có đúng một câu lệnh (vòng `for (const code of [...])`, `write(code)`, rồi `toHaveLength(1)`). Biểu thức IMPORT thử nhánh `(?:import|export)\s+(?:type\s+)?([\s\S]*?)\s+from\s*` trước. Vì `[\s\S]*?` được phép vượt qua dòng, nhánh này nuốt mọi câu nhập đứng trước một `from "..."` ở phía sau. Đã chạy thử bằng node: với `import "@/components/candidate/region-state";\nimport { A } from "react";` chỉ ra một khớp, đường nhập là 'react', còn region-state bị nuốt vào phần mệnh đề. Tương tự, `export const m = 1; ... await import("@/components/ui/sheet"); import { B } from "react"` chỉ ra 'react'. Tệp màn thật luôn có nhiều câu nhập, nên một màn nhập chỉ để chạy hoặc nhập động một nguồn bị cấm mà có câu nhập thường đứng sau sẽ không bị bắt. Ca quét thật 'finds no screen file that rebuilds a behaviour' khi đó xanh giả. Ma trận chỉ viết trước 62 ca theo cách viết đường nhập, không viết trước theo dạng câu lệnh trong một tệp nhiều dòng.
  rationale: AC-9 đòi bài kiểm của kho đỏ khi một tệp màn nhập thẳng thành phần bị cấm; finding chỉ ra tệp nhiều câu nhập mà nhập chỉ để chạy hoặc nhập động nguồn cấm đứng trước một câu nhập thường thì bộ kiểm không đỏ, tức AC-9 không đạt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4, âm tính một mình: ngoại lệ chỉ cho layout nhập components/ui/sonner không có đối chứng dương, và luật này thực ra không tồn tại**
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

- **New FieldError class in use-change clashes with the existing FieldError component in ui/field (r2 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng cuối không thấy gì khác; chỉ là người làm màn sau này dễ nhầm hai thứ cùng tên khi nối báo lỗi ở trường.
  Căn cứ: Không ảnh hưởng người dùng cuối hay dữ liệu; chỉ gây nhầm cho người phát triển và đổi tên sau này còn rẻ vì chưa màn thật nào dùng.
  file: `src/components/candidate/use-change.tsx`
  severity: low
  Đề xuất: known-limits

- **A FieldError thrown while offline becomes the 'not saved, offline' banner and never reaches the field (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi đang mất mạng mà giá trị nhập bị kiểm tra là sai, người dùng thấy băng báo chưa lưu vì mất mạng thay vì câu báo ngay tại ô sai, và bấm thử lại sẽ lặp lại lỗi đó.
  Căn cứ: Dữ liệu đang nhập vẫn còn nguyên và người dùng tự thoát được khi có mạng lại hoặc sửa giá trị; chỉ là thông báo kém chính xác trong một tình huống hiếm.
  file: `src/components/candidate/use-change.tsx`
  severity: low
  Đề xuất: known-limits

- **Lưu sau khi xác nhận mà hỏng vì lỗi khác mất mạng thì lỗi bị nuốt, người dùng không thấy gì (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi xóa hay gửi ra ngoài sàn mà việc lưu hỏng vì lý do khác ngoài mất mạng, hộp xác nhận đóng lại và không báo gì, người dùng tưởng đã xong.
  Căn cứ: Việc im lặng khiến người dùng tin sai về dữ liệu của mình, nhưng hiện chỉ có bản mẫu chưa nối lưu thật, nên nên xử lý cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Hoàn tác đi vòng qua cửa lưu: hoàn tác hỏng khi mất mạng thì im lặng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bấm Hoàn tác lúc mất mạng thì không có thông báo nào, người dùng tưởng đã hoàn tác trong khi dữ liệu vẫn ở trạng thái mới.
  Căn cứ: Người dùng có thể hiểu sai dữ liệu mà không biết, nhưng chỉ xảy ra khi mất mạng đúng lúc hoàn tác và chưa có đường lưu thật; nên làm cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Confirmed change swallows non-offline save errors: the failure looks the same as pressing Huỷ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một thay đổi không đảo được như xóa có thể hỏng mà không có thông báo nào, trông giống hệt khi bấm Thôi.
  Căn cứ: Người dùng không biết việc đã không xảy ra, nhưng hiện chỉ là bản mẫu chưa lưu thật, và tải lại trang là thấy dữ liệu đúng; nên làm khi nối lưu thật.
  file: `src/components/candidate/use-change.tsx`
  severity: high
  Đề xuất: new-contract

- **Undo runs outside the save door: a failed undo is an unhandled rejection with no feedback (r1 · tệp đã đổi)**
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

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: ca phá 'read-only-cell' dựng HTML bằng tay, còn assertLockedHasReason chưa từng chạy trên ô thật (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm ô khóa có thể vẫn xanh dù ô khóa thật mất lý do hiển thị, nên lỗi này có thể lọt qua mà không ai biết.
  Căn cứ: Ô khóa thật vẫn có bài kiểm riêng của hàng trước nên rủi ro thấp, và người dùng không bị ảnh hưởng trực tiếp; ghi lại để củng cố sau.
  file: `tests/behavior.test.tsx`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
