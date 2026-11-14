// The build adapter for Vite: the repository's own development server, taken from its packages,
// serving extra modules beside the repository's and changing a module as it is served, never on
// disk.
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const adapter = {
  id: "vite",
  kind: "build",
  names: ["vite", "@vitejs"],
  // A module imported by an address only known while the page runs.
  importExpression: (address) => `import(/* @vite-ignore */ ${address})`,
  serve,
};

// Opens the server: `require` resolves from the repository. Returns the origin, a way to load one of
// its modules as its build would, and a way to close.
async function serve(require, target, { modules = {}, transform = null } = {}) {
  const root = path.dirname(require.resolve("vite/package.json"));
  const entry = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).exports?.["."];
  const file =
    typeof entry === "string" ? entry : (entry?.import?.default ?? entry?.import ?? entry?.default);
  const { createServer } = await import(pathToFileURL(path.join(root, file)).href);
  const server = await createServer({
    root: target,
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 5290, strictPort: false },
    plugins: [
      {
        name: "design-assembly-stage",
        enforce: "pre",
        transform: (code, id) => (transform ? transform(code, id) : null),
        resolveId: (id) => (id in modules ? id : null),
        load: (id) => (id in modules ? modules[id] : null),
      },
    ],
  });
  await server.listen();
  return {
    origin: server.resolvedUrls.local[0].replace(/\/$/, ""),
    load: (module) => server.ssrLoadModule(module),
    close: () => server.close(),
  };
}
