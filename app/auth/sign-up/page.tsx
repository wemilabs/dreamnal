import Link from "next/link";
import { SignUpForm } from "../../../components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <>
      <h1 className="font-display text-[44px] leading-tight tracking-display text-foreground">
        Start your journal.
      </h1>
      <p className="mt-3 text-lg leading-body text-muted-foreground">
        Thirty seconds now, years of dreams later.
      </p>
      <div className="mt-8 rounded-lg border border-(--glass-border) bg-(--glass-bg) p-6 shadow-(--glass-shadow) backdrop-blur-xl">
        <SignUpForm />
      </div>
      <p className="mt-6 text-sm/tight text-muted-foreground">
        Already keeping one?{" "}
        <Link
          href="/auth/sign-in"
          className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
