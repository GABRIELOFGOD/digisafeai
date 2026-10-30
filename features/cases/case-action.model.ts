import {
  model,
  models,
  Schema,
  Types,
  type Document,
  type Model,
} from "mongoose";
import type { HumanUrgency, ReportStatus } from "@/features/reports/report.model";

export type CaseActionType =
  | "status_changed"
  | "urgency_changed"
  | "assigned";

export interface CaseActionRecord extends Document {
  reportId: Types.ObjectId;
  actorId: string;
  action: CaseActionType;
  fromValue: string;
  toValue: string;
  rationale: string;
  createdAt: Date;
}

const caseActionSchema = new Schema<CaseActionRecord>(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    actorId: { type: String, required: true },
    action: {
      type: String,
      enum: ["status_changed", "urgency_changed", "assigned"],
      required: true,
    },
    fromValue: { type: String, required: true },
    toValue: { type: String, required: true },
    rationale: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

caseActionSchema.index({ reportId: 1, createdAt: 1 });

export const CaseActionModel =
  (models.CaseAction as Model<CaseActionRecord> | undefined) ??
  model<CaseActionRecord>("CaseAction", caseActionSchema);

export type { HumanUrgency, ReportStatus };
