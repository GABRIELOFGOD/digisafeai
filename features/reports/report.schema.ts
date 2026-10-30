import { z } from "zod";

export const reportCategories = [
  "bullying",
  "threats_coercion",
  "sexual_messages_or_exposure",
  "image_based_abuse",
  "grooming_or_exploitation",
  "physical_or_sexual_abuse",
  "discrimination_or_stalking",
  "other_or_unsure",
] as const;

export const reportStatuses = [
  "new",
  "awaiting_triage",
  "under_review",
  "follow_up_required",
  "referred",
  "closed",
] as const;

export const humanUrgencies = ["unreviewed", "routine", "urgent"] as const;

const safeContactSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("phone"),
    value: z
      .string()
      .trim()
      .regex(/^[+0-9()\-\s]{6,30}$/, "Enter a valid phone contact."),
  }),
  z.object({
    method: z.literal("email"),
    value: z.string().trim().email().max(200),
  }),
]);

export const reportInputSchema = z
  .object({
    reportAbout: z.enum(["myself", "someone_else"]),
    category: z.enum(reportCategories),
    description: z.string().trim().min(10).max(4000),
    approximateDate: z.string().trim().max(40).optional(),
    generalLocation: z.string().trim().max(120).optional(),
    onlinePlatform: z.string().trim().max(120).optional(),
    immediateDanger: z.boolean(),
    safeContact: safeContactSchema.optional(),
  })
  .strict();

export type ReportInput = z.infer<typeof reportInputSchema>;
