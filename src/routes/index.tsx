import { createFileRoute } from "@tanstack/react-router";
import { ChatWorkspace } from "@/components/ayanfe/chat-workspace";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/")({
  head: () => pageHead("Welcome", "Meet AYANFE AI: a new space to write, learn, code, and explore. Try the clearly labeled frontend demonstration."),
  component: () => <ChatWorkspace />,
});