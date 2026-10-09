import Link from "next/link";
import { AuthModal } from "@/components/auth/auth-modal";
import { SignUpForm } from "@/components/auth/sign-up-form";

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
