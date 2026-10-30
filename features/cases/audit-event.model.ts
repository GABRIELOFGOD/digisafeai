import {
  model,
  models,
  Schema,
  type Document,
  type Model,
} from "mongoose";

export type AuditAction =
  | "case_queue_viewed"
  | "case_viewed"
  | "contact_viewed"
  | "case_status_changed"
  | "case_urgency_changed"
  | "case_assigned";

export interface AuditEventRecord extends Document {
  actorId: string;
  action: AuditAction;
  recordId: string;
  createdAt: Date;
}

const auditEventSchema = new Schema<AuditEventRecord>(
  {
    actorId: { type: String, required: true },
    action: {
      type: String,
      enum: [
        "case_queue_viewed",
        "case_viewed",
        "contact_viewed",
        "case_status_changed",
        "case_urgency_changed",
        "case_assigned",
      ],
      required: true,
    },
    recordId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

auditEventSchema.index({ recordId: 1, createdAt: -1 });
auditEventSchema.index({ actorId: 1, createdAt: -1 });

export const AuditEventModel =
  (models.AuditEvent as Model<AuditEventRecord> | undefined) ??
  model<AuditEventRecord>("AuditEvent", auditEventSchema);
