import type { ReactNode } from "react";
import { StaffNavigation } from "@/components/staff/staff-navigation";
import { requireStaffSession } from "@/lib/auth/staff-session";

export const instant = false;

export default async function SecureStaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireStaffSession();

  return (
    <div className="flex min-h-screen flex-col">
      <StaffNavigation name={session.user.name} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
