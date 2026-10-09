import type { Metadata } from "next";
import Link from "next/link";
import { AuthModal } from "@/components/auth/auth-modal";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Start a private dream journal. Record a dream when you wake, and Dreamnal turns your voice into an entry you can edit and keep.",
};

export default function SignUpModal() {
  return (
    <AuthModal
      title="Start your journal."
      lead="Thirty seconds now, years of dreams later."
      footer={
        <>
          Already keeping one?{" "}
          <Link
            href="/auth/sign-in"
            replace
            scroll={false}
            className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthModal>
  );
}
