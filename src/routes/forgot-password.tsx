import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/ayanfe/auth-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/forgot-password")({
head: () =>
pageHead(
"Reset password",
"Request a secure AYANFE AI password-reset link."
),
component: () => <AuthPage mode="reset" />,
});
