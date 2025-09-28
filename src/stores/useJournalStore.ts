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
