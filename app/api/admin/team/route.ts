import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import type { Auth } from "firebase-admin/auth";
import { admin } from "@/lib/firebase-admin";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

import { requireSuperAdmin, getClientIp, rateLimitByIp } from "@/lib/api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getAllSubAdmins(auth: Auth) {
  const subAdmins: Array<{
    uid: string;
    email: string | undefined;
    createdAt: string;
    canWrite: boolean;
  }> = [];
  let pageToken: string | undefined = undefined;
  do {
    const listUsersResult = await auth.listUsers(1000, pageToken);
    const users = listUsersResult.users;
    for (const u of users) {
      if (u.email === SUPER_ADMIN_EMAIL) continue;
      if (u.customClaims?.admin === true) {
        subAdmins.push({
          uid: u.uid,
          email: u.email,
          createdAt: u.metadata.creationTime,
          canWrite: u.customClaims?.canWrite === true
        });
      }
    }
    pageToken = listUsersResult.pageToken;
  } while (pageToken);
  return subAdmins;
}

export async function POST(req: NextRequest) {
  try {
    const authSession = await requireSuperAdmin(req);
    if (authSession instanceof NextResponse) return authSession;

    const ip = getClientIp(req);
    const rl = await rateLimitByIp.check(ip, "admin_team_write_1min", 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute." }, 
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }
    await rateLimitByIp.commit(ip, "admin_team_write_1min", 60 * 1000);

    const auth = getAuth();

    // 3. PROCEED WITH TEAM CREATION
    const { email, password, canWrite, uid } = await req.json();

    // Toggle Write Access
    if (uid && typeof canWrite === "boolean" && !email && !password) {
      try {
        const existingUser = await auth.getUser(uid);
        if (existingUser.email === SUPER_ADMIN_EMAIL) {
          return NextResponse.json({ error: "Cannot modify super admin from this panel." }, { status: 403 });
        }
        
        const currentCanWrite = existingUser.customClaims?.canWrite === true;
        if (currentCanWrite === canWrite) {
          return NextResponse.json({ message: "No change." });
        }
        
        await auth.setCustomUserClaims(uid, { admin: true, canWrite: canWrite });
        await auth.revokeRefreshTokens(uid);
        
        await admin.database().ref(`admin_revocations/${uid}`).set({
          revokedAt: Date.now(),
          reason: "permissions_changed"
        });
        
        return NextResponse.json({ message: "Permissions updated successfully!" });
      } catch (error) {
        return NextResponse.json({ error: "User not found or error updating." }, { status: 400 });
      }
    }

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid data. Password must be at least 8 characters." }, { status: 400 });
    }

    if (email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Cannot modify super admin from this panel." }, { status: 403 });
    }
    
    let existingUser;
    try {
      existingUser = await auth.getUserByEmail(email);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code !== 'auth/user-not-found') {
        throw e;
      }
    }

    const subAdmins = await getAllSubAdmins(auth);

    if (!existingUser && subAdmins.length >= 3) {
      return NextResponse.json({ error: "Maximum limit of 3 team members reached." }, { status: 403 });
    }

    if (existingUser) {
      if (existingUser.customClaims?.admin !== true && subAdmins.length >= 3) {
        return NextResponse.json({ error: "Maximum limit of 3 team members reached." }, { status: 403 });
      }
      await auth.updateUser(existingUser.uid, { password });
      const resolvedCanWrite =
        typeof canWrite === "boolean"
          ? canWrite
          : existingUser.customClaims?.canWrite === true;
          
      // Check if canWrite permission actually changed
      const permissionChanged = existingUser.customClaims?.canWrite !== resolvedCanWrite;
      
      await auth.setCustomUserClaims(existingUser.uid, { admin: true, canWrite: resolvedCanWrite });
      
      // If permissions changed, revoke refresh tokens to force re-authentication and update claims
      if (permissionChanged) {
        await auth.revokeRefreshTokens(existingUser.uid);
        await admin.database().ref(`admin_revocations/${existingUser.uid}`).set({
          revokedAt: Date.now(),
          reason: "permissions_changed"
        });
      }
      
      return NextResponse.json({ message: "Team member updated successfully!" });
    } else {
      const newUser = await auth.createUser({ email, password, emailVerified: true });
      await auth.setCustomUserClaims(newUser.uid, { admin: true, canWrite: Boolean(canWrite) });
      return NextResponse.json({ message: "New team member created successfully!" });
    }

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Server Error or Invalid Token" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authSession = await requireSuperAdmin(req);
    if (authSession instanceof NextResponse) return authSession;

    const ip = getClientIp(req);
    const rl = await rateLimitByIp.check(ip, "admin_team_read_1min", 30, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute." }, 
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }
    await rateLimitByIp.commit(ip, "admin_team_read_1min", 60 * 1000);

    const auth = getAuth();
    const users = await getAllSubAdmins(auth);

    return NextResponse.json({ users });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authSession = await requireSuperAdmin(req);
    if (authSession instanceof NextResponse) return authSession;

    const ip = getClientIp(req);
    const rl = await rateLimitByIp.check(ip, "admin_team_write_1min", 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute." }, 
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }
    await rateLimitByIp.commit(ip, "admin_team_write_1min", 60 * 1000);

    const { uid } = await req.json();
    if (!uid) {
      return NextResponse.json({ error: "UID required." }, { status: 400 });
    }

    const auth = getAuth();
    await auth.revokeRefreshTokens(uid); // Ensure all sessions are instantly invalidated
    await auth.deleteUser(uid);

    await admin.database().ref(`admin_revocations/${uid}`).set({
      revokedAt: Date.now(),
      reason: "account_deleted"
    });

    return NextResponse.json({ message: "Team member removed." });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}