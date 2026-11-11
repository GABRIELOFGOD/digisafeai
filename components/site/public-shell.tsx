"use client";

import { useState, type ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

type Theme = "system" | "light" | "dark";

export function PublicShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");

  function toggleTheme() {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const nextTheme =
      theme === "dark" || (theme === "system" && prefersDark)
        ? "light"
        : "dark";

    setTheme(nextTheme);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground scheme-light data-[theme=dark]:scheme-dark" data-theme={theme}>
      <a
        className="absolute left-4 top-4 z-20 -translate-y-[180%] rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      <SiteHeader onToggleTheme={toggleTheme} />
      {children}
      <SiteFooter />
    </div>
  );
}
