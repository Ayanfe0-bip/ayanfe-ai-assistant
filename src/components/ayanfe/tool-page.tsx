import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ToolPage({
  title,
  description,
  icon: Icon,
  ideas,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  ideas: string[];
}) {
  return (
    <main className="tool-page">
      <span className="welcome-eyebrow">YOUR NEXT POSSIBILITY</span>
      <div className="tool-title-row">
        <div className="tool-identity">
          <Icon size={28} />
        </div>
        <span className="coming-badge">Coming soon</span>
      </div>
      <h1>{title}</h1>
      <p className="tool-description">{description}</p>
      <div className="tool-ideas">
        {ideas.map((idea, index) => (
          <div key={idea}>
            <span>0{index + 1}</span>
            <h2>{idea}</h2>
            <ArrowUpRight size={20} />
          </div>
        ))}
      </div>
      <div className="feature-notice">
        <LockKeyhole size={20} />
        <p>
          This tool is not available in the frontend demo. No files are uploaded and no AI requests
          are made.
        </p>
      </div>
      <Button asChild>
        <Link to="/">
          Explore the chat demo
          <ArrowUpRight />
        </Link>
      </Button>
    </main>
  );
}
