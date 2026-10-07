import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-tca_session" : "tca_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const redirectUrl = new URL("/admin/login", request.url);
  redirectUrl.searchParams.set("redirect", pathname);

  if (!sessionCookie) {
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const verifyRes = await fetch(new URL("/api/auth/verify", request.url), {
      headers: { cookie: request.headers.get("cookie") || "" },
      cache: "no-store",
    });

    if (verifyRes.ok) {
      const data = await verifyRes.json();
      if (data.valid) return NextResponse.next();
    }
  } catch (error) {
    console.error("Middleware fetch error", error);
  }

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

export const config = {
  matcher: ["/admin/:path*"],
};
