const CALLS = new Set(["cn", "clsx", "cva"]);

function isPartial(node) {
  const texts = node.quasis.map((q) => q.value.cooked ?? q.value.raw);
  return node.expressions.some((_, i) => {
    const before = texts[i];
    const after = texts[i + 1];
    return (before !== "" && !/\s$/.test(before)) || (after !== "" && !/^\s/.test(after));
  });
}

export default {
  meta: {
    type: "problem",
    docs: { description: "A class name is written whole, so Tailwind and lint can see it." },
    messages: {
      partial:
        "A class built from pieces is invisible to Tailwind and lint: map each case to a whole class.",
    },
    schema: [],
  },
  create(context) {
    const check = (node) => {
      if (node?.type === "TemplateLiteral" && isPartial(node)) {
        context.report({ node, messageId: "partial" });
      }
    };
    return {
      JSXAttribute(node) {
        if (node.name.name === "className" && node.value?.type === "JSXExpressionContainer") {
          check(node.value.expression);
        }
      },
      CallExpression(node) {
        if (node.callee.type === "Identifier" && CALLS.has(node.callee.name)) {
          node.arguments.forEach(check);
        }
      },
    };
  },
};
