// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.

// The commit of this repository's main the branch was cut from: the tool as it was before.
export const BASE = "0861fdcb6906a3d86d6c88df830c9ac40447d263";

// The nine components the old tool listed twice, each with the file that defines it.
export const DEFINED_AT = {
  FilterAdvancedRow: "src/components/reui/filters/filters-advanced.tsx",
  FiltersAdvancedPanel: "src/components/reui/filters/filters-advanced.tsx",
  FiltersAdvanced: "src/components/reui/filters/filters-advanced.tsx",
  FilterFieldPicker: "src/components/reui/filters/filters-builder.tsx",
  FiltersBuilder: "src/components/reui/filters/filters-builder.tsx",
  FilterValuePopover: "src/components/reui/filters/filters-chip.tsx",
  FilterOperatorPopover: "src/components/reui/filters/filters-chip.tsx",
  FilterRuleMenuItems: "src/components/reui/filters/filters-chip.tsx",
  FilterChip: "src/components/reui/filters/filters-chip.tsx",
};

// The plugin's tool folder this repository copied: the commit of design-assembly it was read at, and
// the id git gives that folder there:
//   git rev-parse feea58d:plugins/design-assembly/templates/tools/design-assembly
export const PLUGIN = {
  commit: "feea58d",
  tree: "357987f790b1a0b52630f683780290933800fc3f",
};

export const TOOL_FOLDER = "tools/design-assembly";
export const REGISTRY = "design/component-registry.json";

// The only design ledger this branch may change.
export const MAY_CHANGE = [REGISTRY];
