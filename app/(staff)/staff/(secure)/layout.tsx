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
    <div className="staff-shell">
      <StaffNavigation name={session.user.name} role={session.user.role ?? ""} />
      <div className="staff-main">
        <main className="staff-content">{children}</main>
      </div>
    </div>
  );
}
