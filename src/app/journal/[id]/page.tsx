"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJournalStore } from "@/stores/useJournalStore";

export default function JournalEntryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const load = useJournalStore(s => s.load);
  const getById = useJournalStore(s => s.getById);
  const update = useJournalStore(s => s.updateEntry);
  const remove = useJournalStore(s => s.removeEntry);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const entry = useMemo(() => (id ? getById(id) : undefined), [id, getById]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    }
  }, [entry?.id]); // eslint-disable-line

  if (!id) return null;

  if (!entry) {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <p className="text-sm text-gray-500">Entry not found.</p>
        <button className="rounded-xl border px-4 py-2" onClick={() => router.push("/journal")}>
          Back to Journal
        </button>
      </main>
    );
  }

  const onSave = () => {
    update(entry.id, { title, content });
  };
  const onDelete = () => {
    remove(entry.id);
    router.push("/journal");
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit entry</h1>
      <input
        className="w-full rounded-xl border px-3 py-2"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="w-full min-h-[200px] rounded-xl border px-3 py-2"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={onSave} className="rounded-xl border px-4 py-2 font-semibold hover:shadow">Save</button>
        <button onClick={onDelete} className="rounded-xl border px-4 py-2">Delete</button>
        <button onClick={() => router.push("/journal")} className="rounded-xl border px-4 py-2">Back</button>
      </div>
    </main>
  );
}
