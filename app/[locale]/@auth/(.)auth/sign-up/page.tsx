import { getTranslations } from "next-intl/server";
import { AuthModal } from "@/components/auth/auth-modal";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Link } from "@/i18n/navigation";

export default async function SignUpModal() {
  const t = await getTranslations("Auth");
  return (
    <AuthModal
      title={t("signUpTitle")}
      lead={t("signUpDescription")}
      footer={
        <>
          {t("alreadyKeeping")}{" "}
          <Link
            href="/auth/sign-in"
            replace
            scroll={false}
            className="pressable font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
          >
            {t("signIn")}
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthModal>
  );
}
