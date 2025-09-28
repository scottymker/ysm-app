// ...existing code...
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "YouStillMatter",
  description: "A private, supportive, offline-friendly mental wellbeing app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#0b1220" />
        <link rel="manifest" href="/manifest.webmanifest?v=6" />

        {/* FAVICONS (tab icon) */}
        <link rel="icon" type="image/png" href="/favicon-32.v6.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16.v6.png" sizes="16x16" />
        <link rel="shortcut icon" href="/favicon-32.v6.png" type="image/png" />

        {/* iOS Home Screen icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.v6.png" sizes="180x180" />
      </head>
      <body className="bg-surface-light text-ink font-sans min-h-screen flex flex-col justify-between">
        <header className="w-full py-4 px-6 bg-white border-b border-divider flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">YouStillMatter</h1>
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
