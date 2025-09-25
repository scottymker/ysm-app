"use client";

import Link from "next/link";
import { useJournalStore } from "@/stores/useJournalStore";
import { useMoodStore } from "@/stores/useMoodStore"; // already created earlier by the agent
import { downloadJSON, pickJSON } from "@/lib/backup";

export default function InsightsPage() {
  const journal = useJournalStore();
  const mood = useMoodStore();

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Insights</h1>

      <section className="rounded-xl border p-4">
        <h2 className="font-medium">Back up your data</h2>
        <p className="text-sm opacity-80">Exports a JSON file with your Journal and Mood entries.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-xl border px-3 py-2 text-sm"
            onClick={() => downloadJSON("ysm-backup.json", {
              journal: journal.entries,
              mood: mood.entries ?? mood.history ?? []
            })}
          >Export</button>

          <button
            className="rounded-xl border px-3 py-2 text-sm"
            onClick={async () => {
              const payload = await pickJSON<{ journal?: any[]; mood?: any[] }>();
              if (!payload) return;
              if (Array.isArray(payload.journal)) {
                journal.clear();
                payload.journal.forEach((e: any) =>
                  journal.add({ title: e.title || "", body: e.body || "" })
                );
              }
              if (Array.isArray(payload.mood) && mood.add) {
                payload.mood.forEach((m: any) =>
                  mood.add({ score: Number(m.score)||5, tags: m.tags||[], note: m.note||"" })
                );
              }
              alert("Import complete.");
            }}
          >Import</button>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="font-medium">Explore</h2>
        <div className="mt-2 flex gap-2">
          <Link className="rounded-xl border px-3 py-2 text-sm" href="/journal">Journal</Link>
          <Link className="rounded-xl border px-3 py-2 text-sm" href="/checkin">Add Mood</Link>
        </div>
      </section>
    </main>
  );
}
