import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight, PenLine, GraduationCap, Code2, Compass, ShieldCheck, Copy, Check, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useDemoChat } from "./chat-context";
import mark from "@/assets/ayanfe-mark.png";

const starters = [
  { title: "Find the right words", detail: "From a first draft to a fresh idea", icon: PenLine, tone: "writing", prompt: "Help me draft a professional introduction for my business." },
  { title: "Make learning click", detail: "Explore something new, your way", icon: GraduationCap, tone: "learning", prompt: "Explain a difficult concept in simple terms, with an example." },
  { title: "Build something great", detail: "A second perspective on your code", icon: Code2, tone: "coding", prompt: "Help me plan my first web application." },
  { title: "Follow your curiosity", detail: "Big questions. Everyday discoveries.", icon: Compass, tone: "exploring", prompt: "What are some creative ideas for a new project?" },
];
const demoReply = "**This is a demonstration response, not an AI-generated answer.**\n\nYour message has been added to this conversation. No AI service is connected, so AYANFE AI cannot answer questions, write content, or analyze files yet.\n\nYou can continue testing the conversation, start a new chat, or revisit this chat in your session history. Conversations disappear when this page is refreshed.";

export function ChatWorkspace({ threadId }: { threadId?: string }) {
  const { threads, createThread, append } = useDemoChat();
  const thread = threads.find(item => item.id === threadId);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string>();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const appendRef = useRef(append);
  appendRef.current = append;
  useEffect(() => {
    textarea.current?.focus({ preventScroll: true });
    if (thread?.messages.at(-1)?.role === "user") {
      setPending(true);
      timer.current = setTimeout(() => {
        appendRef.current(thread.id, { id: crypto.randomUUID(), role: "assistant", parts: [{ type: "text", text: demoReply }] });
        setPending(false);
        textarea.current?.focus({ preventScroll: true });
      }, 1100);
    }
    return () => { clearTimeout(timer.current); };
  }, [thread?.id, thread?.messages.length]);
  const send = (value: string) => {
    const message = value.trim();
    if (!message || pending) return;
    if (message.length > 4000) { setError("Please keep your message under 4,000 characters."); return; }
    setError(""); setText("");
    if (!thread) { const id = createThread(message); navigate({ to: "/chat/$threadId", params: { threadId: id } }); }
    else { append(thread.id, { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: message }] }); setPending(true); }
  };
  const copy = async (id: string, content: string) => {
    try { await navigator.clipboard.writeText(content); setCopied(id); } catch { setError("Your browser couldn’t copy this message. Please select and copy the text."); }
  };
  if (threadId && !thread) return <div className="unavailable-chat"><img src={mark} alt="" width={64} height={64} /><h1>This conversation isn’t here</h1><p>Demo history lasts only for this session. A refresh clears it.</p><Button asChild><Link to="/">Start a new conversation</Link></Button></div>;
  return <main className={`chat-workspace ${thread ? "has-conversation" : ""}`}>
    {!thread ? <div className="welcome"><div className="welcome-brand"><img src={mark} alt="AYANFE AI emerald and gold symbol" width={84} height={84} /><span className="welcome-eyebrow">A NEW SPACE FOR YOUR IDEAS</span></div><h1>Hello, meet <span>AYANFE AI.</span></h1><p className="welcome-description">A little inspiration. A clearer answer. Your next big idea.<br className="desktop-break" /> Let’s see where your curiosity takes you.</p><div className="starters">{starters.map(({ title, detail, icon: Icon, tone, prompt }) => <Button key={title} variant="outline" className={`starter ${tone}`} onClick={() => { setText(prompt); textarea.current?.focus({ preventScroll: true }); }}><span className="starter-top"><span className="starter-icon"><Icon size={20} /></span><ArrowUpRight size={16} /></span><span className="starter-title">{title}</span><span className="starter-detail">{detail}</span></Button>)}</div><div className="welcome-caption"><span className="gold-line" />BUILT FOR YOUR EVERYDAY. READY FOR YOUR WHAT’S NEXT.<span className="gold-line" /></div></div> : <Conversation className="transcript"><ConversationContent className="transcript-content"><div className="conversation-heading"><span className="welcome-eyebrow">YOUR CONVERSATION</span><h1>{thread.title}</h1></div>{thread.messages.map(message => <Message key={message.id} from={message.role}><div className={`message-label ${message.role === "user" ? "user-label" : ""}`}>{message.role === "assistant" && <img src={mark} alt="" width={25} height={25} />}{message.role === "assistant" ? "AYANFE AI · Demo" : "You"}</div><MessageContent className={message.role === "user" ? "user-message" : "assistant-message"}>{message.parts.map((part, index) => part.type === "text" ? <MessageResponse key={index}>{part.text}</MessageResponse> : null)}</MessageContent>{message.role === "assistant" && <Button variant="ghost" size="icon-sm" title="Copy message" aria-label="Copy message" onClick={() => copy(message.id, message.parts.filter(part => part.type === "text").map(part => part.text).join("\n"))}>{copied === message.id ? <Check /> : <Copy />}</Button>}</Message>)}{pending && <div role="status" className="pending-response"><img src={mark} alt="" width={25} height={25} /><Shimmer>Preparing demonstration response…</Shimmer></div>}</ConversationContent><ConversationScrollButton /></Conversation>}
    <div className="composer-area">{!thread && <div className="composer-heading"><span>What’s on your mind?</span><span>Start with a question or an idea</span></div>}<PromptInput className="ayanfe-composer" onSubmit={({ text: submitted }) => send(submitted)}><PromptInputTextarea ref={textarea} value={text} onChange={event => setText(event.target.value)} placeholder="Ask AYANFE anything…" aria-label="Message AYANFE AI" maxLength={4001} disabled={pending} /><PromptInputFooter><span className="composer-mode"><img src={mark} alt="" width={18} height={18} />AYANFE AI<span className="mode-divider" />Demo</span><PromptInputSubmit aria-label={pending ? "Stop demonstration response" : "Send message"} status={pending ? "streaming" : "ready"} disabled={!pending && !text.trim()} onStop={() => { clearTimeout(timer.current); setPending(false); if (thread) append(thread.id, { id: crypto.randomUUID(), role: "assistant", parts: [{ type: "text", text: "Demonstration response stopped. No AI service was contacted." }] }); }} className="send-control">{pending ? <Square size={17} /> : <ArrowUp size={19} />}</PromptInputSubmit></PromptInputFooter></PromptInput>{error && <p className="chat-error" role="alert">{error}</p>}<p className="demo-disclaimer"><ShieldCheck size={13} /><span>Demo experience. Responses are simulated, not generated by AI.</span></p></div>
    <footer className="workspace-footer"><span>Made with purpose. Built for possibility.</span><span>Ayanfe Innovation Labs Limited <span className="footer-dot">·</span> © 2026</span></footer>
  </main>;
}