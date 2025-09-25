import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CareItem = {
  id: string;
  text: string;
  category: string;
  builtIn?: boolean; // true for default suggestions (can't delete), false for user-added
};

type State = {
  template: CareItem[];                 // the checklist template (defaults + custom)
  doneByDate: Record<string, string[]>; // YYYY-MM-DD -> array of item ids completed
  addItem: (text: string, category: string) => void;
  removeItem: (id: string) => void;     // only for custom items
  toggle: (id: string, dateKey: string) => void;
  resetDay: (dateKey: string) => void;
  clearAllProgress: () => void;
};

const DEFAULTS: CareItem[] = [
  { id: "g-breathe", text: "2 minutes of calm breathing", category: "Grounding", builtIn: true },
  { id: "g-54321", text: "5-4-3-2-1 senses exercise", category: "Grounding", builtIn: true },
  { id: "m-stretch", text: "Gentle stretch or walk", category: "Move", builtIn: true },
  { id: "m-outside", text: "Step outside for fresh air", category: "Move", builtIn: true },
  { id: "c-text", text: "Text or call someone safe", category: "Connect", builtIn: true },
  { id: "c-pet", text: "Time with a pet (or photos)", category: "Connect", builtIn: true },
  { id: "n-water", text: "Drink a full glass of water", category: "Nourish", builtIn: true },
  { id: "n-snack", text: "Eat a simple snack/meal", category: "Nourish", builtIn: true },
  { id: "r-nap", text: "10–20 minute rest/nap", category: "Rest", builtIn: true },
  { id: "r-unplug", text: "5 min screen break", category: "Rest", builtIn: true },
  { id: "j-music", text: "Listen to a favorite song", category: "Joy", builtIn: true },
  { id: "j-hobby", text: "5 minutes on a hobby", category: "Joy", builtIn: true },
  { id: "h-shower", text: "Shower/brush teeth/face", category: "Hygiene", builtIn: true },
  { id: "h-clothes", text: "Change into comfy clothes", category: "Hygiene", builtIn: true },
  { id: "meds", text: "Take prescribed meds (if any)", category: "Health", builtIn: true },
];

export const useSelfCareStore = create<State>()(persist(
  (set, get) => ({
    template: DEFAULTS,
    doneByDate: {},
    addItem: (text, category) => {
      const id = `u-${crypto.randomUUID()}`;
      const next = [...get().template, { id, text, category, builtIn: false }];
      set({ template: next });
    },
    removeItem: (id) => {
      const item = get().template.find((t) => t.id === id);
      if (!item || item.builtIn) return; // don't remove defaults
      set({ template: get().template.filter((t) => t.id !== id) });
      // also remove from any done lists
      const copy = { ...get().doneByDate };
      for (const k of Object.keys(copy)) copy[k] = copy[k].filter((x) => x !== id);
      set({ doneByDate: copy });
    },
    toggle: (id, dateKey) => {
      const list = get().doneByDate[dateKey] ?? [];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      set({ doneByDate: { ...get().doneByDate, [dateKey]: next } });
    },
    resetDay: (dateKey) => {
      const copy = { ...get().doneByDate };
      delete copy[dateKey];
      set({ doneByDate: copy });
    },
    clearAllProgress: () => set({ doneByDate: {} }),
  }),
  { name: "ysm_selfcare_v1" }
));
