import { createFileRoute } from "@tanstack/react-router";
import { ChatWorkspace } from "@/components/ayanfe/chat-workspace";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/chat/$threadId")({ head: () => pageHead("Conversation", "Your session-only AYANFE AI demonstration conversation. No live AI service is connected."), component: ChatPage });
function ChatPage() { const { threadId } = Route.useParams(); return <ChatWorkspace key={threadId} threadId={threadId} />; }