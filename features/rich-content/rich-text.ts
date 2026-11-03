export type RichTextMark = {
  type: "bold" | "italic" | "strike" | "code" | "link";
  attrs?: Record<string, string>;
};

export type RichTextNode = {
  type: string;
  text?: string;
  attrs?: Record<string, string | number | boolean | null>;
  marks?: RichTextMark[];
  content?: RichTextNode[];
};

export type RichTextDocument = {
  type: "doc";
  content: RichTextNode[];
};

export function emptyRichTextDocument(): RichTextDocument {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export function richTextPlainText(document: RichTextDocument): string {
  function getNodeText(node: RichTextNode): string {
    return `${node.text ?? ""}${node.content?.map(getNodeText).join("") ?? ""}`;
  }

  return document.content.map(getNodeText).join("");
}

export type LegacyBlogSection = {
  heading: string;
  paragraphs: string[];
};

export function isRichTextDocument(value: unknown): value is RichTextDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "doc" &&
    "content" in value &&
    Array.isArray(value.content)
  );
}

export function blogContentToDocument(
  content: RichTextDocument | LegacyBlogSection[],
): RichTextDocument {
  if (isRichTextDocument(content)) return content;

  return {
    type: "doc",
    content: content.flatMap((section) => [
      ...(section.heading
        ? [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: section.heading }],
            },
          ]
        : []),
      ...section.paragraphs.map((text) => ({
        type: "paragraph",
        content: [{ type: "text", text }],
      })),
    ]),
  };
}

export function projectContentToDocument(
  content: RichTextDocument | string,
): RichTextDocument {
  if (isRichTextDocument(content)) return content;

  return {
    type: "doc",
    content: content
      .split(/\n{2,}/)
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({
        type: "paragraph",
        content: [{ type: "text", text }],
      })),
  };
}

export function imageSource(image: string) {
  return image.startsWith("/") ? image : `/${image}`;
}
