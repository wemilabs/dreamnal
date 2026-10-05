import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const LOGIN_URL = "/auth/sign-in";
const HOME_URL = "/journal";
const SIGNED_OUT_ONLY = new Set(["/", LOGIN_URL, "/auth/sign-up"]);

const authMiddleware = auth.middleware({ loginUrl: LOGIN_URL });

const isLoginRedirect = (response: Response) =>
  response.headers.get("location")?.includes(LOGIN_URL) ?? false;

const redirectSignedIn = async (request: NextRequest) => {
  const probe = new NextRequest(
    new URL(`${HOME_URL}${request.nextUrl.search}`, request.url),
    { headers: request.headers },
  );
  const response = await authMiddleware(probe);
  if (isLoginRedirect(response)) return NextResponse.next();
  if (response.headers.has("location")) return response;

  const toHome = NextResponse.redirect(new URL(HOME_URL, request.url));
  for (const cookie of response.headers.getSetCookie()) {
    toHome.headers.append("Set-Cookie", cookie);
  }
  return toHome;
};

export default function proxy(request: NextRequest) {
  const isSignedOutPage =
    request.method === "GET" && SIGNED_OUT_ONLY.has(request.nextUrl.pathname);
  return isSignedOutPage ? redirectSignedIn(request) : authMiddleware(request);
}

export const config = {
  matcher: ["/", "/auth/sign-in", "/auth/sign-up", "/journal/:path*"],
};
