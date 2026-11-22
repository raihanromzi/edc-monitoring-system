import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mandiri EDC Monitoring",
  description: "Branch monitoring for Mandiri EDC and Livin' Merchant portfolios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="relative h-dvh w-full overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
