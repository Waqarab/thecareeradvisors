import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { admin } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-tca_session" : "tca_session";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
const FIVE_DAYS_SECONDS = 5 * 24 * 60 * 60;

export async function POST(req: Request) {
  try {

    if (Number(req.headers.get("content-length") || 0) > 20000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const decoded = await admin.auth().verifyIdToken(idToken);
    
    if (!decoded.email || (decoded.email !== SUPER_ADMIN_EMAIL && !decoded.admin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });

    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: sessionCookie,
      maxAge: FIVE_DAYS_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[SESSION ERROR]", error);
    return NextResponse.json({
      error: "Internal Error",
      detail: error?.message || String(error),
      code: error?.code || "unknown",
    }, { status: 401 });
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
