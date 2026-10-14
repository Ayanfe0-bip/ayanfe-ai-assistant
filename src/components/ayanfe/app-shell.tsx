import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import {
Plus,
MessageSquare,
History,
PenLine,
GraduationCap,
Code2,
Files,
Image,
Settings,
Menu,
X,
ArrowUpRight,
ChevronDown,
ShieldCheck,
LogIn,
UserPlus,
LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDemoChat } from "./chat-context";
import { supabase } from "@/lib/supabase";
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
const [user, setUser] = useState<User | null>(null);
const [signingOut, setSigningOut] = useState(false);
const [authMessage, setAuthMessage] = useState("");

const pathname = useRouterState({
select: (state) => state.location.pathname,
});

const { threads } = useDemoChat();

const close = () => setOpen(false);

useEffect(() => {
if (!supabase) {
setUser(null);
return;
}

let active = true;

supabase.auth.getUser().then(({ data, error }) => {
  if (active && !error) {
    setUser(data.user);
  }
});

const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
  setUser(session?.user ?? null);
});

return () => {
  active = false;
  subscription.unsubscribe();
};

}, []);

async function handleLogout() {
if (!supabase) {
setAuthMessage("Authentication is not configured.");
return;
}

setSigningOut(true);
setAuthMessage("");

try {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  setUser(null);
  close();
  window.location.assign("/login");
} catch {
  setAuthMessage("We couldn't sign you out. Please try again.");
} finally {
  setSigningOut(false);
}

}

const displayName =
user?.user_metadata?.full_name?.trim() ||
user?.email ||
"Guest workspace";

const avatarLetter = displayName.charAt(0).toUpperCase() || "G";

return (
<div className="app-layout">
{open && (
<div
className="nav-scrim"
onClick={close}
aria-hidden="true"
/>
)}

  <aside
    className={`sidebar ${open ? "sidebar-open" : ""}`}
    aria-label="Main navigation"
    onKeyDown={(event) => {
      if (event.key === "Escape") close();
    }}
  >
    <div className="brand-row">
      <Link to="/" className="brand" onClick={close}>
        <img src={mark} alt="" width={38} height={38} />
        <span>
          AYANFE <b>AI</b>
          <small>YOUR EVERYDAY INTELLIGENCE</small>
        </span>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="mobile-close"
        onClick={close}
        aria-label="Close navigation"
      >
        <X />
      </Button>
    </div>

    <Button asChild className="new-chat">
      <Link to="/" onClick={close}>
        <Plus />
        New conversation
        <span className="new-chat-arrow">
          <ArrowUpRight />
        </span>
      </Link>
    </Button>

    <p className="nav-label">WORKSPACE</p>

    <nav className="main-nav">
      {navigation.map(({ to, label, icon: Icon }, index) => (
        <Button
          key={to}
          variant="ghost"
          asChild
          className={`nav-item ${
            pathname === to ||
            (to === "/" && pathname.startsWith("/chat/"))
              ? "nav-selected"
              : ""
          } ${index === 2 ? "nav-tools-start" : ""}`}
        >
          <Link to={to} onClick={close}>
            <Icon />
            <span>{label}</span>
            {index > 1 && <span className="soon-dot" />}
          </Link>
        </Button>
      ))}
    </nav>

    <div className="recent-heading">
      <p className="nav-label">RECENT CONVERSATIONS</p>
      <History size={13} />
    </div>

    <div className="recent-list">
      {threads.length ? (
        threads.slice(0, 4).map((thread) => (
          <Link
            key={thread.id}
            to="/chat/$threadId"
            params={{ threadId: thread.id }}
            onClick={close}
            className="recent-item"
          >
            <MessageSquare size={14} />
            <span>{thread.title}</span>
          </Link>
        ))
      ) : (
        <p className="recent-empty">
          A fresh start. Your conversations
          <br />
          will appear here.
        </p>
      )}
    </div>

    <div className="sidebar-bottom">
      <div className="preview-note">
        <span className="preview-note-icon">
          <ShieldCheck size={18} />
        </span>

        <div>
          <b>A glimpse of what’s next</b>
          <p>
            You’re exploring our demo.
            <br />
            Real AI is on the horizon.
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        asChild
        className={`nav-item ${
          pathname === "/settings" ? "nav-selected" : ""
        }`}
      >
        <Link to="/settings" onClick={close}>
          <Settings />
          Settings
        </Link>
      </Button>

      {user ? (
        <div className="profile">
          <div className="profile-avatar">{avatarLetter}</div>

          <div className="min-w-0 flex-1">
            <b className="block truncate">{displayName}</b>
            <span>Signed in to AYANFE AI</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={signingOut}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={18} />
          </Button>
        </div>
      ) : (
        <div className="space-y-2 pt-3">
          <Button
            variant="outline"
            asChild
            className="w-full justify-start"
          >
            <Link to="/login" onClick={close}>
              <LogIn className="mr-2" size={18} />
              Sign in
            </Link>
          </Button>

          <Button
            asChild
            className="w-full justify-start"
          >
            <Link to="/signup" onClick={close}>
              <UserPlus className="mr-2" size={18} />
              Create account
            </Link>
          </Button>
        </div>
      )}

      {authMessage && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {authMessage}
        </p>
      )}
    </div>
  </aside>

  <div className="main-panel">
    <header className="app-header">
      <div className="header-title">
        <Button
          variant="ghost"
          size="icon"
          className="mobile-menu"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <Menu />
        </Button>

        <span>Personal workspace</span>
        <ChevronDown size={14} />
      </div>

      <div className="header-right">
        <span className="demo-badge">
          <span />
          Demonstration mode
        </span>

        <span className="header-avatar">
          {user ? avatarLetter : "G"}
        </span>
      </div>
    </header>

    {children}
  </div>
</div>

);
    }
