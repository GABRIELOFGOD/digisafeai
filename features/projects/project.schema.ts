import { z } from "zod";
import { richTextDocumentSchema } from "@/features/rich-content/rich-text.schema";
import { richTextPlainText } from "@/features/rich-content/rich-text";

const projectRichTextSchema = richTextDocumentSchema.refine(
  (document) => richTextPlainText(document).trim().length >= 30,
  { message: "Project story must contain at least 30 characters." },
);

const imageSchema = z.union([
  z.string().regex(/^[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|webp)$/i),
  z.string().regex(/^\/api\/v1\/content-images\/[a-f0-9]{24}$/i),
]);

export const projectInputSchema = z
  .object({
    name: z.string().trim().min(2).max(140),
    description: z.string().trim().min(10).max(500),
    image: imageSchema,
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    outcomes: z.array(z.string().trim().min(2).max(500)).min(1).max(20),
    fullDescription: z.union([
      z.string().trim().min(30).max(12000),
      projectRichTextSchema,
    ]),
  })
  .strict();

export type ProjectInput = z.infer<typeof projectInputSchema>;
