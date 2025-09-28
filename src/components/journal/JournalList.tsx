"use client";
import Link from "next/link";

export type JournalListEntry = {
  id: string;
  title: string;
  createdAt?: number | string;
};

function fmt(ts?: number | string) {
  if (!ts) return "";
  const d = typeof ts === "number" ? new Date(ts) : new Date(String(ts));
  return isNaN(d.getTime()) ? "" : d.toLocaleString();
}

export default function JournalList({ entries }: { entries: JournalListEntry[] }) {
  if (!entries?.length) return <p className="text-sm text-gray-500">No entries yet.</p>;
  return (
    <ul className="space-y-2">
      {entries.map(e => (
        <li key={e.id} className="rounded-xl border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
          <Link href={`/journal/${e.id}`} className="flex items-center justify-between gap-3">
            <span className="font-medium line-clamp-1">{e.title || "Untitled"}</span>
            <time className="text-xs text-gray-500">{fmt(e.createdAt)}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
