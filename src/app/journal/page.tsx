"use client";

import { useState } from "react";
import { useJournalStore, type JournalEntry } from "@/stores/useJournalStore";

function EntryForm({
  initial,
  onSave,
  onCancel
}: {
  initial?: Partial<JournalEntry>;
  onSave: (v: { title: string; body: string }) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave({ title, body }); }}
      className="rounded-xl border p-4 space-y-3"
    >
      <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Title"
        className="w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
      />
      <textarea
        value={body}
        onChange={(e)=>setBody(e.target.value)}
        placeholder="Write your thoughts…"
        aria-label="Body"
        className="h-32 w-full resize-vertical rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
      />
      <div className="flex gap-2">
        <button className="rounded-xl border px-4 py-2" type="submit">Save</button>
        {onCancel && <button className="rounded-xl border px-4 py-2" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default function JournalPage() {
  const { entries, add, update, remove } = useJournalStore();
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Journal</h1>

      {/* Create */}
      {!editing && (
        <EntryForm
          onSave={({ title, body }) => {
            if (!title && !body) return;
            add({ title, body });
          }}
        />
      )}

      {/* List */}
      <ul className="space-y-4">
        {entries.length === 0 && <li className="opacity-70">No entries yet. Start by writing a quick note above.</li>}
        {entries.map((e) => (
          <li key={e.id} className="rounded-xl border p-4">
            {editing === e.id ? (
              <EntryForm
                initial={e}
                onSave={({ title, body }) => {
                  update(e.id, { title, body });
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{e.title || "(Untitled)"}</div>
                    <div className="text-sm opacity-80 whitespace-pre-wrap mt-1">{e.body}</div>
                  </div>
                  <div className="shrink-0 flex gap-2">
                    <button className="rounded-xl border px-3 py-1 text-sm" onClick={()=>setEditing(e.id)} aria-label={`Edit ${e.title || "entry"}`}>Edit</button>
                    <button className="rounded-xl border px-3 py-1 text-sm" onClick={()=>remove(e.id)} aria-label={`Delete ${e.title || "entry"}`}>Delete</button>
                  </div>
                </div>
                <div className="mt-2 text-xs opacity-60">
                  {new Date(e.updatedAt).toLocaleString()}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
