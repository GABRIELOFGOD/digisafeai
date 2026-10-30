import { headers } from "next/headers";
import { Types } from "mongoose";
import { caseActionInputSchema } from "@/features/cases/case-action.schema";
import { AuditEventModel } from "@/features/cases/audit-event.model";
import {
  CaseActionModel,
  type CaseActionType,
} from "@/features/cases/case-action.model";
import { ReportModel } from "@/features/reports/report.model";
import type { HumanUrgency, ReportStatus } from "@/features/reports/report.model";
import { listStaffDirectory } from "@/features/staff-auth/staff-directory";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getStaffSession } from "@/lib/auth/staff-session";
import { isTrustedSameOrigin } from "@/lib/security/same-origin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isTrustedSameOrigin(request)) {
    return Response.json({ error: "Request origin was not accepted." }, { status: 403 });
  }

  const staff = await getStaffSession(await headers());

  if (!staff) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Report not found." }, { status: 404 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = caseActionInputSchema.safeParse(payload);

  if (!result.success) {
    return Response.json(
      { error: "Choose a valid update and provide a rationale." },
      { status: 400 },
    );
  }

  if (result.data.assignedTo) {
    const staffDirectory = await listStaffDirectory();
    if (!staffDirectory.some((member) => member.id === result.data.assignedTo)) {
      return Response.json(
        { error: "Choose an active authorised staff member." },
        { status: 400 },
      );
    }
  }

  await connectToDatabase();
  const report = await ReportModel.findById(id);

  if (!report) {
    return Response.json({ error: "Report not found." }, { status: 404 });
  }

  const session = await ReportModel.db.startSession();

  try {
    const updates: Array<{
      action: CaseActionType;
      fromValue: string;
      toValue: string;
      auditAction:
        | "case_status_changed"
        | "case_urgency_changed"
        | "case_assigned";
    }> = [];
    const setValues: {
      status?: ReportStatus;
      urgency?: HumanUrgency;
      assignedTo?: string;
    } = {};
    const unsetValues: { assignedTo?: 1 } = {};

    if (result.data.status && result.data.status !== report.status) {
      setValues.status = result.data.status;
      updates.push({
        action: "status_changed",
        fromValue: report.status,
        toValue: result.data.status,
        auditAction: "case_status_changed",
      });
    }

    if (result.data.urgency && result.data.urgency !== report.urgency) {
      setValues.urgency = result.data.urgency;
      updates.push({
        action: "urgency_changed",
        fromValue: report.urgency,
        toValue: result.data.urgency,
        auditAction: "case_urgency_changed",
      });
    }

    if (
      result.data.assignedTo !== undefined &&
      result.data.assignedTo !== (report.assignedTo ?? null)
    ) {
      if (result.data.assignedTo === null) {
        unsetValues.assignedTo = 1;
      } else {
        setValues.assignedTo = result.data.assignedTo;
      }
      updates.push({
        action: "assigned",
        fromValue: report.assignedTo ?? "unassigned",
        toValue: result.data.assignedTo ?? "unassigned",
        auditAction: "case_assigned",
      });
    }

    if (updates.length === 0) {
      return Response.json({ success: true, changed: false });
    }

    await session.withTransaction(async () => {
      const updateResult = await ReportModel.updateOne(
        {
          _id: report._id,
          status: report.status,
          urgency: report.urgency,
          updatedAt: report.updatedAt,
        },
        {
          ...(Object.keys(setValues).length > 0 ? { $set: setValues } : {}),
          ...(Object.keys(unsetValues).length > 0
            ? { $unset: unsetValues }
            : {}),
        },
        { session },
      );

      if (updateResult.modifiedCount !== 1) {
        throw new Error("CASE_UPDATE_CONFLICT");
      }

      await CaseActionModel.create(
        updates.map((action) => ({
          reportId: report._id,
          actorId: staff.user.id,
          action: action.action,
          fromValue: action.fromValue,
          toValue: action.toValue,
          rationale: result.data.rationale,
        })),
        { session },
      );
      await AuditEventModel.create(
        updates.map((action) => ({
          actorId: staff.user.id,
          action: action.auditAction,
          recordId: report._id.toString(),
        })),
        { session },
      );
    });

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "CASE_UPDATE_CONFLICT") {
      return Response.json(
        { error: "This case changed while you were updating it. Refresh and try again." },
        { status: 409 },
      );
    }

    console.error(
      "Case update failed.",
      error instanceof Error ? error.name : "UnknownError",
    );

    return Response.json(
      { error: "The case update could not be saved." },
      { status: 503 },
    );
  } finally {
    await session.endSession();
  }
}
