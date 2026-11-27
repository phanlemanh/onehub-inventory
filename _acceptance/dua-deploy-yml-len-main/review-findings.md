# Review findings: dua-deploy-yml-len-main (round 1)

## Trong hợp đồng

(không có finding nào)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Shape 3 (asserting a string is present when the promise is a relation): E3's escape path for repository variables only checks that the name appears in backticks**
  Người dùng thấy gì: Bài kiểm tên biến ở nhánh biến kho hơi lỏng: một tên chỉ được nhắc trong lời văn của sổ tay cũng qua. Hiện chỉ có một biến đi qua đường này và nó đúng, nên bản triển khai không bị sai vì chuyện này.
  Căn cứ: Hậu quả nhẹ: bản triển khai hiện tại vẫn đúng và chỉ lỏng ở khâu kiểm, không mất hay lộ dữ liệu; khi thêm biến kho mới thì người làm sẽ thấy, nên ghi lại là đủ.
  file: `_acceptance/dua-deploy-yml-len-main/rang/kiem.py`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
