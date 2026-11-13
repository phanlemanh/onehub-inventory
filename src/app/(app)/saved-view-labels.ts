import { label } from "@/modules/company-config";
import type { SavedViewLabels } from "@/modules/listings/ui";

/** The words of saved views (row 2c) from the label table, for the second column and the inventory. */
export function savedViewLabels(): SavedViewLabels {
  return {
    view: label("SavedView"),
    save: label("SaveView"),
    saveChanges: label("SaveViewChanges"),
    saveAsNew: label("SaveAsNewView"),
    rename: label("RenameView"),
    remove: label("RemoveView"),
    unit: label("Unit"),
    inventory: label("Inventory"),
  };
}
