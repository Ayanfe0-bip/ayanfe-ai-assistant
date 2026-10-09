import { createFileRoute } from "@tanstack/react-router";
import { Code2 } from "lucide-react";
import { ToolPage } from "@/components/ayanfe/tool-page";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/coding")({ head: () => pageHead("Coding Assistant", "Preview AYANFE AI’s planned coding support and development workspace."), component: () => <ToolPage title="Coding Assistant" description="From your first line to your next breakthrough. Build with confidence." icon={Code2} ideas={["Understand & explain code", "Explore bugs & improvements", "Plan projects & new applications"]} /> });