// Types for the reader of the ledger of screens, so a repository's own tests can read it.
export declare const SCREEN_LEDGER: string;
export declare const SCREEN_LEDGER_VERSION: number;

export interface ListedScreen {
  id: string;
  path: string;
  title: string | null;
  family: string | null;
  states: string[];
}

export interface ScreenLedger {
  version?: number | string;
  families?: Record<string, string>;
  screens: Array<Record<string, unknown>>;
}

export declare function readScreenLedger(text: string | null | undefined): ScreenLedger | null;
export declare function builtScreens(ledger: ScreenLedger | null): ListedScreen[];
