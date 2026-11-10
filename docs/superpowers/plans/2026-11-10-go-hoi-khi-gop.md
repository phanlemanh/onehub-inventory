# Gỡ bước hỏi khi gộp: kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gộp PR thường không còn hiện hộp xin phép, bốn kiểu gộp trái nếp vẫn hỏi.

**Architecture:** Đổi danh sách hỏi trong cấu hình quyền của kho và thêm một bộ kiểm đọc đúng tệp đó. Bộ kiểm có hàm so khớp luật với lệnh theo cú pháp của công cụ quyền và hàm liệt kê vi phạm, để cùng một đường code chạy trên tệp thật và trên bản sao bị phá.

**Tech Stack:** Vitest, TypeScript, JSON.

**Spec:** `docs/superpowers/specs/2026-11-10-go-hoi-khi-gop-design.md`, `_acceptance/go-hoi-khi-gop/contract.md`, `_acceptance/go-hoi-khi-gop/evals.yaml`

## Global Constraints

- Bản gốc để so là commit `84a2d597`.
- Danh sách cấm giữ 16 dòng, danh sách cho phép giữ 15 dòng, đúng thứ tự.
- Bộ kiểm có đúng 47 ca: 6 gộp thường, 16 kiểu trái nếp, 2 luật hỏi giữ lại, 2 danh sách giữ nguyên, 8 đối chứng so khớp, 13 tệp lành và bản phá.
- Không chép số thật hay tên người vào tệp kiểm.

## Review Focus

- Luật viết dạng cũ `:*` được thêm lại vào danh sách hỏi: phải bị coi là khớp lệnh gộp thường (đối chứng so khớp ở Task 1).
- Cờ đứng ở cuối lệnh, không có khoảng trắng theo sau: phải khớp luật hỏi (ma trận 16 ca ở Task 1).

---

### Task 1: Bộ kiểm quyền và đổi danh sách hỏi

**Files:**

- Create: `tests/permissions.test.ts`
- Modify: `.claude/settings.json:39`
- Modify: `wiki/log.md`

**Interfaces:**

- Produces: `ruleMatches(rule: string, command: string): boolean`, `violations(permissions: Permissions): string[]`, cả hai nằm trong tệp kiểm.

- [ ] **Step 1: Viết bộ kiểm**

`ruleMatches` chỉ xét luật dạng `Bash(...)`. Hậu tố `:*` nghĩa là tiền tố kèm ranh giới từ, tương đương ` *`. Dấu `*` khớp chuỗi bất kỳ, kể cả rỗng; ` *` ở cuối cũng khớp khi không còn gì sau tiền tố. Đường dẫn tệp suy từ `import.meta.url`.

Bảng đối chứng 8 cặp (luật, lệnh, kết quả):

```text
Bash(gh pr merge:*)        | gh pr merge 6 --merge    | true
Bash(gh pr merge:*)        | gh pr mergefoo           | false
Bash(gh pr merge *--auto*) | gh pr merge --auto       | true
Bash(gh pr merge *--auto*) | gh pr merge 6 --auto -m  | true
Bash(gh pr merge *--auto*) | gh pr merge 6 --merge    | false
Bash(gh pr merge *--admin *) | gh pr merge 6 --admin  | false
Read(./.env)               | cat .env                 | false
Bash(git status:*)         | git status               | true
```

`violations` trả về các chuỗi đúng khuôn: `plain merge still asks`, `off-policy merge not asked: <cờ>`, `kept ask rule missing: gh pr review`, `kept ask rule missing: gh release create`, `deny list changed`, `allow list changed`. Dùng 6 lệnh của E1, 16 lệnh của E2, bản chép 16 dòng cấm và 15 dòng cho phép từ commit gốc.

12 bản phá lấy dữ liệu từ tệp thật, kê đúng như E5 trong `evals.yaml`, mỗi bản khẳng định `violations` chứa đúng thông điệp của chỗ đó. Bản thêm lại luật cũ dùng nguyên dòng `Bash(gh pr merge:*)`. Thêm một ca khẳng định tệp lành cho 0 vi phạm, và khẳng định độ dài ma trận là 6 và 16.

- [ ] **Step 2: Chạy, phải đỏ**

Run: `npx vitest run tests/permissions.test.ts`
Expected: FAIL, ca gộp thường báo khớp luật hỏi, và các ca `--auto`, `--admin`, `--squash`, `--rebase` thiếu luật riêng vẫn xanh vì luật cũ còn che. Ca tệp lành báo `plain merge still asks`.

- [ ] **Step 3: Đổi danh sách hỏi trong `.claude/settings.json`**

```json
"ask": [
  "Bash(gh pr merge *--auto*)",
  "Bash(gh pr merge *--admin*)",
  "Bash(gh pr merge *--squash*)",
  "Bash(gh pr merge *--rebase*)",
  "Bash(gh pr review --approve:*)",
  "Bash(gh release create:*)"
]
```

- [ ] **Step 4: Chạy, phải xanh**

Run: `npx vitest run tests/permissions.test.ts`
Expected: `Tests 47 passed (47)`

- [ ] **Step 5: Thêm một dòng vào đầu danh sách của `wiki/log.md`, chạy `make format`, commit**

```bash
git add .claude/settings.json tests/permissions.test.ts wiki/log.md
git commit -m "chore: stop asking before a plain merge"
```

- [ ] **Step 6: Kiểm toàn kho**

Run: `make check`
Expected: exit 0.
