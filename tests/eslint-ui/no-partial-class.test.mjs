import rule from "../../tools/eslint-ui/rules/no-partial-class.mjs";
import { tester, assertMessages } from "../test-utils.mjs";

tester.run("no-partial-class", rule, {
  valid: [
    { code: "const a = <p className={`${x} ${y}`} />;" },
    { code: "const a = <p className={`p-4 ${x}`} />;" },
    { code: 'const a = <p className={cn("p-4", x)} />;' },
    { code: "const url = `/s/${id}`;" },
    // Joined with + around a space: each class is still whole.
    { code: 'const a = <p className={"p-4 " + x} />;' },
    { code: 'const a = <p className={x + " p-4"} />;' },
    { code: 'const a = <p className={ok ? "p-4" : "p-6"} />;' },
    // Not a class name.
    { code: 'const label = "Tổng " + n;' },
  ],
  invalid: [
    { code: "const a = <p className={`p-${x}`} />;", errors: [{ messageId: "partial" }] },
    { code: "const c = cn(`${x}-500`);", errors: [{ messageId: "partial" }] },
    // The same pieces joined with +.
    { code: 'const a = <div className={"text-" + tone} />;', errors: [{ messageId: "partial" }] },
    {
      code: 'const a = <Button className={"text-" + tone}>a</Button>;',
      errors: [{ messageId: "partial" }],
    },
    { code: 'const c = cn("p-4", tone + "-500");', errors: [{ messageId: "partial" }] },
    {
      code: 'const a = <p className={"p-4 bg-" + tone + " m-2"} />;',
      errors: [{ messageId: "partial" }],
    },
    // Inside a choice, each branch is read.
    {
      code: 'const a = <p className={ok ? "p-4" : "text-" + tone} />;',
      errors: [{ messageId: "partial" }],
    },
    { code: "const a = <p className={ok && `bg-${tone}`} />;", errors: [{ messageId: "partial" }] },
  ],
});
assertMessages(rule, { partial: "whole class" });
