"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
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
  { href: "/staff/conversations", label: "AI conversations", icon: MessageSquareText },
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
            className={className}
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
      <aside className="sticky top-0 flex h-screen w-[16.5rem] shrink-0 flex-col border-r border-border bg-card px-4 pb-4 pt-6 max-[900px]:hidden">
        <Link className="flex items-center gap-3 px-2 pb-7 pt-1 text-foreground no-underline" href="/staff/dashboard">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">D</span>
          <span>
            <strong className="block">DigiSafe AI</strong>
            <small className="mt-1 block text-xs text-muted-foreground">{role === "admin" ? "Admin workspace" : "Staff workspace"}</small>
          </span>
        </Link>
        <div className="px-3 pb-2.5 text-[0.68rem] font-bold tracking-[0.12em] text-muted-foreground">WORKSPACE</div>
        <nav aria-label="Staff workspace" className="grid gap-1">
          {links("flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground no-underline transition-colors hover:bg-secondary hover:text-primary aria-[current=page]:bg-secondary aria-[current=page]:text-primary")}
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t border-border px-1 pt-4">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-bold text-primary" aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
            <strong className="block">{name}</strong>
            <small className="mt-1 block text-[0.7rem] text-muted-foreground">{role === "admin" ? "Administrator" : "Safeguarding staff"}</small>
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

      <header className="sticky top-0 z-20 hidden min-h-[4.25rem] items-center justify-between border-b border-border bg-card px-5 max-[900px]:flex">
        <Link className="flex items-center gap-3 text-foreground no-underline" href="/staff/dashboard">
          <span className="grid size-[2.15rem] shrink-0 place-items-center rounded-xl bg-primary text-base font-bold text-primary-foreground">D</span>
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
            className="absolute left-0 right-0 top-[calc(100%+1px)] grid gap-1 border-b border-border bg-card px-5 pb-4 pt-3 shadow-lg"
            id="staff-mobile-navigation"
          >
            {links("flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground no-underline transition-colors hover:bg-secondary hover:text-primary aria-[current=page]:bg-secondary aria-[current=page]:text-primary")}
            <div className="mt-2 flex items-center justify-between border-t border-border px-1 pt-3 text-sm text-muted-foreground">
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
