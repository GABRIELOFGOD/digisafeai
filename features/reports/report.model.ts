import {
  model,
  models,
  Schema,
  type Document,
  type Model,
} from "mongoose";
import {
  humanUrgencies,
  reportCategories,
  reportStatuses,
  type ReportInput,
} from "@/features/reports/report.schema";

export type ReportStatus = (typeof reportStatuses)[number];

export type HumanUrgency = (typeof humanUrgencies)[number];

export interface ReportRecord extends Document {
  referenceCode: string;
  reportAbout: ReportInput["reportAbout"];
  category: ReportInput["category"];
  description: string;
  approximateDate?: string;
  generalLocation?: string;
  onlinePlatform?: string;
  immediateDanger: boolean;
  urgency: HumanUrgency;
  status: ReportStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportRecord>(
  {
    referenceCode: { type: String, required: true, unique: true },
    reportAbout: {
      type: String,
      enum: ["myself", "someone_else"],
      required: true,
    },
    category: {
      type: String,
      enum: reportCategories,
      required: true,
    },
    description: { type: String, required: true, maxlength: 4000 },
    approximateDate: { type: String, maxlength: 40 },
    generalLocation: { type: String, maxlength: 120 },
    onlinePlatform: { type: String, maxlength: 120 },
    immediateDanger: { type: Boolean, required: true },
    urgency: {
      type: String,
      enum: humanUrgencies,
      default: "unreviewed",
      required: true,
    },
    status: {
      type: String,
      enum: reportStatuses,
      default: "new",
      required: true,
    },
    assignedTo: { type: String },
  },
  { timestamps: true, versionKey: false },
);

reportSchema.index({ status: 1, createdAt: 1 });
reportSchema.index({ category: 1, createdAt: -1 });

export const ReportModel =
  (models.Report as Model<ReportRecord> | undefined) ??
  model<ReportRecord>("Report", reportSchema);
