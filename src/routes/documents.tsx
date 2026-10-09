import { createFileRoute } from "@tanstack/react-router";
import { Files } from "lucide-react";
import { ToolPage } from "@/components/ayanfe/tool-page";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/documents")({
  head: () =>
    pageHead(
      "Documents",
      "AYANFE AI’s future document workspace. File uploads and document analysis are not enabled.",
    ),
  component: () => (
    <ToolPage
      title="Documents"
      description="Less searching. More understanding. See the bigger picture in your documents."
      icon={Files}
      ideas={[
        "Document summaries & key insights",
        "Ask questions about your files",
        "Compare & explore information",
      ]}
    />
  ),
});
