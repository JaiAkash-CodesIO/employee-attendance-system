"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle color theme"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 border ${
        theme === "dark"
          ? "bg-slate-900/80 border-slate-700/80 text-amber-300 hover:bg-slate-800 hover:text-amber-200 shadow-md"
          : "bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 hover:text-indigo-700 shadow-sm"
      } ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
