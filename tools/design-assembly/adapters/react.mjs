// The source adapter for React: the libraries a React screen could show a toast with, and the page
// that draws a component of the repository once per option.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// Whether the repository draws its screens with React: its packages name it.
function present(root) {
  try {
    const data = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    return "react" in { ...data.dependencies, ...data.devDependencies };
  } catch {
    return existsSync(path.join(root, "node_modules/react/package.json"));
  }
}

export const adapter = {
  id: "react",
  kind: "source",
  present,
  names: ["react", "react-dom", "sonner", "react-hot-toast", "react-toastify"],
  toastModules: ["sonner", "react-hot-toast", "react-toastify"],
  harness,
  probe: {
    // A screen file that draws `body`, with a word and a number it may build from. The control is
    // the same file drawing nothing that breaks a decision.
    file: (body, imports = "") =>
      `${imports}export function Probe({ tone, n }: { tone: string; n: number }) {\n  return ${body};\n}\n`,
    control: "<div />",
    importOf: (name, from) => `import { ${name} } from "${from}";\n\n`,
    withClass: (value) => `<div className="${value}" />`,
    component: (name, attribute) => `<${name} ${attribute}>a</${name}>`,
    classAttribute: (value) => `className="${value}"`,
    // A class name built in pieces, which no tool can read whole.
    pieces: (start) => [`className={"${start}" + tone}`, `className={\`${start}\${tone}\`}`],
    element: (attribute) => `<div ${attribute} />`,
    breaking: {
      "raw-controls": [
        '<button type="button">a</button>',
        "<input />",
        "<select />",
        "<textarea />",
      ],
      "raw-table": ["<table />"],
      "no-inline-style": ['<div style={{ color: "red" }} />'],
      "format-number-date": [
        "<p>{n.toLocaleString()}</p>",
        "<p>{new Intl.NumberFormat().format(n)}</p>",
        "<p>{new Date(n).toLocaleDateString()}</p>",
      ],
    },
  },
};

// The page's code: it loads a component through `importModule`, an expression of the build
// adapter that takes the file's address in `address`, and draws it once per option, each in its
// own root, so one that cannot stand alone fails by itself.
function harness(importModule) {
  return `
import React from "react";
import { createRoot } from "react-dom/client";
class Catch extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {}
  render() { return this.state.failed ? null : this.props.children; }
}
const mount = (slot, Component, props, text) => {
  const root = createRoot(slot);
  root.render(React.createElement(Catch, null, React.createElement(Component, props, text)));
  return () => root.unmount();
};
const load = (address) => ${importModule};
`;
}
