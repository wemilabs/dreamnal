"use client";

import type { Route } from "next";
import NextLink from "next/link";
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";
import { hasLocale } from "next-intl";
import type { ComponentProps } from "react";
import type { AppHref } from "@/i18n/paths";
import { routing } from "@/i18n/routing";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: AppHref;
};

export function Link({ href, ...props }: LinkProps) {
  return <NextLink href={href as Route} {...props} />;
}

export function usePathname(): string {
  const pathname = useNextPathname();
  const [, first, ...rest] = pathname.split("/");
  return hasLocale(routing.locales, first) ? `/${rest.join("/")}` : pathname;
}

export function useRouter() {
  const router = useNextRouter();
  return {
    ...router,
    push: (href: AppHref) => router.push(href as Route),
    replace: (href: AppHref) => router.replace(href as Route),
    prefetch: (href: AppHref) => router.prefetch(href as Route),
  };
}
