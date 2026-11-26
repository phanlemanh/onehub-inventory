const CALLS = new Set(["cn", "clsx", "cva"]);

const isString = (node) => node?.type === "Literal" && typeof node.value === "string";

function isPartialTemplate(node) {
  const texts = node.quasis.map((q) => q.value.cooked ?? q.value.raw);
  return node.expressions.some((_, i) => {
    const before = texts[i];
    const after = texts[i + 1];
    return (before !== "" && !/\s$/.test(before)) || (after !== "" && !/^\s/.test(after));
  });
}

// The operands of a chain of `+`, left to right.
function operands(node) {
  return node.type === "BinaryExpression" && node.operator === "+"
    ? [...operands(node.left), ...operands(node.right)]
    : [node];
}

// A string joined to a value with `+` and no space between them: `"text-" + tone`.
function isPartialConcat(node) {
  const parts = operands(node);
  if (!parts.some(isString)) return false;
  return parts.some((part, i) => {
    if (isString(part)) return false;
    const before = parts[i - 1];
    const after = parts[i + 1];
    return (
      (isString(before) && before.value !== "" && !/\s$/.test(before.value)) ||
      (isString(after) && after.value !== "" && !/^\s/.test(after.value))
    );
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
      if (!node) return;
      switch (node.type) {
        case "TemplateLiteral":
          if (isPartialTemplate(node)) context.report({ node, messageId: "partial" });
          break;
        case "BinaryExpression":
          if (isPartialConcat(node)) context.report({ node, messageId: "partial" });
          break;
        // Each branch of a choice is a class name of its own.
        case "ConditionalExpression":
          check(node.consequent);
          check(node.alternate);
          break;
        case "LogicalExpression":
          check(node.left);
          check(node.right);
          break;
        default:
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
