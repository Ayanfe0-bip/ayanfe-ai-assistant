import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Plus, MessageSquare, History, PenLine, GraduationCap, Code2, Files, Image, Settings, Menu, X, ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoChat } from "./chat-context";
import mark from "@/assets/ayanfe-mark.png";

const navigation = [
  { to: "/", label: "New Chat", icon: MessageSquare },
  { to: "/history", label: "Chat History", icon: History },
  { to: "/writing", label: "AI Writing", icon: PenLine },
  { to: "/tutor", label: "AI Learning Tutor", icon: GraduationCap },
  { to: "/coding", label: "Coding Assistant", icon: Code2 },
  { to: "/documents", label: "Documents", icon: Files },
  { to: "/images", label: "Image Tools", icon: Image },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: state => state.location.pathname });
  const { threads } = useDemoChat();
  const close = () => setOpen(false);
  return <div className="app-layout">
    {open && <div className="nav-scrim" onClick={close} aria-hidden="true" />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Main navigation">
      <div className="brand-row"><Link to="/" className="brand" onClick={close}><img src={mark} alt="" width={38} height={38} /><span>AYANFE <b>AI</b><small>YOUR EVERYDAY INTELLIGENCE</small></span></Link><Button variant="ghost" size="icon" className="mobile-close" onClick={close} aria-label="Close navigation"><X /></Button></div>
      <Button asChild className="new-chat"><Link to="/" onClick={close}><Plus />New conversation<span className="new-chat-arrow"><ArrowUpRight /></span></Link></Button>
      <p className="nav-label">WORKSPACE</p>
      <nav className="main-nav">{navigation.map(({ to, label, icon: Icon }, index) => <Button key={to} variant="ghost" asChild className={`nav-item ${pathname === to || (to === "/" && pathname.startsWith("/chat/")) ? "nav-selected" : ""} ${index === 2 ? "nav-tools-start" : ""}`}><Link to={to} onClick={close}><Icon /><span>{label}</span>{index > 1 && <span className="soon-dot" />}</Link></Button>)}</nav>
      <div className="recent-heading"><p className="nav-label">RECENT CONVERSATIONS</p><History size={13} /></div>
      <div className="recent-list">{threads.length ? threads.slice(0, 4).map(thread => <Link key={thread.id} to="/chat/$threadId" params={{ threadId: thread.id }} onClick={close} className="recent-item"><MessageSquare size={14} /><span>{thread.title}</span></Link>) : <p className="recent-empty">A fresh start. Your conversations<br />will appear here.</p>}</div>
      <div className="sidebar-bottom"><div className="preview-note"><span className="preview-note-icon"><ShieldCheck size={18} /></span><div><b>A glimpse of what’s next</b><p>You’re exploring our demo.<br />Real AI is on the horizon.</p></div></div><Button variant="ghost" asChild className={`nav-item ${pathname === "/settings" ? "nav-selected" : ""}`}><Link to="/settings" onClick={close}><Settings />Settings</Link></Button><div className="profile"><div className="profile-avatar">G</div><div><b>Guest workspace</b><span>Make yourself at home</span></div><span className="profile-status" /></div></div>
    </aside>
    <div className="main-panel"><header className="app-header"><div className="header-title"><Button variant="ghost" size="icon" className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open}><Menu /></Button><span>Personal workspace</span><ChevronDown size={14} /></div><div className="header-right"><span className="demo-badge"><span />Demonstration mode</span><span className="header-avatar">G</span></div></header>{children}</div>
  </div>;
}