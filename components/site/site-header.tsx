"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, SunMoon, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { href: "/report", label: "Report" },
  { href: "/companion", label: "Talk to AI" },
  { href: "/help-now", label: "Get help now" },
  { href: "/learn", label: "Learn" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader({
  onToggleTheme,
}: {
  onToggleTheme: () => void;
}) {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState({ pathname, open: false });
  const isMobileNavOpen =
    mobileMenu.pathname === pathname && mobileMenu.open;

  const navLinks = () =>
    navigation.map((item) => {
      const isCurrent =
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(`${item.href}/`));

      return (
        <Link
          aria-current={isCurrent ? "page" : undefined}
          className="rounded-full px-3 py-2 text-[0.92rem] font-medium text-foreground no-underline transition-colors hover:bg-secondary hover:text-primary aria-[current=page]:bg-secondary aria-[current=page]:font-semibold aria-[current=page]:text-primary max-[700px]:p-3 max-[700px]:text-[0.95rem]"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-[14px]">
        <div className="mx-auto flex min-h-[4.25rem] w-[calc(100%-2.5rem)] max-w-[70rem] items-center gap-4 max-[700px]:w-[calc(100%-2rem)] max-[700px]:min-h-[3.8rem]">
          <Link
            aria-label="DigiSafe AI home"
            className="inline-flex shrink-0 items-center gap-2 text-[1.12rem] font-bold text-[var(--public-deep)] no-underline"
            href="/"
          >
            <span aria-hidden="true" className="relative block size-[2.35rem] shrink-0 rounded-xl bg-white max-[420px]:size-[2.1rem]">
              <Image
                alt=""
                className="object-contain"
                style={{ objectFit: "contain" }}
                fill
                sizes="38px"
                src="/logo.png"
              />
            </span>
            <span>DigiSafe <span className="text-primary">AI</span></span>
          </Link>
          <nav aria-label="Main navigation" className="ml-auto flex items-center gap-1 max-[700px]:hidden">
            {navLinks()}
          </nav>
          <div className="flex items-center gap-2 max-[700px]:ml-auto">
            <button
              aria-controls="mobile-site-navigation"
              aria-expanded={isMobileNavOpen}
              aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
              className="hidden size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground max-[700px]:inline-flex"
              onClick={() =>
                setMobileMenu({ pathname, open: !isMobileNavOpen })
              }
              type="button"
            >
              {isMobileNavOpen ? (
                <X aria-hidden="true" size={21} />
              ) : (
                <Menu aria-hidden="true" size={21} />
              )}
            </button>
            <button
              aria-label="Toggle color theme"
              className="grid size-[2.55rem] place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-secondary max-[420px]:size-[2.3rem]"
              onClick={onToggleTheme}
              title="Toggle color theme"
              type="button"
            >
              <SunMoon aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      </header>
      {isMobileNavOpen && (
        <nav
          aria-label="Mobile main navigation"
          className="fixed left-0 right-0 top-[3.8rem] z-[15] flex flex-col gap-1 border-y border-border bg-card px-4 py-3 shadow-xl min-[701px]:hidden"
          id="mobile-site-navigation"
        >
          {navLinks()}
        </nav>
      )}
    </>
  );
}
