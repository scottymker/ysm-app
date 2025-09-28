import { NotebookPen } from "lucide-react";

import { useState } from "react";

export function JournalEntryForm({ onAddEntry }: { onAddEntry: (entry: string) => void }) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      onAddEntry(value.trim());
      setValue("");
    }
  }

  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="New Journal Entry">
      <div className="flex items-center gap-2 mb-2 justify-between"><NotebookPen className="text-sky-500" /> <h2 className="text-lg font-bold">New Journal Entry</h2></div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full rounded-lg border border-divider p-2 mb-2"
          rows={4}
          placeholder="Write your thoughts..."
          aria-label="Journal entry"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button type="submit" className="bg-sky-500 text-white rounded-lg px-4 py-2">Save Entry</button>
      </form>
    </section>
  );
}

export function JournalList({ entries }: { entries: string[] }) {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Journal Entries">
      <h2 className="text-lg font-bold mb-2">Your Journal Entries</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-600">No entries yet. Start by writing your first journal entry above.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry, idx) => (
            <li key={idx} className="bg-surface-light border border-divider rounded p-2 text-sm text-gray-800 whitespace-pre-line">{entry}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
