# Vai × Màn tới cấp nút

<!-- Tệp sinh bởi tools/coverage_matrix/buttons.py từ ontology/actions.yaml, design/screens.yaml và các nút tìm thấy
     trong mã của từng màn. Không sửa tay: đổi bảng quyền, sổ màn hay nút của màn rồi chạy lại lệnh; make check đỏ
     khi tệp lệch. -->

Mỗi màn của sổ màn có một mục, cộng mục `khung` cho App Shell. Cột «Nút theo quyền» liệt các thao tác vai ấy làm
được trên màn, kèm phạm vi; «dự kiến» là nút sổ màn đã khai mà mã chưa có. «chặn» là vai không có ô nào.

## khung — `(App Shell)`

| Vai          | Nút theo quyền                               | Nút không theo quyền         |
| ------------ | -------------------------------------------- | ---------------------------- |
| Đầu chủ      | `removeView` (của tôi), `editView` (của tôi) | Tìm (⌘K), Đổi sàn, Đăng xuất |
| Đầu khách    | `removeView` (của tôi), `editView` (của tôi) | Tìm (⌘K), Đổi sàn, Đăng xuất |
| Trưởng nhóm  | `removeView` (của tôi), `editView` (của tôi) | Tìm (⌘K), Đổi sàn, Đăng xuất |
| Quản trị sàn | chặn                                         | Tìm (⌘K), Đổi sàn, Đăng xuất |

## today — `/`

| Vai          | Nút theo quyền | Nút không theo quyền |
| ------------ | -------------- | -------------------- |
| Đầu chủ      | chặn           | —                    |
| Đầu khách    | chặn           | —                    |
| Trưởng nhóm  | chặn           | —                    |
| Quản trị sàn | chặn           | —                    |

## inventory — `/inventory`

| Vai          | Nút theo quyền                                                                                                                                                                                                                | Nút không theo quyền                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Đầu chủ      | `updateListing` (toàn sàn), `editView` (của tôi), `saveView` (của tôi), `createListing` (toàn sàn, dự kiến), `activateListing` (của tôi, dự kiến), `removeListing` (của tôi, dự kiến), `viewOwnerPhone` (của tôi, dự kiến)    | Chép đường dẫn, Lọc, Cột, Toàn màn hình, Trước, Sau, Đóng |
| Đầu khách    | `updateListing` (toàn sàn), `editView` (của tôi), `saveView` (của tôi), `createListing` (toàn sàn, dự kiến)                                                                                                                   | Chép đường dẫn, Lọc, Cột, Toàn màn hình, Trước, Sau, Đóng |
| Trưởng nhóm  | `updateListing` (toàn sàn), `editView` (của tôi), `saveView` (của tôi), `createListing` (toàn sàn, dự kiến), `activateListing` (toàn sàn, dự kiến), `removeListing` (toàn sàn, dự kiến), `viewOwnerPhone` (toàn sàn, dự kiến) | Chép đường dẫn, Lọc, Cột, Toàn màn hình, Trước, Sau, Đóng |
| Quản trị sàn | chặn                                                                                                                                                                                                                          | Chép đường dẫn, Lọc, Cột, Toàn màn hình, Trước, Sau, Đóng |

## sent — `/sent`

| Vai          | Nút theo quyền | Nút không theo quyền    |
| ------------ | -------------- | ----------------------- |
| Đầu chủ      | chặn           | Lọc, Cột, Toàn màn hình |
| Đầu khách    | chặn           | Lọc, Cột, Toàn màn hình |
| Trưởng nhóm  | chặn           | Lọc, Cột, Toàn màn hình |
| Quản trị sàn | chặn           | Lọc, Cột, Toàn màn hình |

## contacts — `/contacts`

| Vai          | Nút theo quyền                                                                                                                                                                                     | Nút không theo quyền |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Đầu chủ      | `createContact` (toàn sàn, dự kiến), `updateContact` (của tôi, dự kiến), `removeContact` (của tôi, dự kiến)                                                                                        | —                    |
| Đầu khách    | `createContact` (toàn sàn, dự kiến), `updateContact` (của tôi, dự kiến), `removeContact` (của tôi, dự kiến)                                                                                        | —                    |
| Trưởng nhóm  | `createContact` (toàn sàn, dự kiến), `updateContact` (toàn sàn, dự kiến), `removeContact` (toàn sàn, dự kiến), `mergeContacts` (toàn sàn, dự kiến), `eraseContactPersonalData` (toàn sàn, dự kiến) | —                    |
| Quản trị sàn | chặn                                                                                                                                                                                               | —                    |

## tuy-chinh-san — `/tuy-chinh-san`

| Vai          | Nút theo quyền                                                                                                                                              | Nút không theo quyền    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Đầu chủ      | `readCompanyLayer` (toàn sàn), `addCompanyLayer` (toàn sàn), `matchPendingUnits` (toàn sàn), `editCompanyLayer` (toàn sàn), `retireCompanyLayer` (toàn sàn) | Lọc, Cột, Toàn màn hình |
| Đầu khách    | `readCompanyLayer` (toàn sàn)                                                                                                                               | Lọc, Cột, Toàn màn hình |
| Trưởng nhóm  | `readCompanyLayer` (toàn sàn), `addCompanyLayer` (toàn sàn), `matchPendingUnits` (toàn sàn), `editCompanyLayer` (toàn sàn), `retireCompanyLayer` (toàn sàn) | Lọc, Cột, Toàn màn hình |
| Quản trị sàn | `readCompanyLayer` (toàn sàn), `addCompanyLayer` (toàn sàn), `matchPendingUnits` (toàn sàn), `editCompanyLayer` (toàn sàn), `retireCompanyLayer` (toàn sàn) | Lọc, Cột, Toàn màn hình |

## proto — `/proto/[slug]`

| Vai          | Nút theo quyền | Nút không theo quyền |
| ------------ | -------------- | -------------------- |
| Đầu chủ      | chặn           | —                    |
| Đầu khách    | chặn           | —                    |
| Trưởng nhóm  | chặn           | —                    |
| Quản trị sàn | chặn           | —                    |

## proto-bo-nut — `/proto/bo-nut-theo-quyen`

| Vai          | Nút theo quyền                                                                                                                                                                                                                                                                                  | Nút không theo quyền |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Đầu chủ      | `createListing` (toàn sàn), `createContact` (toàn sàn), `updateListing` (toàn sàn), `removeListing` (của tôi), `updateContact` (của tôi), `removeContact` (của tôi), `viewListings` (toàn sàn), `viewContacts` (toàn sàn)                                                                       | —                    |
| Đầu khách    | `createListing` (toàn sàn), `createContact` (toàn sàn), `updateListing` (toàn sàn), `updateContact` (của tôi), `removeContact` (của tôi), `viewListings` (toàn sàn), `viewContacts` (toàn sàn)                                                                                                  | —                    |
| Trưởng nhóm  | `createListing` (toàn sàn), `createContact` (toàn sàn), `updateListing` (toàn sàn), `removeListing` (toàn sàn), `updateContact` (toàn sàn), `mergeContacts` (toàn sàn), `removeContact` (toàn sàn), `eraseContactPersonalData` (toàn sàn), `viewListings` (toàn sàn), `viewContacts` (toàn sàn) | —                    |
| Quản trị sàn | chặn                                                                                                                                                                                                                                                                                            | —                    |

## sign-in — `/login`

| Vai          | Nút theo quyền | Nút không theo quyền |
| ------------ | -------------- | -------------------- |
| Đầu chủ      | chặn           | —                    |
| Đầu khách    | chặn           | —                    |
| Trưởng nhóm  | chặn           | —                    |
| Quản trị sàn | chặn           | —                    |

## members — `/members`

| Vai          | Nút theo quyền                                                                      | Nút không theo quyền |
| ------------ | ----------------------------------------------------------------------------------- | -------------------- |
| Đầu chủ      | chặn                                                                                | —                    |
| Đầu khách    | chặn                                                                                | —                    |
| Trưởng nhóm  | chặn                                                                                | —                    |
| Quản trị sàn | `listMembers` (toàn sàn), `inviteMember` (toàn sàn), `changeMemberRoles` (toàn sàn) | —                    |
