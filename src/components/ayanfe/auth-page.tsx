import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AuthMode = "signup" | "login" | "reset";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const signup = mode === "signup";
  const reset = mode === "reset";

  const title = signup
    ? "Create your account"
    : reset
      ? "Reset your password"
      : "Welcome back";

  const description = signup
    ? "Start your AYANFE AI journey."
    : reset
      ? "Request a secure password-reset link."
      : "Sign in to your AYANFE AI account.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase is not configured for this deployment.");
      return;
    }

    if (signup && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!reset && password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (signup && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      if (signup) {
        const { data, error: authError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { full_name: name.trim() },
              emailRedirectTo:
                window.location.origin + "/login",
            },
          });

        if (authError) throw authError;

        if (data.session) {
          window.location.assign("/");
          return;
        }

        setMessage(
          "Your account request was received. Check your email for the confirmation link before signing in."
        );
      } else if (reset) {
        const { error: authError } =
          await supabase.auth.resetPasswordForEmail(
            email.trim(),
            {
              redirectTo: window.location.origin + "/login",
            }
          );

        if (authError) throw authError;

        setMessage(
          "If an account exists for that email, a password-reset link will be sent."
        );
      } else {
        const { error: authError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (authError) throw authError;

        window.location.assign("/");
        return;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to AYANFE AI
        </Link>

        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles size={24} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          AYANFE AI
        </p>

        <h1 className="mt-2 text-2xl font-bold text-foreground">
          {title}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {signup && (
            <label className="block text-sm font-medium">
              Full name
              <input
                className={fieldClass}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </label>
          )}

          <label className="block text-sm font-medium">
            Email address
            <input
              className={fieldClass}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {!reset && (
            <label className="block text-sm font-medium">
              Password
              <span className="relative block">
                <input
                  className={fieldClass + " pr-12"}
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    signup ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </span>
            </label>
          )}

          {signup && (
            <label className="block text-sm font-medium">
              Confirm password
              <input
                className={fieldClass}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password again"
                minLength={8}
                required
              />
            </label>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-xl border border-primary/25 bg-primary/5 p-3 text-sm"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !supabase}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {busy
              ? "Please wait..."
              : signup
                ? "Create account"
                : reset
                  ? "Send reset link"
                  : "Sign in"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          {signup ? (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </>
          ) : reset ? (
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Back to sign in
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Link
                to="/forgot-password"
                className="font-semibold text-primary hover:underline"
              >
                Forgot password?
              </Link>

              <span>
                New to AYANFE AI?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
                </Link>
              </span>
            </div>
          )}
        </div>

        <p className="mt-7 text-center text-xs text-muted-foreground">
          Ayanfe Innovation Labs Limited
        </p>
      </section>
    </main>
  );
  }
