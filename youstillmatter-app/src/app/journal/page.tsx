import { JournalList, JournalEntryForm } from "../../components/Journal";
import { useState } from "react";

export default function JournalPage() {
  const [entries, setEntries] = useState<string[]>([]);

  function handleAddEntry(entry: string) {
    setEntries([entry, ...entries]);
  }

  return (
    <main className="min-h-screen bg-surface-light text-ink flex flex-col items-center px-4 py-8 justify-between">
      <JournalEntryForm onAddEntry={handleAddEntry} />
      <JournalList entries={entries} />
    </main>
  );
}
