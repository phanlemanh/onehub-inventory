// AC-6: on a linked copy of the repository, the design-assembly check is green as committed, and
// red, naming the component, once a component is added that the register does not list.
// Usage: node new-component.mjs --root <repository>
import path from "node:path";
import { exit, stdout } from "node:process";

import { linkedCopy, option, runCheck } from "./linked-copy.mjs";

const root = path.resolve(option("--root", "."));
const probe = "src/components/candidate/changed-probe.tsx";
const expected = "ChangedProbe is not in the file";

const sound = linkedCopy(root);
const broken = linkedCopy(root, {
  [probe]: "export function ChangedProbe() {\n  return <div />;\n}\n",
});
try {
  const green = runCheck(sound.dir);
  const red = runCheck(broken.dir);
  stdout.write(`as committed: exit ${green.code}\n`);
  stdout.write(`with ChangedProbe added: exit ${red.code}\n`);
  if (green.code !== 0) {
    stdout.write(`new component: not green as committed\n${green.out}`);
    exit(1);
  }
  if (red.code === 0 || !red.out.includes(expected)) {
    stdout.write(`new component: not red with ChangedProbe added, or without "${expected}"\n${red.out}`);
    exit(1);
  }
  stdout.write("new component: green as committed, red with ChangedProbe added\n");
} finally {
  sound.remove();
  broken.remove();
}
