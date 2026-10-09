import { createFileRoute } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { ToolPage } from "@/components/ayanfe/tool-page";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/writing")({ head: () => pageHead("AI Writing", "Discover the planned AYANFE AI writing workspace. Content generation is not connected yet."), component: () => <ToolPage title="AI Writing" description="Find your voice. Give your ideas the words they deserve." icon={PenLine} ideas={["Thoughtful emails & everyday writing", "First drafts & creative storytelling", "Clearer copy & better translations"]} /> });