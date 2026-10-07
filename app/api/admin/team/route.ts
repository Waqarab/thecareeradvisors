import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

import { admin } from "@/lib/firebase-admin";
import { requireSuperAdmin, rateLimit, getOrCreateBrowserId } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  let finalSetCookie: string | null = null;
  try {
    const authSession = await requireSuperAdmin(req);
    if (authSession instanceof NextResponse) return authSession;

    const { id: browserId, setCookie } = getOrCreateBrowserId(req);
    finalSetCookie = setCookie;

    const rl = await rateLimit.check(browserId, "admin_team_1min", 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }
    await rateLimit.commit(browserId, "admin_team_1min", 60 * 1000);

    const auth = getAuth();

    // 3. PROCEED WITH TEAM CREATION
    const { email, password } = await req.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid data. Password must be at least 8 characters." }, { status: 400, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

    if (email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Cannot modify super admin from this panel." }, { status: 403, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }
    
    const listUsersResult = await auth.listUsers(10);
    const existingUsers = listUsersResult.users;
    const userExists = existingUsers.find(u => u.email === email);

    if (!userExists && existingUsers.length >= 4) {
      return NextResponse.json({ error: "Maximum limit of 3 team members reached." }, { status: 403, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

    if (userExists) {
      await auth.updateUser(userExists.uid, { password });
      return NextResponse.json({ message: "Password updated successfully!" }, { headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    } else {
      await auth.createUser({ email, password, emailVerified: true });
      return NextResponse.json({ message: "New team member created successfully!" }, { headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Server Error or Invalid Token" }, { status: 500, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
  }
}