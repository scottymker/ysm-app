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
      <header className="flex items-center justify-between">
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
