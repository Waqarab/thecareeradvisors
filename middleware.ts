import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifySessionCookieEdge,
  isAdminPayload,
  type SessionPayload,
} from "@/lib/verify-session-edge";

const COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-tca_session" : "tca_session";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

function redirectToLogin(request: NextRequest): NextResponse {
  const redirectUrl = new URL("/admin/login", request.url);
  redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return redirectToLogin(request);
  }

  let payload: SessionPayload;
  try {
    payload = await verifySessionCookieEdge(sessionCookie);
  } catch {
    // Invalid signature, expired, wrong issuer/audience, malformed, etc.
    return redirectToLogin(request);
  }

  if (!isAdminPayload(payload, SUPER_ADMIN_EMAIL)) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
