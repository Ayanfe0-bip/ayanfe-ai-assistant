import {
createContext,
useCallback,
useContext,
useEffect,
useRef,
useState,
type ReactNode,
} from "react";
import type { UIMessage } from "ai";
import { supabase } from "@/lib/supabase";

export type DemoThread = {
id: string;
title: string;
messages: UIMessage[];
};

type ChatState = {
threads: DemoThread[];
isLoading: boolean;
createThread: (text: string) => string;
append: (id: string, message: UIMessage) => void;
remove: (id: string) => void;
clear: () => void;
};

const ChatContext = createContext<ChatState | null>(null);

function getMessageText(message: UIMessage): string {
return message.parts
.filter((part) => part.type === "text")
.map((part) => part.text)
.join("\n");
}

export function ChatProvider({ children }: { children: ReactNode }) {
const [threads, setThreads] = useState<DemoThread[]>([]);
const [isLoading, setIsLoading] = useState(true);

const userIdRef = useRef<string | null>(null);
const pendingWrites = useRef<Map<string, Promise<void>>>(new Map());

useEffect(() => {
if (!supabase) {
setIsLoading(false);
return;
}

let active = true;

const loadChats = async (userId: string | null) => {
  userIdRef.current = userId;

  if (!userId) {
    if (active) {
      setThreads([]);
      setIsLoading(false);
    }
    return;
  }

  if (active) setIsLoading(true);

  const { data: conversations, error: conversationsError } =
    await supabase
      .from("chat_conversations")
      .select("id, title, created_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

  if (conversationsError) {
    console.error("Could not load conversations:", conversationsError.message);
    if (active) setIsLoading(false);
    return;
  }

  const conversationIds = (conversations ?? []).map((item) => item.id);

  let messages: {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: string;
  }[] = [];

  if (conversationIds.length > 0) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, conversation_id, role, content, created_at")
      .in("conversation_id", conversationIds)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Could not load messages:", error.message);
      if (active) setIsLoading(false);
      return;
    }

    messages = (data ?? []) as typeof messages;
  }

  if (!active || userIdRef.current !== userId) return;

  setThreads(
    (conversations ?? []).map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      messages: messages
        .filter((message) => message.conversation_id === conversation.id)
        .map((message) => ({
          id: message.id,
          role: message.role,
          parts: [{ type: "text" as const, text: message.content }],
        })),
    })),
  );

  setIsLoading(false);
};

supabase.auth.getUser().then(({ data, error }) => {
  if (error) {
    console.error("Could not verify signed-in user:", error.message);
    if (active) setIsLoading(false);
    return;
  }

  void loadChats(data.user?.id ?? null);
});

const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
  void loadChats(session?.user?.id ?? null);
});

return () => {
  active = false;
  subscription.unsubscribe();
};

}, []);

const createThread = useCallback((text: string) => {
const id = crypto.randomUUID();
const firstMessage: UIMessage = {
id: crypto.randomUUID(),
role: "user",
parts: [{ type: "text", text }],
};

setThreads((previous) => [
  {
    id,
    title: text.slice(0, 60),
    messages: [firstMessage],
  },
  ...previous,
]);

const userId = userIdRef.current;

if (supabase && userId) {
  const write = (async () => {
    const { error: conversationError } = await supabase
      .from("chat_conversations")
      .insert({
        id,
        user_id: userId,
        title: text.slice(0, 60),
      });

    if (conversationError) {
      console.error("Could not save conversation:", conversationError.message);
      return;
    }

    const { error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: id,
        user_id: userId,
        role: "user",
        content: text,
      });

    if (messageError) {
      console.error("Could not save first message:", messageError.message);
    }
  })();

  pendingWrites.current.set(id, write);
  void write.finally(() => {
    if (pendingWrites.current.get(id) === write) {
      pendingWrites.current.delete(id);
    }
  });
}

return id;

}, []);

const append = useCallback((id: string, message: UIMessage) => {
setThreads((previous) =>
previous.map((thread) =>
thread.id === id
? { ...thread, messages: [...thread.messages, message] }
: thread,
),
);

const userId = userIdRef.current;
if (!supabase || !userId) return;

const content = getMessageText(message);
const previousWrite = pendingWrites.current.get(id);

const write = (async () => {
  if (previousWrite) await previousWrite;

  const { error } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: id,
      user_id: userId,
      role: message.role === "assistant" ? "assistant" : "user",
      content,
    });

  if (error) {
    console.error("Could not save message:", error.message);
    return;
  }

  await supabase
    .from("chat_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);
})();

pendingWrites.current.set(id, write);
void write.finally(() => {
  if (pendingWrites.current.get(id) === write) {
    pendingWrites.current.delete(id);
  }
});

}, []);

const remove = useCallback((id: string) => {
setThreads((previous) => previous.filter((thread) => thread.id !== id));

const userId = userIdRef.current;
if (!supabase || !userId) return;

void (async () => {
  await pendingWrites.current.get(id);
  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Could not delete conversation:", error.message);
  }
})();

}, []);

const clear = useCallback(() => {
setThreads([]);

const userId = userIdRef.current;
if (!supabase || !userId) return;

void (async () => {
  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Could not clear conversations:", error.message);
  }
})();

}, []);

return (
<ChatContext.Provider
value={{
threads,
isLoading,
createThread,
append,
remove,
clear,
}}
>
{children}
</ChatContext.Provider>
);
}

export function useDemoChat() {
const context = useContext(ChatContext);

if (!context) {
throw new Error("ChatProvider is required");
}

return context;
      }
