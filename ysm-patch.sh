#!/usr/bin/env bash
set -euo pipefail

# Detect src/ layout (your repo has src/app)
APP_DIR="app"
[ -d "src/app" ] && APP_DIR="src/app"

COMP_DIR="components"
[ -d "src/components" ] && COMP_DIR="src/components"

UI_DIR="$COMP_DIR/ui"
SCR_DIR="$COMP_DIR/screeners"
JRN_DIR="$COMP_DIR/journal"

mkdir -p "$UI_DIR" "$SCR_DIR" "$JRN_DIR" "$APP_DIR/tools/settings" "$APP_DIR/tools/screeners" "$APP_DIR/privacy" "$APP_DIR/terms"

# ---------- NAV BAR (center Crisis) ----------
cat > "$UI_DIR/NavBar.tsx" <<'TSX'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const linkCls = (href: string) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition ${
      pathname === href ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-black/50 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 h-14 justify-between">
        {/* Left */}
        <div className="flex items-center gap-2">
          <Link href="/" className="px-3 py-2 font-semibold">YouStillMatter</Link>
          <Link href="/tools" className={linkCls("/tools")}>Tools</Link>
          <Link href="/journal" className={linkCls("/journal")}>Journal</Link>
        </div>

        {/* Center: Crisis */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/crisis"
             className="order-3 px-4 py-2 rounded-2xl font-semibold border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Open Crisis resources quickly"
          >
            🚨 Crisis
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link href="/tools/settings" className={linkCls("/tools/settings")}>Settings</Link>
          <Link href="/about" className={linkCls("/about")}>About</Link>
        </div>
      </nav>
    </header>
  );
}
TSX

# ---------- Try to inject NavBar into layout.tsx ----------
LAYOUT="$APP_DIR/layout.tsx"
if [ -f "$LAYOUT" ]; then
  cp "$LAYOUT" "$LAYOUT.bak"
  # Add import if missing
  if ! grep -q 'NavBar' "$LAYOUT"; then
    sed -i '1s;^;import NavBar from "@/components/ui/NavBar";\n;' "$LAYOUT" || true
  fi
  # Insert <NavBar /> right after opening <body ...>
  if ! grep -q '<NavBar' "$LAYOUT"; then
    perl -0777 -pe 's/(<body[^>]*>)/$1\n      <NavBar \/>/s' -i "$LAYOUT"
  fi
fi

# ---------- SETTINGS PAGE ----------
cat > "$APP_DIR/tools/settings/page.tsx" <<'TSX'
"use client";
import { useEffect, useState } from "react";

type Prefs = {
  theme: "system" | "light" | "dark";
  notifications: boolean;
  journalAutosave: boolean;
  dataExportEmail?: string;
};

const DEFAULTS: Prefs = {
  theme: "system",
  notifications: true,
  journalAutosave: true,
  dataExportEmail: "",
};

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("ysm:prefs");
    if (raw) {
      try { setPrefs({ ...DEFAULTS, ...JSON.parse(raw) }); } catch {}
    }
  }, []);

  const save = () => {
    localStorage.setItem("ysm:prefs", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="rounded-2xl border p-4 space-y-4">
        <h2 className="font-semibold">Appearance</h2>
        <div className="flex gap-3">
          {(["system","light","dark"] as const).map(mode => (
            <label key={mode} className="inline-flex items-center gap-2">
              <input type="radio" name="theme" value={mode}
                checked={prefs.theme === mode}
                onChange={() => setPrefs(p => ({...p, theme: mode}))}/>
              <span className="capitalize">{mode}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border p-4 space-y-4">
        <h2 className="font-semibold">Behavior</h2>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={prefs.notifications}
            onChange={e => setPrefs(p => ({...p, notifications: e.target.checked}))}/>
          <span>Enable in-app reminders/notifications</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={prefs.journalAutosave}
            onChange={e => setPrefs(p => ({...p, journalAutosave: e.target.checked}))}/>
          <span>Autosave journal entries</span>
        </label>
        <label className="flex items-center gap-3">
          <span className="w-48">Data export email (optional)</span>
          <input className="flex-1 rounded-xl border px-3 py-2" type="email"
            placeholder="you@example.com" value={prefs.dataExportEmail ?? ""}
            onChange={e => setPrefs(p => ({...p, dataExportEmail: e.target.value}))}/>
        </label>
      </section>

      <div className="flex gap-3">
        <button onClick={save} className="rounded-xl border px-4 py-2 font-semibold hover:shadow">
          Save settings
        </button>
        {saved && <span className="text-green-600">Saved!</span>}
      </div>
    </main>
  );
}
TSX

# ---------- Journal titles-only component ----------
cat > "$JRN_DIR/JournalList.tsx" <<'TSX'
"use client";
import Link from "next/link";

export type JournalEntry = {
  id: string;
  title: string;
  content?: string;
  createdAt?: string | number;
};

export default function JournalList({ entries }: { entries: JournalEntry[] }) {
  if (!entries?.length) return <p className="text-sm text-gray-500">No entries yet.</p>;
  return (
    <ul className="space-y-2">
      {entries.map((e) => (
        <li key={e.id} className="rounded-xl border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
          <Link href={`/journal/${e.id}`} className="font-medium line-clamp-1">{e.title || "Untitled"}</Link>
        </li>
      ))}
    </ul>
  );
}
TSX

# ---------- Privacy ----------
cat > "$APP_DIR/privacy/page.mdx" <<'MDX'
export const metadata = { title: "Privacy Policy — YouStillMatter" }

# Privacy Policy

_Last updated: September 28, 2025_

We value your privacy. This app is designed to minimize the collection of personal data and to give you control over your information.

## What we collect
- **App preferences** (e.g., theme, notifications) stored locally on your device.
- **Journal entries & screenings** are stored locally by default.

## How we use data
- To provide core functionality (e.g., remembering settings).
- To improve user experience and accessibility of mental health tools.

## What we don’t do
- We do not sell your data.
- We do not use your journal content for advertising or profiling.

## Data retention & deletion
- You can delete local data at any time from **Tools → Settings**.

## Security
We use reasonable safeguards. No method of transmission or storage is 100% secure. Do not rely on this app for emergency communication.

## Children’s privacy
The app is not intended for children under 13 without a parent/guardian.

## Contact
**hello@youstillmatter.org**
MDX

# ---------- Terms ----------
cat > "$APP_DIR/terms/page.mdx" <<'MDX'
export const metadata = { title: "Terms of Use — YouStillMatter" }

# Terms of Use

_Last updated: September 28, 2025_

By using the YouStillMatter app or website, you agree to these terms.

## Not medical advice
Tools are for educational and self-support purposes only and do not constitute medical advice. If you are in crisis, use the **Crisis** button or contact emergency services.

## Acceptable use
Do not misuse the app, interfere with its operation, or attempt to access other users’ data.

## Accounts & content
If future features allow accounts:
- You’re responsible for safeguarding your login.
- You retain rights to your journal entries and other content.
- We only process your data to provide the service.

## Disclaimers & liability
The service is provided “as is.” To the fullest extent allowed by law, we disclaim warranties and limit liability.

## Changes
We may update these terms. Continued use constitutes acceptance.

## Contact
**hello@youstillmatter.org**
MDX

# ---------- Screeners shared ----------
cat > "$SCR_DIR/ScreenerShared.tsx" <<'TSX'
"use client";
import { useMemo } from "react";

export type Option = { label: string; value: number };
export const fourPoint: Option[] = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export function useTotal(responses: Record<number, number>) {
  return useMemo(
    () => Object.values(responses).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0),
    [responses]
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border px-2 py-0.5 text-xs">{children}</span>;
}
TSX

# ---------- PHQ-9 ----------
cat > "$SCR_DIR/PHQ9.tsx" <<'TSX'
"use client";
import { useState } from "react";
import { fourPoint, useTotal, Badge } from "./ScreenerShared";

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
];

function interpretPHQ9(total: number) {
  if (total <= 4) return "Minimal";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  if (total <= 19) return "Moderately severe";
  return "Severe";
}

export default function PHQ9({ onSave }: { onSave?: (score: number, responses: number[]) => void }) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const total = useTotal(responses);

  const save = () => {
    const arr = Array.from({length: 9}, (_, i) => responses[i] ?? 0);
    onSave?.(total, arr);
    try {
      const historyRaw = localStorage.getItem("ysm:phq9") || "[]";
      const history = JSON.parse(historyRaw as string);
      (history as any[]).unshift({ ts: Date.now(), total, responses: arr });
      localStorage.setItem("ysm:phq9", JSON.stringify((history as any[]).slice(0, 25)));
      alert("PHQ-9 saved locally.");
    } catch {}
  };

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">PHQ-9 (Depression Screener)</h2>
        <Badge>Total: {total} — {interpretPHQ9(total)}</Badge>
      </header>
      <ol className="space-y-3">
        {questions.map((q, idx) => (
          <li key={idx} className="grid gap-2 sm:grid-cols-[1fr,auto] sm:items-center">
            <span>{idx+1}. {q}</span>
            <div className="flex gap-2 flex-wrap">
              {fourPoint.map(opt => (
                <label key={opt.value} className="inline-flex items-center gap-1">
                  <input type="radio" name={`phq9-${idx}`} value={opt.value}
                    onChange={() => setResponses(r => ({...r, [idx]: opt.value}))}/>
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <button className="rounded-xl border px-4 py-2 font-semibold hover:shadow" onClick={save}>Save result</button>
        <a className="text-sm underline" href="/privacy">Privacy notice</a>
      </div>
      <p className="text-xs text-gray-500">
        This screening tool is not a diagnosis. If you scored high or have any self-harm thoughts, use the Crisis button or contact emergency services.
      </p>
    </section>
  );
}
TSX

# ---------- GAD-7 ----------
cat > "$SCR_DIR/GAD7.tsx" <<'TSX'
"use client";
import { useState } from "react";
import { fourPoint, useTotal, Badge } from "./ScreenerShared";

const questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

function interpretGAD7(total: number) {
  if (total <= 4) return "Minimal";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  return "Severe";
}

export default function GAD7({ onSave }: { onSave?: (score: number, responses: number[]) => void }) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const total = useTotal(responses);

  const save = () => {
    const arr = Array.from({length: 7}, (_, i) => responses[i] ?? 0);
    onSave?.(total, arr);
    try {
      const historyRaw = localStorage.getItem("ysm:gad7") || "[]";
      const history = JSON.parse(historyRaw as string);
      (history as any[]).unshift({ ts: Date.now(), total, responses: arr });
      localStorage.setItem("ysm:gad7", JSON.stringify((history as any[]).slice(0, 25)));
      alert("GAD-7 saved locally.");
    } catch {}
  };

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">GAD-7 (Anxiety Screener)</h2>
        <Badge>Total: {total} — {interpretGAD7(total)}</Badge>
      </header>
      <ol className="space-y-3">
        {questions.map((q, idx) => (
          <li key={idx} className="grid gap-2 sm:grid-cols-[1fr,auto] sm:items-center">
            <span>{idx+1}. {q}</span>
            <div className="flex gap-2 flex-wrap">
              {fourPoint.map(opt => (
                <label key={opt.value} className="inline-flex items-center gap-1">
                  <input type="radio" name={`gad7-${idx}`} value={opt.value}
                    onChange={() => setResponses(r => ({...r, [idx]: opt.value}))}/>
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <button className="rounded-xl border px-4 py-2 font-semibold hover:shadow" onClick={save}>Save result</button>
        <a className="text-sm underline" href="/privacy">Privacy notice</a>
      </div>
      <p className="text-xs text-gray-500">
        This screening tool is not a diagnosis. Please seek professional support if you have concerns about your mental health.
      </p>
    </section>
  );
}
TSX

# ---------- Screeners page ----------
cat > "$APP_DIR/tools/screeners/page.tsx" <<'TSX'
"use client";
import PHQ9 from "@/components/screeners/PHQ9";
import GAD7 from "@/components/screeners/GAD7";

export default function ScreenersPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Screening Tools</h1>
      <PHQ9 />
      <GAD7 />
    </main>
  );
}
TSX

# ---------- Tools index (if missing) ----------
if [ ! -f "$APP_DIR/tools/page.tsx" ]; then
cat > "$APP_DIR/tools/page.tsx" <<'TSX'
export default function ToolsIndex() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tools</h1>
      <ul className="list-disc pl-6 space-y-1">
        <li><a className="underline" href="/tools/screeners">Screeners (PHQ-9 & GAD-7)</a></li>
        <li><a className="underline" href="/tools/settings">Settings</a></li>
      </ul>
    </main>
  );
}
TSX
fi

# ---------- Ensure package scripts exist ----------
if [ -f package.json ]; then
  node - <<'NODE'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.postinstall = pkg.scripts.postinstall || "echo Ready";
pkg.scripts.dev = pkg.scripts.dev || "next dev -p 3000";
pkg.scripts.build = pkg.scripts.build || "next build";
pkg.scripts.start = pkg.scripts.start || "next start -p 3000";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log("Updated package.json scripts ✅");
NODE
fi

echo "All set! ✅"
echo "• Pages: /tools/settings, /tools/screeners, /privacy, /terms"
echo "• Crisis button centered; NavBar injected into layout.tsx (backup: layout.tsx.bak)"
echo "• Journal titles-only component at $JRN_DIR/JournalList.tsx"
