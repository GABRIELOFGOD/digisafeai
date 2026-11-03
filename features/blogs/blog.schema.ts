import { z } from "zod";
import { richTextDocumentSchema } from "@/features/rich-content/rich-text.schema";
import { richTextPlainText } from "@/features/rich-content/rich-text";

const blogRichTextSchema = richTextDocumentSchema.refine(
  (document) => richTextPlainText(document).trim().length > 0,
  { message: "Blog story cannot be empty." },
);

const legacyBlogSectionSchema = z
  .object({
    heading: z.string().max(160),
    paragraphs: z.array(z.string().max(4000)).min(1).max(12),
  })
  .strict();

const imageSchema = z.union([
  z.string().regex(/^[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|webp)$/i),
  z.string().regex(/^\/api\/v1\/content-images\/[a-f0-9]{24}$/i),
]);

export const blogInputSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(120),
    title: z.string().trim().min(3).max(180),
    excerpt: z.string().trim().min(10).max(300),
    category: z.string().trim().min(2).max(80),
    author: z.string().trim().min(2).max(80),
    publishedAt: z.string().datetime(),
    image: imageSchema,
    imageAlt: z.string().trim().min(3).max(180),
    isFeatured: z.boolean(),
    isPublished: z.boolean(),
    content: z.union([
      blogRichTextSchema,
      z.array(legacyBlogSectionSchema).min(1).max(30),
    ]),
  })
  .strict();

export type BlogInput = z.infer<typeof blogInputSchema>;
