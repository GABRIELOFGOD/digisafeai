"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Newspaper,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const staffLinks = [
  { href: "/staff/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/staff/cases", label: "Reports & cases", icon: ClipboardList },
];

const adminLinks = [
  { href: "/staff/blog", label: "Blog", icon: Newspaper },
  { href: "/staff/projects", label: "Projects", icon: FolderKanban },
  { href: "/staff/team", label: "Administrators", icon: Users },
];

export function StaffNavigation({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function signOut() {
    await authClient.signOut();
    router.replace("/staff/login");
    router.refresh();
  }

  function links(className: string) {
    return [...staffLinks, ...(role === "admin" ? adminLinks : [])].map(
      ({ href, label, icon: Icon }) => {
        const isCurrent =
          pathname === href || (href !== "/staff/dashboard" && pathname.startsWith(`${href}/`));

        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            className={`${className}${isCurrent ? " is-active" : ""}`}
            href={href}
            key={href}
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon aria-hidden="true" size={18} />
            <span>{label}</span>
          </Link>
        );
      },
    );
  }

  return (
    <>
      <aside className="staff-sidebar">
        <Link className="staff-sidebar-brand" href="/staff/dashboard">
          <span className="staff-brand-mark">D</span>
          <span>
            <strong>DigiSafe AI</strong>
            <small>{role === "admin" ? "Admin workspace" : "Staff workspace"}</small>
          </span>
        </Link>
        <div className="staff-nav-label">WORKSPACE</div>
        <nav aria-label="Staff workspace" className="staff-sidebar-nav">
          {links("staff-sidebar-link")}
        </nav>
        <div className="staff-sidebar-footer">
          <div className="staff-user-avatar" aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="staff-user-copy">
            <strong>{name}</strong>
            <small>{role === "admin" ? "Administrator" : "Safeguarding staff"}</small>
          </div>
          <Button
            aria-label="Sign out"
            onClick={signOut}
            size="sm"
            type="button"
            variant="outline"
          >
            Sign out
          </Button>
        </div>
      </aside>

      <header className="staff-mobile-header">
        <Link className="staff-sidebar-brand" href="/staff/dashboard">
          <span className="staff-brand-mark">D</span>
          <strong>DigiSafe AI</strong>
        </Link>
        <Button
          aria-controls="staff-mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close staff navigation" : "Open staff navigation"}
          onClick={() => setIsMenuOpen((open) => !open)}
          size="icon"
          type="button"
          variant="outline"
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
        {isMenuOpen && (
          <nav
            aria-label="Staff workspace"
            className="staff-mobile-nav"
            id="staff-mobile-navigation"
          >
            {links("staff-sidebar-link")}
            <div className="staff-mobile-user">
              <span>{name}</span>
              <Button onClick={signOut} size="sm" type="button" variant="outline">
                Sign out
              </Button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
