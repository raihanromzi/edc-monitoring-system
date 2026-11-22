import type { Metadata } from "next";
import Link from "next/link";
import { getBranchConfig } from "@/lib/db";
import HeaderActions from "@/components/navigation/HeaderActions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mandiri EDC Monitoring",
  description: "Branch monitoring for Mandiri EDC and Livin' Merchant portfolios",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const branch = await getBranchConfig().catch(() => null);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-heading text-sm font-semibold text-slate-100">
                EDC Monitoring
              </Link>
              <nav className="hidden gap-4 text-sm sm:flex" aria-label="Main navigation">
                <Link href="/" className="text-slate-300 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                  Dashboard
                </Link>
                <Link href="/settings" className="text-slate-300 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {branch ? (
                <span className="hidden rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 md:inline">
                  {branch.branchName}
                </span>
              ) : null}
              <HeaderActions />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1200px] px-4 pb-8 pt-6">{children}</main>
      </body>
    </html>
  );
}
