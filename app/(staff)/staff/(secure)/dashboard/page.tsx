import Link from "next/link";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ReportModel } from "@/features/reports/report.model";

export const metadata: Metadata = {
  title: "Case dashboard",
  robots: { index: false, follow: false },
};

export default async function StaffDashboardPage() {
  await connectToDatabase();
  const [totalReports, newReports, urgentReports, closedReports] =
    await Promise.all([
      ReportModel.countDocuments(),
      ReportModel.countDocuments({ status: "new" }),
      ReportModel.countDocuments({ urgency: "urgent" }),
      ReportModel.countDocuments({ status: "closed" }),
    ]);

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        Safeguarding workspace
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Report queue
      </h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        A high-level view of reports in the case system. Urgency is assessed by
        authorised staff and is never assigned or lowered automatically.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["All reports", totalReports],
          ["New", newReports],
          ["Human-reviewed urgent", urgentReports],
          ["Closed", closedReports],
        ].map(([label, count]) => (
          <div
            className="rounded-xl border border-border bg-card p-5"
            key={label}
          >
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-3xl font-semibold">{count}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8">
        <Link
          className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90"
          href="/staff/cases"
        >
          Open case queue
        </Link>
      </div>
    </section>
  );
}
