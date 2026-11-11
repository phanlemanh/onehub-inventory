import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty";

import { FRAME_COPY, LOGIN_PATH } from "./frame-copy";

export type PageStateKind = "error" | "not-found" | "session-expired" | "forbidden";

/** The sign-in address that brings the person back to `returnTo` afterwards. */
export function loginHref(returnTo: string): string {
  return `${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}`;
}

const COPY = {
  error: FRAME_COPY.error,
  "not-found": FRAME_COPY.notFound,
  "session-expired": FRAME_COPY.sessionExpired,
  forbidden: FRAME_COPY.forbidden,
} as const;

/**
 * A whole-page state: what happened, why, what to do next (design/language.md, three-part sentence),
 * with the one way forward.
 */
export function PageState({
  kind,
  onRetry,
  returnTo = "/",
  homeHref = "/",
}: {
  kind: PageStateKind;
  onRetry?: () => void;
  returnTo?: string;
  homeHref?: string;
}) {
  const copy = COPY[kind];
  return (
    <Empty data-slot="page-state" data-kind={kind}>
      <EmptyHeader>
        <h1 className="text-lg font-semibold">{copy.title}</h1>
        <EmptyDescription>
          <span data-part="why">{copy.why}</span> <span data-part="next">{copy.next}</span>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {kind === "error" && onRetry ? <Button onClick={onRetry}>{FRAME_COPY.retry}</Button> : null}
        {kind === "not-found" || kind === "forbidden" ? (
          <Link href={homeHref} className={buttonVariants()}>
            {FRAME_COPY.goHome}
          </Link>
        ) : null}
        {kind === "session-expired" ? (
          <Link href={loginHref(returnTo)} className={buttonVariants()}>
            {FRAME_COPY.signInAgain}
          </Link>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}
