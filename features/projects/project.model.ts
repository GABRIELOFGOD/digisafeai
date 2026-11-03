import {
  model,
  models,
  Schema,
  type Document,
  type Model,
} from "mongoose";
import type { RichTextDocument } from "@/features/rich-content/rich-text";

export interface ProjectRecord extends Document {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  outcomes: string[];
  fullDescription: string | RichTextDocument;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectRecord>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    image: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    outcomes: {
      type: [{ type: String, required: true, trim: true }],
      required: true,
    },
    fullDescription: {
      type: Schema.Types.Mixed,
      required: true,
      trim: true,
      maxlength: 12000,
    },
  },
  { timestamps: true, versionKey: false },
);

export const ProjectModel =
  (models.Project as Model<ProjectRecord> | undefined) ??
  model<ProjectRecord>("Project", projectSchema);
