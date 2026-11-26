import rule from "../../tools/eslint-ui/rules/no-off-scale-spacing.mjs";
import { tester, assertMessages } from "../test-utils.mjs";

tester.run("no-off-scale-spacing", rule, {
  valid: [
    { code: 'const c = "h-9 w-10 p-3.5 mt-0.5 -ml-2 md:gap-6";' },
    { code: 'const c = "w-full max-w-2xl h-screen w-1/2 text-sm";' },
    { code: 'const c = "see section 13";' },
    // Brackets on a utility that is not spacing or sizing are another rule's business.
    { code: 'const c = "grid-cols-[1fr_auto] text-[13px]";' },
  ],
  invalid: [
    { code: 'const c = "h-9.25";', errors: [{ messageId: "offScale" }] },
    { code: 'const a = <p className="md:w-27.5" />;', errors: [{ messageId: "offScale" }] },
    { code: 'const c = "-mt-13";', errors: [{ messageId: "offScale" }] },
    // A value in brackets is off every step, whatever it says.
    { code: 'const a = <div className="p-[13px]" />;', errors: [{ messageId: "arbitrary" }] },
    { code: 'const c = "gap-[7px]";', errors: [{ messageId: "arbitrary" }] },
    { code: 'const c = "md:-mt-[3px]";', errors: [{ messageId: "arbitrary" }] },
    { code: 'const c = "w-[calc(100%-1rem)]";', errors: [{ messageId: "arbitrary" }] },
  ],
});
assertMessages(rule, { offScale: "spacing scale", arbitrary: "spacing scale" });
