# Review findings: upgrade-design-assembly-0-7-0 (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design / Records: the skill and the proof-gate template tell people to add a line to a derived, gitignored file**
  Người dùng thấy gì: Hướng dẫn cho tác tử vẫn chỉ vào một tệp sao chép tự sinh, nên dòng khai báo khối mới thêm theo hướng dẫn sẽ bị ghi đè và không bao giờ vào kho. Người làm theo sẽ tưởng đã khai báo xong mà thực tế khối không được nhận.
  Căn cứ: Hậu quả vừa phải: công sức bị mất lặng lẽ nhưng chỉ xảy ra khi có người làm theo hướng dẫn cũ, phát hiện được khi khối không xuất hiện, và sửa lời hướng dẫn là việc rẻ nhưng nên đi kèm sửa kiểm tra liên quan nên tách thành việc riêng.
  file: `.claude/skills/inventory-ui/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **CI and tooling: wiki front-matter links point at derived files, so `make ontology` and `make coverage-matrix` fail on a clean checkout**
  Người dùng thấy gì: Trên bản tải mới, chạy riêng lệnh kiểm tra ontology hoặc ma trận phủ sẽ báo đỏ với thông báo chỉ sai nguyên nhân. Chạy lệnh kiểm tra tổng thì vẫn xanh, nên người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ gây nhầm lẫn cho người phát triển khi chạy lẻ từng lệnh, không mất hay lộ dữ liệu, chạy lại lệnh tổng là qua, nên ghi nhận là hạn chế đã biết.
  file: `wiki/decisions/0030-so-man-khai-cua-vao-va-nut.md`
  severity: medium
  Đề xuất: known-limits

- **Records: a duplicate front-matter link in decision 0030**
  Người dùng thấy gì: Một trang ghi chép quyết định liệt kê trùng một liên kết. Người dùng không thấy khác biệt nào.
  Căn cứ: Hoàn toàn vô hại với người dùng, không mất dữ liệu, chi phí sửa nhỏ nhưng lợi ích gần như bằng không nên chấp nhận và ghi vết.
  file: `wiki/decisions/0030-so-man-khai-cua-vao-va-nut.md`
  severity: low
  Đề xuất: wont-fix

- **Criteria and tests: the drift guard for the role x screen x button table no longer guards anything, and its descriptions were not updated**
  Người dùng thấy gì: Bảng vai trò, màn hình và nút bấm không còn được so sánh để phát hiện lệch, nên đổi quyền làm thay đổi nút hiển thị có thể không bị bắt sớm. Lời chú thích trong bài kiểm vẫn hứa điều đã không còn đúng.
  Căn cứ: Rủi ro thật là lệch quyền không bị bắt tự động, nhưng đây là hệ quả của quyết định đã được chủ kho duyệt và các bài kiểm quyền khác vẫn còn, nên ghi lại thành hạn chế đã biết.
  file: `tests/e2e-db/vai-man.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Proof gate passes green with no component registry: row 1q and the registry lookups turn off without a word**
  Người dùng thấy gì: Khi chạy cổng chứng minh riêng trên bản tải mới, một linh kiện thêm lén không có dòng khai báo vẫn được báo là đạt. Cổng im lặng bỏ qua một phép kiểm mà không cảnh báo.
  Căn cứ: Nặng vì cổng cho kết quả xanh sai và người dùng tin là đã kiểm, nhưng chỉ xảy ra khi chạy riêng cổng, đường chạy chuẩn qua lệnh tổng vẫn bắt được, và sửa cần thiết kế riêng nên tách thành việc mới.
  file: `tools/proof_gate/model.py`
  severity: high
  Đề xuất: new-contract

- **Python readers take the stale out-of-git copy over the folder, which is the real ledger; JS readers take the folder**
  Người dùng thấy gì: Nếu bản sao tự sinh đã cũ, cổng chứng minh và ma trận phủ có thể đánh giá theo dữ liệu cũ và vẫn báo xanh. Người sửa sổ màn hay sổ khối có thể thấy kiểm tra đạt dù thay đổi chưa được xét.
  Căn cứ: Có thể cho kết quả sai lặng lẽ nhưng chỉ khi chạy riêng sau khi sửa sổ mà chưa vẽ lại, đường chạy chuẩn vẽ lại trước nên bắt được, vẫn cần một việc sửa riêng để đồng bộ thứ tự đọc.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: new-contract

- **`make design` and `make coverage-matrix` read derived files but never write them first; `make check` passes only because of target order**
  Người dùng thấy gì: Chạy riêng lệnh kiểm thiết kế hoặc ma trận phủ trên bản tải mới sẽ đỏ với lời báo sai nguyên nhân, và chạy song song lệnh tổng cũng có thể hỏng. Chạy tuần tự lệnh tổng vẫn xanh.
  Căn cứ: Gây phiền cho người phát triển nhưng không ảnh hưởng người dùng cuối hay dữ liệu, người chạy tự khắc phục được bằng cách chạy lệnh tổng hoặc vẽ lại tệp, nên ghi nhận là hạn chế đã biết.
  file: `mk/derived.mk`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: phép đo AC-8 chỉ assert dòng 'gate passes' và số khối, không đo việc cổng thực sự đọc thư mục màn design/screens**
  Người dùng thấy gì: Phép đo nghiệm thu chưa chứng minh cổng thực sự đọc được các màn từ thư mục mới, nên nếu cổng đọc ra không màn nào thì phép đo vẫn xanh. Lời tuyên rằng cổng vẫn bật khi chỉ có thư mục mảnh mới được chứng một nửa.
  Căn cứ: Là lỗ hổng trong độ tin cậy của bằng chứng chứ không phải lỗi sản phẩm, không mất dữ liệu, bổ sung phép đo là việc riêng khá rẻ nhưng nằm ngoài tiêu chí đã ký.
  file: `_acceptance/upgrade-design-assembly-0-7-0/rang/proof-gate-fragments.mjs`
  severity: high
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
