import { create } from "zustand";

export type JournalEntry = {
  id: string;
  dateISO: string;
  body: string;
  tags?: string[];
};

type State = {
  entries: JournalEntry[];
  add: (e: Omit<JournalEntry, "id" | "dateISO"> & Partial<Pick<JournalEntry,"tags">>) => JournalEntry;
  remove: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "ysm_journal_v1";

function load(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

export const useJournalStore = create<State>((set, get) => ({
  entries: typeof window === "undefined" ? [] : load(),
  add: (e) => {
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      dateISO: new Date().toISOString(),
      body: e.body,
      tags: e.tags ?? [],
    };
    const next = [entry, ...get().entries];
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ entries: next });
    return entry;
  },
  remove: (id) => {
    const next = get().entries.filter((x) => x.id !== id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ entries: next });
  },
  clear: () => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    set({ entries: [] });
  },
}));
