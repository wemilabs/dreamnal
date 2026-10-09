import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "@/components/auth/sign-in-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return {
    title: t("signIn"),
    description: t("signInMetadataDescription"),
  };
}

export default async function SignInPage() {
  const t = await getTranslations("Auth");
  return (
    <>
      <h1 className="font-display text-page-title tracking-display text-foreground">
        {t("signInTitle")}
      </h1>
      <p className="mt-3 text-lead text-muted-foreground">
        {t("signInDescription")}
      </p>
      <div className="mt-8 rounded-lg border border-(--glass-border) bg-(--glass-bg) p-6 shadow-(--glass-shadow) backdrop-blur-xl">
        <SignInForm />
      </div>
      <p className="mt-6 text-sm/tight text-muted-foreground">
        {t("newHere")}{" "}
        <a
          href="/auth/sign-up"
          className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
        >
          {t("startJournal")}
        </a>
      </p>
    </>
  );
}
