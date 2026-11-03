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
    <div className="staff-shell">
      <StaffNavigation name={session.user.name} role={session.user.role ?? ""} />
      <div className="staff-main">
        <main className="staff-content">{children}</main>
      </div>
    </div>
  );
}
