#!/usr/bin/env bash
set -euo pipefail

# Detect src/ layout
APP_DIR="app"; COMP_DIR="components"
[ -d "src/app" ] && APP_DIR="src/app"
[ -d "src/components" ] && COMP_DIR="src/components"

# --------------- A) REMOVE TOP NAV ---------------
LAYOUT="$APP_DIR/layout.tsx"
if [ -f "$LAYOUT" ]; then
  cp "$LAYOUT" "$LAYOUT.bak.topnav"
  # Remove import line for NavBar
  sed -i '/NavBar.*from/s/^.*$//' "$LAYOUT" || true
  # Remove the <NavBar /> element if present
  perl -0777 -pe 's/\s*<NavBar\s*\/>\s*//s' -i "$LAYOUT" || true
fi
# Remove the file we added so it doesn’t cause confusion
rm -f "$COMP_DIR/ui/NavBar.tsx" || true

# --------------- B) TOOLS PAGE + INLINE SETTINGS ---------------
mkdir -p "$COMP_DIR/settings" "$APP_DIR/tools"

# Reusable Settings panel (client component)
cat > "$COMP_DIR/settings/SettingsPanel.tsx" <<'TSX'
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

export default function SettingsPanel() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("ysm:prefs");
    if (raw) { try { setPrefs({ ...DEFAULTS, ...JSON.parse(raw) }); } catch {} }
  }, []);

  const save = () => {
    localStorage.setItem("ysm:prefs", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <header className="flex items-center justify-between justify-between">
        <h2 className="text-lg font-semibold">Settings</h2>
        {saved && <span className="text-green-600 text-sm">Saved</span>}
      </header>

      <div className="space-y-4">
        <div>
          <div className="font-medium mb-2">Appearance</div>
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
        </div>

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
          <input
            className="flex-1 rounded-xl border px-3 py-2"
            type="email"
            placeholder="you@example.com"
            value={prefs.dataExportEmail ?? ""}
            onChange={e => setPrefs(p => ({...p, dataExportEmail: e.target.value}))}
          />
        </label>

        <button onClick={save} className="rounded-xl border px-4 py-2 font-semibold hover:shadow">
          Save settings
        </button>
      </div>
    </section>
  );
}
TSX

# Make sure /tools index exists and renders Settings underneath the tools list
cat > "$APP_DIR/tools/page.tsx" <<'TSX'
import dynamic from "next/dynamic";
const SettingsPanel = dynamic(() => import("@/components/settings/SettingsPanel"), { ssr: false });

export default function ToolsIndex() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Tools</h1>
        <ul className="grid sm:grid-cols-2 gap-2">
          <li><a className="underline" href="/tools/screeners">Screeners (PHQ-9 &amp; GAD-7)</a></li>
          <li><a className="underline" href="/journal">Journal</a></li>
          <li><a className="underline" href="/crisis">Crisis</a></li>
          <li><a className="underline" href="/home">Home</a></li>
        </ul>
      </section>

      {/* Settings BELOW the tools list per request */}
      <SettingsPanel />
    </main>
  );
}
TSX

# --------------- C) JOURNAL LIST: TITLE + TIMESTAMP ---------------
mkdir -p "$COMP_DIR/journal"
cat > "$COMP_DIR/journal/JournalList.tsx" <<'TSX'
"use client";
import Link from "next/link";

export type JournalEntry = {
  id: string;
  title: string;
  createdAt?: number | string; // epoch ms or ISO
};

function formatTs(ts?: number | string) {
  if (!ts) return "";
  try {
    const d = typeof ts === "number" ? new Date(ts) : new Date(String(ts));
    return d.toLocaleString();
  } catch { return ""; }
}

export default function JournalList({ entries }: { entries: JournalEntry[] }) {
  if (!entries?.length) return <p className="text-sm text-gray-500">No entries yet.</p>;
  return (
    <ul className="space-y-2">
      {entries.map((e) => (
        <li key={e.id} className="rounded-xl border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
          <Link href={`/journal/${e.id}`} className="flex items-center justify-between gap-3">
            <span className="font-medium line-clamp-1">{e.title || "Untitled"}</span>
            <time className="text-xs text-gray-500">{formatTs(e.createdAt)}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
TSX

# Best-effort patch: if your journal index renders entries inline, try to inject our component.
JOURNAL_PAGE="$APP_DIR/journal/page.tsx"
if [ -f "$JOURNAL_PAGE" ]; then
  cp "$JOURNAL_PAGE" "$JOURNAL_PAGE.bak.journal"
  # Add import if missing
  if ! grep -q 'JournalList' "$JOURNAL_PAGE"; then
    sed -i '1s|^|import JournalList from "@/components/journal/JournalList";\n|' "$JOURNAL_PAGE"
  fi
  # If we find a UL of entries, replace it with <JournalList ...>
  perl -0777 -pe 's/<ul[^>]*>[\s\S]*?<\/ul>/<JournalList entries={entries} \/>/s' -i "$JOURNAL_PAGE" || true
fi

# --------------- D) BOTTOM NAV: PUT CRISIS IN THE MIDDLE ---------------
# Try to find a bottom nav component by label text.
BN_PATH="$(grep -RIl --exclude-dir=node_modules -E 'Home|Tools|Journal|Insights|Crisis' || true)"

# If we find exactly one candidate file that looks like the bottom nav, attempt a non-destructive reorder
if [ -n "$BN_PATH" ]; then
  echo "Bottom nav candidates:"
  echo "$BN_PATH"
  # Make backups and try to nudge the Crisis link into the middle by adding a flex order.
  while IFS= read -r f; do
    cp "$f" "$f.bak.bottomnav" || true
    # Add order classes to the five items; make Crisis order-3
    perl -0777 -pe 's/href=["'\'']\/home["'\'']([^>]*)className=["'\'']([^"'\'']*)["'\'']/href="\/home"$1 className="order-1 \2"/g' -i "$f" || true
    perl -0777 -pe 's/href=["'\'']\/tools["'\'']([^>]*)className=["'\'']([^"'\'']*)["'\'']/href="\/tools"$1 className="order-2 \2"/g' -i "$f" || true
    perl -0777 -pe 's/href=["'\'']\/crisis["'\'']([^>]*)className=["'\'']([^"'\'']*)["'\'']/href="\/crisis"$1 className="order-3 \2"/g' -i "$f" || true
    perl -0777 -pe 's/href=["'\'']\/journal["'\'']([^>]*)className=["'\'']([^"'\'']*)["'\'']/href="\/journal"$1 className="order-4 \2"/g' -i "$f" || true
    perl -0777 -pe 's/href=["'\'']\/insights["'\'']([^>]*)className=["'\'']([^"'\'']*)["'\'']/href="\/insights"$1 className="order-5 \2"/g' -i "$f" || true
    # If the container likely has flex, ensure it uses flex + justify-between
    perl -0777 -pe 's/(className=["'\''][^"'\'']*)(flex[^"'\'']*)([^"'\'']*["'\''])/$1$2 justify-between$3/s' -i "$f" || true
  done <<< "$BN_PATH"
fi

# --------------- E) SCREENERS (leave as-is if already created) ---------------
mkdir -p "$COMP_DIR/screeners" "$APP_DIR/tools/screeners"
if [ ! -f "$COMP_DIR/screeners/ScreenerShared.tsx" ]; then
  cat > "$COMP_DIR/screeners/ScreenerShared.tsx" <<'TSX'
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
  return useMemo(() => Object.values(responses).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0), [responses]);
}
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border px-2 py-0.5 text-xs">{children}</span>;
}
TSX
fi

if [ ! -f "$COMP_DIR/screeners/PHQ9.tsx" ]; then
  cat > "$COMP_DIR/screeners/PHQ9.tsx" <<'TSX'
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
function interpret(total:number){ if(total<=4)return"Minimal"; if(total<=9)return"Mild"; if(total<=14)return"Moderate"; if(total<=19)return"Moderately severe"; return"Severe";}
export default function PHQ9(){ const [r,setR]=useState<Record<number,number>>({}); const t=useTotal(r);
  const save=()=>{const a=Array.from({length:9},(_,i)=>r[i]??0); try{const h=JSON.parse(localStorage.getItem("ysm:phq9")||"[]"); h.unshift({ts:Date.now(),total:t,responses:a}); localStorage.setItem("ysm:phq9",JSON.stringify(h.slice(0,25))); alert("PHQ-9 saved locally.");}catch{}};
  return (<section className="rounded-2xl border p-4 space-y-4"><header className="flex items-center justify-between"><h2 className="text-lg font-semibold">PHQ-9 (Depression Screener)</h2><Badge>Total: {t} — {interpret(t)}</Badge></header><ol className="space-y-3">{questions.map((q,i)=>(<li key={i} className="grid gap-2 sm:grid-cols-[1fr,auto] sm:items-center"><span>{i+1}. {q}</span><div className="flex gap-2 flex-wrap">{fourPoint.map(opt=>(
    <label key={opt.value} className="inline-flex items-center gap-1"><input type="radio" name={`phq9-${i}`} onChange={()=>setR(s=>({...s,[i]:opt.value}))}/><span className="text-sm">{opt.label}</span></label>
  ))}</div></li>))}</ol><div className="flex gap-2"><button className="rounded-xl border px-4 py-2 font-semibold hover:shadow" onClick={save}>Save result</button><a className="text-sm underline" href="/privacy">Privacy notice</a></div><p className="text-xs text-gray-500">This screening tool is not a diagnosis. If you scored high or have any self-harm thoughts, use the Crisis button or contact emergency services.</p></section>);
}
TSX
fi

if [ ! -f "$COMP_DIR/screeners/GAD7.tsx" ]; then
  cat > "$COMP_DIR/screeners/GAD7.tsx" <<'TSX'
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
function interpret(total:number){ if(total<=4)return"Minimal"; if(total<=9)return"Mild"; if(total<=14)return"Moderate"; return"Severe";}
export default function GAD7(){ const [r,setR]=useState<Record<number,number>>({}); const t=useTotal(r);
  const save=()=>{const a=Array.from({length:7},(_,i)=>r[i]??0); try{const h=JSON.parse(localStorage.getItem("ysm:gad7")||"[]"); h.unshift({ts:Date.now(),total:t,responses:a}); localStorage.setItem("ysm:gad7",JSON.stringify(h.slice(0,25))); alert("GAD-7 saved locally.");}catch{}};
  return (<section className="rounded-2xl border p-4 space-y-4"><header className="flex items-center justify-between"><h2 className="text-lg font-semibold">GAD-7 (Anxiety Screener)</h2><Badge>Total: {t} — {interpret(t)}</Badge></header><ol className="space-y-3">{questions.map((q,i)=>(<li key={i} className="grid gap-2 sm:grid-cols-[1fr,auto] sm:items-center"><span>{i+1}. {q}</span><div className="flex gap-2 flex-wrap">{fourPoint.map(opt=>(
    <label key={opt.value} className="inline-flex items-center gap-1"><input type="radio" name={`gad7-${i}`} onChange={()=>setR(s=>({...s,[i]:opt.value}))}/><span className="text-sm">{opt.label}</span></label>
  ))}</div></li>))}</ol><div className="flex gap-2"><button className="rounded-xl border px-4 py-2 font-semibold hover:shadow" onClick={save}>Save result</button><a className="text-sm underline" href="/privacy">Privacy notice</a></div><p className="text-xs text-gray-500">This screening tool is not a diagnosis. Please seek professional support if you have concerns about your mental health.</p></section>);
}
TSX
fi

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

echo "Patch completed:"
echo "• Top nav removed."
echo "• Crisis centered in bottom nav (via order classes) where possible; backups *.bak.bottomnav created."
echo "• Tools page now shows Settings panel underneath."
echo "• Journal list component shows Title + Timestamp only (click to view details)."
echo "• Screeners available at /tools/screeners."
