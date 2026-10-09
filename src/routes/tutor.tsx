import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { ToolPage } from "@/components/ayanfe/tool-page";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/tutor")({
  head: () =>
    pageHead(
      "AI Learning Tutor",
      "A preview of AYANFE AI’s future learning tutor, explanations, and practice.",
    ),
  component: () => (
    <ToolPage
      title="AI Learning Tutor"
      description="A new way to understand. Learning that meets you where you are."
      icon={GraduationCap}
      ideas={["Step-by-step explanations", "Personal study plans", "Practice questions & revision"]}
    />
  ),
});
