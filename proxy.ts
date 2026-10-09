import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth/server";

const LOGIN_URL = "/auth/sign-in";
const HOME_URL = "/journal";
const SIGNED_OUT_ONLY = new Set(["/", LOGIN_URL, "/auth/sign-up"]);

const authMiddleware = auth.middleware({ loginUrl: LOGIN_URL });
const handleI18nRouting = createMiddleware(routing);

const isLoginRedirect = (response: Response) =>
  response.headers.get("location")?.includes(LOGIN_URL) ?? false;

const redirectSignedIn = async (request: NextRequest) => {
  const probe = new NextRequest(
    new URL(`${HOME_URL}${request.nextUrl.search}`, request.url),
    { headers: request.headers },
  );
  const response = await authMiddleware(probe);
  if (isLoginRedirect(response)) return null;
  if (response.headers.has("location")) return response;

  const toHome = NextResponse.redirect(new URL(HOME_URL, request.url));
  for (const cookie of response.headers.getSetCookie()) {
    toHome.headers.append("Set-Cookie", cookie);
  }
  return toHome;
};

function mergeAuthRequestHeaders(request: NextRequest, authResponse: Response) {
  const headers = new Headers(request.headers);
  const overridden = authResponse.headers
    .get("x-middleware-override-headers")
    ?.split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  for (const name of overridden ?? []) {
    const value = authResponse.headers.get(`x-middleware-request-${name}`);
    if (value === null) headers.delete(name);
    else headers.set(name, value);
  }

  return new NextRequest(request, { headers });
}

export default async function proxy(request: NextRequest) {
  const isSignedOutPage =
    request.method === "GET" && SIGNED_OUT_ONLY.has(request.nextUrl.pathname);
  if (isSignedOutPage) {
    const signedInRedirect = await redirectSignedIn(request);
    if (signedInRedirect) return signedInRedirect;
    return handleI18nRouting(request);
  }

  const isJournalPath =
    request.nextUrl.pathname === HOME_URL ||
    request.nextUrl.pathname.startsWith(`${HOME_URL}/`);
  if (!isJournalPath) return handleI18nRouting(request);

  const authResponse = await authMiddleware(request);
  if (authResponse.headers.has("location")) return authResponse;

  const response = handleI18nRouting(
    mergeAuthRequestHeaders(request, authResponse),
  );
  for (const cookie of authResponse.headers.getSetCookie()) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
