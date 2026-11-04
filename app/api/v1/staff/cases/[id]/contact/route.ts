import { headers } from "next/headers";
import { Types } from "mongoose";
import { ReportContactModel } from "@/features/reports/report-contact.model";
import { ReportModel } from "@/features/reports/report.model";
import { connectToDatabase } from "@/lib/db/mongoose";
import { recordCaseEvent } from "@/lib/audit/record-case-event";
import { getStaffSession } from "@/lib/auth/staff-session";
import { decryptContactValue } from "@/lib/security/contact-encryption";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const staff = await getStaffSession(await headers());

  if (!staff) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Report not found." }, { status: 404 });
  }

  await connectToDatabase();
  const report = await ReportModel.findById(id)
    .select("+safeContactMethod +encryptedSafeContact")
    .lean();
  const hasEmbeddedContact = Boolean(
    report?.safeContactMethod && report.encryptedSafeContact,
  );
  const legacyContact = hasEmbeddedContact
    ? null
    : await ReportContactModel.findOne({ reportId: id })
        .select("+encryptedValue")
        .lean();

  const encryptedValue = hasEmbeddedContact
    ? report?.encryptedSafeContact
    : legacyContact?.encryptedValue;
  const method = hasEmbeddedContact
    ? report?.safeContactMethod
    : legacyContact?.method;

  if (!encryptedValue || !method) {
    return Response.json({ error: "No safe contact was provided." }, { status: 404 });
  }

  try {
    await recordCaseEvent(staff.user.id, "contact_viewed", id);
    return Response.json(
      {
        method,
        value: decryptContactValue(encryptedValue),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error(
      "Safe contact access failed.",
      error instanceof Error ? error.name : "UnknownError",
    );

    return Response.json(
      { error: "Safe contact details could not be retrieved." },
      { status: 503 },
    );
  }
}
