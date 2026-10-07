import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <>
      <h1 className="font-display text-[44px] leading-tight tracking-display text-foreground">
        Welcome back.
      </h1>
      <p className="mt-3 text-lg leading-body text-muted-foreground">
        Pick up right where the night left off.
      </p>
      <div className="mt-8 rounded-lg border border-(--glass-border) bg-(--glass-bg) p-6 shadow-(--glass-shadow) backdrop-blur-xl">
        <SignInForm />
      </div>
      <p className="mt-6 text-sm/tight text-muted-foreground">
        New here?{" "}
        <Link
          href="/auth/sign-up"
          className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
        >
          Start your journal
        </Link>
      </p>
    </>
  );
}
