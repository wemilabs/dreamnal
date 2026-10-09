import { getTranslations } from "next-intl/server";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Link } from "@/i18n/navigation";

export default async function SignUpPage() {
  const t = await getTranslations("Auth");
  return (
    <>
      <h1 className="font-display text-page-title tracking-display text-foreground">
        {t("signUpTitle")}
      </h1>
      <p className="mt-3 text-lead text-muted-foreground">
        {t("signUpDescription")}
      </p>
      <div className="mt-8 rounded-lg border border-(--glass-border) bg-(--glass-bg) p-6 shadow-(--glass-shadow) backdrop-blur-xl">
        <SignUpForm />
      </div>
      <p className="mt-6 text-sm/tight text-muted-foreground">
        {t("alreadyKeeping")}{" "}
        <Link
          href="/auth/sign-in"
          className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
        >
          {t("signIn")}
        </Link>
      </p>
    </>
  );
}
