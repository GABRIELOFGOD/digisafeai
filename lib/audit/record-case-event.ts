import "server-only";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  AuditEventModel,
  type AuditAction,
} from "@/features/cases/audit-event.model";

export async function recordCaseEvent(
  actorId: string,
  action: AuditAction,
  recordId: string,
) {
  await connectToDatabase();
  await AuditEventModel.create({ actorId, action, recordId });
}
