import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthModal } from "@/components/auth/auth-modal";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return {
    title: t("signIn"),
    description: t("signInMetadataDescription"),
  };
}

export default async function SignInModal() {
  const t = await getTranslations("Auth");
  return (
    <AuthModal
      title={t("signInTitle")}
      lead={t("signInDescription")}
      footer={
        <>
          {t("newHere")}{" "}
          <Link
            href="/auth/sign-up"
            replace
            scroll={false}
            className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
          >
            {t("startJournal")}
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthModal>
  );
}
