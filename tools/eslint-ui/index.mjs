// ESLint plugin for product UI: makes hand-drawn UI detectable by machine. Ported from onehub-quy-hang@e77c8fdc packages/ui-lint.
import noRawTable from "./rules/no-raw-table.mjs";
import noRawControls from "./rules/no-raw-controls.mjs";
import noNativeDialogs from "./rules/no-native-dialogs.mjs";
import noRawPalette from "./rules/no-raw-palette.mjs";
import noHardcodedColor from "./rules/no-hardcoded-color.mjs";
import noArbitraryTextSize from "./rules/no-arbitrary-text-size.mjs";
import noBannedMotion from "./rules/no-banned-motion.mjs";
import noAsChild from "./rules/no-aschild.mjs";
import noEmojiIcons from "./rules/no-emoji-icons.mjs";
import requireDisableReason from "./rules/require-disable-reason.mjs";
import noOffScaleSpacing from "./rules/no-off-scale-spacing.mjs";
import noPartialClass from "./rules/no-partial-class.mjs";

const REASON_RULE = "onehub-ui/require-disable-reason";

export default {
  meta: { name: "onehub-ui" },
  rules: {
    "no-raw-table": noRawTable,
    "no-raw-controls": noRawControls,
    "no-native-dialogs": noNativeDialogs,
    "no-raw-palette": noRawPalette,
    "no-hardcoded-color": noHardcodedColor,
    "no-arbitrary-text-size": noArbitraryTextSize,
    "no-banned-motion": noBannedMotion,
    "no-aschild": noAsChild,
    "no-emoji-icons": noEmojiIcons,
    "require-disable-reason": requireDisableReason,
    "no-off-scale-spacing": noOffScaleSpacing,
    "no-partial-class": noPartialClass,
  },
  processors: {
    // `/* eslint-disable */` and `// eslint-disable-line` switch off the lint on the very line that
    // carries them, so the report of require-disable-reason on that line would be dropped. The text
    // goes through unchanged; that rule's reports lose the suppression, since no directive may
    // excuse itself from giving a reason.
    reasons: {
      meta: { name: "onehub-ui/reasons" },
      supportsAutofix: true,
      preprocess: (text) => [text],
      postprocess: (lists) =>
        lists.flat().map((message) => {
          if (message.ruleId !== REASON_RULE || !message.suppressions) return message;
          const kept = { ...message };
          delete kept.suppressions;
          return kept;
        }),
    },
  },
};
