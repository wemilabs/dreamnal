"use client";

import type { Route } from "next";
import NextLink from "next/link";
import {
  redirect as nextRedirect,
  useRouter as useNextRouter,
} from "next/navigation";
import type { ComponentProps } from "react";
import type { AppRoutes } from "@/.next/types/routes";

type Unprefixed<R> = R extends `/[locale]/[...${string}`
  ? never
  : R extends "/[locale]"
    ? "/"
    : R extends `/[locale]${infer P}`
      ? P
      : never;
type Pattern<P> = P extends `${infer A}[${string}]${infer B}`
  ? `${A}${string}${Pattern<B>}`
  : P;

export type AppPathname = Pattern<Unprefixed<AppRoutes>>;
export type AppHref = AppPathname | `${AppPathname}${"?" | "#"}${string}`;

type _NopeIsExcluded = "/nope" extends AppPathname ? false : true;
const _typeAssert: _NopeIsExcluded = true;
void _typeAssert;

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: AppHref;
};

export function Link({ href, ...props }: LinkProps) {
  return <NextLink href={href as Route} {...props} />;
}

export function redirect(href: AppHref): never {
  return nextRedirect(href as Route);
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
