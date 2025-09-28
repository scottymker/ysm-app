#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-7}"  # cache-buster for icons/manifest links

echo "==> Using version v${VERSION}"

# --- sanity: make sure we're in a Next.js (App Router) repo
[[ -d src/app ]] || { echo "ERROR: src/app not found. Run from your Next.js app root."; exit 1; }

# --- ensure public icons exist (copy from pwa-icons if missing)
mkdir -p public
for f in favicon-16.png favicon-32.png apple-touch-icon.png icon-192.png icon-512.png icon-maskable.png; do
  if [[ ! -f "public/$f" && -f "pwa-icons/$f" ]]; then
    cp -f "pwa-icons/$f" "public/$f"
    echo "Copied pwa-icons/$f -> public/$f"
  fi
done

# --- remove App Router auto-icons that can override our links
rm -f src/app/favicon.ico src/app/icon.png src/app/apple-icon.png 2>/dev/null || true

# --- backup files we're going to touch
ts="$(date +%Y%m%d-%H%M%S)"
for f in src/app/globals.css src/app/layout.tsx tailwind.config.ts; do
  [[ -f "$f" ]] && cp "$f" "$f.$ts.bak" && echo "Backup: $f -> $f.$ts.bak" || true
done

# --- write globals.css (theme tokens + splash)
cat > src/app/globals.css <<'CSS'
/* === THEME TOKENS === */
:root{
  --brand:#623e8e;    /* logo purple */
  --bg:#f2c2ff;       /* app background */
  --fg:#0d0d12;       /* near-black text */
  --muted:#5b4f6e;    /* muted text */
  --card:#ffffff;     /* panels/cards */
  --border:#e9d7ff;   /* soft border on purple bg */
  --focus:#2b1b48;    /* darker brand for focus ring */

  --accent:#8a67c1;        /* secondary accent */
  --accent-weak:#e7d8ff;   /* very light accent wash */

  --ok:#13ad5d; --warn:#ffb02e; --danger:#e5484d;
}

/* optional dark scheme */
@media (prefers-color-scheme: dark){
  :root{
    --bg:#0f0a18; --fg:#f7f7fb; --card:#171024; --border:#2a1d42;
    --muted:#c9bde1; --accent:#a789dd; --accent-weak:#241637; --focus:#cdb6ff;
  }
}

/* base */
html,body{height:100%; background:var(--bg); color:var(--fg);}

/* subtle splash of color */
body::before{
  content:"";
  position:fixed; inset:-20% -20% auto -20%;
  height:55vh; pointer-events:none; z-index:0; opacity:.8; filter:blur(8px);
  background:
    radial-gradient(1200px 600px at 20% -10%, color-mix(in oklab, var(--brand) 25%, transparent) 0%, transparent 60%),
    radial-gradient(900px 420px at 90% -10%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 65%);
}
/* ensure app content sits above splash */
#__next, body > * { position:relative; z-index:1; }

/* handy utility classes */
.card{ background:var(--card); border:1px solid var(--border); border-radius:16px; }
.btn{ display:inline-flex; align-items:center; justify-content:center; border-radius:12px; padding:.5rem 1rem; font-weight:600; transition:filter .15s; box-shadow:0 1px 0 rgba(0,0,0,.04); }
.btn-primary{ color:#fff; background:var(--brand); }
.btn-primary:hover{ filter:brightness(1.05); }
.btn-outline{ color:var(--brand); background:transparent; border:1px solid color-mix(in oklab, var(--brand) 45%, white); }
.btn-ghost{ color:var(--brand); background:transparent; }
.btn:focus-visible{ outline:3px solid color-mix(in oklab, var(--focus) 85%, transparent); outline-offset:2px; }

.border-divider{ border-color:var(--border); }
.text-muted{ color:var(--muted); }
.bg-accent-weak{ background:var(--accent-weak); }
CSS

# --- write/patch tailwind.config.ts with color tokens
cat > tailwind.config.ts <<'TS'
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        bg: "var(--bg)",
        fg: "var(--fg)",
        card: "var(--card)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-weak": "var(--accent-weak)",
        focus: "var(--focus)",
        muted: "var(--muted)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      borderRadius: { xl: "16px", "2xl": "20px" },
      boxShadow: { card: "0 10px 20px rgba(0,0,0,.06)" },
    },
  },
  plugins: [],
};

export default config;
TS

# --- write layout.tsx with metadata + cache-busted icons/manifest
cat > src/app/layout.tsx <<LAYOUT
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
  manifest: "/manifest.webmanifest?v=${VERSION}",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2c2ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0a18" },
  ],
  appleWebApp: {
    capable: true,
    title: "YouStillMatter",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon-16.png?v=${VERSION}", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png?v=${VERSION}", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-32.png?v=${VERSION}",
    apple: { url: "/apple-touch-icon.png?v=${VERSION}", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-fg">
        <main className="mx-auto max-w-3xl px-4 py-6">
          {children}
        </main>

        <RegisterSW />
        <BottomNav />
        <SplashStyles />
        <Footer />
      </body>
    </html>
  );
}

function Footer(){
  return (
    <footer className="mx-auto max-w-3xl p-6 text-xs text-muted">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <span>© {new Date().getFullYear()} YouStillMatter</span>
        <a className="underline" href="/(legal)/privacy">Privacy</a>
        <a className="underline" href="/(legal)/terms">Terms</a>
        <a className="underline" href="/resources">Resources</a>
      </div>
    </footer>
  );
}
LAYOUT

echo "==> Theme + layout updated."
echo "Next steps:"
echo "  1) git add -A && git commit -m 'Apply purple theme and icon metadata (v${VERSION})' || true"
echo "  2) git fetch origin && git rebase origin/main && git push origin main"
echo "  3) In Netlify: Deploys → Clear cache and deploy site"
echo "  4) Hard refresh the app; Android PWA updates on next open; iOS needs re-add to Home Screen."
