import type { Metadata } from "next";
import Link from "next/link";
import { AuthModal } from "@/components/auth/auth-modal";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Dreamnal and pick up your dream journal where the night left off.",
};

export default function SignInModal() {
  return (
    <AuthModal
      title="Welcome back."
      lead="Pick up right where the night left off."
      footer={
        <>
          New here?{" "}
          <Link
            href="/auth/sign-up"
            replace
            scroll={false}
            className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
          >
            Start your journal
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthModal>
  );
}
