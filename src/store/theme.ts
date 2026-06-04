import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  initialized: boolean;
  init: () => void;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const STORAGE_KEY = "theme";

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  initialized: false,
  init: () => {
    if (typeof window === "undefined" || get().initialized) return;
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const system: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const theme = stored ?? system;
    applyTheme(theme);
    set({ theme, initialized: true });
  },
  toggle: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    set({ theme: next });
  },
  setTheme: (t) => {
    applyTheme(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
    set({ theme: t });
  },
}));
