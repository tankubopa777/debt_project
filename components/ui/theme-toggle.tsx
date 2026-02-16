"use client";

// ============================
// Theme Toggle Button (Client Component)
// ปุ่มสลับ Light/Dark mode
// ============================

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all duration-200 hover:bg-muted hover:scale-105 active:scale-95"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        } absolute`}
      />
      <Moon
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "light" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        } absolute`}
      />
    </button>
  );
}
