import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { noticeBottom } from "@/components/candidate/record-footer";
import { ThemeProvider } from "@/components/templates/theme";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { HydrationMark } from "./hydration-mark";

import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = { title: { template: "%s · OneHub", default: "OneHub" } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          {/* Notices sit above an open record's footer (row 3g); sonner's own gaps are 24px, 16px on phones. */}
          <Toaster
            offset={{ bottom: noticeBottom("24px") }}
            mobileOffset={{ bottom: noticeBottom("16px") }}
          />
          <HydrationMark />
        </ThemeProvider>
      </body>
    </html>
  );
}
