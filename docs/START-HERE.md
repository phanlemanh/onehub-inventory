# Bắt đầu từ đây

## Kho đang ở đâu

Đây là **bộ khung**, chưa phải sản phẩm. Chưa có trang web, API hay cơ sở dữ liệu; Quỹ hàng vẫn chạy ở kho `onehub-quy-hang`.
Mã mẫu còn lại gồm `src/greet.ts` (in một lời chào) và lớp gọi Claude ở `src/ai/`. Mười ba mô-đun mới có tên và ranh giới, chưa có mã.

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

## Trong kho có gì

| Đường dẫn                   | Là gì                                                 | Bạn cần làm gì                             |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------ |
| `src/modules/`              | Mười ba mô-đun nghiệp vụ, mỗi mô-đun có cửa công khai | Chuyển mã vào từng mô-đun                  |
| `architecture/modules.yaml` | Bản đồ mô-đun và ai được dùng ai                      | Khai sự phụ thuộc khi chuyển mã            |
| `ontology/`                 | Năm khái niệm, từ vựng, ánh xạ RESO DD 2.1            | Thêm khái niệm bằng `/ontology-add`        |
| `src/ai/`, `evals/`         | Lớp gọi Claude và bộ đánh giá                         | `make eval` tốn tiền API, chỉ chạy khi cần |
| `wiki/`                     | Quyết định, khái niệm, nhật ký                        | Cập nhật sau mỗi việc                      |
| `governance/autonomy.yaml`  | Thang rủi ro cho thay đổi của agent                   | Người sửa, agent bị chặn                   |
| `tools/`, `mk/`, `Makefile` | Các bước kiểm tra                                     | Thường không cần đụng                      |
| `.github/`                  | CI, phát hành, mẫu PR                                 | Người sửa workflow, agent bị chặn          |
| `setup-blueprint.yaml`      | Toàn bộ quyết định lúc dựng kho                       | Đọc khi cần biết vì sao                    |

## Điều gì tự chạy

CI chạy `make check` trên GitHub khi có push hay PR, sau khi kho được đẩy lên. Quy trình phát hành chạy khi vào `main`.
Bước triển khai chỉ chạy khi bật biến `DEPLOY_ENABLED`, hiện chưa bật. Bên trong Claude Code không có gì tự chạy.

## Về an toàn

- Điểm 100/100 của `doctor` chỉ đo các tệp và bước kiểm tra đã có mặt. Nó không đo mã có đúng không, và chưa kiểm phần bảo vệ trên GitHub.
- `.claude/settings.json` giúp tránh nhầm, không phải rào tuyệt đối.
- Mức team đã có pre-commit, quét bí mật và ngưỡng phủ test. Chưa có bộ kiểm cách ly công ty và bộ kiểm rò rỉ, vì chưa có mã để kiểm.

## Chưa làm

Tính năng, kho GitHub, triển khai, và các việc làm tay sau:

- **Kiến trúc:** SaaS đa công ty: một cửa truy vấn duy nhất withCompany đặt app.company_id và vai không phải chủ bảng, kèm bộ kiểm cấm mở kết nối ngoài cửa; chỉ mô-đun identity được ngoại lệ vì một người thuộc nhiều sàn. Mọi khái niệm của sàn ghi rõ phạm vi company trong ontology.
- **Kiến trúc:** SaaS cấu hình theo sàn (ADR-0018): mô-đun company-config giữ cấu hình của sàn, nhãn và trạng thái riêng, trường riêng, từ điển giá trị, mẫu; chuyển Sổ điểm biến thiên cùng bộ kiểm khớp giữa sổ và mã. Giữ nguyên giới hạn đã chốt: không đối tượng tự tạo, không công thức, không rules engine hay workflow engine tổng quát.
- **Kiến trúc:** SaaS API-first: /api/v1 có OpenAPI là đường ghi duy nhất; thêm bước so bản mô tả API để phát hiện thay đổi phá vỡ, vì bộ khung chỉ có bước này ở archetype service-api.
- **Kiến trúc:** Tầng vận hành SaaS (mở sàn, gói dịch vụ, hợp đồng, thanh toán): kho cũ chỉ có lệnh mở sàn, chưa có gói cước hay thanh toán. Chuyển lệnh mở sàn; phần còn lại ngoài phạm vi refactor.
- **AI trong sản phẩm:** Chuyển phần che số chủ nhà trước khi gửi cho mô hình và hai bộ kiểm rò rỉ của đường AI cùng lúc với lời gọi. Đoạn mã này xếp mức rủi ro cao.
- **Ngôn ngữ và khung:** Thêm Next.js 16, React 19, Tailwind 4, ReUI, Hono + zod-openapi, better-auth, pg khi chuyển mã; build đổi từ tsc sang next build. Chuyển kèm máy chủ MCP reui và shadcn dùng lúc phát triển, và REUI_LICENSE_KEY.
- **Ngôn ngữ và khung:** Bộ khung dùng Vitest, kho cũ dùng node:test với 417 tệp: đổi dòng import bằng codemod khi chuyển từng mô-đun, giữ nguyên node:assert. Test chạm cơ sở dữ liệu chạy tuần tự trong một cấu hình Vitest riêng.
- **Từ vựng và dữ liệu:** Sửa khi chuyển: LeaseAmountMax dựng trên LeaseAmount, mà RESO định nghĩa là tiền thuê mặt bằng doanh nghiệp đang trả, không phải giá cho thuê của căn; các tên *Min/*Max của tiêu chí tìm là tên suy ra, không phải trường RESO.
- **Từ vựng và dữ liệu:** Chốt khi chuyển mô-đun catalog: toà ánh xạ tài nguyên Building mới có ở 2.1; căn cho thuê có dùng PropertyType Residential Lease hay không; ngăn ảnh internal ánh xạ giá trị Permission nào vì RESO không có giá trị Internal.
- **Từ vựng và dữ liệu:** Giữ Postgres và lược đồ hiện có. Kho cũ là nơi DUY NHẤT ghi migration và áp lên bản thật cho đến lúc chuyển; kho mới chỉ chép nguyên văn các tệp đã gộp, không tự thêm migration, và không bao giờ áp lên bản thật trước lúc chuyển.
- **Từ vựng và dữ liệu:** Chuyển CONTEXT.md, 27 ADR và docs/product/tham-chieu.md sang wiki của kho mới. Lịch sử _acceptance ở lại kho cũ.
- **Chất lượng:** Chuyển các rào riêng của sản phẩm: bộ kiểm rò rỉ và luật giao diện quy-hang-ui vào make check; bộ kiểm cách ly thành lệnh make check-db và job CI riêng có Postgres, vì make check chạy không có cơ sở dữ liệu.
- **Chất lượng:** Chuyển hook chặn sửa migration đã commit, skill verify và new-migration, skill giao diện reui và quy-hang-ui. Người sửa các tệp workflow CI vì agent bị chặn ở đó.
- **Triển khai:** Trước lúc chuyển: dựng dự án Vercel mới và một Supabase thử riêng, không dùng chung cơ sở dữ liệu của bản thật. Kho cũ tiếp tục là bản chạy thật.
- **Triển khai:** Thay deploy.yml và release.yml do bộ khung sinh bằng trình tự của kho cũ: áp migration, kiểm nhanh chỉ đọc, gọi hook Vercel.
- **Triển khai:** Trong lúc chuyển từng mô-đun: đóng băng phần tương ứng ở kho cũ để hai bên không lệch nhau.
- **Triển khai:** Lúc chuyển: dừng ghi ở kho cũ, kho mới nhận quyền ghi migration, dùng chung OWNER_PHONE_KEY, BETTER_AUTH_SECRET, JOB_SECRET, ANTHROPIC_API_KEY, đổi đích của lịch pg_cron lead-tick, rồi đổi tên miền quyhang.onehub.center.
- **Triển khai:** Đường lùi: giữ dự án Vercel cũ sống và không đổi lược đồ trong giai đoạn quan sát sau khi chuyển, để trỏ tên miền lại được ngay.
- **Quyền của agent:** Cài Acceptance-Gate Kit bằng acceptance-init và ánh xạ T1/T2/T3 của kit vào governance/autonomy.yaml để chỉ có một thang rủi ro. Người sửa tệp này vì agent bị chặn ở governance/.
- **Quyền của agent:** Trong ánh xạ đó, xếp mức cao cho bộ kiểm rò rỉ, che dữ liệu, trần lớp dữ liệu, thoả thuận, migration; bản mẫu để test ở mức agent tự gộp được.
- **Quyền của agent:** Bảo vệ nhánh như kho cũ: chỉ bắt buộc check xanh, chưa bắt buộc code owner duyệt vì kho chỉ có một chủ và GitHub không cho tự duyệt. Việc ký duyệt nằm ở Acceptance-Gate Kit.

## Quyết định

- **Bối cảnh:** Sản phẩm giữ nguyên, bốn bất biến là ràng buộc.
- **Tổ chức kho:** Một kho, một gói, giấy phép riêng tư.
- **Kiến trúc:** Một khối chia 13 mô-đun theo miền nghiệp vụ.
- **AI trong sản phẩm:** Mức một lần gọi cho đường nhập dữ liệu.
- **Ngôn ngữ và khung:** TypeScript, Node 24, khung ts-node.
- **Từ vựng và dữ liệu:** Năm khái niệm khởi đầu, chuẩn RESO DD 2.1.
- **Chất lượng:** Mức team.
- **Triển khai:** Đích Vercel và Supabase, chưa dựng.
- **Quyền của agent:** Claude Code tại máy, người duyệt.

Chi tiết và phương án bị loại ở `wiki/decisions/`.

## Bước tiếp theo

Hỏi Claude: «Lập kế hoạch chuyển mô-đun `agreements` từ onehub-quy-hang sang đây». Mô-đun này ít phụ thuộc và giữ bất biến quan trọng nhất.
Không hiểu một tệp thì hỏi: «Giải thích tệp này làm gì và tôi có cần sửa không».
