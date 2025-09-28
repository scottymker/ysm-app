"use client";
import SettingsPanel from "../../components/settings/SettingsPanel";

function Tile({
  href,
  label,
  sub,
}: { href: string; label: string; sub?: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl border px-5 py-4 hover:shadow-md transition flex items-center justify-between"
    >
      <div>
        <div className="font-semibold">{label}</div>
        {sub ? <div className="text-xs text-gray-500">{sub}</div> : null}
      </div>
      <span className="text-sm opacity-70">Open →</span>
    </a>
  );
}

export default function ToolsIndex() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Tools</h1>

        {/* Button-style tiles */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Tile
            href="/tools/screeners"
            label="Screeners (PHQ-9 & GAD-7)"
            sub="Quick self-screens with local save"
          />
          <Tile
            href="/journal"
            label="Journal"
            sub="Write, edit, delete entries"
          />
          <Tile
            href="/crisis"
            label="Crisis"
            sub="Emergency resources"
          />
          <Tile
            href="/home"
            label="Home"
            sub="Calming tools & grounding"
          />
        </div>
      </section>

      {/* Settings BELOW the buttons */}
      <SettingsPanel />
    </main>
  );
}
