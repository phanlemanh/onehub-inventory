# Review findings: go-hoi-khi-gop (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lệnh đo quyen_kho luôn trả exit 1, nên E1, E2, E3 và E5 không thể đạt**
  Người dùng thấy gì: Phép kiểm quyền của kho luôn báo thất bại dù mọi ca đều đạt, nên không ai có thể xác nhận xong việc gỡ hỏi khi gộp bằng lệnh nghiệm thu này.
  Căn cứ: Chỉ làm sai kết quả đo chứ không đổi hành vi thật của kho, người dùng không mất dữ liệu; sửa rẻ nhưng nằm ngoài các tiêu chí đã duyệt nên cần người quyết.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: new-contract

- **Gỡ bước hỏi trái với chính sách 'agents propose, never merge', và rào GitHub được viện dẫn không đòi người duyệt**
  Người dùng thấy gì: Máy có thể tự gộp cả những thay đổi mức rủi ro cao mà không có hộp xin phép, trong khi chính sách của kho nói máy chỉ được đề xuất, và rào trên GitHub không bắt buộc người duyệt.
  Căn cứ: Hậu quả là một rào kiểm soát yếu đi chứ không mất dữ liệu ngay, và chủ kho đã chủ động giao quyền gộp; cần ghi rõ giới hạn và chủ kho tự chỉnh câu chính sách sau.
  file: `.claude/settings.json`
  severity: medium
  Đề xuất: known-limits

- **Lệnh nghiệm thu quyen_kho luôn exit 1 dù cả 47 ca đều đạt, nên E1, E2, E3, E5 đỏ giả**
  Người dùng thấy gì: Phép kiểm báo đỏ giả cho bốn tiêu chí nên người duyệt thấy việc chưa xong dù cấu hình thực tế đã đúng.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu, chạy lại sau khi sửa là hết; sửa rất rẻ nhưng nằm ngoài tiêu chí đã duyệt.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 - Assertion âm-tính-một-mình: AC-1 chỉ đo 'không luật hỏi/cấm nào khớp', trong khi lời hứa là 'không hiện hộp xin phép'**
  Người dùng thấy gì: Bộ kiểm xanh chưa chứng minh được hộp xin phép biến mất; trên máy thiếu phép cho phép cấp máy, lệnh gộp vẫn có thể hỏi.
  Căn cứ: Hậu quả nhẹ là chỉ thêm một lần bấm cho người dùng, tự thấy ngay ở lần gộp thật đầu tiên và hợp đồng đã ghi hạn chế này.
  file: `tests/permissions.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 - Tuyên quét lớp nhưng chỉ có điểm-case: luật duyệt PR viết lại để bắt 'mọi chỗ trong lệnh', chỉ đo một vị trí**
  Người dùng thấy gì: Nếu sau này luật hỏi khi duyệt PR bị sửa sai, một số cách viết lệnh duyệt có thể không còn bị hỏi mà bộ kiểm vẫn không báo.
  Căn cứ: Chỉ xảy ra khi có người sửa luật sau này, máy luôn viết lệnh theo một dạng quen thuộc nên rủi ro thấp; bổ sung kiểm thử sau cũng rẻ.
  file: `tests/permissions.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 - Fixture viết tay đúng khuôn bên đọc: bộ so khớp tự viết và bảng đối chứng tự viết, không round-trip với bộ đọc luật thật**
  Người dùng thấy gì: Bộ kiểm dựa trên cách hiểu của người viết về luật quyền, nên nếu công cụ đổi cách đọc luật thì bộ kiểm vẫn xanh dù hành vi thật đã đổi.
  Căn cứ: Chưa tìm ra ca nào sai, hậu quả chỉ là báo xanh nhầm trong tương lai và người dùng sẽ thấy ngay khi gộp thật; đối chiếu thật khá tốn công.
  file: `tests/permissions.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 - Fixture viết tay đúng khuôn bên đọc: bản gốc deny/allow vẫn là bản chép tay trong bộ kiểm chạy thường trực**
  Người dùng thấy gì: Về sau nếu ai đó nới một dòng cấm rồi chép vào bản mẫu của bộ kiểm thì kiểm tra thường ngày vẫn xanh và không cảnh báo.
  Căn cứ: Vòng này vẫn có phép kiểm bắt được thay đổi, rủi ro chỉ ở các lần sửa sau và cần người cố ý; sửa không gấp.
  file: `tests/permissions.test.ts`
  severity: low
  Đề xuất: known-limits

- **Ngoài 6 hình dạng (nêu để triage, đã chạy tái hiện) - Lệnh đo quyen_kho luôn thoát 1 nên E1, E2, E3, E5 không thể đạt 'exit 0'**
  Người dùng thấy gì: Phép kiểm quyền luôn báo thất bại dù mọi ca đều đạt, khiến việc nghiệm thu không thể xanh.
  Căn cứ: Chỉ sai phép đo, không mất dữ liệu và không ảnh hưởng người dùng cuối; sửa rẻ nhưng ngoài tiêu chí đã duyệt.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 3/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
