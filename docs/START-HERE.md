# Bắt đầu từ đây

## Kho đang ở đâu

Kho này sẽ thay Quỹ hàng để ra MVP, và chỉ mang những phần đã hiệu quả. Hiện đã có vỏ ứng dụng, nhận diện OneHub, chuẩn ngôn ngữ và các lớp kiểm; **chưa có tính năng**. Đề xuất đầy đủ: [design-standard-proposal.md](design-standard-proposal.md).

## Ba lệnh hằng ngày

```bash
make dev
```

```bash
make format
```

```bash
make check
```

Sau thay đổi nhìn thấy được, chạy thêm `make e2e`.

## Trong kho có gì

| Đường dẫn               | Là gì                                                                             |
| ----------------------- | --------------------------------------------------------------------------------- |
| `src/app/`              | Các màn và trang proto `/proto/<tên>`                                             |
| `src/components/`       | `ui`, `reui` của nhà cung cấp; `candidate` dùng chung; `templates` khung màn      |
| `src/modules/`          | Chín mô-đun nghiệp vụ, mới có ranh giới                                           |
| `src/styles/onehub.css` | Sổ ngoại lệ thương hiệu                                                           |
| `ontology/`             | Khái niệm, từ điển nhãn, kiểu hiển thị                                            |
| `design/`               | Sổ tất định, mẫu hành vi, ma trận trạng thái, chuẩn ngôn ngữ, danh mục thành phần |
| `.claude/`              | Luật theo đường dẫn, skill, hook cho Claude Code                                  |
| `_acceptance/`          | Cấu hình và hồ sơ cổng nghiệm thu                                                 |
| `wiki/`                 | Quyết định, khái niệm, nhật ký                                                    |

## Điều gì tự chạy

CI chạy `make check` khi có kho GitHub. Trong Claude Code, hook chặn sửa migration đã commit và tệp bí mật, và kiểm kiểu cùng lint tệp vừa đổi khi kết thúc lượt. Hook kit chặn báo cáo PASS giả.

## Về an toàn

- Điểm của `doctor` chỉ đo các tệp và bước kiểm đã có mặt, không đo mã có đúng không.
- `.claude/settings.json` giúp tránh nhầm, không phải rào tuyệt đối.
- Chưa có bộ kiểm cách ly công ty và bộ kiểm rò rỉ, vì chưa có dữ liệu và trang khách.

## Chưa làm

Tính năng MVP, kho GitHub, job cổng trong CI, ánh xạ thang rủi ro, triển khai, và:

- SaaS đa công ty: một cửa truy vấn duy nhất withCompany đặt app.company_id và vai không phải chủ bảng, kèm bộ kiểm cấm mở kết nối ngoài cửa; chỉ mô-đun identity được ngoại lệ vì một người thuộc nhiều sàn. Mọi khái niệm của sàn ghi rõ phạm vi company trong ontology.
- SaaS cấu hình theo sàn (ADR-0018): mô-đun company-config giữ cấu hình của sàn, nhãn và trạng thái riêng, trường riêng, từ điển giá trị, mẫu; chuyển Sổ điểm biến thiên cùng bộ kiểm khớp giữa sổ và mã. Giữ nguyên giới hạn đã chốt: không đối tượng tự tạo, không công thức, không rules engine hay workflow engine tổng quát.
- SaaS API-first: /api/v1 có OpenAPI là đường ghi duy nhất; thêm bước so bản mô tả API để phát hiện thay đổi phá vỡ, vì bộ khung chỉ có bước này ở archetype service-api.
- Chuyển phần che số chủ nhà trước khi gửi cho mô hình và hai bộ kiểm rò rỉ của đường AI cùng lúc với lời gọi. Đoạn mã này xếp mức rủi ro cao.
- Bộ khung dùng Vitest, kho cũ dùng node:test với 417 tệp: đổi dòng import bằng codemod khi chuyển từng mô-đun, giữ nguyên node:assert. Test chạm cơ sở dữ liệu chạy tuần tự trong một cấu hình Vitest riêng.
- Lược đồ mới, gọn theo phạm vi MVP, thay vì chép 47 migration của Quỹ hàng; chuyển dữ liệu bằng lệnh một lần, giữ đúng khoá mã hoá số chủ nhà.
- Mang từ Quỹ hàng từ vựng và các ADR còn hiệu lực, mỗi phần ghi commit nguồn.
- Sửa khi chuyển: LeaseAmountMax dựng trên LeaseAmount, mà RESO định nghĩa là tiền thuê mặt bằng doanh nghiệp đang trả, không phải giá cho thuê của căn; các tên *Min/*Max của tiêu chí tìm là tên suy ra, không phải trường RESO.
- Chốt khi chuyển mô-đun catalog: toà ánh xạ tài nguyên Building mới có ở 2.1; căn cho thuê có dùng PropertyType Residential Lease hay không; ngăn ảnh internal ánh xạ giá trị Permission nào vì RESO không có giá trị Internal.
- Mang bộ kiểm cách ly và bộ kiểm rò rỉ khi có cơ sở dữ liệu và trang khách; thêm job CI riêng có Postgres.
- Kho này thay Quỹ hàng khi ra MVP: dựng dự án Vercel và Supabase, chuyển dữ liệu, trỏ tên miền. Quỹ hàng dừng thêm tính năng, chỉ vá lỗi.
- Thay deploy.yml và release.yml do bộ khung sinh bằng trình tự của kho cũ: áp migration, kiểm nhanh chỉ đọc, gọi hook Vercel.
- Cài Acceptance-Gate Kit bằng acceptance-init và ánh xạ T1/T2/T3 của kit vào governance/autonomy.yaml để chỉ có một thang rủi ro. Người sửa tệp này vì agent bị chặn ở governance/.
- Trong ánh xạ đó, xếp mức cao cho bộ kiểm rò rỉ, che dữ liệu, trần lớp dữ liệu, thoả thuận, migration; bản mẫu để test ở mức agent tự gộp được.
- Bảo vệ nhánh như kho cũ: chỉ bắt buộc check xanh, chưa bắt buộc code owner duyệt vì kho chỉ có một chủ và GitHub không cho tự duyệt. Việc ký duyệt nằm ở Acceptance-Gate Kit.

## Bước tiếp theo

Chạy `/feature-loop:feature-loop` cho lát cắt Bảng hàng bản đọc. Không hiểu một tệp thì hỏi: «Giải thích tệp này làm gì và tôi có cần sửa không».
