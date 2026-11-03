import type { ReactNode } from "react";
import type { LegacyBlogSection, RichTextDocument, RichTextNode } from "./rich-text";
import {
  blogContentToDocument,
  isRichTextDocument,
  projectContentToDocument,
} from "./rich-text";

function safeHref(value: string) {
  return /^(https?:\/\/|mailto:)/i.test(value) ? value : undefined;
}

function renderNode(node: RichTextNode, key: string): ReactNode {
  if (node.type === "text") {
    let text: ReactNode = node.text ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") text = <strong key={`${key}-bold`}>{text}</strong>;
      if (mark.type === "italic") text = <em key={`${key}-italic`}>{text}</em>;
      if (mark.type === "strike") text = <s key={`${key}-strike`}>{text}</s>;
      if (mark.type === "code") text = <code key={`${key}-code`}>{text}</code>;
      if (mark.type === "link") {
        const href = mark.attrs?.href ? safeHref(mark.attrs.href) : undefined;
        if (href) {
          text = (
            <a href={href} key={`${key}-link`} rel="noopener noreferrer">
              {text}
            </a>
          );
        }
      }
    }
    return <span key={key}>{text}</span>;
  }

  const children = node.content?.map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );

  switch (node.type) {
    case "doc":
      return <div key={key}>{children}</div>;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = node.attrs?.level;
      if (level === 2) return <h2 key={key}>{children}</h2>;
      if (level === 3) return <h3 key={key}>{children}</h3>;
      return <h4 key={key}>{children}</h4>;
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      );
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} />;
    default:
      return null;
  }
}

export function RichTextContent({
  content,
}: {
  content: RichTextDocument | LegacyBlogSection[] | string;
}) {
  let document: RichTextDocument;

  if (typeof content === "string") {
    document = projectContentToDocument(content);
  } else if (isRichTextDocument(content)) {
    document = content;
  } else {
    document = blogContentToDocument(content);
  }

  return (
    <div className="rich-text-content">
      {renderNode(document, "rich-content")}
    </div>
  );
}
