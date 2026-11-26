// Types for the browser test of the floating parts, so the repository's own browser test can call
// it under a strict type check.
import type { Page, TestType } from "@playwright/test";

export interface FloatingScreen {
  title: string;
  root: string;
  screen: { id: string; route: string; records: string[] };
  plan: unknown;
}

export declare const test: TestType<
  { page: Page } & Record<string, unknown>,
  Record<string, unknown>
>;
export declare function floatingScreens(root?: string): FloatingScreen[];
export declare function floatingCheck(page: Page, item: FloatingScreen): Promise<void>;
