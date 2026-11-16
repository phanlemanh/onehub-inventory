// Row 1u, E8b (AC-8, machine part): the release proposal names the secret, exactly three read-write permissions and
// no permission on workflow files, and quotes the error line the design doc pinned. Two-way on in-memory copies.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv.includes("--root") ? process.argv[process.argv.indexOf("--root") + 1] : ".";
const PROPOSAL = readFileSync(join(root, "_acceptance/don-no-bo-kiem/release-de-xuat.md"), "utf8");
const DESIGN = readFileSync(join(root, "docs/superpowers/specs/2026-11-15-don-no-bo-kiem-design.md"), "utf8");
const WANT = ["Contents", "Pull requests", "Issues"];
const pinned = /`(release-please failed: [^`]+)`/.exec(DESIGN.replace(/\n\s+/g, " "))?.[1];

function check(text) {
  const p = [];
  if (!text.includes("`RELEASE_PLEASE_TOKEN`")) p.push("release-de-xuat: thieu ten khoa RELEASE_PLEASE_TOKEN");
  const granted = [...text.matchAll(/\*\*([A-Za-z ]+): Read and write\*\*/g)].map((m) => m[1]);
  for (const w of WANT) if (!granted.includes(w)) p.push(`release-de-xuat: thieu quyen ${w}`);
  for (const g of granted) if (!WANT.includes(g)) p.push(`release-de-xuat: quyen thua ${g}`);
  const block = /```text\n([^\n]+)\n```/.exec(text)?.[1];
  if (!pinned || block !== pinned) p.push("release-de-xuat: dong loi khong khop design doc");
  return p;
}

const real = check(PROPOSAL);
const cases = [
  [PROPOSAL.replace("**Issues: Read and write**", "Issues"), "release-de-xuat: thieu quyen Issues"],
  [PROPOSAL.replace("**Contents: Read and write**", "**Contents: Read and write** · **Workflows: Read and write**"), "release-de-xuat: quyen thua Workflows"],
  [PROPOSAL.replace("not permitted to create", "not allowed to create"), "release-de-xuat: dong loi khong khop design doc"],
];
const out = [...real];
for (const [text, msg] of cases) if (!check(text).includes(msg)) out.push(`release-de-xuat: ban sao khong do: ${msg}`);
if (out.length) {
  console.log(out.join("\n"));
  process.exit(1);
}
console.log("release-de-xuat: khoa RELEASE_PLEASE_TOKEN, ba quyen doc-ghi, dong loi khop");
