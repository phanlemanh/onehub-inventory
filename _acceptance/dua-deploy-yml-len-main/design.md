# Đưa tệp tự triển khai Deploy lên main — ghi chú thiết kế

Hồ sơ: `_acceptance/dua-deploy-yml-len-main/`. Ngày 2026-11-28.

## Vấn đề

Hồ sơ `dat-khoa-mot-lenh` (đã ký 2026-11-22) chốt nội dung tệp tự triển khai trong sổ tay vận hành, việc 9 phần hai
(AC-8 của hồ sơ ấy đo khối trong sổ tay). Tệp thật `.github/workflows/deploy.yml` trên main vẫn là tệp khung cũ. Máy
không được gộp thay đổi ở `.github/workflows/`, và tệp phải đúng bản chủ kho đã ký, nên chủ kho tự dán khối vào tệp và mở PR #133. Tệp nằm trong vùng hạng cao (T3,
«đường ra bản thật»), nên bước kiểm cổng đòi một hồ sơ nghiệm thu đã ký trước khi gộp.

## Cách làm

Vòng không viết mã. Nó chỉ chứng ba điều về tệp chủ kho đã dán, rồi trình chữ ký:

1. Tệp bằng đúng khối trong sổ tay (bỏ khoảng trắng cuối dòng), và khối ấy chưa đổi từ lúc ký `dat-khoa-mot-lenh`.
2. Tệp có đúng hai bước: bản thử chỉ chạy khi biến kho `DEPLOY_ENABLED` là `true`; bản thật chờ bản thử và chạy trong môi
   trường `production`, nơi có người duyệt bắt buộc. Tệp phát hành gọi tệp này đúng một lần.
3. Mọi khoá và biến tệp đọc đều có trong bảng biến của sổ tay, và mọi khoá là khoá của môi trường — loại khoá tới được tệp
   được gọi từ tệp phát hành mà không cần chuyển khoá kho xuống; mỗi tên đặt ở đúng môi trường của việc đọc nó.
4. Môi trường `production` trên GitHub thật sự có người duyệt bắt buộc là chủ kho (đọc qua API, chỉ đọc).

Và một điều về PR: ngoài hồ sơ nghiệm thu (và bản đồ sản phẩm máy vẽ lại), PR chỉ đổi tệp ấy.

Đo bằng một tệp đo riêng của hồ sơ (`rang/kiem.py`) với cặp ca xanh/đỏ cho mỗi phép đo, cộng bài kiểm sổ tay sẵn có của
hồ sơ `dat-khoa-mot-lenh` (khối sổ tay truyền đúng tập tên lệnh đưa bản lên đòi) và ba lệnh chung của kho.

## Lối đã loại

- Sửa tệp cho khác khối sổ tay (vd thêm `secrets: inherit` ở tệp phát hành): đổi khối là mở lại hồ sơ đã ký; máy chỉ
  được mở PR, không được gộp thay đổi ở `.github/workflows/`.
- Chạy thử Deploy để chứng tệp chạy được: chạm bản thật và cần khoá chưa đặt xong — việc của chủ kho sau khi gộp.
- Bỏ qua cổng bằng quyền quản trị: chủ kho đã chọn chạy vòng nghiệm thu.

## Giới hạn

Không phép đo nào ở đây chứng tệp chạy đúng trên GitHub Actions; lần chạy thật đầu tiên mới chứng. Phép đo chỉ chứng tệp
khớp bản đã ký và cấu trúc an toàn (bản thật luôn sau bản thử và sau người duyệt).

Vòng không chạm màn hình nào: không có đặc tả UX, không có bản bấm được.
