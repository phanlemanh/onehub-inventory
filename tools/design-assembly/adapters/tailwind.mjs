// The values adapter for Tailwind 4: the framework's own theme, the lowest layer of the cascade,
// and how a stylesheet says it is built on the framework.
export const adapter = {
  id: "tailwind",
  kind: "values",
  names: ["tailwind", "tailwindcss"],
  frameworkTheme: "node_modules/tailwindcss/theme.css",
  importsFramework: /@import\s+["']tailwindcss["']/,
  // Class names that break a decision of the foundations: a value off the scale the decision
  // keeps, or a colour that is not a role.
  breakingClasses: {
    "color-role": ["text-[#ff0000]", "bg-[rgb(255_0_0)]"],
    "color-palette": ["bg-red-500", "text-slate-600"],
    "type-scale": ["text-[13px]"],
    spacing: ["p-[13px]", "gap-[7px]"],
    radius: ["rounded-[7px]"],
  },
  // The start of a class name, to build one in pieces; and a class that changes a component's look.
  classStart: "text-",
  lookClass: "bg-primary",
};
