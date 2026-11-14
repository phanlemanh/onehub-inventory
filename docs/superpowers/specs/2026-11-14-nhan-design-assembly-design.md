# Nhận design-assembly — thiết kế

Hồ sơ `_acceptance/nhan-design-assembly/`, hạng T3. Thay đổi đã làm sẵn trên nhánh `chore/adopt-design-assembly`
(PR #58), theo lời cho phép của chủ kho ngày 2026-11-14. Hồ sơ này ghi lại và chấm đúng những gì nhánh đã làm, vì cổng
trước khi gộp của kit đòi một hồ sơ có chữ ký người cho mọi PR đổi đường dẫn T3.

## Vì sao

Sổ quyết định thiết kế của kho (`design/decisions.yaml`) trỏ phần lớn câu lõi tới luật lint và bài kiểm của chính kho,
nhưng không ai chạy lại chúng để chứng rằng chúng còn chặn đúng điều dòng sổ nói. Sổ linh kiện do công cụ viết tay
`tools/design_registry.mjs` ghi theo hình dạng kit nghiệm thu không đọc được, nên kit chưa khai được sổ linh kiện và kho
đứng ở bậc M1. Plugin design-assembly (kho riêng của chủ kho) mang một lệnh kiểm chạy được trong `make check` và một bộ
ghi sổ linh kiện theo hình dạng kit đọc.

## Thay đổi, theo thứ tự trên nhánh

1. **Nhận plugin, chưa có lời đáp nào.** Thư mục công cụ `tools/design-assembly/`, tệp `mk/design-assembly.mk` (một mục
   trong `CHECK_TARGETS`), sổ token `design/tokens.json` sinh từ stylesheet, `design/theme.json` (dữ liệu của lệnh kiểm),
   trang luật `.claude/rules/design-assembly.md`, sáu dòng sổ do lệnh kiểm của plugin giữ.
2. **Ba lời đáp của chủ kho:** ứng dụng, mức AA, giữ màu `--onehub-blue` (#0246ff). Dòng tương phản của màu chính (bốn
   cặp sáng và tối) và ba dòng ghi lời người. Sổ màn mang `version: 1`.
3. **Chạy lại lint của kho.** Lệnh kiểm cho lint của kho đọc những đoạn mã phạm từng quyết định, như thể chúng nằm trong
   một tệp màn; quyết định được giữ khi lint chặn mọi đoạn, và lệnh kiểm chạy lại với các luật đã chặn bị tắt để thấy nó
   đỏ. Chín dòng sổ do luật lint giữ nhận phép kiểm này; dòng sổ không đổi.
4. **Sổ linh kiện do plugin ghi.** `tools/design-assembly/components.mjs` ghi `design/component-registry.json` theo hình
   dạng hợp đồng: mỗi linh kiện xuất ra một mục, có tệp, cấp, nguồn, thuộc tính, biến thể `trục=giá trị`. ReUI là thư
   viện; thư mục `templates` là khuôn. `make gen` ghi lại sổ; `make check` đỏ khi sổ không còn khớp mã nguồn.
   `tools/design_registry.mjs` bị bỏ. Dòng sổ «cấp linh kiện», bài kiểm sổ và skill `inventory-ui` đọc hình dạng mới.
5. **Sửa từ quét mã:** bốn chỗ trong công cụ của plugin thoát ký tự trước khi tìm theo mẫu giờ thoát đủ, kể cả dấu gạch
   chéo ngược.
6. **Hai lần gộp `main`** để gỡ xung đột ở sổ linh kiện và nhật ký; sổ ghi lại từ mã đã gộp.

Phần khai sổ token và sổ linh kiện với kit ở `_acceptance/config.yaml` nằm ở PR #59, gộp sau PR này.

## So sổ mới với sổ cũ

So trên một bản sao của kho (lệnh `make design-ladder` của kho design-assembly), theo tên, 270 linh kiện có ở cả hai:
thuộc tính giống 268, biến thể 262, cấp 269, mười tệp khuôn như nhau. 64 tên chỉ sổ cũ có đều không phải linh kiện: 34
hằng số viết hoa, 30 kiểu dữ liệu. Chỗ khác có tên: `CascaderItem` (sổ cũ không đọc hàm bọc ghi nhớ), `aria-describedby`
(sổ cũ ghi kèm dấu ngoặc kép), tám linh kiện có thuộc tính nhận danh sách chữ mà sổ mới ghi thêm vào biến thể,
`DataRegion` (khuôn theo trang kiểu màn «lưới», sổ cũ xếp organism). Phép so nằm ở kho kia, không phải tiêu chí của hồ
sơ này; hồ sơ chấm những gì kho này giữ được bằng lệnh của nó.

## Phép đo mới của hồ sơ

Ba kịch bản đo nằm ở `_acceptance/nhan-design-assembly/rang/`, ngoài vùng công cụ của kho:

- `so-quyet-dinh-giu.mjs` — mọi dòng sổ quyết định có ở commit trước khi nhận (`1226ec5`) còn nguyên từng byte, trừ đúng
  dòng «cấp linh kiện», mà phép trỏ đổi sang công cụ mới;
- `lint-chay-lai.mjs` — dữ liệu của lệnh kiểm có đúng chín phép kiểm lint, cho đúng chín quyết định đã kê, mỗi phép trỏ
  cùng luật dòng sổ nêu;
- `sinh-lai-so.sh` — công cụ cũ không còn, `make gen` gọi công cụ mới, ghi lại sổ từ mã thì không khác bản đã commit.

Mỗi kịch bản có cặp hai chiều trên cùng một bản: bản lành xanh, bản bị phá đỏ với thông điệp ghim
(`rang/rang.test.mjs`).

## Không làm

- Không sửa hai luật lint còn để lọt đoạn mã phạm (tên lớp ghép bằng dấu cộng; ngoại lệ lint không lý do cho luật ngoài
  `onehub-ui/` và tắt mọi luật cho cả tệp). Đó là việc của chủ kho, trong một vòng khác.
- Không khai với kit trong PR này (PR #59).
- Không đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.
