// Structure check of the recipe set (roadmap row 1f): every region state of design/states.md has exactly one recipe,
// and every recipe can be proven red. Pure functions; the unit test reads the real files and edited copies.
import type { Recipe } from "./recipes";

const LIST = /Các trạng thái vùng \(([^)]*)\)/;

const norm = (s: string) => s.trim().toLocaleLowerCase("vi");

/** Region states named by design/states.md, in its order (the list in «Các trạng thái vùng (…)»). */
export function regionStates(statesMd: string): string[] {
  const m = LIST.exec(statesMd);
  if (!m) throw new Error("design/states.md: khong tim thay danh sach 'Các trạng thái vùng (…)'");
  return (m[1] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Problems of the recipe set against design/states.md; empty when it is complete. */
export function checkRecipes(recipes: readonly Recipe[], statesMd: string): string[] {
  const problems: string[] = [];
  const tableRows = new Set(
    [...statesMd.matchAll(/^\|\s*([^|]+?)\s*\|/gm)].map((m) => norm(m[1] ?? "")),
  );
  for (const state of regionStates(statesMd)) {
    if (!tableRows.has(norm(state)))
      problems.push(`trang thai vung khong co dong trong bang: ${state}`);
    const owners = recipes.filter((r) => r.state !== undefined && norm(r.state) === norm(state));
    if (owners.length === 0) problems.push(`thieu cong thuc: ${state}`);
    if (owners.length > 1) problems.push(`nhieu cong thuc cho: ${state}`);
  }
  const ids = new Set<string>();
  for (const r of recipes) {
    if (ids.has(r.id)) problems.push(`trung id cong thuc: ${r.id}`);
    ids.add(r.id);
    if (r.breaks.length === 0) problems.push(`cong thuc ${r.id}: thieu cach pha`);
    for (const b of r.breaks) {
      if (!(b.message instanceof RegExp) || b.message.source.length < 4) {
        problems.push(`cong thuc ${r.id}: cach pha "${b.name}" thieu thong diep ghim`);
      }
      if (!b.before && !b.apply)
        problems.push(`cong thuc ${r.id}: cach pha "${b.name}" khong pha gi`);
    }
    if (/\.goto\(/.test(r.check.toString())) problems.push(`cong thuc ${r.id}: tu mo trang`);
  }
  return problems;
}
