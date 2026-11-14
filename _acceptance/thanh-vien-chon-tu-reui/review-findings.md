# Review findings: thanh-vien-chon-tu-reui (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 — tuyên quét LỚP (các bài kiểm cơ sở dữ liệu / bài kiểm quyền và mời) nhưng danh sách là điểm-case viết tay**
  Người dùng thấy gì: Phép đo chỉ khoá lời của một bài kiểm mời người, chưa khoá các bài kiểm quyền khác của sàn. Hiện chưa bài nào bị sửa, nên người dùng chưa gặp gì; chỉ có nguy cơ về sau nếu ai đó lặng lẽ sửa các bài kiểm quyền ấy mà không bị báo.
  Căn cứ: Hiện không ai bị ảnh hưởng và không mất dữ liệu; chỉ là lưới an toàn hơi thưa, ghi lại làm hạn chế đã biết là đủ, mở rộng danh sách sau cũng rẻ.
  file: `tests/thanh-vien-khoa-bai.test.ts`
  severity: low
  Đề xuất: known-limits

- **New column label 'Ngày mời' (columns.invitedAt) is never used (r1)**
  Người dùng thấy gì: A label for an invite date sits unused in the Members screen's text file. Users never see it and nothing on screen changes.
  Căn cứ: Harmless to users and invisible on screen; removing it later is trivial and cheap, so it does not justify its own work item.
  file: `src/app/(app)/members/copy.ts`
  severity: low
  Đề xuất: wont-fix

- **Shape 3: the list only checks that a row contains the text «Người mời:», not that it names the right inviter (r1)**
  Người dùng thấy gì: The automatic check on the Members list would not notice if a row showed the wrong inviter or a dash by mistake. The screen itself is not shown to be wrong.
  Căn cứ: Users are not affected today since the screen builds the column correctly; the risk is only a future regression slipping through, and it can be tightened later at low cost.
  file: `tests/e2e-db/thanh-vien.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 3: the check that the badge sits beside the invite title is always true (r1)**
  Người dùng thấy gì: The automatic check that the workspace label sits next to the invite dialog title is looser than promised. The dialog itself is not shown to look wrong.
  Căn cứ: No user-visible harm now, and a height check partly covers it; a layout slip would show in the screenshot review, so recording it as a known limit is enough.
  file: `tests/e2e-db/thanh-vien.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: «no count» and «no footer» are checked only by absence, with nothing to compare against (r1)**
  Người dùng thấy gì: A check that the list frame shows no count and no footer when none is given could pass even if the frame drew an empty count line. Users see no difference today.
  Căn cứ: Nothing wrong reaches users; the gap only weakens a safety net, and the extra effort to tighten it outweighs the small risk.
  file: `tests/framed-list.test.tsx`
  severity: low
  Đề xuất: wont-fix

- **Shape 5: the nine-state matrix exists only in a comment, and the final check just counts pushes (r1)**
  Người dùng thấy gì: The check that all nine screen states were exercised only counts them, so a misnamed or duplicated state could still pass. The states on screen are not shown to be wrong.
  Căn cứ: No user impact now; it could let a missed state go unnoticed later, but it is easy to tighten in a follow-up and nothing is lost or exposed.
  file: `tests/e2e-db/thanh-vien.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
