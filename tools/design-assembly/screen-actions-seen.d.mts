// Types for the walking plan and the comparison of the browser test by role, so the repository's
// own browser test can read them.
export declare const MARK: string;
export declare const SEEN_DECISION: string;
export declare const SEEN_TEST: string;

export interface WalkRow {
  screen: string;
  route: string | null;
  role: string;
  opens: boolean;
  buttons: string[];
  actions: string[];
  holdsAll: boolean;
}

export interface SeenState {
  name: string;
  reached: boolean;
  marks: string[];
  why?: string;
}

export interface BlockedSeen {
  first: { name: string; shows: string };
  marks: string[];
  words: boolean;
  mains: number;
  headings: number;
  sent?: string;
}

export declare function walkPlan(ledger: unknown, read: unknown): WalkRow[];
export declare function walkPlanOf(root: string): WalkRow[];
export declare function widthsOf(sizes: { widths?: number[] } | null | undefined): number[];
export declare function doorProblem(
  role: string,
  doors: Record<string, unknown> | null | undefined,
  file: string,
): string | null;
export declare function seenProblems(
  row: WalkRow,
  states: SeenState[],
  options?: { width?: number | null },
): string[];
export declare function blockedProblems(
  row: WalkRow,
  seen: BlockedSeen,
  options?: { width?: number | null },
): string[];
