"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function SettingsPage() {
  const { theme, reducedMotion, analytics, setTheme, setReducedMotion, setAnalytics } = useSettingsStore();

  // apply theme + reduced motion to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.setProperty("scroll-behavior", reducedMotion ? "auto" : "smooth");
  }, [theme, reducedMotion]);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>

      <section className="rounded-xl border p-4 space-y-3" aria-labelledby="theme">
        <div id="theme" className="font-medium">Theme</div>
        <div className="flex gap-2">
          {(["system","light","dark"] as const).map(t => (
            <button key={t}
              className={`rounded-xl border px-3 py-2 text-sm ${theme===t?"border-[color:var(--color-primary)]":""}`}
              onClick={()=>setTheme(t)} aria-pressed={theme===t}>
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border p-4 space-y-3" aria-labelledby="motion">
        <div id="motion" className="font-medium">Reduced motion</div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={reducedMotion} onChange={e=>setReducedMotion(e.target.checked)} />
          Minimize animations
        </label>
      </section>

      <section className="rounded-xl border p-4 space-y-3" aria-labelledby="analytics">
        <div id="analytics" className="font-medium">Analytics</div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)} />
          Opt-in to anonymous usage analytics (off by default)
        </label>
      </section>
    </main>
  );
}
