import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "system" | "light" | "dark";

type State = {
  theme: Theme;
  reducedMotion: boolean;
  analytics: boolean;
  setTheme: (t: Theme) => void;
  setReducedMotion: (v: boolean) => void;
  setAnalytics: (v: boolean) => void;
};

export const useSettingsStore = create<State>()(persist(
  (set) => ({
    theme: "system",
    reducedMotion: false,
    analytics: false,
    setTheme: (theme) => set({ theme }),
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    setAnalytics: (analytics) => set({ analytics })
  }),
  { name: "ysm_settings_v1" }
));
