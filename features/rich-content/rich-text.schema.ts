import { z } from "zod";
import type { RichTextNode } from "./rich-text";

type RichTextNodeInput = Omit<RichTextNode, "content"> & {
  content?: RichTextNodeInput[];
};

const markSchema = z
  .object({
    type: z.enum(["bold", "italic", "strike", "code", "link"]),
    attrs: z.record(z.string(), z.string()).optional(),
  })
  .strict();

const nodeSchema: z.ZodType<RichTextNodeInput> = z.lazy(() =>
  z
    .object({
      type: z.enum([
        "doc",
        "paragraph",
        "heading",
        "text",
        "hardBreak",
        "bulletList",
        "orderedList",
        "listItem",
        "blockquote",
        "codeBlock",
        "horizontalRule",
      ]),
      text: z.string().max(8000).optional(),
      attrs: z
        .record(
          z.string(),
          z.union([z.string().max(2000), z.number(), z.boolean(), z.null()]),
        )
        .optional(),
      marks: z.array(markSchema).max(5).optional(),
      content: z.array(nodeSchema).max(500).optional(),
    })
    .strict(),
);

export const richTextDocumentSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(nodeSchema).min(1).max(500),
  })
  .strict()
  .superRefine((document, context) => {
    function inspect(nodes: RichTextNodeInput[], depth: number) {
      if (depth > 12) {
        context.addIssue({
          code: "custom",
          message: "Rich text nesting is too deep.",
        });
        return;
      }

      for (const node of nodes) {
        if (node.type === "heading") {
          const level = node.attrs?.level;
          if (level !== 2 && level !== 3 && level !== 4) {
            context.addIssue({
              code: "custom",
              message: "Rich text headings must use levels 2 to 4.",
            });
          }
        }

        for (const mark of node.marks ?? []) {
          if (mark.type === "link") {
            const href = mark.attrs?.href;
            if (
              !href ||
              !/^(https?:\/\/|mailto:)/i.test(href) ||
              href.length > 2000
            ) {
              context.addIssue({
                code: "custom",
                message: "Links must use a safe web or email address.",
              });
            }
          }
        }

        if (node.content) inspect(node.content, depth + 1);
      }
    }

    inspect(document.content, 0);
  });

export type RichTextDocumentInput = z.infer<typeof richTextDocumentSchema>;
