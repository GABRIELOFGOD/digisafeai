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
    <div className="public-shell" data-theme={theme}>
      <a
        className="skip-link"
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
