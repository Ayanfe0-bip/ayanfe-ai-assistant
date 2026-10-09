import { createContext, useContext, useState, type ReactNode } from "react";
import type { UIMessage } from "ai";

export type DemoThread = { id: string; title: string; messages: UIMessage[] };
type ChatState = {
  threads: DemoThread[];
  createThread: (text: string) => string;
  append: (id: string, message: UIMessage) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const ChatContext = createContext<ChatState | null>(null);
export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<DemoThread[]>([]);
  const createThread = (text: string) => {
    const id = crypto.randomUUID();
    setThreads((previous) => [
      {
        id,
        title: text.slice(0, 60),
        messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text }] }],
      },
      ...previous,
    ]);
    return id;
  };
  const append = (id: string, message: UIMessage) =>
    setThreads((previous) =>
      previous.map((thread) =>
        thread.id === id ? { ...thread, messages: [...thread.messages, message] } : thread,
      ),
    );
  return (
    <ChatContext.Provider
      value={{
        threads,
        createThread,
        append,
        remove: (id) => setThreads((previous) => previous.filter((thread) => thread.id !== id)),
        clear: () => setThreads([]),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
export function useDemoChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("ChatProvider is required");
  return context;
}
