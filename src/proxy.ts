// Prototype pages are dev-only (/proto/*). In a real build the page's own notFound() comes too late: the (app) group
// has a loading.tsx, so the response has already started with status 200 (a soft 404). This proxy answers a real 404
// before any page runs. It matches /proto only — no other path goes through it (decision 0043).
import { NextResponse } from "next/server";

export function proxy(): NextResponse | undefined {
  if (process.env.NODE_ENV !== "production") return undefined;
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/proto", "/proto/:path*"],
};
