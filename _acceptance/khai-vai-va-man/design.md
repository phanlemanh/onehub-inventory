# Thiết kế: khai vai và màn cho máy đọc

Hàng 1d của lộ trình (`docs/plan/lo-trinh.json`, mã N11). Căn cứ: quyết định 0017 (thử khối Vai × Màn ở mỗi vòng) và 0016 (vai cố định, bảng quyền duy nhất).

## Vấn đề

Máy của kit chỉ kiểm mục Độ phủ của hợp đồng có mặt, không kiểm đủ vai và đủ màn. Ở Quỹ hàng chỉ khoảng 33/98 hợp đồng chạm giao diện nhắc cả vai lẫn màn, và lỗi sửa hàng không kiểm vai lọt qua hai vòng quét. Kho này chưa có danh sách vai hay sổ màn nào cho máy đọc: thanh bên của khung (hàng 1a) đã biết lọc theo vai nhưng không có nguồn vai thật.

## Kết quả

Bốn thứ, mỗi thứ một chỗ:

1. **Danh sách vai** — `ontology/roles.yaml`, theo khuôn sẵn của bộ sinh mã (`tools/ontology_actions.py`): bốn vai giao được `ListAgent` (Đầu chủ), `BuyerAgent` (Đầu khách), `TeamLead` (Trưởng nhóm), `CompanyAdmin` (Quản trị sàn). Tên hiển thị không chép vào đây: máy đọc từ `ontology/labels.yaml` (mục `kind: role`). Tệp ghi luật «một người giữ được nhiều vai, quyền cộng lại» của quyết định 0016 bằng khoá `holds: many`, để hàng thanh bên nhiều vai sau này đọc từ đây. Không khai `inherits`: quyền và kế thừa là việc của bảng quyền (hàng 9a).
2. **Sổ màn** — `design/screens.yaml`: mỗi màn có mã, đường dẫn, nhãn tên màn (khoá của `labels.yaml`), họ, đối tượng (`staff` nhân viên đăng nhập · `public` trang khách · `dev` chỉ ở bản phát triển) và trạng thái (`built` đã có trang · `planned` khai trước). Họ được khai ở đầu tệp: `grid` (Lưới). Màn chưa xếp họ ghi `family: null`; hàng 1c xếp sau.
3. **Máy kiểm** — `tools/coverage_matrix/check.py`, chạy trong `make check` qua tệp mới `mk/coverage.mk` (Makefile tự nạp `mk/*.mk`, không sửa Makefile):
   - mọi trang `page.tsx` dưới `src/app` khớp một màn trong sổ (bỏ nhóm `(x)` và khe `@x` khỏi đường dẫn; `[x]` giữ nguyên) — trang chưa khai thì đỏ, gọi tên đường dẫn;
   - màn `built` phải có trang, màn `planned` chưa được có trang; mã và đường dẫn không trùng; họ, đối tượng, trạng thái thuộc danh sách khai; nhãn tên màn có trong `labels.yaml`;
   - mọi vai có nhãn `kind: role` trong `labels.yaml`;
   - hợp đồng: xem mục «Khối Vai × Màn».
4. **Lệnh số đo** — `python3 tools/coverage_matrix/check.py --report` (gọi qua `make coverage-report`): in số vòng chạm màn, số vòng đủ ô, thiếu ô, trước khối, số ô «không liên quan» trên tổng ô kèm tỉ lệ, và mốc Quỹ hàng 33/98. Lệnh này không đỏ vì vòng thiếu ô: nó là thước, không phải chốt.

## Khối Vai × Màn

Hợp đồng của một vòng **chạm giao diện** (frontmatter `surfaces` có `ui`, `web` hoặc `web-ui`) hoặc tự khai `screens` thì phải có:

- frontmatter `screens: [<mã màn>, …]` — các màn vòng này chạm, mã lấy từ sổ;
- mục `## Vai × Màn` với một bảng: cột đầu «Màn», mỗi vai một cột, tên cột là tên hiển thị của vai; mỗi màn trong `screens` đúng một dòng, ô đầu dòng là mã màn.

Mỗi ô mở đầu bằng một trong ba lời, rồi `—` và phần mô tả:

| Lời | Nghĩa |
|---|---|
| `được` | vai này vào màn và làm được phần vòng này đổi |
| `chặn` | vai này không được vào, thấy «Không đủ quyền» |
| `không liên quan` | vai vào được nhưng phần vòng này đổi không chạm vai ấy — **bắt buộc kèm lý do** |

Ví dụ (vòng Bảng hàng):

```markdown
## Vai × Màn

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — thấy căn của mình | được — thấy căn cả sàn, không thấy số chủ | được — thấy căn cả sàn | chặn — quản trị không tự có quyền xem hàng |
```

Vòng chạm giao diện mà không chạm màn nào (chỉ dựng thành phần dùng chung) ghi `screens: []` và một dòng lý do dưới mục `## Vai × Màn`, không có bảng. Như thế không có đường bỏ khối im lặng, và lệnh số đo đếm riêng loại vòng này.

Đỏ khi: thiếu `screens` hay thiếu mục · thiếu cột của một vai · cột lạ không phải vai · thiếu dòng của một màn trong `screens` · dòng của màn không có trong `screens` hay không có trong sổ · ô trống · ô không mở đầu bằng ba lời · `không liên quan` không có lý do · `screens: []` không có dòng lý do.

Trạng thái hồ sơ theo khuôn hợp đồng của kit: **mở** là `draft`, `approved`, `implemented`, `verified`; **đóng** là `signed-off`, `machine-cleared`, `da-cham-boi-thuc-te`; trạng thái khác thì đỏ.

**Hồ sơ đã đóng** mà không có mục `## Vai × Màn` là hồ sơ «trước khối»: không đỏ, đếm riêng. Hồ sơ đã đóng mà có mục thì vẫn bị kiểm đủ như trên — bỏ một vai khỏi khối của hồ sơ đã ký vẫn đỏ. Vì `make check` chạy trên mọi PR, hồ sơ nào đóng sau khi máy kiểm vào nhánh chính đều đã phải qua nó.

Máy chỉ kiểm đủ ô. Ô đúng hay sai do người xét ở Cổng Phạm vi (quyết định 0017).

## Phương án đã cân

- **Viết máy kiểm bằng Python, bài kiểm bằng Vitest gọi tiến trình** — giống `tools/design_check.py` và `tests/design-check.test.ts`; công cụ của kho đều là Python thư viện chuẩn, dùng `repo_ontology.load_yaml_file` (có bộ đọc YAML dự phòng khi máy không có PyYAML). Không chọn TypeScript: sẽ là công cụ duy nhất của `tools/` viết khác.
- **Kích hoạt khối theo `surfaces` + `screens`**, không theo danh sách hồ sơ miễn: danh sách miễn phải cập nhật mỗi lần có hồ sơ mới và dễ thành đường lọt. Nhược: vòng chạm quyền mà không khai mặt giao diện (như hàng 9a) không bị ép — ghi ở Out of scope.
- **Ba lời cố định trong ô**, không tự do: lệnh số đo cần đếm «không liên quan» để thấy khối có bị điền cho qua không (0017).
- **Liên hệ khai trước ở trạng thái `planned`**: đáp ứng «màn Liên hệ dù làm sau vẫn được khai trước vào họ Lưới» mà không bắt có trang.
- **Không sinh thanh bên từ sổ màn** ở vòng này: thanh bên theo nhiều vai là một hàng riêng (giám sát xếp sau 1d); sổ có mã màn ổn định để hàng ấy dùng.

## Đặc tả UX

Bỏ: vòng không có mặt người nhìn (xem sổ quyết định).
