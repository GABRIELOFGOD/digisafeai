import {
  model,
  models,
  Schema,
  type Document,
  type Model,
} from "mongoose";

export type CompanionMessageRole = "user" | "assistant";

export interface CompanionMessage {
  role: CompanionMessageRole;
  content: string;
  createdAt: Date;
}

export interface CompanionConversationRecord extends Document {
  chatCode: string;
  messages: CompanionMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<CompanionMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true, maxlength: 4000 },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const conversationSchema = new Schema<CompanionConversationRecord>(
  {
    chatCode: { type: String, required: true, unique: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
);

conversationSchema.index({ updatedAt: -1 });

export const CompanionConversationModel =
  (models.CompanionConversation as
    | Model<CompanionConversationRecord>
    | undefined) ??
  model<CompanionConversationRecord>(
    "CompanionConversation",
    conversationSchema,
  );
