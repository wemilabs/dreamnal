"use server";

import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { type AppLocale, routing } from "@/i18n/routing";

export async function setLocale(locale: AppLocale) {
  if (!hasLocale(routing.locales, locale)) return;

  (await cookies()).set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
}
