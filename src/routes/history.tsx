import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { History, MessageSquare, ArrowUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoChat } from "@/components/ayanfe/chat-context";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/history")({ head: () => pageHead("Chat History", "Revisit AYANFE AI demonstration conversations from this browser session."), component: HistoryPage });
function HistoryPage() {
  const { threads, remove } = useDemoChat();
  const navigate = useNavigate();
  return <main className="tool-page"><span className="welcome-eyebrow">A PLACE FOR EVERY IDEA</span><h1>Chat History</h1><p className="tool-description">Your conversations, ready to pick up where you left off.</p><p className="session-note">Session only · Refreshing the page clears your demo history.</p>{threads.length ? <div className="history-list">{threads.map(thread => <div className="history-row" key={thread.id}><MessageSquare size={20} /><Button variant="ghost" className="history-link" onClick={() => navigate({ to: "/chat/$threadId", params: { threadId: thread.id } })}><span>{thread.title}<small>{thread.messages.length} messages · Demo conversation</small></span><ArrowUpRight size={18} /></Button><Button variant="ghost" size="icon" aria-label={`Delete conversation: ${thread.title}`} title="Delete conversation" onClick={() => remove(thread.id)}><Trash2 /></Button></div>)}</div> : <div className="history-empty"><History size={36} /><h2>Your next idea starts here</h2><p>No conversations yet. Let’s start something.</p><Button asChild><Link to="/">New conversation<ArrowUpRight /></Link></Button></div>}</main>;
}