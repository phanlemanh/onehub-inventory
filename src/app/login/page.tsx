import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { LoginLayout } from "@/components/templates/login-layout";
import { label } from "@/modules/company-config";
import { CODE_LENGTH, safeNext } from "@/modules/identity";
import { currentSession } from "@/modules/identity/server";

import { LOGIN_COPY } from "./copy";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: label("SignIn") };

/**
 * Sign in with an emailed code (row 8) in the sign-in family frame chosen from ReUI block auth-15 (row 1p). The
 * block's Google, Apple and GitHub buttons and its terms footer are dropped: sign-in is by emailed code only, and no
 * terms page exists yet.
 */
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
    <LoginLayout
      heading={label("SignIn")}
      lead={LOGIN_COPY.lead}
      footer={LOGIN_COPY.copyright(new Date().getFullYear(), FRAME_COPY.brand)}
    >
      <LoginForm
        next={next}
        codeLength={CODE_LENGTH}
        labels={{
          signIn: label("SignIn"),
          signOut: label("SignOut"),
          code: label("LoginCode"),
        }}
        initialCompanies={session && !session.company ? session.companies : null}
      />
    </LoginLayout>
  );
}
