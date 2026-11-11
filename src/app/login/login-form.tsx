"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AUTH_BASE_PATH } from "@/modules/identity";

import { LOGIN_COPY as COPY } from "./copy";

/** Nothing to subscribe to: the value only differs between the server render and the browser. */
const noSubscribe = () => () => {};

interface CompanyRef {
  id: string;
  name: string;
}

type Step = "email" | "code" | "choose" | "no-company";
type Problem = null | "code-invalid" | "rate-limited" | "server-error";

/** Keeps only digits: pasting "123 456" or "123-456" gives "123456". */
export function digitsOnly(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

async function call(
  path: string,
  method: string,
  body?: unknown,
): Promise<{ status: number; json: unknown }> {
  const res = await fetch(`${AUTH_BASE_PATH}${path}`, {
    method,
    headers: { "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const json: unknown = await res.json().catch(() => null);
  return { status: res.status, json };
}

function problemOf(status: number, json: unknown): Problem {
  const code = (json as { error?: string } | null)?.error;
  if (code === "code-invalid") return "code-invalid";
  if (code === "rate-limited") return "rate-limited";
  return status >= 400 ? "server-error" : null;
}

export function LoginForm({
  next,
  codeLength,
  labels,
  initialCompanies,
}: {
  next: string;
  codeLength: number;
  labels: { signIn: string; code: string };
  /** Already signed in without a company (several companies): start at the choice. */
  initialCompanies: CompanyRef[] | null;
}) {
  const [step, setStep] = useState<Step>(initialCompanies ? "choose" : "email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [companies, setCompanies] = useState<CompanyRef[]>(initialCompanies ?? []);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem>(null);
  const [retry, setRetry] = useState<(() => void) | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  // Set once the form runs in the browser: before that, Enter would submit a plain form and reload the page.
  const ready = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  function go(to: string) {
    window.location.assign(to);
  }

  async function sendCode() {
    setBusy(true);
    setProblem(null);
    try {
      const { status, json } = await call("/code", "POST", { email });
      const p = problemOf(status, json);
      setProblem(p);
      setRetry(() => (p === "server-error" ? () => void sendCode() : null));
      if (!p) {
        setCode("");
        setStep("code");
      }
    } catch {
      setProblem("server-error");
      setRetry(() => () => void sendCode());
    } finally {
      setBusy(false);
    }
  }

  async function signIn() {
    setBusy(true);
    setProblem(null);
    try {
      const { status, json } = await call("/session", "POST", { email, code, next });
      if (status === 403 && (json as { error?: string } | null)?.error === "no-company") {
        setStep("no-company");
        return;
      }
      const p = problemOf(status, json);
      setProblem(p);
      setRetry(() => (p === "server-error" ? () => void signIn() : null));
      if (p) return;
      const body = json as { company: CompanyRef | null; companies: CompanyRef[]; next: string };
      if (body.company) {
        go(body.next);
        return;
      }
      setCompanies(body.companies);
      setStep("choose");
    } catch {
      setProblem("server-error");
      setRetry(() => () => void signIn());
    } finally {
      setBusy(false);
    }
  }

  async function choose(company: CompanyRef) {
    setBusy(true);
    setProblem(null);
    try {
      const { status, json } = await call("/session/company", "PUT", { companyId: company.id });
      const p = problemOf(status, json);
      setProblem(p);
      setRetry(() => (p === "server-error" ? () => void choose(company) : null));
      if (!p) go(next);
    } catch {
      setProblem("server-error");
      setRetry(() => () => void choose(company));
    } finally {
      setBusy(false);
    }
  }

  function backToEmail() {
    setStep("email");
    setCode("");
    setProblem(null);
  }

  const serverError =
    problem === "server-error" ? (
      <div
        role="alert"
        className="flex flex-col gap-2 text-sm text-destructive"
        data-state="server-error"
      >
        <p>{COPY.serverError}</p>
        {retry ? (
          <Button type="button" variant="outline" size="sm" onClick={retry} className="self-start">
            {COPY.retry}
          </Button>
        ) : null}
      </div>
    ) : null;

  if (step === "no-company") {
    return (
      <div className="flex flex-col gap-4" data-state="no-company">
        <p role="alert" className="text-sm">
          {COPY.noCompany}
        </p>
        <Button type="button" variant="outline" onClick={backToEmail}>
          {COPY.otherEmail}
        </Button>
      </div>
    );
  }

  if (step === "choose") {
    return (
      <div className="flex flex-col gap-3" data-state="choose-company">
        <p className="text-sm">{COPY.chooseCompany}</p>
        <ul className="flex flex-col gap-2">
          {companies.map((c) => (
            <li key={c.id}>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={busy}
                onClick={() => void choose(c)}
              >
                {c.name}
              </Button>
            </li>
          ))}
        </ul>
        {serverError}
      </div>
    );
  }

  if (step === "code") {
    const invalid = problem === "code-invalid";
    return (
      <form
        className="flex flex-col gap-4"
        data-state="code"
        noValidate
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          void signIn();
        }}
      >
        <p className="text-sm" aria-live="polite">
          {COPY.codeSent(email)}
        </p>
        <FieldGroup>
          <Field data-invalid={invalid || undefined}>
            <FieldLabel htmlFor="login-code">{labels.code}</FieldLabel>
            <Input
              ref={codeRef}
              id="login-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={codeLength + 8}
              value={code}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? "login-code-error" : "login-code-hint"}
              onChange={(e) => setCode(digitsOnly(e.target.value, codeLength))}
              onPaste={(e) => {
                e.preventDefault();
                setCode(digitsOnly(e.clipboardData.getData("text"), codeLength));
              }}
            />
            {invalid ? (
              <FieldError id="login-code-error">{COPY.codeInvalid}</FieldError>
            ) : (
              <FieldDescription id="login-code-hint">{COPY.codeHint}</FieldDescription>
            )}
          </Field>
        </FieldGroup>
        {problem === "rate-limited" ? (
          <p role="alert" className="text-sm text-destructive" data-state="rate-limited">
            {COPY.rateLimited}
          </p>
        ) : null}
        {serverError}
        <Button type="submit" disabled={busy || code.length !== codeLength}>
          {busy ? COPY.signingIn : labels.signIn}
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={busy}
            onClick={() => void sendCode()}
          >
            {COPY.resend}
          </Button>
          <Button type="button" variant="link" size="sm" disabled={busy} onClick={backToEmail}>
            {COPY.otherEmail}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      data-state="email"
      data-ready={ready || undefined}
      noValidate
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        if (email.trim()) void sendCode();
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">{COPY.emailLabel}</FieldLabel>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            disabled={busy}
            aria-describedby="login-email-hint"
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldDescription id="login-email-hint">{COPY.emailHint}</FieldDescription>
        </Field>
      </FieldGroup>
      {problem === "rate-limited" ? (
        <p role="alert" className="text-sm text-destructive" data-state="rate-limited">
          {COPY.rateLimited}
        </p>
      ) : null}
      {serverError}
      <Button type="submit" disabled={busy}>
        {busy ? COPY.sending : COPY.sendCode}
      </Button>
    </form>
  );
}
