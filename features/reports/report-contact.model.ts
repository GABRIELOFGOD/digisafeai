import {
  model,
  models,
  Schema,
  Types,
  type Document,
  type Model,
} from "mongoose";
import type { ReportInput } from "@/features/reports/report.schema";

export interface ReportContactRecord extends Document {
  reportId: Types.ObjectId;
  method: NonNullable<ReportInput["safeContact"]>["method"];
  encryptedValue: string;
  createdAt: Date;
}

const reportContactSchema = new Schema<ReportContactRecord>(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      required: true,
      unique: true,
    },
    method: { type: String, enum: ["phone", "email"], required: true },
    encryptedValue: { type: String, required: true, select: false },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

export const ReportContactModel =
  (models.ReportContact as Model<ReportContactRecord> | undefined) ??
  model<ReportContactRecord>("ReportContact", reportContactSchema);
