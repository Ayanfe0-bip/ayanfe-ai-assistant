import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
History,
MessageSquare,
ArrowUpRight,
Trash2,
LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoChat } from "@/components/ayanfe/chat-context";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/history")({
head: () =>
pageHead(
"Chat History",
"View and manage your AYANFE AI conversations.",
),
component: HistoryPage,
});

function HistoryPage() {
const { threads, remove, isLoading } = useDemoChat();
const navigate = useNavigate();

return (
<main className="tool-page">
<span className="welcome-eyebrow">A PLACE FOR EVERY IDEA</span>

  <h1>Chat History</h1>

  <p className="tool-description">
    Your conversations, ready to pick up where you left off.
  </p>

  {isLoading ? (
    <div className="history-empty" role="status" aria-live="polite">
      <LoaderCircle size={36} className="animate-spin" />
      <h2>Loading your conversations</h2>
      <p>Please wait while AYANFE AI retrieves your chat history.</p>
    </div>
  ) : threads.length > 0 ? (
    <div className="history-list">
      {threads.map((thread) => (
        <div className="history-row" key={thread.id}>
          <MessageSquare size={20} />

          <Button
            variant="ghost"
            className="history-link"
            onClick={() =>
              navigate({
                to: "/chat/$threadId",
                params: { threadId: thread.id },
              })
            }
          >
            <span>
              {thread.title || "New conversation"}
              <small>
                {thread.messages.length} messages · Saved conversation
              </small>
            </span>

            <ArrowUpRight size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete conversation: ${thread.title}`}
            title="Delete conversation"
            onClick={() => {
              const confirmed = window.confirm(
                `Delete "${thread.title}"? This action cannot be undone.`,
              );

              if (confirmed) {
                remove(thread.id);
              }
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  ) : (
    <div className="history-empty">
      <History size={36} />

      <h2>Your next idea starts here</h2>

      <p>
        No conversations to display yet. Start a new chat and your
        conversations can be saved when you're signed in.
      </p>

      <Button asChild>
        <Link to="/">
          New conversation
          <ArrowUpRight />
        </Link>
      </Button>
    </div>
  )}
</main>

);
      }
