import Link from "next/link";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ReportModel } from "@/features/reports/report.model";
import { requireStaffSession } from "@/lib/auth/staff-session";

export const metadata: Metadata = {
  title: "Case dashboard",
  robots: { index: false, follow: false },
};

export default async function StaffDashboardPage() {
  const session = await requireStaffSession();
  await connectToDatabase();
  const [totalReports, newReports, urgentReports, closedReports] =
    await Promise.all([
      ReportModel.countDocuments(),
      ReportModel.countDocuments({ status: "new" }),
      ReportModel.countDocuments({ urgency: "urgent" }),
      ReportModel.countDocuments({ status: "closed" }),
    ]);

  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          Safeguarding workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Welcome back, {session.user.name}
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          Review incoming reports and manage the safeguarding workload.
          Urgency is assessed by authorised staff and is never assigned or
          lowered automatically.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90"
          href="/staff/cases"
        >
          Open case queue
        </Link>
      </header>
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["All reports", totalReports],
          ["New", newReports],
          ["Human-reviewed urgent", urgentReports],
          ["Closed", closedReports],
        ].map(([label, count]) => (
          <div
            className="rounded-xl border border-border bg-card p-5 sm:p-6"
            key={label}
          >
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-3 text-3xl font-semibold tracking-tight">
              {count}
            </dd>
          </div>
        ))}
      </dl>
      {session.user.role === "admin" && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Manage your website</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
            href="/staff/blog"
          >
            <h2 className="font-semibold">Manage blog</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Write, publish, and feature blog posts.
            </p>
          </Link>
          <Link
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
            href="/staff/projects"
          >
            <h2 className="font-semibold">Manage projects</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Update project stories, outcomes, and images.
            </p>
          </Link>
          <Link
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
            href="/staff/team"
          >
            <h2 className="font-semibold">Manage administrators</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add administrator accounts for trusted team members.
            </p>
          </Link>
          </div>
        </div>
      )}
    </section>
  );
}
