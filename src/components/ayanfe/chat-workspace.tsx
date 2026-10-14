import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUp,
  ArrowUpRight,
  PenLine,
  GraduationCap,
  Code2,
  Compass,
  ShieldCheck,
  Copy,
  Check,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";

import { Shimmer } from "@/components/ai-elements/shimmer";
import { useDemoChat } from "./chat-context";
import mark from "@/assets/ayanfe-mark.png";

const starters = [
  {
    title: "Find the right words",
    detail: "From a first draft to a fresh idea",
    icon: PenLine,
    tone: "writing",
    prompt: "Help me draft a professional introduction for my business.",
  },
  {
    title: "Make learning click",
    detail: "Explore something new, your way",
    icon: GraduationCap,
    tone: "learning",
    prompt: "Explain a difficult concept in simple terms, with an example.",
  },
  {
    title: "Build something great",
    detail: "A second perspective on your code",
    icon: Code2,
    tone: "coding",
    prompt: "Help me plan my first web application.",
  },
  {
    title: "Follow your curiosity",
    detail: "Big questions. Everyday discoveries.",
    icon: Compass,
    tone: "exploring",
    prompt: "What are some creative ideas for a new project?",
  },
];

type ChatRequestMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  answer?: string;
  error?: string;
};

function getMessageText(message: {
  parts: Array<{ type: string; text?: string }>;
}): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
}

async function requestAIResponse(
  messages: ChatRequestMessage[],
  signal: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  let result: ChatApiResponse;

  try {
    result = (await response.json()) as ChatApiResponse;
  } catch {
    throw new Error(
      "The server returned an unexpected response. Please try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      result.error || "AYANFE AI could not answer right now.",
    );
  }

  if (typeof result.answer !== "string" || !result.answer.trim()) {
    throw new Error("AYANFE AI returned an empty response.");
  }

  return result.answer;
}

export function ChatWorkspace({
  threadId,
}: {
  threadId?: string;
}) {
  const { threads, isLoading, createThread, append } = useDemoChat();

  const thread = threads.find((item) => item.id === threadId);

  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string>();

  const textarea = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const requestController = useRef<AbortController | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    textarea.current?.focus({ preventScroll: true });
  }, [threadId]);

  useEffect(() => {
    return () => {
      requestId.current += 1;
      requestController.current?.abort();
    };
  }, [threadId]);

  const send = async (value: string) => {
    const messageText = value.trim();

    if (!messageText || pending) {
      return;
    }

    if (messageText.length > 4000) {
      setError("Please keep your message under 4,000 characters.");
      return;
    }

    setError("");
    setText("");

    let activeThreadId = thread?.id;

    // Create a conversation and immediately navigate to it.
    // The user can then submit their message from that conversation.
    if (!activeThreadId) {
      activeThreadId = createThread(messageText);

      navigate({
        to: "/chat/$threadId",
        params: {
          threadId: activeThreadId,
        },
      });

      return;
    }

    // Include the new message in the request explicitly.
    // The thread state may not have updated yet.
    const previousMessages: ChatRequestMessage[] = thread.messages
      .map((item) => ({
        role: item.role,
        content: getMessageText(item),
      }))
      .filter(
        (item): item is ChatRequestMessage =>
          (item.role === "user" || item.role === "assistant") &&
          item.content.length > 0,
      );

    const conversation: ChatRequestMessage[] = [
      ...previousMessages,
      {
        role: "user",
        content: messageText,
      },
    ];

    append(activeThreadId, {
      id: crypto.randomUUID(),
      role: "user",
      parts: [
        {
          type: "text",
          text: messageText,
        },
      ],
    });

    const currentRequestId = ++requestId.current;
    const controller = new AbortController();

    requestController.current = controller;
    setPending(true);

    try {
      const answer = await requestAIResponse(
        conversation,
        controller.signal,
      );

      if (currentRequestId !== requestId.current) {
        return;
      }

      append(activeThreadId, {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: answer,
          },
        ],
      });

      textarea.current?.focus({ preventScroll: true });
    } catch (caught) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      if (caught instanceof Error && caught.name === "AbortError") {
        return;
      }

      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      if (currentRequestId === requestId.current) {
        setPending(false);
        requestController.current = null;
      }
    }
  };

  const copy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
    } catch {
      setError(
        "Your browser couldn't copy this message. Please select and copy the text.",
      );
    }
  };

  // Wait for the conversation provider to finish loading.
  if (threadId && isLoading) {
    return (
      <main className="unavailable-chat" aria-live="polite">
        <img src={mark} alt="" width={64} height={64} />
        <h1>Loading your conversation</h1>
        <p>
          Please wait while AYANFE AI retrieves your saved messages.
        </p>
      </main>
    );
  }

  // Display a recovery screen if the requested conversation is missing.
  if (threadId && !thread) {
    return (
      <div className="unavailable-chat">
        <img src={mark} alt="" width={64} height={64} />

        <h1>This conversation isn't available</h1>

        <p>
          It may have been deleted, or you may need to sign in to the
          account that owns it.
        </p>

        <Button asChild>
          <Link to="/">Start a new conversation</Link>
        </Button>
      </div>
    );
  }

  return (
    <main
      className={`chat-workspace ${
        thread ? "has-conversation" : ""
      }`}
    >
      {!thread ? (
        <div className="welcome">
          <div className="welcome-brand">
            <img
              src={mark}
              alt="AYANFE AI emerald and gold symbol"
              width={84}
              height={84}
            />

            <span className="welcome-eyebrow">
              A NEW SPACE FOR YOUR IDEAS
            </span>
          </div>

          <h1>
            Hello, meet <span>AYANFE AI.</span>
          </h1>

          <p className="welcome-description">
            A little inspiration. A clearer answer. Your next big idea.
            <br className="desktop-break" />
            Let's see where your curiosity takes you.
          </p>

          <div className="starters">
            {starters.map(
              ({ title, detail, icon: Icon, tone, prompt }) => (
                <Button
                  key={title}
                  variant="outline"
                  className={`starter ${tone}`}
                  onClick={() => {
                    setText(prompt);
                    textarea.current?.focus({
                      preventScroll: true,
                    });
                  }}
                >
                  <span className="starter-top">
                    <span className="starter-icon">
                      <Icon size={20} />
                    </span>

                    <ArrowUpRight size={16} />
                  </span>

                  <span className="starter-title">{title}</span>

                  <span className="starter-detail">{detail}</span>
                </Button>
              ),
            )}
          </div>

          <div className="welcome-caption">
            <span className="gold-line" />
            BUILT FOR YOUR EVERYDAY. READY FOR YOUR WHAT'S NEXT.
            <span className="gold-line" />
          </div>
        </div>
      ) : (
        <Conversation className="transcript">
          <ConversationContent className="transcript-content">
            <div className="conversation-heading">
              <span className="welcome-eyebrow">
                YOUR CONVERSATION
              </span>

              <h1>{thread.title}</h1>
            </div>

            {thread.messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <div
                  className={`message-label ${
                    message.role === "user" ? "user-label" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <img
                      src={mark}
                      alt=""
                      width={25}
                      height={25}
                    />
                  )}

                  {message.role === "assistant"
                    ? "AYANFE AI"
                    : "You"}
                </div>

                <MessageContent
                  className={
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }
                >
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <MessageResponse key={index}>
                        {part.text}
                      </MessageResponse>
                    ) : null,
                  )}
                </MessageContent>

                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Copy message"
                    aria-label="Copy message"
                    onClick={() =>
                      copy(message.id, getMessageText(message))
                    }
                  >
                    {copied === message.id ? <Check /> : <Copy />}
                  </Button>
                )}
              </Message>
            ))}

            {pending && (
              <div role="status" className="pending-response">
                <img
                  src={mark}
                  alt=""
                  width={25}
                  height={25}
                />

                <Shimmer>AYANFE AI is thinking...</Shimmer>
              </div>
            )}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>
      )}

      <div className="composer-area">
        {!thread && (
          <div className="composer-heading">
            <span>What's on your mind?</span>
            <span>Start with a question or an idea</span>
          </div>
        )}

        <PromptInput
          className="ayanfe-composer"
          onSubmit={({ text: submitted }) => {
            void send(submitted);
          }}
        >
          <PromptInputTextarea
            ref={textarea}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ask AYANFE anything..."
            aria-label="Message AYANFE AI"
            maxLength={4000}
            disabled={pending || Boolean(threadId && isLoading)}
          />

          <PromptInputFooter>
            <span className="composer-mode">
              <img
                src={mark}
                alt=""
                width={18}
                height={18}
              />

              AYANFE AI

              <span className="mode-divider" />

              AI chat
            </span>

            <PromptInputSubmit
              aria-label={pending ? "Stop response" : "Send message"}
              status={pending ? "streaming" : "ready"}
              disabled={!pending && !text.trim()}
              onStop={() => {
                requestId.current += 1;
                requestController.current?.abort();
                requestController.current = null;
                setPending(false);
              }}
              className="send-control"
            >
              {pending ? (
                <Square size={17} />
              ) : (
                <ArrowUp size={19} />
              )}
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>

        {error && (
          <p className="chat-error" role="alert">
            {error}
          </p>
        )}

        <p className="demo-disclaimer">
          <ShieldCheck size={13} />

          <span>
            AI responses require a configured server API key. Messages
            may remain only in this session until persistent storage is
            connected.
          </span>
        </p>
      </div>

      <footer className="workspace-footer">
        <span>Made with purpose. Built for possibility.</span>

        <span>
          Ayanfe Innovation Labs Limited{" "}
          <span className="footer-dot">·</span> © 2026
        </span>
      </footer>
    </main>
  );
      }
