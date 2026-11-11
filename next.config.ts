import type { NextConfig } from "next";

// A second dev server in the same checkout (the database browser tests of row 8, playwright.db.config.ts) needs its
// own build folder — Next.js allows one `next dev` per build folder — and its own tsconfig (NEXT_TSCONFIG, written by
// that config outside the build folder, which Turbopack does not read), so the dev server records its build folder
// there instead of rewriting the repository's tsconfig.json.
const distDir = process.env["NEXT_DIST_DIR"];

const config: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  ...(distDir
    ? {
        distDir,
        ...(process.env["NEXT_TSCONFIG"]
          ? { typescript: { tsconfigPath: process.env["NEXT_TSCONFIG"] } }
          : {}),
      }
    : {}),
};

export default config;
