# Vai × Màn tới cấp nút

<!-- Tệp sinh bởi tools/coverage_matrix/buttons.py từ ontology/actions.yaml và các nút khai trên từng màn. Không sửa
     tay: đổi bảng quyền hay nút của màn rồi chạy lại lệnh; make check đỏ khi tệp lệch. -->

Mỗi ô liệt các thao tác vai ấy làm được trên màn, kèm phạm vi. «chặn» là vai không có ô nào trên màn.

## proto-bo-nut — `/proto/bo-nut-theo-quyen`

| Vai          | Nút và việc hiện                                                                                                                                                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Đầu chủ      | `createListing` (toàn sàn), `createContact` (toàn sàn), `updateListing` (toàn sàn), `removeListing` (của tôi), `updateContact` (của tôi), `removeContact` (của tôi), `viewListings` (toàn sàn), `viewContacts` (toàn sàn)                                                                       |
| Đầu khách    | `createListing` (toàn sàn), `createContact` (toàn sàn), `updateListing` (toàn sàn), `updateContact` (của tôi), `removeContact` (của tôi), `viewListings` (toàn sàn), `viewContacts` (toàn sàn)                                                                                                  |
| Trưởng nhóm  | `createListing` (toàn sàn), `createContact` (toàn sàn), `updateListing` (toàn sàn), `removeListing` (toàn sàn), `updateContact` (toàn sàn), `mergeContacts` (toàn sàn), `removeContact` (toàn sàn), `eraseContactPersonalData` (toàn sàn), `viewListings` (toàn sàn), `viewContacts` (toàn sàn) |
| Quản trị sàn | chặn                                                                                                                                                                                                                                                                                            |

## members — `/members`

| Vai          | Nút và việc hiện                                                                    |
| ------------ | ----------------------------------------------------------------------------------- |
| Đầu chủ      | chặn                                                                                |
| Đầu khách    | chặn                                                                                |
| Trưởng nhóm  | chặn                                                                                |
| Quản trị sàn | `inviteMember` (toàn sàn), `changeMemberRoles` (toàn sàn), `listMembers` (toàn sàn) |
