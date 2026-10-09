import type { Route } from "next";
import { redirect as nextRedirect } from "next/navigation";
import type { AppHref } from "@/i18n/paths";

type RedirectType = NonNullable<Parameters<typeof nextRedirect>[1]>;

export function redirect(href: AppHref, type?: RedirectType): never {
  return nextRedirect(href as Route, type);
}
