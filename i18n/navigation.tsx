"use client";

import type { Route } from "next";
import NextLink from "next/link";
import { useRouter as useNextRouter } from "next/navigation";
import type { ComponentProps } from "react";
import type { AppHref } from "@/i18n/paths";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: AppHref;
};

export function Link({ href, ...props }: LinkProps) {
  return <NextLink href={href as Route} {...props} />;
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
