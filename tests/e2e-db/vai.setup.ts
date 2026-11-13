// The role sessions of the role × screen suite (roadmap row 9b, AC-3): the sample company, one person per role and
// the witness are written once, each role signs in once through the shared door, and the browser state is kept.
// The test also writes the steps the suite must run into the report, so tests/e2e-db/vai-man-doi-chieu.mjs can compare
// them with what ran (AC-2).
import { test as setup } from "@playwright/test";

import { makeSampleCompany, roleSession, rolePerson, ROLES, signInWithCode } from "./dang-nhap-vai";
import { pairs, pairsAt, SIZES, stepName, type Pair } from "./vai-man";

/** The step a pair's check is named by. */
export const WHAT: Record<Pair["expect"], string> = {
  "duoc-vao": "duoc vao",
  chan: "khong du quyen",
  "day-ve-hom-nay": "day ve hom nay",
};

setup("dang nhap bon vai", async ({ browser }, info) => {
  await makeSampleCompany();
  for (const role of ROLES) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await signInWithCode(page, rolePerson(role).email);
    await context.storageState({ path: roleSession(role) });
    await context.close();
  }
  console.log(`cua dang nhap: ${ROLES.length} vai, ${ROLES.length} lan dang nhap`);
  const all = pairs().pairs;
  const steps = SIZES.flatMap((size) =>
    pairsAt(all, size).map((p) => stepName(p, size, WHAT[p.expect])),
  );
  info.annotations.push({
    type: "vai-man-mong",
    description: JSON.stringify({ pairs: all.length, steps }),
  });
});
