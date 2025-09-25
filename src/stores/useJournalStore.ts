import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JournalEntry = {
  id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  body: string;
};

type State = {
  entries: JournalEntry[];
  add: (e: Omit<JournalEntry, "id"|"createdAt"|"updatedAt">) => string;
  update: (id: string, patch: Partial<Omit<JournalEntry,"id"|"createdAt">>) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useJournalStore = create<State>()(persist(
  (set, get) => ({
    entries: [],
    add: (e) => {
      const id = crypto.randomUUID();
      const now = Date.now();
      set({ entries: [{ id, createdAt: now, updatedAt: now, ...e }, ...get().entries] });
      return id;
    },
    update: (id, patch) => set({
      entries: get().entries.map(x => x.id === id ? { ...x, ...patch, updatedAt: Date.now() } : x)
    }),
    remove: (id) => set({ entries: get().entries.filter(x => x.id !== id) }),
    clear: () => set({ entries: [] }),
  }),
  { name: "ysm_journal_v1" }
));
