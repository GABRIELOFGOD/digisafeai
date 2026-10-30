"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function StaffNavigation({ name }: { name: string }) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/staff/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-6">
          <Link className="font-semibold text-primary" href="/staff/dashboard">
            DigiSafe AI · Staff
          </Link>
          <Link
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
            href="/staff/cases"
          >
            Cases
          </Link>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {name}
          </span>
        </div>
        <Button onClick={signOut} size="sm" type="button" variant="outline">
          Sign out
        </Button>
      </div>
    </header>
  );
}
