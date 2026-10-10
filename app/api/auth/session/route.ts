import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { admin } from "@/lib/firebase-admin";
import { getClientIp, rateLimitByIp, rateLimitByEmail, emailLockout } from "@/lib/api-auth";
import { maybeRunCleanup } from "@/lib/rate-limit-cleanup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-tca_session" : "tca_session";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_DAY_SECONDS = 24 * 60 * 60;

export async function POST(req: Request) {
  try {
    maybeRunCleanup();
    const ip = getClientIp(req);

    // Layer 1: 5 requests per minute per IP (burst protection)
    const ipMinute = await rateLimitByIp.check(ip, "auth_session_1min", 5, 60 * 1000);
    if (!ipMinute.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(ipMinute.retryAfter) } }
      );
    }
    await rateLimitByIp.commit(ip, "auth_session_1min", 60 * 1000);

    // Layer 2: 20 requests per hour per IP (sustained abuse protection)
    const ipHour = await rateLimitByIp.check(ip, "auth_session_1hour", 20, 60 * 60 * 1000);
    if (!ipHour.success) {
      return NextResponse.json(
        { error: "Too many attempts this hour. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipHour.retryAfter) } }
      );
    }
    await rateLimitByIp.commit(ip, "auth_session_1hour", 60 * 60 * 1000);

    if (Number(req.headers.get("content-length") || 0) > 20000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const decoded = await admin.auth().verifyIdToken(idToken, true);
    
    const email = decoded.email || "unknown-email";

    const emailLock = await emailLockout.check(email);
    if (emailLock.locked) {
      const minutes = Math.ceil(emailLock.retryAfter / 60);
      return NextResponse.json(
        {
          error: `Account temporarily locked due to repeated failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        },
        { status: 429, headers: { "Retry-After": String(emailLock.retryAfter) } }
      );
    }
    
    if (!decoded.email || (decoded.email !== SUPER_ADMIN_EMAIL && !decoded.admin)) {
      const failure = await emailLockout.recordFailure(email);
      if (failure.locked) {
        const minutes = Math.ceil(failure.retryAfter / 60);
        return NextResponse.json(
          {
            error: `Account temporarily locked due to repeated failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
          },
          { status: 429, headers: { "Retry-After": String(failure.retryAfter) } }
        );
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: ONE_DAY_MS });

    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: sessionCookie,
      maxAge: ONE_DAY_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    await emailLockout.reset(email);

    try {
      await admin.database().ref(`admin_revocations/${decoded.uid}`).remove();
    } catch (err) {
      console.error("[REVOCATION CLEAR ERROR]", err);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[SESSION ERROR]", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
  return NextResponse.json({ status: "ok" });
}
