import Link from "next/link";
import { reportCategories, reportStatuses, humanUrgencies } from "@/features/reports/report.schema";
import {
  ReportModel,
  type HumanUrgency,
  type ReportRecord,
  type ReportStatus,
} from "@/features/reports/report.model";
import { recordCaseEvent } from "@/lib/audit/record-case-event";
import { requireStaffSession } from "@/lib/auth/staff-session";
import { connectToDatabase } from "@/lib/db/mongoose";

type CaseQueueProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    category?: string;
    urgency?: string;
    q?: string;
  }>;
};

const pageSize = 50;

export async function CaseQueue({ searchParams }: CaseQueueProps) {
  const staff = await requireStaffSession();
  const query = await searchParams;
  const requestedPage = Number(query.page ?? "1");
  const requestedPageNumber =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const status = reportStatuses.find((value) => value === query.status);
  const category = reportCategories.find((value) => value === query.category);
  const urgency = humanUrgencies.find((value) => value === query.urgency);
  const referenceCode = query.q?.trim().toUpperCase();
  const filter: {
    status?: ReportStatus;
    category?: ReportRecord["category"];
    urgency?: HumanUrgency;
    referenceCode?: string;
  } = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (urgency) filter.urgency = urgency;
  if (referenceCode) filter.referenceCode = referenceCode;

  await connectToDatabase();
  await recordCaseEvent(staff.user.id, "case_queue_viewed", "queue");
  const totalReports = await ReportModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalReports / pageSize));
  const page = Math.min(requestedPageNumber, totalPages);
  const reports = await ReportModel.find(filter)
    .select("referenceCode category status urgency immediateDanger createdAt")
    .sort({ immediateDanger: -1, createdAt: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (category) params.set("category", category);
    if (urgency) params.set("urgency", urgency);
    if (referenceCode) params.set("q", referenceCode);
    params.set("page", String(targetPage));
    return `/staff/cases?${params.toString()}`;
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        Safeguarding workspace
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Case queue</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        Reports that indicate immediate danger are shown first. Urgency remains
        unreviewed until an authorised staff member assesses the report.
      </p>

      <form
        action="/staff/cases"
        className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
        method="get"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="filter-status">
            Status
          </label>
          <select
            className="min-h-10 w-full rounded-md border border-input bg-background px-3"
            defaultValue={status ?? ""}
            id="filter-status"
            name="status"
          >
            <option value="">All statuses</option>
            {reportStatuses.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="filter-category">
            Category
          </label>
          <select
            className="min-h-10 w-full rounded-md border border-input bg-background px-3"
            defaultValue={category ?? ""}
            id="filter-category"
            name="category"
          >
            <option value="">All categories</option>
            {reportCategories.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="filter-urgency">
            Human-reviewed urgency
          </label>
          <select
            className="min-h-10 w-full rounded-md border border-input bg-background px-3"
            defaultValue={urgency ?? ""}
            id="filter-urgency"
            name="urgency"
          >
            <option value="">All urgencies</option>
            {humanUrgencies.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="filter-reference">
            Exact reference code
          </label>
          <input
            autoComplete="off"
            className="min-h-10 w-full rounded-md border border-input bg-background px-3"
            defaultValue={query.q ?? ""}
            id="filter-reference"
            maxLength={18}
            name="q"
          />
        </div>
        <button
          className="min-h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 sm:col-span-2 lg:col-span-4 lg:justify-self-start"
          type="submit"
        >
          Apply filters
        </button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Showing {reports.length} of {totalReports} matching reports
      </p>

      {reports.length === 0 ? (
        <p className="mt-4 rounded-xl border border-border bg-card p-6 text-muted-foreground">
          No reports match these filters.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urgency</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th>
                  <span className="sr-only">Open report</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <tr key={report._id.toString()}>
                  <td className="px-4 py-4 font-mono">
                    {report.referenceCode}
                  </td>
                  <td className="px-4 py-4">
                    {report.category.replaceAll("_", " ")}
                  </td>
                  <td className="px-4 py-4">
                    {report.status.replaceAll("_", " ")}
                  </td>
                  <td className="px-4 py-4">
                    {report.immediateDanger
                      ? "Immediate danger reported"
                      : report.urgency.replaceAll("_", " ")}
                  </td>
                  <td className="px-4 py-4">
                    {report.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      href={`/staff/cases/${report._id.toString()}`}
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Report queue pages"
          className="mt-6 flex items-center justify-between"
        >
          {page <= 1 ? (
            <span aria-disabled="true" className="text-muted-foreground">
              Previous
            </span>
          ) : (
            <Link
              className="font-medium text-primary"
              href={pageHref(page - 1)}
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page >= totalPages ? (
            <span aria-disabled="true" className="text-muted-foreground">
              Next
            </span>
          ) : (
            <Link
              className="font-medium text-primary"
              href={pageHref(page + 1)}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
