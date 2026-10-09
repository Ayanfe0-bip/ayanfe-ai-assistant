import { createFileRoute } from "@tanstack/react-router";
import { Image } from "lucide-react";
import { ToolPage } from "@/components/ayanfe/tool-page";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/images")({ head: () => pageHead("Image Tools", "Preview the planned AYANFE AI image workspace. Image creation and analysis are not connected."), component: () => <ToolPage title="Image Tools" description="Turn a different perspective into a new possibility." icon={Image} ideas={["Create original images", "Explore & understand visuals", "Bring creative concepts to life"]} /> });