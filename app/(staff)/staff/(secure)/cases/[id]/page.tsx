import { notFound } from "next/navigation";
import { Types } from "mongoose";
import { CaseActionForm } from "@/features/cases/case-action-form";
import { CaseActionModel } from "@/features/cases/case-action.model";
import { ContactDetails } from "@/features/cases/contact-details";
import { ReportModel } from "@/features/reports/report.model";
import { listStaffDirectory } from "@/features/staff-auth/staff-directory";
import { recordCaseEvent } from "@/lib/audit/record-case-event";
import { requireStaffSession } from "@/lib/auth/staff-session";
import { connectToDatabase } from "@/lib/db/mongoose";

type CaseDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const statusLabels = {
  new: "New",
  awaiting_triage: "Awaiting triage",
  under_review: "Under review",
  follow_up_required: "Follow-up required",
  referred: "Referred",
  closed: "Closed",
} as const;

export default async function CaseDetailsPage({
  params,
}: CaseDetailsPageProps) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  const staff = await requireStaffSession();
  await connectToDatabase();
  const report = await ReportModel.findById(id).lean();

  if (!report) {
    notFound();
  }

  await recordCaseEvent(staff.user.id, "case_viewed", report._id.toString());
  const actions = await CaseActionModel.find({ reportId: report._id })
    .sort({ createdAt: 1 })
    .lean();
  const staffDirectory = await listStaffDirectory();
  const assigneeName = new Map(
    staffDirectory.map((member) => [member.id, member.name]),
  );

  return (
    <article>
      <a
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        href="/staff/dashboard"
      >
        Back to queue
      </a>
      <header className="mt-6 border-b border-border pb-6">
        <p className="font-mono text-sm text-muted-foreground">
          {report.referenceCode}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Case details
        </h1>
      </header>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Category</dt>
          <dd className="mt-1 font-medium">
            {report.category.replaceAll("_", " ")}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Reported about</dt>
          <dd className="mt-1 font-medium">
            {report.reportAbout === "myself" ? "The reporter" : "Someone else"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Workflow status</dt>
          <dd className="mt-1 font-medium">{statusLabels[report.status]}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Assigned staff member</dt>
          <dd className="mt-1 font-medium">
            {report.assignedTo
              ? assigneeName.get(report.assignedTo) ?? "Former staff member"
              : "Unassigned"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Human-reviewed urgency</dt>
          <dd className="mt-1 font-medium">
            {report.immediateDanger
              ? "Immediate danger reported"
              : report.urgency === "unreviewed"
                ? "Not reviewed"
                : report.urgency}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Received</dt>
          <dd className="mt-1 font-medium">
            {report.createdAt.toLocaleString()}
          </dd>
        </div>
        {report.approximateDate && (
          <div>
            <dt className="text-sm text-muted-foreground">
              Approximate incident date
            </dt>
            <dd className="mt-1 font-medium">{report.approximateDate}</dd>
          </div>
        )}
        {report.generalLocation && (
          <div>
            <dt className="text-sm text-muted-foreground">General location</dt>
            <dd className="mt-1 font-medium">{report.generalLocation}</dd>
          </div>
        )}
        {report.onlinePlatform && (
          <div>
            <dt className="text-sm text-muted-foreground">Online platform</dt>
            <dd className="mt-1 font-medium">{report.onlinePlatform}</dd>
          </div>
        )}
      </dl>

      <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">What the reporter shared</h2>
        <p className="mt-4 whitespace-pre-wrap leading-7">
          {report.description}
        </p>
      </section>

      <CaseActionForm
        currentAssignee={report.assignedTo ?? null}
        currentStatus={report.status}
        currentUrgency={report.urgency}
        reportId={report._id.toString()}
        staffDirectory={staffDirectory}
      />

      <ContactDetails reportId={report._id.toString()} />

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Action history</h2>
        {actions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No case actions have been recorded.
          </p>
        ) : (
          <ol className="mt-4 space-y-4 border-l border-border pl-5">
            {actions.map((action) => (
              <li key={action._id.toString()}>
                <p className="font-medium">
                  {action.action === "status_changed"
                    ? `${action.fromValue.replaceAll("_", " ")} → ${action.toValue.replaceAll("_", " ")}`
                    : action.action === "urgency_changed"
                      ? `Urgency: ${action.fromValue} → ${action.toValue}`
                      : `Assignment: ${assigneeName.get(action.fromValue) ?? action.fromValue} → ${assigneeName.get(action.toValue) ?? action.toValue}`}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {action.rationale}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {action.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </article>
  );
}
