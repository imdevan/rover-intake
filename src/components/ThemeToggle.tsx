import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/theme";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const init = useThemeStore((s) => s.init);
  const toggle = useThemeStore((s) => s.toggle);
  const initialized = useThemeStore((s) => s.initialized);

  useEffect(() => {
    init();
  }, [init]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      data-testid="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="glass-surface relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-transform duration-300 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-500 ${
          initialized && isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-500 ${
          initialized && isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
