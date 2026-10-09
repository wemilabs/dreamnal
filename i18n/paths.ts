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
