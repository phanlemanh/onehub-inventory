# Số đo mỗi vòng — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một lệnh Python ghi bản số đo của từng vòng, kiểm vòng giao diện thiếu bản số đo, kiểm mốc ba agent, và gộp báo cáo theo
tầng.

**Architecture:** Một tệp `tools/round_metrics/round_metrics.py` với bốn lệnh con `ghi`, `kiem`, `kiem-moc`, `gop`, chỉ dùng thư
viện chuẩn, nhập `check_problem` của `tools/design_check.py` và `load_yaml_file` của `tools/repo_ontology.py`. Một tệp bài kiểm
vitest `tools/round_metrics/round-metrics.test.ts` gọi lệnh qua `spawnSync("python3", …)` trên kho mẫu trong thư mục tạm và trên
chính kho.

**Tech Stack:** Python 3 (thư viện chuẩn), Vitest, git.

**Spec:** `docs/plan/do-he-design/thiet-ke.md`; hợp đồng `_acceptance/so-do-moi-vong/contract.md`; evals
`_acceptance/so-do-moi-vong/evals.yaml`.

## Global Constraints

- Mười một tầng, đúng thứ tự: `bai-kiem-ha-tang`, `trang-thai-hanh-vi`, `du-lieu-api`, `nghiep-vu`, `thanh-phan`, `bo-cuc`,
  `hop-dong-yeu-cau`, `link`, `chu-dinh-dang`, `mau-token`, `truy-cap`.
- Tầng bỏ khỏi «phần đổi sản phẩm»: `bai-kiem-ha-tang`, `hop-dong-yeu-cau`.
- Trạng thái đòi bản số đo: `verified`, `machine-cleared`, `signed-off`, `da-cham-boi-thuc-te`. Bảy trạng thái để kê:
  `draft`, `approved`, `implemented` cộng bốn trạng thái trên.
- Vòng giao diện: `surfaces` chứa `ui`, `web` hoặc `web-ui`, hoặc thư mục hồ sơ có `design-pass.md`.
- Mọi lệnh nhận `--root <thư mục>`, mặc định là gốc kho suy từ vị trí tệp (`Path(__file__).resolve().parents[2]`).
- Thông điệp ghim (không dấu, để so chuỗi): `chua phan tang: r<N>`, `ban so do cu: <a> luot, so chay co <b>`,
  `can dung 3 agent`, `tep phuong an trung`, `tep phuong an rong`, `thieu bang so`, `cau giao khac de bai: agent <N>`,
  `commit khong co`, `do sau khi 1a gop`, `ban kho co san phuong an`, `kho nong: bo qua kiem lich su git`, `chua co vong nao`.
- Không sửa tệp ngoài `tools/round_metrics/**`, `docs/plan/do-he-design/**`, `_acceptance/so-do-moi-vong/**`.
- Dữ liệu mẫu trong bài kiểm không mang tên người hay số thật.

## Review Focus

1. Sổ chạy có dòng hỏng JSON hoặc dòng thiếu `round` — lệnh bỏ qua dòng đó, không văng. Bài: `ghi bỏ qua dòng hỏng` ở Task 1.
2. Hồ sơ có `contract.md` không có frontmatter hoặc thiếu `surfaces` — coi là không giao diện, không văng. Bài: ca trong ma
   trận của Task 2.
3. Vòng giao diện có bản số đo nhưng không có `run-log.jsonl` — số lượt trong sổ là 0, bản số đo ghi 0 lượt thì hợp lệ. Bài ở
   Task 2.
4. Thư mục `_acceptance/` có thư mục không phải hồ sơ (ví dụ `README.md`, `config.yaml`) — bỏ qua. Bài: kho thật ở Task 2.
5. `moc.json` hỏng JSON — `kiem-moc` đỏ với tên tệp, không văng. Bài: thêm vào bản phá ở Task 4.

---

### Task 1: Ghi bản số đo một vòng (AC-1, AC-2, AC-3)

**Files:**

- Create: `tools/round_metrics/round_metrics.py`
- Create: `tools/round_metrics/round-metrics.test.ts`

**Interfaces:**

- Produces: `TANG: tuple[str, ...]` (11 tầng); `doc_so_chay(path) -> list[dict]`; `ghi(root, slug, phan: dict[str, list[str]])
-> dict` (bản số đo); lệnh `python3 tools/round_metrics/round_metrics.py ghi --root R --slug S [--phan rN=t1,t2]...`.
- Khuôn `so-do-vong.json`: `{"schema":1,"slug","ghi_luc","vong_cham":int,"luot":[{"vong":int,"verdict":str,"tang":[str]}],
"lam_lai":[{"nguon":"r<N>"|"repin-do:<lan_id>","tang":str}],"theo_tang":{11 khoá:int},"chua_phan":["r<N>"],
"thuoc_vat":{"vat","thuoc","nhat"}|null,"gio_may":{"gio_may","gio_cho","phan_tram_tuan"}|null}`.

- [ ] **Step 1: Viết bài đỏ.** Trong tệp bài kiểm, hàm `kho(…)` dựng thư mục tạm có `_acceptance/<slug>/run-log.jsonl`. Dòng mẫu
      chép nguyên từ sổ chạy thật, mỗi dòng một chú thích nguồn: `round-tally` và `thuoc-vat` từ
      `_acceptance/go-hoi-khi-gop/run-log.jsonl:18,20,36`; `BLOCKED` từ `onehub-quy-hang/_acceptance/bai-thu-luoi-5000-dong/run-log.jsonl:33`;
      `PENDING-JUDGMENT` từ `onehub-quy-hang/_acceptance/bai-thu-zalo/run-log.jsonl:29`; `repin-do` từ
      `onehub-quy-hang/_acceptance/anh-can-ba-ngan/run-log.jsonl:72`; `gio-may` từ
      `onehub-quy-hang/_acceptance/va-khuon-doan-sdt-ranh-gioi/run-log.jsonl`. Chỉ đổi `round` và `verdict`. Bài:
  - `ghi: một lượt REJECT hai tầng, BLOCKED và repin-do` — r1 REJECT, r2 BLOCKED, r3 PASS, một `repin-do`; `--phan
r1=trang-thai-hanh-vi,bo-cuc`; khẳng định `vong_cham==3`, `lam_lai` đúng 4 phần tử như evals E1, tổng `theo_tang`==4, đủ 11
    khoá, `chua_phan==[]`, `thuoc_vat.nhat` và `gio_may.gio_may` bằng số của dòng cuối; bỏ `--phan` thì `chua_phan==["r1"]`.
  - `ghi: lượt chấm lại và PENDING-JUDGMENT` — r1 có dòng REJECT rồi dòng PASS, r2 PENDING-JUDGMENT: `lam_lai==[]`.
  - `ghi lại giữ tầng đã khai` — như E2, cả đối chứng xoá tệp.
  - `ghi từ chối đầu vào sai` — như E3, so băm tệp trước và sau.
  - `ghi bỏ qua dòng hỏng` — một dòng không phải JSON và một dòng `round-tally` thiếu `round`: kết quả như không có hai dòng đó.
- [ ] **Step 2:** `npx vitest run tools/round_metrics --coverage.enabled=false` → FAIL (tệp lệnh chưa có).
- [ ] **Step 3: Viết `ghi`.** Kết quả lượt = `verdict` của dòng `round-tally` cuối cùng mang `round` đó theo thứ tự tệp. `REJECT`
      → một đơn vị mỗi tầng khai; `BLOCKED` → một đơn vị `bai-kiem-ha-tang`; mỗi `repin-do` → một đơn vị `bai-kiem-ha-tang`. Đọc bản
      cũ (nếu có) để giữ tầng đã khai của lượt chưa nhắc trong `--phan`. Lỗi đầu vào → stderr, thoát 1, không ghi. Ghi JSON thụt 2,
      khoá theo thứ tự cố định, có dòng trống cuối tệp.
- [ ] **Step 4:** chạy lại → PASS.
- [ ] **Step 5:** commit `feat(round-metrics): record one round's rework by layer`.

### Task 2: Lưới thiếu bản số đo (AC-4, AC-5 phần `kiem`)

**Files:** Modify `tools/round_metrics/round_metrics.py`, `tools/round_metrics/round-metrics.test.ts`.

**Interfaces:**

- Consumes: `doc_so_chay`, `TANG`.
- Produces: `kiem(root) -> list[str]` (danh sách lỗi); lệnh `kiem --root R` in mỗi lỗi một dòng `<slug>: <lý do> — chạy:
python3 tools/round_metrics/round_metrics.py ghi --slug <slug>`, thoát 1 nếu có lỗi, thoát 0 kèm `kiem: <n> vong giao dien, du
ban so do` nếu không.

- [ ] **Step 1: Bài đỏ.**
  - `kiem: ma trận trạng thái và loại hồ sơ` — ma trận viết trước 7 trạng thái × 3 loại, `expect(o.length).toBe(21)`, đúng 8 ô đỏ,
    mỗi ô đỏ có tên hồ sơ và `round_metrics.py ghi --slug <slug>`; hồ sơ `signed-off` giao diện thiếu bản số đo luôn đỏ.
  - Ba ca thông điệp ghim: `chua phan tang: r1`; `ban so do cu: 2 luot, so chay co 3`; bản hợp lệ thì xanh. Bản số đo hợp lệ
    sinh bằng chính `ghi` của Task 1, không viết tay.
  - Review Focus 2 và 3: hợp đồng không frontmatter thì xanh; vòng giao diện `verified` không có sổ chạy, bản ghi 0 lượt thì xanh.
  - `kho thật: kiem và kiem-moc xanh` (phần `kiem`): `--root` = gốc kho suy từ `import.meta.url`; thoát 0.
  - `kho thật: thêm vòng giao diện verified thì đỏ` — chép `_acceptance/` và `docs/plan/do-he-design/` sang thư mục tạm, thêm hồ sơ
    `surfaces: [ui]`, `status: verified`; thoát 1, gọi tên hồ sơ.
- [ ] **Step 2:** chạy → FAIL.
- [ ] **Step 3:** viết `kiem`. Đọc frontmatter bằng regex `^---\n(.*?)\n---` (không cần YAML đủ); `surfaces` dạng `[a, b]`.
- [ ] **Step 4:** chạy → PASS.
- [ ] **Step 5:** commit `feat(round-metrics): fail when a UI round has no measurement record`.

### Task 3: Báo cáo theo tầng (AC-6, AC-7)

**Files:** Modify hai tệp trên.

**Interfaces:**

- Consumes: `TANG`; `design_check.check_problem(root, ident, check) -> str | None`; `repo_ontology.load_yaml_file`.
- Produces: `gop(root) -> dict` khuôn `{"vong":int,"luot_cham_tb":float|null,"tong":int,"lam_lai":[{"tang","so","pt_tat_ca",
"pt_doi_san_pham"|null,"pt_quy_hang"}],"quyet_dinh":[{"tang","co_kiem","tong"}],"quyet_dinh_tong":{"co_kiem","tong"},
"moc":dict|null}`; lệnh `gop --root R [--json]`. Phần trăm làm tròn một chữ số thập phân. Không bản số đo nào → khối làm lại in
  `chua co vong nao`.

- [ ] **Step 1: Bài đỏ.** `gop: làm lại theo tầng` (như E6, hai bản số đo sinh bằng `ghi`); `mốc Quỹ hàng khớp 0019` (đọc tệp thật:
      khoá đúng 11 tầng, tổng 199, `round(100*v/199)` = 55, 15, 5, 0 cho bốn tầng nêu ở E6); `gop: quyết định có kiểm theo tầng`
      (kho thật: tổng bằng hai số của dòng `determinism: a/b` do `python3 tools/design_check.py` in; kho mẫu hai quyết định cùng tầng
      ra `1/2`).
- [ ] **Step 2:** chạy → FAIL.
- [ ] **Step 3:** viết `gop`. Thêm `tools/` vào `sys.path` để nhập `design_check`. Bản chữ: ba khối, khối một là bảng 11 dòng
      `tầng · số · % tất cả · % đổi sản phẩm · % Quỹ hàng`.
- [ ] **Step 4:** chạy → PASS.
- [ ] **Step 5:** commit `feat(round-metrics): report rework and checked decisions by layer`.

### Task 4: Kiểm mốc ba agent (AC-8, AC-5 phần `kiem-moc`)

**Files:** Modify hai tệp trên.

**Interfaces:**

- Consumes: `gop` (khối `moc`).
- Produces: `kiem_moc(root) -> tuple[list[str], list[str]]` (lỗi, ghi chú); lệnh `kiem-moc --root R`. Mốc mới nhất = thư mục
  `docs/plan/do-he-design/moc-*` lớn nhất theo tên. Khối `moc` của `gop`: `{"thu_muc","commit","giong","giong_mang_loi","lech",
"tu_doan":[{"so","he","san_pham"}]}` lấy từ `ket_qua.bat_buoc` và `agent` của `moc.json`.

- [ ] **Step 1: Bài đỏ.** `kiem-moc: mốc thật xanh và sáu lần phá` — mốc thật thoát 0; mỗi bản sao (chép `docs/plan/do-he-design/`
      vào một kho git tạm có lịch sử) phá một điều kiện, thoát 1 với thông điệp ghim của Global Constraints, gồm cả `moc.json` hỏng
      JSON; hai bản cần lịch sử (`do sau khi 1a gop`, `ban kho co san phuong an`) dựng commit có tệp tương ứng rồi trỏ `commit` vào
      đó. `kho thật lấy nông: kiem-moc vẫn chạy` — `git clone --depth 1 file://<gốc kho>` vào thư mục tạm, thoát 0 kèm
      `kho nong: bo qua kiem lich su git`; trên cùng bản nông, sửa câu đã gửi của `agent-2.md` thì vẫn đỏ. `gop --json` có khối
      `moc` khớp `moc.json`.
- [ ] **Step 2:** chạy → FAIL.
- [ ] **Step 3:** viết `kiem_moc`. So câu giao: lấy các dòng `> ` dưới tiêu đề `## Câu giao` của đề bài và dưới
      `## Câu giao đã gửi` của từng `agent-N.md`, bỏ tiền tố `>`, gộp mọi khoảng trắng thành một dấu cách, thay `<bản kho>` bằng
      `ban_kho`, rồi so bằng nhau. Lịch sử: `git -C root cat-file -e <commit>^{commit}`; thất bại và
      `git rev-parse --is-shallow-repository` là `true` → ghi chú `kho nong…`, bỏ ba điều kiện lịch sử; không nông → lỗi
      `commit khong co`. 1a: `git show <commit>:_acceptance/khung-va-giao-dien/contract.md` có `status: signed-off` hay
      `machine-cleared` → `do sau khi 1a gop`. Thư mục mốc: `git cat-file -e <commit>:docs/plan/do-he-design/<thư mục mốc>` thành
      công → `ban kho co san phuong an`.
- [ ] **Step 4:** chạy → PASS; rồi `make check` → xanh.
- [ ] **Step 5:** commit `feat(round-metrics): check the three-agent baseline`.

Các task phụ thuộc nhau theo thứ tự (cùng hai tệp): `independent: false` cho cả bốn. Verify mỗi task: lệnh vitest ở Step 2/4;
cuối Task 4 thêm `make check`.
