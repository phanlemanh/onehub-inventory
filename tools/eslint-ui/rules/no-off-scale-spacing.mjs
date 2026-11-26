import { classStringVisitor, tokenize } from "../lib/class-strings.mjs";

// Tailwind's default spacing steps. Version 4 accepts any multiple of 0.25, so h-9.25 is valid CSS
// and would bring back the drift that banning h-[37px] removes.
const SCALE = new Set(
  "0 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 52 56 60 64 72 80 96".split(
    " ",
  ),
);
const NAMES =
  "(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|w|h|size|(?:min|max)-[wh]|inset(?:-[xy])?|top|right|bottom|left|start|end|basis|scroll-[mp][xytrblse]?)";
const UTILITY = new RegExp(`^${NAMES}-(\\d+(?:\\.\\d+)?)$`);
// A value in brackets (p-[13px], w-[calc(100%-1rem)]) is off every step, whatever it says.
const ARBITRARY = new RegExp(`^${NAMES}-\\[.+\\]$`);

export default {
  meta: {
    type: "problem",
    docs: { description: "Spacing and sizing stay on Tailwind's default steps." },
    messages: {
      offScale:
        "'{{token}}' is off the spacing scale: use a default Tailwind step such as 9 or 10.",
      arbitrary:
        "'{{token}}' writes its own value, off the spacing scale: use a default Tailwind step such as 3 or 4.",
    },
    schema: [],
  },
  create(context) {
    return classStringVisitor(context, (value, node) => {
      for (const { raw, base } of tokenize(value)) {
        if (ARBITRARY.test(base)) {
          context.report({ node, messageId: "arbitrary", data: { token: raw } });
          continue;
        }
        const match = UTILITY.exec(base);
        if (match && !SCALE.has(match[1])) {
          context.report({ node, messageId: "offScale", data: { token: raw } });
        }
      }
    });
  },
};
