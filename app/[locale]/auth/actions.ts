"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { getActionLocale } from "@/i18n/action-locale";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/server";

export type AuthFormState = {
  error?: string;
  fields?: { email?: string; name?: string };
} | null;

export async function signInWithEmail(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "AuthActions",
  });
  const credentials = z.object({
    email: z.email(t("validEmail")),
    password: z.string().min(8, t("passwordLength")),
  });
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const fields = { email: String(formData.get("email") ?? "") };
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error:
        flat.formErrors[0] ??
        Object.values(flat.fieldErrors).flat()[0] ??
        t("checkDetails"),
      fields,
    };
  }

  const { error } = await auth.signIn.email(parsed.data);
  if (error) {
    return {
      error: t("signInError"),
      fields,
    };
  }
  redirect("/journal");
}

export async function signUpWithEmail(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "AuthActions",
  });
  const signUpInput = z.object({
    email: z.email(t("validEmail")),
    password: z.string().min(8, t("passwordLength")),
    name: z.string().trim().min(1, t("nameRequired")),
  });
  const parsed = signUpInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const fields = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error:
        flat.formErrors[0] ??
        Object.values(flat.fieldErrors).flat()[0] ??
        t("checkDetails"),
      fields,
    };
  }

  const { error } = await auth.signUp.email(parsed.data);
  if (error) {
    return {
      error: error.message ?? t("signUpError"),
      fields,
    };
  }
  redirect("/journal");
}

export async function signOut(): Promise<void> {
  await auth.signOut();
  redirect("/");
}
