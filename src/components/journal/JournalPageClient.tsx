"use client";
import { useEffect, useMemo, useState } from "react";
import { useJournalStore } from "@/stores/useJournalStore";
import JournalForm from "./JournalForm";
import JournalList from "./JournalList";

export default function JournalPageClient() {
  const load = useJournalStore(s => s.load);
  const entries = useJournalStore(s => s.entries);
  const loaded = useJournalStore(s => s.loaded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); load(); }, [load]);

  const view = useMemo(() => {
    return entries.map(e => ({ id: e.id, title: e.title, createdAt: e.createdAt }));
  }, [entries]);

  if (!mounted || !loaded) {
    return <main className="mx-auto max-w-3xl p-6"><p className="text-sm text-gray-500">Loading…</p></main>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Journal</h1>
      <JournalForm />
      <section className="space-y-2">
        <h2 className="font-semibold">Entries</h2>
        <JournalList entries={view} />
      </section>
    </main>
  );
}
