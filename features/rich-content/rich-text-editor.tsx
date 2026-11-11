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
        class: "min-h-56 outline-none leading-[1.7] [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_p]:my-3 [&_h2]:my-6 [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:my-5 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h4]:my-4 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_a]:text-primary [&_a]:underline",
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
      <EditorContent className="p-4" editor={editor} />
    </div>
  );
}
