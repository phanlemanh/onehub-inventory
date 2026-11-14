// The values adapter for Tailwind 4: the framework's own theme, the lowest layer of the cascade,
// and how a stylesheet says it is built on the framework.
export const adapter = {
  id: "tailwind",
  kind: "values",
  names: ["tailwind", "tailwindcss"],
  frameworkTheme: "node_modules/tailwindcss/theme.css",
  importsFramework: /@import\s+["']tailwindcss["']/,
};
