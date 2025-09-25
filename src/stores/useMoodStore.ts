import { create } from "zustand";

export type MoodEntry = {
  id: string;
  dateISO: string;
  score: number;       // 1-10
  tags: string[];      // emotion chips
  note?: string;
};

type State = {
  entries: MoodEntry[];
  add: (e: Omit<MoodEntry, "id" | "dateISO">) => MoodEntry;
  remove: (id: string) => void;
  clear: () => void;
};

const KEY = "ysm_mood_v1";

function safeLoad(): MoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MoodEntry[]) : [];
  } catch { return []; }
}

export const useMoodStore = create<State>((set, get) => ({
  entries: typeof window === "undefined" ? [] : safeLoad(),
  add: (e) => {
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      dateISO: new Date().toISOString(),
      score: Math.max(1, Math.min(10, e.score)),
      tags: e.tags ?? [],
      note: e.note?.trim() || undefined,
    };
    const next = [entry, ...get().entries];
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
    set({ entries: next });
    return entry;
  },
  remove: (id) => {
    const next = get().entries.filter(x => x.id !== id);
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
    set({ entries: next });
  },
  clear: () => {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
    set({ entries: [] });
  },
}));
