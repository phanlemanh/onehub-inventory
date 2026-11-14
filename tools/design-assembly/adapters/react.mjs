// The source adapter for React: the libraries a React screen could show a toast with, and the page
// that draws a component of the repository once per option.
export const adapter = {
  id: "react",
  kind: "source",
  names: ["react", "react-dom", "sonner", "react-hot-toast", "react-toastify"],
  toastModules: ["sonner", "react-hot-toast", "react-toastify"],
  harness,
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
