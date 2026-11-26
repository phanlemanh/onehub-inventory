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
  // The typefaces: the variable of running text and of headings, and the block that declares
  // them. The framework writes a theme variable's value into the classes that use it, so a
  // typeface takes effect only when it is declared in that block, never in a selector's own: the
  // last declaration of the variable in such a block is the one in force.
  // A colour role the floor has no class for, such as a status tone the owner chose: the
  // framework makes its classes from a theme variable of the same name in this block.
  colors: {
    block: "@theme inline",
    name: (role) => `--color-${role.slice(2)}`,
  },
  fonts: {
    text: "--font-sans",
    heading: "--font-heading",
    block: "@theme inline",
    // What a sheet that draws a choice puts on the page, with the values resolved: the classes
    // already hold the floor's value, so the preview sets the property the classes set.
    preview: ({ text, heading }) =>
      `html, .font-sans {\n  font-family: ${text};\n}\n.font-heading {\n  font-family: ${heading};\n}\n`,
  },
};
