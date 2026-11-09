import rule from "../../tools/eslint-ui/rules/no-partial-class.mjs";
import { tester, assertMessages } from "../test-utils.mjs";

tester.run("no-partial-class", rule, {
  valid: [
    { code: "const a = <p className={`${x} ${y}`} />;" },
    { code: "const a = <p className={`p-4 ${x}`} />;" },
    { code: 'const a = <p className={cn("p-4", x)} />;' },
    { code: "const url = `/s/${id}`;" },
  ],
  invalid: [
    { code: "const a = <p className={`p-${x}`} />;", errors: [{ messageId: "partial" }] },
    { code: "const c = cn(`${x}-500`);", errors: [{ messageId: "partial" }] },
  ],
});
assertMessages(rule, { partial: "whole class" });
