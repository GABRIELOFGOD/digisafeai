"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  chatCode?: string;
  reply?: string;
  error?: string;
};

const initialMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hello, I’m Digisafe AI, a product of Advocacy for Youth and Vulnerable Development Initiative (AYVDI). I can help with child protection and online safety. What would you like support with?",
};

function formatInlineText(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={`${keyPrefix}-${index}`}>{part.slice(1, -1)}</em>;
      }

      return part;
    });
}

function formatAssistantMessage(content: string) {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let isOrderedList = false;

  function flushParagraph() {
    if (paragraph.length === 0) return;

    const text = paragraph.join(" ");
    blocks.push(
      <p key={`paragraph-${blocks.length}`}>
        {formatInlineText(text, `paragraph-${blocks.length}`)}
      </p>,
    );
    paragraph = [];
  }

  function flushList() {
    if (listItems.length === 0) return;

    const List = isOrderedList ? "ol" : "ul";
    blocks.push(
      <List key={`list-${blocks.length}`}>
        {listItems.map((item, index) => (
          <li key={index}>
            {formatInlineText(item, `list-${blocks.length}-${index}`)}
          </li>
        ))}
      </List>,
    );
    listItems = [];
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    const orderedItem = line.match(/^\d+[.)]\s+(.+)$/);
    const unorderedItem = line.match(/^[-*]\s+(.+)$/);

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`heading-${blocks.length}`}>
          {formatInlineText(heading[1], `heading-${blocks.length}`)}
        </h3>,
      );
      continue;
    }

    if (orderedItem || unorderedItem) {
      flushParagraph();
      const nextIsOrdered = Boolean(orderedItem);
      if (listItems.length > 0 && isOrderedList !== nextIsOrdered) flushList();
      isOrderedList = nextIsOrdered;
      const listItem = orderedItem?.[1] ?? unorderedItem?.[1];
      if (listItem) listItems.push(listItem);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export function CompanionChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [chatCode, setChatCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message.trim();
    if (!content || isSending) return;

    setMessages((current) => [...current, { role: "user", content }]);
    setMessage("");
    setErrorMessage("");
    setCopyMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/v1/companion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatCode: chatCode || undefined,
          message: content,
        }),
      });
      const result = (await response.json()) as ChatResponse;

      if (result.chatCode) setChatCode(result.chatCode);
      if (!response.ok || !result.reply) {
        setErrorMessage(
          result.error ?? "Digisafe AI could not reply. Please try again.",
        );
        return;
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply! },
      ]);
    } catch {
      setErrorMessage(
        "We could not confirm the response. Please check your connection and try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  async function copyChatCode() {
    try {
      await navigator.clipboard.writeText(chatCode);
      setCopyMessage("Conversation code copied.");
    } catch {
      setCopyMessage("Copy was unavailable. Select and copy the code above.");
    }
  }

  function startNewConversation() {
    setMessages([initialMessage]);
    setChatCode("");
    setMessage("");
    setErrorMessage("");
    setCopyMessage("");
  }

  return (
    <section aria-label="Digisafe AI conversation" className="mx-auto mt-8 flex min-h-[38rem] w-full max-w-[54rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl max-[700px]:mt-6 max-[700px]:min-h-[34rem]">
      <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border p-4 max-[700px]:items-start max-[700px]:p-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
            D
          </span>
          <div>
            <h2 className="m-0 text-base font-bold text-[var(--public-deep)]">Digisafe AI</h2>
            <p className="mt-1 text-xs text-muted-foreground">Child protection and online safety</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 max-[700px]:flex-col max-[700px]:items-end">
          {chatCode && (
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground max-[700px]:max-w-44 max-[700px]:break-all">
              <span className="font-mono">{chatCode}</span>
              <button className="cursor-pointer border-0 bg-transparent text-xs font-semibold text-primary hover:underline" onClick={copyChatCode} type="button">
                Copy
              </button>
            </div>
          )}
          {messages.length > 1 && (
            <button
              className="cursor-pointer rounded-full border border-border px-3 py-2 text-xs font-semibold text-primary hover:underline"
              onClick={startNewConversation}
              type="button"
            >
              New chat
            </button>
          )}
        </div>
      </header>

      <p className="m-0 border-b border-border bg-muted px-5 py-3 text-xs leading-6 text-muted-foreground max-[700px]:px-4">
        Messages are saved for authorised AYVDI administrators until deleted
        and sent to OpenAI to generate replies.{" "}
        <Link className="font-semibold text-primary underline-offset-4" href="/privacy">Privacy details</Link>
      </p>

      <div
        aria-live="polite"
        aria-relevant="additions"
        className="flex min-h-80 max-h-[min(55vh,38rem)] flex-1 flex-col gap-4 overflow-y-auto scroll-smooth p-5 max-[700px]:min-h-[19rem] max-[700px]:px-3 max-[700px]:py-4"
        ref={messageListRef}
        role="log"
      >
        {messages.map((item, index) => (
          <article
            className={`flex max-w-[88%] items-end gap-2.5 max-[700px]:max-w-[94%] ${item.role === "user" ? "self-end" : ""}`}
            key={`${item.role}-${index}`}
          >
            {item.role === "assistant" && (
              <span aria-hidden="true" className="grid size-[1.85rem] shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                D
              </span>
            )}
            <div className={`min-w-0 rounded-[1.05rem_1.05rem_1.05rem_0.25rem] border border-border bg-muted px-4 py-3 ${item.role === "user" ? "rounded-[1.05rem_1.05rem_0.25rem_1.05rem] border-primary bg-primary text-primary-foreground" : ""}`}>
              <p className="mb-1 text-xs font-bold opacity-75">
                {item.role === "user" ? "You" : "Digisafe AI"}
              </p>
              {item.role === "assistant" ? (
                <div className="m-0 break-words text-[0.94rem] leading-relaxed [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:leading-6 [&_p]:my-2 [&_ol]:my-2 [&_ol]:mb-3 [&_ol]:grid [&_ol]:gap-1 [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:mb-3 [&_ul]:grid [&_ul]:gap-1 [&_ul]:pl-5 [&_li]:pl-0.5">
                  {formatAssistantMessage(item.content)}
                </div>
              ) : (
                <p className="m-0 break-words whitespace-pre-wrap text-[0.94rem] leading-relaxed">{item.content}</p>
              )}
            </div>
          </article>
        ))}
        {isSending && (
          <div
            aria-label="Digisafe AI is responding"
            className="flex max-w-[88%] items-end gap-2.5"
          >
            <span aria-hidden="true" className="grid size-[1.85rem] shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              D
            </span>
            <p className="m-0 rounded-2xl rounded-bl-sm border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">Digisafe AI is typing…</p>
          </div>
        )}
      </div>

      <form className="mx-5 flex items-end gap-3 rounded-2xl border border-border bg-background p-2 focus-within:border-primary focus-within:outline-2 focus-within:outline-primary/25 focus-within:outline-offset-1 max-[700px]:mx-3 max-[700px]:gap-2" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="companion-message">
          Your message
        </label>
        <textarea
          autoComplete="off"
          className="min-h-11 max-h-36 flex-1 resize-y border-0 bg-transparent px-3 py-2 text-foreground outline-none placeholder:text-muted-foreground"
          id="companion-message"
          maxLength={2000}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Type your message…"
          required
          rows={1}
          value={message}
        />
        <button
          aria-label={isSending ? "Sending message" : "Send message"}
          className="min-h-11 min-w-18 cursor-pointer rounded-xl border-0 bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSending || !message.trim()}
          type="submit"
        >
          {isSending ? "…" : "Send"}
        </button>
      </form>
      <div className="grid gap-1 px-5 pb-4 pt-3 text-center text-xs leading-6 text-muted-foreground max-[700px]:px-3.5 [&>p]:m-0 [&_.text-destructive]:text-left">
        {errorMessage ? (
          <p aria-live="assertive" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : (
          <p>
            Press Enter to send · Shift + Enter for a new line
            {message.length > 0 && ` · ${message.length}/2000`}
          </p>
        )}
        <p>
          Don’t share names, addresses, passwords, or intimate images.
        </p>
        {copyMessage && (
          <p aria-live="polite" role="status">
            {copyMessage}
          </p>
        )}
      </div>
    </section>
  );
}
