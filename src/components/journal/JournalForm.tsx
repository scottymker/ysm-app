"use client";
import { useState, useEffect } from "react";
import { useJournalStore } from "@/stores/useJournalStore";
import { useRouter } from "next/navigation";

export default function JournalForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const addEntry = useJournalStore(s => s.addEntry);
  const load = useJournalStore(s => s.load);
  const router = useRouter();

  useEffect(() => { load(); }, [load]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = addEntry(title, content);
    setTitle("");
    setContent("");
    router.push(`/journal/${entry.id}`);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border p-4 space-y-3">
      <h2 className="text-lg font-semibold">New entry</h2>
      <input
        className="w-full rounded-xl border px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="w-full min-h-[120px] rounded-xl border px-3 py-2"
        placeholder="Write your thoughts…"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded-xl border px-4 py-2 font-semibold hover:shadow">
          Add entry
        </button>
        <button type="button" onClick={() => { setTitle(""); setContent(""); }} className="rounded-xl border px-4 py-2">
          Clear
        </button>
      </div>
    </form>
  );
}
