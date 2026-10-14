import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  History,
  MessageSquare,
  ArrowUpRight,
  Trash2,
  LoaderCircle,
  Search,
  Plus,
  X,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDemoChat } from "@/components/ayanfe/chat-context";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/history")({
  head: () =>
    pageHead(
      "Chat History",
      "View, search, and manage your AYANFE AI conversations.",
    ),
  component: HistoryPage,
});

function HistoryPage() {
  const { threads, remove, isLoading } = useDemoChat();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const filteredThreads = useMemo(() => {
    const query = search.trim().toLowerCase();

    const results = query
      ? threads.filter((thread) => {
          const titleMatches = thread.title
            .toLowerCase()
            .includes(query);

          const messageMatches = thread.messages.some((message) =>
            message.parts.some(
              (part) =>
                part.type === "text" &&
                (part.text ?? "").toLowerCase().includes(query),
            ),
          );

          return titleMatches || messageMatches;
        })
      : [...threads];

    return results;
  }, [threads, search]);

  const confirmDelete = () => {
    if (!deleteTarget) return;

    remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <main className="tool-page">
      <div className="history-page-header">
        <span className="welcome-eyebrow">
          A PLACE FOR EVERY IDEA
        </span>

        <h1>Chat History</h1>

        <p className="tool-description">
          Your conversations, ready to pick up where you left off.
        </p>

        <div className="history-summary">
          <div className="history-summary-icon">
            <History size={21} />
          </div>

          <div>
            <strong>
              {threads.length}{" "}
              {threads.length === 1 ? "conversation" : "conversations"}
            </strong>

            <p>Your AYANFE AI workspace</p>
          </div>

          <Button asChild className="history-new-chat">
            <Link to="/">
              <Plus size={17} />
              New chat
            </Link>
          </Button>
        </div>
      </div>

      {!isLoading && threads.length > 0 && (
        <div className="history-search">
          <Search size={19} />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations or messages..."
            aria-label="Search conversation history"
          />

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={17} />
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        <div
          className="history-empty"
          role="status"
          aria-live="polite"
        >
          <LoaderCircle size={36} className="animate-spin" />

          <h2>Loading your conversations</h2>

          <p>
            Please wait while AYANFE AI retrieves your chat history.
          </p>
        </div>
      ) : filteredThreads.length > 0 ? (
        <section
          className="history-list"
          aria-label="Your conversations"
        >
          {filteredThreads.map((thread) => {
            const messageCount = thread.messages.length;

            const lastMessage = thread.messages.at(-1);

            const lastMessageText = lastMessage
              ? lastMessage.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text ?? "")
                  .join(" ")
              : "";

            const preview = lastMessageText
              ? lastMessageText.length > 110
                ? `${lastMessageText.slice(0, 110)}...`
                : lastMessageText
              : "Start chatting to develop this idea.";

            return (
              <article className="history-row" key={thread.id}>
                <div className="history-row-icon">
                  <MessageSquare size={21} />
                </div>

                <div className="history-row-content">
                  <button
                    type="button"
                    className="history-title-button"
                    onClick={() =>
                      navigate({
                        to: "/chat/$threadId",
                        params: { threadId: thread.id },
                      })
                    }
                  >
                    <span className="history-thread-title">
                      {thread.title || "New conversation"}
                    </span>

                    <ArrowUpRight size={17} />
                  </button>

                  <p className="history-preview">{preview}</p>

                  <div className="history-metadata">
                    <span>
                      <MessageSquare size={13} />
                      {messageCount}{" "}
                      {messageCount === 1 ? "message" : "messages"}
                    </span>

                    <span>
                      <Clock3 size={13} />
                      Conversation
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="history-delete"
                  aria-label={`Delete conversation: ${thread.title}`}
                  title="Delete conversation"
                  onClick={() =>
                    setDeleteTarget({
                      id: thread.id,
                      title: thread.title || "New conversation",
                    })
                  }
                >
                  <Trash2 size={18} />
                </Button>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="history-empty">
          {search ? <Search size={36} /> : <History size={36} />}

          <h2>
            {search
              ? "No matching conversations"
              : "Your next idea starts here"}
          </h2>

          <p>
            {search
              ? "Try a different search term or clear your search."
              : "You haven't started a conversation yet. Begin a new chat and explore what AYANFE AI can do."}
          </p>

          {search ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setSearch("")}
            >
              Clear search
            </Button>
          ) : (
            <Button asChild>
              <Link to="/">
                <Plus size={17} />
                Start a new conversation
                <ArrowUpRight size={17} />
              </Link>
            </Button>
          )}
        </div>
      )}

      {deleteTarget && (
        <div
          className="history-dialog-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="history-delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <div className="history-delete-dialog-icon">
              <Trash2 size={24} />
            </div>

            <h2 id="delete-dialog-title">
              Delete this conversation?
            </h2>

            <p id="delete-dialog-description">
              You're about to delete "{deleteTarget.title}". This action
              cannot be undone.
            </p>

            <div className="history-delete-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
              >
                <Trash2 size={16} />
                Delete conversation
              </Button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
                  }
