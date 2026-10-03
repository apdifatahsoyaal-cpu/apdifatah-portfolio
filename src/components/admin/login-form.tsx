"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const router = useRouter();
  const [error, setError] = useState(initialError);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError("Unable to sign in. Check your email and password.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect to the sign-in service. Try again shortly.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl shadow-foreground/5 sm:p-8">
      <div className="mb-7 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <LockKeyhole aria-hidden="true" className="size-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Private area
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Admin sign in
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Sign in with your authorized portfolio account.
      </p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
        {error ? (
          <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="h-11 w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        Admin access is provisioned through Supabase. Public sign-up is disabled.
      </p>
    </div>
  );
}
