# Review findings: thang-chon-khoi-vao-cong (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Input validation at boundaries: a candidate image can sit outside the round folder**
  Người dùng thấy gì: Một hồ sơ có thể trỏ tới ảnh ứng viên nằm ở nơi khác trên máy mà cổng vẫn cho qua. Chủ kho nhìn ảnh ở Cổng Phạm vi nên vẫn thấy đúng ảnh, nhưng hồ sơ có thể không mang đủ ảnh theo cùng.
  Căn cứ: Hậu quả nhẹ: không mất hay lộ dữ liệu, người soi ở cổng vẫn nhìn thấy ảnh, và chỉ xảy ra khi tác tử cố ý ghi đường dẫn tuyệt đối nên rất hiếm.
  file: `tools/proof_gate/check.py:438`
  severity: low
  Đề xuất: known-limits

- **Decision 0023 / invariant 'something made in this round is not in the store': the supplier folder is fully exempt**
  Người dùng thấy gì: Một vòng có thể cài nguyên một khối ReUI lớn vào thư mục nhà cung cấp rồi ghi là đã có trong kho, nên cổng không đòi ứng viên, lý do vùng hay dòng sổ cho khối đó.
  Căn cứ: Hậu quả nhẹ và đã được hợp đồng chấp nhận có chủ ý; người soi ở Cổng Phạm vi vẫn thấy khối được cài, và ghi thành hạn chế đã biết là đủ.
  file: `tools/proof_gate/model.py:539`
  severity: low
  Đề xuất: known-limits

- **Rounds that use a wrapping template are left out of the gate's open-round count and per-path tally**
  Người dùng thấy gì: Báo cáo số đo gửi về kit đếm thiếu các vòng dựng có dùng khuôn bọc như App Shell, nên con số vòng đang mở thấp hơn thực tế mà không có lời báo.
  Căn cứ: Chỉ làm số đo lệch, không ảnh hưởng người dùng cuối hay dữ liệu, và chạy lại sau khi sửa là có số đúng ngay.
  file: `tools/proof_gate/check.py:633`
  severity: low
  Đề xuất: known-limits

- **Candidate image path is not checked for absolute paths, so an image outside the round's folder is accepted**
  Người dùng thấy gì: Hồ sơ có thể dẫn tới ảnh ứng viên ở ngoài thư mục của vòng mà cổng vẫn xanh, nên ảnh có thể không đi kèm hồ sơ khi người khác mở lại.
  Căn cứ: Hậu quả nhẹ, không mất hay lộ dữ liệu, tự lộ ra khi mở lại hồ sơ trên máy khác và sửa lại rất rẻ.
  file: `tools/proof_gate/check.py:437`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: bài 'sổ của kho thật đọc được' không bao giờ đỏ được**
  Người dùng thấy gì: Một bài kiểm tra việc cổng đọc được sổ khối của kho thật có thể không bao giờ báo đỏ, nên nếu sổ hỏng thì bài đó không phải bài phát hiện ra.
  Căn cứ: Hậu quả nhẹ vì một bài khác của kho thật vẫn sẽ đỏ khi sổ hỏng, không ảnh hưởng người dùng, và củng cố bài này sau rất rẻ.
  file: `tools/proof_gate/proof-gate-0023.test.ts:857`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP nhưng ma trận viết trước chỉ phủ 2 trong 5 nấc**
  Người dùng thấy gì: Bộ bài kiểm chỉ ghim từng mục ở hai nấc hồ sơ, nên các nấc còn lại chưa có bài riêng chứng minh mục nào bị đòi hay im, dù lời mô tả thẻ nói rộng hơn.
  Căn cứ: Hậu quả nhẹ vì ma trận năm nấc ở phần khác của AC-1 đã phủ ba nấc đỏ và các nấc còn lại; không ảnh hưởng người dùng, thêm bài sau rẻ.
  file: `tools/proof_gate/proof-gate-0023.test.ts:485`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
