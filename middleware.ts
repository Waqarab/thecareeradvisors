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

function getCspHeader(nonce: string) {
  const isDev = process.env.NODE_ENV !== "production";
  
  const scriptSrc = isDev
    ? `'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://vercel.live https://*.firebaseio.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://vercel.live https://*.firebaseio.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`;

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
    "font-src 'self' https://api.fontshare.com https://cdn.fontshare.com https://vercel.live https://fonts.gstatic.com",
    "img-src 'self' data: https://res.cloudinary.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://i.pravatar.cc https://cdn.vectorstock.com https://www.transparenttextures.com https://upload.wikimedia.org https://vercel.com",
    "media-src 'self' https://res.cloudinary.com https://videos.pexels.com",
    "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://accounts.google.com https://apis.google.com https://vercel.live wss://ws-us3.pusher.com https://www.google.com/recaptcha/",
    "frame-src 'self' https://maps.google.com https://www.google.com/maps/ https://*.firebaseapp.com https://thecareer-advisors.firebaseapp.com https://accounts.google.com https://apis.google.com https://content.googleapis.com https://vercel.live https://*.firebaseio.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function redirectToLogin(request: NextRequest, csp: string): NextResponse {
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
  
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export async function middleware(request: NextRequest) {
  // 1. Generate edge-compatible nonce
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));
  const csp = getCspHeader(nonce);

  // 2. Attach nonce and CSP for Next.js Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // 3. Prepare response object with injected request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // 4. Attach CSP to the outgoing response
  response.headers.set("Content-Security-Policy", csp);

  // 5. Authentication logic for admin routes
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return response;
    }

    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return redirectToLogin(request, csp);
    }

    let payload: SessionPayload;
    try {
      payload = await verifySessionCookieEdge(sessionCookie);
    } catch {
      return redirectToLogin(request, csp);
    }

    if (!isAdminPayload(payload, SUPER_ADMIN_EMAIL)) {
      return redirectToLogin(request, csp);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|mjs|woff|woff2|ttf|otf|mp3|mp4|webm|json|xml|txt|pdf|webmanifest)$).*)'
  ],
};
