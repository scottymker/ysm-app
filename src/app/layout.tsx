// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import RegisterSW from "@/components/RegisterSW";
import SplashStyles from "@/components/SplashStyles";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  applicationName: "YouStillMatter",
  title: "YouStillMatter",
  description:
    "Calming tools, grounding, and a crisis card—private and offline-friendly.",
  // Use the public manifest with a cache-buster
  manifest: "/manifest.webmanifest?v=7",
  // Theme colors (light/dark)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  // iOS PWA presentation
  appleWebApp: {
    capable: true,
    title: "YouStillMatter",
    statusBarStyle: "black-translucent",
  },
  // Favicons & Apple touch icon — use real filenames with query-string versioning
  icons: {
    icon: [
      { url: "/favicon-16.png?v=7", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png?v=7", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-32.png?v=7",
    apple: { url: "/apple-touch-icon.png?v=7", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <RegisterSW />
        <BottomNav />
        <SplashStyles />
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-2xl p-6 text-xs opacity-70">
      <div className="flex flex-wrap items-center gap-3">
        <span>© {new Date().getFullYear()} YouStillMatter</span>
        <a className="underline" href="/(legal)/privacy">Privacy</a>
        <a className="underline" href="/(legal)/terms">Terms</a>
        <a className="underline" href="/resources">Resources</a>
      </div>
    </footer>
  );
}
