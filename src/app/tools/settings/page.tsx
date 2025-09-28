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
