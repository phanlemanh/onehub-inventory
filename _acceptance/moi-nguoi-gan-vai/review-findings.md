## Trong hợp đồng

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): axe-sang-toi tuyên 'mọi trạng thái của bảng trạng thái' nhưng chỉ quét 3/9 trạng thái**
  file: `tests/e2e-db/members.spec.ts:359`
  severity: high
  AC: AC-9
  source: measurement
  detail: evals.yaml dòng 38 và E13 hứa 'axe không có vi phạm ở mọi trạng thái, sáng và tối'. Nhưng test 'axe-sang-toi' chỉ gọi axeClean ở ready, invite-open, invite-invalid, roles-open, forbidden (dòng 367, 373, 377, 383, 388). Sáu trạng thái của bảng không có lần quét axe nào: ST-members-loading, ST-members-error, ST-members-long, ST-invite-already, ST-invite-failed, ST-roles-last-admin. Test 'loi-va-thu-lai' và 'doi-vai-thanh-ben' dựng các trạng thái này nhưng chỉ chụp ảnh, không gọi axeClean. Không có ma trận trạng thái viết trước nào để số lần quét bằng số trạng thái. Kèm theo: bằng chứng của trạng thái đang tải không đo được trạng thái ấy. evidence/ST-members-loading.png và evidence/ST-members-long.png trùng md5 (025cb4ec…). Ảnh 'loading' thật ra là màn đã có dữ liệu, không thấy khung chờ. Lý do: shot() đợi 250ms rồi mới chụp (dòng 126, 273), trong khi assert khung chờ hiện (dòng 272) đã qua từ trước.
  rationale: AC-9 đòi mỗi trạng thái của bảng trạng thái hiện đúng và axe không lỗi; nhiều trạng thái chưa được quét và ảnh trạng thái đang tải không chứng minh được trạng thái ấy.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New entity Member is not listed as owned by any module in architecture/modules.yaml**
  Người dùng thấy gì: Người dùng không thấy gì khác đi. Chỉ là sổ ghi mô-đun nào giữ khái niệm Thành viên còn thiếu một dòng, nên người sau có thể không biết khái niệm này thuộc phần nào.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu, chỉ là thiếu ghi chép nội bộ; thêm một dòng sau này rất rẻ.
  file: `architecture/modules.yaml`
  severity: medium
  Đề xuất: known-limits
- **Member.companyId breaks the pattern of every other company-scoped entity (uuid instead of ref to Company)**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Mô hình nghiệp vụ khai liên kết Thành viên với Sàn lỏng hơn các khái niệm khác, nên về sau có thể gây nhầm khi mở rộng.
  Căn cứ: Không có hậu quả với người dùng, không mất hay lộ dữ liệu; chủ kho chỉ cần xem lại khi duyệt thay đổi mô hình.
  file: `ontology/entities/Member.yaml`
  severity: low
  Đề xuất: known-limits
- **Screen declares its own Member type instead of using a type from the identity module or the generated one**
  Người dùng thấy gì: Người dùng không thấy gì. Hình dạng danh sách thành viên được khai hai nơi, sau này đổi một nơi mà quên nơi kia có thể làm màn hiển thị sai.
  Căn cứ: Hiện chưa gây lỗi nào cho người dùng; rủi ro chỉ xuất hiện khi sửa sau này và sửa gộp lại khá rẻ.
  file: `src/app/(app)/members/members-screen.tsx`
  severity: low
  Đề xuất: known-limits
- **An admin who removes their own Company admin role lands on an error screen that keeps failing**
  Người dùng thấy gì: Quản trị tự bỏ vai Quản trị sàn của mình khi còn quản trị khác sẽ thấy màn lỗi chung, và bấm Thử lại luôn thất bại. Họ phải tải lại trang mới thấy Không đủ quyền.
  Căn cứ: Gây bối rối nhưng không mất dữ liệu, thao tác đã lưu đúng và người dùng tự thoát được bằng cách tải lại trang.
  file: `src/app/(app)/members/members-screen.tsx`
  severity: medium
  Đề xuất: new-contract
- **Every SQLSTATE 42501 error is turned into 'forbidden', which can hide a misconfigured grant**
  Người dùng thấy gì: Nếu sau này cấu hình quyền cơ sở dữ liệu bị sai, một quản trị thật sẽ thấy Không đủ quyền mà không ai được báo lỗi, khó biết nguyên nhân.
  Căn cứ: Chỉ xảy ra khi có sai cấu hình, không lộ hay mất dữ liệu; hậu quả là khó dò lỗi, sửa lúc nào cũng được.
  file: `src/modules/identity/members.ts`
  severity: low
  Đề xuất: known-limits
- **The invitation mail is sent before COMMIT, so the person can get the mail without being added**
  Người dùng thấy gì: Hiếm khi, người được mời nhận thư nói họ đã vào sàn nhưng thực ra chưa được thêm, và quản trị thấy báo lỗi. Quản trị mời lại là xong.
  Căn cứ: Rất hiếm, không lộ hay mất dữ liệu, người dùng tự khắc phục bằng cách mời lại; sửa triệt để tốn kém hơn hậu quả.
  file: `src/modules/identity/members.ts`
  severity: low
  Đề xuất: wont-fix
- **Hình dạng 5 (ma trận viết trước không được đo đủ): ô member_list của người chỉ thuộc B bị thay kỳ vọng**
  Người dùng thấy gì: Chưa có bài kiểm tự động chứng minh người chỉ ở sàn B chỉ thấy dòng của B khi xem danh sách. Hành vi thật có thể vẫn đúng nhưng chưa được kiểm.
  Căn cứ: Không có lỗi đã biết với người dùng, chỉ là một lớp kiểm còn mỏng; bổ sung bài kiểm sau này rẻ.
  file: `tests/db/moi-nguoi.db.test.ts`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 4 (đối chứng không chạm đúng lời hứa): pha-thu-lo-tai-khoan đổi mã trạng thái, không thêm trường**
  Người dùng thấy gì: Chưa chứng minh được bài kiểm sẽ bắt khi phản hồi mời lộ thêm một chi tiết nhỏ cho thấy email đã có tài khoản. Hành vi hiện tại chưa bị chỉ ra là sai.
  Căn cứ: Không có lỗi người dùng đã thấy, chỉ là độ tin cậy của bài kiểm còn chưa trọn; không mất hay lộ dữ liệu.
  file: `tests/db/pha-thu/lo-tai-khoan.sql`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/9 lỗi rơi vào file không bộ đo nào phủ (architecture/modules.yaml, ontology/entities/Member.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
