import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserRound, SlidersHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDemoChat } from "@/components/ayanfe/chat-context";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/settings")({
  head: () =>
    pageHead(
      "Settings",
      "AYANFE AI workspace settings, session data controls, and upcoming account preferences.",
    ),
  component: SettingsPage,
});
function SettingsPage() {
  const { threads, clear } = useDemoChat();
  const [confirm, setConfirm] = useState(false);
  return (
    <main className="tool-page settings-page">
      <span className="welcome-eyebrow">MAKE IT YOUR SPACE</span>
      <h1>Settings</h1>
      <p className="tool-description">A thoughtful workspace, with you in control.</p>
      <section className="settings-section">
        <div className="settings-section-title">
          <UserRound size={20} />
          <h2>Account</h2>
        </div>
        <div className="setting-row">
          <div>
            <h3>Guest workspace</h3>
            <p>No account or sign-in is connected.</p>
          </div>
          <span className="coming-badge">Coming soon</span>
        </div>
      </section>
      <section className="settings-section">
        <div className="settings-section-title">
          <SlidersHorizontal size={20} />
          <h2>Preferences</h2>
        </div>
        <div className="setting-row">
          <div>
            <h3>Language, voice & appearance</h3>
            <p>Personal preferences will be available in a future release.</p>
          </div>
          <span className="coming-badge">Coming soon</span>
        </div>
      </section>
      <section className="settings-section">
        <div className="settings-section-title">
          <ShieldCheck size={20} />
          <h2>Privacy & session data</h2>
        </div>
        <div className="setting-row">
          <div>
            <h3>Demonstration mode</h3>
            <p>
              No AI service, file storage, or account service is connected.
              <br />
              Your {threads.length} demo conversations stay in memory until you refresh.
            </p>
          </div>
        </div>
        <div className="setting-row">
          <div>
            <h3>Clear demo conversations</h3>
            <p>This removes every conversation in your current session.</p>
          </div>
          <Button variant="outline" disabled={!threads.length} onClick={() => setConfirm(true)}>
            <Trash2 />
            Clear history
          </Button>
        </div>
        {confirm && (
          <div className="delete-confirm" role="alert">
            <p>Delete all {threads.length} demo conversations? This cannot be undone.</p>
            <div>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  clear();
                  setConfirm(false);
                }}
              >
                Delete all
              </Button>
            </div>
          </div>
        )}
      </section>
      <p className="company-signoff">AYANFE AI · Ayanfe Innovation Labs Limited</p>
    </main>
  );
}
