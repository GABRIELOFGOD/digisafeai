"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { useEffect } from "react";
import type { RichTextDocument } from "./rich-text";

const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
  }),
  Link.configure({
    autolink: true,
    openOnClick: false,
    protocols: ["mailto"],
    HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
  }),
];

export function RichTextEditor({
  value,
  onChange,
  label,
}: {
  value: RichTextDocument;
  onChange: (value: RichTextDocument) => void;
  label: string;
}) {
  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as RichTextDocument);
    },
    editorProps: {
      attributes: {
        "aria-label": label,
        class: "rich-text-editor-content",
      },
    },
  });

  useEffect(() => {
    if (
      editor &&
      JSON.stringify(editor.getJSON()) !== JSON.stringify(value)
    ) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  function setLink() {
    if (!editor) return;
    const currentHref = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Enter a web URL (https://) or email link (mailto:)", currentHref ?? "");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: href.trim() }).run();
  }

  if (!editor) {
    return (
      <div
        aria-label={label}
        className="min-h-56 rounded-md border border-input bg-background"
      />
    );
  }

  const buttonClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded border border-border px-2 text-sm hover:bg-muted disabled:opacity-40";

  return (
    <div className="overflow-hidden rounded-md border border-input bg-background">
      <div
        aria-label="Text formatting"
        className="flex flex-wrap gap-1 border-b border-border p-2"
        role="toolbar"
      >
        <button aria-label="Bold" className={buttonClass} onClick={() => editor.chain().focus().toggleBold().run()} type="button"><Bold size={16} /></button>
        <button aria-label="Italic" className={buttonClass} onClick={() => editor.chain().focus().toggleItalic().run()} type="button"><Italic size={16} /></button>
        <button aria-label="Strikethrough" className={buttonClass} onClick={() => editor.chain().focus().toggleStrike().run()} type="button"><Strikethrough size={16} /></button>
        <button aria-label="Inline code" className={buttonClass} onClick={() => editor.chain().focus().toggleCode().run()} type="button"><Code size={16} /></button>
        <button aria-label="Heading 2" className={buttonClass} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} type="button"><Heading2 size={16} /></button>
        <button aria-label="Heading 3" className={buttonClass} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} type="button"><Heading3 size={16} /></button>
        <button aria-label="Bullet list" className={buttonClass} onClick={() => editor.chain().focus().toggleBulletList().run()} type="button"><List size={16} /></button>
        <button aria-label="Numbered list" className={buttonClass} onClick={() => editor.chain().focus().toggleOrderedList().run()} type="button"><ListOrdered size={16} /></button>
        <button aria-label="Add link" className={buttonClass} onClick={setLink} type="button"><LinkIcon size={16} /></button>
        <button aria-label="Undo" className={buttonClass} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} type="button"><Undo2 size={16} /></button>
        <button aria-label="Redo" className={buttonClass} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} type="button"><Redo2 size={16} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
