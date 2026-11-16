// Runs once when the server starts. Production without its sign-in configuration does not start: it never falls back
// to printing codes to the log (decision 0021). Nor does a build that is not set up as staging or the real product
// (row 22, AC-5).
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { assertStartupConfig } = await import("@/modules/identity/server");
  assertStartupConfig(process.env);
}
