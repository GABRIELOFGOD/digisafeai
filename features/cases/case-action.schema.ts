import { z } from "zod";
import { reportStatuses, humanUrgencies } from "@/features/reports/report.schema";

export const caseActionInputSchema = z
  .object({
    status: z.enum(reportStatuses).optional(),
    urgency: z.enum(humanUrgencies).optional(),
    assignedTo: z.string().min(1).nullable().optional(),
    rationale: z.string().trim().min(8).max(500),
  })
  .strict()
  .refine(
    (value) =>
      value.status !== undefined ||
      value.urgency !== undefined ||
      value.assignedTo !== undefined,
    {
      message: "Choose a case update.",
    },
  );
