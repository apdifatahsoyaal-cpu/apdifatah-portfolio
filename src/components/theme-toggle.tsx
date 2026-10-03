"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribeToTheme(callback: () => void) {
  window.addEventListener("portfolio-theme-change", callback);
  return () => window.removeEventListener("portfolio-theme-change", callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.classList.toggle("dark", nextIsDark);
    root.style.colorScheme = nextIsDark ? "dark" : "light";
    try {
      window.localStorage.setItem(
        "portfolio-theme",
        nextIsDark ? "dark" : "light",
      );
    } catch {
      // Keep the current session theme even when browser storage is unavailable.
    }
    window.dispatchEvent(new Event("portfolio-theme-change"));
    window.setTimeout(() => root.classList.remove("theme-transition"), 300);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "U beddel habka iftiinka" : "U beddel habka mugdiga"}
      title={isDark ? "U beddel habka iftiinka" : "U beddel habka mugdiga"}
      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {isDark ? (
        <>
          <Sun aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Hab iftiin</span>
        </>
      ) : (
        <>
          <Moon aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Hab mugdi</span>
        </>
      )}
    </button>
  );
}
