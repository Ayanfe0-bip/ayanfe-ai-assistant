import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import {
  UserRound,
  Mail,
  ShieldCheck,
  LockKeyhole,
  CalendarDays,
  LoaderCircle,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/profile")({
  head: () =>
    pageHead(
      "My Profile",
      "Manage your AYANFE AI profile, account information, and password.",
    ),
  component: ProfilePage,
});

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!supabase) {
        if (active) {
          setErrorMessage(
            "Account services are not configured. Please try again later.",
          );
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setUser(null);
      } else {
        setUser(data.user);
        setFullName(data.user.user_metadata?.full_name ?? "");
      }

      setLoading(false);
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!supabase) {
      setErrorMessage("Account services are not configured.");
      return;
    }

    const cleanedName = fullName.trim();

    if (!cleanedName) {
      setErrorMessage("Please enter your display name.");
      return;
    }

    setSavingName(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: cleanedName },
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setFullName(data.user.user_metadata?.full_name ?? cleanedName);
      }

      setMessage("Your profile has been updated successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't update your profile. Please try again.",
      );
    } finally {
      setSavingName(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!supabase) {
      setErrorMessage("Account services are not configured.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your password has been changed successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't change your password. Please try again.",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  const displayName =
    fullName.trim() ||
    user?.email?.split("@")[0] ||
    "AYANFE AI User";

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  if (loading) {
    return (
      <main className="tool-page">
        <div className="flex items-center justify-center gap-3 py-16">
          <LoaderCircle className="animate-spin" />
          <p>Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="tool-page">
        <div className="mx-auto max-w-xl rounded-2xl border p-6 sm:p-8">
          <UserRound className="mb-4 h-10 w-10" />
          <h1 className="text-2xl font-semibold">Your profile</h1>
          <p className="mt-3 text-muted-foreground">
            Please sign in to view and manage your AYANFE AI account.
          </p>
          <Button asChild className="mt-6">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="tool-page">
      <div className="mx-auto w-full max-w-3xl">
        <span className="welcome-eyebrow">YOUR PERSONAL SPACE</span>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          My Profile
        </h1>

        <p className="tool-description">
          Manage your identity and keep your account secure.
        </p>

        {message && (
          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="break-words">{errorMessage}</p>
          </div>
        )}

        <section className="mt-8 rounded-2xl border p-5 sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <p className="break-all text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck size={17} />
                Email verification
              </div>
              <p className="mt-2 font-medium">
                {user.email_confirmed_at
                  ? "Email verified"
                  : "Email not verified"}
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={17} />
                Member since
              </div>
              <p className="mt-2 font-medium">{joinedDate}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <UserRound className="h-5 w-5" />
            <div>
              <h2 className="text-lg font-semibold">Personal information</h2>
              <p className="text-sm text-muted-foreground">
                Update the name displayed on your account.
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium"
              >
                Display name
              </label>
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                maxLength={80}
                required
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                <Mail size={18} className="shrink-0 text-muted-foreground" />
                <span className="break-all text-sm">{user.email}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Your email is shown here. Email changing is not enabled on this
                page yet.
              </p>
            </div>

            <Button type="submit" disabled={savingName}>
              {savingName ? (
                <LoaderCircle className="mr-2 animate-spin" size={18} />
              ) : (
                <Save className="mr-2" size={18} />
              )}
              Save profile
            </Button>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <LockKeyhole className="h-5 w-5" />
            <div>
              <h2 className="text-lg font-semibold">Change password</h2>
              <p className="text-sm text-muted-foreground">
                Choose a strong password with at least 8 characters.
              </p>
            </div>
          </div>

          <form onSubmit={changePassword} className="space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter a new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter the new password again"
              />
            </div>

            <Button type="submit" disabled={savingPassword}>
              {savingPassword ? (
                <LoaderCircle className="mr-2 animate-spin" size={18} />
              ) : (
                <LockKeyhole className="mr-2" size={18} />
              )}
              Update password
            </Button>
          </form>
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          AYANFE AI · Ayanfe Innovation Labs Limited
        </p>
      </div>
    </main>
  );
}
