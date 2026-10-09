import "server-only";

import { cookies, headers } from "next/headers";
import { hasLocale } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export async function getActionLocale(): Promise<AppLocale> {
  const requestLocale = (await headers()).get("x-next-intl-locale");
  if (hasLocale(routing.locales, requestLocale)) return requestLocale;

  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  if (hasLocale(routing.locales, cookieLocale)) return cookieLocale;

  return routing.defaultLocale;
}
