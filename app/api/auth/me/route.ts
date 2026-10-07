import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
  if (!SUPER_ADMIN_EMAIL) {
    return NextResponse.json(
      { role: "unknown", email: null },
      { status: 500 }
    );
  }

  // Read session cookie using the same logic as middleware
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieName = process.env.NODE_ENV === "production"
    ? "__Host-tca_session"
    : "tca_session";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`)
  );
  const sessionCookie = match ? match[1] : null;

  if (!sessionCookie) {
    return NextResponse.json(
      { role: "anonymous" },
      { status: 401 }
    );
  }

  try {
    const { admin } = await import("@/lib/firebase-admin");
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    const isSuper = decoded.email === SUPER_ADMIN_EMAIL;
    return NextResponse.json({
      role: isSuper ? "super-admin" : "admin",
      // Do NOT return the email here — that would defeat the purpose
    });
  } catch (err) {
    console.error("[ME] error verifying cookie:", err);
    return NextResponse.json({ role: "anonymous" }, { status: 401 });
  }
}
