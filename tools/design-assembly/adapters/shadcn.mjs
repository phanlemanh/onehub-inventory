// The components adapter for a shadcn component library: its settings file, the folder it installs
// components into, the class-variance helper its components declare variants with, and the toast
// component it installs.
export const adapter = {
  id: "shadcn",
  kind: "components",
  names: ["shadcn", "class-variance-authority", "cva"],
  settingsFile: "components.json",
  folder: "src/components/ui",
  // The stylesheet the settings name, or null.
  stylesheetIn: (settings) => settings?.tailwind?.css ?? null,
  // The folder of the library the settings name, or null.
  folderIn: (settings) => {
    const alias = settings?.aliases?.ui;
    return typeof alias === "string" && alias.startsWith("@/") ? `src/${alias.slice(2)}` : null;
  },
  // `const name = cva(base, { variants })`: the name of a variant set, at the open of its call.
  variantSet: /\bconst\s+(\w+)\s*=\s*cva\(/g,
  // The toast component the library installs, from the package it wraps.
  toast: { package: "sonner", template: "sonner.tsx.template", file: "sonner.tsx" },
  // How a screen imports a component of the library, from the alias the settings name.
  importPathIn: (settings) => settings?.aliases?.ui ?? "@/components/ui",
  // The component a probe restyles, when the library has it.
  probeComponent: { name: "Button", file: "button" },
};
