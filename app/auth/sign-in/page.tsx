import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Dreamnal and pick up your dream journal where the night left off.",
};

export default function SignInPage() {
  return (
    <>
      <h1 className="font-display text-page-title tracking-display text-foreground">
        Welcome back.
      </h1>
      <p className="mt-3 text-lead text-muted-foreground">
        Pick up right where the night left off.
      </p>
      <div className="mt-8 rounded-lg border border-(--glass-border) bg-(--glass-bg) p-6 shadow-(--glass-shadow) backdrop-blur-xl">
        <SignInForm />
      </div>
      <p className="mt-6 text-sm/tight text-muted-foreground">
        New here?{" "}
        <a
          href="/auth/sign-up"
          className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
        >
          Start your journal
        </a>
      </p>
    </>
  );
}
