import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminManager } from "@/features/staff-admin/admin-manager";
import { listStaffDirectory } from "@/features/staff-auth/staff-directory";
import { requireStaffSession } from "@/lib/auth/staff-session";

export const metadata: Metadata = {
  title: "Administrator team",
  robots: { index: false, follow: false },
};

export default async function TeamPage() {
  const session = await requireStaffSession();
  if (session.user.role !== "admin") redirect("/staff/dashboard");
  const admins = (await listStaffDirectory())
    .filter((member) => member.role === "admin")
    .map((member) => ({
      ...member,
      createdAt: null,
    }));

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        Administrator tools
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Administrator team
      </h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
        Add trusted administrators who can manage content, the case queue, and
        other administrator accounts.
      </p>
      <div className="mt-8">
        <AdminManager initialAdmins={admins} />
      </div>
    </section>
  );
}
