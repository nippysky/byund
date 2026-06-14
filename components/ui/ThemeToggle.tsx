"use client";

import { useTheme } from "@/contexts/theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        border: "1px solid var(--border-med)",
        background: "var(--surface-1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-2)",
        cursor: "pointer",
        transition: "all 0.18s ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-1)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-1)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-med)";
      }}
    >
      {isDark
        ? <Sun size={15} strokeWidth={2} />
        : <Moon size={15} strokeWidth={2} />
      }
    </button>
  );
}
