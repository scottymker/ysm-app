import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CalmContact = { name: string; phone: string };
export type CalmToolkit = {
  contacts: CalmContact[]; // up to 3
  activities: string[];    // up to 2
  mantra: string;          // 1
};

type State = CalmToolkit & {
  setContact: (i: number, v: CalmContact) => void;
  setActivity: (i: number, v: string) => void;
  setMantra: (v: string) => void;
  reset: () => void;
};

const DEFAULT: CalmToolkit = {
  contacts: [
    { name: "", phone: "" },
    { name: "", phone: "" },
    { name: "", phone: "" },
  ],
  activities: ["", ""],
  mantra: "",
};

export const useCalmToolkitStore = create<State>()(persist(
  (set, get) => ({
    ...DEFAULT,
    setContact: (i, v) => {
      const copy = [...get().contacts];
      if (i < 0 || i > 2) return;
      copy[i] = { name: v.name ?? "", phone: v.phone ?? "" };
      set({ contacts: copy });
    },
    setActivity: (i, v) => {
      const copy = [...get().activities];
      if (i < 0 || i > 1) return;
      copy[i] = v ?? "";
      set({ activities: copy });
    },
    setMantra: (v) => set({ mantra: v ?? "" }),
    reset: () => set({ ...DEFAULT }),
  }),
  { name: "ysm_calm_toolkit_v1" }
));
