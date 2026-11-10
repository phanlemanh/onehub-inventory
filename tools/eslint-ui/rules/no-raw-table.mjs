export default {
  meta: {
    type: "problem",
    docs: { description: "Cấm <table> tự dựng; dùng data-grid của ReUI." },
    messages: {
      rawTable: "Bảng tự dựng: dùng data-grid của ReUI thay cho <table>.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type === "JSXIdentifier" && node.name.name === "table") {
          context.report({ node, messageId: "rawTable" });
        }
      },
    };
  },
};
