// The components adapter for a shadcn component library: its settings file, the folder it installs
// components into, the class-variance helper its components declare variants with, and the toast
// component it installs.
import { existsSync } from "node:fs";
import path from "node:path";

const SETTINGS = "components.json";
const FOLDER = "src/components/ui";

// An alias of the settings as a folder of the repository: `@/x` is `x` under the folder the package
// keeps its source in, `src` unless the caller knows another (`.` for the package's root); an alias
// that starts with the package's own name is followed through the package's exports, `./x/*` to the
// folder its files are in. Null when neither reaches a folder.
function folderOf(alias, pkg, source = "src") {
  if (typeof alias !== "string") return null;
  if (alias.startsWith("@/")) return path.posix.join(source, alias.slice(2));
  const name = pkg?.name;
  if (typeof name !== "string" || !alias.startsWith(`${name}/`)) return null;
  const rest = alias.slice(name.length + 1);
  for (const [key, value] of Object.entries(pkg?.exports ?? {})) {
    if (typeof value !== "string") continue;
    const from = /^\.\/(.+)\/\*$/.exec(key)?.[1];
    const to = /^\.\/(.+)\/\*[^/]*$/.exec(value)?.[1];
    if (from === rest && to) return to;
  }
  return null;
}

export const adapter = {
  id: "shadcn",
  kind: "components",
  // Whether the repository installed the library: its settings file, or its folder, is there.
  present: (root) => existsSync(path.join(root, SETTINGS)) || existsSync(path.join(root, FOLDER)),
  names: ["shadcn", "class-variance-authority", "cva"],
  // The folders under `components/` that vendors install their components into, by their usual
  // names: this library's own, and the registry beside it. Code the repository did not write.
  vendorFolders: ["ui", "reui"],
  // The components its registry offers, by the name a file of the library takes. Where the
  // library shares a folder with the repository's own components, a file of one of these names is
  // the library's.
  items: [
    "accordion",
    "alert",
    "alert-dialog",
    "aspect-ratio",
    "attachment",
    "avatar",
    "badge",
    "breadcrumb",
    "bubble",
    "button",
    "button-group",
    "calendar",
    "card",
    "carousel",
    "chart",
    "checkbox",
    "code-block",
    "collapsible",
    "combobox",
    "command",
    "context-menu",
    "dialog",
    "direction",
    "drawer",
    "dropdown-menu",
    "empty",
    "field",
    "form",
    "hover-card",
    "input",
    "input-group",
    "input-otp",
    "item",
    "kbd",
    "label",
    "marker",
    "menubar",
    "message",
    "message-scroller",
    "native-select",
    "navigation-menu",
    "pagination",
    "popover",
    "progress",
    "questionnaire",
    "radio-group",
    "resizable",
    "scroll-area",
    "select",
    "separator",
    "sheet",
    "sidebar",
    "skeleton",
    "slider",
    "sonner",
    "spinner",
    "switch",
    "table",
    "tabs",
    "textarea",
    "toast",
    "toggle",
    "toggle-group",
    "tooltip",
    "trace",
  ],
  itemsSource: "https://ui.shadcn.com/r/index.json, read 2026-11-20",
  settingsFile: SETTINGS,
  folder: FOLDER,
  // The stylesheet the settings name, or null.
  stylesheetIn: (settings) => settings?.tailwind?.css ?? null,
  // The folder of the library the settings name, or null. `pkg` is the repository's package file,
  // whose own name and exports an alias may go through.
  folderIn: (settings, pkg = null, source = "src") => folderOf(settings?.aliases?.ui, pkg, source),
  // The library's usual folder, under the folder the package keeps its source in.
  folderUnder: (source = "src") => path.posix.join(source, "components/ui"),
  // `const name = cva(base, { variants })`: the name of a variant set, at the open of its call.
  variantSet: /\bconst\s+(\w+)\s*=\s*cva\(/g,
  // The toast component the library installs, from the package it wraps.
  toast: { package: "sonner", template: "sonner.tsx.template", file: "sonner.tsx" },
  // The folders other registries install into: each registry the settings name, by its name, in
  // the folder of the components alias.
  registryFoldersIn: (settings, pkg = null, source = "src") => {
    const folder = folderOf(settings?.aliases?.components, pkg, source);
    if (!folder) return [];
    return Object.keys(settings?.registries ?? {})
      .map((name) => name.replace(/^@/, ""))
      .filter((name) => /^[\w-]+$/.test(name))
      .map((name) => `${folder}/${name}`);
  },
  // How a screen imports a component of the library, from the alias the settings name.
  importPathIn: (settings) => settings?.aliases?.ui ?? "@/components/ui",
  // The component a probe restyles, when the library has it.
  probeComponent: { name: "Button", file: "button" },
  // Rules of the library's linter that read the classes given to its components only, so a text
  // that breaks them is written on a component, never on a plain element they do not look at.
  componentClassRules: ["shadcn/require-static-classes"],
};
