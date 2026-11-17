// The height of the record's footer while a record with one is open (row 3g): one CSS variable on the document, written
// by the record panel (record-panel.tsx measures its footer) and read by the app's notices (src/app/layout.tsx), so a
// notice sits above the record's main button, never on it. Measured, never a number written twice. Not a client module,
// so the server layout reads the same string.

export const RECORD_FOOTER_VAR = "--record-footer-h";

/** The notices' distance from the bottom of the window: the toaster's own gap above whatever footer is open. */
export const noticeBottom = (gap: string): string =>
  `calc(var(${RECORD_FOOTER_VAR}, 0px) + ${gap})`;
