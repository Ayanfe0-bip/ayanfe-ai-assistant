import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/ayanfe/auth-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/login")({
head: () => pageHead("Sign in", "Sign in to your AYANFE AI account."),
component: () => <AuthPage mode="login" />,
});
