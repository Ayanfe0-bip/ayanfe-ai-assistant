import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LockKeyhole, CheckCircle2, AlertCircle, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/reset-password")({
head: () =>
pageHead(
"Create a new password",
"Securely create a new password for your AYANFE AI account.",
),
component: ResetPasswordPage,
});

function ResetPasswordPage() {
const navigate = useNavigate();
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [checking, setChecking] = useState(true);
const [ready, setReady] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [message, setMessage] = useState("");

useEffect(() => {
if (!supabase) {
setError("Account services are unavailable. Please try again later.");
setChecking(false);
return;
}

let active = true;

const { data: listener } = supabase.auth.onAuthStateChange(
  (event, session) => {
    if (!active) return;

    if (event === "PASSWORD_RECOVERY" && session) {
      setReady(true);
      setError("");
      setChecking(false);
    } else if (session) {
      setReady(true);
      setChecking(false);
    }
  },
);

supabase.auth.getSession().then(({ data, error: sessionError }) => {
  if (!active) return;

  if (sessionError) {
    setError("Your reset link may be invalid or expired. Request a new one.");
    setChecking(false);
    return;
  }

  if (data.session) {
    setReady(true);
  } else {
    setError("Your reset link is invalid or expired. Please request a new one.");
  }

  setChecking(false);
});

return () => {
  active = false;
  listener.subscription.unsubscribe();
};

}, []);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();
setError("");
setMessage("");

if (!supabase) {
  setError("Account services are unavailable.");
  return;
}

if (password.length < 8) {
  setError("Your new password must contain at least 8 characters.");
  return;
}

if (password !== confirmPassword) {
  setError("The passwords do not match.");
  return;
}

setSaving(true);

try {
  const { error: updateError } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) throw updateError;

  setMessage("Your password has been changed. You can now sign in with it.");
  setPassword("");
  setConfirmPassword("");

  window.setTimeout(() => {
    void navigate({ to: "/login" });
  }, 1800);
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "We couldn't update your password. Request a new reset link and try again.",
  );
} finally {
  setSaving(false);
}

}

return (
<main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl items-center justify-center px-4 py-10">
<section className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
<LockKeyhole size={24} />
</div>

    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
      AYANFE AI
    </p>

    <h1 className="mt-2 text-2xl font-bold text-foreground">
      Create a new password
    </h1>

    <p className="mt-2 text-sm text-muted-foreground">
      Choose a strong password with at least 8 characters.
    </p>

    {checking ? (
      <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
        <LoaderCircle className="animate-spin" size={20} />
        Verifying your password-reset link...
      </div>
    ) : ready ? (
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          New password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="At least 8 characters"
          />
        </label>

        <label className="block text-sm font-medium">
          Confirm new password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Enter the password again"
          />
        </label>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="flex items-start gap-2 rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-sm">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Updating password..." : "Save new password"}
        </button>
      </form>
    ) : (
      <div className="mt-6 space-y-4">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <Link
          to="/forgot-password"
          className="inline-flex font-semibold text-primary hover:underline"
        >
          Request another reset link
        </Link>
      </div>
    )}

    <p className="mt-7 text-center text-sm text-muted-foreground">
      <Link to="/login" className="font-semibold text-primary hover:underline">
        Back to sign in
      </Link>
    </p>

    <p className="mt-5 text-center text-xs text-muted-foreground">
      Ayanfe Innovation Labs Limited
    </p>
  </section>
</main>

);
  }
