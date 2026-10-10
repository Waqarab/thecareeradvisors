import { NextResponse } from "next/server";
import { requireSuperAdmin, getClientIp, rateLimitByIp } from "@/lib/api-auth";
import { admin } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let requestUid = "unknown";
  try {
    const authResult = await requireSuperAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const ip = getClientIp(req);
    const rl = await rateLimitByIp.check(ip, "admin_revoke_1min", 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }
    await rateLimitByIp.commit(ip, "admin_revoke_1min", 60 * 1000);

    const body = await req.json();
    const uid = body.uid;
    requestUid = uid || "unknown";
    
    if (!uid || typeof uid !== "string") {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    if (uid === (authResult as any).uid) {
      return NextResponse.json({ error: "Cannot revoke your own session" }, { status: 400 });
    }

    try {
      const targetUser = await admin.auth().getUser(uid);
      if (targetUser.email === process.env.SUPER_ADMIN_EMAIL) {
        return NextResponse.json(
          { error: "Cannot revoke the super admin's sessions" },
          { status: 400 }
        );
      }
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        console.warn('[REVOKE] Target user not found in Firebase Auth', { uid, callerUid: (authResult as any).uid });
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      throw err;
    }

    await admin.auth().revokeRefreshTokens(uid);
    
    // Optional: write to RTDB
    await admin.database().ref(`admin_revocations/${uid}`).set({
      revokedAt: Date.now()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[REVOKE] Error while revoking', { uid: requestUid, error });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
