import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { admin } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-tca_session" : "tca_session";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ valid: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);

    if (!decoded.email || decoded.email.toLowerCase() !== (SUPER_ADMIN_EMAIL || "").toLowerCase()) {
      return NextResponse.json({ valid: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json({ valid: true, email: decoded.email }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error("Session verification error", error);
    return NextResponse.json({ valid: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
}
