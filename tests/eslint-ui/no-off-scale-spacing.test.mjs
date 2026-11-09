import rule from "../../tools/eslint-ui/rules/no-off-scale-spacing.mjs";
import { tester, assertMessages } from "../test-utils.mjs";

tester.run("no-off-scale-spacing", rule, {
  valid: [
    { code: 'const c = "h-9 w-10 p-3.5 mt-0.5 -ml-2 md:gap-6";' },
    { code: 'const c = "w-full max-w-2xl h-screen w-1/2 text-sm";' },
    { code: 'const c = "see section 13";' },
  ],
  invalid: [
    { code: 'const c = "h-9.25";', errors: [{ messageId: "offScale" }] },
    { code: 'const a = <p className="md:w-27.5" />;', errors: [{ messageId: "offScale" }] },
    { code: 'const c = "-mt-13";', errors: [{ messageId: "offScale" }] },
  ],
});
assertMessages(rule, { offScale: "spacing scale" });
