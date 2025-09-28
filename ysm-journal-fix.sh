#!/usr/bin/env bash
set -euo pipefail

APP_DIR="src/app"
COMP_DIR="src/components"
STORE_DIR="src/stores"

mkdir -p "$COMP_DIR/journal" "$STORE_DIR" "$APP_DIR/journal" "$APP_DIR/journal/[id]"

# --- Zustand store (localStorage-persisted) ---
cat > "$STORE_DIR/useJournalStore.ts" <<'TS'
"use client";
import { create } from "zustand";

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

type State = {
  entries: JournalEntry[];
  loaded: boolean;
  addEntry: (title: string, content: string) => JournalEntry;
  updateEntry: (id: string, patch: Partial<Pick<JournalEntry,"title"|"content">>) => void;
  removeEntry: (id: string) => void;
  getById: (id: string) => JournalEntry | undefined;
  load: () => void;
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useJournalStore = create<State>((set, get) => ({
  entries: [],
  loaded: false,

  load: () => {
    if (get().loaded) return;
    try {
      const raw = localStorage.getItem("ysm:journal") || "[]";
      const parsed = JSON.parse(raw) as JournalEntry[];
      set({ entries: parsed, loaded: true });
    } catch {
      set({ entries: [], loaded: true });
    }
  },

  addEntry: (title: string, content: string) => {
    const now = Date.now();
    const entry: JournalEntry = {
      id: uid(),
      title: title?.trim() || "Untitled",
      content: content?.trim() || "",
      createdAt: now,
      updatedAt: now,
    };
    const next = [entry, ...get().entries];
    set({ entries: next });
    try { localStorage.setItem("ysm:journal", JSON.stringify(next)); } catch {}
    return entry;
  },

  updateEntry: (id, patch) => {
    const next = get().entries.map(e =>
      e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e
    );
    set({ entries: next });
    try { localStorage.setItem("ysm:journal", JSON.stringify(next)); } catch {}
  },

  removeEntry: (id) => {
    const next = get().entries.filter(e => e.id !== id);
    set({ entries: next });
    try { localStorage.setItem("ysm:journal", JSON.stringify(next)); } catch {}
  },

  getById: (id) => get().entries.find(e => e.id === id),
}));
TS

# --- Titles + timestamp list (click-through) ---
cat > "$COMP_DIR/journal/JournalList.tsx" <<'TSX'
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
TSX

# --- New entry form ---
cat > "$COMP_DIR/journal/JournalForm.tsx" <<'TSX'
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
TSX

# --- Journal home: client page wrapper (list + form) ---
cat > "$COMP_DIR/journal/JournalPageClient.tsx" <<'TSX'
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
TSX

# --- Journal entry detail page (client) ---
cat > "$APP_DIR/journal/[id]/page.tsx" <<'TSX'
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
TSX

# --- Journal index page (server -> renders client directly) ---
cat > "$APP_DIR/journal/page.tsx" <<'TSX'
import JournalPageClient from "../../components/journal/JournalPageClient";
export default function JournalPage() { return <JournalPageClient />; }
TSX

echo "Journal stack updated:"
echo "• Store: $STORE_DIR/useJournalStore.ts"
echo "• Components: $COMP_DIR/journal/{JournalForm,JournalList,JournalPageClient}.tsx"
echo "• Pages: $APP_DIR/journal/page.tsx and $APP_DIR/journal/[id]/page.tsx"
