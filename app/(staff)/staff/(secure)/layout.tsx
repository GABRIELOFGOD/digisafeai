import type { ReactNode } from "react";
import { connection } from "next/server";
import { StaffNavigation } from "@/components/staff/staff-navigation";
import { requireStaffSession } from "@/lib/auth/staff-session";

export const instant = false;

export default async function SecureStaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const session = await requireStaffSession();

  return (
    <div className="flex min-h-screen bg-muted text-foreground max-[900px]:block">
      <StaffNavigation name={session.user.name} role={session.user.role ?? ""} />
      <div className="min-w-0 flex-1 max-[900px]:min-h-[calc(100vh-4.25rem)]">
        <main className="mx-auto w-full max-w-[90rem] px-[clamp(1.25rem,3vw,3rem)] py-9 max-[900px]:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
