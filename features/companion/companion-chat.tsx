"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

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
    <section aria-label="Digisafe AI conversation" className="companion-chat">
      <header className="companion-chat-header">
        <div className="companion-chat-identity">
          <span aria-hidden="true" className="companion-chat-avatar">
            D
          </span>
          <div>
            <h2>Digisafe AI</h2>
            <p>Child protection and online safety</p>
          </div>
        </div>
        <div className="companion-chat-header-actions">
          {chatCode && (
            <div className="companion-chat-code">
              <span className="font-mono">{chatCode}</span>
              <button onClick={copyChatCode} type="button">
                Copy
              </button>
            </div>
          )}
          {messages.length > 1 && (
            <button
              className="companion-new-chat"
              onClick={startNewConversation}
              type="button"
            >
              New chat
            </button>
          )}
        </div>
      </header>

      <p className="companion-privacy-note">
        Messages are saved for authorised AYVDI administrators until deleted
        and sent to OpenAI to generate replies.{" "}
        <Link href="/privacy">Privacy details</Link>
      </p>

      <div
        aria-live="polite"
        aria-relevant="additions"
        className="companion-message-list"
        ref={messageListRef}
        role="log"
      >
        {messages.map((item, index) => (
          <article
            className={`companion-message companion-message-${item.role}`}
            key={`${item.role}-${index}`}
          >
            {item.role === "assistant" && (
              <span aria-hidden="true" className="companion-message-avatar">
                D
              </span>
            )}
            <div className="companion-message-content">
              <p className="companion-message-author">
                {item.role === "user" ? "You" : "Digisafe AI"}
              </p>
              <p className="companion-message-text">{item.content}</p>
            </div>
          </article>
        ))}
        {isSending && (
          <div
            aria-label="Digisafe AI is responding"
            className="companion-message companion-message-assistant"
          >
            <span aria-hidden="true" className="companion-message-avatar">
              D
            </span>
            <p className="companion-typing">Digisafe AI is typing…</p>
          </div>
        )}
      </div>

      <form className="companion-composer" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="companion-message">
          Your message
        </label>
        <textarea
          autoComplete="off"
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
          disabled={isSending || !message.trim()}
          type="submit"
        >
          {isSending ? "…" : "Send"}
        </button>
      </form>
      <div className="companion-chat-footer">
        {errorMessage ? (
          <p aria-live="assertive" className="report-error" role="alert">
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
