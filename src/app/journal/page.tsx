"use client";

import { useJournalStore } from "@/stores/useJournalStore";

export default function JournalPage(){
  const { entries, remove } = useJournalStore();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Journal</h1>
      {entries.length === 0 ? (
        <p className="mt-4 opacity-80">No entries yet. Grounding saves a summary here.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {entries.map(e => (
            <li key={e.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <time className="text-sm opacity-70">{new Date(e.dateISO).toLocaleString()}</time>
                <button className="rounded-lg border px-2 py-1 text-sm" onClick={()=>remove(e.id)}>Delete</button>
              </div>
              {e.tags?.length ? <p className="mt-1 text-xs opacity-70">Tags: {e.tags.join(", ")}</p> : null}
              <pre className="mt-2 whitespace-pre-wrap text-sm">{e.body}</pre>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
