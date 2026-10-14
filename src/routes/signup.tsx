import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/ayanfe/auth-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/signup")({
head: () => pageHead("Create account", "Create your AYANFE AI account."),
component: () => <AuthPage mode="signup" />,
});
