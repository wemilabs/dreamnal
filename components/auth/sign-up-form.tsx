"use client";

import { useActionState } from "react";
import { signUpWithEmail } from "@/app/auth/actions";
import { GoogleButton } from "@/components/auth/google-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpWithEmail, null);

  return (
    <div className="flex flex-col gap-5">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="What should we call you?"
            key={state?.fields?.name}
            defaultValue={state?.fields?.name}
            className="h-10 rounded-lg bg-card/60"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@night.owls"
            key={state?.fields?.email}
            defaultValue={state?.fields?.email}
            className="h-10 rounded-lg bg-card/60"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="h-10 rounded-lg bg-card/60"
          />
        </div>
        {state?.error ? (
          <p role="alert" className="text-sm/tight text-rec">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="pressable mt-1 flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-control font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Creating your journal…" : "Create account"}
        </button>
      </form>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton />
    </div>
  );
}
