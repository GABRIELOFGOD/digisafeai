"use client";

import { useState } from "react";
import type {
  CompanionArchiveMessage,
  CompanionArchiveSummary,
} from "@/features/companion/chat.service";
import { formatNigeriaDateTime } from "@/lib/format-date-time";

type ArchivePage = {
  conversations: CompanionArchiveSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  error?: string;
};

type ConversationDetails = {
  chatCode: string;
  createdAt: string;
  updatedAt: string;
  messages: CompanionArchiveMessage[];
};

type ArchiveResponse = ArchivePage & { error?: string };

export function CompanionArchiveManager({
  initialArchive,
}: {
  initialArchive: ArchivePage;
}) {
  const [archive, setArchive] = useState(initialArchive);
  const [selectedCode, setSelectedCode] = useState("");
  const [conversation, setConversation] = useState<ConversationDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  async function loadPage(page: number) {
    setIsLoading(true);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/v1/staff/conversations?page=${page}`,
        { cache: "no-store" },
      );
      const result = (await response.json()) as ArchiveResponse;
      if (!response.ok || !Array.isArray(result.conversations)) {
        throw new Error(result.error ?? "The archive could not be loaded.");
      }
      setArchive(result);
      setSelectedCode("");
      setConversation(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "The archive could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function viewConversation(chatCode: string) {
    setSelectedCode(chatCode);
    setConversation(null);
    setIsLoading(true);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/v1/staff/conversations/${encodeURIComponent(chatCode)}`,
        { cache: "no-store" },
      );
      const result = (await response.json()) as {
        conversation?: ConversationDetails;
        error?: string;
      };
      if (!response.ok || !result.conversation) {
        throw new Error(result.error ?? "The conversation could not be loaded.");
      }
      setConversation(result.conversation);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The conversation could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteConversation(chatCode: string) {
    if (
      !window.confirm(
        `Permanently delete conversation ${chatCode}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch(
        `/api/v1/staff/conversations/${encodeURIComponent(chatCode)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "The conversation could not be deleted.");
      }

      setConversation(null);
      setSelectedCode("");
      await loadPage(archive.page);
      setNotice(`Conversation ${chatCode} was deleted.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The conversation could not be deleted.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
      <section aria-label="Conversation archive" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {archive.total} conversation{archive.total === 1 ? "" : "s"}
          </p>
          <button
            className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            disabled={isLoading || archive.page <= 1}
            onClick={() => void loadPage(archive.page - 1)}
            type="button"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {archive.page} of {archive.totalPages}
          </span>
          <button
            className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            disabled={isLoading || archive.page >= archive.totalPages}
            onClick={() => void loadPage(archive.page + 1)}
            type="button"
          >
            Next
          </button>
        </div>
        {archive.conversations.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            No AI conversations have been saved yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {archive.conversations.map((item) => (
              <li key={item.chatCode}>
                <button
                  aria-current={selectedCode === item.chatCode ? "true" : undefined}
                  className={`w-full rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary ${
                    selectedCode === item.chatCode
                      ? "border-primary"
                      : "border-border"
                  }`}
                  disabled={isLoading}
                  onClick={() => void viewConversation(item.chatCode)}
                  type="button"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="font-mono text-sm">{item.chatCode}</strong>
                    <span className="text-xs text-muted-foreground">
                      {formatNigeriaDateTime(item.updatedAt)}
                    </span>
                  </span>
                  <span className="mt-2 block line-clamp-2 text-sm text-muted-foreground">
                    {item.preview}
                  </span>
                  <span className="mt-2 block text-xs text-muted-foreground">
                    {item.messageCount} message{item.messageCount === 1 ? "" : "s"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-label="Selected conversation"
        className="min-h-56 rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        {isLoading && (
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Loading…
          </p>
        )}
        {!isLoading && !conversation && (
          <p className="text-sm text-muted-foreground">
            Select a conversation to review its messages.
          </p>
        )}
        {conversation && (
          <>
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="font-mono text-lg font-semibold">
                  {conversation.chatCode}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Started {formatNigeriaDateTime(conversation.createdAt)}
                </p>
              </div>
              <button
                className="rounded-md border border-destructive px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50"
                disabled={isLoading}
                onClick={() => void deleteConversation(conversation.chatCode)}
                type="button"
              >
                Delete conversation
              </button>
            </header>
            <ol className="mt-5 space-y-4">
              {conversation.messages.map((item, index) => (
                <li
                  className="rounded-lg border border-border p-4"
                  key={`${item.createdAt}-${index}`}
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <strong className="text-sm">
                      {item.role === "user" ? "User" : "Digisafe AI"}
                    </strong>
                    <time className="text-xs text-muted-foreground">
                      {formatNigeriaDateTime(item.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap wrap-break-word leading-7">
                    {item.content}
                  </p>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      {errorMessage && (
        <p aria-live="assertive" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive xl:col-span-2" role="alert">
          {errorMessage}
        </p>
      )}
      {notice && (
        <p aria-live="polite" className="text-sm text-muted-foreground xl:col-span-2">
          {notice}
        </p>
      )}
    </div>
  );
}
