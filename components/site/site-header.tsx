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
          className="site-nav-link"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link
            aria-label="DigiSafe AI home"
            className="site-brand"
            href="/"
          >
            <span aria-hidden="true" className="site-brand-mark">
              <Image
                alt=""
                className="site-brand-image"
                style={{ objectFit: "contain" }}
                fill
                sizes="38px"
                src="/logo.png"
              />
            </span>
            <span>DigiSafe <span className="text-primary">AI</span></span>
          </Link>
          <nav aria-label="Main navigation" className="site-nav">
            {navLinks()}
          </nav>
          <div className="site-header-actions">
            <button
              aria-controls="mobile-site-navigation"
              aria-expanded={isMobileNavOpen}
              aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
              className="mobile-menu-toggle"
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
              className="theme-toggle"
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
          className="site-nav-mobile is-open"
          id="mobile-site-navigation"
        >
          {navLinks()}
        </nav>
      )}
    </>
  );
}
