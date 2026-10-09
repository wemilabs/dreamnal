"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth/client";

export function GoogleButton() {
  const t = useTranslations("Auth");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const continueWithGoogle = () => {
    setError(null);
    startTransition(async () => {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/journal",
        newUserCallbackURL: "/journal",
      });
      if (error) {
        setError(t("googleError"));
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={pending}
        className="pressable flex w-full items-center justify-center rounded-full border border-border bg-card px-4 py-2.5 text-control font-medium text-foreground disabled:opacity-60"
      >
        {pending ? t("redirecting") : t("continueWithGoogle")}
      </button>
      {error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {error}
        </p>
      ) : null}
    </div>
  );
}
