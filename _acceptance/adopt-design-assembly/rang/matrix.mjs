// The matrix written first (evals.yaml, top of file), as data both measures of AC-2 read.
// The decisions the design-assembly tool holds, in alphabetical order.
export const HELD = [
  "checks-in-gate",
  "color-contrast",
  "color-palette",
  "color-role",
  "component-manifest",
  "design-tokens",
  "empty-state-actions",
  "ledger-shapes",
  "no-inline-style",
  "no-restyled-component",
  "radius",
  "radius-value",
  "raw-controls",
  "raw-table",
  "spacing-values",
  "type-scale",
  "type-scale-values",
];

// The ones a rule of the repository's lint holds, each by the rule its ledger row names.
export const LINT = {
  "color-palette": "onehub-ui/no-raw-palette",
  "color-role": "onehub-ui/no-hardcoded-color",
  "no-inline-style": "shadcn/no-inline-styles",
  "no-restyled-component": "shadcn/no-restyle",
  radius: "shadcn/no-arbitrary-values",
  "raw-controls": "onehub-ui/no-raw-controls",
  "raw-table": "onehub-ui/no-raw-table",
  "type-scale": "onehub-ui/no-arbitrary-text-size",
};
