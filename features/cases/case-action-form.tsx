"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { HumanUrgency, ReportStatus } from "@/features/reports/report.model";
import type { StaffDirectoryEntry } from "@/features/staff-auth/staff-directory";

const statusOptions: { value: ReportStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "awaiting_triage", label: "Awaiting triage" },
  { value: "under_review", label: "Under review" },
  { value: "follow_up_required", label: "Follow-up required" },
  { value: "referred", label: "Referred" },
  { value: "closed", label: "Closed" },
];

const urgencyOptions: { value: HumanUrgency; label: string }[] = [
  { value: "unreviewed", label: "Not reviewed" },
  { value: "routine", label: "Routine" },
  { value: "urgent", label: "Urgent" },
];

export function CaseActionForm({
  reportId,
  currentStatus,
  currentUrgency,
  currentAssignee,
  staffDirectory,
}: {
  reportId: string;
  currentStatus: ReportStatus;
  currentUrgency: HumanUrgency;
  currentAssignee: string | null;
  staffDirectory: StaffDirectoryEntry[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [urgency, setUrgency] = useState<HumanUrgency>(currentUrgency);
  const [assignedTo, setAssignedTo] = useState(currentAssignee ?? "");
  const [rationale, setRationale] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveAction() {
    setErrorMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/v1/staff/cases/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          urgency,
          assignedTo: assignedTo || null,
          rationale,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(result.error ?? "The update could not be saved.");
        return;
      }

      setRationale("");
      router.refresh();
    } catch {
      setErrorMessage("The update could not be confirmed. Please refresh and check the case.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Record a case update</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="font-medium" htmlFor="case-status">
            Workflow status
          </label>
          <select
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
            id="case-status"
            onChange={(event) => setStatus(event.target.value as ReportStatus)}
            value={status}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-medium" htmlFor="case-urgency">
            Human-reviewed urgency
          </label>
          <select
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
            id="case-urgency"
            onChange={(event) => setUrgency(event.target.value as HumanUrgency)}
            value={urgency}
          >
            {urgencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="font-medium" htmlFor="case-assignee">
            Assigned staff member
          </label>
          <select
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
            id="case-assignee"
            onChange={(event) => setAssignedTo(event.target.value)}
            value={assignedTo}
          >
            <option value="">Unassigned</option>
            {staffDirectory.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role === "admin" ? "Admin" : "Safeguarding officer"})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <label className="font-medium" htmlFor="case-rationale">
          Rationale for this change
        </label>
        <textarea
          className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2"
          id="case-rationale"
          maxLength={500}
          onChange={(event) => setRationale(event.target.value)}
          required
          value={rationale}
        />
      </div>
      {errorMessage && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <Button
        className="mt-5"
        disabled={isSaving || rationale.trim().length < 8}
        onClick={saveAction}
        type="button"
      >
        {isSaving ? "Saving…" : "Save case update"}
      </Button>
    </section>
  );
}
