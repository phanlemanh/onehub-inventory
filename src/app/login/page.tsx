import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Frame, FrameHeader, FramePanel, FrameTitle } from "@/components/reui/frame";
import { label } from "@/modules/company-config";
import { CODE_LENGTH, safeNext } from "@/modules/identity";
import { currentSession } from "@/modules/identity/server";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: label("SignIn") };

/** Sign in with an emailed code (row 8): email → code → company, one card in the middle of the page. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = (await searchParams)["next"];
  const next = safeNext(Array.isArray(raw) ? raw[0] : raw);
  const session = await currentSession();
  if (session?.company) redirect(next);
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <Frame className="w-full max-w-sm">
        <FrameHeader>
          <FrameTitle>
            <h1 className="text-lg font-semibold">{label("SignIn")}</h1>
          </FrameTitle>
        </FrameHeader>
        <FramePanel>
          <LoginForm
            next={next}
            codeLength={CODE_LENGTH}
            labels={{ signIn: label("SignIn"), code: label("LoginCode") }}
            initialCompanies={session && !session.company ? session.companies : null}
          />
        </FramePanel>
      </Frame>
    </main>
  );
}
